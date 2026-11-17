/* ==========================================================================
   7 ART TAILORS - EMPLOYEE WORKER PORTAL VIEW
   Dedicated Mobile-Optimized Workspace for Cutting Masters & Sewing Tailors
   ========================================================================== */

window.MyWorkView = {
  currentTab: 'pending',
  portalData: null,

  async render(container) {
    const user = App.currentUser;
    const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
    const userRole = user?.role || 'employee';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Craftsman Header Banner -->
        <div style="background: linear-gradient(135deg, #1F1A17 0%, #352B25 100%); color: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span class="role-badge role-badge-employee">✂️ EMPLOYEE PORTAL</span>
              <span style="font-size: 12px; opacity: 0.8; font-family: var(--font-mono);">Live Workshop Bench</span>
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: #FAF8F5;">
              ${workerName.toUpperCase()}
            </h2>
            <p style="font-size: 13px; color: #D1C7BD;">
              Real-time assigned cutting & stitching pieces. Tap to mark work completed as you craft.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-secondary btn-sm" onclick="MyWorkView.refresh()" style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.25);">
              <span>🔄</span> Refresh Work
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.logout()" style="background: rgba(179,64,46,0.2); color: #FFB4AB; border: 1px solid rgba(179,64,46,0.4);">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div id="portalMetricsGrid" class="metrics-grid">
          <div class="metric-card"><div class="metric-label">Loading stats...</div></div>
        </div>

        <!-- Tab Controls & Filter -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm ${this.currentTab === 'pending' ? 'btn-primary' : 'btn-secondary'}" onclick="MyWorkView.setTab('pending')">
              <span>⏳</span> Pending Bench Work (<span id="pendingCountBadge">0</span>)
            </button>
            <button class="btn btn-sm ${this.currentTab === 'done' ? 'btn-primary' : 'btn-secondary'}" onclick="MyWorkView.setTab('done')">
              <span>✓</span> Completed Work (<span id="doneCountBadge">0</span>)
            </button>
            <button class="btn btn-sm ${this.currentTab === 'rates' ? 'btn-primary' : 'btn-secondary'}" onclick="MyWorkView.setTab('rates')">
              <span>💰</span> Rate Card
            </button>
          </div>
          <div style="font-size: 12px; color: var(--muted);">
            💡 Changes sync immediately to Counter & Owner
          </div>
        </div>

        <!-- Piece Content Area -->
        <div id="portalContentArea">
          <div style="text-align: center; padding: 40px; color: var(--muted);">Loading assigned pieces...</div>
        </div>

      </div>
    `;

    await this.fetchData(workerName);
  },

  async fetchData(workerName) {
    try {
      this.portalData = await API.getWorkerPortalData(workerName);
      this.renderMetrics();
      this.renderContent();
    } catch (err) {
      console.error("Worker portal fetch error:", err);
      const area = document.getElementById('portalContentArea');
      if (area) {
        area.innerHTML = `
          <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 32px; text-align: center;">
            <p style="color: var(--muted);">No active piece assignments found under name <strong>${workerName}</strong>.</p>
            <p style="font-size: 12px; color: var(--muted); margin-top: 8px;">Make sure orders have been assigned to you at the counter or in the Orders Pipeline.</p>
          </div>
        `;
      }
    }
  },

  renderMetrics() {
    const d = this.portalData;
    if (!d) return;

    const grid = document.getElementById('portalMetricsGrid');
    const pBadge = document.getElementById('pendingCountBadge');
    const dBadge = document.getElementById('doneCountBadge');

    if (pBadge) pBadge.innerText = d.pending_count || 0;
    if (dBadge) dBadge.innerText = d.done_count || 0;

    if (grid) {
      grid.innerHTML = `
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Assigned Work</span>
            <span class="metric-icon">📋</span>
          </div>
          <div class="metric-value">${d.total_assigned}</div>
          <div class="metric-subtext">Total garment pieces</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid var(--gold);">
          <div class="metric-header">
            <span class="metric-label">Pending Craft</span>
            <span class="metric-icon">⏱️</span>
          </div>
          <div class="metric-value" style="color: var(--gold);">${d.pending_count}</div>
          <div class="metric-subtext">Awaiting your touch</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid var(--green);">
          <div class="metric-header">
            <span class="metric-label">Completed Pieces</span>
            <span class="metric-icon">✓</span>
          </div>
          <div class="metric-value" style="color: var(--green);">${d.done_count}</div>
          <div class="metric-subtext">Ready for trial / next step</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid var(--rust);">
          <div class="metric-header">
            <span class="metric-label">Earned Piece Work</span>
            <span class="metric-icon">₹</span>
          </div>
          <div class="metric-value" style="color: var(--rust);">₹${Math.round(d.earnings_est).toLocaleString('en-IN')}</div>
          <div class="metric-subtext">Based on your rate sheet</div>
        </div>
      `;
    }
  },

  setTab(tab) {
    this.currentTab = tab;
    // Re-render button active states
    document.querySelectorAll('#portalContentArea').forEach(() => {});
    const container = document.getElementById('viewport');
    if (container) {
      this.render(container);
    }
  },

  async refresh() {
    const user = App.currentUser;
    const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
    App.showToast('Refreshing assignments...', 'info');
    await this.fetchData(workerName);
  },

  renderContent() {
    const area = document.getElementById('portalContentArea');
    if (!area || !this.portalData) return;

    if (this.currentTab === 'rates') {
      this.renderRateSheet(area);
      return;
    }

    const pieces = (this.portalData.pieces || []).filter(p => {
      if (this.currentTab === 'pending') return !p.is_done;
      if (this.currentTab === 'done') return p.is_done;
      return true;
    });

    if (pieces.length === 0) {
      area.innerHTML = `
        <div style="background: var(--card); border: 1px dashed var(--border); border-radius: var(--radius-md); padding: 48px 24px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">${this.currentTab === 'pending' ? '🎉' : '📂'}</div>
          <h3 style="font-family: var(--font-serif); font-size: 18px; margin-bottom: 4px;">
            ${this.currentTab === 'pending' ? 'All caught up! No pending pieces.' : 'No completed pieces yet.'}
          </h3>
          <p style="font-size: 13px; color: var(--muted);">
            ${this.currentTab === 'pending' ? 'Great work! Take a break or check upcoming orders.' : 'Mark your pieces completed as you finish them.'}
          </p>
        </div>
      `;
      return;
    }

    area.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${pieces.map(p => `
          <div class="portal-piece-row ${p.is_done ? 'is-done' : ''}">
            
            <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
              <div style="text-align: center; min-width: 80px;">
                <span class="token-pill" style="font-size: 13px;">${p.token}</span>
                ${p.urgent ? '<div style="margin-top: 4px;"><span class="badge badge-urgent" style="font-size: 9px; padding: 2px 5px;">⚡ Express</span></div>' : ''}
              </div>

              <div>
                <div style="font-weight: 700; font-size: 15px; color: var(--ink);">
                  ${p.garment} <span style="font-size: 12px; font-weight: normal; color: var(--muted);">(Piece #${p.piece_n})</span>
                </div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                  Client: <strong>${p.customer}</strong> · Due: <strong>${p.delivery_date}</strong>
                </div>
                <div style="font-size: 11px; margin-top: 4px; display: flex; gap: 8px; align-items: center;">
                  <span class="badge ${p.worker_role === 'cutting' ? 'badge-cutting' : 'badge-stitching'}">
                    ${p.worker_role === 'cutting' ? '✂️ Cutting Master' : '🧵 Sewing Tailor'}
                  </span>
                  <span style="font-family: var(--font-mono); color: var(--rust); font-weight: 700;">
                    ${p.rate > 0 ? `Rate: ₹${p.rate}` : 'Rate: —'}
                  </span>
                  ${p.slip_no ? `<span class="badge badge-ready" style="font-size: 10px;">Settled on ${p.slip_no}</span>` : ''}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              ${!p.is_done ? `
                <button class="btn btn-primary btn-sm" onclick="MyWorkView.markPieceDone('${p.token}', '${p.garment}', ${p.piece_n}, '${p.worker_role}')">
                  <span>✓</span> Mark ${p.worker_role === 'cutting' ? 'Cut Done' : 'Stitched Done'}
                </button>
              ` : `
                <span class="badge badge-delivered" style="font-size: 12px; padding: 6px 12px;">
                  ✓ Piece Completed
                </span>
                <button class="btn btn-secondary btn-sm" title="Undo completed status if marked by accident" onclick="MyWorkView.undoPieceDone('${p.token}', '${p.garment}', ${p.piece_n}, '${p.worker_role}')" style="font-size: 11px; padding: 4px 8px;">
                  Undo
                </button>
              `}
            </div>

          </div>
        `).join('')}
      </div>
    `;
  },

  renderRateSheet(area) {
    const rates = this.portalData?.rates || {};
    const keys = Object.keys(rates);

    if (keys.length === 0) {
      area.innerHTML = `
        <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 32px; text-align: center;">
          <p style="color: var(--muted);">No custom rate list configured for your profile yet.</p>
          <p style="font-size: 12px; color: var(--muted); margin-top: 6px;">The Authority owner can configure your rates under Personnel & Team Manage.</p>
        </div>
      `;
      return;
    }

    area.innerHTML = `
      <div class="portal-card">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h3 style="font-family: var(--font-serif); font-size: 18px;">My Personal Piece Work Rates</h3>
          <span style="font-size: 12px; color: var(--muted);">Used automatically for your salary slip calculation</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 8px;">
          ${keys.map(g => `
            <div style="background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: var(--ink);">${g}</span>
              <span style="font-family: var(--font-mono); font-weight: 800; color: var(--rust); font-size: 15px;">₹${rates[g]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  async markPieceDone(token, garment, pieceN, workerRole) {
    // 1. Optimistic UI update: instantly update DOM on client side before network roundtrip
    const pieces = this.portalData?.pieces || [];
    const target = pieces.find(p => String(p.token) === String(token) && p.garment === garment && Number(p.piece_n) === Number(pieceN));
    const prevDone = target ? target.is_done : false;

    if (target) {
      target.is_done = true;
      if (this.portalData.pending_count > 0) this.portalData.pending_count--;
      this.portalData.done_count = (this.portalData.done_count || 0) + 1;
      this.renderMetrics();
      this.renderContent();
    }

    try {
      await API.updateWorkerPiece(token, garment, pieceN, workerRole, true);
      App.showToast(`Piece marked complete for Token ${token}!`, 'success');
      // Silently refresh in background to ensure database synchronization
      const user = App.currentUser;
      const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
      this.fetchData(workerName).catch(() => {});
    } catch (err) {
      // Rollback on network failure
      if (target) {
        target.is_done = prevDone;
        this.portalData.pending_count = (this.portalData.pending_count || 0) + 1;
        if (this.portalData.done_count > 0) this.portalData.done_count--;
        this.renderMetrics();
        this.renderContent();
      }
      App.showToast(err.message || 'Failed to update piece (network issue)', 'error');
    }
  },

  async undoPieceDone(token, garment, pieceN, workerRole) {
    // 1. Optimistic UI update
    const pieces = this.portalData?.pieces || [];
    const target = pieces.find(p => String(p.token) === String(token) && p.garment === garment && Number(p.piece_n) === Number(pieceN));
    const prevDone = target ? target.is_done : true;

    if (target) {
      target.is_done = false;
      this.portalData.pending_count = (this.portalData.pending_count || 0) + 1;
      if (this.portalData.done_count > 0) this.portalData.done_count--;
      this.renderMetrics();
      this.renderContent();
    }

    try {
      await API.updateWorkerPiece(token, garment, pieceN, workerRole, false);
      App.showToast(`Piece marked pending for Token ${token}`, 'info');
      const user = App.currentUser;
      const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
      this.fetchData(workerName).catch(() => {});
    } catch (err) {
      // Rollback on network failure
      if (target) {
        target.is_done = prevDone;
        if (this.portalData.pending_count > 0) this.portalData.pending_count--;
        this.portalData.done_count = (this.portalData.done_count || 0) + 1;
        this.renderMetrics();
        this.renderContent();
      }
      App.showToast(err.message || 'Failed to undo piece (network issue)', 'error');
    }
  }
};

