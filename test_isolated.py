import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.db import StudioDatabase
from backend.excel_export import generate_excel_bytes

def test_isolated_suite():
    print("==============================================================")
    print("  VERIFYING ISOLATED 7 ART TAILORS STUDIO SUITE")
    print("==============================================================")
    
    db = StudioDatabase()
    
    # 1. Check clean initial state
    orders = db.list_orders(page=1, limit=10)
    print(f"✔ Initial Orders in Database: {orders['total']} (Completely Clean & Isolated)")
    assert orders['total'] == 0, "Expected clean orders table"
    
    # 2. Check Settings
    sett = db.get_all_settings()
    print(f"✔ Studio Name: {sett.get('shop_name')}")
    print(f"✔ Owner Name: {sett.get('owner_name')}")
    print(f"✔ Token Prefix: {sett.get('token_prefix')}, Counter: {sett.get('token_counter')}")
    print(f"✔ Catalog Garments: {len(sett.get('garments', {}))} garment types pre-configured")
    
    # 3. Check Staff Roster
    staff = db.list_staff()
    print(f"✔ Staff Roster: {len(staff)} workers pre-seeded with clean advance balances:")
    for s in staff:
        print(f"   • {s['name']} ({s['role']}): ₹{s['advance_due']} advance due")
        assert s['advance_due'] == 0.0, "Fresh staff should start with ₹0 advance due"

    # 4. Test Booking an Order
    tok, prefix, cnt = db.get_next_token()
    print(f"\n✔ Generating New Order Token: {tok}")
    order_data = {
        "token": tok,
        "customer": "Vikram Rathore",
        "phone": "9829099999",
        "garments": [{"name": "Suit / Blazer", "qty": 1, "rate": 3500.0}],
        "measurements": {"Suit / Blazer": {"Coat Length": "29.5", "Chest": "40", "Waist": "34"}},
        "notes": "Premium Italian wool fabric",
        "order_date": "12-11-2026",
        "delivery_date": "19-11-2026",
        "urgent": True,
        "total": 3500.0,
        "advance": 1500.0,
        "pay_mode": "UPI",
        "cutting_master": "aman",
        "sewing_tailor": "saini"
    }
    saved = db.insert_order(order_data)
    print(f"✔ Order Successfully Booked: {saved['token']} for {saved['customer']} (Balance: ₹{saved['balance']})")
    assert saved['balance'] == 2000.0

    # 5. Check Next Token Auto-Incremented
    next_tok, _, next_cnt = db.get_next_token()
    print(f"✔ Next Token Automatically Incremented: {next_tok} (counter={next_cnt})")
    assert next_cnt > cnt, "Token counter should increment"

    # 6. Test Excel Export Generation
    excel_bytes = generate_excel_bytes(db)
    print(f"✔ Live Excel Workbook Generated: {len(excel_bytes)} bytes")
    assert len(excel_bytes) > 5000, "Workbook should be generated cleanly"

    print("\n==============================================================")
    print("  ALL ISOLATED SUITE VERIFICATIONS PASSED 100%! ✔")
    print("==============================================================")

if __name__ == "__main__":
    test_isolated_suite()

