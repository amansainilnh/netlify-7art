import sys
import os
import time
import json
import urllib.request
import urllib.parse
from threading import Thread

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.server import ThreadedHTTPServer, StudioRequestHandler

TEST_PORT = 5002
server = None

def start_test_server():
    global server
    server = ThreadedHTTPServer(("127.0.0.1", TEST_PORT), StudioRequestHandler)
    server.serve_forever()

def http_req(path, method="GET", body=None):
    url = f"http://127.0.0.1:{TEST_PORT}{path}"
    headers = {"Content-Type": "application/json"} if body else {}
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run():
    print(f"Starting test server on port {TEST_PORT}...")
    t = Thread(target=start_test_server, daemon=True)
    t.start()
    time.sleep(0.8)

    try:
        # Test 1: Network info
        status, data = http_req("/api/network-info")
        assert status == 200, f"Network info status {status}"
        assert "wifi_ips" in data
        assert "tailscale_ips" in data
        print(f"[✓] GET /api/network-info -> 200 OK (WiFi: {data['wifi_ips']}, Tailscale: {data['tailscale_ips']})")

        # Test 2: Authority Login
        status, data = http_req("/api/auth/login", method="POST", body={"username": "admin", "password": "admin"})
        assert status == 200, f"Authority login failed: {data}"
        assert data["user"]["role"] == "authority"
        print(f"[✓] POST /api/auth/login (Authority: {data['user']['full_name']}) -> 200 OK")

        # Test 3: Employee Login
        status, data = http_req("/api/auth/login", method="POST", body={"username": "aman", "password": "123"})
        assert status == 200, f"Employee login failed: {data}"
        assert data["user"]["role"] == "employee"
        print(f"[✓] POST /api/auth/login (Employee: {data['user']['full_name']}) -> 200 OK")

        # Test 4: Bad Login
        status, data = http_req("/api/auth/login", method="POST", body={"username": "admin", "password": "wrong"})
        assert status == 401
        print(f"[✓] POST /api/auth/login (Bad Password) -> 401 Unauthorized")

        # Test 5: List Users
        status, users = http_req("/api/users")
        assert status == 200
        assert len(users) >= 8
        print(f"[✓] GET /api/users -> 200 OK ({len(users)} registered users)")

        # Test 6: Worker Portal Data
        status, wp = http_req("/api/worker-portal/my-work?worker=aman")
        assert status == 200
        assert wp["worker"] == "aman"
        print(f"[✓] GET /api/worker-portal/my-work?worker=aman -> 200 OK (Role: {wp['role']})")

        # Test 7: Create Order & Worker Piece Update
        tok_status, tok_data = http_req("/api/orders/next-token")
        tok = tok_data["token"]

        order_payload = {
            "token": tok,
            "customer": "Vikram Rathore",
            "phone": "9829099999",
            "garments": [{"name": "Kurta / Pajama", "qty": 1, "rate": 800.0}],
            "measurements": {"Kurta / Pajama": {"Length": "38", "Chest": "38"}},
            "delivery_date": "18-11-2026",
            "total": 800.0,
            "advance": 300.0,
            "cutting_master": "aman",
            "sewing_tailor": "saini"
        }
        status, new_ord = http_req("/api/orders", method="POST", body=order_payload)
        assert status == 201

        # Check Aman's portal now has 1 pending piece
        status, wp_after = http_req("/api/worker-portal/my-work?worker=aman")
        assert status == 200
        assert wp_after["total_assigned"] >= 1

        # Aman marks piece cutting done from mobile
        status, upd_res = http_req("/api/worker-portal/update-piece", method="POST", body={
            "token": tok,
            "garment": "Kurta / Pajama",
            "piece_n": 1,
            "worker_role": "cutting",
            "mark_done": True
        })
        assert status == 200
        print(f"[✓] POST /api/worker-portal/update-piece -> 200 OK (Piece cutting marked done!)")

        # Settle order and clean up test order
        status, del_res = http_req("/api/orders/delete", method="POST", body={"tokens": [tok], "password": "admin"})
        assert status == 200
        print(f"[✓] POST /api/orders/delete -> 200 OK (Cleaned up test token {tok})")

        print("\n" + "=" * 55)
        print("  ALL E2E HTTP TESTS (ROLES, NETWORK, WORKER) PASSED!")
        print("=" * 55)

    finally:
        if server:
            server.shutdown()

if __name__ == "__main__":
    run()

