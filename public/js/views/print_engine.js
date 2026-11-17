/* ==========================================================================
   7 ART TAILORS - PRINT ENGINE & TEMPLATES
   High-Precision Atelier Print Layouts & WhatsApp Formatting
   ========================================================================== */

const PrintEngine = {
  // Format Indian Currency
  fmtMoney(val) {
    const num = parseFloat(val || 0);
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // Format Date DD-MM-YYYY
  fmtDate(dateStr) {
    return dateStr || '';
  },

  // Garment measurement field preset catalog (used to map space-separated values & order measurements)
  garmentFieldPresets: {
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
  },

  // Parse measurements dictionary into an array of { label, value } items
  // Gracefully handles structured key-values, _flow strings, and space/comma-separated freestyle measurements
  parseMeasurementItems(gname, gMeas) {
    if (!gMeas || typeof gMeas !== 'object') return [];

    let catalogFields = [];
    if (window.App?.settings?.garments?.[gname]?.fields) {
      catalogFields = window.App.settings.garments[gname].fields.split(';').map(f => f.trim()).filter(Boolean);
    }
    if (!catalogFields.length) {
      const matchedKey = Object.keys(this.garmentFieldPresets).find(k => k.toLowerCase() === (gname || '').toLowerCase());
      if (matchedKey) catalogFields = this.garmentFieldPresets[matchedKey];
    }
    if (!catalogFields.length) {
      catalogFields = ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Bottom"];
    }

    const items = [];
    const entries = Object.entries(gMeas).filter(([k, v]) => k !== '_flow' && k !== 'flow' && v !== undefined && v !== null && String(v).trim() !== '');
    const flowString = gMeas._flow || gMeas.flow || '';

    // Check if any field has space-separated numbers (like "12 23 22.5...")
    const spaceEntry = entries.find(([k, v]) => String(v).trim().split(/[\s,;]+/).length > 1);
    const sourceStream = flowString || (spaceEntry ? spaceEntry[1] : null);

    if (sourceStream) {
      // Parse sequence of numbers directly from stream
      const cleaned = String(sourceStream).replace(/[()\[\]{}]/g, ' ');
      const tokens = cleaned.trim().split(/[\s,;]+/).filter(Boolean);
      let fIdx = 0;
      tokens.forEach(tok => {
        const cleanTok = tok.replace(/["']/g, '');
        if (!isNaN(parseFloat(cleanTok)) && isFinite(cleanTok) && /^[-+]?\d*\.?\d+$/.test(cleanTok)) {
          const label = catalogFields[fIdx] || `M${fIdx + 1}`;
          items.push({ label, value: cleanTok });
          fIdx++;
        } else if (cleanTok) {
          items.push({ label: `NOTE ${items.length + 1}`, value: cleanTok });
        }
      });
      if (items.length === 0 && String(sourceStream).trim()) {
        items.push({ label: 'MEASUREMENTS', value: String(sourceStream).trim() });
      }
    } else if (entries.length > 0) {
      // Standard individual fields
      entries.forEach(([key, val]) => {
        items.push({ label: key, value: String(val).trim() });
      });
    }

    return items;
  },

  // Render measurements in a full-width horizontal row table
  // Spans 100% of card width with zero empty space in front
  renderMeasurementRowsHtml(items) {
    if (!items || items.length === 0) {
      return `<div style="padding: 6px 10px; font-size: 11.5px; color: #777; background: #FAF5F5; border-radius: 4px; border: 1px dashed #DDD;">Standard bespoke sizing applied.</div>`;
    }

    // Split into chunks of at most 8 columns so each measurement is wide and prominent
    const chunkSize = items.length <= 8 ? items.length : Math.ceil(items.length / 2);
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    return chunks.map(chunk => `
      <div style="width: 100%; margin: 6px 0; border: 1.5px solid #1E1617; border-radius: 5px; overflow: hidden; background: #FFFFFF;">
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
          <thead>
            <tr style="background: #FDF4F4; border-bottom: 1.5px solid #BD1A22;">
              ${chunk.map((it, idx) => `
                <th style="padding: 5px 3px; font-size: 9.5px; font-weight: 800; color: #7A242A; text-transform: uppercase; ${idx < chunk.length - 1 ? 'border-right: 1px solid #E6D2D4;' : ''} text-align: center; word-break: break-word; line-height: 1.2;">
                  ${it.label}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${chunk.map((it, idx) => {
                const cleanVal = String(it.value).replace(/"/g, '').trim();
                const isNum = !isNaN(parseFloat(cleanVal)) && isFinite(cleanVal);
                return `
                  <td style="padding: 6px 3px; font-size: ${cleanVal.length > 7 ? '12px' : '15px'}; font-weight: 900; color: #1E1617; ${idx < chunk.length - 1 ? 'border-right: 1px solid #E6D2D4;' : ''} text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    ${cleanVal}${isNum ? '"' : ''}
                  </td>
                `;
              }).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `).join('');
  },

  // Build Monospace Cloth Tag / Cutting Tag
  buildClothTagHtml(order, shopName = "7 ART TAILORS") {
    const urgentBadge = order.urgent ? `<div class="slip-urgent-banner">*** EXPRESS URGENT ***</div>` : '';
    let gList = order.garments;
    if (typeof gList === 'string') { try { gList = JSON.parse(gList); } catch(e) { gList = []; } }
    if (!Array.isArray(gList)) gList = [];
    const garments = gList.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || '—';

    let measurements = order.measurements || {};
    if (typeof measurements === 'string') { try { measurements = JSON.parse(measurements); } catch(e) { measurements = {}; } }
    if (typeof measurements !== 'object' || Array.isArray(measurements) || !measurements) measurements = {};

    let pieces = order.work || [];
    if (typeof pieces === 'string') { try { pieces = JSON.parse(pieces); } catch(e) { pieces = []; } }
    if (!Array.isArray(pieces)) pieces = [];

    // Detailed measurements per garment for the raw cloth tag
    const garmentEntries = Object.keys(measurements).length > 0
      ? Object.keys(measurements)
      : gList.map(g => g.name || g);

    let measSections = '';
    garmentEntries.forEach((gname, idx) => {
      const gMeas = measurements[gname] || {};
      const matchedPiece = pieces.find(p => p.g === gname) || pieces[idx] || {};
      const matchedG = gList.find(g => (g.name || g) === gname) || gList[idx] || {};
      const pieceNum = matchedPiece.n || (idx + 1);

      const cutMaster = matchedPiece.cut || matchedG.cut || order.cutting_master || '—';
      const sewTailor = matchedPiece.sew || matchedG.sew || order.sewing_tailor || '—';
      const pieceNote = matchedPiece.notes || matchedG.notes || '';
      let flowText = gMeas._flow || gMeas.flow || '';
      if (!flowText) {
        const measItems = this.parseMeasurementItems(gname, gMeas);
        flowText = measItems.map(item => item.value || item.val).filter(Boolean).join(' ');
      }

      measSections += `
        <div style="border-top: 1.5px dashed #BD1A22; padding-top: 8px; margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 800; color: #BD1A22;">
            <span>[ STAMP #${pieceNum} ] ${gname}</span>
            <span style="font-size: 11px; color: #555;">Cut: <strong style="color: #BD1A22;">${cutMaster}</strong> | Sew: <strong>${sewTailor}</strong></span>
          </div>
          <div style="background: #FFF5F5; border: 2px dashed #BD1A22; border-radius: 6px; padding: 8px 12px; margin: 8px 0; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
            <span style="font-weight: 900; color: #BD1A22; font-size: 11.5px; letter-spacing: 0.5px;">📏 SHOP TAPE FLOW:</span>
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 16px; font-weight: 900; color: #1E1617; letter-spacing: 1.2px;">${flowText || '—'}</span>
          </div>
          ${pieceNote ? `<div style="font-size: 11px; background: #FFF8F8; border: 1px solid #F2D5D6; border-radius: 4px; padding: 4px 6px; color: #1E1617; margin-top: 4px;"><strong>Note:</strong> ${pieceNote}</div>` : ''}
        </div>
      `;
    });

    return `
      <div class="printable-slip-wrapper" style="max-width: 480px; border: 2px dashed #BD1A22; margin-bottom: 20px; padding: 14px;">
        <div style="text-align: center; border-bottom: 2px solid #BD1A22; padding-bottom: 8px;">
          <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; margin: 0; color: #BD1A22;">${shopName}</h2>
          <div style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">RAW CLOTH CUTTING STAMP TAG</div>
        </div>
        <div style="text-align: center; padding: 12px 0;">
          <div style="font-size: 11px; text-transform: uppercase; color: #7A726B; font-weight: 700;">ORDER TOKEN STAMP</div>
          <div style="font-family: Georgia, serif; font-size: 38px; font-weight: 900; line-height: 1; color: #BD1A22;">${order.token}</div>
          ${urgentBadge}
        </div>
        <div style="border-top: 1px solid #E6E0D7; padding-top: 10px; font-size: 13px;">
          <p><strong>Customer:</strong> ${order.customer} (${order.phone || '—'})</p>
          <p><strong>Garments:</strong> ${garments}</p>
          <p><strong>Promised Delivery:</strong> <span style="font-weight: 800; color: #BD1A22;">${order.delivery_date}</span></p>
          <p><strong>Cutting Master:</strong> ${order.cutting_master || '—'} &nbsp;|&nbsp; <strong>Sewing Tailor:</strong> ${order.sewing_tailor || '—'}</p>
          ${order.notes ? `<p style="margin-top: 6px; padding: 6px; background: #FAF8F5; border-radius: 4px;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
        ${measSections}
        <div style="margin-top: 12px; padding-top: 6px; border-top: 1px dashed #7A726B; font-size: 10px; color: #777; text-align: center;">
          ✂ Cut and pin this stamp directly to raw cloth for cutting bench inspection.
        </div>
      </div>
    `;
  },

  // Build Customer Slip & Invoice (matches Screenshot 3 - NO MEASUREMENTS ON CUSTOMER SLIP)
  buildCustomerSlipHtml(order, shopSettings = {}) {
    const shopName = shopSettings.shop_name || "7 ART TAILORS";
    const shopAddress = shopSettings.shop_address || "Shop No. 7, Tailors Market, Bapu Bazaar, Jaipur, Rajasthan 302003";
    const shopPhone = shopSettings.shop_phone || "+91 98290 12345";
    const urgentBadge = order.urgent ? `<div class="slip-urgent-banner">★ EXPRESS URGENT</div>` : '';

    let garmentsList = order.garments || [];
    if (typeof garmentsList === 'string') { try { garmentsList = JSON.parse(garmentsList); } catch(e) { garmentsList = []; } }
    if (!Array.isArray(garmentsList)) garmentsList = [];

    // Customer slip lists booked garments & rates WITHOUT measurements
    let garmentsHtml = '';
    garmentsList.forEach((g, idx) => {
      const itemTotal = (g.rate || 0) * (g.qty || 1);
      garmentsHtml += `
        <div style="background: #FFFFFF; border: 1px solid #E6E0D7; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 15px; color: #1F1A17;">
              <span style="display: inline-block; width: 22px; height: 22px; background: #BD1A22; color: white; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; margin-right: 8px; font-weight: 800;">${idx + 1}</span>
              ${g.qty || 1}x ${g.name}
            </div>
            <div style="font-weight: 700; font-size: 15px; color: #BD1A22;">
              ${itemTotal > 0 ? `₹${this.fmtMoney(itemTotal)}` : 'Tailoring Included'}
            </div>
          </div>
        </div>
      `;
    });

    return `
      <div class="printable-slip-wrapper">
        <div class="slip-header-brand">
          <div>
            <div class="slip-shop-name">${shopName}</div>
            <div class="slip-shop-tagline">STUDIO LEDGER · BESPOKE MASTER ATELIER</div>
            <div class="slip-shop-details">
              ${shopAddress}<br>
              Phone: ${shopPhone}
            </div>
          </div>
          <div class="slip-token-box">
            <div class="slip-token-label">ORDER TOKEN</div>
            <div class="slip-token-number">${order.token}</div>
            ${urgentBadge}
          </div>
        </div>

        <div class="slip-meta-grid">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #7A726B;">Customer Details</div>
            <div style="font-size: 16px; font-weight: 700; color: #1F1A17;">${order.customer}</div>
            <div style="font-size: 13px; color: #555;">📞 ${order.phone}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #555;">Order Date: <strong>${order.order_date}</strong></div>
            <div style="font-size: 13px; color: #1F1A17; margin-top: 2px;">Promised Delivery: <strong>${order.delivery_date}</strong></div>
          </div>
        </div>

        <div class="slip-section-heading">BOOKED TAILORING SERVICES & GARMENTS</div>
        ${garmentsHtml || '<div style="padding: 10px; color: #777;">Bespoke Tailoring Order</div>'}

        ${order.notes ? `
          <div style="margin: 12px 0; padding: 10px 14px; background: #FAF8F5; border: 1px solid #E6E0D7; border-radius: 6px;">
            <strong style="font-size: 11px; text-transform: uppercase; color: #7A726B;">Tailoring & Styling Notes:</strong>
            <p style="font-size: 13px; margin-top: 4px;">${order.notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 20px; border-top: 2px solid #1F1A17; padding-top: 14px; display: flex; justify-content: flex-end;">
          <div style="width: 260px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px;">
              <span>Total Tailoring:</span>
              <strong style="font-size: 15px;">₹${this.fmtMoney(order.total)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #2E7D5B;">
              <span>Advance Paid (${order.pay_mode || 'Cash'}):</span>
              <strong>- ₹${this.fmtMoney(order.advance)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0 4px; border-top: 1px solid #E6E0D7; font-size: 16px; font-weight: 800; color: #9C4528;">
              <span>Balance Due:</span>
              <span>₹${this.fmtMoney(order.balance)}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 10px; border-top: 1px dashed #E6E0D7; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #7A726B;">
          <div>
            * Trial timing: 11:00 AM - 8:30 PM.<br>
            * Please bring this slip or token number at pickup.
          </div>
          <div style="text-align: center; border-top: 1px solid #1F1A17; width: 140px; padding-top: 4px; font-weight: bold; color: #1F1A17;">
            Master Tailor Sign
          </div>
        </div>
      </div>
    `;
  },

  // Build Master Workshop Job Card with Cuttable Raw Cloth Stamp Tickets for every garment
  buildJobCardHtml(order, shopSettings = {}) {
    const shopName = shopSettings.shop_name || "7 ART TAILORS";
    const urgentBadge = order.urgent ? `<div class="slip-urgent-banner">*** URGENT MASTER CUTTING ***</div>` : '';
    
    let pieces = order.work || [];
    if (typeof pieces === 'string') { try { pieces = JSON.parse(pieces); } catch(e) { pieces = []; } }
    if (!Array.isArray(pieces)) pieces = [];

    let garmentsList = order.garments || [];
    if (typeof garmentsList === 'string') { try { garmentsList = JSON.parse(garmentsList); } catch(e) { garmentsList = []; } }
    if (!Array.isArray(garmentsList)) garmentsList = [];

    let measurements = order.measurements || {};
    if (typeof measurements === 'string') { try { measurements = JSON.parse(measurements); } catch(e) { measurements = {}; } }
    if (typeof measurements !== 'object' || Array.isArray(measurements) || !measurements) measurements = {};

    let piecesTable = '';
    if (pieces.length > 0) {
      piecesTable = `
        <table class="slip-bill-table" style="margin-top: 10px;">
          <thead>
            <tr>
              <th>Piece #</th>
              <th>Garment</th>
              <th>Cutting Master</th>
              <th>Sewing Tailor</th>
              <th>Styling &amp; Posture Note</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${pieces.map((p, pIdx) => {
              const matchedG = garmentsList.find(g => (g.name || g) === p.g) || garmentsList[pIdx] || {};
              const pNote = p.notes || matchedG.notes || '—';
              return `
                <tr>
                  <td>#${p.n || 1}</td>
                  <td><strong>${p.g}</strong></td>
                  <td><strong style="color: #BD1A22;">${p.cut || '—'}</strong></td>
                  <td><strong>${p.sew || '—'}</strong></td>
                  <td style="font-size: 11px; color: #4A3B3C; max-width: 180px;">${pNote}</td>
                  <td>${p.cut_slip ? 'Cut Done' : 'Pending'} / ${p.sew_slip ? 'Sew Done' : 'Pending'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    // Build Cuttable Raw Cloth Stamp Tickets for each garment / piece
    // Each ticket has a clear TOKEN STAMP, garment name, piece #, and craft measurements to paste on raw cloth
    const garmentEntries = Object.keys(measurements).length > 0
      ? Object.keys(measurements)
      : garmentsList.map(g => g.name || g);

    let clothStampTicketsHtml = '';
    garmentEntries.forEach((gname, idx) => {
      const gMeas = measurements[gname] || {};
      
      // Find assigned staff and notes for this garment if in pieces
      const matchedPiece = pieces.find(p => p.g === gname) || pieces[idx] || {};
      const matchedG = garmentsList.find(g => (g.name || g) === gname) || garmentsList[idx] || {};

      const cutMaster = matchedPiece.cut || matchedG.cut || order.cutting_master || '—';
      const sewTailor = matchedPiece.sew || matchedG.sew || order.sewing_tailor || '—';
      const pieceNum = matchedPiece.n || (idx + 1);
      const pieceNote = matchedPiece.notes || matchedG.notes || '';
      let flowText = gMeas._flow || gMeas.flow || '';
      if (!flowText) {
        const measItems = this.parseMeasurementItems(gname, gMeas);
        flowText = measItems.map(item => item.value || item.val).filter(Boolean).join(' ');
      }

      clothStampTicketsHtml += `
        <!-- CUTTABLE RAW CLOTH STAMP TICKET FOR ${gname.toUpperCase()} -->
        <div class="cut-ticket-stamp" style="border: 2px dashed #BD1A22; border-radius: 8px; padding: 12px 14px; margin: 16px 0; background: #FFFDFD; page-break-inside: avoid;">
          <div class="cut-guide-tag" style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; color: #BD1A22; letter-spacing: 1px; border-bottom: 1px dashed #D3B6B8; padding-bottom: 4px; margin-bottom: 8px;">
            <span>✂ - - - CUT TICKET &amp; PIN TO RAW CLOTH - - - ✂</span>
            <span>TAG #${pieceNum}</span>
          </div>

          <div class="cut-ticket-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #BD1A22; padding-bottom: 6px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="cut-ticket-badge" style="background: #BD1A22; color: #FFF; padding: 6px 12px; border-radius: 6px; font-family: var(--font-serif); font-size: 18px; font-weight: 900; letter-spacing: 1px;">
                TOKEN: ${order.token}
              </div>
              <div>
                <div class="cut-ticket-title" style="font-size: 16px; font-weight: 800; color: #1E1617; text-transform: uppercase;">
                  ${gname} <span style="font-size: 12px; color: #BD1A22; font-weight: 700;">(Piece #${pieceNum})</span>
                </div>
                <div style="font-size: 12px; color: #4A3B3C; font-weight: 600;">
                  Customer: <strong>${order.customer}</strong> ${order.phone ? `· 📞 ${order.phone}` : ''}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; text-transform: uppercase; color: #8E7274; font-weight: 700;">Target Delivery</div>
              <div style="font-size: 14px; font-weight: 800; color: #BD1A22;">${order.delivery_date}</div>
              ${order.urgent ? '<span style="font-size: 9px; font-weight: 800; background: #BD1A22; color: white; padding: 1px 6px; border-radius: 3px; display: inline-block; margin-top: 2px;">★ EXPRESS URGENT</span>' : ''}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 11.5px; background: #FAF5F5; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #EFE9E9;">
            <div><strong>Cutting Master:</strong> <span style="color: #BD1A22; font-weight: 700;">${cutMaster}</span></div>
            <div><strong>Sewing Tailor:</strong> <span style="font-weight: 700;">${sewTailor}</span></div>
            <div><strong>Shop:</strong> ${shopName}</div>
          </div>

          <div style="background: #FFF5F5; border: 2px dashed #BD1A22; border-radius: 6px; padding: 10px 14px; margin: 8px 0; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
            <span style="font-weight: 900; color: #BD1A22; font-size: 12.5px; letter-spacing: 0.5px;">📏 SHOP TAPE FLOW:</span>
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 17px; font-weight: 900; color: #1E1617; letter-spacing: 1.5px;">${flowText || '—'}</span>
          </div>

          ${pieceNote ? `
            <div style="font-size: 11.5px; background: #FFF8F8; border: 1.5px solid #F2D5D6; border-radius: 4px; padding: 6px 8px; margin-top: 6px; color: #1E1617;">
              <strong style="color: #BD1A22;">✂ Styling &amp; Posture Note (${gname}):</strong> ${pieceNote}
            </div>
          ` : (order.notes ? `
            <div style="font-size: 11px; background: #FAF8F5; border: 1px solid #E6E0D7; border-radius: 4px; padding: 6px 8px; margin-top: 6px; color: #555;">
              <strong>Order Note:</strong> ${order.notes}
            </div>
          ` : '')}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px dashed #D3B6B8; font-size: 10.5px; color: #666;">
            <div>[ &nbsp; ] Cloth Inspected &amp; Pre-Shrunk &nbsp;&nbsp;&nbsp; [ &nbsp; ] Shrinkage Pressed</div>
            <div>Master Cutter Signature: _____________________</div>
          </div>
        </div>
      `;
    });

    return `
      <div class="printable-slip-wrapper" style="border: 2px solid #1F1A17;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1F1A17; padding-bottom: 10px;">
          <div>
            <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; margin: 0;">${shopName}</h2>
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #9C4528;">MASTER WORKSHOP PRODUCTION CARD</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: Georgia, serif; font-size: 28px; font-weight: 800; color: #BD1A22;">${order.token}</div>
            ${urgentBadge}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 14px 0; font-size: 13px;">
          <div>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Phone:</strong> ${order.phone || '—'}</p>
            <p><strong>Order Date:</strong> ${order.order_date}</p>
          </div>
          <div>
            <p><strong>Delivery Target:</strong> <span style="font-size: 15px; font-weight: bold; color: #BD1A22;">${order.delivery_date}</span></p>
            <p><strong>Current Status:</strong> ${order.status}</p>
            <p><strong>Assigned:</strong> ${order.cutting_master || '—'} (Cut) | ${order.sewing_tailor || '—'} (Sew)</p>
          </div>
        </div>

        <div class="slip-section-heading">PRODUCTION WORK ASSIGNMENT</div>
        ${piecesTable || '<div style="padding: 6px; font-size: 12px; color: #777;">No piece assignments specified.</div>'}

        <div class="slip-section-heading" style="margin-top: 18px;">
          ✂ RAW CLOTH CUTTING STAMPS (SHOP TAPE FLOW) — CUT &amp; PIN TO FABRIC
        </div>
        ${clothStampTicketsHtml}

        ${order.notes ? `
          <div style="margin-top: 14px; padding: 10px; background: #FAF8F5; border: 1px solid #E6E0D7; border-radius: 6px;">
            <strong>General Tailoring Instructions:</strong> ${order.notes}
          </div>
        ` : ''}
      </div>
    `;
  },

  // Build Salary Slip (matching Desktop lines 3450-3500)
  buildSalarySlipHtml(slip, shopSettings = {}) {
    const shopName = shopSettings.shop_name || "7 ART TAILORS";
    const roleLabel = slip.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor';
    const items = slip.items || [];

    return `
      <div class="printable-slip-wrapper">
        <div class="slip-header-brand">
          <div>
            <div class="slip-shop-name">${shopName}</div>
            <div class="slip-shop-tagline">WORKER SALARY & PIECE-RATE SETTLEMENT SLIP</div>
          </div>
          <div class="slip-token-box">
            <div class="slip-token-label">SLIP NUMBER</div>
            <div class="slip-token-number" style="font-size: 26px;">${slip.slip_no}</div>
            <div style="font-size: 11px; color: #7A726B;">${slip.created_at ? slip.created_at.substring(0, 10) : ''}</div>
          </div>
        </div>

        <div class="slip-meta-grid">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #7A726B;">Worker Name</div>
            <div style="font-size: 18px; font-weight: 700; color: #1F1A17;">${slip.worker}</div>
            <div style="font-size: 13px; color: #9C4528; font-weight: 600;">${roleLabel}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px;">Pieces Completed: <strong>${items.length}</strong></div>
            <div style="font-size: 13px; color: #B3402E; margin-top: 4px;">Remaining Advance Due: <strong>₹${this.fmtMoney(slip.adv_due)}</strong></div>
          </div>
        </div>

        <div class="slip-section-heading">ITEMIZED PIECE-RATE SETTLEMENT</div>
        <table class="slip-bill-table">
          <thead>
            <tr>
              <th>Order Token</th>
              <th>Customer</th>
              <th>Garment Spec</th>
              <th>Piece #</th>
              <th>Stage</th>
              <th style="text-align: right;">Rate (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(it => `
              <tr>
                <td><strong>${it.token}</strong></td>
                <td>${it.customer}</td>
                <td>${it.garment}</td>
                <td>#${it.n || 1}</td>
                <td><span style="font-size: 11px; padding: 2px 6px; background: #EBF5F0; color: #2E7D5B; border-radius: 4px;">${it.stage || 'Completed'}</span></td>
                <td style="text-align: right; font-weight: 600;">₹${this.fmtMoney(it.rate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 16px; border-top: 2px solid #1F1A17; padding-top: 12px; display: flex; justify-content: flex-end;">
          <div style="width: 280px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px;">
              <span>Gross Earnings:</span>
              <strong style="font-size: 15px;">₹${this.fmtMoney(slip.gross)}</strong>
            </div>
            ${slip.advance > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #B3402E;">
                <span>Advance Recovery:</span>
                <strong>- ₹${this.fmtMoney(slip.advance)}</strong>
              </div>
            ` : ''}
            ${slip.deduction > slip.advance ? `
              <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #B3402E;">
                <span>Other Deductions:</span>
                <strong>- ₹${this.fmtMoney(slip.deduction - slip.advance)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 8px 0 4px; border-top: 1px solid #E6E0D7; font-size: 18px; font-weight: 800; color: #2E7D5B;">
              <span>Net Paid to Worker:</span>
              <span>₹${this.fmtMoney(slip.net)}</span>
            </div>
          </div>
        </div>

        ${slip.note ? `
          <div style="margin-top: 14px; font-size: 12px; color: #555;">
            <strong>Note:</strong> ${slip.note}
          </div>
        ` : ''}

        <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
          <div style="border-top: 1px solid #1F1A17; width: 140px; padding-top: 6px; text-align: center;">Worker Signature</div>
          <div style="border-top: 1px solid #1F1A17; width: 140px; padding-top: 6px; text-align: center;">Owner / Studio Sign</div>
        </div>
      </div>
    `;
  },

  // WhatsApp Message Generator
  generateOrderWhatsApp(order, templateType = "ready", shopName = "7 ART TAILORS") {
    let gList = order.garments;
    if (typeof gList === 'string') { try { gList = JSON.parse(gList); } catch(e) { gList = []; } }
    if (!Array.isArray(gList)) gList = [];
    const garments = gList.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || 'Custom Garment';
    const balText = order.balance > 0 ? `Pending balance: ₹${this.fmtMoney(order.balance)}. ` : '';

    if (templateType === 'ready') {
      return `Hello ${order.customer}, your order ${order.token} (${garments}) at ${shopName} is READY for trial/delivery. ${balText}Please collect it at your convenience. Thank you!`;
    } else if (templateType === 'due') {
      return `Hello ${order.customer}, this is a gentle reminder from ${shopName} for order ${order.token} (${garments}). Pending balance: ₹${this.fmtMoney(order.balance)}. Delivery date: ${order.delivery_date}. Thank you!`;
    } else {
      return `Hello ${order.customer}, your tailoring order ${order.token} (${garments}) has been successfully booked at ${shopName}. Promised delivery date: ${order.delivery_date}. Total: ₹${this.fmtMoney(order.total)}, Advance paid: ₹${this.fmtMoney(order.advance)}, Balance: ₹${this.fmtMoney(order.balance)}. Thank you for choosing us!`;
    }
  },

  // Open WhatsApp Web / Mobile
  openWhatsApp(phone, messageText) {
    let cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  }
};

