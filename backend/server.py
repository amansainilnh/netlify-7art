import os
import sys

# Ensure UTF-8 output even when redirected to file or hidden process
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

import json
import time
import socket
import urllib.parse
import threading
import subprocess
import re
import gzip
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
from datetime import datetime, date

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.db import StudioDatabase, parse_date, format_ddmmyyyy
from backend.excel_export import generate_excel_bytes
from backend.cloud_sync import SupabaseClient
import threading
try:
    from backend.pdf_gen import (
        generate_order_document,
        generate_salary_slip_document,
        generate_advance_document
    )
except ImportError:
    generate_order_document = lambda *a, **k: None
    generate_salary_slip_document = lambda *a, **k: None
    generate_advance_document = lambda *a, **k: None

def find_public_dir():
    candidates = [
        os.path.join(BASE_DIR, "public"),
        os.path.join(os.getcwd(), "public"),
        os.path.join(BASE_DIR, "7art_studio_suite", "public"),
        os.path.join(os.path.dirname(BASE_DIR), "public"),
        os.path.join(os.path.dirname(BASE_DIR), "7art_studio_suite", "public"),
        BASE_DIR,
        os.getcwd()
    ]
    for c in candidates:
        if os.path.exists(os.path.join(c, "index.html")):
            return os.path.abspath(c)
    return os.path.join(BASE_DIR, "public")

PUBLIC_DIR = find_public_dir()
db = StudioDatabase()

BUNDLE_COMPONENTS = [
    "js/vendor/qrcode.min.js",
    "js/api.js",
    "js/views/print_engine.js",
    "js/views/login.js",
    "js/views/my_work.js",
    "js/views/dashboard.js",
    "js/views/booking.js",
    "js/views/orders.js",
    "js/views/customers.js",
    "js/views/manage.js",
    "js/views/settings.js",
    "js/app.js",
]

_STATIC_GZIP_CACHE = {}  # clean_path: (mtime, content_type, compressed_bytes)

def ensure_studio_bundle():
    """Consolidates JavaScript views into a single high-speed bundle for mobile & remote clients."""
    bundle_file = os.path.join(PUBLIC_DIR, "js", "studio.bundle.js")
    component_paths = [os.path.join(PUBLIC_DIR, rel) for rel in BUNDLE_COMPONENTS]
    
    max_mtime = 0
    for cp in component_paths:
        if os.path.exists(cp):
            max_mtime = max(max_mtime, os.path.getmtime(cp))
            
    needs_rebuild = True
    if os.path.exists(bundle_file):
        bundle_mtime = os.path.getmtime(bundle_file)
        if bundle_mtime >= max_mtime:
            needs_rebuild = False

    if needs_rebuild:
        try:
            chunks = []
            for rel in BUNDLE_COMPONENTS:
                cp = os.path.join(PUBLIC_DIR, rel)
                if os.path.exists(cp):
                    with open(cp, "r", encoding="utf-8") as f:
                        chunks.append(f"/* === {rel} === */\n" + f.read() + "\n")
            with open(bundle_file, "w", encoding="utf-8") as f:
                f.write("\n".join(chunks))
            # Invalidate RAM cache for bundle
            _STATIC_GZIP_CACHE.pop("js/studio.bundle.js", None)
        except Exception as e:
            print(f"[Bundle Builder Error] {e}")

def auto_backup_order_to_supabase(order_data):
    try:
        url = db.get_setting("supabase_url")
        key = db.get_setting("supabase_key")
        if url and key:
            client = SupabaseClient(url, key)
            client.push_orders([order_data])
    except Exception as e:
        print(f"[Supabase Auto-Sync] {e}")

def auto_backup_users_to_supabase():
    try:
        url = db.get_setting("supabase_url")
        key = db.get_setting("supabase_key")
        if url and key:
            client = SupabaseClient(url, key)
            client.push_users(db.list_users(include_password=True))
    except Exception as e:
        print(f"[Supabase Users Auto-Sync] {e}")

_CACHED_NET_DETAILS = None
_LAST_NET_CHECK = 0
_LIVE_TUNNEL_URL = None
_TUNNEL_STATUS = "connecting"
_TUNNEL_PROC = None

