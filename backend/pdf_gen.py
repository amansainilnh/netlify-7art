"""
7 ART TAILORS - AUTOMATIC PDF & RECEIPT GENERATOR
Generates standalone, printable PDF and HTML documents on the local device
for Orders, Salary Slips, and Advance Vouchers.
"""

import os
import io
import json
import re
from datetime import datetime

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    Image = None
    ImageDraw = None
    ImageFont = None

class UnicodePDF:
    """
    High-fidelity Unicode & Devanagari/Hindi compliant PDF generator.
    Renders vector-clear documents at 144 DPI (scale=2.0) with native TrueType fonts
    (Nirmala UI / Mangal / Arial) so Hindi text is rendered perfectly with zero '????'.
    """
    def __init__(self, scale=2.0):
        self.scale = scale
        self.width_pt = 595.28   # Standard A4 width in points (72 pt/inch)
        self.height_pt = 841.89  # Standard A4 height in points
        self.width_px = int(self.width_pt * self.scale)
        self.height_px = int(self.height_pt * self.scale)
        self.pages = []
        self._init_fonts()
        self.new_page()

    def _init_fonts(self):
        candidate_fonts = [
            r"C:\Windows\Fonts\Nirmala.ttc",
            r"C:\Windows\Fonts\mangal.ttf",
            r"C:\Windows\Fonts\aparaj.ttf",
            r"C:\Windows\Fonts\arial.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
            "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
        ]
        self.font_path = None
        for p in candidate_fonts:
            if os.path.exists(p):
                self.font_path = p
                break
        self._font_cache = {}

    def _get_font(self, size_pt, bold=False):
        if not PIL_AVAILABLE or not ImageFont:
            return None
        cache_key = (size_pt, bold)
        if cache_key in self._font_cache:
            return self._font_cache[cache_key]
        px_size = max(int(size_pt * self.scale), 8)
        font = None
        if self.font_path:
            try:
                font = ImageFont.truetype(self.font_path, px_size)
            except Exception:
                pass
        if not font:
            font = ImageFont.load_default()
        self._font_cache[cache_key] = font
        return font

    def new_page(self):
        if not PIL_AVAILABLE or not Image or not ImageDraw:
            self.pages.append({"img": None, "draw": None})
            return
        img = Image.new("RGB", (self.width_px, self.height_px), (255, 255, 255))
        draw = ImageDraw.Draw(img)
        self.pages.append({"img": img, "draw": draw})

    @property
    def current(self):
        return self.pages[-1]

    def _convert_color(self, c):
        if not c:
            return (0, 0, 0)
        if isinstance(c, (list, tuple)):
            if len(c) == 3:
                if any(isinstance(x, float) and x <= 1.0 for x in c):
                    return (int(c[0]*255), int(c[1]*255), int(c[2]*255))
                return (int(c[0]), int(c[1]), int(c[2]))
        return (0, 0, 0)

    def rect(self, x, y, w, h, fill=None, stroke=True, stroke_color=(0, 0, 0), stroke_width=0.7):
        top = (self.height_pt - (y + h)) * self.scale
        bottom = (self.height_pt - y) * self.scale
        left = x * self.scale
        right = (x + w) * self.scale

        fill_col = self._convert_color(fill) if fill else None
        stroke_col = self._convert_color(stroke_color) if stroke else None
        line_w = max(int(stroke_width * self.scale), 1)

        draw = self.current["draw"]
        if fill_col and stroke_col:
            draw.rectangle([left, top, right, bottom], fill=fill_col, outline=stroke_col, width=line_w)
        elif fill_col:
            draw.rectangle([left, top, right, bottom], fill=fill_col)
        elif stroke_col:
            draw.rectangle([left, top, right, bottom], outline=stroke_col, width=line_w)

    def line(self, x1, y1, x2, y2, width=0.5, color=(0, 0, 0)):
        left1 = x1 * self.scale
        top1 = (self.height_pt - y1) * self.scale
        left2 = x2 * self.scale
        top2 = (self.height_pt - y2) * self.scale
        col = self._convert_color(color)
        line_w = max(int(width * self.scale), 1)
        self.current["draw"].line([left1, top1, left2, top2], fill=col, width=line_w)

    def text(self, x, y, text, font="F1", size=10, bold=False, color=(0, 0, 0)):
        left = x * self.scale
        top = (self.height_pt - y - size * 0.95) * self.scale
        f = self._get_font(size, bold=bold)
        col = self._convert_color(color)
        clean = str(text or "")
        self.current["draw"].text((left, top), clean, fill=col, font=f)

    def build_bytes(self):
        buf = io.BytesIO()
        if not self.pages:
            self.new_page()
        first = self.pages[0]["img"]
        rest = [p["img"] for p in self.pages[1:]]
        first.save(buf, format="PDF", resolution=72.0 * self.scale, save_all=True, append_images=rest)
        return buf.getvalue()

    def save(self, filepath):
        import time
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        pdf_bytes = self.build_bytes()
        try:
            with open(filepath, "wb") as f:
                f.write(pdf_bytes)
            return filepath
        except PermissionError:
            dir_name = os.path.dirname(filepath)
            base_name, ext = os.path.splitext(os.path.basename(filepath))
            alt_path = os.path.join(dir_name, f"{base_name}_{int(time.time())}{ext}")
            try:
                with open(alt_path, "wb") as f:
                    f.write(pdf_bytes)
                return alt_path
            except Exception:
                return filepath

