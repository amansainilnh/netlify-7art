/* ==========================================================================
   7 ART TAILORS - TEAM & MANAGE (PERSONNEL) VIEW
   Matches Desktop Screenshots 1, 2, 4
   ========================================================================== */

const ManageView = {
  staff: [],
  cuttingMasters: [],
  sewingTailors: [],

  async loadStaff() {
    this.staff = await API.listStaff();
    this.cuttingMasters = this.staff.filter(s => s.role === 'cutting');
    this.sewingTailors = this.staff.filter(s => s.role === 'sewing');
  },

  async render(container) {
    await this.loadStaff();

    const cuttingAvailCount = this.cuttingMasters.filter(s => s.available).length;
    const sewingAvailCount = this.sewingTailors.filter(s => s.available).length;

    container.innerHTML = `
      <div>
        <!-- Page Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">TEAM</div>
            <h1 style="font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--ink);">Manage</h1>
            <p style="font-size: 13px; color: var(--muted);">Today's cutting masters and sewing tailors</p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="ManageView.openPersonnelListModal()">
              <span>📋</span> Personnel List
            </button>
            <button class="btn btn-secondary" onclick="ManageView.openSalaryHistoryModal()">
              <span>📜</span> Salary History
            </button>
            <button class="btn btn-primary" onclick="ManageView.openAddPersonModal()">
              <span>+</span> Add Person
            </button>
          </div>
        </div>

        <!-- 2 Columns: Cutting Masters & Sewing Tailors -->
        <div class="manage-columns-grid">
          
          <!-- Column 1: Cutting Masters -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              <h2 style="font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--ink);">Cutting Masters</h2>
              <div style="font-size: 12px; color: var(--muted); font-weight: 600;">
                ${cuttingAvailCount} available · ${this.cuttingMasters.length} total
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${this.cuttingMasters.length === 0 ? `
                <div style="text-align: center; color: var(--muted); padding: 24px;">No cutting masters registered.</div>
              ` : this.cuttingMasters.map(p => this.renderWorkerCard(p)).join('')}
            </div>
          </div>

          <!-- Column 2: Sewing Tailors -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              <h2 style="font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--ink);">Sewing Tailors</h2>
              <div style="font-size: 12px; color: var(--muted); font-weight: 600;">
                ${sewingAvailCount} available · ${this.sewingTailors.length} total
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${this.sewingTailors.length === 0 ? `
                <div style="text-align: center; color: var(--muted); padding: 24px;">No sewing tailors registered.</div>
              ` : this.sewingTailors.map(p => this.renderWorkerCard(p)).join('')}
            </div>
          </div>

        </div>

        <!-- Footer Hint (Matches Desktop) -->
        <div style="margin-top: 24px; padding: 14px 20px; background: var(--sidebar); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 12px; color: var(--muted); line-height: 1.6;">
          <strong>Tip:</strong> Tick = available for work assignment. Untick a person to hide them from the order assignment lists only; they stay on this page and in Personnel List with all their records. Use <strong>'Entry'</strong> to assign batches of cut/sew pieces, <strong>'Advance'</strong> to record advance payments/settlements, and <strong>'Salary Slip'</strong> to settle completed piece-work.
        </div>
      </div>
    `;
  },

  renderWorkerCard(person) {
    const isCutting = person.role === 'cutting';
    const roleBadgeClass = isCutting ? 'badge-role-cutting' : 'badge-role-sewing';
    const roleTitle = isCutting ? 'Cutting Master' : 'Sewing Tailor';
    const advDue = parseFloat(person.advance_due || 0);

    return `
      <div class="worker-card-inner">
        <!-- Checkbox & Worker Info -->
        <div class="worker-info-wrap">
          <input type="checkbox" class="table-checkbox" ${person.available ? 'checked' : ''} 
                 title="Toggle Availability" onchange="ManageView.toggleAvailability(${person.id}, this.checked)">
          
          <div style="min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 700; font-size: 15px; color: var(--ink);">${person.name}</span>
              <span class="badge ${roleBadgeClass}" style="font-size: 10px;">${roleTitle}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); margin-top: 3px; flex-wrap: wrap;">
              <span>📞 ${person.phone || 'No phone'}</span>
              ${advDue > 0 ? `<span class="badge badge-advance" style="font-size: 11px;">Advance due ₹${PrintEngine.fmtMoney(advDue)}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- 3 Quick Action Buttons (Entry, Manage advance, Salary slip) -->
        <div class="worker-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="ManageView.openEntryModal(${person.id})" title="Batch Piece Assignment">
            ✏️ Entry
          </button>
          <button class="btn btn-secondary btn-sm" onclick="ManageView.openManageAdvanceModal(${person.id})" title="Advance Ledger">
            💰 Advance
          </button>
          <button class="btn btn-secondary btn-sm" onclick="ManageView.openSalarySlipModal(${person.id})" title="Create Salary Slip">
            📜 Salary Slip
          </button>
        </div>
      </div>
    `;
  },

  async toggleAvailability(id, isAvailable) {
    try {
      await API.updateStaff(id, { available: isAvailable });
      window.App.showToast(`Updated availability for staff member`, 'info');
      await this.loadStaff();
    } catch (err) {
      window.App.showToast(err.message, 'error');
    }
  },

  // -------------------------------------------------------------
  // 1. Batch Entry Modal (Screenshot 4)
  // -------------------------------------------------------------
  async openEntryModal(personId) {
    const person = await API.getStaff(personId);
    if (!person) return;

    const roleName = person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor';
    const roleAction = person.role === 'cutting' ? 'cutting master' : 'sewing tailor';
    const defaultPrefix = window.App?.settings?.token_prefix || "26";

    let rowsHtml = '';
    for (let i = 1; i <= 6; i++) {
      rowsHtml += `
        <tr class="entry-row" data-row="${i}">
          <td style="width: 140px; padding: 6px 8px;">
            <div style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span class="entry-prefix-label" style="font-weight: 800; font-size: 13px; color: var(--crimson);">${defaultPrefix}-</span>
              <input type="text" class="form-input entry-token-num" placeholder="101" 
                     data-row="${i}" style="width: 85px; text-align: center; font-weight: 700; height: 36px; padding: 4px 6px;"
                     onblur="ManageView.lookupEntryOrder(${i}, '${person.role}')">
            </div>
          </td>
          <td style="min-width: 260px; padding: 6px 8px;">
            <select class="form-select entry-garment-select" data-row="${i}" 
                    style="width: 100%; height: 36px; font-size: 12.5px;"
                    disabled onchange="ManageView.onEntryGarmentChange(${i})">
              <option value="">— Enter token first —</option>
            </select>
          </td>
          <td style="width: 90px; padding: 6px 8px;">
            <select class="form-select entry-pieces-select" data-row="${i}" style="width: 100%; height: 36px;" disabled>
              <option value="1">1 pc</option>
            </select>
          </td>
          <td style="min-width: 160px; padding: 6px 8px;">
            <span class="entry-row-status" id="entryStatus_${i}" style="font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap;">
              Awaiting token
            </span>
          </td>
        </tr>
      `;
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
        <div style="background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div style="font-size: 15px; font-weight: 700; color: var(--ink);">
            ${person.name} · ${roleName}
          </div>
          <div style="font-size: 12px; color: var(--muted);">
            Every row below is assigned to this person as ${roleAction} (only unassigned pieces)
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <label style="font-size: 12px; font-weight: 700; color: var(--muted);">Token Prefix:</label>
          <input type="text" id="entryGlobalPrefix" value="${defaultPrefix}" class="form-input" style="width: 70px; text-align: center; font-weight: bold; height: 34px;" oninput="ManageView.updateEntryPrefixes(this.value)">
          <span style="font-size: 11px; color: var(--muted);">Applies to every row: type only the number (e.g. 101).</span>
        </div>

        <div style="max-height: 440px; overflow-y: auto; overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <table class="table-custom" style="width: 100%; margin: 0; min-width: 650px;">
            <thead>
              <tr style="background: var(--card-rose); position: sticky; top: 0; z-index: 2;">
                <th style="width: 140px; padding: 8px 10px;">Token Number</th>
                <th style="min-width: 260px; padding: 8px 10px;">Garment (Free Pieces)</th>
                <th style="width: 90px; padding: 8px 10px;">Pieces</th>
                <th style="min-width: 160px; padding: 8px 10px;">Check Status</th>
              </tr>
            </thead>
            <tbody id="entryRowsTableBody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="ManageView.addMoreEntryRows(4, '${person.role}')">
            + 4 more rows
          </button>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Entry - ${person.name}`, html, async () => {
      const entries = [];
      const rows = document.querySelectorAll('.entry-row');
      const prefix = document.getElementById('entryGlobalPrefix').value.trim();

      rows.forEach(r => {
        const rowId = r.dataset.row;
        const numInput = r.querySelector('.entry-token-num').value.trim();
        const garmentSel = r.querySelector('.entry-garment-select').value;
        const piecesSel = r.querySelector('.entry-pieces-select').value;

        if (numInput && garmentSel) {
          const fullToken = numInput.includes('-') ? numInput : `${prefix}-${numInput}`;
          entries.push({
            token: fullToken,
            garment: garmentSel,
            pieces: parseInt(piecesSel || 1)
          });
        }
      });

      if (entries.length === 0) {
        window.App.showToast('No valid row assignments entered', 'warning');
        return;
      }

      try {
        await API.executeBatchEntry(person.id, entries);
        window.App.showToast(`Saved batch assignments for ${person.name}!`, 'success');
        await ManageView.loadStaff();
        ManageView.render(document.getElementById('viewport'));
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, 'Save assignments', 'xl');
  },

  updateEntryPrefixes(newPrefix) {
    document.querySelectorAll('.entry-prefix-label').forEach(el => {
      el.innerText = `${newPrefix}-`;
    });
  },

  async lookupEntryOrder(rowId, role) {
    const prefix = document.getElementById('entryGlobalPrefix').value.trim();
    const numInput = document.querySelector(`.entry-token-num[data-row="${rowId}"]`);
    const garmentSel = document.querySelector(`.entry-garment-select[data-row="${rowId}"]`);
    const piecesSel = document.querySelector(`.entry-pieces-select[data-row="${rowId}"]`);
    const statusEl = document.getElementById(`entryStatus_${rowId}`);

    const val = numInput.value.trim();
    if (!val) {
      statusEl.innerText = 'Awaiting token';
      statusEl.style.color = 'var(--muted)';
      garmentSel.innerHTML = '<option value="">— Enter token first —</option>';
      garmentSel.disabled = true;
      piecesSel.disabled = true;
      return;
    }

    const fullToken = val.includes('-') ? val : `${prefix}-${val}`;

    try {
      const res = await API.getFreePieces(fullToken, role);
      const freeMap = res.free_pieces || {};
      const garments = Object.keys(freeMap);

      if (garments.length === 0) {
        statusEl.innerText = `✗ ${fullToken}: all pieces already assigned`;
        statusEl.style.color = 'var(--red)';
        garmentSel.disabled = true;
        piecesSel.disabled = true;
        return;
      }

      statusEl.innerText = `✔ ${res.customer} (${res.status})`;
      statusEl.style.color = 'var(--green)';

      garmentSel.innerHTML = garments.map(g => `<option value="${g}" data-max="${freeMap[g]}">${g} (${freeMap[g]} free)</option>`).join('');
      garmentSel.disabled = false;
      piecesSel.disabled = false;

      this.onEntryGarmentChange(rowId);

    } catch (err) {
      statusEl.innerText = `✗ ${err.message || 'Token not found'}`;
      statusEl.style.color = 'var(--red)';
      garmentSel.disabled = true;
      piecesSel.disabled = true;
    }
  },

  onEntryGarmentChange(rowId) {
    const garmentSel = document.querySelector(`.entry-garment-select[data-row="${rowId}"]`);
    const piecesSel = document.querySelector(`.entry-pieces-select[data-row="${rowId}"]`);
    const opt = garmentSel.options[garmentSel.selectedIndex];
    const max = parseInt(opt?.dataset.max || 1);

    piecesSel.innerHTML = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1} pc${i > 0 ? 's' : ''}</option>`).join('');
  },

  addMoreEntryRows(count, role) {
    const tbody = document.getElementById('entryRowsTableBody');
    const currCount = tbody.querySelectorAll('.entry-row').length;
    const prefix = document.getElementById('entryGlobalPrefix').value.trim();

    let extra = '';
    for (let i = currCount + 1; i <= currCount + count; i++) {
      extra += `
        <tr class="entry-row" data-row="${i}">
          <td style="width: 140px; padding: 6px 8px;">
            <div style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span class="entry-prefix-label" style="font-weight: 800; font-size: 13px; color: var(--crimson);">${prefix}-</span>
              <input type="text" class="form-input entry-token-num" placeholder="101" 
                     data-row="${i}" style="width: 85px; text-align: center; font-weight: 700; height: 36px; padding: 4px 6px;"
                     onblur="ManageView.lookupEntryOrder(${i}, '${role}')">
            </div>
          </td>
          <td style="min-width: 260px; padding: 6px 8px;">
            <select class="form-select entry-garment-select" data-row="${i}" 
                    style="width: 100%; height: 36px; font-size: 12.5px;"
                    disabled onchange="ManageView.onEntryGarmentChange(${i})">
              <option value="">— Enter token first —</option>
            </select>
          </td>
          <td style="width: 90px; padding: 6px 8px;">
            <select class="form-select entry-pieces-select" data-row="${i}" style="width: 100%; height: 36px;" disabled>
              <option value="1">1 pc</option>
            </select>
          </td>
          <td style="min-width: 160px; padding: 6px 8px;">
            <span class="entry-row-status" id="entryStatus_${i}" style="font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap;">
              Awaiting token
            </span>
          </td>
        </tr>
      `;
    }
    tbody.insertAdjacentHTML('beforeend', extra);
  },

  // -------------------------------------------------------------
  // 2. Manage Advance Modal (Give / Settle)
  // Protected with salary_password
  // -------------------------------------------------------------
  openManageAdvanceModal(personId) {
    window.App.askPassword('salary_password', async () => {
      const person = await API.getStaff(personId);
      if (!person) return;
      const advances = await API.listAdvances(person.name, person.role);

      const html = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${person.name}</div>
              <div style="font-size: 12px; color: var(--muted);">${person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted);">Current Advance Due</div>
              <div style="font-size: 22px; font-weight: 800; color: var(--red);">₹${PrintEngine.fmtMoney(person.advance_due)}</div>
            </div>
          </div>

          <!-- Add Advance Form -->
          <div class="card" style="padding: 14px; background: var(--card-warm);">
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">Record New Advance Entry</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label class="form-label">Type</label>
                <select id="advKind" class="form-select">
                  <option value="given">Advance Given to Worker (+)</option>
                  <option value="settled">Advance Settled / Recovered (-)</option>
                </select>
              </div>
              <div>
                <label class="form-label">Amount (₹)</label>
                <input type="number" id="advAmount" class="form-input" placeholder="0.00" min="1" step="any">
              </div>
            </div>
            <div style="margin-top: 10px;">
              <label class="form-label">Note / Purpose (Optional)</label>
              <input type="text" id="advNote" class="form-input" placeholder="e.g. Festival advance, emergency, direct recovery">
            </div>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 10px;" 
                    onclick="ManageView.saveAdvanceEntry('${person.name}', '${person.role}')">
              + Record Advance
            </button>
          </div>

          <!-- Past Advances Ledger -->
          <div>
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 6px;">Advance History Ledger</div>
            <div class="table-responsive" style="max-height: 220px; overflow-y: auto;">
              <table class="table-custom" style="font-size: 12px;">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Kind</th>
                    <th>Amount</th>
                    <th>Slip / Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${advances.length === 0 ? `
                    <tr><td colspan="4" style="text-align: center; color: var(--muted); padding: 14px;">No advance transactions recorded.</td></tr>
                  ` : advances.map(a => `
                    <tr>
                      <td>${a.created_at ? a.created_at.substring(0, 16).replace('T', ' ') : ''}</td>
                      <td>
                        <span class="badge" style="background: ${a.kind === 'given' ? '#FEE2E2; color: #DC2626;' : '#DCFCE7; color: #16A34A;'} font-weight: 700;">
                          ${a.kind === 'given' ? 'Given' : 'Settled'}
                        </span>
                      </td>
                      <td style="font-weight: 700;">₹${PrintEngine.fmtMoney(a.amount)}</td>
                      <td style="color: var(--muted);">${a.note || a.slip_no || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      window.App.showCustomModal(`Manage Advance - ${person.name}`, html, null, 'Close');
    }, 'Salary Password Required', 'Enter the Salary / Advance password to manage advances:');
  },

  async saveAdvanceEntry(worker, role) {
    const kind = document.getElementById('advKind').value;
    const amount = parseFloat(document.getElementById('advAmount').value || 0);
    const note = document.getElementById('advNote').value.trim();

    if (amount <= 0) {
      window.App.showToast('Please enter a valid amount', 'warning');
      return;
    }

    try {
      await API.addAdvance(worker, role, kind, amount, note);
      window.App.showToast('Advance recorded successfully!', 'success');
      window.App.closeCustomModal();
      await this.loadStaff();
      this.render(document.getElementById('viewport'));
    } catch (err) {
      window.App.showToast(err.message, 'error');
    }
  },

  // -------------------------------------------------------------
  // 3. Salary Slip Modal (Piece-rate calculations, deductions)
  // Protected with salary_password
  // -------------------------------------------------------------
  openSalarySlipModal(personId) {
    window.App.askPassword('salary_password', async () => {
      const person = await API.getStaff(personId);
      if (!person) return;

      const unsettled = await API.getUnsettledWork(person.name, person.role);
      const advDue = parseFloat(person.advance_due || 0);

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div>
            <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${person.name}</div>
            <div style="font-size: 12px; color: var(--muted);">${person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--muted);">Outstanding Advance</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--red);">₹${PrintEngine.fmtMoney(advDue)}</div>
          </div>
        </div>

        <div style="font-size: 13px; font-weight: 600; color: var(--ink);">
          Select Completed Pieces to Pay (${unsettled.length} pending piece(s)):
        </div>

        <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
          <table class="table-custom" style="font-size: 12px;">
            <thead>
              <tr>
                <th style="width: 32px;">
                  <input type="checkbox" id="salarySelectAll" checked onchange="ManageView.toggleSalaryPieces(this.checked)">
                </th>
                <th>Token</th>
                <th>Customer</th>
                <th>Garment</th>
                <th>Piece #</th>
                <th>Stage</th>
                <th style="text-align: right;">Rate (₹)</th>
              </tr>
            </thead>
            <tbody id="salaryPiecesTbody">
              ${unsettled.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; color: var(--muted); padding: 24px;">No completed unpaid pieces for this worker.</td></tr>
              ` : unsettled.map((u, idx) => `
                <tr>
                  <td>
                    <input type="checkbox" class="salary-piece-cb" checked data-idx="${idx}" onchange="ManageView.recalculateSalarySlip(${advDue})">
                  </td>
                  <td><strong>${u.token}</strong></td>
                  <td>${u.customer}</td>
                  <td>${u.garment}</td>
                  <td>#${u.n}</td>
                  <td><span class="badge" style="background: ${u.done ? 'var(--green-light); color: var(--green);' : '#FEF3C7; color: #B45309;'}">${u.done ? 'Finished' : 'In Progress'}</span></td>
                  <td style="text-align: right;">
                    <input type="number" class="form-input salary-piece-rate" data-idx="${idx}" value="${u.rate}" 
                           style="width: 80px; text-align: right; padding: 4px;" oninput="ManageView.recalculateSalarySlip(${advDue})">
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Calculations Card -->
        <div class="card" style="padding: 14px; background: var(--card-warm);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: end;">
            <div>
              <label class="form-label">Gross Earnings (₹)</label>
              <div id="salaryGross" style="font-size: 16px; font-weight: 700; color: var(--ink);">₹0.00</div>
            </div>
            <div>
              <label class="form-label">Advance Recovery (₹)</label>
              <input type="number" id="salaryAdvDeduct" class="form-input" value="${Math.min(advDue, 0)}" min="0" max="${advDue}" 
                     step="any" oninput="ManageView.recalculateSalarySlip(${advDue})">
            </div>
            <div>
              <label class="form-label">Other Deductions (₹)</label>
              <input type="number" id="salaryOthDeduct" class="form-input" value="0" min="0" step="any" oninput="ManageView.recalculateSalarySlip(${advDue})">
            </div>
            <div>
              <label class="form-label">Net Payable (₹)</label>
              <div id="salaryNet" style="font-size: 18px; font-weight: 800; color: var(--green);">₹0.00</div>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <input type="text" id="salaryNote" class="form-input" placeholder="Slip remarks / notes (optional)">
          </div>
        </div>
      </div>
    `;

    // Store unsettled on window for calculation
    window._tempUnsettled = unsettled;

    window.App.showCustomModal(`Salary Slip - ${person.name}`, html, async () => {
      const cbs = document.querySelectorAll('.salary-piece-cb:checked');
      if (cbs.length === 0) {
        window.App.showToast('Please tick at least one piece to pay', 'warning');
        return;
      }

      const selectedItems = [];
      cbs.forEach(cb => {
        const idx = parseInt(cb.dataset.idx);
        const u = window._tempUnsettled[idx];
        const rateEl = document.querySelector(`.salary-piece-rate[data-idx="${idx}"]`);
        selectedItems.push({
          token: u.token,
          customer: u.customer,
          garment: u.garment,
          n: u.n,
          stage: u.done ? 'Completed' : 'In progress',
          rate: parseFloat(rateEl.value || 0)
        });
      });

      const advDeduct = parseFloat(document.getElementById('salaryAdvDeduct').value || 0);
      const othDeduct = parseFloat(document.getElementById('salaryOthDeduct').value || 0);
      const note = document.getElementById('salaryNote').value.trim();

      try {
        const slip = await API.generateSalarySlip(person.id, person.name, person.role, selectedItems, advDeduct, othDeduct, note);
        window.App.showToast(`Salary slip ${slip.slip_no} generated!`, 'success');
        window.App.openPrintSalarySlipModal(slip.slip_no);
        await ManageView.loadStaff();
        ManageView.render(document.getElementById('viewport'));
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, '✔ Generate Slip');

      // Run initial calculation
      setTimeout(() => this.recalculateSalarySlip(advDue), 50);
    }, 'Salary Password Required', 'Enter the Salary / Advance password to open salary slip:');
  },

  toggleSalaryPieces(checked) {
    document.querySelectorAll('.salary-piece-cb').forEach(cb => cb.checked = checked);
    const advDue = parseFloat(document.getElementById('salaryAdvDeduct')?.max || 0);
    this.recalculateSalarySlip(advDue);
  },

  recalculateSalarySlip(advDue) {
    const cbs = document.querySelectorAll('.salary-piece-cb:checked');
    let gross = 0;
    cbs.forEach(cb => {
      const idx = cb.dataset.idx;
      const rateEl = document.querySelector(`.salary-piece-rate[data-idx="${idx}"]`);
      gross += parseFloat(rateEl?.value || 0);
    });

    const advInput = document.getElementById('salaryAdvDeduct');
    const othInput = document.getElementById('salaryOthDeduct');

    let adv = parseFloat(advInput?.value || 0);
    let oth = parseFloat(othInput?.value || 0);

    const net = Math.max(0, gross - adv - oth);

    const grossEl = document.getElementById('salaryGross');
    const netEl = document.getElementById('salaryNet');

    if (grossEl) grossEl.innerText = `₹${PrintEngine.fmtMoney(gross)}`;
    if (netEl) netEl.innerText = `₹${PrintEngine.fmtMoney(net)}`;
  },

  // -------------------------------------------------------------
  // 4. Personnel List Modal (Screenshot 1)
  // -------------------------------------------------------------
  openPersonnelListModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="font-size: 13px; color: var(--muted);">
          Click the tick box to switch a person available / unavailable (their records are kept permanently). Double-click a person to open their personal price list.
        </div>

        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
          <table class="table-custom">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">Available</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th style="text-align: right;">Price List</th>
              </tr>
            </thead>
            <tbody>
              ${this.staff.map(p => `
                <tr style="cursor: pointer;" ondblclick="ManageView.openPriceListModal(${p.id})">
                  <td style="text-align: center;">
                    <input type="checkbox" class="table-checkbox" ${p.available ? 'checked' : ''} 
                           onchange="ManageView.toggleAvailability(${p.id}, this.checked)">
                  </td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.phone || '—'}</td>
                  <td><span class="badge ${p.role === 'cutting' ? 'badge-role-cutting' : 'badge-role-sewing'}">${p.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}</span></td>
                  <td><span style="color: ${p.available ? 'var(--green)' : 'var(--muted)'}; font-weight: 600;">${p.available ? 'Available' : 'Unavailable'}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="ManageView.openPriceListModal(${p.id})">
                      ⏱ Price list
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.App.showCustomModal('Personnel list', html, null, 'Done');
  },

  // -------------------------------------------------------------
  // 5. Price List Modal (Screenshot 1 Right)
  // -------------------------------------------------------------
  async openPriceListModal(personId) {
    const person = await API.getStaff(personId);
    if (!person) return;

    const catalog = window.App?.settings?.garments || {};
    const workerRates = person.rates || {};
    const roleLabel = person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor';

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="text-align: center; margin-bottom: 8px;">
          <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${person.name} · ${roleLabel}</div>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
            Payment per piece for this person only. These prices are used when you make their salary slip.
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; padding: 4px;">
          ${Object.keys(catalog).map(g => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <span style="font-weight: 600; font-size: 13px;">${g}</span>
              <div class="input-addon-group" style="width: 160px;">
                <span class="input-addon-left">₹</span>
                <input type="number" class="form-input worker-rate-input" data-garment="${g}" 
                       value="${workerRates[g] || ''}" placeholder="0" step="any" min="0" style="text-align: right;">
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    window.App.showCustomModal(`Price list - ${person.name}`, html, async () => {
      const updatedRates = {};
      document.querySelectorAll('.worker-rate-input').forEach(inp => {
        const val = parseFloat(inp.value);
        if (!isNaN(val) && val > 0) {
          updatedRates[inp.dataset.garment] = val;
        }
      });

      try {
        await API.setStaffRates(person.id, updatedRates);
        window.App.showToast(`Saved price list for ${person.name}!`, 'success');
        await ManageView.loadStaff();
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, 'Save price list');
  },

  // -------------------------------------------------------------
  // 6. Salary History Modal
  // Protected with salary_password
  // -------------------------------------------------------------
  openSalaryHistoryModal() {
    window.App.askPassword('salary_password', async () => {
      const [slips, advances] = await Promise.all([
        API.listSalarySlips(),
        API.listAdvances()
      ]);

      // Combine salary slips and advances into a unified ledger sorted by date
      const unified = [];
      (slips || []).forEach(s => {
        unified.push({
          type: 'salary',
          token: s.slip_no,
          date: s.created_at || '',
          worker: s.worker,
          role: s.role,
          pieces: (s.items || []).length,
          amount: s.net,
          gross: s.gross,
          deduction: s.deduction,
          advance: s.advance,
          note: s.note || '',
          raw: s
        });
      });
      (advances || []).forEach(a => {
        unified.push({
          type: 'advance',
          token: a.adv_id,
          date: a.created_at || '',
          worker: a.worker,
          role: a.role,
          pieces: '—',
          amount: a.amount,
          kind: a.kind, // 'given' or 'settled'
          note: a.note || (a.slip_no ? `Recovered on ${a.slip_no}` : (a.kind === 'given' ? 'Cash Advance Given' : 'Advance Settled')),
          raw: a
        });
      });

      unified.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 15px; font-weight: 700; color: var(--ink);">Staff Ledger &amp; Payout History</div>
              <div style="font-size: 12px; color: var(--muted);">Unified history of piece-rate salary settlements (SAL) and advance transactions (ADV).</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span class="badge" style="background: #FAF0F0; color: #BD1A22; font-weight: 700;">SAL: ${slips.length} Slips</span>
              <span class="badge" style="background: #FEF3C7; color: #B45309; font-weight: 700;">ADV: ${advances.length} Advances</span>
            </div>
          </div>

          <div class="table-responsive" style="max-height: 480px; overflow-y: auto;">
            <table class="table-custom" style="font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <th style="width: 120px;">Token #</th>
                  <th style="width: 130px;">Transaction</th>
                  <th style="width: 100px;">Date</th>
                  <th>Worker Name</th>
                  <th style="width: 90px;">Role</th>
                  <th>Pieces / Description</th>
                  <th style="width: 110px;">Amount</th>
                  <th style="text-align: right; width: 130px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${unified.length === 0 ? `
                  <tr><td colspan="8" style="text-align: center; color: var(--muted); padding: 24px;">No salary or advance history found.</td></tr>
                ` : unified.map(item => {
                  if (item.type === 'salary') {
                    return `
                      <tr style="background: #FFFFFF;">
                        <td><strong style="color: var(--crimson); font-family: var(--font-serif); font-size: 13px;">${item.token}</strong></td>
                        <td><span class="badge" style="background: #FAF0F0; color: #BD1A22; font-weight: 700;">Salary Slip</span></td>
                        <td>${item.date.substring(0, 10)}</td>
                        <td><strong>${item.worker}</strong></td>
                        <td><span class="badge ${item.role === 'cutting' ? 'badge-role-cutting' : 'badge-role-sewing'}">${item.role === 'cutting' ? 'Cutter' : 'Sewing'}</span></td>
                        <td>${item.pieces} piece(s) settled</td>
                        <td style="font-weight: 800; color: var(--green);">₹${PrintEngine.fmtMoney(item.amount)}</td>
                        <td style="text-align: right; white-space: nowrap;">
                          <a class="btn btn-ghost btn-sm" title="Download Slip PDF" href="${API.getSalarySlipPdfUrl(item.token)}" target="_blank">📄</a>
                          <button class="btn btn-ghost btn-sm" title="Print Slip" onclick="window.App.openPrintSalarySlipModal('${item.token}')">🖨️</button>
                          <button class="btn btn-green btn-sm" title="WhatsApp Slip" onclick="ManageView.whatsappSalarySlip('${item.token}')">💬</button>
                        </td>
                      </tr>
                    `;
                  } else {
                    const isGiven = item.kind === 'given';
                    return `
                      <tr style="background: #FFFDF9;">
                        <td><strong style="color: #D97706; font-family: var(--font-serif); font-size: 13px;">${item.token}</strong></td>
                        <td>
                          <span class="badge" style="background: ${isGiven ? '#FEF3C7; color: #B45309;' : '#DCFCE7; color: #15803D;'} font-weight: 700;">
                            ${isGiven ? '★ Advance Given' : '✔ Advance Settled'}
                          </span>
                        </td>
                        <td>${item.date.substring(0, 10)}</td>
                        <td><strong>${item.worker}</strong></td>
                        <td><span class="badge ${item.role === 'cutting' ? 'badge-role-cutting' : 'badge-role-sewing'}">${item.role === 'cutting' ? 'Cutter' : 'Sewing'}</span></td>
                        <td style="color: var(--muted); font-size: 11.5px;">${item.note}</td>
                        <td style="font-weight: 800; color: ${isGiven ? '#DC2626' : '#16A34A'};">
                          ${isGiven ? '+' : '-'}₹${PrintEngine.fmtMoney(item.amount)}
                        </td>
                        <td style="text-align: right; white-space: nowrap;">
                          <span style="font-size: 11px; color: var(--muted); padding: 3px 8px; background: var(--paper); border: 1px solid var(--border); border-radius: 4px;">Advance Voucher</span>
                        </td>
                      </tr>
                    `;
                  }
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      window.App.showCustomModal('Salary & Advance History Ledger', html, null, 'Close', 'xl');
    }, 'Salary Password Required', 'Enter the Salary / Advance password to view salary & advance history:');
  },

  async whatsappSalarySlip(slipNo) {
    const slip = await API.getSalarySlip(slipNo);
    if (!slip) return;
    const staff = this.staff.find(s => s.name === slip.worker && s.role === slip.role);
    const phone = staff?.phone || '';
    const shopName = window.App.settings?.shop_name || "7 ART TAILORS";

    const msg = `*${shopName} - Salary slip ${slip.slip_no}*\nDate: ${slip.created_at ? slip.created_at.substring(0, 10) : ''}\nName: ${slip.worker} (${slip.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'})\nPieces paid: ${(slip.items || []).length}\nGross: ₹${PrintEngine.fmtMoney(slip.gross)}\nAdvance deducted: ₹${PrintEngine.fmtMoney(slip.advance)}\n*Net Paid: ₹${PrintEngine.fmtMoney(slip.net)}*\nRemaining Advance Due: ₹${PrintEngine.fmtMoney(slip.adv_due)}`;
    PrintEngine.openWhatsApp(phone, msg);
  },

  // -------------------------------------------------------------
  // 7. Add Person Modal
  // -------------------------------------------------------------
  openAddPersonModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" id="addStaffName" class="form-input" placeholder="e.g. Ramesh Saini" required>
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" id="addStaffPhone" class="form-input" placeholder="10-digit mobile number">
        </div>
        <div class="form-group">
          <label class="form-label">Role *</label>
          <select id="addStaffRole" class="form-select">
            <option value="cutting">Cutting Master</option>
            <option value="sewing">Sewing Tailor</option>
          </select>
        </div>
      </div>
    `;

    window.App.showCustomModal('+ Add Staff Person', html, async () => {
      const name = document.getElementById('addStaffName').value.trim();
      const phone = document.getElementById('addStaffPhone').value.trim();
      const role = document.getElementById('addStaffRole').value;

      if (!name) {
        window.App.showToast('Please enter person name', 'warning');
        return;
      }

      try {
        await API.addStaff(name, phone, role);
        window.App.showToast(`Added ${name} as ${role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}!`, 'success');
        await ManageView.loadStaff();
        ManageView.render(document.getElementById('viewport'));
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, 'Save Person');
  },

  // -------------------------------------------------------------
  // 8. Employee User Accounts & Login Modal (Authority Only)
  // -------------------------------------------------------------
  async openUserAccountsModal() {
    if (App.currentUser?.role !== 'authority') {
      window.App.showToast('Access restricted to Authority (Bhagirath Saini) only', 'error');
      return;
    }

    let users = [];
    try {
      users = await API.listUsers();
    } catch (e) {
      window.App.showToast('Could not load users', 'error');
      return;
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--ink);">Workshop Staff & Manager Accounts</div>
            <p style="font-size: 12px; color: var(--muted); margin: 0;">
              Add, edit, or remove workers from the login list. Assign IDs and passwords.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="ManageView.openAddUserModal()">
            + Add New User
          </button>
        </div>

        <div class="table-responsive" style="max-height: 420px; overflow-y: auto;">
          <table class="table-custom">
            <thead>
              <tr>
                <th>Username (ID)</th>
                <th>Full Name</th>
                <th>Role Tag</th>
                <th>Linked Staff</th>
                <th>Last Active</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                let roleBadge = '<span class="role-badge role-badge-employee">✂️ Employee</span>';
                if (u.role === 'authority') {
                  roleBadge = '<span class="role-badge role-badge-authority">👑 Authority</span>';
                } else if (u.role === 'manager') {
                  roleBadge = '<span class="role-badge role-badge-manager">💼 Manager</span>';
                }

                const isAuthority = u.role === 'authority' || ['admin', 'bhagirath'].includes(u.username.toLowerCase());

                return `
                  <tr>
                    <td><strong>${u.username}</strong></td>
                    <td>${u.full_name}</td>
                    <td>${roleBadge}</td>
                    <td>${u.staff_name || '<span style="color: var(--muted);">—</span>'}</td>
                    <td style="font-size: 11px; color: var(--muted);">${u.last_login ? u.last_login.substring(0, 16).replace('T', ' ') : 'Never'}</td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button class="btn btn-ghost btn-sm" onclick="ManageView.openEditUserModal(${u.id})">✏️ Edit</button>
                      <button class="btn btn-ghost btn-sm" style="color: var(--red);" onclick="ManageView.deleteUser(${u.id}, '${u.username}', '${u.role}')" title="${isAuthority ? 'Requires Secret Password to delete' : 'Delete user'}">
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.App.showCustomModal('👥 Manage Logins & Workers (Authority Control)', html, null, 'Close');
  },

  async openAddUserModal() {
    let staffList = [];
    try {
      staffList = await API.listStaff();
    } catch (e) {}

    const staffOptions = staffList.map(s => `<option value="${s.name}">${s.name} (${s.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'})</option>`).join('');

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Username (Login ID) *</label>
          <input type="text" id="newUsername" class="form-input" placeholder="e.g. rahul" required autocomplete="off">
        </div>
        <div class="form-group">
          <label class="form-label">Password *</label>
          <input type="password" id="newUserPassword" class="form-input" placeholder="Enter password (e.g. 123)" required autocomplete="new-password">
        </div>
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" id="newUserFullName" class="form-input" placeholder="e.g. Rahul Sharma" required>
        </div>
        <div class="form-group">
          <label class="form-label">Role Tag Permission *</label>
          <select id="newUserRole" class="form-select">
            <option value="employee" selected>✂️ Employee (Craftsman / Bench Worker Portal)</option>
            <option value="manager">💼 Manager (Counter Operations - Cannot Add/Remove Workers)</option>
            <option value="authority">👑 Authority (Studio Owner - Full Access & User Management)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Link to Workshop Staff Member (Optional)</label>
          <select id="newUserStaff" class="form-select">
            <option value="">— None / Independent Account —</option>
            ${staffOptions}
          </select>
          <span style="font-size: 11px; color: var(--muted); margin-top: 4px;">Linking connects their login directly to their assigned cutting/sewing pieces</span>
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="text" id="newUserPhone" class="form-input" placeholder="+91 ...">
        </div>
      </div>
    `;

    window.App.showCustomModal('+ Create Worker / User Account', html, async () => {
      const username = document.getElementById('newUsername').value.trim();
      const password = document.getElementById('newUserPassword').value.trim();
      const full_name = document.getElementById('newUserFullName').value.trim();
      const role = document.getElementById('newUserRole').value;
      const staff_name = document.getElementById('newUserStaff').value;
      const phone = document.getElementById('newUserPhone').value.trim();

      if (!username || !password || !full_name) {
        window.App.showToast('Please fill in username, password, and full name', 'warning');
        return;
      }

      try {
        await API.createUser({ username, password, full_name, role, staff_name, phone });
        window.App.showToast(`Worker account '${username}' created!`, 'success');
        this.openUserAccountsModal();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to create user', 'error');
      }
    }, 'Create Account');
  },

  async openEditUserModal(userId) {
    try {
      const users = await API.listUsers();
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const isAuthorityAccount = user.role === 'authority' || ['admin', 'bhagirath'].includes(user.username.toLowerCase());

      let staffList = [];
      try {
        staffList = await API.listStaff();
      } catch (e) {}

      const staffOptions = staffList.map(s => `
        <option value="${s.name}" ${s.name === user.staff_name ? 'selected' : ''}>
          ${s.name} (${s.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'})
        </option>
      `).join('');

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Username (Login ID)</label>
            <input type="text" class="form-input" value="${user.username}" disabled style="background: #F5F2EB; font-weight: 700;">
          </div>
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="editUserFullName" class="form-input" value="${user.full_name}" required>
          </div>

          ${isAuthorityAccount ? `
            <div style="background: var(--card-warm); border: 1px solid var(--border); padding: 14px; border-radius: var(--radius-sm);">
              <div style="font-size: 12.5px; font-weight: 700; color: var(--rust); margin-bottom: 10px;">
                🔒 Authority Security: Changing password requires Old Password
              </div>
              <div class="form-group" style="margin-bottom: 10px;">
                <label class="form-label">Current (Old) Password</label>
                <input type="password" id="editUserOldPassword" class="form-input" placeholder="Enter current old password" autocomplete="current-password">
              </div>
              <div class="form-group" style="margin-bottom: 10px;">
                <label class="form-label">New Password</label>
                <input type="password" id="editUserNewPassword" class="form-input" placeholder="Enter new password" autocomplete="new-password">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Confirm New Password</label>
                <input type="password" id="editUserConfirmPassword" class="form-input" placeholder="Repeat new password" autocomplete="new-password">
              </div>
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label">Change Password (leave empty to keep current password)</label>
              <input type="password" id="editUserPassword" class="form-input" placeholder="Type new password if changing" autocomplete="new-password">
            </div>
          `}

          ${isAuthorityAccount ? `
            <div class="form-group">
              <label class="form-label">Role Tag Permission</label>
              <input type="text" class="form-input" value="👑 Authority (Permanent Studio Owner)" disabled style="background: #F5F2EB; font-weight: 700; color: var(--rust);">
              <input type="hidden" id="editUserRole" value="authority">
              <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">Role is permanent and cannot be changed by anyone.</div>
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label">Role Tag Permission</label>
              <select id="editUserRole" class="form-select">
                <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>✂️ Employee (Craftsman Portal)</option>
                <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>💼 Manager (Operations - Cannot Add/Remove Workers)</option>
                <option value="authority" ${user.role === 'authority' ? 'selected' : ''}>👑 Authority (Studio Owner - Full Access & User Management)</option>
              </select>
            </div>
          `}
          <div class="form-group">
            <label class="form-label">Linked Workshop Staff Member</label>
            <select id="editUserStaff" class="form-select">
              <option value="">— None / Independent Account —</option>
              ${staffOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" id="editUserPhone" class="form-input" value="${user.phone || ''}">
          </div>
        </div>
      `;

      window.App.showCustomModal(`Edit Account: ${user.username}`, html, async () => {
        const full_name = document.getElementById('editUserFullName').value.trim();
        const role = document.getElementById('editUserRole').value;
        const staff_name = document.getElementById('editUserStaff').value;
        const phone = document.getElementById('editUserPhone').value.trim();

        const payload = { full_name, role, staff_name, phone };

        if (isAuthorityAccount) {
          const oldPwd = document.getElementById('editUserOldPassword')?.value || '';
          const newPwd = document.getElementById('editUserNewPassword')?.value || '';
          const confirmPwd = document.getElementById('editUserConfirmPassword')?.value || '';

          if (oldPwd || newPwd || confirmPwd) {
            if (!oldPwd) {
              window.App.showToast('Please enter your Old Password to change password', 'warning');
              return;
            }
            if (!newPwd || newPwd.length < 3) {
              window.App.showToast('New password must be at least 3 characters', 'warning');
              return;
            }
            if (newPwd !== confirmPwd) {
              window.App.showToast('New password and confirmation do not match', 'error');
              return;
            }
            payload.old_password = oldPwd;
            payload.password = newPwd;
          }
        } else {
          const password = document.getElementById('editUserPassword')?.value?.trim();
          if (password) payload.password = password;
        }

        try {
          await API.updateUser(userId, payload);
          window.App.showToast(`Worker '${user.username}' updated!`, 'success');
          this.openUserAccountsModal();
        } catch (err) {
          window.App.showToast(err.message || 'Failed to update user', 'error');
        }
      }, 'Save Changes');

    } catch (err) {
      window.App.showToast(err.message, 'error');
    }
  },

  async deleteUser(userId, username, role = '') {
    const isAuthority = role === 'authority' || ['admin', 'bhagirath'].includes((username || '').toLowerCase());

    if (isAuthority) {
      window.App.askPassword('secret_password', async (secretPassword) => {
        try {
          await API.deleteUser(userId, { secret_password: secretPassword });
          window.App.showToast(`Authority account '${username}' removed successfully`, 'success');
          this.openUserAccountsModal();
        } catch (err) {
          window.App.showToast(err.message || 'Failed to delete authority account', 'error');
        }
      }, `Enter Master Secret Password to delete Authority account '${username}':`);
      return;
    }

    if (!confirm(`Are you sure you want to delete worker account '${username}'?`)) return;
    try {
      await API.deleteUser(userId);
      window.App.showToast(`Worker account '${username}' removed`, 'info');
      this.openUserAccountsModal();
    } catch (err) {
      window.App.showToast(err.message || 'Failed to delete user', 'error');
    }
  }
};

