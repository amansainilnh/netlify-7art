/* ==========================================================================
   7 ART TAILORS - NEW ORDER BOOKING VIEW (COUNTER)
   ========================================================================== */

const BookingView = {
  tokenData: null,
  isUrgent: false,
  selectedGarments: {}, // { "Suit / Blazer": { qty: 1, rate: 3500 }, ... }
  measurements: {},     // { "Suit / Blazer": { _flow: "...", "Coat Length": "29.5", ... } }
  garmentNotes: {},     // { "Suit / Blazer": "Lining note..." }
  garmentStaff: {},     // { "Suit / Blazer": { cut: "Aman", sew: "Ramesh" } }
  availableStaff: { cutting: [], sewing: [] },
  catalog: {},

  async initData() {
    this.tokenData = await API.getNextToken();
    const staffList = await API.listStaff(null, true); // available only
    this.availableStaff.cutting = staffList.filter(s => s.role === 'cutting');
    this.availableStaff.sewing = staffList.filter(s => s.role === 'sewing');
    
    const settings = window.App?.settings || await API.getSettings();
    this.catalog = settings.garments || {
      "Kurta / Pajama": { rate: 800, fields: "Kurta Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pajama Length;Pajama Waist;Bottom" },
      "Shirt & Pant": { rate: 900, fields: "Shirt Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip;Thigh;Bottom" },
      "Suit / Blazer": { rate: 3500, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pant Length;Pant Waist;Thigh" },
      "Sherwani": { rate: 5000, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Churidar Length;Churidar Waist" },
      "Safari Suit": { rate: 1800, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip" },
      "Sadri": { rate: 700, fields: "Length;Chest;Waist;Shoulder;Neck" },
      "Blouse & Lehenga": { rate: 1500, fields: "Blouse Length;Bust;Waist;Shoulder;Sleeve;Front Neck;Back Neck;Lehenga Length;Lehenga Waist;Hip" },
      "Uniform": { rate: 800, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist" },
      "Custom": { rate: 500, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip" },
      "kot": { rate: 1500, fields: "measurement" },
      "chaddi": { rate: 150, fields: "measurement" }
    };
  },

  toIsoDate(d) {
    if (!d) return '';
    if (d instanceof Date) {
      const yr = d.getFullYear();
      const mon = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${yr}-${mon}-${day}`;
    }
    const s = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const parts = s.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  },

  formatDisplayDate(val) {
    if (!val) return '';
    const iso = this.toIsoDate(val);
    if (!iso) return String(val);
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  },

  async render(container) {
    await this.initData();

    // Default dates
    const today = new Date();
    const defaultDelivery = new Date(today);
    defaultDelivery.setDate(defaultDelivery.getDate() + 7);

    container.innerHTML = `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <!-- Header & Active Token Box -->
        <div class="card" style="margin-bottom: 22px; background: linear-gradient(to right, #FFFFFF, var(--card-warm));">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">NEW BESPOKE ORDER</div>
              <h2 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--ink);">Counter Booking Slip</h2>
              <p style="font-size: 13px; color: var(--muted);">Record craft measurements, piece allocations, and customer advance deposit.</p>
            </div>

            <!-- Active Token Generator & Urgent Toggle -->
            <div style="display: flex; align-items: center; gap: 20px; background: var(--paper); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 12px 20px;">
              <div>
                <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 1px;">ACTIVE TOKEN</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="text" id="orderTokenInput" value="${this.tokenData.token}" 
                         style="font-family: var(--font-serif); font-size: 24px; font-weight: 800; color: var(--ink); width: 140px; border: none; background: transparent; outline: none;">
                  <button id="refreshTokenBtn" class="btn btn-ghost btn-sm" title="Next Token">🔄</button>
                </div>
              </div>

              <div style="height: 40px; width: 1px; background: var(--border);"></div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <label class="toggle-switch">
                  <input type="checkbox" id="urgentToggle">
                  <span class="toggle-slider toggle-urgent"></span>
                </label>
                <div>
                  <div style="font-size: 12px; font-weight: 700; color: var(--red);">EXPRESS URGENT</div>
                  <div style="font-size: 10px; color: var(--muted);">Priority Workshop Routing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form id="orderBookingForm" onsubmit="event.preventDefault(); return false;">
          <!-- Step 1: Client Information & Delivery Dates -->
          <div class="card" style="margin-bottom: 22px;">
            <div class="card-header">
              <h3 class="card-title">1. Customer Details & Delivery Commitment</h3>
              <span class="badge" style="background: var(--sidebar);">CLIENT INFO</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="custPhone">Phone Number *</label>
                <div class="input-addon-group">
                  <span class="input-addon-left">📞 +91</span>
                  <input type="tel" id="custPhone" class="form-input" placeholder="10-digit mobile" required maxlength="10">
                </div>
                <span id="custSuggestBadge" style="display: none; font-size: 11px; color: var(--green); font-weight: 600; margin-top: 2px;"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="custName">Customer Full Name *</label>
                <input type="text" id="custName" class="form-input" placeholder="e.g. Ramesh Sharma" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="orderDate">Order Booking Date</label>
                <input type="date" id="orderDate" class="form-input" value="${this.toIsoDate(today)}" required style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 12px; cursor: pointer; background: #fff;">
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                  <label class="form-label" for="deliveryDate" style="margin-bottom: 0;">Promised Delivery Date *</label>
                  <span id="deliveryDateBadge" style="font-size: 11px; color: var(--rust); font-weight: 700;">+7 Days Standard</span>
                </div>
                <input type="date" id="deliveryDate" class="form-input" value="${this.toIsoDate(defaultDelivery)}" required style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 12px; cursor: pointer; background: #fff;" onchange="BookingView.onDeliveryDateChange()">
                <div style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; min-width: 65px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center;" onclick="BookingView.addDaysToDelivery(7)">+7 Days</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; min-width: 65px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center;" onclick="BookingView.addDaysToDelivery(10)">+10 Days</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; min-width: 65px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center;" onclick="BookingView.addDaysToDelivery(14)">+14 Days</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Interactive Garment Selection Grid -->
          <div class="card" style="margin-bottom: 22px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">2. Garment Selection & Quantities</h3>
                <p class="card-subtitle">Select garments to dynamically configure tailored measurement fields and rates</p>
              </div>
              <div id="garmentCountBadge" class="badge" style="background: var(--rust-light); color: var(--rust); font-weight: 700;">
                0 Garment(s) Selected
              </div>
            </div>

            <div class="garments-grid" id="garmentsGrid">
              ${Object.entries(this.catalog).map(([name, info]) => `
                <div class="garment-card" id="card_${name.replace(/[^a-zA-Z0-9]/g, '_')}" onclick="BookingView.toggleGarment('${name}', event)">
                  <div class="garment-card-top">
                    <div>
                      <div class="garment-title">${name}</div>
                      <div class="garment-rate">₹${PrintEngine.fmtMoney(info.rate)}</div>
                    </div>
                    <span style="font-size: 20px;">${BookingView.getGarmentIcon(name)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="font-size: 11px; color: var(--muted); font-weight: 600;">Quantity:</span>
                    <div class="garment-counter" onclick="event.stopPropagation()">
                      <button type="button" class="counter-btn" onclick="BookingView.updateQty('${name}', -1)">-</button>
                      <span class="counter-display" id="qty_${name.replace(/[^a-zA-Z0-9]/g, '_')}">0</span>
                      <button type="button" class="counter-btn" onclick="BookingView.updateQty('${name}', 1)">+</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 3: Craft Measurements, Garment Styling & Staff Assignment -->
          <div class="card" style="margin-bottom: 22px;" id="measCardSection">
            <div class="card-header">
              <div>
                <h3 class="card-title">3. Craft Measurements, Garment Styling &amp; Staff Assignment</h3>
                <p class="card-subtitle">Full-flow rapid tape column, detailed parameters, custom styling notes, and assigned masters per garment</p>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" onclick="BookingView.clearMeasurements()">Clear All</button>
            </div>

            <div id="measurementsContainer" class="measurements-container">
              <div style="text-align: center; color: var(--muted); padding: 24px; border: 1.5px dashed var(--border); border-radius: var(--radius-md);">
                👉 Select one or more garments above to enter craft measurements, styling notes, and staff assignments.
              </div>
            </div>
          </div>

          <!-- Step 4: General Order Remarks & Quick Staff Shortcuts -->
          <div class="card" style="margin-bottom: 22px;">
            <div class="card-header">
              <h3 class="card-title">4. General Order Remarks &amp; Quick Batch Assignment</h3>
              <span class="badge" style="background: var(--sidebar);">WORKSHOP</span>
            </div>

            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px;">
              <!-- General Order Remarks -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="tailoringNotes">General Order &amp; Delivery Instructions</label>
                <textarea id="tailoringNotes" class="form-textarea" placeholder="Overall delivery instructions, VIP client remarks, fabric handling notes... (Per-garment styling notes can be written above directly in each garment)" style="height: 100px;"></textarea>
              </div>

              <!-- Quick Batch Assignment Shortcuts -->
              <div style="background: var(--card-warm); padding: 14px 16px; border-radius: var(--radius-md); border: 1.5px solid var(--border); display: flex; flex-direction: column; gap: 10px;">
                <div style="font-size: 11.5px; font-weight: 800; color: var(--crimson); text-transform: uppercase; letter-spacing: 0.5px;">
                  ⚡ Quick Apply to ALL Garments
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 11px; margin-bottom: 4px;">Set Same Cutting Master for All</label>
                  <select id="quickAssignCut" class="form-select" style="font-size: 12px; height: 34px;" onchange="BookingView.applyStaffToAll('cut', this.value)">
                    <option value="">— Select to apply to all —</option>
                    ${this.availableStaff.cutting.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 11px; margin-bottom: 4px;">Set Same Sewing Tailor for All</label>
                  <select id="quickAssignSew" class="form-select" style="font-size: 12px; height: 34px;" onchange="BookingView.applyStaffToAll('sew', this.value)">
                    <option value="">— Select to apply to all —</option>
                    ${this.availableStaff.sewing.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5: Billing & Advance Calculation -->
          <div class="card" style="margin-bottom: 26px; background: var(--card-warm); border: 2px solid var(--border);">
            <div class="card-header">
              <h3 class="card-title">5. Billing, Advance Deposit & Balance</h3>
              <span class="badge" style="background: var(--gold-light); color: var(--gold); font-weight: 700;">PAYMENT</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; align-items: end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="totalAmountInput">Total Tailoring Bill (₹)</label>
                <input type="number" id="totalAmountInput" class="form-input" style="font-size: 18px; font-weight: 700;" value="0" step="any" min="0">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="advancePaidInput">Advance Paid (₹)</label>
                <input type="number" id="advancePaidInput" class="form-input" style="font-size: 18px; font-weight: 700; color: var(--green);" value="0" step="any" min="0">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Auto-Calculated Balance (₹)</label>
                <div id="balanceDueDisplay" style="padding: 9px 14px; background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-size: 18px; font-weight: 800; color: var(--red);">
                  ₹0.00
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="payModeSelect">Payment Mode</label>
                <select id="payModeSelect" class="form-select" style="font-weight: 600;">
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Pending">Pending / Later</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; padding-bottom: 40px;">
            <button type="button" class="btn btn-secondary" onclick="BookingView.resetForm()">
              <span>🔄</span> Reset Form
            </button>

            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn btn-green" onclick="BookingView.handleSaveOrder('whatsapp')">
                <span>💬</span> Save & WhatsApp Slip
              </button>
              <button type="button" class="btn btn-dark" onclick="BookingView.handleSaveOrder('print')">
                <span>🖨️</span> Save & Print Job Slip
              </button>
              <button type="submit" class="btn btn-primary btn-lg">
                <span>✔</span> Confirm & Book Order
              </button>
            </div>
          </div>
        </form>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Phone auto lookup with 250ms debounce
    const phoneInput = document.getElementById('custPhone');
    let phoneDebounceTimer;
    phoneInput.addEventListener('input', (e) => {
      clearTimeout(phoneDebounceTimer);
      const val = e.target.value.trim();
      const badge = document.getElementById('custSuggestBadge');
      if (val.length === 10) {
        phoneDebounceTimer = setTimeout(async () => {
          try {
            const res = await API.getCustomerOrders(val);
            if (res.orders && res.orders.length > 0) {
              const last = res.orders[0];
              document.getElementById('custName').value = last.customer;
              badge.innerText = `✔ Found existing customer (${res.orders.length} past orders)`;
              badge.style.display = 'block';
            } else {
              badge.style.display = 'none';
            }
          } catch (_) {
            badge.style.display = 'none';
          }
        }, 250);
      } else {
        badge.style.display = 'none';
      }
    });

    // Refresh token
    document.getElementById('refreshTokenBtn').addEventListener('click', async (e) => {
      e.preventDefault();
      this.tokenData = await API.getNextToken();
      document.getElementById('orderTokenInput').value = this.tokenData.token;
    });

    // Urgent toggle
    document.getElementById('urgentToggle').addEventListener('change', (e) => {
      this.isUrgent = e.target.checked;
    });

    // Total and Advance calculation
    document.getElementById('totalAmountInput').addEventListener('input', () => this.updateBalanceDue());
    document.getElementById('advancePaidInput').addEventListener('input', () => this.updateBalanceDue());

    // Form submit
    document.getElementById('orderBookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveOrder('normal');
    });
  },

  getGarmentIcon(name) {
    if (name.includes('Suit') || name.includes('Blazer')) return '🤵';
    if (name.includes('Sherwani')) return '👑';
    if (name.includes('Shirt')) return '👔';
    if (name.includes('Kurta')) return '🥻';
    if (name.includes('Lehenga') || name.includes('Blouse')) return '👗';
    if (name.includes('Safari')) return '🦺';
    if (name.includes('Uniform')) return '🎖️';
    return '✂️';
  },

  toggleGarment(name, e) {
    const current = this.selectedGarments[name]?.qty || 0;
    this.updateQty(name, current === 0 ? 1 : -current);
  },

  updateQty(name, delta) {
    const current = this.selectedGarments[name]?.qty || 0;
    const next = Math.max(0, current + delta);
    const rate = this.catalog[name]?.rate || 500;

    const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');
    const displayEl = document.getElementById(`qty_${safeId}`);
    const cardEl = document.getElementById(`card_${safeId}`);

    if (next > 0) {
      this.selectedGarments[name] = { qty: next, rate };
      if (displayEl) displayEl.innerText = next;
      if (cardEl) cardEl.classList.add('selected');
      if (!this.measurements[name]) this.measurements[name] = {};
    } else {
      delete this.selectedGarments[name];
      if (displayEl) displayEl.innerText = '0';
      if (cardEl) cardEl.classList.remove('selected');
    }

    // Update garments count badge
    const count = Object.values(this.selectedGarments).reduce((sum, g) => sum + g.qty, 0);
    const countBadge = document.getElementById('garmentCountBadge');
    if (countBadge) countBadge.innerText = `${count} Garment(s) Selected`;

    this.recalculateTotal();
    this.renderMeasurements();
  },

  recalculateTotal() {
    let total = 0;
    Object.values(this.selectedGarments).forEach(g => {
      total += (g.qty || 1) * (g.rate || 0);
    });
    const totalInput = document.getElementById('totalAmountInput');
    if (totalInput) {
      totalInput.value = total;
      this.updateBalanceDue();
    }
  },

  updateBalanceDue() {
    const total = parseFloat(document.getElementById('totalAmountInput')?.value || 0);
    const advance = parseFloat(document.getElementById('advancePaidInput')?.value || 0);
    const balance = Math.max(0, total - advance);

    const balDisplay = document.getElementById('balanceDueDisplay');
    if (balDisplay) {
      balDisplay.innerText = `₹${PrintEngine.fmtMoney(balance)}`;
      balDisplay.style.color = balance === 0 ? 'var(--green)' : 'var(--red)';
    }
  },

  addDaysToDelivery(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yr = d.getFullYear();
    const mon = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const input = document.getElementById('deliveryDate');
    if (input) {
      input.value = `${yr}-${mon}-${day}`;
      const badge = document.getElementById('deliveryDateBadge');
      if (badge) {
        badge.innerText = `+${days} Days (${day}/${mon})`;
      }
    }
  },

  onDeliveryDateChange() {
    const input = document.getElementById('deliveryDate');
    const badge = document.getElementById('deliveryDateBadge');
    if (!input || !badge) return;
    const val = input.value;
    if (!val) {
      badge.innerText = 'Select Date';
      return;
    }
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const chosen = new Date(y, m - 1, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      chosen.setHours(0, 0, 0, 0);
      const diffDays = Math.round((chosen - today) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        badge.innerText = `Today (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;
      } else if (diffDays > 0) {
        badge.innerText = `+${diffDays} Days (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;
      } else {
        badge.innerText = `Past Date (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;
      }
    }
  },

  renderMeasurements() {
    const container = document.getElementById('measurementsContainer');
    if (!container) return;

    const names = Object.keys(this.selectedGarments);
    if (names.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 24px; border: 1.5px dashed var(--border); border-radius: var(--radius-md);">
          👉 Select one or more garments above to enter craft measurements, styling notes, and staff assignments.
        </div>
      `;
      return;
    }

    container.innerHTML = names.map(name => {
      const info = this.catalog[name] || {};
      const fields = (info.fields || "Length;Chest;Waist;Shoulder;Sleeve").split(';').map(f => f.trim()).filter(Boolean);
      const currMeas = this.measurements[name] || {};
      const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');

      // Determine current flow string
      let flowVal = currMeas._flow !== undefined ? currMeas._flow : '';
      if (!flowVal) {
        const fieldVals = fields.map(f => currMeas[f]).filter(v => v !== undefined && v !== null && v !== '');
        if (fieldVals.length > 0) {
          flowVal = fieldVals.join('  ');
        }
      }

      const garmentNote = this.garmentNotes[name] || '';
      const garmentCut = this.garmentStaff[name]?.cut || '';
      const garmentSew = this.garmentStaff[name]?.sew || '';

      return `
        <div class="meas-garment-box" id="meas_box_${safeId}">
          <!-- Garment Header -->
          <div class="meas-garment-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">${this.getGarmentIcon(name)}</span>
              <span style="font-size: 16px; font-weight: 800; color: var(--ink);">${name}</span>
              <span class="badge" style="background: var(--card-rose); color: var(--crimson); font-weight: 700;">
                ${this.selectedGarments[name].qty} piece${this.selectedGarments[name].qty > 1 ? 's' : ''}
              </span>
            </div>
            <button type="button" class="btn btn-ghost btn-xs" style="color: var(--muted); font-size: 11px;" 
                    onclick="BookingView.clearGarmentMeasurements('${name}')">
              Reset ${name}
            </button>
          </div>

          <!-- Single Standard Measurement Typing Box -->
          <div class="form-group" style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
              <label class="form-label" for="flow_meas_${safeId}" style="font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 0;">
                📐 Craft Measurements (${name})
              </label>
              <span style="font-size: 11px; color: var(--muted);">Type in one flow with spaces, commas, numbers or words (leave blank if unmeasured)</span>
            </div>
            <input type="text" 
                   id="flow_meas_${safeId}" 
                   class="form-input" 
                   placeholder="e.g. 14  15  31.50  40.75  30.50 (leave blank or enter tape numbers)" 
                   value="${String(flowVal).replace(/"/g, '&quot;')}"
                   oninput="BookingView.setGarmentMeasurement('${name}', this.value)">
          </div>

          <!-- 3. STYLING NOTES & WORKSHOP STAFF ASSIGNMENT FOR THIS GARMENT -->
          <div class="garment-workshop-grid">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase;">
                ✂️ Styling &amp; Posture Note (${name})
              </label>
              <textarea class="form-textarea garment-note-input" 
                        data-garment="${name}"
                        placeholder="Padding, lining, neck depth, piping, posture or pocket notes for ${name}..." 
                        style="min-height: 48px; height: 50px; font-size: 12px; padding: 6px 10px;"
                        oninput="BookingView.setGarmentNote('${name}', this.value)">${garmentNote}</textarea>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase; margin-bottom: 0;">
                  Cutting Master (${name})
                </label>
                <button type="button" class="btn btn-ghost btn-xs" style="font-size: 10px; color: var(--crimson); font-weight: 700; padding: 1px 6px; border: 1px solid var(--border); border-radius: 4px;" 
                        onclick="BookingView.applyStaffToAll('cut', BookingView.garmentStaff['${name}']?.cut || document.querySelector('#meas_box_${safeId} .garment-cut-select')?.value)" title="Apply this cutting master to all selected garments">
                  + Apply Cutter to all
                </button>
              </div>
              <select class="form-select garment-cut-select" 
                      data-garment="${name}" 
                      style="font-size: 12px; height: 38px;"
                      onchange="BookingView.setGarmentStaff('${name}', 'cut', this.value)">
                <option value="">— Unassigned —</option>
                ${this.availableStaff.cutting.map(s => `<option value="${s.name}" ${s.name === garmentCut ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase; margin-bottom: 0;">
                  Sewing Tailor (${name})
                </label>
                <button type="button" class="btn btn-ghost btn-xs" style="font-size: 10px; color: var(--crimson); font-weight: 700; padding: 1px 6px; border: 1px solid var(--border); border-radius: 4px;" 
                        onclick="BookingView.applyStaffToAll('sew', BookingView.garmentStaff['${name}']?.sew || document.querySelector('#meas_box_${safeId} .garment-sew-select')?.value)" title="Apply this sewing tailor to all selected garments">
                  + Apply Tailor to all
                </button>
              </div>
              <select class="form-select garment-sew-select" 
                      data-garment="${name}" 
                      style="font-size: 12px; height: 38px;"
                      onchange="BookingView.setGarmentStaff('${name}', 'sew', this.value)">
                <option value="">— Unassigned —</option>
                ${this.availableStaff.sewing.map(s => `<option value="${s.name}" ${s.name === garmentSew ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  setGarmentMeasurement(garment, rawText) {
    if (!this.measurements[garment]) this.measurements[garment] = {};
    const val = (rawText || '').trim();
    this.measurements[garment]._flow = val;

    // Optional convenience: if word tokens were typed and note is empty, reflect in note
    const cleaned = (rawText || '').replace(/[()\[\]{}]/g, ' ');
    const tokens = cleaned.trim().split(/[\s,;]+/).filter(Boolean);
    const wordTokens = tokens.filter(tok => {
      const cleanTok = tok.replace(/["']/g, '');
      return isNaN(parseFloat(cleanTok)) || !isFinite(cleanTok) || !/^[-+]?\d*\.?\d+$/.test(cleanTok);
    });

    if (wordTokens.length > 0 && !this.garmentNotes[garment]) {
      const container = document.getElementById('measurementsContainer');
      const noteInput = container ? container.querySelector(`textarea[data-garment="${garment}"]`) : null;
      if (noteInput && !noteInput.value) {
        noteInput.value = wordTokens.join(' ');
        this.garmentNotes[garment] = noteInput.value;
      }
    }
  },

  onFlowMeasurementInput(garment, rawText) {
    this.setGarmentMeasurement(garment, rawText);
  },

  setIndividualMeasurement(garment, field, value) {
    if (!this.measurements[garment]) this.measurements[garment] = {};
    this.measurements[garment][field] = value;
  },

  setGarmentNote(garment, note) {
    this.garmentNotes[garment] = note;
  },

  setGarmentStaff(garment, role, staffName) {
    if (!this.garmentStaff[garment]) this.garmentStaff[garment] = {};
    this.garmentStaff[garment][role] = staffName;
  },

  applyStaffToAll(role, staffName) {
    if (!staffName) return;
    Object.keys(this.selectedGarments).forEach(gName => {
      if (!this.garmentStaff[gName]) this.garmentStaff[gName] = {};
      this.garmentStaff[gName][role] = staffName;
    });
    // Update selects in DOM
    const container = document.getElementById('measurementsContainer');
    if (container) {
      container.querySelectorAll(`.garment-${role}-select`).forEach(sel => {
        sel.value = staffName;
      });
    }
    window.App.showToast(`Applied ${staffName} as ${role === 'cut' ? 'Cutting Master' : 'Sewing Tailor'} to all garments`, 'info');
  },

  clearGarmentMeasurements(garment) {
    delete this.measurements[garment];
    delete this.garmentNotes[garment];
    delete this.garmentStaff[garment];
    this.renderMeasurements();
  },

  clearMeasurements() {
    this.measurements = {};
    this.garmentNotes = {};
    this.garmentStaff = {};
    this.renderMeasurements();
  },

  hasUnsavedWork() {
    const cust = document.getElementById('custName')?.value?.trim();
    const phone = document.getElementById('custPhone')?.value?.trim();
    const notes = document.getElementById('tailoringNotes')?.value?.trim();
    const garmentsCount = Object.keys(this.selectedGarments || {}).length;
    const measCount = Object.keys(this.measurements || {}).length;
    return Boolean(cust || phone || notes || garmentsCount > 0 || measCount > 0);
  },

  resetForm() {
    this.selectedGarments = {};
    this.measurements = {};
    this.garmentNotes = {};
    this.garmentStaff = {};
    this.render(document.getElementById('viewport'));
  },

  async handleSaveOrder(action = 'normal') {
    const token = document.getElementById('orderTokenInput').value.trim();
    const customer = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const rawOrderDate = document.getElementById('orderDate').value.trim();
    const rawDeliveryDate = document.getElementById('deliveryDate').value.trim();
    const orderDate = this.formatDisplayDate(rawOrderDate);
    const deliveryDate = this.formatDisplayDate(rawDeliveryDate);
    const generalNotes = document.getElementById('tailoringNotes')?.value?.trim() || '';
    const total = parseFloat(document.getElementById('totalAmountInput').value || 0);
    const advance = parseFloat(document.getElementById('advancePaidInput').value || 0);
    const payMode = document.getElementById('payModeSelect').value;

    if (!customer || !phone) {
      window.App.showToast('Please enter customer name and phone number', 'error');
      return;
    }

    if (Object.keys(this.selectedGarments).length === 0) {
      window.App.showToast('Please select at least one garment', 'error');
      return;
    }

    // Build garments array with per-garment staff and styling notes
    const garmentsArray = Object.entries(this.selectedGarments).map(([name, data]) => ({
      name,
      qty: data.qty,
      rate: data.rate,
      notes: this.garmentNotes[name] || '',
      cut: this.garmentStaff[name]?.cut || '',
      sew: this.garmentStaff[name]?.sew || ''
    }));

    // Build work pieces with per-piece staff and styling notes
    const workPieces = [];
    garmentsArray.forEach(g => {
      const qty = g.qty || 1;
      for (let n = 1; n <= qty; n++) {
        workPieces.push({
          g: g.name,
          n: n,
          cut: g.cut || '',
          sew: g.sew || '',
          notes: g.notes || '',
          cut_rate: 0,
          sew_rate: 0,
          cut_slip: '',
          sew_slip: ''
        });
      }
    });

    const cutMasters = [...new Set(workPieces.map(p => p.cut).filter(Boolean))].join(', ');
    const sewTailors = [...new Set(workPieces.map(p => p.sew).filter(Boolean))].join(', ');

    const orderPayload = {
      token,
      customer,
      phone,
      order_date: orderDate,
      delivery_date: deliveryDate,
      urgent: this.isUrgent ? 1 : 0,
      garments: garmentsArray,
      measurements: this.measurements,
      work: workPieces,
      notes: generalNotes,
      cutting_master: cutMasters,
      sewing_tailor: sewTailors,
      total,
      advance,
      balance: Math.max(0, total - advance),
      pay_mode: payMode,
      status: cutMasters ? 'Cutting In-Process' : 'Cutting Pending'
    };

    try {
      const saved = await API.createOrder(orderPayload);
      window.App.showToast(`Order ${saved.token} successfully booked!`, 'success');

      if (action === 'print') {
        window.App.openPrintModal([saved.token]);
      } else if (action === 'whatsapp') {
        const msg = PrintEngine.generateOrderWhatsApp(saved, 'booked', window.App.settings?.shop_name);
        PrintEngine.openWhatsApp(saved.phone, msg);
      }

      // Reset and load fresh booking form
      this.resetForm();

    } catch (err) {
      window.App.showToast(`Failed to book order: ${err.message}`, 'error');
    }
  },

  async openCounterSettleLookup() {
    try {
      const ordersRes = await API.getOrders({ limit: 100, status: 'All' });
      const orders = ordersRes.orders || [];
      const unsettled = orders.filter(o => o.status !== 'Delivered' || (o.balance && o.balance > 0));

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px;">
              Search Order by Token, Phone, or Customer
            </label>
            <input type="text" id="counterLookupInput" class="form-input" placeholder="Type token (e.g. 26-104) or customer phone..." 
                   style="font-size: 14px; padding: 10px 12px; width: 100%; border: 1.5px solid var(--border-subtle); border-radius: 8px;"
                   oninput="BookingView.filterCounterLookup(this.value)">
          </div>

          <div style="max-height: 320px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px;" id="counterLookupList">
            ${unsettled.length === 0 ? '<div style="padding: 24px; text-align: center; color: var(--muted);">No open orders with pending balance found.</div>' : ''}
            ${unsettled.map(o => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s;"
                   class="order-lookup-row"
                   onmouseover="this.style.background='var(--paper)'" onmouseout="this.style.background='transparent'"
                   onclick="window.App.closeCustomModal(); window.App.openSettleModal('${o.token}')">
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: var(--ink);">
                    <strong style="color: var(--rust); margin-right: 6px;">${o.token}</strong> ${o.customer}
                  </div>
                  <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                    📞 ${o.phone} · Delivery: ${o.delivery_date} · Status: <span style="font-weight: 600; color: var(--ink-secondary);">${o.status}</span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 11px; color: var(--muted);">Balance Due</div>
                  <div style="font-size: 16px; font-weight: 800; color: ${o.balance > 0 ? 'var(--scarlet)' : 'var(--burgundy)'};">
                    ₹${PrintEngine.fmtMoney(o.balance)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      this._lookupOrders = unsettled;
      window.App.showCustomModal('💰 Settle & Deliver Order', html, null, 'Close');
    } catch (err) {
      window.App.showToast('Failed to load orders: ' + err.message, 'error');
    }
  },

  filterCounterLookup(query) {
    const listEl = document.getElementById('counterLookupList');
    if (!listEl || !this._lookupOrders) return;
    const q = query.toLowerCase().trim();
    const filtered = this._lookupOrders.filter(o => 
      (o.token && o.token.toLowerCase().includes(q)) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q))
    );

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--muted);">No matching orders found.</div>';
      return;
    }

    listEl.innerHTML = filtered.map(o => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s;"
           onmouseover="this.style.background='var(--paper)'" onmouseout="this.style.background='transparent'"
           onclick="window.App.closeCustomModal(); window.App.openSettleModal('${o.token}')">
        <div>
          <div style="font-weight: 700; font-size: 14px; color: var(--ink);">
            <strong style="color: var(--rust); margin-right: 6px;">${o.token}</strong> ${o.customer}
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
            📞 ${o.phone} · Delivery: ${o.delivery_date} · Status: <span style="font-weight: 600; color: var(--ink-secondary);">${o.status}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: var(--muted);">Balance Due</div>
          <div style="font-size: 16px; font-weight: 800; color: ${o.balance > 0 ? 'var(--scarlet)' : 'var(--burgundy)'};">
            ₹${PrintEngine.fmtMoney(o.balance)}
          </div>
        </div>
      </div>
    `).join('');
  }
};

