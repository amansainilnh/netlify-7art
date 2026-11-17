/* ==========================================================================
   7 ART TAILORS - DASHBOARD VIEW
   ========================================================================== */

const DashboardView = {
  currentPeriod: 'All orders',
  data: null,

  getTimeGreeting(ownerName = "BHAGIRATH SAINI") {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17) {
      timeGreeting = "Good evening";
    }
    return `${timeGreeting}, ${ownerName}`;
  },

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 250px;">
        <div style="text-align: center; color: var(--muted);">
          <div style="font-size: 24px; animation: spin 1s infinite linear;">✂️</div>
          <div style="margin-top: 8px; font-weight: 600;">Loading atelier dashboard...</div>
        </div>
      </div>
    `;

    try {
      this.data = await API.getDashboard(this.currentPeriod);
      const settings = window.App?.settings || {};
      const ownerName = settings.owner_name || "BHAGIRATH SAINI";
      const greeting = this.getTimeGreeting(ownerName);

      const periods = [
        "Last 7 days", "Last 15 days", "Last 30 days",
        "Last 2 months", "Last 3 months", "Last 6 months", "Last 1 year",
        "All orders"
      ];

      container.innerHTML = `
        <!-- Top Greeting and Filter Bar -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 26px;">
          <div>
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">ATELIER OVERVIEW</div>
            <h1 style="font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--ink); margin-top: 2px;">
              ${greeting}
            </h1>
            <p style="color: var(--muted); font-size: 13px;">Here is the production status across your cutting tables and sewing units.</p>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 12px; font-weight: 600; color: var(--muted);">Period Filter:</span>
            <select id="dashPeriodSelect" class="form-select" style="width: auto; padding: 7px 12px; font-weight: 600; background-color: var(--card);">
              ${periods.map(p => `<option value="${p}" ${p === this.currentPeriod ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
            <button id="dashNewOrderBtn" class="btn btn-primary" style="padding: 8px 16px;">
              <span>✂️</span> + New Order
            </button>
          </div>
        </div>

        <!-- 4 Summary Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 30px;">
          <!-- Card 1: In Progress -->
          <div class="card" style="border-left: 4px solid var(--status-stitching); cursor: pointer;" onclick="window.App.navigate('orders', {status: 'In Progress'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">IN PRODUCTION</div>
                <div style="font-family: var(--font-serif); font-size: 34px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ${this.data.in_progress.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: var(--crimson); font-weight: 600;">Cutting & Stitching Active</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--rust-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                🧵
              </div>
            </div>
          </div>

          <!-- Card 2: Due This Week -->
          <div class="card" style="border-left: 4px solid var(--rust); cursor: pointer;" onclick="window.App.navigate('orders', {filter: 'due_week'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">DUE THIS WEEK</div>
                <div style="font-family: var(--font-serif); font-size: 34px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ${this.data.due_this_week.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: var(--rust); font-weight: 600;">Upcoming Deliveries</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--rust-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                📅
              </div>
            </div>
          </div>

          <!-- Card 3: Ready for Pickup -->
          <div class="card" style="border-left: 4px solid var(--green); cursor: pointer;" onclick="window.App.navigate('orders', {status: 'Ready for Trial/Delivery'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">READY FOR PICKUP</div>
                <div style="font-family: var(--font-serif); font-size: 34px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ${this.data.ready_pickup.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: var(--green); font-weight: 600;">Finished & Awaiting Client</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--green-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                ✨
              </div>
            </div>
          </div>

          <!-- Card 4: Outstanding Balances -->
          <div class="card" style="border-left: 4px solid var(--gold); cursor: pointer;" onclick="window.App.navigate('orders', {filter: 'has_balance'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">PENDING BALANCES</div>
                <div style="font-family: var(--font-serif); font-size: 30px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ₹${PrintEngine.fmtMoney(this.data.outstanding_total)}
                </div>
                <div style="font-size: 12px; color: var(--gold); font-weight: 600;">${this.data.outstanding_count} Client(s) with Balance</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--gold-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                💰
              </div>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Upcoming Deliveries & Outstanding Balances -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px;">
          
          <!-- Column 1: Upcoming Deliveries List -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Upcoming Deliveries</h3>
                <p class="card-subtitle">Orders scheduled for completion and client trial</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('orders')">View All</button>
            </div>

            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Customer</th>
                    <th>Promised</th>
                    <th>Status</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${(this.data.upcoming_deliveries || []).length === 0 ? `
                    <tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 24px;">No upcoming deliveries in this period.</td></tr>
                  ` : (this.data.upcoming_deliveries || []).map(o => `
                    <tr>
                      <td>
                        <strong>${o.token}</strong>
                        ${o.urgent ? '<span class="badge badge-urgent" style="font-size: 9px; margin-left: 4px;">URGENT</span>' : ''}
                      </td>
                      <td>
                        <div style="font-weight: 600;">${o.customer}</div>
                        <div style="font-size: 11px; color: var(--muted);">${o.phone}</div>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: ${o.is_overdue ? 'var(--red)' : 'var(--ink)'};">
                          ${o.delivery_date}
                        </div>
                        ${o.is_overdue ? '<span style="font-size: 10px; color: var(--red); font-weight: 700;">Overdue</span>' : ''}
                      </td>
                      <td>
                        <span class="badge badge-status-${this.getStatusClass(o.status)}">${o.status}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-ghost btn-sm" title="Print Slip" onclick="window.App.openPrintModal(['${o.token}'])">🖨️</button>
                        <button class="btn btn-green btn-sm" title="WhatsApp Customer" onclick="window.App.quickWhatsApp('${o.token}')">💬</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Column 2: Outstanding Balances List -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Outstanding Client Balances</h3>
                <p class="card-subtitle">Pending collections from delivered or ready orders</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('customers')">Customer Ledger</button>
            </div>

            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Token</th>
                    <th>Due Date</th>
                    <th>Balance Due</th>
                    <th style="text-align: right;">Settle</th>
                  </tr>
                </thead>
                <tbody>
                  ${(this.data.outstanding_balances || []).length === 0 ? `
                    <tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 24px;">No outstanding client balances!</td></tr>
                  ` : (this.data.outstanding_balances || []).map(o => `
                    <tr>
                      <td>
                        <div style="font-weight: 600;">${o.customer}</div>
                        <div style="font-size: 11px; color: var(--muted);">${o.phone}</div>
                      </td>
                      <td><strong>${o.token}</strong></td>
                      <td>${o.delivery_date}</td>
                      <td>
                        <span style="font-weight: 700; color: var(--red); font-size: 14px;">₹${PrintEngine.fmtMoney(o.balance)}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-secondary btn-sm" onclick="window.App.openSettleModal('${o.token}')">
                          Collect
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;

      // Event Listeners
      document.getElementById('dashPeriodSelect').addEventListener('change', (e) => {
        this.currentPeriod = e.target.value;
        this.render(container);
      });

      document.getElementById('dashNewOrderBtn').addEventListener('click', () => {
        window.App.navigate('booking');
      });

    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; color: var(--red);">
          <h3>Error loading dashboard</h3>
          <p style="margin-top: 8px;">${err.message}</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="DashboardView.render(document.getElementById('viewport'))">Retry</button>
        </div>
      `;
    }
  },

  getStatusClass(status) {
    if (status === 'Cutting Pending') return 'cutting-pending';
    if (status === 'Cutting In-Process') return 'cutting-process';
    if (status === 'Stitching In-Progress') return 'stitching';
    if (status === 'Ready for Trial/Delivery') return 'ready';
    return 'delivered';
  }
};