SimplePDF = UnicodePDF


def _safe_str(val):
    if val is None:
        return ""
    if isinstance(val, (dict, list)):
        return json.dumps(val)
    return str(val)

def _clean_filename(text):
    return "".join(c for c in text if c.isalnum() or c in ("-", "_", " ")).strip().replace(" ", "_")

def _normalize_garments(garments):
    if isinstance(garments, str):
        try:
            garments = json.loads(garments)
        except Exception:
            garments = {}
    normalized = []
    if isinstance(garments, list):
        for item in garments:
            if isinstance(item, dict):
                normalized.append({
                    "name": item.get("name", "Garment"),
                    "qty": int(item.get("qty") or item.get("quantity") or 1),
                    "rate": float(item.get("rate") or 0.0)
                })
            elif isinstance(item, str):
                normalized.append({"name": item, "qty": 1, "rate": 0.0})
    elif isinstance(garments, dict):
        for gname, count in garments.items():
            normalized.append({"name": str(gname), "qty": int(count or 1), "rate": 0.0})
    return normalized


# ----------------------------------------------------------------------
# 1. GENERATE ORDER PDF & HTML RECEIPT
# ----------------------------------------------------------------------
def generate_order_document(order, settings=None, base_dir=None):
    if not base_dir:
        base_dir = os.path.dirname(os.path.dirname(__file__))
    if not settings:
        settings = {}

    shop_name = settings.get("shop_name", "7 ART TAILORS")
    shop_phone = settings.get("shop_phone", "+91 98290 12345")
    shop_address = settings.get("shop_address", "Main Market Atelier")
    owner_name = settings.get("owner_name", "BHAGIRATH SAINI")

    token = order.get("token", "UNKNOWN")
    customer = order.get("customer", "Customer")
    phone = order.get("phone", "")
    order_date = order.get("order_date", datetime.now().strftime("%Y-%m-%d"))
    del_date = order.get("delivery_date", "Standard")
    status = order.get("status", "New Order")
    total = float(order.get("total") or 0.0)
    advance = float(order.get("advance") or 0.0)
    balance = float(order.get("balance") or (total - advance))
    pay_mode = order.get("pay_mode", "Pending")
    notes = order.get("notes", "")

    garments = order.get("garments", {})
    if isinstance(garments, str):
        try:
            garments = json.loads(garments)
        except Exception:
            garments = {}

    measurements = order.get("measurements", {})
    if isinstance(measurements, str):
        try:
            measurements = json.loads(measurements)
        except Exception:
            measurements = {}

    pieces = order.get("work", [])
    if isinstance(pieces, str):
        try:
            pieces = json.loads(pieces)
        except Exception:
            pieces = []
    if not isinstance(pieces, list):
        pieces = []

    receipts_dir = os.path.join(base_dir, "receipts", "orders")
    os.makedirs(receipts_dir, exist_ok=True)
    base_name = f"Order_{_clean_filename(token)}_{_clean_filename(customer)}"
    pdf_path = os.path.join(receipts_dir, f"{base_name}.pdf")
    html_path = os.path.join(receipts_dir, f"{base_name}.html")

    norm_garments = _normalize_garments(garments)

    # --- Write HTML Printable Slip ---
    garment_rows_html = ""
    for g in norm_garments:
        gname = g["name"]
        count = g["qty"]
        garment_rows_html += f"<tr><td style='padding: 6px 8px; border-bottom: 1px solid #ddd;'><strong>{gname}</strong></td><td style='padding: 6px 8px; border-bottom: 1px solid #ddd; text-align: center;'>{count} pc(s)</td></tr>"

    meas_html = ""
    if isinstance(measurements, dict):
        for gname, vals in measurements.items():
            if isinstance(vals, dict) and vals:
                meas_html += f"<div style='margin-top: 10px;'><strong>{gname} Measurements:</strong><br><span style='font-size: 12px; color: #555;'>"
                meas_parts = [f"{k}: {v}" for k, v in vals.items() if v]
                meas_html += " | ".join(meas_parts) + "</span></div>"

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order {token} - {customer}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #1F1A17; }}
    .slip {{ max-width: 600px; margin: 0 auto; border: 2px solid #9C4528; padding: 24px; border-radius: 8px; }}
    .header {{ text-align: center; border-bottom: 2px solid #EBE5DB; padding-bottom: 14px; margin-bottom: 16px; }}
    .title {{ font-size: 24px; font-weight: 800; color: #9C4528; margin: 0; }}
    .subtitle {{ font-size: 12px; color: #7D7571; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }}
    .grid {{ display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 13px; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }}
    th {{ background: #FAF8F5; text-align: left; padding: 8px; border-bottom: 2px solid #9C4528; }}
    .totals {{ margin-top: 16px; border-top: 2px solid #EBE5DB; padding-top: 10px; text-align: right; font-size: 14px; }}
    .balance {{ font-size: 18px; font-weight: 800; color: #DC2626; }}
    .footer {{ margin-top: 20px; text-align: center; font-size: 11px; color: #7D7571; border-top: 1px dashed #ccc; padding-top: 10px; }}
  </style>
</head>
<body>
  <div class="slip">
    <div class="header">
      <h1 class="title">{shop_name}</h1>
      <div class="subtitle">{shop_address} | Tel: {shop_phone} | Master: {owner_name}</div>
      <div style="margin-top: 8px; font-size: 15px; font-weight: bold; background: #FAF8F5; padding: 4px 10px; display: inline-block; border-radius: 4px;">
        ORDER INVOICE & WORKSHOP TAG
      </div>
    </div>
    <div class="grid">
      <div>
        <strong>TOKEN NO:</strong> <span style="font-size: 16px; font-weight: 800; color: #9C4528;">{token}</span><br>
        <strong>Order Date:</strong> {order_date}<br>
        <strong>Delivery Date:</strong> {del_date}
      </div>
      <div style="text-align: right;">
        <strong>Customer:</strong> <span style="font-size: 15px; font-weight: 700;">{customer}</span><br>
        <strong>Phone:</strong> {phone or 'Not provided'}<br>
        <strong>Payment Mode:</strong> {pay_mode}
      </div>
    </div>
    <table>
      <thead><tr><th>Garment Type</th><th style="text-align: center;">Quantity</th></tr></thead>
      <tbody>{garment_rows_html or '<tr><td colspan="2">Standard Bespoke Tailoring</td></tr>'}</tbody>
    </table>
    {f"<div style='margin-top: 10px; font-size: 12px; color: #666;'><strong>Notes:</strong> {notes}</div>" if notes else ""}
    <div class="totals">
      <div>Total Amount: <strong>Rs. {total:,.2f}</strong></div>
      <div>Advance Paid: <strong>Rs. {advance:,.2f}</strong> ({pay_mode})</div>
      <div class="balance">Balance Due: Rs. {balance:,.2f}</div>
    </div>
    <div class="footer">
      Please present this token slip at the time of delivery. Thank you for choosing {shop_name}!
    </div>
  </div>
</body>
</html>"""
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # --- Write Pure Vector PDF ---
    pdf = SimplePDF()
    # Header Banner
    pdf.rect(40, 750, 515, 55, fill=(0.96, 0.95, 0.93), stroke_color=(0.61, 0.27, 0.16), stroke_width=1.0)
    pdf.text(55, 785, shop_name.upper(), size=16, bold=True, color=(0.61, 0.27, 0.16))
    pdf.text(55, 765, f"{shop_address}  |  Tel: {shop_phone}  |  Master: {owner_name}", size=9, color=(0.3, 0.3, 0.3))

    # Token & Customer Info Box
    pdf.rect(40, 665, 515, 70, stroke_color=(0.8, 0.8, 0.8), stroke_width=0.7)
    pdf.text(55, 715, f"TOKEN: {token}", size=14, bold=True, color=(0.61, 0.27, 0.16))
    pdf.text(55, 695, f"Order Date: {order_date}", size=10)
    pdf.text(55, 678, f"Delivery Date: {del_date}", size=10, bold=True)

    pdf.text(320, 715, f"Client: {customer}", size=13, bold=True)
    pdf.text(320, 695, f"Phone: {phone or 'N/A'}", size=10)
    pdf.text(320, 678, f"Payment Mode: {pay_mode}", size=10)

    # Garments Table Header
    y = 635
    pdf.rect(40, y, 515, 22, fill=(0.95, 0.94, 0.92), stroke_color=(0.61, 0.27, 0.16), stroke_width=0.8)
    pdf.text(55, y + 6, "BOOKED GARMENT SERVICES", size=10, bold=True, color=(0.2, 0.2, 0.2))
    pdf.text(450, y + 6, "QUANTITY", size=10, bold=True, color=(0.2, 0.2, 0.2))

    y -= 20
    for g in norm_garments:
        gname = g["name"]
        count = g["qty"]
        pdf.line(40, y + 16, 555, y + 16, width=0.4, color=(0.85, 0.85, 0.85))
        pdf.text(55, y, str(gname), size=10, bold=True)
        pdf.text(465, y, f"{count} pc(s)", size=10)
        y -= 20

    # Note: Per requirement, measurements are removed from Customer Slip (Page 1)
    if notes:
        pdf.text(55, y, f"Remarks: {notes[:80]}", size=9, color=(0.4, 0.4, 0.4))
        y -= 20

    # Totals Box
    y_totals = max(y - 10, 480)
    pdf.rect(300, y_totals - 65, 255, 65, fill=(0.98, 0.98, 0.97), stroke_color=(0.8, 0.8, 0.8), stroke_width=0.8)
    pdf.text(315, y_totals - 20, f"Total Amount:     Rs. {total:,.2f}", size=11)
    pdf.text(315, y_totals - 36, f"Advance Paid:     Rs. {advance:,.2f}", size=11)
    pdf.text(315, y_totals - 56, f"BALANCE DUE:   Rs. {balance:,.2f}", size=12, bold=True, color=(0.75, 0.15, 0.15))

    # Terms & Signature footer
    pdf.line(40, y_totals - 90, 555, y_totals - 90, width=0.5, color=(0.7, 0.7, 0.7))
    pdf.text(55, y_totals - 108, "Customer Signature: _______________________", size=9, color=(0.4, 0.4, 0.4))
    pdf.text(370, y_totals - 108, "Atelier Authorized: _______________________", size=9, color=(0.4, 0.4, 0.4))
    pdf.text(140, y_totals - 130, f"Page 1 of 3: Customer Slip & Invoice  *  {shop_name}", size=8, color=(0.5, 0.5, 0.5))

    # ==================================================================
    # PAGE 2: RAW CLOTH CUTTING STAMPS & TAGS (Cut & Pin to Fabric)
    # ==================================================================
    pdf.new_page()

    # Header Banner
    pdf.rect(40, 750, 515, 55, fill=(0.96, 0.95, 0.93), stroke_color=(0.61, 0.27, 0.16), stroke_width=1.0)
    pdf.text(55, 785, f"{shop_name.upper()} - RAW CLOTH CUTTING STAMP TAGS", size=14, bold=True, color=(0.61, 0.27, 0.16))
    pdf.text(55, 765, f"Atelier Workshop Fabric Tags  |  Token #{token}  |  Customer: {customer} ({phone})", size=9, color=(0.3, 0.3, 0.3))

    y_stamp = 730
    # Preset fields dictionary for unpacking space-separated craft measurements
    garment_field_presets = {
        "Kurta / Pajama": ["Kurta Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Pajama Length", "Pajama Waist", "Bottom"],
        "Kurta": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip"],
        "Pajama": ["Length", "Waist", "Hip", "Bottom"],
        "Shirt & Pant": ["Shirt Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Pant Length", "Pant Waist", "Hip", "Thigh", "Bottom"],
        "Shirt": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck"],
        "Pant": ["Length", "Waist", "Hip", "Thigh", "Bottom"],
        "Suit / Blazer": ["Coat Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Pant Length", "Pant Waist", "Thigh"],
        "kot": ["Coat Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck"],
        "Coat": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck"],
        "Sherwani": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Pajama Length", "Bottom"],
        "Safari Suit": ["Shirt Length", "Chest", "Waist", "Shoulder", "Sleeve", "Pant Length", "Pant Waist", "Bottom"],
        "Sadri / Waistcoat": ["Length", "Chest", "Waist", "Shoulder"],
        "Indo Western": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Pajama Length"]
    }

    def unpack_meas_dict(g_name, m_dict):
        if not isinstance(m_dict, dict) or not m_dict:
            return []
        preset = garment_field_presets.get(g_name)
        if not preset:
            for k_p, v_p in garment_field_presets.items():
                if k_p.lower() == str(g_name).lower():
                    preset = v_p
                    break
        if not preset:
            preset = ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Bottom"]
        res = []
        flow_str = m_dict.get("_flow") or m_dict.get("flow") or ""
        clean_dict = {k: v for k, v in m_dict.items() if k not in ("_flow", "flow") and v is not None and str(v).strip()}

        has_space = any(len(str(v).strip().split()) > 1 for v in clean_dict.values())
        if not clean_dict and flow_str:
            toks = [t for t in re.sub(r"[()\[\]{}]", " ", str(flow_str)).replace(",", " ").replace(";", " ").split() if t]
            idx_f = 0
            for t in toks:
                c_num = t.replace('"', '').replace("'", "")
                try:
                    float(c_num)
                    lbl = preset[idx_f] if idx_f < len(preset) else f"M{idx_f+1}"
                    res.append((lbl, c_num))
                    idx_f += 1
                except ValueError:
                    pass
        elif has_space:
            idx_f = 0
            for k, v in clean_dict.items():
                toks = [t for t in re.sub(r"[()\[\]{}]", " ", str(v)).replace(",", " ").replace(";", " ").split() if t]
                if len(toks) > 1:
                    for tok in toks:
                        c_num = tok.replace('"', '').replace("'", "")
                        try:
                            float(c_num)
                            lbl = preset[idx_f] if idx_f < len(preset) else (k if idx_f == 0 else f"M{idx_f+1}")
                            res.append((lbl, c_num))
                            idx_f += 1
                        except ValueError:
                            pass
                else:
                    res.append((k, str(v).strip()))
                    idx_f += 1
        else:
            for k, v in clean_dict.items():
                res.append((k, str(v).strip()))
        if not res and flow_str:
            res.append(("MEASUREMENTS", str(flow_str).strip()))
        return res

    stamp_items = pieces if pieces else [{'g': g['name'], 'n': i+1} for i, g in enumerate(norm_garments)]
    if not stamp_items:
        stamp_items = [{'g': gname, 'n': i+1} for i, gname in enumerate(measurements.keys())]

    for idx, s_item in enumerate(stamp_items):
        if y_stamp < 200:
            break
        gname = s_item.get("g") or s_item.get("name") or "Garment"
        piece_num = s_item.get("n", idx + 1)

        # Draw Cut Ticket Stamp with Dashed border effect
        pdf.rect(40, y_stamp - 130, 515, 125, fill=(0.99, 0.99, 0.98), stroke_color=(0.75, 0.1, 0.15), stroke_width=1.2)
        pdf.text(48, y_stamp - 12, f"✂ - - - CUT TICKET ALONG BORDER & PIN TO RAW CLOTH - - - TAG #{piece_num} ✂", size=8, color=(0.6, 0.1, 0.1))
        
        # Token Stamp Badge inside ticket
        pdf.rect(48, y_stamp - 45, 130, 28, fill=(0.75, 0.1, 0.15), stroke_color=(0.5, 0.05, 0.08), stroke_width=1.0)
        pdf.text(55, y_stamp - 38, f"TOKEN: {token}", size=13, bold=True, color=(1.0, 1.0, 1.0))
        
        pdf.text(190, y_stamp - 30, f"{str(gname).upper()} (Piece #{piece_num})", size=12, bold=True, color=(0.15, 0.1, 0.1))
        pdf.text(190, y_stamp - 45, f"Client: {customer} · Delivery: {del_date}", size=9, color=(0.3, 0.3, 0.3))
        
        # Sizing / Shop Tape Flow for this piece
        pdf.line(48, y_stamp - 52, 545, y_stamp - 52, width=0.4, color=(0.8, 0.8, 0.8))
        pdf.text(48, y_stamp - 65, "SHOP TAPE FLOW:", size=9, bold=True, color=(0.75, 0.1, 0.15))
        
        m_vals = measurements.get(gname, {}) if isinstance(measurements, dict) else {}
        flow_str = m_vals.get("_flow") or m_vals.get("flow") or ""
        if not flow_str:
            unpacked_items = unpack_meas_dict(gname, m_vals)
            flow_str = " ".join(str(v) for _, v in unpacked_items if v)
        
        pdf.text(48, y_stamp - 80, flow_str or "Standard bespoke pattern sizing.", size=10, bold=True, color=(0.15, 0.1, 0.1))
            
        # Per-piece staff and note
        matched_g = next((g for g in norm_garments if g.get("name") == gname), {})
        p_cut = s_item.get("cut") or matched_g.get("cut") or order.get("cutting_master") or "Unassigned"
        p_sew = s_item.get("sew") or matched_g.get("sew") or order.get("sewing_tailor") or "Unassigned"
        p_note = s_item.get("notes") or matched_g.get("notes") or notes or "Standard cut"

        pdf.text(48, y_stamp - 110, f"Cutter: {p_cut}  |  Sew: {p_sew}  |  Note: {p_note[:45]}", size=8, color=(0.3, 0.3, 0.3))
        pdf.text(380, y_stamp - 122, "Cutter Sign: _____________", size=8, color=(0.4, 0.4, 0.4))
        
        y_stamp -= 140

    pdf.text(140, 30, f"Page 2 of 3: Raw Cloth Cutting Stamp Tags  *  {shop_name}", size=8, color=(0.5, 0.5, 0.5))

    # ==================================================================
    # PAGE 3: MASTER WORKSHOP JOB CARD (Full Tailoring Matrix)
    # ==================================================================
    pdf.new_page()

    # Header Banner
    pdf.rect(40, 750, 515, 55, fill=(0.96, 0.95, 0.93), stroke_color=(0.61, 0.27, 0.16), stroke_width=1.0)
    pdf.text(55, 785, f"{shop_name.upper()} - MASTER WORKSHOP JOB CARD", size=14, bold=True, color=(0.61, 0.27, 0.16))
    pdf.text(55, 765, f"Token #{token}  |  Customer: {customer}  |  Delivery: {del_date}", size=9, color=(0.3, 0.3, 0.3))

    # Shop Tape Flow Banner
    y = 715
    pdf.rect(40, y - 35, 515, 35, fill=(0.98, 0.97, 0.96), stroke_color=(0.75, 0.1, 0.15), stroke_width=1.0)
    pdf.text(55, y - 14, "SHOP TAPE FLOW:", size=9, bold=True, color=(0.75, 0.1, 0.15))
    
    flows = []
    if isinstance(measurements, dict):
        for gname, vals in measurements.items():
            if isinstance(vals, dict):
                f_txt = vals.get("_flow") or vals.get("flow")
                if not f_txt:
                    unpacked = unpack_meas_dict(gname, vals)
                    f_txt = " ".join(str(v) for _, v in unpacked if v)
                if f_txt:
                    flows.append(f"{gname}: {f_txt}")
    flow_display = "  |  ".join(flows) if flows else "Standard bespoke pattern sizing."
    pdf.text(55, y - 28, flow_display[:95], size=10, bold=True, color=(0.15, 0.1, 0.1))
    y -= 50

    # Tailoring & Styling Notes
    y = max(y - 10, 230)
    pdf.rect(40, y - 55, 515, 55, stroke_color=(0.8, 0.8, 0.8), stroke_width=0.7)
    pdf.text(55, y - 18, "STYLING & CRAFTING NOTES:", size=9, bold=True, color=(0.61, 0.27, 0.16))
    pdf.text(55, y - 36, f"{notes[:140] if notes else 'Standard bespoke styling per studio catalog specifications.'}", size=9, color=(0.2, 0.2, 0.2))

    # Workshop Verification & Signatures
    y = y - 70
    pdf.rect(40, y - 80, 515, 80, stroke_color=(0.7, 0.7, 0.7), stroke_width=0.8)
    pdf.text(55, y - 18, f"Cutting Master: {order.get('cutting_master') or 'Unassigned'}", size=9, bold=True)
    pdf.text(55, y - 36, "Cut Finished Date: _________   Sign: _________", size=9)
    pdf.text(55, y - 56, "[  ] Panels Cut Correctly", size=8, color=(0.3, 0.3, 0.3))

    pdf.text(320, y - 18, f"Sewing Tailor: {order.get('sewing_tailor') or 'Unassigned'}", size=9, bold=True)
    pdf.text(320, y - 36, "Stitch Finished Date: ______   Sign: _________", size=9)
    pdf.text(320, y - 56, "[  ] Quality Inspection Passed", size=8, color=(0.3, 0.3, 0.3))
    pdf.text(140, y - 98, f"Page 3 of 3: Master Workshop Job Card  *  {shop_name}", size=8, color=(0.5, 0.5, 0.5))

    pdf.save(pdf_path)
    return {"pdf": pdf_path, "html": html_path, "token": token}


# ----------------------------------------------------------------------
# 2. GENERATE SALARY SLIP PDF & HTML RECEIPT
# ----------------------------------------------------------------------
def generate_salary_slip_document(slip, settings=None, base_dir=None):
    if not base_dir:
        base_dir = os.path.dirname(os.path.dirname(__file__))
    if not settings:
        settings = {}

    shop_name = settings.get("shop_name", "7 ART TAILORS")
    shop_phone = settings.get("shop_phone", "+91 98290 12345")
    owner_name = settings.get("owner_name", "BHAGIRATH SAINI")

    slip_no = slip.get("slip_no", "SAL-0001")
    worker = slip.get("worker", "Worker")
    role = slip.get("role", "tailor")
    role_label = "Cutting Master" if role == "cutting" else "Sewing Tailor"
    created_at = slip.get("created_at", datetime.now().strftime("%Y-%m-%d"))
    gross = float(slip.get("gross") or 0.0)
    adv_deduct = float(slip.get("advance") or slip.get("advance_deduct") or 0.0)
    deduction = float(slip.get("deduction") or 0.0)
    net = float(slip.get("net") or (gross - adv_deduct - deduction))
    adv_due = float(slip.get("adv_due") or 0.0)
    note = slip.get("note", "")
    items = slip.get("items", [])

    receipts_dir = os.path.join(base_dir, "receipts", "salary_slips")
    os.makedirs(receipts_dir, exist_ok=True)
    base_name = f"Slip_{_clean_filename(slip_no)}_{_clean_filename(worker)}"
    pdf_path = os.path.join(receipts_dir, f"{base_name}.pdf")
    html_path = os.path.join(receipts_dir, f"{base_name}.html")

    # --- HTML Printable Slip ---
    items_html = ""
    for it in items:
        tok = it.get("token", "—")
        cust = it.get("customer", "—")
        g = it.get("garment", "—")
        n = it.get("n", 1)
        r = float(it.get("rate") or 0.0)
        items_html += f"<tr><td style='padding: 6px 8px; border-bottom: 1px solid #eee;'>{tok}</td><td style='padding: 6px 8px; border-bottom: 1px solid #eee;'>{cust}</td><td style='padding: 6px 8px; border-bottom: 1px solid #eee;'>{g} (pc {n})</td><td style='padding: 6px 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;'>Rs. {r:,.2f}</td></tr>"

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Salary Slip {slip_no} - {worker}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #1F1A17; }}
    .slip {{ max-width: 620px; margin: 0 auto; border: 2px solid #1E293B; padding: 24px; border-radius: 8px; }}
    .header {{ text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 16px; }}
    .title {{ font-size: 22px; font-weight: 800; color: #1E293B; margin: 0; }}
    .grid {{ display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 13px; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12.5px; }}
    th {{ background: #F1F5F9; text-align: left; padding: 8px; border-bottom: 2px solid #94A3B8; }}
    .totals {{ margin-top: 16px; border-top: 2px solid #E2E8F0; padding-top: 10px; text-align: right; font-size: 14px; }}
    .net {{ font-size: 18px; font-weight: 800; color: #16A34A; }}
  </style>
</head>
<body>
  <div class="slip">
    <div class="header">
      <h1 class="title">{shop_name}</h1>
      <div style="font-size: 12px; color: #64748B;">Staff Settlement & Piece-Rate Salary Slip</div>
      <div style="margin-top: 6px; font-size: 14px; font-weight: bold; background: #F8FAFC; padding: 4px 12px; display: inline-block;">
        SLIP NO: {slip_no}
      </div>
    </div>
    <div class="grid">
      <div>
        <strong>Worker:</strong> <span style="font-size: 15px; font-weight: bold;">{worker}</span><br>
        <strong>Role:</strong> {role_label}<br>
        <strong>Date:</strong> {created_at}
      </div>
      <div style="text-align: right;">
        <strong>Pieces Settled:</strong> {len(items)}<br>
        <strong>Outstanding Advance:</strong> Rs. {adv_due:,.2f}<br>
        {f"<strong>Note:</strong> {note}" if note else ""}
      </div>
    </div>
    <table>
      <thead><tr><th>Token</th><th>Customer</th><th>Garment</th><th style="text-align: right;">Rate</th></tr></thead>
      <tbody>{items_html or '<tr><td colspan="4">No itemized pieces</td></tr>'}</tbody>
    </table>
    <div class="totals">
      <div>Gross Earned: <strong>Rs. {gross:,.2f}</strong></div>
      <div>Advance Deducted: <strong style="color: #DC2626;">- Rs. {adv_deduct:,.2f}</strong></div>
      {f"<div>Other Deductions: <strong style='color: #DC2626;'>- Rs. {deduction:,.2f}</strong></div>" if deduction > 0 else ""}
      <div class="net">NET PAID: Rs. {net:,.2f}</div>
    </div>
  </div>
</body>
</html>"""
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # --- Pure Vector PDF ---
    pdf = SimplePDF()
    pdf.rect(40, 750, 515, 55, fill=(0.95, 0.96, 0.98), stroke_color=(0.2, 0.25, 0.35), stroke_width=1.0)
    pdf.text(55, 785, f"{shop_name.upper()} - SALARY VOUCHER", size=15, bold=True, color=(0.15, 0.2, 0.3))
    pdf.text(55, 765, f"Slip #{slip_no}  |  Date: {created_at}  |  Master: {owner_name}", size=9, color=(0.4, 0.4, 0.4))

    pdf.rect(40, 680, 515, 55, stroke_color=(0.8, 0.8, 0.8), stroke_width=0.7)
    pdf.text(55, 715, f"WORKER: {worker.upper()}", size=13, bold=True)
    pdf.text(55, 695, f"Designation: {role_label}", size=10)
    pdf.text(340, 715, f"Total Pieces: {len(items)}", size=11, bold=True)
    pdf.text(340, 695, f"Remaining Advance: Rs. {adv_due:,.2f}", size=10)

    # Items table
    y = 650
    pdf.rect(40, y, 515, 20, fill=(0.92, 0.94, 0.96), stroke_color=(0.3, 0.35, 0.45), stroke_width=0.8)
    pdf.text(50, y + 6, "TOKEN", size=9, bold=True)
    pdf.text(120, y + 6, "CUSTOMER", size=9, bold=True)
    pdf.text(260, y + 6, "GARMENT PIECE", size=9, bold=True)
    pdf.text(480, y + 6, "RATE (Rs)", size=9, bold=True)

    y -= 18
    for it in items[:15]:  # fit on first page
        tok = str(it.get("token", ""))
        cust = str(it.get("customer", ""))[:18]
        g = f"{it.get('garment', '')} #{it.get('n', 1)}"[:25]
        r = float(it.get("rate") or 0.0)
        pdf.line(40, y + 14, 555, y + 14, width=0.3, color=(0.85, 0.85, 0.85))
        pdf.text(50, y, tok, size=9)
        pdf.text(120, y, cust, size=9)
        pdf.text(260, y, g, size=9)
        pdf.text(490, y, f"{r:,.2f}", size=9, bold=True)
        y -= 16

    # Totals box
    y_totals = max(y - 15, 450)
    pdf.rect(300, y_totals - 70, 255, 70, fill=(0.98, 0.98, 0.98), stroke_color=(0.8, 0.8, 0.8), stroke_width=0.8)
    pdf.text(315, y_totals - 20, f"Gross Earnings:      Rs. {gross:,.2f}", size=10)
    pdf.text(315, y_totals - 36, f"Advance Deducted: - Rs. {adv_deduct:,.2f}", size=10, color=(0.7, 0.1, 0.1))
    pdf.text(315, y_totals - 58, f"NET PAID:           Rs. {net:,.2f}", size=12, bold=True, color=(0.1, 0.55, 0.2))

    pdf.line(40, y_totals - 95, 555, y_totals - 95, width=0.5, color=(0.7, 0.7, 0.7))
    pdf.text(55, y_totals - 115, "Worker Signature: _______________________", size=9, color=(0.4, 0.4, 0.4))
    pdf.text(370, y_totals - 115, "Owner Authorized: _______________________", size=9, color=(0.4, 0.4, 0.4))

    pdf.save(pdf_path)
    return {"pdf": pdf_path, "html": html_path, "slip_no": slip_no}


# ----------------------------------------------------------------------
# 3. GENERATE ADVANCE RECEIPT PDF & HTML
# ----------------------------------------------------------------------
def generate_advance_document(adv, settings=None, base_dir=None):
    if not base_dir:
        base_dir = os.path.dirname(os.path.dirname(__file__))
    if not settings:
        settings = {}

    shop_name = settings.get("shop_name", "7 ART TAILORS")
    adv_id = str(adv.get("adv_id", adv.get("id", "ADV-001")))
    worker = adv.get("worker", "Worker")
    role = adv.get("role", "tailor")
    role_label = "Cutting Master" if role == "cutting" else "Sewing Tailor"
    kind = adv.get("kind", "given")
    kind_label = "Advance Given to Worker (+)" if kind == "given" else "Advance Settled / Recovered (-)"
    amount = float(adv.get("amount") or 0.0)
    created_at = adv.get("created_at", datetime.now().strftime("%Y-%m-%d %H:%M"))
    note = adv.get("note", "")

    receipts_dir = os.path.join(base_dir, "receipts", "advances")
    os.makedirs(receipts_dir, exist_ok=True)
    base_name = f"Advance_{_clean_filename(adv_id)}_{_clean_filename(worker)}"
    pdf_path = os.path.join(receipts_dir, f"{base_name}.pdf")
    html_path = os.path.join(receipts_dir, f"{base_name}.html")

    # --- HTML Printable Slip ---
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Advance Voucher - {worker}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #1F1A17; }}
    .voucher {{ max-width: 500px; margin: 0 auto; border: 2px solid #C58B3A; padding: 24px; border-radius: 8px; }}
    .header {{ text-align: center; border-bottom: 2px solid #EBE5DB; padding-bottom: 10px; margin-bottom: 14px; }}
    .title {{ font-size: 20px; font-weight: 800; color: #8C5311; margin: 0; }}
  </style>
</head>
<body>
  <div class="voucher">
    <div class="header">
      <h1 class="title">{shop_name}</h1>
      <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">WORKER ADVANCE VOUCHER</div>
      <div style="font-size: 11px; color: #777;">Voucher ID: {adv_id} | Date: {created_at}</div>
    </div>
    <div style="font-size: 14px; line-height: 1.8;">
      <div><strong>Worker:</strong> {worker} ({role_label})</div>
      <div><strong>Transaction Type:</strong> {kind_label}</div>
      <div style="font-size: 20px; font-weight: 800; color: {'#DC2626' if kind == 'given' else '#16A34A'}; margin: 8px 0;">
        Amount: Rs. {amount:,.2f}
      </div>
      <div><strong>Purpose / Note:</strong> {note or 'Standard staff advance'}</div>
    </div>
    <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; color: #555;">
      <div>Worker Signature: ____________</div>
      <div>Owner Signature: ____________</div>
    </div>
  </div>
</body>
</html>"""
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # --- Pure Vector PDF ---
    pdf = SimplePDF()
    pdf.rect(40, 750, 515, 55, fill=(0.98, 0.96, 0.92), stroke_color=(0.77, 0.55, 0.23), stroke_width=1.0)
    pdf.text(55, 785, f"{shop_name.upper()} - ADVANCE VOUCHER", size=15, bold=True, color=(0.55, 0.33, 0.07))
    pdf.text(55, 765, f"Voucher ID: {adv_id}  |  Date: {created_at}", size=9, color=(0.4, 0.4, 0.4))

    pdf.rect(40, 640, 515, 95, stroke_color=(0.8, 0.8, 0.8), stroke_width=0.7)
    pdf.text(55, 715, f"WORKER: {worker.upper()}", size=13, bold=True)
    pdf.text(55, 695, f"Role: {role_label}", size=10)
    pdf.text(55, 675, f"Transaction: {kind_label}", size=10)
    pdf.text(55, 655, f"Note / Remarks: {note or 'Standard advance'}", size=9, color=(0.3, 0.3, 0.3))

    color = (0.75, 0.15, 0.15) if kind == "given" else (0.1, 0.6, 0.2)
    pdf.text(340, 700, f"AMOUNT: Rs. {amount:,.2f}", size=14, bold=True, color=color)

    pdf.line(40, 580, 555, 580, width=0.5, color=(0.7, 0.7, 0.7))
    pdf.text(55, 560, "Worker Signature: _______________________", size=9, color=(0.4, 0.4, 0.4))
    pdf.text(370, 560, "Authorized by: _______________________", size=9, color=(0.4, 0.4, 0.4))

    pdf.save(pdf_path)
    return {"pdf": pdf_path, "html": html_path, "adv_id": adv_id}
