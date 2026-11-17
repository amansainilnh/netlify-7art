/* ==========================================================================
   7 ART TAILORS - ATELIER AUTHENTICATION & LOGIN VIEW
   Professional Manual Sign-In for Authority, Manager, and Employees
   ========================================================================== */

window.LoginView = {
  render(container) {
    const existing = document.getElementById('loginScreenWrap');
    if (!existing || !container.contains(existing)) {
      container.innerHTML = `
        <div class="login-screen-wrap" id="loginScreenWrap">
          <div class="login-card">
            
            <div class="login-logo">
              <div class="login-emblem">✂️</div>
              <div class="login-title">7 Art Tailors</div>
              <div class="login-subtitle">STUDIO LEDGER · BESPOKE ATELIER</div>
            </div>

            <div id="loginAlertBox" style="display: none; background: var(--red-light); color: var(--red); border: 1px solid rgba(179,64,46,0.25); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; font-weight: 500;">
            </div>

            <form id="studioLoginForm" onsubmit="event.preventDefault(); if(window.LoginView) window.LoginView.handleFormSubmit(event); return false;" autocomplete="off" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="loginUsername">Staff ID / Username</label>
                <input type="text" id="loginUsername" name="usr_studio_clean" class="form-input" placeholder="Enter your ID (e.g. bhagirath)" required autocomplete="off" autocapitalize="none" spellcheck="false" value="" style="font-size: 16px;">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <label class="form-label" for="loginPassword">Password</label>
                  <button type="button" id="togglePasswordBtn" style="background: none; border: none; font-size: 12px; color: var(--rust); cursor: pointer; font-weight: 600; padding: 2px 4px;">
                    Show
                  </button>
                </div>
                <input type="password" id="loginPassword" name="pwd_studio_clean" class="form-input" placeholder="Enter your password" required autocomplete="new-password" value="" style="font-size: 16px;">
              </div>

              <button type="submit" id="loginSubmitBtn" onclick="event.preventDefault(); if(window.LoginView) window.LoginView.handleFormSubmit(event); return false;" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 13px; font-size: 15px; font-weight: 700; margin-top: 4px;">
                <span>🔑</span> Sign In
              </button>
            </form>

            <div style="text-align: center; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border-light); padding-top: 14px; line-height: 1.5;">
              <span>Please enter the ID and Password assigned to you by the studio owner (Bhagirath Saini).</span>
            </div>

            <div style="text-align: center; margin-top: 10px;">
              <button type="button" id="backendToggleBtn" style="background: none; border: none; font-size: 11px; color: var(--rust); cursor: pointer; text-decoration: underline; opacity: 0.85;">
                ⚙️ Server Connection Settings
              </button>
            </div>

            <div id="backendConfigPanel" style="display: none; margin-top: 12px; padding: 12px; background: #FFF9F7; border: 1px solid rgba(156,69,41,0.2); border-radius: var(--radius-sm); font-size: 12px; text-align: left;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: var(--text);">Cloud / Server URL</label>
              <div style="display: flex; gap: 6px;">
                <input type="text" id="backendUrlInput" class="form-input" style="font-size: 12px; padding: 6px 8px; flex: 1;" placeholder="e.g. https://your-app.onrender.com">
                <button type="button" id="saveBackendUrlBtn" class="btn btn-secondary" style="padding: 6px 10px; font-size: 11px; font-weight: 600;">Save</button>
              </div>
              <p style="margin: 6px 0 0; font-size: 11px; color: var(--muted);">Leave blank for default server connection. Set custom URL only if connecting to remote cloud server.</p>
            </div>

          </div>
        </div>
      `;
    }

    this.bindEvents();

    // Ensure inputs start completely blank
    setTimeout(() => {
      const u = document.getElementById('loginUsername');
      const p = document.getElementById('loginPassword');
      if (u) u.value = '';
      if (p) p.value = '';
    }, 60);
  },

  handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const u = document.getElementById('loginUsername');
    const p = document.getElementById('loginPassword');
    const username = (u ? u.value : '').trim();
    const password = (p ? p.value : '').trim();
    if (!username || !password) {
      const alertBox = document.getElementById('loginAlertBox');
      if (alertBox) {
        alertBox.innerText = '⚠️ Please enter both Staff ID and Password';
        alertBox.style.display = 'block';
      }
      return false;
    }
    this.handleLogin(username, password);
    return false;
  },

  bindEvents() {
    const form = document.getElementById('studioLoginForm');
    const pwdInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('togglePasswordBtn');

    if (toggleBtn && pwdInput) {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        if (pwdInput.type === 'password') {
          pwdInput.type = 'text';
          toggleBtn.innerText = 'Hide';
        } else {
          pwdInput.type = 'password';
          toggleBtn.innerText = 'Show';
        }
      };
    }

    if (form) {
      form.onsubmit = (e) => {
        return this.handleFormSubmit(e);
      };
    }

    const toggleBackendBtn = document.getElementById('backendToggleBtn');
    const backendPanel = document.getElementById('backendConfigPanel');
    const backendInput = document.getElementById('backendUrlInput');
    const saveBackendBtn = document.getElementById('saveBackendUrlBtn');

    if (toggleBackendBtn && backendPanel && backendInput) {
      const cur = localStorage.getItem('7art_backend_url') || '';
      backendInput.value = cur;
      toggleBackendBtn.onclick = (e) => {
        e.preventDefault();
        backendPanel.style.display = backendPanel.style.display === 'none' ? 'block' : 'none';
      };
      if (saveBackendBtn) {
        saveBackendBtn.onclick = (e) => {
          e.preventDefault();
          const val = backendInput.value.trim();
          API.setBackendUrl(val);
          if (window.App && window.App.showToast) {
            window.App.showToast(val ? `Backend server set to: ${val}` : 'Backend reset to default origin', 'success');
          }
          backendPanel.style.display = 'none';
        };
      }
    }
  },

  async handleLogin(username, password) {
    const alertBox = document.getElementById('loginAlertBox');
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (alertBox) alertBox.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Verifying...';
    }

    try {
      const res = await API.login(username, password);
      if (res && res.success && res.user) {
        App.onLoginSuccess(res.user);
      } else {
        throw new Error('Login failed. Please verify credentials.');
      }
    } catch (err) {
      if (alertBox) {
        alertBox.innerText = `⚠️ ${err.message || 'Invalid ID or password'}`;
        alertBox.style.display = 'block';
      }
      if (err.message && (err.message.includes('404') || err.message.includes('Backend server') || err.message.includes('Server response error'))) {
        const bp = document.getElementById('backendConfigPanel');
        if (bp) bp.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🔑</span> Sign In';
      }
    }
  }
};
