/* ==========================================================================
   7 ART TAILORS - SETTINGS & SELF-HOSTED CONFIGURATION VIEW (SUITE)
   Matches Exact 8-Card Grid Layout & Locked Settings View
   ========================================================================== */

const SettingsView = {
  settings: {},
  isUnlocked: false,

  async loadSettings() {
    this.settings = await API.getSettings();
    return this.settings;
  },

  lockSettings() {
    this.isUnlocked = false;
    this.render(document.getElementById('viewport'));
  },

  async unlockSettings(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('settingsUnlockInput');
    const pwd = input?.value || '';

    if (!pwd) {
      window.App.showToast('Please enter admin password', 'warning');
      return;
    }

    try {
      const res = await API.verifyPassword('password', pwd);
      if (res.valid) {
        this.isUnlocked = true;
        window.App.showToast('Settings unlocked', 'info');
        this.render(document.getElementById('viewport'));
      } else {
        window.App.showToast('Incorrect password. Access denied.', 'error');
        if (input) input.value = '';
      }
    } catch (err) {
      window.App.showToast('Authentication failed: ' + (err.message || 'Incorrect password'), 'error');
      if (input) input.value = '';
    }
  },

  async render(container) {
    // -------------------------------------------------------------
    // 1. LOCKED SETTINGS VIEW (Matches Photo media_1794492316508_db9dd9cf.png)
    // -------------------------------------------------------------
    if (!this.isUnlocked) {
      container.innerHTML = `
        <div class="locked-settings-wrap">
          <div class="locked-settings-card">
            <div class="locked-icon-badge">
              <span>🔒</span>
            </div>
            <h2 class="locked-settings-title">Locked settings</h2>
            <p class="locked-settings-subtitle">Enter your password to change styles and rates.</p>

            <form onsubmit="SettingsView.unlockSettings(event)">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-weight: 700; color: #1F1A17; margin-bottom: 8px;">Password</label>
                <input type="password" id="settingsUnlockInput" class="form-input" 
                       placeholder="" autofocus autocomplete="current-password"
                       style="font-size: 15px; padding: 10px 12px; border: 1.5px solid #9C4528;">
              </div>

              <button type="submit" class="locked-unlock-btn">
                Unlock
              </button>
            </form>
          </div>
        </div>
      `;
      setTimeout(() => {
        document.getElementById('settingsUnlockInput')?.focus();
      }, 50);
      return;
    }

    // -------------------------------------------------------------
    // 2. UNLOCKED SETTINGS VIEW (Exact 8-Card Grid)
    // -------------------------------------------------------------
    await this.loadSettings();
    const isAuthority = App.currentUser?.role === 'authority';

    container.innerHTML = `
      <div class="settings-container">
        
        <!-- Header: Matches Exact Typography in Design Photo -->
        <div class="settings-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div class="settings-tag">ADMINISTRATION</div>
            <h1 class="settings-title">Settings</h1>
            <p class="settings-subtitle">Styles, rates, cloud sync and security</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.lockSettings()">
            🔒 Lock Settings
          </button>
        </div>

        <!-- 9-Card Grid (Matching Luxury Crimson Atelier) -->
        <div class="settings-grid">
          
          <!-- Card 1: Tokens & Garments -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Tokens & Garments</h3>
                <p class="settings-card-desc">Shop name, token series, garment types, making charges, and bespoke measurement fields.</p>
              </div>
              <div class="settings-icon-badge">✂️</div>
            </div>
            <div>
              <button type="button" class="btn btn-primary btn-sm" onclick="SettingsView.openTokensGarmentsModal()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>⚙️</span> Configure Garments & Rates
              </button>
            </div>
          </div>

          <!-- Card 2: Personnel List -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Personnel List</h3>
                <p class="settings-card-desc">Every cutting master and sewing tailor, piece rates, and availability. Records are permanent.</p>
              </div>
              <div class="settings-icon-badge">👥</div>
            </div>
            <div>
              <button type="button" class="btn btn-primary btn-sm" onclick="ManageView.openPersonnelListModal()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>📋</span> Open Personnel List
              </button>
            </div>
          </div>

          <!-- Card 3: Cloud Sync -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Cloud Database Sync</h3>
                <p class="settings-card-desc">Connect Supabase cloud backend, test connectivity, and restore your studio database.</p>
              </div>
              <div class="settings-icon-badge">☁️</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openCloudSyncModal()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>☁️</span> Configure Cloud Sync
              </button>
            </div>
          </div>

          <!-- Card 4: Excel Sheet -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Excel Spreadsheet</h3>
                <p class="settings-card-desc">Download and open live orders spreadsheet workbook for offline review and accounts.</p>
              </div>
              <div class="settings-icon-badge">📊</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.href=API.getExcelDownloadUrl()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>📥</span> Download Excel (.xlsx)
              </button>
            </div>
          </div>

          <!-- Card 5: Sync Cloud Now -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Sync Cloud Now</h3>
                <p class="settings-card-desc">Upload local changes and download new orders immediately to/from the cloud server.</p>
              </div>
              <div class="settings-icon-badge">🔄</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.syncCloudNow()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🔄</span> Instant Cloud Sync
              </button>
            </div>
          </div>

          <!-- Card 6: Admin Password -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Admin Password</h3>
                <p class="settings-card-desc">Protects this Settings area and shop configuration. Change master admin password here.</p>
              </div>
              <div class="settings-icon-badge">🔑</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('password', 'Admin Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🔑</span> Change Admin Password
              </button>
            </div>
          </div>

          <!-- Card 7: Delete Password -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Delete Password</h3>
                <p class="settings-card-desc">Asked whenever an order is deleted. Normal order edits require no password.</p>
              </div>
              <div class="settings-icon-badge">🗑️</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('delete_password', 'Delete Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🛡️</span> Change Delete Password
              </button>
            </div>
          </div>

          <!-- Card 8: Salary Password -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Salary Password</h3>
                <p class="settings-card-desc">Required before opening salary slips, settlement history, or recording cash advances.</p>
              </div>
              <div class="settings-icon-badge">💰</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('salary_password', 'Salary Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🔒</span> Change Salary Password
              </button>
            </div>
          </div>

          <!-- Card 9: Secret Password -->
          <div class="settings-card" style="border-left: 3px solid var(--crimson);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Secret Password</h3>
                <p class="settings-card-desc">Master authorization passcode required to delete or remove Authority studio owner accounts.</p>
              </div>
              <div class="settings-icon-badge">👑</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('secret_password', 'Secret Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>👑</span> Change Secret Password
              </button>
            </div>
          </div>

          <!-- Card 10: Manage Logins & Workers -->
          <div class="settings-card" style="border-left: 3px solid var(--rust);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <h3 class="settings-card-title" style="margin: 0;">Manage Logins</h3>
                <span class="badge" style="background: var(--gold-light); color: #7D4E0D; font-size: 10px;">AUTHORITY CONTROL</span>
              </div>
              <p class="settings-card-desc">Create worker logins, manage IDs and passwords, assign roles (Authority, Manager, Employee).</p>
            </div>
            <div>
              <button type="button" class="btn-settings-rust" onclick="ManageView.openUserAccountsModal()">
                Manage logins
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  // Proxy to ManageView for worker accounts
  openAddUserModal() { return ManageView.openAddUserModal(); },
  openEditUserModal(id) { return ManageView.openEditUserModal(id); },
  deleteUser(id, name) { return ManageView.deleteUser(id, name); },

  // =========================================================================
  // 1. Tokens & Garments Modal
  // =========================================================================
  async openTokensGarmentsModal() {
    await this.loadSettings();
    const s = this.settings;
    const garments = s.garments || {};

    const garmentsRows = Object.entries(garments).map(([name, info]) => `
      <tr data-garment="${name}">
        <td><strong>${name}</strong></td>
        <td>₹${PrintEngine.fmtMoney(info.rate || 0)}</td>
        <td style="color: var(--muted); font-size: 11px;">${(info.fields || 'Default').replace(/;/g, ', ')}</td>
        <td style="text-align: right; white-space: nowrap;">
          <button type="button" class="btn btn-ghost btn-sm" onclick="SettingsView.openEditGarmentModal('${name}')">✏️ Edit</button>
          <button type="button" class="btn btn-ghost btn-sm" style="color: var(--red);" onclick="SettingsView.deleteGarment('${name}')">🗑️</button>
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="display: flex; flex-direction: column; gap: 20px; max-height: 75vh; overflow-y: auto; padding-right: 4px;">
        
        <!-- Studio Identity & Token Series -->
        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <h4 style="font-family: var(--font-serif); font-size: 16px; margin: 0 0 12px 0; color: var(--ink);">Atelier Profile & Token Configuration</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div class="form-group">
              <label class="form-label">Shop / Atelier Name</label>
              <input type="text" id="mCfgShopName" class="form-input" value="${s.shop_name || '7 ART TAILORS'}">
            </div>
            <div class="form-group">
              <label class="form-label">Master Atelier Owner Name</label>
              <input type="text" id="mCfgOwnerName" class="form-input" value="${s.owner_name || 'BHAGIRATH SAINI'}">
            </div>
            <div class="form-group">
              <label class="form-label">Studio Phone / WhatsApp</label>
              <input type="text" id="mCfgShopPhone" class="form-input" value="${s.shop_phone || '+91 98290 12345'}">
            </div>
            <div class="form-group">
              <label class="form-label">Studio Address / Location</label>
              <input type="text" id="mCfgShopAddress" class="form-input" value="${s.shop_address || 'Main Market, Atelier Workshop'}">
            </div>
            <div class="form-group">
              <label class="form-label">Token Series Prefix</label>
              <input type="text" id="mCfgTokenPrefix" class="form-input" value="${s.token_prefix || '26'}">
            </div>
            <div class="form-group">
              <label class="form-label">Next Token Sequence Counter</label>
              <input type="number" id="mCfgTokenCounter" class="form-input" value="${s.token_counter || '1001'}">
            </div>
          </div>
        </div>

        <!-- Garment Types & Price Rates -->
        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-family: var(--font-serif); font-size: 16px; margin: 0; color: var(--ink);">Garment Types & Base Rates</h4>
            <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openAddGarmentModal()">+ Add Garment</button>
          </div>
          
          <div class="table-responsive">
            <table class="table-custom" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Garment</th>
                  <th>Base Rate (₹)</th>
                  <th>Measurement Sizing Fields</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${garmentsRows || '<tr><td colspan="4" style="text-align: center; color: var(--muted); padding: 14px;">No garments configured.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    window.App.showCustomModal('Tokens & Garments Configuration', html, async () => {
      const payload = {
        shop_name: document.getElementById('mCfgShopName').value.trim(),
        owner_name: document.getElementById('mCfgOwnerName').value.trim(),
        shop_phone: document.getElementById('mCfgShopPhone').value.trim(),
        shop_address: document.getElementById('mCfgShopAddress').value.trim(),
        token_prefix: document.getElementById('mCfgTokenPrefix').value.trim(),
        token_counter: parseInt(document.getElementById('mCfgTokenCounter').value || 100)
      };

      try {
        await API.saveSettings(payload);
        window.App.showToast('Tokens & Garments updated successfully!', 'success');
        await this.loadSettings();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to save settings', 'error');
      }
    }, 'Save Changes');
  },

  openEditGarmentModal(name) {
    const gInfo = this.settings.garments?.[name] || { rate: 0, fields: '' };
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Garment Name</label>
          <input type="text" class="form-input" value="${name}" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Base Tailoring Rate (₹)</label>
          <input type="number" id="editGarmentRate" class="form-input" value="${gInfo.rate}" min="0" step="any">
        </div>
        <div class="form-group">
          <label class="form-label">Measurement Fields (semicolon-separated)</label>
          <textarea id="editGarmentFields" class="form-textarea">${gInfo.fields || ''}</textarea>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Edit Garment: ${name}`, html, async () => {
      const rate = parseFloat(document.getElementById('editGarmentRate').value || 0);
      const fields = document.getElementById('editGarmentFields').value.trim();

      const updatedGarments = { ...this.settings.garments };
      updatedGarments[name] = { rate, fields };

      await API.saveSettings({ garments: updatedGarments });
      window.App.showToast(`Updated ${name} catalog entry!`, 'success');
      await this.loadSettings();
      this.openTokensGarmentsModal();
    }, 'Save Garment');
  },

  openAddGarmentModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Garment Name *</label>
          <input type="text" id="newGarmentName" class="form-input" placeholder="e.g. Indo-Western Coat" required>
        </div>
        <div class="form-group">
          <label class="form-label">Base Tailoring Rate (₹) *</label>
          <input type="number" id="newGarmentRate" class="form-input" placeholder="1200" min="0" step="any" required>
        </div>
        <div class="form-group">
          <label class="form-label">Measurement Fields (semicolon-separated)</label>
          <textarea id="newGarmentFields" class="form-textarea" placeholder="Length;Chest;Waist;Shoulder;Sleeve"></textarea>
        </div>
      </div>
    `;

    window.App.showCustomModal('+ Add New Garment', html, async () => {
      const name = document.getElementById('newGarmentName').value.trim();
      const rate = parseFloat(document.getElementById('newGarmentRate').value || 0);
      const fields = document.getElementById('newGarmentFields').value.trim();

      if (!name) {
        window.App.showToast('Please enter garment name', 'warning');
        return;
      }

      const updatedGarments = { ...this.settings.garments };
      updatedGarments[name] = { rate, fields };

      await API.saveSettings({ garments: updatedGarments });
      window.App.showToast(`Added ${name} to catalog!`, 'success');
      await this.loadSettings();
      this.openTokensGarmentsModal();
    }, 'Add Garment');
  },

  async deleteGarment(name) {
    if (!confirm(`Are you sure you want to remove '${name}' from garments?`)) return;
    const updatedGarments = { ...this.settings.garments };
    delete updatedGarments[name];
    await API.saveSettings({ garments: updatedGarments });
    window.App.showToast(`Removed ${name}`, 'info');
    await this.loadSettings();
    this.openTokensGarmentsModal();
  },

  // =========================================================================
  // 2. Cloud Sync Modal
  // =========================================================================
  async openCloudSyncModal() {
    await this.loadSettings();
    const s = this.settings;

    const supabaseSql = `create table if not exists orders (
  token text primary key,
  customer text,
  phone text,
  garments text,
  measurements text,
  notes text,
  order_date text,
  delivery_date text,
  status text,
  urgent boolean default false,
  total double precision default 0,
  advance double precision default 0,
  balance double precision default 0,
  pay_mode text default 'Pending',
  delivered_at text default '',
  cutting_master text default '',
  sewing_tailor text default '',
  work text default '[]',
  updated_at text
);

alter table orders enable row level security;
drop policy if exists "anon_all" on orders;
create policy "anon_all" on orders for all using (true) with check (true);

create table if not exists app_settings (
  key text primary key,
  value text
);
alter table app_settings enable row level security;
drop policy if exists "anon_all" on app_settings;
create policy "anon_all" on app_settings for all using (true) with check (true);

drop table if exists users cascade;

create table users (
  id bigint generated by default as identity,
  username text primary key,
  password text,
  full_name text,
  role text default 'employee',
  staff_name text,
  phone text,
  active boolean default true,
  last_login text,
  created_at text
);
alter table users enable row level security;
drop policy if exists "anon_all" on users;
create policy "anon_all" on users for all using (true) with check (true);

notify pgrst, 'reload schema';`;

    const html = `
      <div style="display: flex; flex-direction: column; gap: 18px; max-height: 75vh; overflow-y: auto; padding-right: 4px;">
        <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
          Connect your free Supabase cloud database to automatically backup all orders, customers, and atelier master settings in real-time.
        </div>

        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <h4 style="font-family: var(--font-serif); font-size: 15px; margin: 0 0 12px 0;">Supabase API Credentials</h4>
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Supabase Project URL</label>
            <input type="url" id="mCfgSupabaseUrl" class="form-input" placeholder="https://xyzcompany.supabase.co" value="${s.supabase_url || ''}">
          </div>

          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Supabase Anon Public API Key</label>
            <input type="text" id="mCfgSupabaseKey" class="form-input" placeholder="eyJhbGciOi..." value="${s.supabase_key || ''}">
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="mCfgSupabaseAutoSync" class="table-checkbox" ${s.supabase_auto_sync ? 'checked' : ''}>
              <span>Enable automatic background cloud synchronization</span>
            </label>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.testCloudConnection()">
              ⚡ Test Cloud Connection
            </button>
            <button type="button" class="btn btn-green btn-sm" onclick="SettingsView.syncCloudNow()">
              ☁️ Backup All Orders Now
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.restoreFromCloud()">
              📥 Restore Orders from Cloud
            </button>
          </div>
        </div>

        <!-- SQL Schema Setup Helper -->
        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="font-family: var(--font-serif); font-size: 15px; margin: 0;">Supabase SQL Table Setup</h4>
            <button type="button" class="btn btn-ghost btn-sm" onclick="SettingsView.copySql()">📋 Copy SQL</button>
          </div>
          <p style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">Run this SQL once in your Supabase SQL Editor:</p>
          <textarea id="supabaseSqlArea" class="form-textarea" style="font-family: monospace; font-size: 11px; height: 120px;" readonly>${supabaseSql}</textarea>
        </div>
      </div>
    `;

    window.App.showCustomModal('Cloud Sync & Supabase Setup', html, async () => {
      const payload = {
        supabase_url: document.getElementById('mCfgSupabaseUrl').value.trim(),
        supabase_key: document.getElementById('mCfgSupabaseKey').value.trim(),
        supabase_auto_sync: document.getElementById('mCfgSupabaseAutoSync').checked
      };

      try {
        await API.saveSettings(payload);
        window.App.showToast('Cloud sync settings saved successfully!', 'success');
        await this.loadSettings();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to save cloud settings', 'error');
      }
    }, 'Save Cloud Settings');
  },

  async testCloudConnection() {
    const url = document.getElementById('mCfgSupabaseUrl')?.value.trim() || this.settings.supabase_url;
    const key = document.getElementById('mCfgSupabaseKey')?.value.trim() || this.settings.supabase_key;

    if (!url || !key) {
      window.App.showToast('Please enter both Supabase URL and Key', 'warning');
      return;
    }

    window.App.showToast('Testing Supabase cloud connection...', 'info');
    try {
      const res = await API.testSupabase(url, key);
      if (res.success) {
        window.App.showToast(res.message, 'success');
      } else {
        window.App.showToast(res.message, 'error');
      }
    } catch (err) {
      window.App.showToast(err.message || 'Connection test failed', 'error');
    }
  },

  async restoreFromCloud() {
    if (!confirm('This will download orders from Supabase cloud into your local studio database. Proceed?')) return;
    window.App.showToast('Restoring orders from Supabase...', 'info');
    try {
      const url = document.getElementById('mCfgSupabaseUrl')?.value.trim() || this.settings.supabase_url;
      const key = document.getElementById('mCfgSupabaseKey')?.value.trim() || this.settings.supabase_key;
      const res = await API.restoreFromSupabase(url, key);
      window.App.showToast(res.message || 'Cloud restore completed!', 'success');
      if (window.App.currentPage === 'orders') {
        window.App.navigate('orders');
      }
    } catch (err) {
      window.App.showToast(err.message || 'Restore failed', 'error');
    }
  },

  copySql() {
    const area = document.getElementById('supabaseSqlArea');
    if (area) {
      navigator.clipboard.writeText(area.value);
      window.App.showToast('SQL schema copied to clipboard!', 'success');
    }
  },

  // =========================================================================
  // 3. Sync Cloud Now Action
  // =========================================================================
  async syncCloudNow() {
    await this.loadSettings();
    const url = document.getElementById('mCfgSupabaseUrl')?.value.trim() || this.settings.supabase_url;
    const key = document.getElementById('mCfgSupabaseKey')?.value.trim() || this.settings.supabase_key;

    if (!url || !key) {
      window.App.showToast('Please configure Supabase in Cloud Sync first.', 'warning');
      this.openCloudSyncModal();
      return;
    }

    window.App.showToast('☁️ Uploading orders to Supabase cloud...', 'info');
    try {
      const res = await API.syncSupabaseNow(url, key);
      if (res.success) {
        window.App.showToast(res.message || `☁️ Successfully backed up ${res.count || 0} orders to Supabase!`, 'success');
      } else {
        window.App.showToast(`Cloud backup error: ${res.message}`, 'error');
      }
    } catch (err) {
      window.App.showToast(`Sync failed: ${err.message}`, 'error');
    }
  },

  // =========================================================================
  // 4. Change Password Modal (Admin, Delete, or Salary Password)
  // =========================================================================
  openChangePasswordModal(key, title) {
    let purposeDesc = 'Opens this Settings area. Protects administrative configuration.';
    if (key === 'delete_password') {
      purposeDesc = 'Asked every time an order or batch is deleted. Editing an order needs no password.';
    } else if (key === 'salary_password') {
      purposeDesc = 'Asked before opening a salary slip, viewing salary history, or managing advance ledger.';
    } else if (key === 'secret_password') {
      purposeDesc = 'Master authorization password. This password is strictly required to delete or remove any Authority (Studio Owner) account.';
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="background: var(--card-warm); border: 1px solid var(--border); padding: 12px 14px; border-radius: var(--radius-sm); font-size: 12.5px; color: var(--muted); line-height: 1.5;">
          ${purposeDesc}
        </div>

        <div class="form-group">
          <label class="form-label">Current Admin Password (Required to authorize change)</label>
          <input type="password" id="chgCurrentAdminPwd" class="form-input" placeholder="Enter current admin password" autofocus autocomplete="off">
        </div>

        <div class="form-group">
          <label class="form-label">New ${title} *</label>
          <input type="password" id="chgNewPwd" class="form-input" placeholder="Enter new ${title.toLowerCase()}" autocomplete="new-password">
        </div>

        <div class="form-group">
          <label class="form-label">Confirm New ${title} *</label>
          <input type="password" id="chgConfirmPwd" class="form-input" placeholder="Repeat new ${title.toLowerCase()}" autocomplete="new-password">
        </div>
      </div>
    `;

    window.App.showCustomModal(`Change ${title}`, html, async () => {
      const currAdmin = document.getElementById('chgCurrentAdminPwd').value;
      const newPwd = document.getElementById('chgNewPwd').value;
      const confirmPwd = document.getElementById('chgConfirmPwd').value;

      if (!currAdmin) {
        window.App.showToast('Please enter your current admin password', 'warning');
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

      // Verify current admin password
      try {
        const verifyRes = await API.verifyPassword('password', currAdmin);
        if (!verifyRes.valid) {
          window.App.showToast('Current admin password incorrect. Authorization failed.', 'error');
          return;
        }

        // Save updated password
        await API.saveSettings({ [key]: newPwd });
        window.App.showToast(`✅ ${title} changed successfully!`, 'success');
        window.App.closeCustomModal();
        await this.loadSettings();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to update password', 'error');
      }
    }, `Update ${title}`);
  }
};
