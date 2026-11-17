import os
import io
import csv
import json
from datetime import datetime

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    OPENPYXL_AVAILABLE = True
except ImportError:
    OPENPYXL_AVAILABLE = False

EXPORT_HEADERS = [
    "Token", "Customer", "Phone", "Garments", "Order Date", "Delivery Date",
    "Status", "Urgent", "Total (₹)", "Advance (₹)", "Balance (₹)",
    "Payment Mode", "Notes", "Measurements", "Cutting Master", "Sewing Tailor", "Delivered At"
]
WORK_HEADERS = ["Token", "Customer", "Status", "Garment", "Piece #", "Cutting Master", "Cut Slip #", "Sewing Tailor", "Sew Slip #"]
SLIP_HEADERS = ["Slip #", "Date", "Worker", "Role", "Pieces", "Items Summary", "Gross (₹)", "Advance Deduct (₹)", "Total Deduct (₹)", "Net (₹)", "Advance Due After (₹)", "Note"]
ADV_HEADERS = ["Date", "Worker", "Role", "Type", "Amount (₹)", "Slip #", "Note"]
STAFF_HEADERS = ["Name", "Role", "Phone", "Available", "Price List Rates"]

ROLE_LABEL = {"cutting": "Cutting Master", "sewing": "Sewing Tailor"}

def fmt_num(x):
    try:
        x = float(x or 0)
        return f"{x:.0f}" if abs(x - round(x)) < 0.005 else f"{x:.2f}"
    except Exception:
        return str(x)

def fmt_dt(iso):
    d = (iso or "").replace("T", " ")
    try:
        return datetime.strptime(d[:16], "%Y-%m-%d %H:%M").strftime("%d-%m-%Y %H:%M")
    except Exception:
        return d

def garment_text(o):
    garments = o.get("garments") or []
    if isinstance(garments, str):
        try:
            garments = json.loads(garments)
        except Exception:
            garments = []
    return ", ".join(f"{g.get('qty', 1)}x {g.get('name', '')}" for g in garments)

def measurement_text(o):
    meas = o.get("measurements") or {}
    if isinstance(meas, str):
        try:
            meas = json.loads(meas)
        except Exception:
            meas = {}
    out = []
    for g, fields in meas.items():
        if isinstance(fields, dict):
            f_str = ", ".join(f"{k}: {v}" for k, v in fields.items() if v)
            if f_str:
                out.append(f"{g} [{f_str}]")
    return "; ".join(out)

def generate_excel_bytes(db):
    if not OPENPYXL_AVAILABLE:
        return None

    orders_res = db.list_orders(page=1, limit=100000)
    orders = orders_res.get("orders", [])

    main_rows = [
        [
            o["token"], o["customer"], o["phone"], garment_text(o), o["order_date"], o["delivery_date"],
            o["status"], "YES" if o.get("urgent") else "", o["total"], o["advance"], o["balance"],
            o["pay_mode"], (o.get("notes") or "").replace("\n", " "), measurement_text(o),
            o.get("cutting_master") or "", o.get("sewing_tailor") or "", o.get("delivered_at") or ""
        ]
        for o in orders
    ]

    work_rows = []
    for o in orders:
        pieces = o.get("work") or []
        for pc in pieces:
            work_rows.append([
                o["token"], o["customer"], o["status"], pc.get("g", ""), pc.get("n", 1),
                pc.get("cut") or "", pc.get("cut_slip") or "", pc.get("sew") or "", pc.get("sew_slip") or ""
            ])

    slips = db.list_salary_slips()
    slip_rows = [
        [
            sl["slip_no"], fmt_dt(sl["created_at"]), sl["worker"], ROLE_LABEL.get(sl["role"], sl["role"]), len(sl.get("items", [])),
            "; ".join(f"{i.get('token')} {i.get('garment')} #{i.get('n')} ₹{fmt_num(i.get('rate'))}" for i in sl.get("items", [])),
            sl["gross"], sl.get("advance") or 0, sl["deduction"], sl["net"], sl.get("adv_due") or 0, sl.get("note") or ""
        ]
        for sl in slips
    ]

    advances = db.list_advances()
    adv_rows = [
        [
            fmt_dt(e["created_at"]), e["worker"], ROLE_LABEL.get(e["role"], e["role"]),
            "Advance given" if e["kind"] == "given" else "Advance settled", e["amount"], e.get("slip_no") or "", e.get("note") or ""
        ]
        for e in advances
    ]

    staff = db.list_staff()
    staff_rows = [
        [
            p["name"], ROLE_LABEL.get(p["role"], p["role"]), p.get("phone") or "", "Yes" if p["available"] else "No",
            ", ".join(f"{g}: ₹{fmt_num(r)}" for g, r in (p.get("rates") or {}).items())
        ]
        for p in staff
    ]

    sheets = [
        ("Live Orders", EXPORT_HEADERS, main_rows, (8, 9, 10), (13,)),
        ("Work Assignment", WORK_HEADERS, work_rows, (), ()),
        ("Salary Slips", SLIP_HEADERS, slip_rows, (6, 7, 8, 9, 10), (5,)),
        ("Advances", ADV_HEADERS, adv_rows, (4,), (6,)),
        ("Staff & Price Lists", STAFF_HEADERS, staff_rows, (), (4,))
    ]

    wb = Workbook()
    thin = Side(style="thin", color="D1D5DB")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)
    head_fill = PatternFill("solid", start_color="1F1A17", end_color="1F1A17")

    for n, (title, headers, rows, money_cols, wrap_cols) in enumerate(sheets):
        ws = wb.active if n == 0 else wb.create_sheet()
        ws.title = title
        ws.append(headers)
        for r in rows:
            ws.append(r)
        for c in ws[1]:
            c.font = Font(bold=True, color="FAF8F5")
            c.fill = head_fill
            c.border = border
            c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        for row in ws.iter_rows(min_row=2):
            for c in row:
                c.border = border
                c.alignment = Alignment(vertical="center")
            for idx in money_cols:
                row[idx].number_format = "#,##0.00"
            for idx in wrap_cols:
                row[idx].alignment = Alignment(vertical="center", wrap_text=True)
        for i, col in enumerate(ws.columns, start=1):
            longest = max((len(str(c.value)) if c.value is not None else 0) for c in col)
            ws.column_dimensions[get_column_letter(i)].width = min(max(12, longest + 3), 60)
        ws.freeze_panes = "A2"

    bio = io.BytesIO()
    wb.save(bio)
    bio.seek(0)
    return bio.getvalue()

