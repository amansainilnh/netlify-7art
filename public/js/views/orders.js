/* ==========================================================================
   7 ART TAILORS - ORDERS PIPELINE & MANAGEMENT VIEW
   ========================================================================== */

const OrdersView = {
  orders: [],
  total: 0,
  page: 1,
  limit: 25,
  pages: 1,
  searchQuery: '',
  selectedStatus: 'All',
  urgentOnly: false,
  selectedTokens: new Set(),
  staffList: { cutting: [], sewing: [] },

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

  async initStaff() {
    const list = await API.listStaff(null, true);
    this.staffList.cutting = list.filter(s => s.role === 'cutting');
    this.staffList.sewing = list.filter(s => s.role === 'sewing');
  },

  async loadOrders() {
    const params = {
      page: this.page,
      limit: this.limit,
      q: this.searchQuery,
      status: this.selectedStatus === 'All' ? '' : this.selectedStatus,
      urgent: this.urgentOnly ? 1 : ''
    };
    const res = await API.listOrders(params);
    this.orders = res.orders || [];
    this.total = res.total || 0;
    this.pages = res.pages || 1;
    this.selectedTokens.clear();
  },

  async render(container) {
    await this.initStaff();
    await this.loadOrders();

    const statuses = [
      "All", "Cutting Pending", "Cutting In-Process",
      "Stitching In-Progress", "Ready for Trial/Delivery", "Delivered"
    ];

    container.innerHTML = `
      <div>
        <!-- Title and Search / Filter Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">PRODUCTION PIPELINE</div>
            <h1 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--ink);">Orders & Garment Tracking</h1>
            <p style="font-size: 13px; color: var(--muted);">Monitor piece-by-piece workshop progress, print slips, and manage client settlements.</p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="OrdersView.exportExcel()">
              <span>📊</span> Export Excel (.xlsx)
            </button>
            <button class="btn btn-primary" onclick="window.App.navigate('booking')">
              <span>✂️</span> + New Order
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="card" style="margin-bottom: 20px; padding: 16px 20px;">
          <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
            
            <!-- Search Input -->
            <div style="flex-grow: 1; min-width: 280px; position: relative;">
              <input type="text" id="orderSearchInput" class="form-input" 
                     placeholder="Search token (e.g. 26-101), customer, phone, master cutter..." 
                     value="${this.searchQuery}" style="padding-left: 36px;">
              <span style="position: absolute; left: 12px; top: 10px; color: var(--muted);">🔍</span>
            </div>

            <!-- Status Dropdown -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--muted);">Status:</span>
              <select id="statusFilterSelect" class="form-select" style="width: auto; font-weight: 600;">
                ${statuses.map(s => `<option value="${s}" ${s === this.selectedStatus ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>

            <!-- Urgent Filter -->
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
              <input type="checkbox" id="urgentFilterCheck" ${this.urgentOnly ? 'checked' : ''} class="table-checkbox">
              <span style="font-weight: 700; font-size: 12px; color: var(--red);">🚨 Express Urgent Only</span>
            </label>

            <!-- Reset Filters -->
            <button class="btn btn-ghost btn-sm" onclick="OrdersView.resetFilters()">Reset</button>
          </div>
        </div>

        <!-- Multi-Select Action Bar (Dynamically Visible) -->
        <div id="bulkActionBar" class="card" style="display: none; margin-bottom: 16px; background: var(--card-warm); border: 1.5px solid var(--rust); padding: 12px 20px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: var(--rust);">
                <span id="bulkSelectedCount">0</span> orders selected
              </div>
              <button type="button" class="btn btn-ghost btn-sm" onclick="OrdersView.deselectAll()" style="color: var(--muted); border: 1px solid var(--border); padding: 3px 10px; font-size: 12px; cursor: pointer;">
                ✕ Deselect All
              </button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button class="btn btn-secondary btn-sm" onclick="OrdersView.openEditSelected()"><span style="margin-right: 2px;">✏️</span> Edit Order</button>
              <button class="btn btn-dark btn-sm" onclick="OrdersView.bulkPrint()">🖨️ Print Slips</button>
              <button class="btn btn-secondary btn-sm" onclick="OrdersView.openBulkMove('Cutting In-Process')">✂️ Move to Cutting</button>
              <button class="btn btn-secondary btn-sm" onclick="OrdersView.openBulkMove('Stitching In-Progress')">🧵 Move to Stitching</button>
              <button class="btn btn-green btn-sm" onclick="OrdersView.bulkSetStatus('Ready for Trial/Delivery')">✓ Mark Ready</button>
              <button class="btn btn-primary btn-sm" onclick="OrdersView.settleSelected()" style="background: #BD1A22; color: white;">💰 Settle & Deliver</button>
              <button class="btn btn-green btn-sm" onclick="OrdersView.openBulkWhatsApp()">💬 WhatsApp</button>
              <button class="btn btn-danger btn-sm" onclick="OrdersView.bulkDelete()">🗑️ Delete</button>
            </div>
          </div>
        </div>

        <!-- Orders Table Card -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th style="width: 36px; text-align: center;">
                    <input type="checkbox" id="selectAllCheckbox" class="table-checkbox" onchange="OrdersView.toggleSelectAll(this.checked)">
                  </th>
                  <th>Token</th>
                  <th>Customer Info</th>
                  <th>Garments & Pieces</th>
                  <th>Craft Dates</th>
                  <th>Status & Piece Tracking</th>
                  <th>Bill & Balance</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody">
                ${this.renderTableRows()}
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--sidebar); border-top: 1px solid var(--border); font-size: 13px;">
            <div style="color: var(--muted);">
              Showing ${(this.page - 1) * this.limit + 1} - ${Math.min(this.page * this.limit, this.total)} of <strong>${this.total.toLocaleString()}</strong> orders
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary btn-sm" ${this.page <= 1 ? 'disabled' : ''} onclick="OrdersView.changePage(${this.page - 1})">
                ◀ Previous
              </button>
              <span style="font-weight: 700; padding: 0 8px;">Page ${this.page} of ${this.pages}</span>
              <button class="btn btn-secondary btn-sm" ${this.page >= this.pages ? 'disabled' : ''} onclick="OrdersView.changePage(${this.page + 1})">
                Next ▶
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  renderTableRows() {
    if (this.orders.length === 0) {
      return `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--muted);">
            No orders match the current search or filters.
          </td>
        </tr>
      `;
    }

    return this.orders.map(o => {
      const isChecked = this.selectedTokens.has(o.token);
      let garments = o.garments;
      if (typeof garments === 'string') {
        try { garments = JSON.parse(garments); } catch (e) { garments = []; }
      }
      if (!Array.isArray(garments)) garments = [];
      const garmentSummary = garments.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || 'Custom Garment';

      let pieces = o.work;
      if (typeof pieces === 'string') {
        try { pieces = JSON.parse(pieces); } catch (e) { pieces = []; }
      }
      if (!Array.isArray(pieces)) pieces = [];

      return `
        <tr id="row_${o.token}" ondblclick="OrdersView.openEditModal('${o.token}')" style="cursor: pointer;" title="Double-click row to open edit modal">
          <td style="text-align: center;" ondblclick="event.stopPropagation()">
            <input type="checkbox" class="table-checkbox row-select-cb" value="${o.token}" 
                   ${isChecked ? 'checked' : ''} onchange="OrdersView.toggleSelect('${o.token}', this.checked)">
          </td>
          <td>
            <div style="font-family: var(--font-serif); font-size: 16px; font-weight: 800; color: var(--ink);">
              ${o.token}
            </div>
            ${o.urgent ? '<span class="badge badge-urgent" style="font-size: 9px; margin-top: 2px;">★ URGENT</span>' : ''}
          </td>
          <td>
            <div style="font-weight: 700; color: var(--ink);">${o.customer}</div>
            <div style="font-size: 12px; color: var(--muted); user-select: text;">
              📞 ${o.phone}
            </div>
          </td>
          <td style="max-width: 240px;">
            <div style="font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${garmentSummary}">
              ${garmentSummary}
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
              ${pieces.length} physical piece(s)
            </div>
          </td>
          <td>
            <div style="font-size: 12px; color: var(--muted);">Booked: ${o.order_date}</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--ink); margin-top: 2px;">
              Due: ${o.delivery_date}
            </div>
          </td>
          <td>
            <div style="margin-bottom: 4px;">
              <span class="badge badge-status-${this.getStatusClass(o.status)}">${o.status}</span>
            </div>
            <div style="font-size: 11px; color: var(--muted);">
              Cut: <strong>${o.cutting_master || '—'}</strong> | Sew: <strong>${o.sewing_tailor || '—'}</strong>
            </div>
          </td>
          <td>
            <div style="font-size: 13px;">Total: <strong>₹${PrintEngine.fmtMoney(o.total)}</strong></div>
            <div style="font-size: 12px; color: var(--green);">Adv: ₹${PrintEngine.fmtMoney(o.advance)}</div>
            <div style="font-size: 13px; font-weight: 800; color: ${o.balance > 0 ? 'var(--red)' : 'var(--green)'}; margin-top: 1px;">
              Due: ₹${PrintEngine.fmtMoney(o.balance)}
            </div>
          </td>
          <td style="text-align: right; white-space: nowrap;" ondblclick="event.stopPropagation()">
            <button class="btn btn-primary btn-sm" title="Settle & Deliver Order" onclick="window.App.openSettleModal('${o.token}')" style="background: #BD1A22; color: white; padding: 4px 8px; margin-right: 4px; font-weight: 700;">💰 Settle</button>
            <button class="btn btn-ghost btn-sm" title="Print Slip" onclick="window.App.openPrintModal(['${o.token}'])">🖨️</button>
            <button class="btn btn-green btn-sm" title="WhatsApp Customer" onclick="window.App.quickWhatsApp('${o.token}')">💬</button>
            <button class="btn btn-secondary btn-sm" title="View / Edit Order" onclick="OrdersView.openEditModal('${o.token}')">✏️</button>
            <a class="btn btn-ghost btn-sm" title="Download Order PDF" href="${API.getOrderPdfUrl(o.token)}" target="_blank">📄</a>
          </td>
        </tr>
      `;
    }).join('');
  },

  bindEvents() {
    let debounceTimer;
    document.getElementById('orderSearchInput').addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        this.searchQuery = e.target.value.trim();
        this.page = 1;
        await this.loadOrders();
        document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
      }, 300);
    });

    document.getElementById('statusFilterSelect').addEventListener('change', async (e) => {
      this.selectedStatus = e.target.value;
      this.page = 1;
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
    });

    document.getElementById('urgentFilterCheck').addEventListener('change', async (e) => {
      this.urgentOnly = e.target.checked;
      this.page = 1;
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
    });
  },

  getStatusClass(status) {
    if (status === 'Cutting Pending') return 'cutting-pending';
    if (status === 'Cutting In-Process') return 'cutting-process';
    if (status === 'Stitching In-Progress') return 'stitching';
    if (status === 'Ready for Trial/Delivery') return 'ready';
    return 'delivered';
  },

  toggleSelect(token, checked) {
    if (checked) {
      this.selectedTokens.add(token);
    } else {
      this.selectedTokens.delete(token);
    }
    this.updateBulkActionBar();
  },

  toggleSelectAll(checked) {
    if (checked) {
      this.orders.forEach(o => this.selectedTokens.add(o.token));
    } else {
      this.selectedTokens.clear();
    }
    document.querySelectorAll('.row-select-cb').forEach(cb => cb.checked = checked);
    this.updateBulkActionBar();
  },

  deselectAll() {
    this.selectedTokens.clear();
    const selectAllCb = document.getElementById('selectAllCheckbox');
    if (selectAllCb) selectAllCb.checked = false;
    document.querySelectorAll('.row-select-cb').forEach(cb => cb.checked = false);
    this.updateBulkActionBar();
  },

  updateBulkActionBar() {
    const bar = document.getElementById('bulkActionBar');
    const countEl = document.getElementById('bulkSelectedCount');
    const count = this.selectedTokens.size;

    if (count > 0) {
      bar.style.display = 'block';
      countEl.innerText = count;
    } else {
      bar.style.display = 'none';
    }
  },

  async changePage(newPage) {
    if (newPage < 1 || newPage > this.pages) return;
    this.page = newPage;
    await this.loadOrders();
    document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
  },

  resetFilters() {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.urgentOnly = false;
    this.page = 1;
    this.render(document.getElementById('viewport'));
  },

  openEditSelected() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) {
      window.App.showToast('Please select an order to edit', 'error');
      return;
    }
    this.openEditModal(tokens[0]);
  },

  settleSelected() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) {
      window.App.showToast('Please select an order to settle & deliver', 'error');
      return;
    }
    window.App.openSettleModal(tokens[0]);
  },

  bulkPrint() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;
    window.App.openPrintModal(tokens);
  },

  openBulkWhatsApp() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;
    window.App.openWhatsAppQueue(tokens);
  },

  async bulkSetStatus(status) {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;
    try {
      await API.bulkStatusChange(tokens, status);
      window.App.showToast(`Updated ${tokens.length} order(s) to ${status}`, 'success');
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
      this.updateBulkActionBar();
    } catch (err) {
      window.App.showToast(`Failed: ${err.message}`, 'error');
    }
  },

  openBulkMove(targetStatus) {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;

    const isCutting = targetStatus === 'Cutting In-Process';
    const staffList = isCutting ? this.staffList.cutting : this.staffList.sewing;
    const roleName = isCutting ? 'Cutting Master' : 'Sewing Tailor';

    const html = `
      <div class="form-group">
        <label class="form-label">Assign ${roleName} for ${tokens.length} selected orders:</label>
        <select id="bulkStaffSelect" class="form-select">
          <option value="">— Leave individual assignments —</option>
          ${staffList.map(s => `<option value="${s.name}">${s.name} (${s.phone || 'No phone'})</option>`).join('')}
        </select>
      </div>
    `;

    window.App.showCustomModal(`Move ${tokens.length} Orders to ${targetStatus}`, html, async () => {
      const selectedPerson = document.getElementById('bulkStaffSelect').value;
      const kwargs = {
        tokens,
        status: targetStatus,
        cutting_master: isCutting ? selectedPerson : null,
        sewing_tailor: !isCutting ? selectedPerson : null
      };
      await API.bulkStatusChange(tokens, targetStatus, kwargs.cutting_master, kwargs.sewing_tailor);
      window.App.showToast(`Moved ${tokens.length} order(s) to ${targetStatus}`, 'success');
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
      this.updateBulkActionBar();
    });
  },

  bulkDelete() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;

    window.App.askPassword('delete_password', async (password) => {
      try {
        await API.deleteOrders(tokens, password);
        window.App.showToast(`Deleted ${tokens.length} order(s)`, 'success');
        await this.loadOrders();
        document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
        this.updateBulkActionBar();
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    });
  },

  exportExcel() {
    window.location.href = API.getExcelDownloadUrl();
  },

  async openEditModal(token) {
    const order = await API.getOrder(token);
    if (!order) return;

    let garmentsList = order.garments || [];
    if (typeof garmentsList === 'string') {
      try { garmentsList = JSON.parse(garmentsList); } catch (e) { garmentsList = []; }
    }
    if (!Array.isArray(garmentsList)) garmentsList = [];

    let measurements = order.measurements || {};
    if (typeof measurements === 'string') {
      try { measurements = JSON.parse(measurements); } catch (e) { measurements = {}; }
    }
    if (typeof measurements !== 'object' || Array.isArray(measurements) || !measurements) measurements = {};

    let pieces = order.work || [];
    if (typeof pieces === 'string') {
      try { pieces = JSON.parse(pieces); } catch (e) { pieces = []; }
    }
    if (!Array.isArray(pieces)) pieces = [];

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Customer Name</label>
            <input type="text" id="editCustomer" class="form-input" value="${order.customer}">
          </div>
          <div>
            <label class="form-label">Phone</label>
            <input type="text" id="editPhone" class="form-input" value="${order.phone}">
          </div>
          <div>
            <label class="form-label">Order Date</label>
            <input type="date" id="editOrderDate" class="form-input" value="${this.toIsoDate(order.order_date)}" style="width: 100%; font-size: 14px; cursor: pointer; background: #fff;">
          </div>
          <div>
            <label class="form-label">Delivery Date</label>
            <input type="date" id="editDeliveryDate" class="form-input" value="${this.toIsoDate(order.delivery_date)}" style="width: 100%; font-size: 14px; cursor: pointer; background: #fff;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Status</label>
            <select id="editStatus" class="form-select">
              ${["Cutting Pending", "Cutting In-Process", "Stitching In-Progress", "Ready for Trial/Delivery", "Delivered"].map(s => `
                <option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Payment Mode</label>
            <select id="editPayMode" class="form-select">
              ${["UPI", "Cash", "Card", "Pending"].map(p => `
                <option value="${p}" ${p === order.pay_mode ? 'selected' : ''}>${p}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Total Bill (₹)</label>
            <input type="number" id="editTotal" class="form-input" value="${order.total}">
          </div>
          <div>
            <label class="form-label">Advance Paid (₹)</label>
            <input type="number" id="editAdvance" class="form-input" value="${order.advance}">
          </div>
          <div>
            <label class="form-label">Balance Due (₹)</label>
            <input type="number" id="editBalance" class="form-input" value="${order.balance}">
          </div>
        </div>

        <div>
          <label class="form-label">Styling & Posture Notes</label>
          <textarea id="editNotes" class="form-textarea">${order.notes || ''}</textarea>
        </div>

        <!-- Booked Garments List -->
        <div>
          <label class="form-label" style="font-weight: 700; color: var(--ink);">Booked Garments (${garmentsList.length})</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${garmentsList.length === 0 ? '<div style="color: var(--muted); font-size: 12px;">No garments listed</div>' : garmentsList.map((g, idx) => `
              <div style="background: var(--card-rose); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 6px 12px; font-size: 13px; display: flex; align-items: center; gap: 6px;">
                <span style="background: var(--crimson); color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;">${idx+1}</span>
                <strong style="color: var(--ink);">${g.qty || 1}x ${g.name}</strong>
                <span style="color: var(--muted); font-size: 11px;">(₹${PrintEngine.fmtMoney((g.rate || 0) * (g.qty || 1))})</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Craft Measurements Typing Boxes -->
        <div>
          <label class="form-label" style="font-weight: 700; color: var(--ink); display: flex; justify-content: space-between; align-items: baseline;">
            <span>Craft Measurements (Inches)</span>
            <span style="font-size: 11px; font-weight: 500; color: var(--muted);">Type tape numbers freely with spaces/words (blank if unmeasured)</span>
          </label>
          ${(() => {
            const orderGarments = [];
            if (Array.isArray(garmentsList)) {
              garmentsList.forEach(g => {
                const name = g.name || g.garment;
                if (name && !orderGarments.includes(name)) orderGarments.push(name);
              });
            }
            if (Array.isArray(pieces)) {
              pieces.forEach(p => {
                const name = p.g || p.garment;
                if (name && !orderGarments.includes(name)) orderGarments.push(name);
              });
            }
            Object.keys(measurements).forEach(k => {
              if (k && k !== '_flow' && !orderGarments.includes(k)) orderGarments.push(k);
            });
            if (orderGarments.length === 0) {
              orderGarments.push('General Garment');
            }

            return orderGarments.map(gName => {
              const gMeas = measurements[gName];
              let measVal = '';
              if (gMeas) {
                if (typeof gMeas === 'string') {
                  measVal = gMeas;
                } else if (typeof gMeas === 'object') {
                  if (gMeas._flow !== undefined && gMeas._flow !== null) {
                    measVal = String(gMeas._flow);
                  } else {
                    measVal = Object.entries(gMeas)
                      .filter(([k, v]) => k !== '_flow' && v !== undefined && v !== null && String(v).trim() !== '')
                      .map(([k, v]) => String(v).trim())
                      .join('  ');
                  }
                }
              }

              return `
                <div class="form-group" style="margin-bottom: 10px; background: var(--card-warm); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px;">
                  <label class="form-label" style="font-weight: 700; font-size: 12px; color: var(--crimson); text-transform: uppercase; margin-bottom: 5px;">
                    📐 ${gName} Measurements
                  </label>
                  <input type="text" 
                         class="form-input edit-order-meas-input" 
                         data-garment="${gName}" 
                         value="${measVal.replace(/"/g, '&quot;')}" 
                         placeholder="e.g. 14  15  31.50  40.75  30.50 (leave blank or edit measurements)"
                         style="background: #FFFFFF; font-size: 13.5px;">
                </div>
              `;
            }).join('');
          })()}
        </div>

        <!-- Piece Assignments -->
        <div>
          <label class="form-label">Pieces Assignment (${pieces.length} pieces)</label>
          <div class="table-responsive">
            <table class="table-custom" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Piece #</th>
                  <th>Garment</th>
                  <th>Cutting Master</th>
                  <th>Sewing Tailor</th>
                  <th>Styling Note</th>
                </tr>
              </thead>
              <tbody>
                ${pieces.map((p, idx) => `
                  <tr>
                    <td>#${p.n || idx + 1}</td>
                    <td><strong>${p.g}</strong></td>
                    <td>
                      <select class="form-select piece-cut-select" data-idx="${idx}" style="padding: 4px 8px; font-size: 12px;">
                        <option value="">— Unassigned —</option>
                        ${this.staffList.cutting.map(s => `<option value="${s.name}" ${s.name === p.cut ? 'selected' : ''}>${s.name}</option>`).join('')}
                      </select>
                    </td>
                    <td>
                      <select class="form-select piece-sew-select" data-idx="${idx}" style="padding: 4px 8px; font-size: 12px;">
                        <option value="">— Unassigned —</option>
                        ${this.staffList.sewing.map(s => `<option value="${s.name}" ${s.name === p.sew ? 'selected' : ''}>${s.name}</option>`).join('')}
                      </select>
                    </td>
                    <td>
                      <input type="text" class="form-input piece-note-input" data-idx="${idx}" value="${p.notes || ''}" placeholder="Note for piece..." style="padding: 4px 6px; font-size: 11.5px; height: 28px;">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Edit Order ${order.token}`, html, async () => {
      const updatedPcs = [...pieces];
      document.querySelectorAll('.piece-cut-select').forEach(sel => {
        const idx = parseInt(sel.dataset.idx);
        updatedPcs[idx].cut = sel.value;
      });
      document.querySelectorAll('.piece-sew-select').forEach(sel => {
        const idx = parseInt(sel.dataset.idx);
        updatedPcs[idx].sew = sel.value;
      });
      document.querySelectorAll('.piece-note-input').forEach(inp => {
        const idx = parseInt(inp.dataset.idx);
        updatedPcs[idx].notes = inp.value.trim();
      });

      const cutMasters = [...new Set(updatedPcs.map(p => p.cut).filter(Boolean))].join(', ');
      const sewTailors = [...new Set(updatedPcs.map(p => p.sew).filter(Boolean))].join(', ');

      // Collect any updated measurements
      const updatedMeas = JSON.parse(JSON.stringify(measurements));
      document.querySelectorAll('.edit-order-meas-input').forEach(inp => {
        const gName = inp.dataset.garment;
        const val = inp.value.trim();
        updatedMeas[gName] = { _flow: val };
      });

      const total = parseFloat(document.getElementById('editTotal').value || 0);
      const advance = parseFloat(document.getElementById('editAdvance').value || 0);
      const balance = parseFloat(document.getElementById('editBalance').value || 0);

      const payload = {
        customer: document.getElementById('editCustomer').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        order_date: this.formatDisplayDate(document.getElementById('editOrderDate').value),
        delivery_date: this.formatDisplayDate(document.getElementById('editDeliveryDate').value),
        status: document.getElementById('editStatus').value,
        pay_mode: document.getElementById('editPayMode').value,
        total,
        advance,
        balance,
        notes: document.getElementById('editNotes').value.trim(),
        work: updatedPcs,
        measurements: updatedMeas,
        cutting_master: cutMasters,
        sewing_tailor: sewTailors
      };

      await API.updateOrder(order.token, payload);
      window.App.showToast(`Order ${order.token} updated!`, 'success');
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
    }, 'Save changes', 'lg');
  }
};

window.OrdersView = OrdersView;

