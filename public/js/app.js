/* ==========================================================================
   7 ART TAILORS - ENTERPRISE STUDIO APP CONTROLLER (MULTI-DEVICE)
   ========================================================================== */

window.App = {
  currentPage: 'dashboard',
  currentUser: null,
  settings: {},
  networkInfo: null,
  routes: {
    dashboard: DashboardView,
    booking: BookingView,
    orders: OrdersView,
    customers: CustomersView,
    manage: ManageView,
    settings: SettingsView,
    'my-work': MyWorkView,
    login: LoginView
  },

  async init() {
    // 1. Check existing authenticated session
    const hasAuth = this.checkAuth();

    if (hasAuth && this.currentUser) {
      // User is already logged in: restore session, DO NOT show login window on reload!
      document.documentElement.classList.add('has-active-session');
      this.applyRolePermissions();
      this.startServerHeartbeat();
      this.startSmartAutoRefresh();
      const hash = window.location.hash.replace('#', '') || (this.currentUser.role === 'employee' ? 'my-work' : 'dashboard');
      this.navigate(hash);
    } else {
      // No active session: show login window
      document.documentElement.classList.remove('has-active-session');
      this.navigate('login');
    }

    // 2. Load remote settings & network info in background without blocking initial UI
    this.settings = {
      shop_name: "7 ART TAILORS",
      owner_name: "BHAGIRATH SAINI",
      token_prefix: "26"
    };
    API.getSettings().then(s => {
      if (s) {
        this.settings = s;
        this.updateHeaderBranding();
      }
    }).catch(e => console.warn("Using default settings", e));

    API.getNetworkInfo().then(info => {
      this.networkInfo = info;
    }).catch(() => {});

    this.bindGlobalNavigation();
    this.bindKeyboardShortcuts();
    this.registerPWA();
  },

  checkAuth() {
    const raw = localStorage.getItem('7art_user') || sessionStorage.getItem('7art_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u && (u.username || u.id)) {
          this.currentUser = u;
          return true;
        }
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.currentUser = null;
    return false;
  },

  onLoginSuccess(user) {
    this.currentUser = user;
    localStorage.setItem('7art_user', JSON.stringify(user));
    sessionStorage.setItem('7art_user', JSON.stringify(user));
    document.documentElement.classList.add('has-active-session');
    this.applyRolePermissions();
    this.startServerHeartbeat();
    this.startSmartAutoRefresh();
    this.showToast(`Signed in as ${user.full_name || user.username} (${user.role.toUpperCase()})`, 'success');
    
    if (user.role === 'employee') {
      this.navigate('my-work');
    } else {
      this.navigate('dashboard');
    }
  },

  confirmLogout() {
    if (!this.currentUser) return;
    this.showCustomModal('Sign Out of Studio', `
      <div style="text-align: center; padding: 10px 0;">
        <p style="font-size: 15px; color: var(--ink); margin-bottom: 6px;">
          Signed in as <strong>${this.currentUser.full_name}</strong> (${this.currentUser.role.toUpperCase()})
        </p>
        <p style="font-size: 13px; color: var(--muted);">
          Are you sure you want to sign out or switch accounts?
        </p>
      </div>
    `, async () => {
      this.logout();
    }, 'Sign Out');
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('7art_user');
    sessionStorage.removeItem('7art_user');
    document.documentElement.classList.remove('has-active-session');
    try { API.logout(); } catch(e) {}
    this.applyRolePermissions();
    this.navigate('login');
    this.showToast('You have been signed out', 'info');
  },

  applyRolePermissions() {
    const user = this.currentUser;
    const isAuth = user && user.role === 'authority';
    const isMgr = user && user.role === 'manager';
    const isEmp = user && user.role === 'employee';

    const myWorkNav = document.getElementById('navItemMyWork');
    const bookingNav = document.getElementById('navItemBooking');
    const manageNav = document.getElementById('navItemManage');
    const settingsNav = document.getElementById('navItemSettings');
    const newOrderBtn = document.getElementById('topBarNewOrderBtn');
    const topBarUserPill = document.getElementById('topBarUserPill');
    const sidebarAvatar = document.getElementById('sidebarUserAvatar');
    const sidebarName = document.getElementById('sidebarUserName');
    const sidebarRole = document.getElementById('sidebarUserRole');

    if (!user) {
      if (topBarUserPill) topBarUserPill.innerHTML = '';
      return;
    }

    if (topBarUserPill) {
      let badgeClass = 'role-badge-employee';
      let badgeIcon = '✂️';
      let tagText = 'Employee';

      if (isAuth) {
        badgeClass = 'role-badge-authority';
        badgeIcon = '👑';
        tagText = 'Authority';
      } else if (isMgr) {
        badgeClass = 'role-badge-manager';
        badgeIcon = '💼';
        tagText = 'Manager';
      }

      topBarUserPill.innerHTML = `
        <span class="role-badge ${badgeClass}" style="cursor: pointer;" onclick="App.confirmLogout()" title="Click to Sign Out">
          <span>${badgeIcon}</span> ${user.full_name || user.username} (${tagText})
        </span>
      `;
    }

    if (sidebarName) sidebarName.innerText = user.full_name || user.username;
    if (sidebarRole) {
      if (isAuth) {
        sidebarRole.innerText = 'Master Atelier Authority';
      } else if (isMgr) {
        sidebarRole.innerText = 'Studio Operations Manager';
      } else {
        sidebarRole.innerText = user.staff_name ? `${user.staff_name.toUpperCase()} · Craftsman` : 'Employee';
      }
    }
    if (sidebarAvatar) {
      const initials = (user.full_name || user.username).split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      sidebarAvatar.innerText = initials || '7A';
    }

    // Role visibility
    const dashboardNav = document.getElementById('navItemDashboard');
    const ordersNav = document.getElementById('navItemOrders');
    const customersNav = document.getElementById('navItemCustomers');

    const mobMyWork = document.getElementById('mobileNavMyWork');
    const mobDashboard = document.getElementById('mobileNavDashboard');
    const mobBooking = document.getElementById('mobileNavBooking');
    const mobOrders = document.getElementById('mobileNavOrders');
    const mobCustomers = document.getElementById('mobileNavCustomers');
    const mobManage = document.getElementById('mobileNavManage');
    const mobSettings = document.getElementById('mobileNavSettings');
    const mobLogout = document.getElementById('mobileNavLogout');

    if (isEmp) {
      // Desktop Sidebar
      if (myWorkNav) myWorkNav.style.display = 'flex';
      if (dashboardNav) dashboardNav.style.display = 'none';
      if (bookingNav) bookingNav.style.display = 'none';
      if (ordersNav) ordersNav.style.display = 'none';
      if (customersNav) customersNav.style.display = 'none';
      if (manageNav) manageNav.style.display = 'none';
      if (settingsNav) settingsNav.style.display = 'none';
      if (newOrderBtn) newOrderBtn.style.display = 'none';

      // Mobile Bottom Nav: dedicated bench portal & sign out
      if (mobMyWork) mobMyWork.style.display = 'flex';
      if (mobLogout) mobLogout.style.display = 'flex';
      if (mobDashboard) mobDashboard.style.display = 'none';
      if (mobBooking) mobBooking.style.display = 'none';
      if (mobOrders) mobOrders.style.display = 'none';
      if (mobCustomers) mobCustomers.style.display = 'none';
      if (mobManage) mobManage.style.display = 'none';
      if (mobSettings) mobSettings.style.display = 'none';
    } else {
      // Authority & Manager have full studio access
      if (myWorkNav) myWorkNav.style.display = 'none';
      if (dashboardNav) dashboardNav.style.display = 'flex';
      if (bookingNav) bookingNav.style.display = 'flex';
      if (ordersNav) ordersNav.style.display = 'flex';
      if (customersNav) customersNav.style.display = 'flex';
      if (manageNav) manageNav.style.display = 'flex';
      if (settingsNav) settingsNav.style.display = 'flex';
      if (newOrderBtn) newOrderBtn.style.display = 'inline-flex';

      // Mobile Bottom Nav
      if (mobMyWork) mobMyWork.style.display = 'none';
      if (mobLogout) mobLogout.style.display = 'none';
      if (mobDashboard) mobDashboard.style.display = 'flex';
      if (mobBooking) mobBooking.style.display = 'flex';
      if (mobOrders) mobOrders.style.display = 'flex';
      if (mobCustomers) mobCustomers.style.display = 'flex';
      if (mobManage) mobManage.style.display = 'flex';
      if (mobSettings) mobSettings.style.display = 'flex';
    }
  },

  registerPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch((err) => {
          console.log('SW registration note:', err.message);
        });
      });
    }
  },

  updateHeaderBranding() {
    const shopName = this.settings.shop_name || "7 ART TAILORS";
    const ownerName = this.settings.owner_name || "BHAGIRATH SAINI";

    document.querySelectorAll('.app-brand-title').forEach(el => el.innerText = shopName);
    document.querySelectorAll('.owner-name-display').forEach(el => el.innerText = ownerName);
  },

  bindGlobalNavigation() {
    // Desktop Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) this.navigate(page);
      });
    });

    // Mobile Bottom Nav Links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) this.navigate(page);
      });
    });

    // Mobile hamburger menu toggle
    const mobileBtn = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Sidebar collapse toggle
    const collapseBtn = document.getElementById('collapseSidebarBtn');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }
  },

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+N / Cmd+N for New Order
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (this.currentUser?.role === 'authority') {
          this.navigate('booking');
        }
      }
      // Esc to close active modals
      if (e.key === 'Escape') {
        this.closeCustomModal();
        this.closePrintModal();
      }
    });
  },

  navigate(pageKey, params = {}) {
    if (!this.currentUser && pageKey !== 'login') {
      pageKey = 'login';
    }

    // Role guard: employees strictly restricted to my-work portal
    if (this.currentUser?.role === 'employee') {
      if (pageKey !== 'login' && pageKey !== 'my-work') {
        pageKey = 'my-work';
      }
    }

    if (!this.routes[pageKey]) pageKey = this.currentUser?.role === 'employee' ? 'my-work' : 'dashboard';
    this.currentPage = pageKey;
    if (pageKey !== 'login') {
      window.location.hash = pageKey;
    }

    // Update active nav class (Sidebar)
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === pageKey);
    });

    // Update active nav class (Mobile Bottom Nav)
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageKey);
    });

    // Close mobile drawer if open
    document.querySelector('.app-sidebar')?.classList.remove('mobile-open');

    // Toggle chrome for login vs app pages
    const isLogin = pageKey === 'login';
    document.querySelector('.app-sidebar')?.classList.toggle('hide-for-login', isLogin);
    document.querySelector('.top-bar')?.classList.toggle('hide-for-login', isLogin);
    document.querySelector('.mobile-bottom-nav')?.classList.toggle('hide-for-login', isLogin);
    document.querySelector('.app-container')?.classList.toggle('login-mode', isLogin);

    // Update top bar title
    const titles = {
      dashboard: { title: "Dashboard", sub: "Atelier Summary & Alerts", badge: "OVERVIEW" },
      booking: { title: "Order Booking", sub: "Counter Registration & Craft Sizing", badge: "NEW ORDER" },
      orders: { title: "Orders Pipeline", sub: "Production Management & Tracking", badge: "WORKSHOP" },
      customers: { title: "Customers Directory", sub: "Client Records & Ledger", badge: "CLIENTS" },
      manage: { title: "Personnel & Team", sub: "Cutting Masters & Sewing Tailors", badge: "MANAGEMENT" },
      settings: { title: "Studio Settings", sub: "System Configuration & Cloud", badge: "SETTINGS" },
      'my-work': { title: "Craftsman Portal", sub: "Assigned Cutting & Sewing Pieces", badge: "BENCH WORK" },
      login: { title: "Studio Sign In", sub: "Staff & Authority Authentication", badge: "LOGIN" }
    };

    const info = titles[pageKey] || titles.dashboard;
    const titleEl = document.getElementById('topBarTitle');
    const subEl = document.getElementById('topBarSubtitle');
    const badgeEl = document.getElementById('topBarBadge');

    if (titleEl) titleEl.innerText = info.title;
    if (subEl) subEl.innerText = info.sub;
    if (badgeEl) badgeEl.innerText = info.badge;

    // Render View with smooth fade
    const viewport = document.getElementById('viewport');
    if (viewport) {
      viewport.style.opacity = '0.7';
      viewport.style.transform = 'translateY(4px)';
      setTimeout(() => {
        try {
          this.routes[pageKey].render(viewport, params);
        } catch (renderErr) {
          console.error(`Error rendering page ${pageKey}:`, renderErr);
          viewport.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px; color: var(--red); max-width: 500px; margin: 40px auto;">
              <h3>Unable to Display Page</h3>
              <p style="margin-top: 8px; color: var(--muted);">${renderErr.message}</p>
              <button class="btn btn-primary" style="margin-top: 16px;" onclick="window.location.reload()">Reload Application</button>
            </div>
          `;
        }
        viewport.style.transition = 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
        viewport.style.opacity = '1';
        viewport.style.transform = 'translateY(0)';
      }, 50);
    }
  },

  startServerHeartbeat() {
    const checkServer = async () => {
      if (document.hidden) return; // Do not waste mobile battery/network when screen is off
      const dot = document.getElementById('sidebarEngineStatusDot');
      const text = document.getElementById('sidebarEngineStatusText');
      const pill = document.getElementById('sidebarEngineStatusPill');
      if (!dot || !text) return;

      try {
        await fetch('/api/network-info', { method: 'GET', signal: AbortSignal.timeout(3000) });
        dot.style.background = 'var(--green)';
        text.innerText = 'Local Studio Engine Active';
        if (pill) pill.title = 'Studio Engine is running smoothly (Click for details)';
      } catch (err) {
        dot.style.background = 'var(--red)';
        text.innerText = 'Studio Server Offline';
        if (pill) pill.title = 'Cannot connect to server on port 5000. Click to diagnose.';
      }
    };

    checkServer();
    setInterval(checkServer, 25000);
  },

  // Intelligent Non-Disruptive Background Auto-Sync
  startSmartAutoRefresh() {
    if (this._smartRefreshTimer) clearInterval(this._smartRefreshTimer);

    this._smartRefreshTimer = setInterval(async () => {
      // 1. Skip if user is not authenticated or tab is in background (saves mobile data/battery)
      if (!this.currentUser || document.hidden) return;

      // 2. SAFETY: Never refresh if ANY modal dialog is open (Print Slip, Settle, Edit, Settings, etc.)
      const modalOpen = document.querySelector('.modal-overlay.active');
      if (modalOpen) return;

      // 3. SAFETY: Never refresh if an input, textarea, or select is currently being edited
      const activeEl = document.activeElement;
      if (activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) {
        return;
      }

      // 4. CRITICAL SAFETY: Counter / Booking view protection
      const curPage = this.currentPage || window.location.hash.replace('#', '') || 'dashboard';
      if (curPage === 'booking' || curPage === 'counter') {
        // If user has ANY customer info, notes, selected garments, or measurements entered:
        if (typeof BookingView !== 'undefined' && BookingView.hasUnsavedWork && BookingView.hasUnsavedWork()) {
          return; // DO NOT TOUCH THE BOOKING FORM!
        }
        return; // Keep counter form stable even if blank to prevent token input flicker
      }

      // 5. Intelligent silent in-place refresh per active page:
      try {
        if (curPage === 'dashboard' && typeof DashboardView !== 'undefined' && DashboardView.render) {
          const vp = document.getElementById('viewport');
          if (vp) await DashboardView.render(vp);
        } else if (curPage === 'orders' && typeof OrdersView !== 'undefined' && OrdersView.loadOrders) {
          // If no order checkboxes are checked, silently update table
          if (!OrdersView.selectedTokens || OrdersView.selectedTokens.size === 0) {
            await OrdersView.loadOrders();
          }
        } else if (curPage === 'my-work' && typeof MyWorkView !== 'undefined' && MyWorkView.loadPieces) {
          await MyWorkView.loadPieces();
        }
      } catch (err) {
        console.debug('[Smart Refresh Note]', err);
      }
    }, 25000);
  },

  async openStudioStatusModal() {
    let isOnline = false;
    let latency = null;
    let net = this.networkInfo || {};

    const t0 = performance.now();
    try {
      const res = await fetch('/api/network-info', { method: 'GET', signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        isOnline = true;
        latency = Math.round(performance.now() - t0);
        net = await res.json();
        this.networkInfo = net;
      }
    } catch (e) {
      isOnline = false;
    }

    const port = net.port || 5000;
    const wifiIp = net.primary_wifi || (net.wifi_ips && net.wifi_ips[0]) || '127.0.0.1';
    const tailscaleIp = net.primary_tailscale || (net.tailscale_ips && net.tailscale_ips[0]) || '100.99.162.118';

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Status Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: var(--radius-md); background: ${isOnline ? '#F0F9F4' : '#FDF2F2'}; border: 1.5px solid ${isOnline ? 'var(--green)' : 'var(--red)'};">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 26px;">${isOnline ? '🟢' : '🔴'}</span>
            <div>
              <div style="font-size: 16px; font-weight: 700; color: ${isOnline ? 'var(--green-dark)' : 'var(--red)'};">
                ${isOnline ? 'Local Studio Engine Active' : 'Studio Engine Disconnected'}
              </div>
              <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                ${isOnline ? `Python Web Server responding in ${latency}ms on port ${port}` : 'Python server process on port 5000 is not reachable'}
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="App.openStudioStatusModal()">
            🔄 Test Again
          </button>
        </div>

        ${!isOnline ? `
          <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; font-size: 13px; line-height: 1.6;">
            <div style="font-weight: 700; color: var(--rust); margin-bottom: 6px;">How to start your Local Studio Server:</div>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Open folder: <code>d:\\art\\arts\\7art_studio_suite</code></li>
              <li>Double-click <strong>start_studio.bat</strong></li>
              <li>Keep the black terminal window open in the background.</li>
              <li>Click <strong>Test Again</strong> above once the window opens!</li>
            </ol>
          </div>
        ` : `
          <!-- System Details Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="background: var(--card-warm); padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Database Engine</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--ink); margin-top: 4px;">Isolated SQLite WAL</div>
              <div style="font-size: 11px; color: var(--green); margin-top: 2px;">✔ studio.db active & healthy</div>
            </div>
            <div style="background: var(--card-warm); padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Active Account</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--ink); margin-top: 4px;">${this.currentUser ? this.currentUser.full_name : 'Guest'}</div>
              <div style="font-size: 11px; color: var(--rust); margin-top: 2px;">Role: ${this.currentUser ? this.currentUser.role.toUpperCase() : 'None'}</div>
            </div>
          </div>

          <!-- Network Addresses -->
          <div style="background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 16px;">
            <div style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 10px;">Available Connection Points:</div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>💻 <strong>This PC:</strong></span>
                <code style="background: var(--sidebar); padding: 2px 8px; border-radius: 4px;">http://localhost:${port}</code>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🏠 <strong>Workshop Wi-Fi:</strong></span>
                <code style="background: var(--sidebar); padding: 2px 8px; border-radius: 4px;">http://${wifiIp}:${port}</code>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🌍 <strong>Tailscale Anywhere:</strong></span>
                <code style="background: var(--sidebar); padding: 2px 8px; border-radius: 4px;">http://${tailscaleIp}:${port}</code>
              </div>
              ${net.tunnel_url ? `
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 8px; margin-top: 2px;">
                <span>🚀 <strong>Public Anywhere:</strong></span>
                <a href="${net.tunnel_url}" target="_blank" style="background: #E8F5E9; color: #1B5E20; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-family: var(--font-mono); text-decoration: none;">
                  ${net.tunnel_url}
                </a>
              </div>
              ` : `
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 8px; margin-top: 2px; color: var(--muted); font-size: 12px;">
                <span>🚀 <strong>Public Anywhere:</strong></span>
                <span>Connecting background tunnel...</span>
              </div>
              `}
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn btn-green btn-sm" onclick="App.openMobileConnectModal()">
              📱 Connect Phones / Tablets (QR)
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.href=API.getExcelDownloadUrl()">
              📊 Download Live Excel
            </button>
          </div>
        `}
      </div>
    `;

    this.showCustomModal('7 Art Tailors — Studio Engine Status', html, null, 'Close');
  },

  // Helper for generating vector offline QR codes with zero external dependency
  getQrSvgOrImg(url, size = 160) {
    if (!url) return '';
    if (typeof qrcode !== 'undefined') {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        const svg = qr.createSvgTag({ scalable: true, margin: 2, cellSize: 4 });
        return `<div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: white;">${svg}</div>`;
      } catch (e) {
        console.warn('Local QR generator note:', e);
      }
    }
    const onlineImg = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    return `<img src="${onlineImg}" alt="QR" width="${size}" height="${size}" style="display: block;" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'padding: 12px; font-family: var(--font-mono); font-size: 13px; font-weight: bold; color: var(--rust); word-break: break-all;\\'>${url}</div>';">`;
  },

  // Mobile / Tablet & Anywhere Connection Modal
  async openMobileConnectModal() {
    try {
      this.networkInfo = await API.getNetworkInfo();
    } catch (e) {}

    const port = this.networkInfo?.port || 5000;
    const wifiIps = this.networkInfo?.wifi_ips || [];
    const tailscaleIps = this.networkInfo?.tailscale_ips || [];
    const primaryWifi = wifiIps[0] || window.location.hostname;
    const primaryTailscale = tailscaleIps[0] || '100.99.162.118';
    const rawTunnel = this.networkInfo?.tunnel_url || '';
    const tunnelUrl = (rawTunnel && !rawTunnel.includes('admin.localhost.run') && !rawTunnel.startsWith('https://localhost.run')) ? rawTunnel : null;

    const wifiUrl = `http://${primaryWifi}:${port}`;
    const tailscaleUrl = `http://${primaryTailscale}:${port}`;

    const qrWifi = this.getQrSvgOrImg(wifiUrl, 160);
    const qrTailscale = this.getQrSvgOrImg(tailscaleUrl, 160);
    const qrTunnel = tunnelUrl ? this.getQrSvgOrImg(tunnelUrl, 160) : '';

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Tab Buttons -->
        <div class="network-tab-buttons">
          <button type="button" class="network-tab-btn active" id="netTabWifiBtn" onclick="App.switchNetTab('wifi')">
            <span>🏠</span> 1. Shop Wi-Fi (Local)
          </button>
          <button type="button" class="network-tab-btn" id="netTabTunnelBtn" onclick="App.switchNetTab('tunnel')">
            <span>🚀</span> 2. Online Anywhere (Public Link)
          </button>
          <button type="button" class="network-tab-btn" id="netTabTailscaleBtn" onclick="App.switchNetTab('tailscale')">
            <span>🛡️</span> 3. Tailscale Mesh
          </button>
        </div>

        <!-- TAB 1: Local Wi-Fi -->
        <div id="netTabWifi" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          <p style="font-size: 13px; color: var(--muted); margin: 0; max-width: 440px;">
            Fastest speed, <strong>100% offline</strong> with zero internet required. Connect phone/tablet to the workshop Wi-Fi:
          </p>

          <div style="background: white; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: center; align-items: center;">
            ${qrWifi}
          </div>

          <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; width: 100%;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">In-Shop Wi-Fi Web Address</div>
            <a href="${wifiUrl}" target="_blank" style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--rust); text-decoration: none;">
              ${wifiUrl}
            </a>
          </div>

          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="App.copyToClipboard('${wifiUrl}', 'Wi-Fi Address Copied!')">
              📋 Copy Wi-Fi Link
            </button>
          </div>

          <div style="font-size: 11px; color: var(--muted);">
            💡 <strong>Phone Tip:</strong> In Chrome or Safari, tap <strong>"Add to Home Screen"</strong> to use as a full-screen app!
          </div>

          <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: var(--radius-sm); padding: 12px; width: 100%; text-align: left; font-size: 12px; color: #5D4037; line-height: 1.5;">
            <strong>⚠️ Phone says "Site can't be reached" or connection times out?</strong>
            <ul style="margin: 6px 0 0 16px; padding: 0;">
              <li>Ensure your phone is connected to the <strong>exact same Wi-Fi router</strong> as this computer (not mobile data).</li>
              <li>Windows Firewall blocks inbound port 5000 until permitted.</li>
            </ul>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 10px; width: 100%; justify-content: center; font-weight: 700;" onclick="App.triggerFirewallFix()">
              🛡️ 1-Click: Unlock Windows Firewall &amp; Wi-Fi
            </button>
          </div>
        </div>

        <!-- TAB 2: Zero-Password Public Worldwide Tunnel Link -->
        <div id="netTabTunnel" style="display: none; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          ${tunnelUrl ? `
            <div style="background: #E8F5E9; border: 1px solid #81C784; border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: #1B5E20; text-align: left; width: 100%;">
              <strong>🟢 Worldwide Online Public Link Active:</strong> Open on ANY phone or tablet worldwide. No VPN or app install needed. Works directly on 4G/5G mobile data!
            </div>

            <div style="background: white; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: center; align-items: center;">
              ${qrTunnel}
            </div>

            <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; width: 100%;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Worldwide HTTPS Web Address</div>
              <a href="${tunnelUrl}" target="_blank" style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: #1B5E20; text-decoration: none; word-break: break-all;">
                ${tunnelUrl}
              </a>
            </div>

            <div style="display: flex; gap: 8px; justify-content: center; width: 100%;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="App.copyToClipboard('${tunnelUrl}', 'Public HTTPS Link Copied!')">
                📋 Copy Public Link
              </button>
              <button type="button" class="btn btn-ghost btn-sm" onclick="App.refreshTunnelModal()">
                🔄 Refresh Link
              </button>
            </div>

            <div style="text-align: left; font-size: 12px; color: var(--muted); background: white; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; width: 100%; line-height: 1.6;">
              <strong>Atelier Sign-In from Mobile:</strong><br>
              • Authority Owner: <code>bhagirath</code> / <code>admin</code><br>
              • Workers log in using their assigned ID & Password directly in their mobile browser.
            </div>
          ` : `
            <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 24px 16px; width: 100%;">
              <div style="font-size: 26px; animation: spin 1s infinite linear; margin-bottom: 8px;">⏳</div>
              <div style="font-weight: 700; font-size: 15px; color: var(--ink);">Connecting Worldwide Public Tunnel...</div>
              <p style="font-size: 13px; color: var(--muted); margin-top: 6px; max-width: 400px; margin-left: auto; margin-right: auto;">
                Establishing zero-password public HTTPS tunnel in the background. It takes 3 to 5 seconds upon studio launch.
              </p>
              <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 14px;" onclick="App.refreshTunnelModal()">
                🔄 Check Live Status Now
              </button>
            </div>
          `}
        </div>

        <!-- TAB 3: Tailscale Anywhere -->
        <div id="netTabTailscale" style="display: none; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          <div style="background: var(--gold-light); border: 1px solid rgba(197,139,58,0.4); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: #7D4E0D; text-align: left; width: 100%;">
            <strong>🛡️ Tailscale Encrypted Mesh:</strong> Dedicated private network between your devices without public URLs.
          </div>

          <div style="background: white; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: center; align-items: center;">
            ${qrTailscale}
          </div>

          <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; width: 100%;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Worldwide Tailscale Address</div>
            <a href="${tailscaleUrl}" target="_blank" style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: #7D4E0D; text-decoration: none;">
              ${tailscaleUrl}
            </a>
          </div>

          <div style="text-align: left; font-size: 12px; color: var(--muted); background: white; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; width: 100%; line-height: 1.6;">
            <strong>Quick Setup (Takes 1 minute & 100% Free):</strong><br>
            1. Install free <strong>Tailscale</strong> app on your iPhone, Android, or laptop.<br>
            2. Sign in with the same account as this host machine.<br>
            3. Open <code>${tailscaleUrl}</code> on your device from anywhere on Earth!
          </div>

          <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: var(--radius-sm); padding: 12px; width: 100%; text-align: left; font-size: 12px; color: #5D4037; line-height: 1.5;">
            <strong>⚠️ Tailscale checklist if not opening:</strong>
            <ul style="margin: 6px 0 0 16px; padding: 0;">
              <li>The free <strong>Tailscale app</strong> must be active &amp; Connected on your phone.</li>
              <li>Your phone must be signed in to the <strong>same Tailscale account</strong> as this PC.</li>
              <li>Windows Firewall must allow port 5000 on the Tailscale network interface.</li>
            </ul>
            <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 10px; width: 100%; justify-content: center;" onclick="App.triggerFirewallFix()">
              🛡️ Unlock Windows Firewall for Tailscale
            </button>
          </div>
        </div>

      </div>
    `;

    this.showCustomModal('📱 Connect Devices & Online Anywhere', html, null, 'Close');

    if (!tunnelUrl) {
      if (this._tunnelPollTimer) clearInterval(this._tunnelPollTimer);
      this._tunnelPollTimer = setInterval(async () => {
        try {
          const net = await API.getNetworkInfo();
          if (net && net.tunnel_url && !net.tunnel_url.includes('admin.localhost.run') && !net.tunnel_url.startsWith('https://localhost.run')) {
            clearInterval(this._tunnelPollTimer);
            this._tunnelPollTimer = null;
            this.networkInfo = net;
            const modalTitle = document.querySelector('#customModal .modal-title');
            if (modalTitle && modalTitle.innerText.includes('Connect Devices')) {
              this.openMobileConnectModal();
              this.switchNetTab('tunnel');
            }
          }
        } catch(e) {}
      }, 2500);
    } else {
      if (this._tunnelPollTimer) {
        clearInterval(this._tunnelPollTimer);
        this._tunnelPollTimer = null;
      }
    }
  },

  async refreshTunnelModal() {
    try {
      this.networkInfo = await API.getNetworkInfo();
      this.openMobileConnectModal();
      this.switchNetTab('tunnel');
    } catch(e) {}
  },

  async triggerFirewallFix() {
    try {
      this.showToast('Launching Firewall unlock tool... Please click YES on the Windows prompt on your PC screen!', 'info');
      const res = await API.fixFirewall();
      if (res && res.message) {
        this.showToast(res.message, 'success');
      }
    } catch (err) {
      this.showToast('Please right-click "fix_wifi_and_tailscale.bat" on your PC and run as Administrator.', 'warning');
    }
  },

  copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(successMsg, 'success');
      }).catch(() => {
        this.showToast('Please copy manually: ' + text, 'info');
      });
    } else {
      this.showToast('Please copy manually: ' + text, 'info');
    }
  },

  switchNetTab(tab) {
    const tabs = ['wifi', 'tailscale', 'tunnel'];
    tabs.forEach(t => {
      const btn = document.getElementById(`netTab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
      const content = document.getElementById(`netTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (btn) btn.classList.toggle('active', t === tab);
      if (content) content.style.display = (t === tab) ? 'flex' : 'none';
    });
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✔';
    if (type === 'error') icon = '✗';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  // Custom Modal
  showCustomModal(title, bodyHtml, onConfirm = null, confirmText = 'Save', size = null) {
    const overlay = document.getElementById('customModalOverlay');
    const cardEl = overlay?.querySelector('.modal-card');
    const titleEl = document.getElementById('customModalTitle');
    const bodyEl = document.getElementById('customModalBody');
    const confirmBtn = document.getElementById('customModalConfirmBtn');

    if (cardEl) {
      cardEl.classList.remove('modal-card-lg', 'modal-card-xl');
      if (size === 'lg') cardEl.classList.add('modal-card-lg');
      else if (size === 'xl') cardEl.classList.add('modal-card-xl');
    }

    titleEl.innerText = title;
    bodyEl.innerHTML = bodyHtml;

    if (onConfirm) {
      confirmBtn.style.display = 'inline-flex';
      confirmBtn.innerText = confirmText;
      confirmBtn.onclick = async () => {
        await onConfirm();
        overlay.classList.remove('active');
        if (cardEl) cardEl.classList.remove('modal-card-lg', 'modal-card-xl');
      };
    } else {
      confirmBtn.style.display = 'none';
    }

    overlay.classList.add('active');
  },

  closeCustomModal() {
    if (this._tunnelPollTimer) {
      clearInterval(this._tunnelPollTimer);
      this._tunnelPollTimer = null;
    }
    const overlay = document.getElementById('customModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      const cardEl = overlay.querySelector('.modal-card');
      if (cardEl) cardEl.classList.remove('modal-card-lg', 'modal-card-xl');
      const footerEl = overlay.querySelector('.modal-footer');
      if (footerEl) footerEl.style.display = '';
    }
  },

  // Password Prompt Modal
  askPassword(key = 'password', onValid, customTitle = null, customPrompt = null) {
    let title = customTitle || 'Admin Authentication Required';
    let promptText = customPrompt || 'Please enter administrative password to continue:';

    if (key === 'delete_password') {
      title = customTitle || '🗑️ Delete Password Required';
      promptText = customPrompt || 'Asked every time an order is deleted. Please enter delete password:';
    } else if (key === 'salary_password') {
      title = customTitle || '💰 Salary Password Required';
      promptText = customPrompt || 'Asked before opening a salary slip, salary history or Manage advance. Enter salary password:';
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 13px; color: var(--muted);">${promptText}</p>
        <input type="password" id="modalPasswordInput" class="form-input" placeholder="Enter password" autofocus style="font-size: 16px;">
      </div>
    `;

    this.showCustomModal(title, html, async () => {
      const pwd = document.getElementById('modalPasswordInput').value;
      try {
        const res = await API.verifyPassword(key, pwd);
        if (res.valid) {
          onValid(pwd);
        } else {
          this.showToast('Incorrect password. Access denied.', 'error');
        }
      } catch (err) {
        this.showToast('Authentication failed: ' + (err.message || 'Incorrect password'), 'error');
      }
    }, 'Authenticate');
  },

  setPrintPageSize(size = 'A6') {
    this.printPageSize = size;
    let styleEl = document.getElementById('dynamicPrintPageSizeStyle');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamicPrintPageSizeStyle';
      document.head.appendChild(styleEl);
    }
    let sizeCss = 'A6 portrait';
    let marginCss = '4mm 6mm';
    if (size === 'A4') {
      sizeCss = 'A4 portrait';
      marginCss = '10mm 12mm';
    } else if (size === 'A5') {
      sizeCss = 'A5 portrait';
      marginCss = '6mm 8mm';
    } else if (size === 'Thermal80') {
      sizeCss = '80mm auto';
      marginCss = '2mm 3mm';
    } else if (size === 'Thermal58') {
      sizeCss = '58mm auto';
      marginCss = '2mm 2mm';
    } else {
      sizeCss = 'A6 portrait';
      marginCss = '4mm 6mm';
    }
    styleEl.innerHTML = `@media print { @page { size: ${sizeCss} !important; margin: ${marginCss} !important; } }`;
  },

  // Print Station Modal (Matching Image 3 & Image 4)
  async openPrintModal(tokens = []) {
    if (tokens.length === 0) return;
    const orders = [];
    for (const t of tokens) {
      const o = await API.getOrder(t);
      if (o) orders.push(o);
    }
    if (orders.length === 0) return;

    this.setPrintPageSize(this.printPageSize || 'A6');

    const first = orders[0];
    const overlay = document.getElementById('printModalOverlay');
    const bodyEl = document.getElementById('printModalBody');

    let totalPieces = 0;
    orders.forEach(o => {
      let gList = o.garments;
      if (typeof gList === 'string') {
        try { gList = JSON.parse(gList); } catch (e) { gList = []; }
      }
      if (!Array.isArray(gList)) gList = [];
      const pieces = gList.reduce((acc, g) => acc + (parseInt(g?.qty) || 1), 0);
      totalPieces += pieces;
    });

    bodyEl.innerHTML = `
      <div style="display: grid; grid-template-columns: 290px 1fr; gap: 20px; min-height: 520px;">
        <div class="print-options-panel no-print" style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 14px;">
              WHAT TO PRINT
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; color: var(--ink);">
                <input type="checkbox" id="prCustSlip" checked class="table-checkbox" onchange="App.refreshPrintPreview()">
                <span>Customer slip</span>
              </label>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; color: var(--ink);">
                  <input type="checkbox" id="prClothTag" checked class="table-checkbox" onchange="App.refreshPrintPreview()">
                  <span>Uncut cloth tag</span>
                </label>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);">
                  <span>Copies</span>
                  <input type="number" id="prTagCopies" value="1" min="1" max="10" style="width: 44px; padding: 2px 4px; text-align: center; border: 1px solid var(--border-subtle); border-radius: 4px; font-weight: 600; color: var(--ink); background: white;" onchange="App.refreshPrintPreview()">
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; color: var(--ink);">
                  <input type="checkbox" id="prJobCard" checked class="table-checkbox" onchange="App.refreshPrintPreview()">
                  <span>Master job card</span>
                </label>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);">
                  <span>Copies</span>
                  <input type="number" id="prJobCopies" value="1" min="1" max="10" style="width: 44px; padding: 2px 4px; text-align: center; border: 1px solid var(--border-subtle); border-radius: 4px; font-weight: 600; color: var(--ink); background: white;" onchange="App.refreshPrintPreview()">
                </div>
              </div>

              <!-- Page Size Selector (A6 by Default) -->
              <div style="margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--border);">
                <label class="form-label" style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); margin-bottom: 6px;">Paper / Slip Size</label>
                <select id="prPageSizeSelect" class="form-select" style="font-size: 12px;" onchange="App.setPrintPageSize(this.value)">
                  <option value="A6" selected>A6 (Standard Tailor Slip - 105 × 148 mm)</option>
                  <option value="A4">A4 (Full Sheet - 210 × 297 mm)</option>
                  <option value="A5">A5 (Half Sheet - 148 × 210 mm)</option>
                  <option value="Thermal80">Thermal 80mm Roll (POS Receipt)</option>
                  <option value="Thermal58">Thermal 58mm Roll (Mini POS)</option>
                </select>
              </div>
            </div>

            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted);">
              <div>${first.token} has <strong>${totalPieces}</strong> piece(s).</div>
              <div style="font-size: 14px; font-weight: 800; color: var(--ink); margin-top: 4px;">
                Pages to print: <span id="prPageCountDisplay">3</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary" style="flex: 1; padding: 10px;" onclick="window.print()">
                <span>🖨️</span> Print...
              </button>
              <button class="btn btn-secondary" style="padding: 10px 16px;" onclick="App.closePrintModal()">
                Close
              </button>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="App.sendOrderWhatsAppFromPrint('${first.token}')" style="color: var(--burgundy); font-weight: 600;">
              <span>💬</span> WhatsApp Slip to Customer
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; min-width: 0;">
          <div class="no-print" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px;">
            PRINT PREVIEW
          </div>
          <div style="border: 1px solid var(--border); border-radius: var(--radius-md); background: white; padding: 16px; overflow-y: auto; max-height: 72vh; flex: 1;" id="printPreviewContainer">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    this._currentPrintOrders = orders;
    this.refreshPrintPreview();
  },

  refreshPrintPreview() {
    const container = document.getElementById('printPreviewContainer');
    if (!container || !this._currentPrintOrders) return;

    const showCust = document.getElementById('prCustSlip')?.checked;
    const showTag = document.getElementById('prClothTag')?.checked;
    const showJob = document.getElementById('prJobCard')?.checked;
    const tagCopies = parseInt(document.getElementById('prTagCopies')?.value) || 1;
    const jobCopies = parseInt(document.getElementById('prJobCopies')?.value) || 1;

    let html = '';
    let totalPages = 0;

    this._currentPrintOrders.forEach((o, idx) => {
      const pageBreak = '<div class="page-break" style="margin: 20px 0; border-top: 2px dashed #CBD5E1;"></div>';

      if (showCust) {
        html += PrintEngine.buildCustomerSlipHtml(o, this.settings) + '<div style="height: 16px;"></div>';
        totalPages += 1;
      }
      if (showTag) {
        for (let i = 0; i < tagCopies; i++) {
          html += PrintEngine.buildClothTagHtml(o, this.settings?.shop_name) + '<div style="height: 16px;"></div>';
          totalPages += 1;
        }
      }
      if (showJob) {
        for (let i = 0; i < jobCopies; i++) {
          html += PrintEngine.buildJobCardHtml(o, this.settings) + '<div style="height: 16px;"></div>';
          totalPages += 1;
        }
      }

      if (idx < this._currentPrintOrders.length - 1) {
        html += pageBreak;
      }
    });

    if (!showCust && !showTag && !showJob) {
      html = '<div style="text-align: center; color: var(--muted); padding: 40px;">Select at least one slip option on the left to preview.</div>';
    }

    container.innerHTML = html;
    const countDisplay = document.getElementById('prPageCountDisplay');
    if (countDisplay) countDisplay.innerText = totalPages;
  },

  closePrintModal() {
    document.getElementById('printModalOverlay')?.classList.remove('active');
  },

  async openPrintSalarySlipModal(slipNo) {
    const slip = await API.getSalarySlip(slipNo);
    if (!slip) return;

    const overlay = document.getElementById('printModalOverlay');
    const bodyEl = document.getElementById('printModalBody');

    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="max-height: 75vh; overflow-y: auto; background: white; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md);">
          ${PrintEngine.buildSalarySlipHtml(slip, this.settings)}
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary" onclick="App.closePrintModal()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print Slip</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
  },

  async openWhatsAppQueue(tokens = []) {
    if (tokens.length === 0) return;
    const orders = [];
    for (const t of tokens) {
      const o = await API.getOrder(t);
      if (o) orders.push(o);
    }
    if (orders.length === 0) return;

    let currentIndex = 0;
    let templateType = 'ready';

    const renderStep = () => {
      const o = orders[currentIndex];
      const message = PrintEngine.generateOrderWhatsApp(o, templateType, this.settings?.shop_name);

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${o.customer}</div>
              <div style="font-size: 12px; color: var(--muted);">📞 ${o.phone} · Order ${o.token}</div>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: var(--rust);">
              Customer ${currentIndex + 1} of ${orders.length}
            </div>
          </div>

          <div style="display: flex; gap: 16px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waTemplate" value="ready" ${templateType === 'ready' ? 'checked' : ''} onchange="App.updateQueueTemplate('ready')">
              <span>Garment Ready</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waTemplate" value="due" ${templateType === 'due' ? 'checked' : ''} onchange="App.updateQueueTemplate('due')">
              <span>Balance Due Reminder</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Message Preview (Editable)</label>
            <textarea id="waQueueMessageText" class="form-textarea" style="height: 120px;">${message}</textarea>
          </div>
        </div>
      `;

      this.showCustomModal(`WhatsApp Quick-Send Queue`, html, async () => {
        const text = document.getElementById('waQueueMessageText').value;
        PrintEngine.openWhatsApp(o.phone, text);

        if (currentIndex + 1 < orders.length) {
          currentIndex++;
          renderStep();
        } else {
          this.showToast('WhatsApp queue completed!', 'success');
          this.closeCustomModal();
        }
      }, currentIndex + 1 < orders.length ? 'Open WhatsApp ▶ Next' : 'Open WhatsApp & Finish');
    };

    this.updateQueueTemplate = (type) => {
      templateType = type;
      const o = orders[currentIndex];
      const area = document.getElementById('waQueueMessageText');
      if (area) {
        area.value = PrintEngine.generateOrderWhatsApp(o, templateType, this.settings?.shop_name);
      }
    };

    renderStep();
  },

  openCustomerWhatsAppQueue(customers = []) {
    if (!customers || customers.length === 0) return;

    let currentIndex = 0;
    let templateType = (customers[0]?.pending_balance > 0) ? 'due' : 'ready';
    const shopName = this.settings?.shop_name || "7 ART TAILORS";

    const generateCustomerMsg = (c, tType) => {
      const bal = c.pending_balance || 0;
      if (tType === 'due') {
        if (bal > 0) {
          return `Hello ${c.customer}, greetings from ${shopName}!\n\nThis is a friendly reminder that you have a pending balance of ₹${PrintEngine.fmtMoney(bal)} on your orders. Please feel free to clear the balance at your convenience.\n\nThank you!`;
        } else {
          return `Hello ${c.customer}, greetings from ${shopName}!\n\nAll your previous orders are fully cleared with zero pending balance. Thank you for your continued trust!`;
        }
      } else if (tType === 'ready') {
        return `Hello ${c.customer}, greetings from ${shopName}!\n\nYour bespoke tailoring order is ready at the workshop. You are welcome to visit us for trial and delivery.\n\nThank you!`;
      } else {
        return `Hello ${c.customer}, greetings from ${shopName}!\n\nThank you for choosing 7 ART TAILORS. Please let us know if you need any tailoring service or alterations.`;
      }
    };

    const renderStep = () => {
      const c = customers[currentIndex];
      const message = generateCustomerMsg(c, templateType);
      const bal = c.pending_balance || 0;

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${c.customer}</div>
              <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">📞 ${c.phone} ${bal > 0 ? `· <span style="color: var(--red); font-weight: 700;">Due: ₹${PrintEngine.fmtMoney(bal)}</span>` : '· <span style="color: var(--green); font-weight: 600;">Balance Cleared</span>'}</div>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: var(--rust);">
              Customer ${currentIndex + 1} of ${customers.length}
            </div>
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waCustTemplate" value="ready" ${templateType === 'ready' ? 'checked' : ''} onchange="App.updateCustQueueTemplate('ready')">
              <span>Order Ready</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waCustTemplate" value="due" ${templateType === 'due' ? 'checked' : ''} onchange="App.updateCustQueueTemplate('due')">
              <span>Balance Reminder</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waCustTemplate" value="general" ${templateType === 'general' ? 'checked' : ''} onchange="App.updateCustQueueTemplate('general')">
              <span>Studio Greetings</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Message Preview (Editable)</label>
            <textarea id="waCustQueueMessageText" class="form-textarea" style="height: 120px;">${message}</textarea>
          </div>

          ${customers.length > 1 ? `
          <div style="display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="App.skipCustQueueStep()" style="color: var(--muted);">
              Skip this customer ⏭
            </button>
          </div>
          ` : ''}
        </div>
      `;

      this.showCustomModal(`WhatsApp Customer Queue`, html, async () => {
        const text = document.getElementById('waCustQueueMessageText').value;
        PrintEngine.openWhatsApp(c.phone, text);

        if (currentIndex + 1 < customers.length) {
          currentIndex++;
          renderStep();
        } else {
          this.showToast('WhatsApp customer queue completed!', 'success');
          this.closeCustomModal();
        }
      }, currentIndex + 1 < customers.length ? 'Open WhatsApp ▶ Next' : 'Open WhatsApp & Finish');
    };

    this.updateCustQueueTemplate = (type) => {
      templateType = type;
      const c = customers[currentIndex];
      const area = document.getElementById('waCustQueueMessageText');
      if (area) {
        area.value = generateCustomerMsg(c, templateType);
      }
    };

    this.skipCustQueueStep = () => {
      if (currentIndex + 1 < customers.length) {
        currentIndex++;
        renderStep();
      } else {
        this.closeCustomModal();
      }
    };

    renderStep();
  },

  async quickWhatsApp(token) {
    const o = await API.getOrder(token);
    if (!o) return;
    const msg = PrintEngine.generateOrderWhatsApp(o, 'ready', this.settings?.shop_name);
    PrintEngine.openWhatsApp(o.phone, msg);
  },

  async sendOrderWhatsAppFromPrint(token) {
    this.quickWhatsApp(token);
  },

  async openSettleModal(token) {
    const o = await API.getOrder(token);
    if (!o) return;

    const overlay = document.getElementById('customModalOverlay');
    const titleEl = document.getElementById('customModalTitle');
    const bodyEl = document.getElementById('customModalBody');
    const footerEl = overlay.querySelector('.modal-footer');

    titleEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #BD1A22; color: white; border-radius: 6px; font-size: 14px;">✂️</span>
        <span style="font-weight: 700; color: #1E1617;">Settle & Deliver</span>
      </div>
    `;

    const totalFmt = PrintEngine.fmtMoney(o.total || 0);
    const advanceFmt = PrintEngine.fmtMoney(o.advance || 0);
    const balanceFmt = PrintEngine.fmtMoney(o.balance || 0);

    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 4px 0;">
        <div style="text-align: center; margin-bottom: 2px;">
          <h2 style="font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: #1E1617; margin: 0;">Settle & Deliver</h2>
          <div style="font-size: 13px; color: #4A3B3C; margin-top: 4px; font-weight: 500;">
            <strong>${o.token}</strong> · ${o.customer} · ${o.phone}
          </div>
        </div>

        <!-- Bill Summary Card (Matches Image 2) -->
        <div style="background: #FFFFFF; border: 1.5px solid #EFE9E9; border-radius: 12px; padding: 18px 22px; box-shadow: 0 2px 8px rgba(17,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 14px; color: #8E7274;">Total bill</span>
            <span style="font-size: 15px; font-weight: 700; color: #1E1617;">₹ ${totalFmt}</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #8E7274;">Advance already paid</span>
            <span style="font-size: 15px; font-weight: 700; color: #1E1617;">₹ ${advanceFmt}</span>
          </div>

          <div style="border-top: 1px solid #EFE9E9; margin: 12px 0;"></div>

          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #BD1A22; text-transform: uppercase;">BALANCE DUE</span>
            <span style="font-size: 26px; font-weight: 800; color: #BD1A22; font-family: var(--font-sans);">₹ ${balanceFmt}</span>
          </div>
        </div>

        <!-- Amount Received Input (Matches Image 2) -->
        <div style="margin-top: 4px;">
          <label style="display: block; font-size: 13px; font-weight: 700; color: #1E1617; margin-bottom: 6px;">
            Amount received from the customer (₹)
          </label>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="number" id="settleReceivedAmt" class="form-input" value="${o.balance}" min="0" step="any"
                   style="flex: 1; font-size: 18px; font-weight: 700; text-align: right; color: #1E1617; padding: 10px 14px; border: 1.5px solid #D3B6B8; border-radius: 8px; background: #FFFFFF;"
                   oninput="App.updateSettleCalculations(${o.total || 0}, ${o.advance || 0}, ${o.balance || 0})">
            <select id="settlePayMode" class="form-select" style="width: 120px; font-size: 13px; padding: 10px 8px; border: 1.5px solid #D3B6B8; border-radius: 8px;">
              <option value="Cash" ${o.pay_mode === 'Cash' ? 'selected' : ''}>Cash</option>
              <option value="UPI" ${o.pay_mode === 'UPI' ? 'selected' : ''}>UPI</option>
              <option value="Card">Card</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
          <div id="settleStatusPill" style="margin-top: 8px; font-size: 13px; font-weight: 700; color: #10B981; display: flex; align-items: center; gap: 5px;">
            ✔ Account fully settled
          </div>
        </div>

        <!-- Action Buttons (Matches Image 2) -->
        <div style="display: flex; gap: 10px; margin-top: 14px; justify-content: flex-end;">
          <button type="button" class="btn btn-green" id="btnCollectDeliver" onclick="App.executeSettle('${o.token}', true)"
                  style="background: #10B981; color: white; font-weight: 700; padding: 10px 18px; border-radius: 8px; border: none; font-size: 13px;">
            Collect & Deliver
          </button>
          <button type="button" class="btn btn-primary" id="btnCollectStayOpen" onclick="App.executeSettle('${o.token}', false)"
                  style="background: #BD1A22; color: white; font-weight: 700; padding: 10px 18px; border-radius: 8px; border: none; font-size: 13px;">
            Collect & Stay Open
          </button>
          <button type="button" class="btn btn-secondary" onclick="App.closeCustomModal()"
                  style="background: #FFFFFF; border: 1px solid #D3B6B8; color: #1E1617; font-weight: 600; padding: 10px 18px; border-radius: 8px; font-size: 13px;">
            Cancel
          </button>
        </div>
      </div>
    `;

    if (footerEl) footerEl.style.display = 'none';
    overlay.classList.add('active');
  },

  updateSettleCalculations(total, advance, balance) {
    const input = document.getElementById('settleReceivedAmt');
    const statusEl = document.getElementById('settleStatusPill');
    if (!input || !statusEl) return;
    const val = parseFloat(input.value) || 0;
    const remaining = balance - val;
    if (Math.abs(remaining) < 0.01) {
      statusEl.innerHTML = `<span style="color: #10B981; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">✔ Account fully settled</span>`;
    } else if (remaining > 0) {
      statusEl.innerHTML = `<span style="color: #BD1A22; font-weight: 700;">Remaining Balance Due: ₹${PrintEngine.fmtMoney(remaining)}</span>`;
    } else {
      statusEl.innerHTML = `<span style="color: #8E7274; font-weight: 700;">Overpayment / Return Change: ₹${PrintEngine.fmtMoney(-remaining)}</span>`;
    }
  },

  async executeSettle(token, deliver = true) {
    const amtInput = document.getElementById('settleReceivedAmt');
    const payModeSelect = document.getElementById('settlePayMode');
    const amt = amtInput ? parseFloat(amtInput.value || 0) : null;
    const payMode = payModeSelect ? payModeSelect.value : 'Cash';

    try {
      await API.settleOrder(token, payMode, amt, deliver);
      this.closeCustomModal();
      if (deliver) {
        this.showToast(`Order ${token} settled and marked Delivered!`, 'success');
      } else {
        this.showToast(`Payment of ₹${PrintEngine.fmtMoney(amt)} recorded for Order ${token}!`, 'success');
      }

      // Refresh view
      if (this.currentPage === 'orders' && window.OrdersView) {
        await OrdersView.loadOrders();
        const tbody = document.getElementById('ordersTableBody');
        if (tbody) tbody.innerHTML = OrdersView.renderTableRows();
        OrdersView.updateBulkActionBar();
      } else if (this.currentPage === 'dashboard' && window.DashboardView) {
        await DashboardView.render(document.getElementById('contentViewport'));
      } else if (this.currentPage === 'customers' && window.CustomersView) {
        await CustomersView.loadCustomers();
        CustomersView.render();
      }

      // Offer to print settled invoice
      if (deliver) {
        setTimeout(() => {
          if (confirm(`Order ${token} has been delivered. Would you like to print the settled delivery invoice slip?`)) {
            this.openPrintModal([token]);
          }
        }, 300);
      }
    } catch (err) {
      this.showToast(err.message || 'Settlement failed', 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});

