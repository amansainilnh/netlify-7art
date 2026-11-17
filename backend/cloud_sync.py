import json
import urllib.request
import urllib.error
from datetime import datetime

class SupabaseClient:
    def __init__(self, url, key):
        self.url = (url or "").rstrip("/")
        self.key = key or ""

    def is_configured(self):
        return bool(self.url and self.key)

    def _request(self, method, path, body=None, prefer=None, timeout=15):
        if not self.is_configured():
            raise ValueError("Supabase URL and API Key are required")

        full_url = self.url + path
        headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json"
        }
        if prefer:
            headers["Prefer"] = prefer

        data = json.dumps(body).encode("utf-8") if body is not None else None
        req = urllib.request.Request(full_url, data=data, headers=headers, method=method)

        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content = resp.read()
            return content

    def test_connection(self):
        if not self.is_configured():
            return False, "Supabase URL and API Key are required."
        
        tables_to_check = [
            ("orders", "token"),
            ("users", "username"),
            ("app_settings", "key")
        ]
        missing = []
        for tbl, col in tables_to_check:
            try:
                self._request("GET", f"/rest/v1/{tbl}?select={col}&limit=1")
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    missing.append(tbl)
                else:
                    try:
                        err_body = e.read().decode("utf-8")
                    except Exception:
                        err_body = e.reason
                    return False, f"Supabase error accessing '{tbl}' (HTTP {e.code}): {err_body}"
            except Exception as e:
                return False, f"Connection failed: {str(e)}"

        if missing:
            return False, f"Connected to Supabase, but missing required table(s): {', '.join(missing)}. Please copy the SQL Schema from Cloud Sync settings and run it in the Supabase SQL Editor."

        return True, "Connection successful! All cloud tables ('orders', 'users', 'app_settings') are active and verified."

    @staticmethod
    def sanitize_order(o):
        garments = o.get("garments", "{}")
        if isinstance(garments, (dict, list)):
            garments = json.dumps(garments)
        measurements = o.get("measurements", "{}")
        if isinstance(measurements, (dict, list)):
            measurements = json.dumps(measurements)
        work = o.get("work", "[]")
        if isinstance(work, (dict, list)):
            work = json.dumps(work)

        return {
            "token": str(o.get("token", "")),
            "customer": str(o.get("customer") or ""),
            "phone": str(o.get("phone") or ""),
            "garments": str(garments or "{}"),
            "measurements": str(measurements or "{}"),
            "notes": str(o.get("notes") or ""),
            "order_date": str(o.get("order_date") or ""),
            "delivery_date": str(o.get("delivery_date") or ""),
            "status": str(o.get("status") or "New Order"),
            "urgent": bool(o.get("urgent")),
            "total": float(o.get("total") or 0.0),
            "advance": float(o.get("advance") or 0.0),
            "balance": float(o.get("balance") or 0.0),
            "pay_mode": str(o.get("pay_mode") or "Pending"),
            "delivered_at": str(o.get("delivered_at") or ""),
            "cutting_master": str(o.get("cutting_master") or ""),
            "sewing_tailor": str(o.get("sewing_tailor") or ""),
            "work": str(work or "[]"),
            "updated_at": str(o.get("updated_at") or datetime.now().isoformat())
        }

    def push_orders(self, orders_list):
        if not orders_list:
            return True, "No orders to push"
        sanitized = [self.sanitize_order(o) for o in orders_list if o.get("token")]
        if not sanitized:
            return True, "No valid orders found"

        try:
            # Batch in chunks of 50
            chunk_size = 50
            for i in range(0, len(sanitized), chunk_size):
                chunk = sanitized[i:i + chunk_size]
                self._request(
                    "POST",
                    "/rest/v1/orders?on_conflict=token",
                    chunk,
                    prefer="resolution=merge-duplicates,return=minimal"
                )
            return True, f"Successfully backed up {len(sanitized)} order(s) to Supabase!"
        except urllib.error.HTTPError as e:
            try:
                err_detail = e.read().decode("utf-8")
            except Exception:
                err_detail = e.reason
            return False, f"Supabase error HTTP {e.code}: {err_detail}"
        except Exception as e:
            return False, f"Push failed: {str(e)}"

    def pull_orders(self):
        try:
            raw = self._request("GET", "/rest/v1/orders?select=*")
            orders = json.loads(raw.decode("utf-8"))
            return True, orders
        except Exception as e:
            return False, str(e)

    @staticmethod
    def sanitize_user(u):
        data = {
            "username": str(u.get("username") or "").strip(),
            "password": str(u.get("password") or ""),
            "full_name": str(u.get("full_name") or ""),
            "role": str(u.get("role") or "employee"),
            "staff_name": str(u.get("staff_name") or ""),
            "phone": str(u.get("phone") or ""),
            "active": bool(u.get("active", True)),
            "last_login": str(u.get("last_login") or ""),
            "created_at": str(u.get("created_at") or "")
        }
        if u.get("id") is not None:
            try:
                data["id"] = int(u["id"])
            except Exception:
                pass
        return data

    def push_users(self, users_list):
        if not users_list:
            return True, "No users to push"
        sanitized = [self.sanitize_user(u) for u in users_list if u.get("username")]
        if not sanitized:
            return True, "No valid users"

        # 1. Try on_conflict=username
        try:
            self._request(
                "POST",
                "/rest/v1/users?on_conflict=username",
                sanitized,
                prefer="resolution=merge-duplicates,return=minimal"
            )
            return True, f"Successfully backed up {len(sanitized)} user credentials to Supabase!"
        except urllib.error.HTTPError as e:
            try:
                err_detail = e.read().decode("utf-8")
            except Exception:
                err_detail = str(e.reason)

            # 2. Fallback: on_conflict=id if schema has primary key on id
            if "on_conflict" in err_detail.lower() or "constraint" in err_detail.lower() or "unique" in err_detail.lower():
                try:
                    self._request(
                        "POST",
                        "/rest/v1/users?on_conflict=id",
                        sanitized,
                        prefer="resolution=merge-duplicates,return=minimal"
                    )
                    return True, f"Successfully backed up {len(sanitized)} user credentials to Supabase!"
                except Exception:
                    pass

            # 3. Fallback: standard POST with merge-duplicates header
            try:
                self._request(
                    "POST",
                    "/rest/v1/users",
                    sanitized,
                    prefer="resolution=merge-duplicates,return=minimal"
                )
                return True, f"Successfully backed up {len(sanitized)} user credentials to Supabase!"
            except Exception:
                pass

            return False, f"Supabase users error HTTP {e.code}: {err_detail}"
        except Exception as e:
            return False, f"User push failed: {str(e)}"

    def pull_users(self):
        try:
            raw = self._request("GET", "/rest/v1/users?select=*")
            users = json.loads(raw.decode("utf-8"))
            return True, users
        except urllib.error.HTTPError as e:
            try:
                err_detail = e.read().decode("utf-8")
            except Exception:
                err_detail = e.reason
            return False, f"HTTP {e.code}: {err_detail}"
        except Exception as e:
            return False, str(e)

    def push_settings(self, settings_dict):
        rows = [{"key": k, "value": str(v)} for k, v in settings_dict.items() if not k.startswith("supabase_")]
        if not rows:
            return True, "No settings"
        try:
            self._request(
                "POST",
                "/rest/v1/app_settings?on_conflict=key",
                rows,
                prefer="resolution=merge-duplicates,return=minimal"
            )
            return True, "Settings backed up"
        except urllib.error.HTTPError as e:
            try:
                err_detail = e.read().decode("utf-8")
            except Exception:
                err_detail = e.reason
            return False, f"Supabase app_settings error HTTP {e.code}: {err_detail}"
        except Exception as e:
            return False, str(e)
