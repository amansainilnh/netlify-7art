/* ==========================================================================
   7 ART TAILORS - CUSTOMERS DIRECTORY & LEDGER VIEW
   ========================================================================== */

const CustomersView = {
  customers: [],
  total: 0,
  page: 1,
  limit: 25,
  pages: 1,
  searchQuery: '',
  selectedPhones: new Set(),

  async loadCustomers() {
    const res = await API.listCustomers({
      page: this.page,
      limit: this.limit,
      q: this.searchQuery
    });
    this.customers = res.customers || [];
    this.total = res.total || 0;
    this.pages = res.pages || 1;
    this.selectedPhones.clear();
  },

  async render(container) {
    await this.loadCustomers();

    container.innerHTML = `
      <div>
        <!-- Title & Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 22px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">CLIENT DIRECTORY</div>
            <h1 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--ink);">Customer Directory & Balances</h1>
            <p style="font-size: 13px; color: var(--muted);">Grouped customer profiles, lifetime billing history, and outstanding balances.</p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-green" onclick="CustomersView.openSelectedWhatsAppQueue()">
              <span>💬</span> WhatsApp Queue
            </button>
          </div>
        </div>

        <!-- Multi-Select Action Bar (Dynamically Visible) -->
        <div id="custBulkActionBar" class="card" style="display: none; margin-bottom: 16px; background: var(--card-warm); border: 1.5px solid var(--rust); padding: 12px 20px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: var(--rust);">
                <span id="custSelectedCount">0</span> customer(s) selected
              </div>
              <button type="button" class="btn btn-ghost btn-sm" onclick="CustomersView.deselectAll()" style="color: var(--muted); border: 1px solid var(--border); padding: 3px 10px; font-size: 12px; cursor: pointer;">
                ✕ Deselect All
              </button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button class="btn btn-green btn-sm" onclick="CustomersView.openSelectedWhatsAppQueue()">💬 WhatsApp Queue</button>
            </div>
          </div>
        </div>

        <!-- Search Bar Card -->
        <div class="card" style="margin-bottom: 20px; padding: 14px 20px;">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="flex-grow: 1; position: relative;">
              <input type="text" id="custSearchInput" class="form-input" 
                     placeholder="Search client by name or 10-digit phone number..." 
                     value="${this.searchQuery}" style="padding-left: 36px;">
              <span style="position: absolute; left: 12px; top: 10px; color: var(--muted);">🔍</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="CustomersView.resetSearch()">Clear</button>
          </div>
        </div>

        <!-- Customers Table Card -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th style="width: 36px; text-align: center;">
                    <input type="checkbox" id="selectAllCustCb" class="table-checkbox" onchange="CustomersView.toggleSelectAll(this.checked)">
                  </th>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                  <th style="text-align: center;">Total Orders</th>
                  <th>Total Billed</th>
                  <th>Total Advances</th>
                  <th>Pending Balance</th>
                  <th>Last Order Date</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="customersTableBody">
                ${this.renderRows()}
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--sidebar); border-top: 1px solid var(--border); font-size: 13px;">
            <div style="color: var(--muted);">
              Showing ${(this.page - 1) * this.limit + 1} - ${Math.min(this.page * this.limit, this.total)} of <strong>${this.total.toLocaleString()}</strong> clients
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary btn-sm" ${this.page <= 1 ? 'disabled' : ''} onclick="CustomersView.changePage(${this.page - 1})">
                ◀ Previous
              </button>
              <span style="font-weight: 700; padding: 0 8px;">Page ${this.page} of ${this.pages}</span>
              <button class="btn btn-secondary btn-sm" ${this.page >= this.pages ? 'disabled' : ''} onclick="CustomersView.changePage(${this.page + 1})">
                Next ▶
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  renderRows() {
    if (this.customers.length === 0) {
      return `
        <tr>
          <td colspan="9" style="text-align: center; padding: 40px; color: var(--muted);">
            No customer records found.
          </td>
        </tr>
      `;
    }

    return this.customers.map(c => {
      const isChecked = this.selectedPhones.has(c.phone);
      const hasBalance = (c.pending_balance || 0) > 0;

      return `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="table-checkbox cust-row-cb" value="${c.phone}" 
                   ${isChecked ? 'checked' : ''} onchange="CustomersView.toggleSelect('${c.phone}', this.checked)">
          </td>
          <td>
            <div style="font-weight: 700; color: var(--ink); font-size: 14px;">${c.customer}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--muted);">${c.phone}</div>
          </td>
          <td style="text-align: center;">
            <span class="badge" style="background: var(--sidebar); font-size: 12px; font-weight: 700;">${c.total_orders}</span>
          </td>
          <td>
            <span style="font-weight: 700;">₹${PrintEngine.fmtMoney(c.total_billed)}</span>
          </td>
          <td>
            <span style="color: var(--green); font-weight: 600;">₹${PrintEngine.fmtMoney(c.total_advance)}</span>
          </td>
          <td>
            <span style="font-weight: 800; color: ${hasBalance ? 'var(--red)' : 'var(--green)'};">
              ₹${PrintEngine.fmtMoney(c.pending_balance)}
            </span>
          </td>
          <td>
            <div style="color: var(--muted); font-size: 12px;">${c.last_order_date || '—'}</div>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-sm" title="View Order History" onclick="CustomersView.viewHistory('${c.phone}', '${c.customer}')">
              📋 History
            </button>
            <button class="btn btn-green btn-sm" title="WhatsApp Message / Queue" onclick="CustomersView.openSingleCustomerWhatsApp('${c.phone}', '${c.customer}', ${c.pending_balance})">
              💬
            </button>
            <button class="btn btn-ghost btn-sm" title="Copy Phone" onclick="CustomersView.copyPhone('${c.phone}')">
              📋
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  bindEvents() {
    let debounceTimer;
    document.getElementById('custSearchInput').addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        this.searchQuery = e.target.value.trim();
        this.page = 1;
        await this.loadCustomers();
        document.getElementById('customersTableBody').innerHTML = this.renderRows();
      }, 300);
    });
  },

  toggleSelect(phone, checked) {
    if (checked) {
      this.selectedPhones.add(phone);
    } else {
      this.selectedPhones.delete(phone);
    }
    this.updateBulkActionBar();
  },

  toggleSelectAll(checked) {
    if (checked) {
      this.customers.forEach(c => this.selectedPhones.add(c.phone));
    } else {
      this.selectedPhones.clear();
    }
    document.querySelectorAll('.cust-row-cb').forEach(cb => cb.checked = checked);
    this.updateBulkActionBar();
  },

  deselectAll() {
    this.selectedPhones.clear();
    const selectAllCb = document.getElementById('selectAllCustCb');
    if (selectAllCb) selectAllCb.checked = false;
    document.querySelectorAll('.cust-row-cb').forEach(cb => cb.checked = false);
    this.updateBulkActionBar();
  },

  updateBulkActionBar() {
    const bar = document.getElementById('custBulkActionBar');
    const countEl = document.getElementById('custSelectedCount');
    const count = this.selectedPhones.size;
    if (bar && countEl) {
      if (count > 0) {
        bar.style.display = 'block';
        countEl.innerText = count;
      } else {
        bar.style.display = 'none';
      }
    }
  },

  openSingleCustomerWhatsApp(phone, customer, pending_balance) {
    window.App.openCustomerWhatsAppQueue([{
      phone,
      customer,
      pending_balance: parseFloat(pending_balance) || 0
    }]);
  },

  async changePage(newPage) {
    if (newPage < 1 || newPage > this.pages) return;
    this.page = newPage;
    await this.loadCustomers();
    document.getElementById('customersTableBody').innerHTML = this.renderRows();
    this.updateBulkActionBar();
  },

  resetSearch() {
    this.searchQuery = '';
    this.page = 1;
    this.render(document.getElementById('viewport'));
  },

  copyPhone(phone) {
    navigator.clipboard.writeText(phone);
    window.App.showToast(`Copied phone: ${phone}`, 'info');
  },

  sendCustomerWhatsApp(phone, customer, balance) {
    const shopName = window.App.settings?.shop_name || "7 ART TAILORS";
    let text = `Hello ${customer}, greetings from ${shopName}! `;
    if (balance > 0) {
      text += `This is a friendly reminder that you have a pending balance of ₹${PrintEngine.fmtMoney(balance)}. Thank you!`;
    } else {
      text += `Thank you for your patronage. Please let us know if you need any bespoke tailoring or adjustments!`;
    }
    PrintEngine.openWhatsApp(phone, text);
  },

  async viewHistory(phone, customer) {
    const res = await API.getCustomerOrders(phone);
    const orders = res.orders || [];

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid var(--border);">
          <div>
            <div style="font-size: 18px; font-weight: 700; color: var(--ink);">${customer}</div>
            <div style="font-size: 13px; color: var(--muted);">📞 +91 ${phone}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background: var(--sidebar); font-size: 13px; font-weight: 700;">${orders.length} Order(s) Recorded</span>
          </div>
        </div>

        <div class="table-responsive" style="max-height: 420px; overflow-y: auto;">
          <table class="table-custom" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Token</th>
                <th>Order Date</th>
                <th>Delivery</th>
                <th>Garments</th>
                <th>Status</th>
                <th>Total</th>
                <th>Balance</th>
                <th style="text-align: right;">Slip</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => {
                let gList = o.garments;
                if (typeof gList === 'string') { try { gList = JSON.parse(gList); } catch(e) { gList = []; } }
                if (!Array.isArray(gList)) gList = [];
                const gText = gList.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || '—';
                return `
                <tr>
                  <td><strong>${o.token}</strong></td>
                  <td>${o.order_date}</td>
                  <td>${o.delivery_date}</td>
                  <td>${gText}</td>
                  <td><span class="badge badge-status-${OrdersView.getStatusClass(o.status)}">${o.status}</span></td>
                  <td>₹${PrintEngine.fmtMoney(o.total)}</td>
                  <td style="font-weight: 700; color: ${o.balance > 0 ? 'var(--red)' : 'var(--green)'};">₹${PrintEngine.fmtMoney(o.balance)}</td>
                  <td style="text-align: right; white-space: nowrap;">
                    ${o.balance > 0 ? `<button class="btn btn-primary btn-sm" style="background: #BD1A22; color: white; padding: 2px 7px; margin-right: 4px; font-weight: 700;" onclick="window.App.closeCustomModal(); window.App.openSettleModal('${o.token}')">💰 Settle</button>` : ''}
                    <button class="btn btn-ghost btn-sm" onclick="window.App.openPrintModal(['${o.token}'])">🖨️</button>
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Client History: ${customer}`, html, null, 'Close');
  },

  openSelectedWhatsAppQueue() {
    const phones = Array.from(this.selectedPhones);
    let targetCustomers = [];
    if (phones.length > 0) {
      targetCustomers = this.customers.filter(c => phones.includes(c.phone));
    } else {
      targetCustomers = this.customers;
    }

    if (targetCustomers.length === 0) {
      window.App.showToast('No customers available for WhatsApp queue', 'warning');
      return;
    }

    window.App.openCustomerWhatsAppQueue(targetCustomers.map(c => ({
      customer: c.customer,
      phone: c.phone,
      pending_balance: parseFloat(c.pending_balance) || 0
    })));
  }
};

