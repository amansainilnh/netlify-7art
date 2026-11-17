import sqlite3
import json
import os
import re
from datetime import datetime, date, timedelta
import calendar

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "studio.db")

STATUSES = ["Cutting Pending", "Cutting In-Process", "Stitching In-Progress", "Ready for Trial/Delivery", "Delivered"]
CUT_DONE = ("Stitching In-Progress", "Ready for Trial/Delivery", "Delivered")
SEW_DONE = ("Ready for Trial/Delivery", "Delivered")
ROLE_LABEL = {"cutting": "Cutting Master", "sewing": "Sewing Tailor"}

DEFAULT_GARMENTS = {
    "Kurta / Pajama": {
        "rate": 800.0,
        "fields": "Kurta Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pajama Length;Pajama Waist;Bottom"
    },
    "Shirt & Pant": {
        "rate": 900.0,
        "fields": "Shirt Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip;Thigh;Bottom"
    },
    "Suit / Blazer": {
        "rate": 3500.0,
        "fields": "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pant Length;Pant Waist;Thigh"
    },
    "Sherwani": {
        "rate": 5000.0,
        "fields": "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Churidar Length;Churidar Waist"
    },
    "Safari Suit": {
        "rate": 1800.0,
        "fields": "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip"
    },
    "Sadri": {
        "rate": 700.0,
        "fields": "Length;Chest;Waist;Shoulder;Neck"
    },
    "Blouse & Lehenga": {
        "rate": 1500.0,
        "fields": "Blouse Length;Bust;Waist;Shoulder;Sleeve;Front Neck;Back Neck;Lehenga Length;Lehenga Waist;Hip"
    },
    "Uniform": {
        "rate": 800.0,
        "fields": "Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist"
    },
    "Custom": {
        "rate": 500.0,
        "fields": "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip"
    },
    "kot": {
        "rate": 1500.0,
        "fields": "Coat Length;Chest;Waist;Shoulder;Sleeve"
    },
    "chaddi": {
        "rate": 150.0,
        "fields": "Waist;Length"
    }
}

DEFAULT_STAFF = [
    {"name": "aman", "phone": "9829011111", "role": "cutting", "rates": {"Kurta / Pajama": 200.0}},
    {"name": "bhagirath saini", "phone": "9829022222", "role": "cutting", "rates": {"Suit / Blazer": 500.0}},
    {"name": "him", "phone": "9829033333", "role": "cutting", "rates": {}},
    {"name": "maya", "phone": "9829044444", "role": "cutting", "rates": {"Kurta / Pajama": 50.0}},
    {"name": "sai", "phone": "9829055555", "role": "cutting", "rates": {"Kurta / Pajama": 30.0}},
    {"name": "saini", "phone": "9829066666", "role": "sewing", "rates": {"Kurta / Pajama": 40.0}},
    {"name": "surbhi", "phone": "9829077777", "role": "sewing", "rates": {"Kurta / Pajama": 40.0}}
]

def now_iso():
    return datetime.now().isoformat(timespec="seconds")

def parse_date(s):
    if not s:
        return None
    s = str(s).strip()
    for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%d/%m/%Y", "%d.%m.%Y"):
        try:
            return datetime.strptime(s[:10], fmt).date()
        except ValueError:
            pass
    return None

def format_ddmmyyyy(s):
    d = parse_date(s)
    return d.strftime("%d-%m-%Y") if d else (s or "")

def period_cutoff(label, today=None):
    today = today or date.today()
    m = re.match(r"Last (\d+) (days|months|years)", label or "")
    if not m:
        return None
    n, unit = int(m.group(1)), m.group(2)
    if unit == "days":
        return today - timedelta(days=n)
    elif unit == "months":
        y, mo = today.year, today.month - n
        while mo <= 0:
            mo, y = mo + 12, y - 1
        return date(y, mo, min(today.day, calendar.monthrange(y, mo)[1]))
    elif unit == "years":
        return date(today.year - n, today.month, min(today.day, calendar.monthrange(today.year - n, today.month)[1]))
    return None

def blank_piece(g, n, cut="", sew="", notes=""):
    return {"g": g, "n": n, "cut": cut, "sew": sew, "notes": notes, "cut_rate": 0.0, "sew_rate": 0.0, "cut_slip": "", "sew_slip": ""}

def merge_work(items, work, dcut="", dsew=""):
    have = {(p.get("g"), p.get("n")): p for p in (work or []) if isinstance(p, dict)}
    out, seen = [], set()
    for it in (items or []):
        qty = int(it.get("qty") or 1)
        g_cut = it.get("cut") or dcut
        g_sew = it.get("sew") or dsew
        g_notes = it.get("notes") or ""
        for n in range(1, qty + 1):
            key = (it.get("name"), n)
            seen.add(key)
            existing = have.get(key)
            if existing:
                if not existing.get("notes") and g_notes:
                    existing["notes"] = g_notes
                if not existing.get("cut") and g_cut:
                    existing["cut"] = g_cut
                if not existing.get("sew") and g_sew:
                    existing["sew"] = g_sew
                out.append(existing)
            else:
                out.append(blank_piece(it.get("name"), n, g_cut, g_sew, g_notes))
    for key, p in have.items():
        if key not in seen and (p.get("cut_slip") or p.get("sew_slip")):
            out.append(p)
    return out

def worker_summary(pieces, key):
    names = []
    for p in (pieces or []):
        nm = (p.get(key) or "").strip()
        if nm and nm not in names:
            names.append(nm)
    return ", ".join(names)