def _run_tunnel_loop(port=5000):
    global _LIVE_TUNNEL_URL, _TUNNEL_STATUS, _TUNNEL_PROC
    print(f"[Tunnel] Background Public HTTPS Tunnel worker started for port {port}...")
    while True:
        try:
            _TUNNEL_STATUS = "connecting"
            cmd = [
                "ssh",
                "-o", "StrictHostKeyChecking=no",
                "-o", "ServerAliveInterval=30",
                "-o", "TCPKeepAlive=yes",
                "-R", f"80:127.0.0.1:{port}",
                "nokey@localhost.run"
            ]
            cflags = 0x08000000 if sys.platform == "win32" else 0  # CREATE_NO_WINDOW
            _TUNNEL_PROC = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                stdin=subprocess.DEVNULL,
                text=True,
                bufsize=1,
                creationflags=cflags
            )
            for line in iter(_TUNNEL_PROC.stdout.readline, ''):
                line = line.strip()
                if not line:
                    continue
                if "admin.localhost.run" in line:
                    continue
                m = re.search(r'https://[a-zA-Z0-9-]+\.lhr\.(?:life|pro|rocks)', line)
                if not m and "https://" in line and "localhost.run" not in line:
                    m = re.search(r'https://[^\s<>"\'\)]+', line)
                if m:
                    url_cand = m.group(0).rstrip('.')
                    if "admin.localhost.run" not in url_cand and "localhost.run" not in url_cand:
                        _LIVE_TUNNEL_URL = url_cand
                        _TUNNEL_STATUS = "online"
                        print(f"[Tunnel] Live Public Worldwide HTTPS URL ready: {_LIVE_TUNNEL_URL}")
                        try:
                            targets = [
                                os.path.join(BASE_DIR, "tunnel_url.txt"),
                                os.path.join(os.path.dirname(BASE_DIR), "tunnel_url.txt"),
                                os.path.join(BASE_DIR, "public", "tunnel_info.json")
                            ]
                            for t_file in targets:
                                if t_file.endswith(".json"):
                                    with open(t_file, "w") as f:
                                        json.dump({"url": _LIVE_TUNNEL_URL, "status": "online", "time": time.time()}, f)
                                else:
                                    with open(t_file, "w") as f:
                                        f.write(_LIVE_TUNNEL_URL)
                        except Exception:
                            pass
            _TUNNEL_PROC.wait()
        except Exception as e:
            print(f"[Tunnel Note] {e}")

        _LIVE_TUNNEL_URL = None
        _TUNNEL_STATUS = "reconnecting"
        time.sleep(5)

def start_tunnel_in_background(port=5000):
    t = threading.Thread(target=_run_tunnel_loop, args=(port,), daemon=True)
    t.start()

def get_network_details():
    global _CACHED_NET_DETAILS, _LAST_NET_CHECK, _LIVE_TUNNEL_URL, _TUNNEL_STATUS
    now = time.time()

    # Check for external tunnel_url.txt / tunnel_info.json
    for t_file in [
        os.path.join(BASE_DIR, "tunnel_url.txt"),
        os.path.join(os.path.dirname(BASE_DIR), "tunnel_url.txt"),
        os.path.join(BASE_DIR, "public", "tunnel_info.json")
    ]:
        if os.path.exists(t_file):
            try:
                if t_file.endswith(".json"):
                    with open(t_file, "r") as f:
                        data = json.load(f)
                        if data.get("url") and "admin.localhost.run" not in data["url"]:
                            _LIVE_TUNNEL_URL = data["url"]
                            _TUNNEL_STATUS = "online"
                else:
                    with open(t_file, "r") as f:
                        raw_u = f.read().strip()
                        if raw_u.startswith("https://") and "admin.localhost.run" not in raw_u:
                            _LIVE_TUNNEL_URL = raw_u
                            _TUNNEL_STATUS = "online"
            except Exception:
                pass

    if _CACHED_NET_DETAILS and (now - _LAST_NET_CHECK < 60):
        res = dict(_CACHED_NET_DETAILS)
        res["tunnel_url"] = _LIVE_TUNNEL_URL
        res["tunnel_status"] = _TUNNEL_STATUS
        return res

    ips = ["127.0.0.1"]
    wifi_ips = []
    tailscale_ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.2)
        # Doesn't need to be reachable
        s.connect(('10.254.254.254', 1))
        local_ip = s.getsockname()[0]
        if local_ip not in ips:
            ips.append(local_ip)
        s.close()
    except Exception:
        pass
    try:
        host_name = socket.gethostname()
        for ip in socket.gethostbyname_ex(host_name)[2]:
            if ip not in ips and not ip.startswith("127."):
                ips.append(ip)
    except Exception:
        pass

    for ip in ips:
        if ip.startswith("100."):
            tailscale_ips.append(ip)
        elif not ip.startswith("127."):
            wifi_ips.append(ip)

    res = {
        "ips": ips,
        "wifi_ips": wifi_ips,
        "tailscale_ips": tailscale_ips,
        "primary_wifi": wifi_ips[0] if wifi_ips else "127.0.0.1",
        "primary_tailscale": tailscale_ips[0] if tailscale_ips else None,
        "tunnel_url": _LIVE_TUNNEL_URL,
        "tunnel_status": _TUNNEL_STATUS
    }
    _CACHED_NET_DETAILS = res
    _LAST_NET_CHECK = now
    return dict(res)

def get_local_ips():
    return get_network_details()["ips"]

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

class StudioRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        words = [w for w in path.split('/') if w and w not in (os.curdir, os.pardir)]
        target = PUBLIC_DIR
        for w in words:
            target = os.path.join(target, w)
        return target

    def end_headers(self):
        # Keep-Alive header support for fast connection reuse
        self.send_header("Connection", "keep-alive")
        self.send_header("Keep-Alive", "timeout=30, max=100")

        clean_p = self.path.split('?')[0].lower()
        # Aggressive cache for static assets, no-cache for API / service-worker / dynamic
        if clean_p.endswith("service-worker.js") or "/api/" in self.path:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        elif clean_p.endswith((".js", ".css", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".woff", ".woff2", ".ttf")):
            self.send_header("Cache-Control", "public, max-age=86400")
        else:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")

        super().end_headers()

    def log_message(self, format, *args):
        if args and str(args[0]).startswith(("POST", "PUT", "DELETE")):
            sys.stdout.write(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]} -> {args[1]}\n")

    def _send_json(self, data, status=200):
        body = json.dumps(data, default=str).encode("utf-8")
        client_accepts_gzip = "gzip" in self.headers.get("Accept-Encoding", "").lower()

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Max-Age", "86400")

        if client_accepts_gzip and len(body) > 300:
            compressed = gzip.compress(body, compresslevel=6)
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(compressed)))
            self.end_headers()
            self.wfile.write(compressed)
        else:
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    def _send_error(self, message, status=400):
        self._send_json({"error": message, "success": False}, status=status)

    def _read_body(self):
        try:
            te = self.headers.get("Transfer-Encoding", "").lower()
            if "chunked" in te:
                chunks = []
                while True:
                    line = self.rfile.readline()
                    if not line:
                        break
                    line_str = line.strip().split(b";")[0]
                    if not line_str:
                        continue
                    try:
                        chunk_size = int(line_str, 16)
                    except ValueError:
                        break
                    if chunk_size == 0:
                        self.rfile.readline()
                        break
                    chunk = self.rfile.read(chunk_size)
                    chunks.append(chunk)
                    self.rfile.readline()
                return b"".join(chunks)

            content_len = int(self.headers.get("Content-Length", 0))
            if content_len > 0:
                return self.rfile.read(content_len)
        except Exception as e:
            print(f"[Read Body Note] {e}")
        return b""

    def _read_json(self):
        raw = self._read_body()
        if not raw:
            parsed = urllib.parse.urlparse(self.path)
            if parsed.query:
                q = urllib.parse.parse_qs(parsed.query)
                return {k: v[0] if len(v) == 1 else v for k, v in q.items()}
            return {}
        try:
            return json.loads(raw.decode("utf-8", errors="replace"))
        except Exception:
            try:
                text = raw.decode("utf-8", errors="replace")
                q = urllib.parse.parse_qs(text)
                return {k: v[0] if len(v) == 1 else v for k, v in q.items()}
            except Exception:
                return {}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Serve static assets or fallback to index.html for SPA routes
        if not path.startswith("/api/"):
            clean_path = path.strip("/")
            if clean_path in ("js/studio.bundle.js", "js/bundle.js"):
                ensure_studio_bundle()
                clean_path = "js/studio.bundle.js"

            full_file = os.path.join(PUBLIC_DIR, clean_path)
            if not os.path.exists(full_file) or os.path.isdir(full_file) or not clean_path:
                full_file = os.path.join(PUBLIC_DIR, "index.html")
                clean_path = "index.html"

            if os.path.exists(full_file):
                content_type = "application/octet-stream"
                if clean_path.endswith(".js"): content_type = "application/javascript; charset=utf-8"
                elif clean_path.endswith(".css"): content_type = "text/css; charset=utf-8"
                elif clean_path.endswith(".html"): content_type = "text/html; charset=utf-8"
                elif clean_path.endswith(".json"): content_type = "application/json; charset=utf-8"
                elif clean_path.endswith(".svg"): content_type = "image/svg+xml"
                elif clean_path.endswith(".png"): content_type = "image/png"
                elif clean_path.endswith((".jpg", ".jpeg")): content_type = "image/jpeg"
                elif clean_path.endswith(".ico"): content_type = "image/x-icon"
                elif clean_path.endswith(".woff2"): content_type = "font/woff2"
                elif clean_path.endswith(".woff"): content_type = "font/woff"
                else:
                    try:
                        content_type = self.guess_type(full_file)
                    except Exception:
                        pass

                try:
                    with open(full_file, "rb") as f:
                        raw_bytes = f.read()

                    client_accepts_gzip = "gzip" in self.headers.get("Accept-Encoding", "").lower()
                    if client_accepts_gzip and len(raw_bytes) > 250 and clean_path.endswith((".js", ".css", ".html", ".json", ".svg")):
                        compressed = gzip.compress(raw_bytes, compresslevel=6)
                        self.send_response(200)
                        self.send_header("Content-Type", content_type)
                        self.send_header("Content-Encoding", "gzip")
                        self.send_header("Content-Length", str(len(compressed)))
                        self.end_headers()
                        self.wfile.write(compressed)
                        return
                    else:
                        self.send_response(200)
                        self.send_header("Content-Type", content_type)
                        self.send_header("Content-Length", str(len(raw_bytes)))
                        self.end_headers()
                        self.wfile.write(raw_bytes)
                        return
                except Exception as serve_err:
                    print(f"[Static Serve Error] {serve_err}")

            return self._send_error(f"File not found: {path}", 404)

        try:
            # Role-Based Access Control (RBAC) Enforcement
            client_role = (self.headers.get("X-Studio-Role") or "").strip().lower()
            if client_role == "employee":
                allowed_employee_get = (
                    "/api/worker-portal/my-work",
                    "/api/network-info",
                    "/api/tunnel-info",
                    "/api/auth/logout"
                )
                if not any(path.startswith(prefix) for prefix in allowed_employee_get):
                    return self._send_error("Forbidden: Craftsman/employee role is restricted to My Work portal", 403)

            if path == "/api/network-info":
                net = get_network_details()
                net["port"] = self.server.server_port
                return self._send_json(net)

            elif path == "/api/tunnel-info":
                return self._send_json({
                    "tunnel_url": _LIVE_TUNNEL_URL,
                    "tunnel_status": _TUNNEL_STATUS,
                    "active": bool(_LIVE_TUNNEL_URL)
                })

            elif path == "/api/users":
                users = db.list_users()
                return self._send_json(users)

            elif path.startswith("/api/users/"):
                uid = int(path[len("/api/users/"):])
                user = db.get_user(uid)
                if user:
                    return self._send_json(user)
                return self._send_error("User not found", 404)

            elif path == "/api/worker-portal/my-work":
                worker = query.get("worker", [""])[0]
                role = query.get("role", [None])[0]
                if not worker:
                    return self._send_error("Worker name required")
                data = db.get_worker_portal_data(worker, role)
                return self._send_json(data)

            elif path == "/api/dashboard":
                period = query.get("period", ["All orders"])[0]
                metrics = db.get_dashboard_metrics(period)
                return self._send_json(metrics)

            elif path == "/api/orders/next-token":
                tok, prefix, cnt = db.get_next_token()
                return self._send_json({"token": tok, "prefix": prefix, "counter": cnt})

            elif path == "/api/orders":
                p = int(query.get("page", [1])[0])
                lim = int(query.get("limit", [50])[0])
                q = query.get("q", [""])[0]
                stat = query.get("status", [""])[0]
                urg = query.get("urgent", [""])[0]
                order_by = query.get("order_by", ["id DESC"])[0]
                res = db.list_orders(page=p, limit=lim, query=q, status=stat, urgent=urg, order_by=order_by)
                return self._send_json(res)

            elif path.startswith("/api/orders/") and not path.endswith("/free-pieces"):
                tok = urllib.parse.unquote(path[len("/api/orders/"):])
                o = db.get_order(tok)
                if o:
                    return self._send_json(o)
                return self._send_error("Order not found", 404)

            elif path.startswith("/api/orders/") and path.endswith("/free-pieces"):
                tok = urllib.parse.unquote(path[len("/api/orders/"):-len("/free-pieces")])
                role = query.get("role", ["cutting"])[0]
                info, err = db.get_order_free_pieces(tok, role)
                if err:
                    return self._send_error(err, 404)
                return self._send_json(info)

            elif path == "/api/customers":
                p = int(query.get("page", [1])[0])
                lim = int(query.get("limit", [50])[0])
                q = query.get("q", [""])[0]
                res = db.list_customers(query=q, page=p, limit=lim)
                return self._send_json(res)

            elif path.startswith("/api/customers/") and path.endswith("/orders"):
                phone = urllib.parse.unquote(path[len("/api/customers/"):-len("/orders")])
                orders = db.get_customer_orders(phone)
                return self._send_json({"phone": phone, "orders": orders})

            elif path == "/api/staff":
                role = query.get("role", [None])[0]
                avail = query.get("available_only", [False])[0] in (True, 1, "1", "true")
                staff = db.list_staff(role=role, available_only=avail)
                return self._send_json(staff)

            elif path.startswith("/api/staff/"):
                sid = int(path[len("/api/staff/"):])
                person = db.get_staff(sid)
                if person:
                    return self._send_json(person)
                return self._send_error("Staff member not found", 404)

            elif path == "/api/advances":
                worker = query.get("worker", [None])[0]
                role = query.get("role", [None])[0]
                advances = db.list_advances(worker=worker, role=role)
                return self._send_json(advances)

            elif path == "/api/salary-slips":
                worker = query.get("worker", [None])[0]
                slips = db.list_salary_slips(worker=worker)
                return self._send_json(slips)

            elif path == "/api/salary-slips/unsettled":
                worker = query.get("worker", [""])[0]
                role = query.get("role", ["cutting"])[0]
                if not worker:
                    return self._send_error("Worker name required")
                items = db.get_unsettled_work(worker, role)
                return self._send_json(items)

            elif path.startswith("/api/salary-slips/"):
                slip_no = urllib.parse.unquote(path[len("/api/salary-slips/"):])
                sl = db.get_salary_slip(slip_no)
                if sl:
                    return self._send_json(sl)
                return self._send_error("Salary slip not found", 404)

            elif path == "/api/settings":
                sett = db.get_all_settings()
                return self._send_json(sett)

            elif path == "/api/export/excel":
                xlsx_bytes = generate_excel_bytes(db)
                if not xlsx_bytes:
                    return self._send_error("Failed to generate Excel file or openpyxl missing", 500)
                self.send_response(200)
                self.send_header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                self.send_header("Content-Disposition", 'attachment; filename="7_ART_TAILORS_Studio_Orders.xlsx"')
                self.send_header("Content-Length", str(len(xlsx_bytes)))
                self.end_headers()
                self.wfile.write(xlsx_bytes)
                return

            elif path == "/api/export/backup":
                data = {
                    "exported_at": datetime.now().isoformat(),
                    "settings": db.get_all_settings(),
                    "orders": db.list_orders(limit=100000).get("orders", []),
                    "staff": db.list_staff(),
                    "advances": db.list_advances(),
                    "salary_slips": db.list_salary_slips()
                }
                body = json.dumps(data, indent=2).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Disposition", f'attachment; filename="7_art_studio_backup_{date.today().strftime("%Y%m%d")}.json"')
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            elif path.startswith("/api/receipts/orders/") and path.endswith("/pdf"):
                tok = urllib.parse.unquote(path[len("/api/receipts/orders/"):-len("/pdf")])
                order = db.get_order(tok)
                if not order:
                    return self._send_error("Order not found", 404)
                pdf_bytes = None
                try:
                    doc = generate_order_document(order, db.get_all_settings(), BASE_DIR)
                    if os.path.exists(doc["pdf"]):
                        with open(doc["pdf"], "rb") as f:
                            pdf_bytes = f.read()
                except Exception as e:
                    print(f"[PDF Serve Note] {e}")

                if not pdf_bytes:
                    receipts_dir = os.path.join(BASE_DIR, "receipts", "orders")
                    if os.path.exists(receipts_dir):
                        for fname in os.listdir(receipts_dir):
                            if fname.startswith(f"Order_{tok}") and fname.endswith(".pdf"):
                                try:
                                    with open(os.path.join(receipts_dir, fname), "rb") as f:
                                        pdf_bytes = f.read()
                                        break
                                except Exception:
                                    pass

                if not pdf_bytes:
                    from backend.pdf_gen import SimplePDF
                    fallback_pdf = SimplePDF()
                    fallback_pdf.text(50, 750, f"ORDER #{tok} - {order.get('customer')}", size=14, bold=True)
                    pdf_bytes = fallback_pdf.build_bytes()

                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Disposition", f'inline; filename="Order_{tok}.pdf"')
                self.send_header("Content-Length", str(len(pdf_bytes)))
                self.end_headers()
                self.wfile.write(pdf_bytes)
                return

            elif path.startswith("/api/receipts/salary-slips/") and path.endswith("/pdf"):
                slip_no = urllib.parse.unquote(path[len("/api/receipts/salary-slips/"):-len("/pdf")])
                sl = db.get_salary_slip(slip_no)
                if not sl:
                    return self._send_error("Salary slip not found", 404)
                doc = generate_salary_slip_document(sl, db.get_all_settings(), BASE_DIR)
                with open(doc["pdf"], "rb") as f:
                    pdf_bytes = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Disposition", f'inline; filename="Slip_{slip_no}.pdf"')
                self.send_header("Content-Length", str(len(pdf_bytes)))
                self.end_headers()
                self.wfile.write(pdf_bytes)
                return

            else:
                return self._send_error("API endpoint not found", 404)

        except Exception as e:
            return self._send_error(str(e), 500)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_json()

        try:
            # Role-Based Access Control (RBAC) Enforcement
            client_role = (self.headers.get("X-Studio-Role") or "").strip().lower()
            if client_role == "employee":
                allowed_employee_post = (
                    "/api/worker-portal/update-piece",
                    "/api/auth/login",
                    "/api/auth/logout"
                )
                if path not in allowed_employee_post:
                    return self._send_error("Forbidden: Craftsman/employee role is restricted to My Work bench portal", 403)
            elif client_role == "manager":
                restricted_manager_post = (
                    "/api/orders/delete",
                    "/api/users",
                    "/api/seed-demo"
                )
                if path in restricted_manager_post:
                    return self._send_error("Forbidden: Studio Authority permission required for this administrative operation", 403)

            if path == "/api/auth/login":
                username = str(body.get("username") or body.get("usr_studio_clean") or "").strip()
                password = str(body.get("password") or body.get("pwd_studio_clean") or "").strip()
                user = db.authenticate_user(username, password)
                if not user:
                    return self._send_error("Invalid username or password", 401)
                token = f"studio_token_{user['id']}_{os.urandom(8).hex()}"
                return self._send_json({"success": True, "user": user, "token": token})

            elif path == "/api/auth/logout":
                return self._send_json({"success": True})

            elif path == "/api/users":
                username = body.get("username")
                password = body.get("password")
                full_name = body.get("full_name")
                role = body.get("role", "employee")
                staff_name = body.get("staff_name", "")
                phone = body.get("phone", "")
                user, msg = db.create_user(username, password, full_name, role, staff_name, phone)
                if not user:
                    return self._send_error(msg, 400)
                threading.Thread(target=auto_backup_users_to_supabase, daemon=True).start()
                return self._send_json(user, 201)

            elif path == "/api/worker-portal/update-piece":
                tok = body.get("token")
                garment = body.get("garment")
                piece_n = int(body.get("piece_n", 1))
                worker_role = body.get("worker_role", "cutting")
                mark_done = body.get("mark_done", True)
                upd, msg = db.update_worker_piece_status(tok, garment, piece_n, worker_role, mark_done)
                if not upd:
                    return self._send_error(msg, 400)
                return self._send_json({"success": True, "message": msg, "order": upd})

            elif path == "/api/orders":
                new_order = db.insert_order(body)
                try:
                    generate_order_document(new_order, db.get_all_settings(), BASE_DIR)
                except Exception as e:
                    print(f"[Order PDF Gen Error] {e}")
                threading.Thread(target=auto_backup_order_to_supabase, args=(new_order,), daemon=True).start()
                return self._send_json(new_order, 201)

            elif path.startswith("/api/orders/") and path.endswith("/status"):
                tok = urllib.parse.unquote(path[len("/api/orders/"):-len("/status")])
                new_status = body.get("status")
                if not new_status:
                    return self._send_error("Status required")
                kwargs = {"status": new_status}
                if new_status == "Delivered":
                    kwargs["delivered_at"] = datetime.now().isoformat(timespec="seconds")
                upd = db.update_order(tok, **kwargs)
                return self._send_json(upd)

            elif path.startswith("/api/orders/") and path.endswith("/settle"):
                tok = urllib.parse.unquote(path[len("/api/orders/"):-len("/settle")])
                pay_mode = body.get("pay_mode", "Cash")
                amount = body.get("amount")
                deliver = body.get("deliver", True)
                upd, err = db.settle_order(tok, pay_mode=pay_mode, amount=amount, deliver=deliver)
                if not upd:
                    return self._send_error(err, 400)
                return self._send_json(upd)

            elif path == "/api/orders/bulk-status":
                tokens = body.get("tokens", [])
                status = body.get("status")
                cut = body.get("cutting_master")
                sew = body.get("sewing_tailor")
                count = db.bulk_status_change(tokens, status, cutting_master=cut, sewing_tailor=sew)
                return self._send_json({"success": True, "count": count})

            elif path == "/api/orders/delete":
                tokens = body.get("tokens", [])
                password = body.get("password")
                ok, msg = db.delete_orders(tokens, password=password)
                if not ok:
                    return self._send_error(msg, 401)
                return self._send_json({"success": True, "message": msg})

            elif path == "/api/staff":
                name = body.get("name")
                phone = body.get("phone", "")
                role = body.get("role", "cutting")
                person = db.add_staff(name, phone, role)
                return self._send_json(person, 201)

            elif path == "/api/staff/batch-entry":
                pid = body.get("person_id")
                entries = body.get("entries", [])
                ok, msg = db.execute_batch_entry(pid, entries)
                if not ok:
                    return self._send_error(msg, 400)
                return self._send_json({"success": True, "message": msg})

            elif path == "/api/advances":
                worker = body.get("worker")
                role = body.get("role")
                kind = body.get("kind", "given")
                amount = body.get("amount", 0.0)
                note = body.get("note", "")
                slip_no = body.get("slip_no", "")
                adv_id = db.add_advance(worker, role, kind, amount, note, slip_no)
                try:
                    generate_advance_document({
                        "adv_id": adv_id, "worker": worker, "role": role,
                        "kind": kind, "amount": amount, "note": note, "slip_no": slip_no
                    }, db.get_all_settings(), BASE_DIR)
                except Exception as e:
                    print(f"[Advance PDF Gen Error] {e}")
                return self._send_json({"success": True, "adv_id": adv_id}, 201)

            elif path == "/api/salary-slips":
                sid = body.get("staff_id")
                worker = body.get("worker")
                role = body.get("role")
                items = body.get("items", [])
                adv_deduct = float(body.get("advance_deduct") or 0.0)
                oth_deduct = float(body.get("other_deduct") or 0.0)
                note = body.get("note", "")
                slip, msg = db.generate_salary_slip(sid, worker, role, items, adv_deduct, oth_deduct, note)
                if not slip:
                    return self._send_error(msg, 400)
                try:
                    generate_salary_slip_document(slip, db.get_all_settings(), BASE_DIR)
                except Exception as e:
                    print(f"[Salary PDF Gen Error] {e}")
                return self._send_json(slip, 201)

            elif path == "/api/settings":
                db.save_settings(body)
                return self._send_json({"success": True, "settings": db.get_all_settings()})

            elif path == "/api/settings/verify-password":
                key = body.get("key", "password")
                pwd = body.get("password", "")
                default_val = "admin"
                if key == "salary_password":
                    default_val = "salary123"
                elif key == "delete_password":
                    default_val = "delete123"
                elif key == "secret_password":
                    default_val = "secret123"
                expected = db.get_setting(key, default_val)
                if pwd.strip() == expected.strip():
                    return self._send_json({"valid": True})
                return self._send_json({"valid": False}, 401)

            elif path == "/api/seed-demo":
                db.seed_demo_orders()
                return self._send_json({"success": True, "message": "Demo sample orders loaded!"})

            elif path == "/api/sync/supabase/test":
                url = body.get("url") or db.get_setting("supabase_url")
                key = body.get("key") or db.get_setting("supabase_key")
                client = SupabaseClient(url, key)
                ok, msg = client.test_connection()
                return self._send_json({"success": ok, "message": msg})

            elif path == "/api/sync/supabase/now":
                url = body.get("url") or db.get_setting("supabase_url")
                key = body.get("key") or db.get_setting("supabase_key")
                if not url or not key:
                    return self._send_error("Supabase URL and API Key are required. Please configure them in Cloud Sync.", 400)
                client = SupabaseClient(url, key)
                ok, msg = client.test_connection()
                if not ok:
                    return self._send_error(f"Cannot connect to Supabase: {msg}", 400)
                all_orders = db.list_orders(limit=100000).get("orders", [])
                push_ok, push_msg = client.push_orders(all_orders)
                if not push_ok:
                    return self._send_error(f"Orders backup failed: {push_msg}", 500)
                
                # Push settings
                client.push_settings(db.get_all_settings())

                # Push users & worker credentials
                all_users = db.list_users(include_password=True)
                u_ok, u_msg = client.push_users(all_users)
                if not u_ok:
                    return self._send_error(f"Orders backed up, but Worker Logins backup failed: {u_msg}. Please ensure the 'users' table exists in Supabase by running the SQL script from Cloud Sync settings.", 500)

                return self._send_json({
                    "success": True, 
                    "count": len(all_orders),
                    "user_count": len(all_users),
                    "message": f"Successfully backed up {len(all_orders)} orders and {len(all_users)} worker logins to Supabase cloud!"
                })

            elif path == "/api/sync/supabase/restore":
                url = body.get("url") or db.get_setting("supabase_url")
                key = body.get("key") or db.get_setting("supabase_key")
                if not url or not key:
                    return self._send_error("Supabase URL and API Key are required.", 400)
                client = SupabaseClient(url, key)
                pull_ok, cloud_orders = client.pull_orders()
                if not pull_ok:
                    return self._send_error(f"Failed to fetch orders from Supabase: {cloud_orders}", 500)
                restored = 0
                for o in cloud_orders:
                    tok = o.get("token")
                    if not tok: continue
                    ex = db.get_order(tok)
                    if not ex:
                        db.insert_order(o)
                        restored += 1
                    else:
                        db.update_order(tok, **o)
                        restored += 1
                
                # Restore users
                u_ok, cloud_users = client.pull_users()
                if u_ok and isinstance(cloud_users, list):
                    for u in cloud_users:
                        uname = u.get("username")
                        if not uname: continue
                        existing_u = db.get_user_by_username(uname)
                        if not existing_u:
                            db.create_user(uname, u.get("password") or "123", u.get("full_name") or uname, u.get("role", "employee"), u.get("staff_name", ""), u.get("phone", ""))

                return self._send_json({"success": True, "count": restored, "message": f"Successfully restored {restored} orders and user logins from Supabase cloud into local storage!"})

            elif path == "/api/fix-firewall":
                bat_file = os.path.join(BASE_DIR, "fix_wifi_and_tailscale.bat")
                if not os.path.exists(bat_file):
                    bat_file = os.path.join(os.path.dirname(BASE_DIR), "fix_wifi_and_tailscale.bat")
                try:
                    cmd = f'powershell -Command "Start-Process \'{bat_file}\' -Verb RunAs"'
                    subprocess.Popen(cmd, shell=True)
                    return self._send_json({
                        "success": True, 
                        "message": "Firewall configuration launched! Please click 'Yes' on the Windows permission prompt on your computer."
                    })
                except Exception as ex:
                    return self._send_error(f"Failed to launch firewall tool: {ex}", 500)

            else:
                return self._send_error("Endpoint not found", 404)

        except Exception as e:
            return self._send_error(str(e), 500)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_json()

        try:
            if path.startswith("/api/users/"):
                uid = int(path[len("/api/users/"):])
                upd, msg = db.update_user(uid, body)
                if not upd:
                    return self._send_error(msg, 400)
                threading.Thread(target=auto_backup_users_to_supabase, daemon=True).start()
                return self._send_json(upd)

            elif path.startswith("/api/orders/"):
                tok = urllib.parse.unquote(path[len("/api/orders/"):])
                upd = db.update_order(tok, **body)
                if upd:
                    try:
                        generate_order_document(upd, db.get_all_settings(), BASE_DIR)
                    except Exception as e:
                        print(f"[Order PDF Gen Error] {e}")
                    threading.Thread(target=auto_backup_order_to_supabase, args=(upd,), daemon=True).start()
                return self._send_json(upd)

            elif path.startswith("/api/staff/") and path.endswith("/rates"):
                sid = int(path[len("/api/staff/"):-len("/rates")])
                rates = body.get("rates", {})
                upd = db.set_staff_rates(sid, rates)
                return self._send_json(upd)

            elif path.startswith("/api/staff/"):
                sid = int(path[len("/api/staff/"):])
                name = body.get("name")
                phone = body.get("phone")
                avail = body.get("available")
                upd = db.update_staff(sid, name=name, phone=phone, available=avail)
                return self._send_json(upd)

            else:
                return self._send_error("Endpoint not found", 404)

        except Exception as e:
            return self._send_error(str(e), 500)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_json()

        try:
            if path.startswith("/api/users/"):
                uid = int(path[len("/api/users/"):])
                secret_pwd = (body or {}).get("secret_password")
                ok, msg = db.delete_user(uid, secret_password=secret_pwd)
                if not ok:
                    return self._send_error(msg, 400)
                threading.Thread(target=auto_backup_users_to_supabase, daemon=True).start()
                return self._send_json({"success": True, "message": msg})

            elif path.startswith("/api/orders/"):
                tok = urllib.parse.unquote(path[len("/api/orders/"):])
                pwd = body.get("password")
                ok, msg = db.delete_orders([tok], password=pwd)
                if not ok:
                    return self._send_error(msg, 401)
                return self._send_json({"success": True, "message": msg})
            else:
                return self._send_error("Endpoint not found", 404)
        except Exception as e:
            return self._send_error(str(e), 500)

