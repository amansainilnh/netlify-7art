import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.db import StudioDatabase
from backend.server import get_network_details

db = StudioDatabase()
print("Testing Studio DB...")

# Test 1: Seeded Users
users = db.list_users()
print(f"[✓] Total Users in DB: {len(users)}")
admin = next((u for u in users if u["username"] == "admin"), None)
assert admin is not None, "Admin not found"
assert admin["role"] == "authority", "Admin role mismatch"

# Test 2: Authentication
auth_admin = db.authenticate_user("admin", "admin")
assert auth_admin is not None, "Admin auth failed"
assert auth_admin["role"] == "authority"
print("[✓] Authority Authentication: PASS (admin / admin)")

auth_emp = db.authenticate_user("aman", "123")
assert auth_emp is not None, "Employee auth failed"
assert auth_emp["role"] == "employee"
print("[✓] Employee Authentication: PASS (aman / 123)")

assert db.authenticate_user("admin", "wrong_pass") is None
print("[✓] Invalid Password Rejection: PASS")

# Test 3: User CRUD & Safety Constraints
u_new, msg = db.create_user("vikas", "pass123", "Vikas Tailor", "employee", "vikas", "9898989898")
assert u_new is not None, f"Create user failed: {msg}"
u_upd, msg = db.update_user(u_new["id"], {"phone": "9111111111"})
assert u_upd["phone"] == "9111111111"

# Try to delete the only admin
del_adm_ok, del_msg = db.delete_user(admin["id"])
assert not del_adm_ok, "Should not allow deleting only authority"
print("[✓] Authority Deletion Protection: PASS")

# Delete temporary user
del_ok, _ = db.delete_user(u_new["id"])
assert del_ok

# Test 4: Worker Portal logic
wp = db.get_worker_portal_data("aman")
assert "pieces" in wp
assert "total_assigned" in wp
print("[✓] Worker Portal Data Query: PASS")

# Test 5: Network Details
net = get_network_details()
print(f"[✓] Network Info: WiFi IPs = {net['wifi_ips']}, Tailscale IPs = {net['tailscale_ips']}")

print("\n=========================================")
print("  ALL BACKEND & AUTH TESTS PASSED 100%!  ")
print("=========================================")