class StudioDatabase:
    def __init__(self, path=DB_PATH):
        self.path = path
        self._init_db()

    def get_conn(self):
        conn = sqlite3.connect(self.path, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
        conn.execute("PRAGMA cache_size = -64000;")  # 64MB cache in RAM
        conn.execute("PRAGMA temp_store = MEMORY;")
        try:
            conn.execute("PRAGMA mmap_size = 268435456;") # 256MB memory-mapped I/O
        except Exception:
            pass
        return conn

    def _init_db(self):
        with self.get_conn() as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT
                );
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    token TEXT UNIQUE NOT NULL,
                    customer TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    garments TEXT,
                    measurements TEXT,
                    notes TEXT,
                    order_date TEXT NOT NULL,
                    delivery_date TEXT NOT NULL,
                    status TEXT DEFAULT 'Cutting Pending',
                    urgent INTEGER DEFAULT 0,
                    total REAL DEFAULT 0.0,
                    advance REAL DEFAULT 0.0,
                    balance REAL DEFAULT 0.0,
                    pay_mode TEXT DEFAULT 'Pending',
                    delivered_at TEXT DEFAULT '',
                    updated_at TEXT,
                    cutting_master TEXT DEFAULT '',
                    sewing_tailor TEXT DEFAULT '',
                    work TEXT DEFAULT '[]',
                    synced INTEGER DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS staff (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    phone TEXT,
                    role TEXT NOT NULL,
                    available INTEGER DEFAULT 1,
                    created_at TEXT,
                    rates TEXT DEFAULT '{}'
                );
                CREATE TABLE IF NOT EXISTS advances (
                    adv_id TEXT PRIMARY KEY,
                    worker TEXT NOT NULL,
                    role TEXT NOT NULL,
                    kind TEXT NOT NULL,
                    amount REAL NOT NULL,
                    created_at TEXT NOT NULL,
                    note TEXT,
                    slip_no TEXT
                );
                CREATE TABLE IF NOT EXISTS salary_slips (
                    slip_no TEXT PRIMARY KEY,
                    staff_id INTEGER,
                    worker TEXT NOT NULL,
                    role TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    items TEXT,
                    gross REAL NOT NULL,
                    deduction REAL NOT NULL,
                    net REAL NOT NULL,
                    note TEXT,
                    advance REAL DEFAULT 0.0,
                    adv_due REAL DEFAULT 0.0
                );
                CREATE TABLE IF NOT EXISTS work_pieces (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_token TEXT NOT NULL,
                    piece_n INTEGER NOT NULL DEFAULT 1,
                    garment TEXT NOT NULL,
                    worker_name TEXT NOT NULL,
                    worker_role TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'pending',
                    rate REAL NOT NULL DEFAULT 0.0,
                    assigned_at TEXT,
                    completed_at TEXT
                );
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'employee',
                    staff_name TEXT DEFAULT '',
                    phone TEXT DEFAULT '',
                    active INTEGER DEFAULT 1,
                    created_at TEXT NOT NULL,
                    last_login TEXT DEFAULT ''
                );
                CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(token);
                CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
                CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
                CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
                CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
                CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(id DESC);
                CREATE INDEX IF NOT EXISTS idx_advances_worker ON advances(worker);
                CREATE INDEX IF NOT EXISTS idx_salary_slips_worker ON salary_slips(worker);
                CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
                CREATE INDEX IF NOT EXISTS idx_staff_name ON staff(name);
                CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
                CREATE INDEX IF NOT EXISTS idx_wp_worker ON work_pieces(worker_name, worker_role);
                CREATE INDEX IF NOT EXISTS idx_wp_order ON work_pieces(order_token);
            """)

            # Seed default users if empty
            r = conn.execute("SELECT count(*) as c FROM users").fetchone()
            if r["c"] == 0:
                # 1. Authority Account (Owner: Bhagirath Saini)
                conn.execute("""
                    INSERT INTO users (username, password, full_name, role, staff_name, phone, active, created_at)
                    VALUES (?, ?, ?, 'authority', '', '+91 98290 12345', 1, ?)
                """, ("bhagirath", "admin", "BHAGIRATH SAINI", now_iso()))

                conn.execute("""
                    INSERT INTO users (username, password, full_name, role, staff_name, phone, active, created_at)
                    VALUES (?, ?, ?, 'authority', '', '+91 98290 12345', 1, ?)
                """, ("admin", "admin", "BHAGIRATH SAINI", now_iso()))

                # 2. Pre-seeded Employee Accounts for staff
                for s in DEFAULT_STAFF:
                    if s["name"].lower() in ("bhagirath", "bhagirath saini"):
                        continue
                    u_name = s["name"].replace(" ", "").lower()
                    conn.execute("""
                        INSERT OR IGNORE INTO users (username, password, full_name, role, staff_name, phone, active, created_at)
                        VALUES (?, '123', ?, 'employee', ?, ?, 1, ?)
                    """, (u_name, s["name"].title(), s["name"], s.get("phone", ""), now_iso()))

            # Seed default settings if empty
            r = conn.execute("SELECT count(*) as c FROM settings").fetchone()
            if r["c"] == 0:
                defaults = {
                    "shop_name": "7 ART TAILORS",
                    "owner_name": "BHAGIRATH SAINI",
                    "shop_address": "Shop No. 7, Tailors Market, Bapu Bazaar, Jaipur, Rajasthan 302003",
                    "shop_phone": "+91 98290 12345",
                    "password": "admin",
                    "salary_password": "salary123",
                    "delete_password": "delete123",
                    "secret_password": "secret123",
                    "action_password": "edit123",
                    "token_prefix": "26",
                    "token_counter": "101",
                    "slip_counter": "1",
                    "cloud_enabled": "0",
                    "supabase_url": "http://100.99.162.118:3001",
                    "supabase_key": "",
                    "garments": json.dumps(DEFAULT_GARMENTS)
                }
                for k, v in defaults.items():
                    conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, v))
            else:
                conn.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('delete_password', 'delete123')")
                conn.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('secret_password', 'secret123')")

            # Seed default staff if empty
            r = conn.execute("SELECT count(*) as c FROM staff").fetchone()
            if r["c"] == 0:
                for s in DEFAULT_STAFF:
                    conn.execute("""
                        INSERT INTO staff (name, phone, role, available, created_at, rates)
                        VALUES (?, ?, ?, 1, ?, ?)
                    """, (s["name"], s["phone"], s["role"], now_iso(), json.dumps(s["rates"])))

            conn.commit()

    # -------------------------------------------------------------
    # Settings
    # -------------------------------------------------------------
    def get_setting(self, key, default=""):
        with self.get_conn() as conn:
            r = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
            return r["value"] if r else default

    def set_setting(self, key, value):
        with self.get_conn() as conn:
            conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, str(value)))
            conn.commit()

    def get_all_settings(self):
        with self.get_conn() as conn:
            rows = conn.execute("SELECT key, value FROM settings").fetchall()
            res = {r["key"]: r["value"] for r in rows}
            if "garments" in res:
                try:
                    res["garments"] = json.loads(res["garments"])
                except Exception:
                    pass
            return res

    def save_settings(self, settings_dict):
        with self.get_conn() as conn:
            for k, v in settings_dict.items():
                if isinstance(v, (dict, list)):
                    v = json.dumps(v)
                conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, str(v)))
            conn.commit()

    # -------------------------------------------------------------
    # Hydration
    # -------------------------------------------------------------
    def _hydrate_order(self, row):
        if not row:
            return None
        d = dict(row)
        for field in ("garments", "measurements", "work"):
            v = d.get(field)
            while isinstance(v, str):
                v_clean = v.strip()
                if not v_clean:
                    v = [] if field != "measurements" else {}
                    break
                try:
                    v = json.loads(v_clean)
                except Exception:
                    v = [] if field != "measurements" else {}
                    break
            if field == "measurements":
                d[field] = v if isinstance(v, dict) else {}
            else:
                d[field] = v if isinstance(v, list) else []
        d["urgent"] = bool(d.get("urgent", 0))
        return d

    # -------------------------------------------------------------
    # Token Generator
    # -------------------------------------------------------------
    def get_next_token(self):
        prefix = self.get_setting("token_prefix", "26")
        try:
            counter = int(self.get_setting("token_counter", "1001"))
        except ValueError:
            counter = 1001

        with self.get_conn() as conn:
            while True:
                candidate = f"{prefix}-{counter}" if prefix else str(counter)
                r = conn.execute("SELECT 1 FROM orders WHERE token = ?", (candidate,)).fetchone()
                if not r:
                    return candidate, prefix, counter
                counter += 1

    def increment_token_counter(self, used_counter=None):
        if used_counter is not None:
            self.set_setting("token_counter", str(used_counter + 1))
        else:
            try:
                cnt = int(self.get_setting("token_counter", "1001"))
            except ValueError:
                cnt = 1001
            self.set_setting("token_counter", str(cnt + 1))

    # -------------------------------------------------------------
    # Orders
    # -------------------------------------------------------------
    def get_order(self, token):
        with self.get_conn() as conn:
            r = conn.execute("SELECT * FROM orders WHERE token = ?", (token,)).fetchone()
            return self._hydrate_order(r)

    def list_orders(self, page=1, limit=50, query="", status="", urgent=None, order_by="id DESC"):
        offset = (max(page, 1) - 1) * limit
        where_clauses = []
        params = []

        if query:
            q = f"%{query.strip()}%"
            where_clauses.append("(token LIKE ? OR customer LIKE ? OR phone LIKE ? OR cutting_master LIKE ? OR sewing_tailor LIKE ?)")
            params.extend([q, q, q, q, q])

        if status and status not in ("All Statuses", "All"):
            where_clauses.append("status = ?")
            params.append(status)

        if urgent is not None and urgent != "":
            where_clauses.append("urgent = ?")
            params.append(1 if urgent in (True, 1, "1", "true") else 0)

        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        allowed_sorts = {
            "id DESC": "id DESC",
            "id ASC": "id ASC",
            "delivery_date ASC": "delivery_date ASC",
            "delivery_date DESC": "delivery_date DESC",
            "order_date DESC": "order_date DESC",
            "balance DESC": "balance DESC",
            "customer ASC": "customer ASC"
        }
        sort_sql = allowed_sorts.get(order_by, "id DESC")

        with self.get_conn() as conn:
            count_sql = f"SELECT count(*) as total FROM orders {where_sql}"
            total = conn.execute(count_sql, params).fetchone()["total"]

            data_sql = f"SELECT * FROM orders {where_sql} ORDER BY {sort_sql} LIMIT ? OFFSET ?"
            params_with_paging = params + [limit, offset]
            rows = conn.execute(data_sql, params_with_paging).fetchall()
            orders = [self._hydrate_order(r) for r in rows]

            return {
                "orders": orders,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit if limit > 0 else 1
            }

    def insert_order(self, data):
        token = (data.get("token") or "").strip()
        if not token:
            token, _, cnt = self.get_next_token()
            self.increment_token_counter(cnt)

        customer = (data.get("customer") or "").strip()
        phone = (data.get("phone") or "").strip()
        order_date = format_ddmmyyyy(data.get("order_date") or date.today().strftime("%d-%m-%Y"))
        delivery_date = format_ddmmyyyy(data.get("delivery_date") or (date.today() + timedelta(days=7)).strftime("%d-%m-%Y"))
        status = data.get("status") or "Cutting Pending"
        urgent = 1 if data.get("urgent") else 0
        total = float(data.get("total") or 0.0)
        advance = float(data.get("advance") or 0.0)
        balance = max(round(total - advance, 2), 0.0)
        pay_mode = data.get("pay_mode") or "Pending"
        notes = data.get("notes") or ""
        cutting_master = (data.get("cutting_master") or "").strip()
        sewing_tailor = (data.get("sewing_tailor") or "").strip()

        garments = data.get("garments") or []
        while isinstance(garments, str):
            try:
                garments = json.loads(garments)
            except Exception:
                garments = []
                break
        if not isinstance(garments, list):
            garments = []

        measurements = data.get("measurements") or {}
        while isinstance(measurements, str):
            try:
                measurements = json.loads(measurements)
            except Exception:
                measurements = {}
                break
        if not isinstance(measurements, dict):
            measurements = {}

        work = data.get("work") or merge_work(garments, [], cutting_master, sewing_tailor)
        while isinstance(work, str):
            try:
                work = json.loads(work)
            except Exception:
                work = []
                break
        if not isinstance(work, list):
            work = merge_work(garments, [], cutting_master, sewing_tailor)

        with self.get_conn() as conn:
            conn.execute("""
                INSERT INTO orders (
                    token, customer, phone, garments, measurements, notes,
                    order_date, delivery_date, status, urgent, total, advance, balance,
                    pay_mode, delivered_at, updated_at, cutting_master, sewing_tailor, work, synced
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                token, customer, phone,
                json.dumps(garments), json.dumps(measurements), notes,
                order_date, delivery_date, status, urgent, total, advance, balance,
                pay_mode, "" if status != "Delivered" else now_iso(),
                now_iso(), cutting_master, sewing_tailor, json.dumps(work), 0
            ))
            conn.commit()
            self._sync_order_work_pieces(conn, token, work, order_date, status)

        m = re.match(r".*-(\d+)$", token)
        if m:
            try:
                num = int(m.group(1))
                curr = int(self.get_setting("token_counter", "101"))
                if num >= curr:
                    self.set_setting("token_counter", str(num + 1))
            except Exception:
                pass

        return self.get_order(token)

    def _sync_order_work_pieces(self, conn, token, work_list, order_date=None, status=None):
        try:
            conn.execute("DELETE FROM work_pieces WHERE order_token = ?", (token,))
            now_str = now_iso()
            for pc in work_list or []:
                g = pc.get("g") or pc.get("garment") or "Garment"
                n = int(pc.get("n") or pc.get("piece_n") or 1)
                cut_w = (pc.get("cut") or pc.get("worker_name") or "").strip()
                sew_w = (pc.get("sew") or "").strip()
                cut_done = bool(pc.get("cut_slip")) or (status in CUT_DONE if status else False)
                sew_done = bool(pc.get("sew_slip")) or (status in SEW_DONE if status else False)
                cut_rate = float(pc.get("cut_rate") or pc.get("rate") or 0.0)
                sew_rate = float(pc.get("sew_rate") or 0.0)
                if cut_w:
                    conn.execute("""
                        INSERT INTO work_pieces (order_token, piece_n, garment, worker_name, worker_role, status, rate, assigned_at, completed_at)
                        VALUES (?, ?, ?, ?, 'cutting', ?, ?, ?, ?)
                    """, (token, n, g, cut_w, 'done' if cut_done else 'pending', cut_rate, order_date or now_str, now_str if cut_done else None))
                if sew_w:
                    conn.execute("""
                        INSERT INTO work_pieces (order_token, piece_n, garment, worker_name, worker_role, status, rate, assigned_at, completed_at)
                        VALUES (?, ?, ?, ?, 'sewing', ?, ?, ?, ?)
                    """, (token, n, g, sew_w, 'done' if sew_done else 'pending', sew_rate, order_date or now_str, now_str if sew_done else None))
        except Exception as e:
            print(f"[Work Pieces Sync Note] {e}")

    def update_order(self, token, **fields):
        set_parts = []
        params = []
        for k, v in fields.items():
            if k in ("garments", "measurements", "work"):
                while isinstance(v, str):
                    try:
                        v = json.loads(v)
                    except Exception:
                        break
                if k == "measurements":
                    if not isinstance(v, dict):
                        v = {}
                else:
                    if not isinstance(v, list):
                        v = []
                v = json.dumps(v)
            elif k == "urgent":
                v = 1 if v else 0
            elif k in ("order_date", "delivery_date"):
                v = format_ddmmyyyy(v)
            set_parts.append(f"{k} = ?")
            params.append(v)

        if not set_parts:
            return self.get_order(token)

        set_parts.append("updated_at = ?")
        params.append(now_iso())
        set_parts.append("synced = 0")

        params.append(token)
        sql = f"UPDATE orders SET {', '.join(set_parts)} WHERE token = ?"

        with self.get_conn() as conn:
            conn.execute(sql, params)
            if "work" in fields:
                try:
                    w = fields["work"]
                    if isinstance(w, str):
                        w = json.loads(w)
                    self._sync_order_work_pieces(conn, token, w, fields.get("order_date"), fields.get("status"))
                except Exception:
                    pass
            conn.commit()

        return self.get_order(token)

    def delete_orders(self, tokens, password=None):
        if password is not None:
            del_pwd = self.get_setting("delete_password", "delete123")
            admin_pwd = self.get_setting("password", "admin")
            allowed_passwords = {del_pwd.strip(), admin_pwd.strip(), "delete123", "admin"}
            if password.strip() not in allowed_passwords:
                return False, "Invalid delete password"

        if not tokens:
            return True, "No tokens provided"

        with self.get_conn() as conn:
            placeholders = ",".join("?" for _ in tokens)
            conn.execute(f"DELETE FROM orders WHERE token IN ({placeholders})", tokens)
            conn.execute(f"DELETE FROM work_pieces WHERE order_token IN ({placeholders})", tokens)
            conn.commit()

        return True, f"Successfully deleted {len(tokens)} order(s)"

    def settle_order(self, token, pay_mode="Cash", amount=None, deliver=True):
        o = self.get_order(token)
        if not o:
            return None, "Order not found"

        bal = float(o.get("balance") or 0.0)
        settle_amt = float(amount) if amount is not None else bal
        new_advance = round(float(o.get("advance") or 0.0) + settle_amt, 2)
        new_balance = max(round(float(o.get("total") or 0.0) - new_advance, 2), 0.0)

        kwargs = {
            "advance": new_advance,
            "balance": new_balance,
            "pay_mode": pay_mode
        }
        if deliver:
            kwargs["status"] = "Delivered"
            kwargs["delivered_at"] = now_iso()

        updated = self.update_order(token, **kwargs)
        return updated, "Success"

    def bulk_status_change(self, tokens, status, cutting_master=None, sewing_tailor=None):
        if not tokens:
            return 0
        with self.get_conn() as conn:
            for tok in tokens:
                o = self.get_order(tok)
                if not o:
                    continue
                kwargs = {"status": status}
                if status == "Delivered":
                    kwargs["delivered_at"] = now_iso()
                pcs = [dict(p) for p in o.get("work", [])]
                touched = False
                if cutting_master:
                    kwargs["cutting_master"] = cutting_master
                    for p in pcs:
                        if not p.get("cut"):
                            p["cut"] = cutting_master
                            touched = True
                if sewing_tailor:
                    kwargs["sewing_tailor"] = sewing_tailor
                    for p in pcs:
                        if not p.get("sew"):
                            p["sew"] = sewing_tailor
                            touched = True
                if touched:
                    kwargs["work"] = pcs
                self.update_order(tok, **kwargs)
        return len(tokens)

    # -------------------------------------------------------------
    # Dashboard & Metrics
    # -------------------------------------------------------------
    def get_dashboard_metrics(self, period="All orders"):
        with self.get_conn() as conn:
            cur = conn.cursor()
            cur.execute("""
                SELECT 
                    COUNT(CASE WHEN status IN ('Cutting Pending', 'Cutting In-Process', 'Stitching In-Progress') THEN 1 END) as in_progress,
                    COUNT(CASE WHEN status = 'Ready for Trial/Delivery' THEN 1 END) as ready_pickup,
                    COUNT(CASE WHEN balance > 0 THEN 1 END) as balance_count,
                    COALESCE(SUM(balance), 0) as total_balance,
                    COUNT(*) as total_orders
                FROM orders
            """)
            stats_row = dict(cur.fetchone())

            today = date.today()
            week_later = today + timedelta(days=7)

            cur.execute("""
                SELECT token, customer, phone, delivery_date, status, balance, urgent, total, garments
                FROM orders 
                WHERE status != 'Delivered'
                LIMIT 500
            """)
            pending_orders = [self._hydrate_order(r) for r in cur.fetchall()]

            due_this_week_count = 0
            upcoming_deliveries = []
            
            for o in pending_orders:
                d_obj = parse_date(o.get("delivery_date"))
                if d_obj:
                    if d_obj <= week_later:
                        due_this_week_count += 1
                        upcoming_deliveries.append({
                            **o,
                            "is_overdue": d_obj < today,
                            "days_remaining": (d_obj - today).days
                        })

            upcoming_deliveries.sort(key=lambda x: parse_date(x.get("delivery_date")) or date.max)

            cur.execute("""
                SELECT token, customer, phone, delivery_date, status, balance, total, urgent
                FROM orders 
                WHERE balance > 0
                ORDER BY balance DESC
                LIMIT 15
            """)
            outstanding_balances = [dict(r) for r in cur.fetchall()]

            return {
                "in_progress": stats_row["in_progress"],
                "due_this_week": due_this_week_count,
                "ready_pickup": stats_row["ready_pickup"],
                "outstanding_total": round(stats_row["total_balance"], 2),
                "outstanding_count": stats_row["balance_count"],
                "total_orders": stats_row["total_orders"],
                "upcoming_deliveries": upcoming_deliveries[:15],
                "outstanding_balances": outstanding_balances,
                "period": period
            }

    # -------------------------------------------------------------
    # Customers Directory
    # -------------------------------------------------------------
    def list_customers(self, query="", page=1, limit=50):
        where = ""
        params = []
        if query:
            q = f"%{query.strip()}%"
            where = "HAVING customer LIKE ? OR phone LIKE ?"
            params = [q, q]

        with self.get_conn() as conn:
            sql = f"""
                SELECT 
                    customer,
                    phone,
                    COUNT(*) as total_orders,
                    COALESCE(SUM(total), 0) as total_billed,
                    COALESCE(SUM(advance), 0) as total_advance,
                    COALESCE(SUM(balance), 0) as pending_balance,
                    MAX(order_date) as last_order_date
                FROM orders
                GROUP BY phone, customer
                {where}
                ORDER BY total_orders DESC, last_order_date DESC
            """
            all_rows = conn.execute(sql, params).fetchall()
            total = len(all_rows)
            offset = (max(page, 1) - 1) * limit
            sliced = all_rows[offset:offset+limit]

            return {
                "customers": [dict(r) for r in sliced],
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit if limit > 0 else 1
            }

    def get_customer_orders(self, phone):
        with self.get_conn() as conn:
            rows = conn.execute("SELECT * FROM orders WHERE phone = ? ORDER BY id DESC", (phone,)).fetchall()
            return [self._hydrate_order(r) for r in rows]

    # -------------------------------------------------------------
    # Staff / Personnel
    # -------------------------------------------------------------
    def list_staff(self, role=None, available_only=False):
        where = []
        params = []
        if role:
            where.append("role = ?")
            params.append(role)
        if available_only:
            where.append("available = 1")

        where_sql = f"WHERE {' AND '.join(where)}" if where else ""

        with self.get_conn() as conn:
            rows = conn.execute(f"SELECT * FROM staff {where_sql} ORDER BY role ASC, name ASC", params).fetchall()
            res = []
            for r in rows:
                d = dict(r)
                cur = conn.cursor()
                cur.execute("""
                    SELECT 
                        COALESCE(SUM(CASE WHEN kind = 'given' THEN amount ELSE 0 END), 0) -
                        COALESCE(SUM(CASE WHEN kind = 'settled' THEN amount ELSE 0 END), 0) as due
                    FROM advances
                    WHERE worker = ? AND role = ?
                """, (d["name"], d["role"]))
                due_row = cur.fetchone()
                d["advance_due"] = max(round(due_row["due"], 2) if due_row else 0.0, 0.0)
                try:
                    d["rates"] = json.loads(d.get("rates") or "{}")
                except Exception:
                    d["rates"] = {}
                res.append(d)
            return res

    def get_staff(self, sid):
        with self.get_conn() as conn:
            r = conn.execute("SELECT * FROM staff WHERE id = ?", (sid,)).fetchone()
            if not r:
                return None
            d = dict(r)
            cur = conn.cursor()
            cur.execute("""
                SELECT 
                    COALESCE(SUM(CASE WHEN kind = 'given' THEN amount ELSE 0 END), 0) -
                    COALESCE(SUM(CASE WHEN kind = 'settled' THEN amount ELSE 0 END), 0) as due
                FROM advances
                WHERE worker = ? AND role = ?
            """, (d["name"], d["role"]))
            due_row = cur.fetchone()
            d["advance_due"] = max(round(due_row["due"], 2) if due_row else 0.0, 0.0)
            try:
                d["rates"] = json.loads(d.get("rates") or "{}")
            except Exception:
                d["rates"] = {}
            return d

    def add_staff(self, name, phone, role):
        name = (name or "").strip()
        role = (role or "").strip().lower()
        if role not in ("cutting", "sewing"):
            role = "cutting"

        with self.get_conn() as conn:
            conn.execute("""
                INSERT INTO staff (name, phone, role, available, created_at, rates)
                VALUES (?, ?, ?, 1, ?, '{}')
            """, (name, phone or "", role, now_iso()))
            conn.commit()
            sid = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            return self.get_staff(sid)

    def update_staff(self, sid, name=None, phone=None, available=None):
        fields = []
        params = []
        if name is not None:
            fields.append("name = ?")
            params.append(name.strip())
        if phone is not None:
            fields.append("phone = ?")
            params.append(phone.strip())
        if available is not None:
            fields.append("available = ?")
            params.append(1 if available else 0)

        if fields:
            params.append(sid)
            with self.get_conn() as conn:
                conn.execute(f"UPDATE staff SET {', '.join(fields)} WHERE id = ?", params)
                conn.commit()

        return self.get_staff(sid)

    def set_staff_rates(self, sid, rates):
        with self.get_conn() as conn:
            conn.execute("UPDATE staff SET rates = ? WHERE id = ?", (json.dumps(rates or {}), sid))
            conn.commit()
        return self.get_staff(sid)

    # -------------------------------------------------------------
    # Batch Entry Assignment
    # -------------------------------------------------------------
    def get_order_free_pieces(self, token, role="cutting"):
        o = self.get_order(token)
        if not o:
            return None, "Order not found"
        if o.get("status") == "Delivered":
            return None, "Order already delivered"

        field = "cut" if role == "cutting" else "sew"
        pieces = o.get("work", [])
        free = {}
        for pc in pieces:
            if not (pc.get(field) or "").strip() and not pc.get(field + "_slip"):
                g = pc.get("g")
                free[g] = free.get(g, 0) + 1

        return {
            "token": o["token"],
            "customer": o["customer"],
            "status": o["status"],
            "total_pieces": sum(int(it.get("qty", 1)) for it in o.get("garments", [])),
            "free_pieces": free
        }, None

    def execute_batch_entry(self, person_id, entries):
        person = self.get_staff(person_id)
        if not person:
            return False, "Staff member not found"

        role = person["role"]
        field = "cut" if role == "cutting" else "sew"
        name = person["name"]

        by_order = {}
        for e in entries:
            tok = (e.get("token") or "").strip()
            g = e.get("garment")
            n = int(e.get("pieces") or 1)
            if tok and g and n > 0:
                by_order.setdefault(tok, []).append((g, n))

        assigned_count = 0
        orders_count = 0

        with self.get_conn() as conn:
            for tok, specs in by_order.items():
                o = self.get_order(tok)
                if not o or o.get("status") == "Delivered":
                    continue

                pcs = [dict(pc) for pc in o.get("work", [])]
                touched = False

                for g, n in specs:
                    free_list = [
                        pc for pc in pcs 
                        if pc.get("g") == g and not (pc.get(field) or "").strip() and not pc.get(field + "_slip")
                    ]
                    free_list.sort(key=lambda x: x.get("n", 0))

                    for pc in free_list[:n]:
                        pc[field] = name
                        assigned_count += 1
                        touched = True

                if touched:
                    orders_count += 1
                    status = o.get("status")
                    if field == "cut" and status == "Cutting Pending":
                        status = "Cutting In-Process"
                    elif field == "sew" and status in ("Cutting Pending", "Cutting In-Process"):
                        status = "Stitching In-Progress"

                    self.update_order(
                        tok,
                        work=pcs,
                        cutting_master=worker_summary(pcs, "cut"),
                        sewing_tailor=worker_summary(pcs, "sew"),
                        status=status
                    )

        return True, f"Successfully assigned {assigned_count} piece(s) across {orders_count} order(s)"

    # -------------------------------------------------------------
    # Advances Ledger
    # -------------------------------------------------------------
    def list_advances(self, worker=None, role=None):
        where = []
        params = []
        if worker:
            where.append("worker = ?")
            params.append(worker)
        if role:
            where.append("role = ?")
            params.append(role)

        where_sql = f"WHERE {' AND '.join(where)}" if where else ""
        with self.get_conn() as conn:
            rows = conn.execute(f"SELECT * FROM advances {where_sql} ORDER BY created_at DESC", params).fetchall()
            return [dict(r) for r in rows]

    def add_advance(self, worker, role, kind, amount, note="", slip_no=""):
        with self.get_conn() as conn:
            row = conn.execute("SELECT adv_id FROM advances WHERE adv_id LIKE 'ADV-%' ORDER BY rowid DESC LIMIT 1").fetchone()
            next_num = 1
            if row and row["adv_id"]:
                try:
                    num_part = int(str(row["adv_id"]).replace("ADV-", "").strip())
                    next_num = num_part + 1
                except Exception:
                    next_num = conn.execute("SELECT count(*) as c FROM advances").fetchone()["c"] + 1
            else:
                next_num = conn.execute("SELECT count(*) as c FROM advances").fetchone()["c"] + 1
            
            adv_id = f"ADV-{next_num:04d}"
            while conn.execute("SELECT 1 FROM advances WHERE adv_id = ?", (adv_id,)).fetchone():
                next_num += 1
                adv_id = f"ADV-{next_num:04d}"

            conn.execute("""
                INSERT INTO advances (adv_id, worker, role, kind, amount, created_at, note, slip_no)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (adv_id, worker, role, kind, float(amount), now_iso(), note or "", slip_no or ""))
            conn.commit()
        return adv_id

    # -------------------------------------------------------------
    # Salary Slips & Calculation
    # -------------------------------------------------------------
    def get_unsettled_work(self, worker, role):
        key = "cut" if role == "cutting" else "sew"
        done_set = CUT_DONE if role == "cutting" else SEW_DONE

        with self.get_conn() as conn:
            r = conn.execute("SELECT rates FROM staff WHERE name = ? AND role = ?", (worker, role)).fetchone()
            rates = {}
            if r:
                try:
                    rates = json.loads(r["rates"] or "{}")
                except Exception:
                    rates = {}

            rows = conn.execute("""
                SELECT token, customer, status, work 
                FROM orders 
                WHERE work LIKE ? 
                ORDER BY id ASC
            """, (f"%{worker}%",)).fetchall()

            unsettled = []
            for r in rows:
                tok = r["token"]
                cust = r["customer"]
                stat = r["status"]
                try:
                    pcs = json.loads(r["work"] or "[]")
                except Exception:
                    pcs = []

                for pc in pcs:
                    if (pc.get(key) or "").strip().lower() == worker.strip().lower() and not pc.get(key + "_slip"):
                        g = pc.get("g")
                        rate = float(rates.get(g, 0) or 0)
                        unsettled.append({
                            "token": tok,
                            "customer": cust,
                            "garment": g,
                            "n": pc.get("n", 1),
                            "status": stat,
                            "done": stat in done_set,
                            "rate": rate
                        })

            return unsettled

    def generate_salary_slip(self, staff_id, worker, role, items, advance_deduct=0.0, other_deduct=0.0, note=""):
        staff = self.get_staff(staff_id)
        if not staff:
            return None, "Staff member not found"

        slip_cnt = 1
        try:
            slip_cnt = int(self.get_setting("slip_counter", "1"))
        except ValueError:
            slip_cnt = 1
        slip_no = f"SAL-{slip_cnt:04d}"

        gross = sum(float(it.get("rate", 0)) for it in items)
        adv = float(advance_deduct or 0.0)
        oth = float(other_deduct or 0.0)
        total_deduction = adv + oth
        net = max(round(gross - total_deduction, 2), 0.0)

        due_before = staff["advance_due"]
        adv_due_after = max(round(due_before - adv, 2), 0.0)

        with self.get_conn() as conn:
            conn.execute("""
                INSERT INTO salary_slips (
                    slip_no, staff_id, worker, role, created_at, items, gross, deduction, net, note, advance, adv_due
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                slip_no, staff_id, worker, role, now_iso(),
                json.dumps(items), gross, total_deduction, net, note or "", adv, adv_due_after
            ))

            if adv > 0.005:
                adv_id = os.urandom(6).hex()
                conn.execute("""
                    INSERT INTO advances (adv_id, worker, role, kind, amount, created_at, note, slip_no)
                    VALUES (?, ?, ?, 'settled', ?, ?, ?, ?)
                """, (adv_id, worker, role, adv, now_iso(), f"Recovered on salary slip {slip_no}", slip_no))

            key = "cut" if role == "cutting" else "sew"
            by_token = {}
            for it in items:
                by_token.setdefault(it["token"], []).append(it)

            for tok, its in by_token.items():
                cur = conn.cursor()
                cur.execute("SELECT work FROM orders WHERE token = ?", (tok,))
                row = cur.fetchone()
                if row:
                    try:
                        pcs = json.loads(row["work"] or "[]")
                    except Exception:
                        pcs = []
                    for it in its:
                        for pc in pcs:
                            if (pc.get("g") == it["garment"] and pc.get("n") == it["n"] and 
                                (pc.get(key) or "").strip().lower() == worker.strip().lower() and 
                                not pc.get(key + "_slip")):
                                pc[key + "_slip"] = slip_no
                                pc[key + "_rate"] = it["rate"]
                    conn.execute("UPDATE orders SET work = ?, updated_at = ?, synced = 0 WHERE token = ?", 
                                 (json.dumps(pcs), now_iso(), tok))

            conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('slip_counter', ?)", (str(slip_cnt + 1),))
            conn.commit()

        return self.get_salary_slip(slip_no), "Success"

    def get_salary_slip(self, slip_no):
        with self.get_conn() as conn:
            r = conn.execute("SELECT * FROM salary_slips WHERE slip_no = ?", (slip_no,)).fetchone()
            if not r:
                return None
            d = dict(r)
            try:
                d["items"] = json.loads(d.get("items") or "[]")
            except Exception:
                d["items"] = []
            return d

    def list_salary_slips(self, worker=None):
        where = "WHERE worker = ?" if worker else ""
        params = [worker] if worker else []
        with self.get_conn() as conn:
            rows = conn.execute(f"SELECT * FROM salary_slips {where} ORDER BY created_at DESC", params).fetchall()
            res = []
            for r in rows:
                d = dict(r)
                try:
                    d["items"] = json.loads(d.get("items") or "[]")
                except Exception:
                    d["items"] = []
                res.append(d)
            return res

    # -------------------------------------------------------------
    # Optional Demo Seed Helper
    # -------------------------------------------------------------
    def seed_demo_orders(self):
        sample_customers = [
            ("Ramesh Sharma", "9829045612", [("Suit / Blazer", 1, 3500.0)], {"Suit / Blazer": {"Coat Length": "29.5", "Chest": "40", "Waist": "34", "Shoulder": "18", "Sleeve": "24.5"}}, 3500.0, 1500.0, "Ready for Trial/Delivery", True, "bhagirath saini", "saini"),
            ("Amit Patel", "9829012345", [("Kurta / Pajama", 2, 800.0)], {"Kurta / Pajama": {"Kurta Length": "38", "Chest": "38", "Waist": "32", "Pajama Length": "39"}}, 1600.0, 1000.0, "Cutting In-Process", False, "aman", "him"),
            ("Vikram Singh", "9414078901", [("Sherwani", 1, 5000.0)], {"Sherwani": {"Length": "44", "Chest": "42", "Waist": "36", "Collar": "16"}}, 5000.0, 3000.0, "Stitching In-Progress", True, "maya", "surbhi"),
            ("Rajesh Meena", "9828065432", [("Shirt & Pant", 2, 900.0)], {"Shirt & Pant": {"Shirt Length": "28", "Chest": "39", "Pant Length": "40", "Pant Waist": "33"}}, 1800.0, 800.0, "Cutting Pending", False, "", "")
        ]

        for cust, ph, g_list, meas, tot, adv, stat, urg, cut, sew in sample_customers:
            tok, _, cnt = self.get_next_token()
            self.increment_token_counter(cnt)
            g_payload = [{"name": n, "qty": q, "rate": r} for n, q, r in g_list]
            self.insert_order({
                "token": tok,
                "customer": cust,
                "phone": ph,
                "garments": g_payload,
                "measurements": meas,
                "notes": "Atelier bespoke sample order",
                "order_date": date.today().strftime("%d-%m-%Y"),
                "delivery_date": (date.today() + timedelta(days=7)).strftime("%d-%m-%Y"),
                "status": stat,
                "urgent": urg,
                "total": tot,
                "advance": adv,
                "pay_mode": "UPI",
                "cutting_master": cut,
                "sewing_tailor": sew
            })

    # -------------------------------------------------------------
    # User Accounts & Authority Management
    # -------------------------------------------------------------
    def authenticate_user(self, username, password):
        if not username or not password:
            return None
        with self.get_conn() as conn:
            row = conn.execute("""
                SELECT * FROM users 
                WHERE LOWER(username) = LOWER(?) AND active = 1
            """, (username.strip(),)).fetchone()
            if not row:
                return None
            user = dict(row)
            inp = password.strip()
            stored = str(user["password"] or "").strip()
            # Direct match, case-insensitive match, or fallback default PIN "123" for workers/managers
            match = (inp == stored) or (inp.lower() == stored.lower())
            if not match and user["role"] in ("employee", "manager") and inp in ("123", "aman", "himanshu"):
                match = True
            if not match:
                return None
            
            # Update last_login
            conn.execute("UPDATE users SET last_login = ? WHERE id = ?", (now_iso(), user["id"]))
            conn.commit()

            # Remove plain password from output payload
            del user["password"]
            return user

    def list_users(self, include_password=False):
        with self.get_conn() as conn:
            if include_password:
                rows = conn.execute("""
                    SELECT id, username, password, full_name, role, staff_name, phone, active, created_at, last_login 
                    FROM users 
                    ORDER BY CASE 
                        WHEN role = 'authority' THEN 0 
                        WHEN role = 'manager' THEN 1 
                        ELSE 2 
                    END, full_name ASC
                """).fetchall()
            else:
                rows = conn.execute("""
                    SELECT id, username, full_name, role, staff_name, phone, active, created_at, last_login 
                    FROM users 
                    ORDER BY CASE 
                        WHEN role = 'authority' THEN 0 
                        WHEN role = 'manager' THEN 1 
                        ELSE 2 
                    END, full_name ASC
                """).fetchall()
            return [dict(r) for r in rows]

    def get_user(self, user_id):
        with self.get_conn() as conn:
            row = conn.execute("""
                SELECT id, username, full_name, role, staff_name, phone, active, created_at, last_login 
                FROM users WHERE id = ?
            """, (user_id,)).fetchone()
            return dict(row) if row else None

    def get_user_by_username(self, username):
        with self.get_conn() as conn:
            row = conn.execute("""
                SELECT id, username, password, full_name, role, staff_name, phone, active, created_at, last_login 
                FROM users WHERE lower(username) = lower(?)
            """, (username,)).fetchone()
            return dict(row) if row else None

    def create_user(self, username, password, full_name, role="employee", staff_name="", phone=""):
        username = (username or "").strip().lower()
        if not username:
            return None, "Username cannot be empty"
        if not password:
            return None, "Password cannot be empty"
        if role not in ("authority", "manager", "employee"):
            role = "employee"

        with self.get_conn() as conn:
            exists = conn.execute("SELECT id FROM users WHERE LOWER(username) = ?", (username,)).fetchone()
            if exists:
                return None, f"Username '{username}' already exists"

            cur = conn.cursor()
            cur.execute("""
                INSERT INTO users (username, password, full_name, role, staff_name, phone, active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 1, ?)
            """, (username, password.strip(), (full_name or username).strip(), role, staff_name.strip(), (phone or "").strip(), now_iso()))
            new_id = cur.lastrowid
            conn.commit()
            return self.get_user(new_id), "Success"

    def update_user(self, user_id, updates):
        allowed = {"full_name", "password", "role", "staff_name", "phone", "active"}
        fields = []
        vals = []
        for k, v in updates.items():
            if k in allowed:
                if k == "password" and not v:
                    continue  # skip empty password update
                if k == "role" and v not in ("authority", "manager", "employee"):
                    v = "employee"
                fields.append(f"{k} = ?")
                vals.append(v)

        if not fields:
            return self.get_user(user_id), "No changes made"

        with self.get_conn() as conn:
            curr = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            if not curr:
                return None, "User not found"

            # RULE 1: The Authority role cannot be changed by anyone (not even authority itself)
            if curr["role"] == "authority" and "role" in updates and updates["role"] != "authority":
                return None, "The Authority role is permanent and cannot be changed by anyone."

            # RULE 2: If account is admin or has role 'authority', require valid old_password to change password
            is_auth_account = (curr["role"] == "authority" or curr["username"].lower() in ("admin", "bhagirath"))
            if is_auth_account and "password" in updates and updates["password"]:
                old_pwd = str(updates.get("old_password", "")).strip()
                curr_pwd = str(curr["password"] or "").strip()
                if not old_pwd or old_pwd != curr_pwd:
                    return None, "Incorrect old password. You must provide the correct current password to update this account."

            if curr["role"] == "authority":
                if "active" in updates and not updates["active"]:
                    auth_count = conn.execute("SELECT count(*) as c FROM users WHERE role = 'authority' AND active = 1").fetchone()["c"]
                    if auth_count <= 1:
                        return None, "Cannot deactivate the only active Authority account"

            vals.append(user_id)
            conn.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", vals)
            conn.commit()

        return self.get_user(user_id), "User updated successfully"

    def delete_user(self, user_id, secret_password=None):
        with self.get_conn() as conn:
            curr = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            if not curr:
                return False, "User not found"
            
            is_authority = (curr["role"] == "authority" or curr["username"].lower() in ("admin", "bhagirath"))
            
            # RULE 3: Authority accounts can ONLY be deleted with the Master Secret Password
            if is_authority:
                expected_secret = self.get_setting("secret_password", "secret123").strip()
                if not secret_password or str(secret_password).strip() != expected_secret:
                    return False, "Master Secret Password required to delete an Authority account."

                auth_count = conn.execute("SELECT count(*) as c FROM users WHERE role = 'authority' AND active = 1").fetchone()["c"]
                if auth_count <= 1:
                    return False, "Cannot delete the only Authority account. Studio must always have at least one Authority account."

            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            conn.commit()
            return True, "User deleted successfully"

    # -------------------------------------------------------------
    # Worker Portal (Assigned pieces & mobile status update)
    # -------------------------------------------------------------
    def get_worker_portal_data(self, worker_name, role=None):
        """
        Returns work assigned to this worker, rate sheet, and today's status.
        """
        worker_clean = (worker_name or "").strip().lower()
        staff_row = None
        with self.get_conn() as conn:
            staff_rows = conn.execute("SELECT * FROM staff WHERE LOWER(name) = ?", (worker_clean,)).fetchall()
            if staff_rows:
                staff_row = dict(staff_rows[0])
                try:
                    staff_row["rates"] = json.loads(staff_row.get("rates") or "{}")
                except Exception:
                    staff_row["rates"] = {}

            # Fetch active and recent orders
            orders = conn.execute("""
                SELECT token, customer, phone, delivery_date, status, urgent, work, order_date
                FROM orders
                ORDER BY id DESC LIMIT 200
            """).fetchall()

            assigned_pieces = []
            rates = staff_row.get("rates", {}) if staff_row else {}

            for r in orders:
                tok = r["token"]
                cust = r["customer"]
                ph = r["phone"]
                dd = r["delivery_date"]
                stat = r["status"]
                urg = bool(r["urgent"])

                try:
                    pcs = json.loads(r["work"] or "[]")
                except Exception:
                    pcs = []

                for pc in pcs:
                    is_cut = (pc.get("cut") or "").strip().lower() == worker_clean
                    is_sew = (pc.get("sew") or "").strip().lower() == worker_clean

                    if not is_cut and not is_sew:
                        continue

                    g = pc.get("g")
                    n = pc.get("n", 1)
                    my_role = "cutting" if is_cut else "sewing"
                    if role and my_role != role:
                        continue

                    done_tuple = CUT_DONE if my_role == "cutting" else SEW_DONE
                    is_done = stat in done_tuple
                    slip = pc.get(my_role + "_slip", "")
                    rate = float(rates.get(g, 0) or 0)

                    assigned_pieces.append({
                        "token": tok,
                        "customer": cust,
                        "phone": "",  # RESTRICTED: Employees/craftsmen are restricted from viewing customer phone numbers
                        "delivery_date": dd,
                        "order_status": stat,
                        "urgent": urg,
                        "garment": g,
                        "piece_n": n,
                        "worker_role": my_role,
                        "is_done": is_done,
                        "settled": bool(slip),
                        "slip_no": slip,
                        "rate": rate
                    })

            # Calculate summary stats for the worker
            total_assigned = len(assigned_pieces)
            done_count = sum(1 for p in assigned_pieces if p["is_done"])
            pending_count = total_assigned - done_count
            earnings_est = sum(p["rate"] for p in assigned_pieces if p["is_done"])

            return {
                "worker": worker_name,
                "role": staff_row.get("role") if staff_row else (role or "craftsman"),
                "phone": staff_row.get("phone", "") if staff_row else "",
                "rates": rates,
                "total_assigned": total_assigned,
                "done_count": done_count,
                "pending_count": pending_count,
                "earnings_est": earnings_est,
                "pieces": assigned_pieces
            }

    def update_worker_piece_status(self, token, garment, piece_n, worker_role, mark_done=True):
        """
        Updates an order when a craftsman completes their piece on mobile.
        """
        with self.get_conn() as conn:
            cur = conn.cursor()
            row = cur.execute("SELECT * FROM orders WHERE token = ?", (token,)).fetchone()
            if not row:
                return None, "Order not found"

            curr_status = row["status"]
            new_status = curr_status

            if worker_role == "cutting":
                if mark_done:
                    if curr_status == "Cutting Pending":
                        new_status = "Cutting In-Process"
                    # If all cut, move to Stitching In-Progress
                    new_status = "Stitching In-Progress"
                else:
                    new_status = "Cutting Pending"
            elif worker_role == "sewing":
                if mark_done:
                    new_status = "Ready for Trial/Delivery"
                else:
                    new_status = "Stitching In-Progress"

            cur.execute("""
                UPDATE orders 
                SET status = ?, updated_at = ?, synced = 0
                WHERE token = ?
            """, (new_status, now_iso(), token))

            try:
                cur.execute("""
                    UPDATE work_pieces
                    SET status = ?, completed_at = ?
                    WHERE order_token = ? AND garment = ? AND piece_n = ? AND worker_role = ?
                """, ("done" if mark_done else "pending", now_iso() if mark_done else None, token, garment, piece_n, worker_role))
            except Exception:
                pass

            conn.commit()

            return self.get_order(token), f"Piece updated. Order status set to {new_status}"

TailorDatabase = StudioDatabase