def run_server(port=5000):
    ensure_studio_bundle()
    server_address = ("0.0.0.0", port)
    httpd = ThreadedHTTPServer(server_address, StudioRequestHandler)
    net = get_network_details()
    
    print("\n" + "=" * 70)
    print("  ✂️   7 ART TAILORS — ENTERPRISE STUDIO (MULTI-DEVICE SUITE)")
    print("=" * 70)
    print("  [✓] Zero dependencies, 100% Free & Open Web Architecture")
    print("  [✓] Database: Isolated SQLite 'studio.db' (Pristine Clean State)")
    print("  [✓] Multi-Role: Authority (Owner/Admin) & Employee Worker Portal")
    print("-" * 70)
    print("  CONNECTIVITY OPTIONS:")
    print(f"  1. THIS PC / COUNTER     :  http://localhost:{port}")
    if net["wifi_ips"]:
        for wip in net["wifi_ips"]:
            print(f"  2. IN-SHOP WI-FI (PHONES):  http://{wip}:{port}")
    if net["tailscale_ips"]:
        for tip in net["tailscale_ips"]:
            print(f"  3. WORLDWIDE ANYWHERE    :  http://{tip}:{port}  (via Tailscale)")
    print("-" * 70)
    print("  DEFAULT LOGIN CREDENTIALS:")
    print("  • Authority (Owner) :  admin    /  admin")
    print("  • Employee (Worker) :  aman     /  123   (or saini / 123)")
    print("=" * 70 + "\n")
    
    # Start SSH reverse tunnel only for local counter PC (skip in cloud environments)
    is_cloud = bool(os.environ.get("RENDER") or os.environ.get("RAILWAY_ENVIRONMENT") or os.environ.get("DYNO") or os.environ.get("FLY_ALLOC_ID"))
    if not is_cloud:
        start_tunnel_in_background(port)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStudio server closed.")
        httpd.server_close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)

