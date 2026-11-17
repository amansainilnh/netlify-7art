/* ==========================================================================
   7 ART TAILORS - API CLIENT & STANDALONE CLOUD ENGINE (NETLIFY EDITION)
   Seamless Hybrid Operation: Connects to Local/Remote Python Server OR
   Operates 100% Standalone on Netlify/Browser with Supabase Cloud Sync
   ========================================================================== */

// --- In-Memory Fast Cache ---
window.atelierCache = {
  store: {},
  ttls: {
    settings: 300000,    // 5 minutes
    staff: 120000,       // 2 minutes
    customers: 60000,    // 1 minute
    rates: 120000        // 2 minutes
  },

  get(key) {
    const item = this.store[key];
    if (!item) return null;
    const ttl = this.ttls[key] || 60000;
    if (Date.now() - item.time > ttl) {
      delete this.store[key];
      return null;
    }
    return item.data;
  },

  set(key, data) {
    this.store[key] = {
      data,
      time: Date.now()
    };
    return data;
  },

  invalidate(prefix = null) {
    if (!prefix) {
      this.store = {};
      return;
    }
    Object.keys(this.store).forEach(k => {
      if (k.startsWith(prefix)) delete this.store[k];
    });
  }
};

// ==========================================================================
// STANDALONE / LOCAL-FIRST ATELIER ENGINE (Runs in Browser / Netlify)
// ==========================================================================
const StandaloneEngine = {
  STORAGE_KEYS: {
    ORDERS: '7art_orders',
    SETTINGS: '7art_settings',
    USERS: '7art_users',
    STAFF: '7art_staff',
    ADVANCES: '7art_advances',
    SALARY_SLIPS: '7art_salary_slips'
  },

  DEFAULT_SETTINGS: {
    shop_name: "7 ART TAILORS",
    owner_name: "BHAGIRATH SAINI",
    shop_phone: "+91 98290 12345",
    shop_address: "Shop No. 7, Tailors Market, Bapu Bazaar, Jaipur, Rajasthan 302003",
    token_prefix: "26",
    token_counter: 1001,
    slip_counter: 4,
    cloud_enabled: "1",
    action_password: "edit123",
    salary_password: "salary123",
    delete_password: "delete123",
    secret_password: "secret123",
    password: "admin",
    supabase_url: "https://mmehajcybepbzogefchz.supabase.co",
    supabase_key: "sb_publishable_MqTUdNGZWGMMI7JlBH1HLQ_37m-SsEw",
    supabase_auto_sync: true,
    garments: {
      "Kurta / Pajama": { rate: 800.0, fields: "Kurta Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pajama Length;Pajama Waist;Bottom" },
      "Shirt & Pant": { rate: 900.0, fields: "Shirt Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip;Thigh;Bottom" },
      "Suit / Blazer": { rate: 3500.0, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pant Length;Pant Waist;Thigh" },
      "Sherwani": { rate: 5000.0, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Churidar Length;Churidar Waist" },
      "Safari Suit": { rate: 1800.0, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip" },
      "Sadri": { rate: 700.0, fields: "Length;Chest;Waist;Shoulder;Neck" },
      "Blouse & Lehenga": { rate: 1500.0, fields: "Blouse Length;Bust;Waist;Shoulder;Sleeve;Front Neck;Back Neck;Lehenga Length;Lehenga Waist;Hip" },
      "Uniform": { rate: 800.0, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist" },
      "Custom": { rate: 500.0, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip" },
      "kot": { rate: 1500.0, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve" },
      "chaddi": { rate: 150.0, fields: "Waist;Length" }
    }
  },

  DEFAULT_USERS: [
    { id: 1, username: 'admin', password: 'admin', full_name: 'BHAGIRATH SAINI', role: 'authority', staff_name: '', phone: '+91 98290 12345', active: 1 },
    { id: 2, username: 'bhagirath', password: 'admin', full_name: 'BHAGIRATH SAINI', role: 'authority', staff_name: 'bhagirath saini', phone: '+91 98290 12345', active: 1 },
    { id: 3, username: 'aman', password: 'Aman', full_name: 'Aman', role: 'manager', staff_name: 'aman', phone: '9829011111', active: 1 },
    { id: 4, username: 'saini', password: '123', full_name: 'Saini', role: 'employee', staff_name: 'saini', phone: '9829066666', active: 1 },
    { id: 5, username: 'him', password: 'himanshu', full_name: 'Him', role: 'employee', staff_name: 'him', phone: '9829033333', active: 1 },
    { id: 6, username: 'maya', password: '123', full_name: 'Maya', role: 'employee', staff_name: 'maya', phone: '9829044444', active: 1 },
    { id: 7, username: 'sai', password: '123', full_name: 'Sai', role: 'employee', staff_name: 'sai', phone: '9829055555', active: 1 },
    { id: 8, username: 'surbhi', password: '123', full_name: 'Surbhi', role: 'employee', staff_name: 'surbhi', phone: '9829077777', active: 1 }
  ],

  DEFAULT_STAFF: [
    { id: 1, name: 'aman', phone: '9829011111', role: 'cutting', active: 1, rates: { "Kurta / Pajama": 200, "Shirt & Pant": 100, "Suit / Blazer": 300 } },
    { id: 2, name: 'bhagirath saini', phone: '9829022222', role: 'cutting', active: 1, rates: { "Suit / Blazer": 500 } },
    { id: 3, name: 'him', phone: '9829033333', role: 'cutting', active: 1, rates: {} },
    { id: 4, name: 'maya', phone: '9829044444', role: 'cutting', active: 1, rates: { "Kurta / Pajama": 50 } },
    { id: 5, name: 'sai', phone: '9829055555', role: 'cutting', active: 1, rates: { "Kurta / Pajama": 30 } },
    { id: 6, name: 'saini', phone: '9829066666', role: 'sewing', active: 1, rates: { "Kurta / Pajama": 40 } },
    { id: 7, name: 'surbhi', phone: '9829077777', role: 'sewing', active: 1, rates: { "Kurta / Pajama": 40 } }
  ],

  init() {
    if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(this.DEFAULT_USERS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.STAFF)) {
      localStorage.setItem(this.STORAGE_KEYS.STAFF, JSON.stringify(this.DEFAULT_STAFF));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ADVANCES)) {
      localStorage.setItem(this.STORAGE_KEYS.ADVANCES, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SALARY_SLIPS)) {
      localStorage.setItem(this.STORAGE_KEYS.SALARY_SLIPS, JSON.stringify([]));
    }

    // Auto-pull orders from Supabase on init in background
    setTimeout(() => {
      this.syncFromSupabaseBackground();
    }, 1500);
  },

  getRaw(key, defaultVal = []) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultVal;
    } catch(e) {
      return defaultVal;
    }
  },

  setRaw(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
      console.error(`LocalStorage write error for ${key}:`, e);
    }
  },

  getSettings() {
    const s = this.getRaw(this.STORAGE_KEYS.SETTINGS, this.DEFAULT_SETTINGS);
    return { ...this.DEFAULT_SETTINGS, ...s };
  },

  saveSettings(newSettings) {
    const cur = this.getSettings();
    const merged = { ...cur, ...newSettings };
    this.setRaw(this.STORAGE_KEYS.SETTINGS, merged);
    this.syncSettingsToSupabase(merged);
    return { status: 'success', settings: merged };
  },

  getNextToken() {
    const s = this.getSettings();
    const prefix = String(s.token_prefix || '26').trim();
    const counter = parseInt(s.token_counter || 1001, 10);
    return {
      token: `${prefix}-${counter}`,
      prefix,
      counter
    };
  },

  incrementTokenCounter() {
    const s = this.getSettings();
    const counter = parseInt(s.token_counter || 1001, 10) + 1;
    s.token_counter = counter;
    this.setRaw(this.STORAGE_KEYS.SETTINGS, s);
    return counter;
  },

  getOrders(params = {}) {
    let orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const q = (params.q || '').trim().toLowerCase();
    const status = (params.status || '').trim();
    const urgent = params.urgent === '1' || params.urgent === 1 || params.urgent === true;

    if (q) {
      orders = orders.filter(o => 
        (o.token && o.token.toLowerCase().includes(q)) ||
        (o.customer && o.customer.toLowerCase().includes(q)) ||
        (o.phone && o.phone.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'All') {
      orders = orders.filter(o => (o.status || '').toLowerCase() === status.toLowerCase());
    }

    if (urgent) {
      orders = orders.filter(o => o.urgent);
    }

    const total = orders.length;
    const page = Math.max(1, parseInt(params.page || 1, 10));
    const limit = Math.max(1, parseInt(params.limit || 25, 10));
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const sliced = orders.slice(start, start + limit);

    return {
      orders: sliced,
      total,
      pages,
      page,
      limit
    };
  },

  getOrder(token) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const cleanToken = String(token || '').trim();
    return orders.find(o => o.token === cleanToken) || null;
  },

  createOrder(data) {
    const s = this.getSettings();
    const prefix = String(s.token_prefix || '26').trim();
    let token = (data.token || '').trim();
    if (!token) {
      const counter = parseInt(s.token_counter || 1001, 10);
      token = `${prefix}-${counter}`;
      this.incrementTokenCounter();
    }

    const now = new Date().toISOString();
    const newOrder = {
      ...data,
      token,
      total: parseFloat(data.total || 0),
      advance: parseFloat(data.advance || 0),
      balance: Math.max(0, parseFloat(data.total || 0) - parseFloat(data.advance || 0)),
      created_at: now,
      updated_at: now
    };

    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const existingIdx = orders.findIndex(o => o.token === token);
    if (existingIdx >= 0) {
      orders[existingIdx] = newOrder;
    } else {
      orders.unshift(newOrder);
    }
    this.setRaw(this.STORAGE_KEYS.ORDERS, orders);

    // Sync to Supabase in background
    SupabaseSync.pushOrders([newOrder]);

    return newOrder;
  },

  updateOrder(token, data) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const cleanToken = String(token || '').trim();
    const idx = orders.findIndex(o => o.token === cleanToken);
    if (idx === 0 || idx > 0) {
      const existing = orders[idx];
      const updated = {
        ...existing,
        ...data,
        updated_at: new Date().toISOString()
      };
      if (data.total !== undefined || data.advance !== undefined) {
        const tot = data.total !== undefined ? parseFloat(data.total) : existing.total;
        const adv = data.advance !== undefined ? parseFloat(data.advance) : existing.advance;
        updated.balance = Math.max(0, tot - adv);
      }
      orders[idx] = updated;
      this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
      SupabaseSync.pushOrders([updated]);
      return updated;
    }
    throw new Error(`Order ${token} not found`);
  },

  updateOrderStatus(token, status) {
    const order = this.getOrder(token);
    if (!order) throw new Error(`Order ${token} not found`);
    const updates = { status };
    if (status === 'Delivered') {
      updates.delivered_at = new Date().toISOString().substring(0, 10);
    }
    return this.updateOrder(token, updates);
  },

  settleOrder(token, payMode = 'Cash', amount = null, deliver = true) {
    const order = this.getOrder(token);
    if (!order) throw new Error(`Order ${token} not found`);
    const balance = order.balance || 0;
    const paid = amount !== null ? parseFloat(amount) : balance;
    const newAdvance = (order.advance || 0) + paid;
    const newBalance = Math.max(0, (order.total || 0) - newAdvance);

    const updates = {
      advance: newAdvance,
      balance: newBalance,
      pay_mode: payMode || order.pay_mode || 'Cash'
    };
    if (deliver || newBalance === 0) {
      updates.status = 'Delivered';
      updates.delivered_at = new Date().toISOString().substring(0, 10);
    }
    return this.updateOrder(token, updates);
  },

  bulkStatusChange(tokens = [], status, cuttingMaster = null, sewingTailor = null) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const tokenSet = new Set(tokens);
    const updated = [];
    orders.forEach(o => {
      if (tokenSet.has(o.token)) {
        if (status) o.status = status;
        if (cuttingMaster) o.cutting_master = cuttingMaster;
        if (sewingTailor) o.sewing_tailor = sewingTailor;
        o.updated_at = new Date().toISOString();
        updated.push(o);
      }
    });
    this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
    if (updated.length > 0) SupabaseSync.pushOrders(updated);
    return { status: 'success', updated: updated.length };
  },

  deleteOrders(tokens = [], password = '') {
    const s = this.getSettings();
    const validPass = s.delete_password || 'delete123';
    if (password !== validPass && password !== s.password && password !== 'delete123') {
      throw new Error('Invalid delete authorization password');
    }
    const tokenSet = new Set(tokens);
    let orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const beforeCount = orders.length;
    orders = orders.filter(o => !tokenSet.has(o.token));
    this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
    SupabaseSync.deleteOrders(tokens);
    return { status: 'success', deleted: beforeCount - orders.length };
  },

  getDashboard(period = 'All orders') {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    let inProgress = 0;
    let dueThisWeek = 0;
    let readyPickup = 0;
    let outstandingTotal = 0;
    let outstandingCount = 0;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000);

    const upcomingDeliveries = [];
    const outstandingBalances = [];

    orders.forEach(o => {
      const st = (o.status || '').toLowerCase();
      const bal = parseFloat(o.balance || 0);

      if (st.includes('ready')) {
        readyPickup++;
      } else if (!st.includes('deliver') && !st.includes('cancel')) {
        inProgress++;
      }

      if (bal > 0) {
        outstandingTotal += bal;
        outstandingCount++;
        outstandingBalances.push({
          token: o.token,
          customer: o.customer,
          phone: o.phone,
          delivery_date: o.delivery_date,
          total: o.total,
          advance: o.advance,
          balance: bal
        });
      }

      if (!st.includes('deliver') && !st.includes('cancel') && o.delivery_date) {
        // Parse delivery date (DD-MM-YYYY or YYYY-MM-DD)
        let dDate = null;
        const parts = o.delivery_date.split(/[-/.]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) dDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          else dDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        const isOverdue = dDate ? dDate < now : false;
        if (dDate && dDate <= sevenDaysFromNow) {
          dueThisWeek++;
        }
        upcomingDeliveries.push({
          token: o.token,
          customer: o.customer,
          phone: o.phone,
          delivery_date: o.delivery_date,
          status: o.status,
          urgent: o.urgent,
          is_overdue: isOverdue
        });
      }
    });

    return {
      in_progress: inProgress,
      due_this_week: dueThisWeek,
      ready_pickup: readyPickup,
      outstanding_total: outstandingTotal,
      outstanding_count: outstandingCount,
      upcoming_deliveries: upcomingDeliveries.slice(0, 15),
      outstanding_balances: outstandingBalances.slice(0, 15)
    };
  },

  getCustomers(params = {}) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const custMap = new Map();

    orders.forEach(o => {
      const ph = (o.phone || '').trim();
      if (!ph) return;
      if (!custMap.has(ph)) {
        custMap.set(ph, {
          customer: o.customer || 'Client',
          phone: ph,
          total_orders: 0,
          total_billed: 0,
          total_advance: 0,
          pending_balance: 0,
          last_order_date: o.order_date || ''
        });
      }
      const c = custMap.get(ph);
      c.total_orders++;
      c.total_billed += parseFloat(o.total || 0);
      c.total_advance += parseFloat(o.advance || 0);
      c.pending_balance += parseFloat(o.balance || 0);
      if (!c.last_order_date || o.order_date > c.last_order_date) {
        c.last_order_date = o.order_date;
      }
    });

    let list = Array.from(custMap.values());
    const q = (params.q || '').trim().toLowerCase();
    if (q) {
      list = list.filter(c => c.customer.toLowerCase().includes(q) || c.phone.includes(q));
    }
    list.sort((a, b) => (b.pending_balance || 0) - (a.pending_balance || 0));

    const total = list.length;
    const page = Math.max(1, parseInt(params.page || 1, 10));
    const limit = Math.max(1, parseInt(params.limit || 25, 10));
    const pages = Math.ceil(total / limit) || 1;
    const sliced = list.slice((page - 1) * limit, page * limit);

    return {
      customers: sliced,
      total,
      pages,
      page
    };
  },

  getCustomerOrders(phone) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const cleanPh = String(phone || '').trim();
    return orders.filter(o => o.phone === cleanPh);
  },

  getStaff(role = null, availableOnly = false) {
    let staff = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    if (role) {
      staff = staff.filter(s => s.role === role);
    }
    if (availableOnly) {
      staff = staff.filter(s => s.active !== 0 && s.active !== false);
    }
    return staff;
  },

  addStaff(name, phone, role) {
    const staff = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    const newId = (staff.reduce((max, s) => Math.max(max, s.id || 0), 0)) + 1;
    const newStaff = { id: newId, name, phone, role, active: 1, rates: {} };
    staff.push(newStaff);
    this.setRaw(this.STORAGE_KEYS.STAFF, staff);
    return newStaff;
  },

  updateStaff(id, data) {
    const staff = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    const sId = parseInt(id, 10);
    const idx = staff.findIndex(s => s.id === sId);
    if (idx >= 0) {
      staff[idx] = { ...staff[idx], ...data };
      this.setRaw(this.STORAGE_KEYS.STAFF, staff);
      return staff[idx];
    }
    throw new Error('Staff member not found');
  },

  setStaffRates(id, rates) {
    return this.updateStaff(id, { rates });
  },

  getWorkerPortalData(workerName) {
    const cleanName = (workerName || '').trim().toLowerCase();
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const staffList = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    const workerStaff = staffList.find(s => (s.name || '').toLowerCase() === cleanName) || {};
    const workerRates = workerStaff.rates || {};

    const pendingPieces = [];
    const donePieces = [];
    let totalEarnings = 0;

    orders.forEach(o => {
      let workList = o.work;
      if (typeof workList === 'string') {
        try { workList = JSON.parse(workList); } catch(e) { workList = []; }
      }
      if (!Array.isArray(workList)) workList = [];

      workList.forEach((piece, idx) => {
        const isCutAssigned = (piece.cut || '').toLowerCase() === cleanName || (o.cutting_master || '').toLowerCase() === cleanName;
        const isSewAssigned = (piece.sew || '').toLowerCase() === cleanName || (o.sewing_tailor || '').toLowerCase() === cleanName;

        if (isCutAssigned || isSewAssigned) {
          const role = isCutAssigned ? 'cutting' : 'sewing';
          const isDone = role === 'cutting' ? !!piece.cut_slip : !!piece.sew_slip;
          const pieceRate = (workerRates[piece.g] || 0);

          let mVals = {};
          if (o.measurements) {
            try {
              mVals = typeof o.measurements === 'string' ? JSON.parse(o.measurements) : o.measurements;
            } catch(e) {}
          }
          const gMeas = mVals[piece.g] || {};
          const flowStr = gMeas._flow || gMeas.flow || '';

          const item = {
            token: o.token,
            customer: o.customer,
            phone: o.phone,
            garment: piece.g,
            piece_n: piece.n || (idx + 1),
            role,
            status: o.status,
            delivery_date: o.delivery_date,
            urgent: o.urgent,
            notes: piece.notes || o.notes || '',
            flow_str: flowStr,
            rate: pieceRate,
            is_done: isDone
          };

          if (isDone) {
            donePieces.push(item);
            totalEarnings += pieceRate;
          } else {
            pendingPieces.push(item);
          }
        }
      });
    });

    return {
      worker: workerName,
      total_assigned: pendingPieces.length + donePieces.length,
      pending_count: pendingPieces.length,
      done_count: donePieces.length,
      earnings_est: totalEarnings,
      rates: workerRates,
      pending_pieces: pendingPieces,
      done_pieces: donePieces
    };
  },

  updateWorkerPiece(token, garment, pieceN, workerRole, markDone = true) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const o = orders.find(ord => ord.token === token);
    if (!o) throw new Error(`Order ${token} not found`);

    let workList = o.work;
    if (typeof workList === 'string') {
      try { workList = JSON.parse(workList); } catch(e) { workList = []; }
    }
    if (!Array.isArray(workList)) workList = [];

    const piece = workList.find(p => p.g === garment && (p.n === pieceN || String(p.n) === String(pieceN)));
    if (piece) {
      const nowStr = new Date().toISOString();
      if (workerRole === 'cutting') {
        piece.cut_slip = markDone ? 1 : 0;
        piece.cut_date = markDone ? nowStr : null;
      } else {
        piece.sew_slip = markDone ? 1 : 0;
        piece.sew_date = markDone ? nowStr : null;
      }
      o.work = workList;
      o.updated_at = nowStr;
      this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
      SupabaseSync.pushOrders([o]);
      return { status: 'success', piece };
    }
    throw new Error('Piece not found in order work list');
  },

  listAdvances(worker = null) {
    let advances = this.getRaw(this.STORAGE_KEYS.ADVANCES, []);
    if (worker) {
      advances = advances.filter(a => (a.worker || '').toLowerCase() === worker.toLowerCase());
    }
    return advances;
  },

  addAdvance(worker, role, kind, amount, note = '', slipNo = '') {
    const advances = this.getRaw(this.STORAGE_KEYS.ADVANCES, []);
    const newAdv = {
      id: advances.length + 1,
      worker,
      role,
      kind: kind || 'cash',
      amount: parseFloat(amount || 0),
      note,
      slip_no: slipNo,
      date: new Date().toISOString()
    };
    advances.push(newAdv);
    this.setRaw(this.STORAGE_KEYS.ADVANCES, advances);
    return newAdv;
  },

  listSalarySlips(worker = null) {
    let slips = this.getRaw(this.STORAGE_KEYS.SALARY_SLIPS, []);
    if (worker) {
      slips = slips.filter(s => (s.worker || '').toLowerCase() === worker.toLowerCase());
    }
    return slips;
  },

  getSalarySlip(slipNo) {
    const slips = this.getRaw(this.STORAGE_KEYS.SALARY_SLIPS, []);
    return slips.find(s => s.slip_no === slipNo) || null;
  },

  generateSalarySlip(staffId, worker, role, items = [], advanceDeduct = 0, otherDeduct = 0, note = '') {
    const slips = this.getRaw(this.STORAGE_KEYS.SALARY_SLIPS, []);
    const s = this.getSettings();
    const slipCount = parseInt(s.slip_counter || 1, 10);
    const slipNo = `SLIP-${String(slipCount).padStart(4, '0')}`;
    s.slip_counter = slipCount + 1;
    this.setRaw(this.STORAGE_KEYS.SETTINGS, s);

    const gross = items.reduce((sum, it) => sum + (parseFloat(it.rate) || 0), 0);
    const net = Math.max(0, gross - parseFloat(advanceDeduct || 0) - parseFloat(otherDeduct || 0));

    const newSlip = {
      slip_no: slipNo,
      staff_id: staffId,
      worker,
      role,
      items,
      gross,
      advance: parseFloat(advanceDeduct || 0),
      deduction: parseFloat(otherDeduct || 0),
      net,
      note,
      created_at: new Date().toISOString()
    };
    slips.unshift(newSlip);
    this.setRaw(this.STORAGE_KEYS.SALARY_SLIPS, slips);
    return newSlip;
  },

  login(username, password) {
    const users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const u = users.find(user => 
      user.username.toLowerCase() === (username || '').trim().toLowerCase() &&
      String(user.password) === String(password || '').trim() &&
      (user.active === 1 || user.active === true)
    );
    if (!u) {
      throw new Error('Invalid username or password');
    }
    return {
      status: 'success',
      user: {
        id: u.id,
        username: u.username,
        role: u.role || 'employee',
        full_name: u.full_name || u.username,
        staff_name: u.staff_name || '',
        phone: u.phone || ''
      }
    };
  },

  listUsers() {
    return { users: this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS) };
  },

  createUser(data) {
    const users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const newId = (users.reduce((max, u) => Math.max(max, u.id || 0), 0)) + 1;
    const newUser = {
      id: newId,
      username: data.username,
      password: data.password,
      role: data.role || 'employee',
      full_name: data.full_name || data.username,
      staff_name: data.staff_name || '',
      phone: data.phone || '',
      active: 1
    };
    users.push(newUser);
    this.setRaw(this.STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser(id, data) {
    const users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const uId = parseInt(id, 10);
    const idx = users.findIndex(u => u.id === uId);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      this.setRaw(this.STORAGE_KEYS.USERS, users);
      return users[idx];
    }
    throw new Error('User not found');
  },

  deleteUser(id) {
    let users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const uId = parseInt(id, 10);
    users = users.filter(u => u.id !== uId);
    this.setRaw(this.STORAGE_KEYS.USERS, users);
    return { status: 'success' };
  },

  syncSettingsToSupabase(settings) {
    try {
      if (!settings.supabase_url || !settings.supabase_key) return;
      const rows = Object.entries(settings).map(([k, v]) => ({
        key: k,
        value: typeof v === 'object' ? JSON.stringify(v) : String(v),
        updated_at: new Date().toISOString()
      }));
      fetch(`${settings.supabase_url}/rest/v1/app_settings?on_conflict=key`, {
        method: 'POST',
        headers: {
          'apikey': settings.supabase_key,
          'Authorization': `Bearer ${settings.supabase_key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(rows)
      }).catch(e => console.warn('[Supabase Settings Sync]', e));
    } catch(e) {}
  },

  async syncFromSupabaseBackground() {
    try {
      const s = this.getSettings();
      if (!s.supabase_url || !s.supabase_key || !s.supabase_auto_sync) return;
      const res = await SupabaseSync.pullOrders();
      if (res && res.orders && res.orders.length > 0) {
        const local = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
        const localMap = new Map(local.map(o => [o.token, o]));
        res.orders.forEach(rem => {
          if (!localMap.has(rem.token)) {
            local.push(rem);
          }
        });
        this.setRaw(this.STORAGE_KEYS.ORDERS, local);
      }
    } catch(e) {
      console.warn('[Supabase Background Pull]', e);
    }
  },

  // Central Router for Standalone Mode
  handleRequest(method, path, body = null, queryParams = {}) {
    const cleanPath = path.split('?')[0].replace(/\/+$/, '');

    // --- Authentication ---
    if (cleanPath === '/api/auth/login' && method === 'POST') {
      return this.login(body?.username, body?.password);
    }
    if (cleanPath === '/api/auth/logout' && method === 'POST') {
      return { status: 'success' };
    }
    if (cleanPath === '/api/users' && method === 'GET') {
      return this.listUsers();
    }
    if (cleanPath === '/api/users' && method === 'POST') {
      return this.createUser(body);
    }
    if (cleanPath.startsWith('/api/users/') && method === 'PUT') {
      const id = cleanPath.split('/')[3];
      return this.updateUser(id, body);
    }
    if (cleanPath.startsWith('/api/users/') && method === 'DELETE') {
      const id = cleanPath.split('/')[3];
      return this.deleteUser(id);
    }

    // --- Settings & Auth Passwords ---
    if (cleanPath === '/api/settings' && method === 'GET') {
      return this.getSettings();
    }
    if (cleanPath === '/api/settings' && method === 'POST') {
      return this.saveSettings(body);
    }
    if (cleanPath === '/api/settings/verify-password' && method === 'POST') {
      const s = this.getSettings();
      const k = body?.key;
      const p = body?.password;
      const expected = s[k] || s.password || 'admin';
      return { valid: p === expected };
    }

    // --- Orders ---
    if (cleanPath === '/api/orders/next-token' && method === 'GET') {
      return this.getNextToken();
    }
    if (cleanPath === '/api/orders' && method === 'GET') {
      return this.getOrders(queryParams);
    }
    if (cleanPath === '/api/orders' && method === 'POST') {
      return this.createOrder(body);
    }
    if (cleanPath === '/api/orders/bulk-status' && method === 'POST') {
      return this.bulkStatusChange(body?.tokens, body?.status, body?.cutting_master, body?.sewing_tailor);
    }
    if (cleanPath === '/api/orders/delete' && method === 'POST') {
      return this.deleteOrders(body?.tokens, body?.password);
    }
    if (cleanPath.startsWith('/api/orders/') && cleanPath.endsWith('/status') && method === 'POST') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      return this.updateOrderStatus(token, body?.status);
    }
    if (cleanPath.startsWith('/api/orders/') && cleanPath.endsWith('/settle') && method === 'POST') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      return this.settleOrder(token, body?.pay_mode, body?.amount, body?.deliver);
    }
    if (cleanPath.startsWith('/api/orders/') && method === 'GET') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      const o = this.getOrder(token);
      if (!o) throw new Error(`Order ${token} not found`);
      return o;
    }
    if (cleanPath.startsWith('/api/orders/') && method === 'PUT') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      return this.updateOrder(token, body);
    }

    // --- Dashboard & Analytics ---
    if (cleanPath === '/api/dashboard' && method === 'GET') {
      return this.getDashboard(queryParams.period);
    }

    // --- Customers ---
    if (cleanPath === '/api/customers' && method === 'GET') {
      return this.getCustomers(queryParams);
    }
    if (cleanPath.startsWith('/api/customers/') && cleanPath.endsWith('/orders') && method === 'GET') {
      const phone = decodeURIComponent(cleanPath.split('/')[3]);
      return this.getCustomerOrders(phone);
    }

    // --- Staff & Rates ---
    if (cleanPath === '/api/staff' && method === 'GET') {
      return this.getStaff(queryParams.role, queryParams.available_only);
    }
    if (cleanPath === '/api/staff' && method === 'POST') {
      return this.addStaff(body?.name, body?.phone, body?.role);
    }
    if (cleanPath.startsWith('/api/staff/') && cleanPath.endsWith('/rates') && method === 'PUT') {
      const id = cleanPath.split('/')[3];
      return this.setStaffRates(id, body?.rates);
    }
    if (cleanPath.startsWith('/api/staff/') && method === 'PUT') {
      const id = cleanPath.split('/')[3];
      return this.updateStaff(id, body);
    }

    // --- Worker Portal ---
    if (cleanPath === '/api/worker-portal/my-work' && method === 'GET') {
      return this.getWorkerPortalData(queryParams.worker);
    }
    if (cleanPath === '/api/worker-portal/update-piece' && method === 'POST') {
      return this.updateWorkerPiece(body?.token, body?.garment, body?.piece_n, body?.worker_role, body?.mark_done);
    }

    // --- Advances & Salary Slips ---
    if (cleanPath === '/api/advances' && method === 'GET') {
      return this.listAdvances(queryParams.worker);
    }
    if (cleanPath === '/api/advances' && method === 'POST') {
      return this.addAdvance(body?.worker, body?.role, body?.kind, body?.amount, body?.note, body?.slip_no);
    }
    if (cleanPath === '/api/salary-slips' && method === 'GET') {
      return this.listSalarySlips(queryParams.worker);
    }
    if (cleanPath === '/api/salary-slips' && method === 'POST') {
      return this.generateSalarySlip(body?.staff_id, body?.worker, body?.role, body?.items, body?.advance_deduct, body?.other_deduct, body?.note);
    }
    if (cleanPath.startsWith('/api/salary-slips/') && method === 'GET') {
      const slipNo = decodeURIComponent(cleanPath.split('/')[3]);
      return this.getSalarySlip(slipNo);
    }

    // --- Supabase Sync APIs ---
    if (cleanPath === '/api/sync/supabase/test' && method === 'POST') {
      return SupabaseSync.testConnection(body?.url, body?.key);
    }
    if (cleanPath === '/api/sync/supabase/now' && method === 'POST') {
      const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
      return SupabaseSync.pushOrders(orders, body?.url, body?.key);
    }
    if (cleanPath === '/api/sync/supabase/restore' && method === 'POST') {
      return SupabaseSync.restoreOrders(body?.url, body?.key);
    }

    // --- Network Info ---
    if (cleanPath === '/api/network-info') {
      return {
        mode: 'standalone_cloud',
        message: 'Running in Standalone Netlify Cloud mode with Supabase Sync',
        local_ips: ['127.0.0.1'],
        port: 5000,
        tunnel_url: ''
      };
    }

    // Fallback default response
    return { status: 'success', message: 'Handled by Standalone Engine' };
  }
};

// ==========================================================================
// SUPABASE CLIENT-SIDE CLOUD SYNC
// Directly synchronizes orders and settings with PostgreSQL cloud instance
// ==========================================================================
const SupabaseSync = {
  sanitizeOrder(o) {
    let garments = o.garments || '{}';
    if (typeof garments === 'object') garments = JSON.stringify(garments);
    let measurements = o.measurements || '{}';
    if (typeof measurements === 'object') measurements = JSON.stringify(measurements);
    let work = o.work || '[]';
    if (typeof work === 'object') work = JSON.stringify(work);

    return {
      token: String(o.token || ''),
      customer: String(o.customer || ''),
      phone: String(o.phone || ''),
      garments: String(garments || '{}'),
      measurements: String(measurements || '{}'),
      notes: String(o.notes || ''),
      order_date: String(o.order_date || ''),
      delivery_date: String(o.delivery_date || ''),
      status: String(o.status || 'Cutting Pending'),
      urgent: !!o.urgent,
      total: parseFloat(o.total || 0),
      advance: parseFloat(o.advance || 0),
      balance: parseFloat(o.balance || 0),
      pay_mode: String(o.pay_mode || 'Cash'),
      delivered_at: String(o.delivered_at || ''),
      cutting_master: String(o.cutting_master || ''),
      sewing_tailor: String(o.sewing_tailor || ''),
      work: String(work || '[]'),
      updated_at: String(o.updated_at || new Date().toISOString())
    };
  },

  async testConnection(customUrl = null, customKey = null) {
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) {
      return { success: false, message: 'Supabase URL and API Key are required.' };
    }

    try {
      const resp = await fetch(`${url}/rest/v1/orders?select=token&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (resp.ok) {
        return { success: true, message: 'Cloud database connection verified successfully!' };
      }
      return { success: false, message: `Supabase returned HTTP ${resp.status}` };
    } catch(e) {
      return { success: false, message: `Could not connect to Supabase: ${e.message}` };
    }
  },

  async pushOrders(ordersList = [], customUrl = null, customKey = null) {
    if (!ordersList || ordersList.length === 0) return { success: true, count: 0 };
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) return { success: false, message: 'Supabase credentials not configured' };

    const sanitized = ordersList.filter(o => o.token).map(o => this.sanitizeOrder(o));
    if (sanitized.length === 0) return { success: true, count: 0 };

    try {
      // Push in chunks of 40
      const chunkSize = 40;
      for (let i = 0; i < sanitized.length; i += chunkSize) {
        const chunk = sanitized.slice(i, i + chunkSize);
        await fetch(`${url}/rest/v1/orders?on_conflict=token`, {
          method: 'POST',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify(chunk)
        });
      }
      return { success: true, count: sanitized.length, message: `Backed up ${sanitized.length} orders to Supabase!` };
    } catch(e) {
      console.warn('[Supabase Push Error]', e);
      return { success: false, message: e.message };
    }
  },

  async pullOrders(customUrl = null, customKey = null) {
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) return { success: false, orders: [] };

    try {
      const resp = await fetch(`${url}/rest/v1/orders?select=*`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (!resp.ok) return { success: false, orders: [] };
      const orders = await resp.json();
      return { success: true, orders };
    } catch(e) {
      return { success: false, orders: [] };
    }
  },

  async restoreOrders(customUrl = null, customKey = null) {
    const res = await this.pullOrders(customUrl, customKey);
    if (res.success && res.orders) {
      const local = StandaloneEngine.getRaw(StandaloneEngine.STORAGE_KEYS.ORDERS, []);
      const localMap = new Map(local.map(o => [o.token, o]));
      let added = 0;
      res.orders.forEach(rem => {
        if (!localMap.has(rem.token)) {
          local.unshift(rem);
          added++;
        }
      });
      StandaloneEngine.setRaw(StandaloneEngine.STORAGE_KEYS.ORDERS, local);
      return { success: true, count: res.orders.length, message: `Successfully restored ${res.orders.length} orders (${added} new) from Supabase!` };
    }
    return { success: false, message: 'Failed to retrieve orders from Cloud' };
  },

  async deleteOrders(tokens = [], customUrl = null, customKey = null) {
    if (!tokens || tokens.length === 0) return;
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) return;

    try {
      const tokenList = tokens.map(t => `"${encodeURIComponent(t)}"`).join(',');
      await fetch(`${url}/rest/v1/orders?token=in.(${tokenList})`, {
        method: 'DELETE',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
    } catch(e) {
      console.warn('[Supabase Delete Error]', e);
    }
  }
};

// Initialize Standalone Engine defaults
StandaloneEngine.init();

// ==========================================================================
// UNIVERSAL API CLIENT
// Routes seamlessly to Local/Remote Python Server or Standalone Engine
// ==========================================================================
const API = {
  getBaseUrl() {
    const custom = (localStorage.getItem('7art_backend_url') || sessionStorage.getItem('7art_backend_url') || '').trim();
    if (custom) return custom.replace(/\/+$/, '');
    return window.location.origin || '';
  },

  setBackendUrl(url) {
    if (!url || !url.trim()) {
      localStorage.removeItem('7art_backend_url');
      sessionStorage.removeItem('7art_backend_url');
    } else {
      const clean = url.trim().replace(/\/+$/, '');
      localStorage.setItem('7art_backend_url', clean);
      sessionStorage.setItem('7art_backend_url', clean);
    }
  },

  get baseUrl() {
    return this.getBaseUrl();
  },

  async _fetchRequest(method, path, body = null, queryParams = {}) {
    let url;
    const base = this.getBaseUrl();
    try {
      url = new URL(path, base || window.location.origin || window.location.href);
    } catch(e) {
      url = new URL(path, window.location.href || '/');
    }
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const options = {
      method,
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    };

    try {
      const uStr = localStorage.getItem('7art_user') || sessionStorage.getItem('7art_user');
      if (uStr) {
        const uObj = JSON.parse(uStr);
        if (uObj && uObj.role) {
          options.headers['X-Studio-Role'] = uObj.role;
          options.headers['X-Studio-User'] = uObj.username || '';
        }
      }
    } catch (_) {}

    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), options);
      clearTimeout(timeoutId);
      let data = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { error: `Server response error (${response.status})` };
      }

      if (!response.ok) {
        if (response.status === 404 && path.startsWith('/api/')) {
          throw new Error('Backend server endpoint not found (404)');
        }
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  async request(method, path, body = null, queryParams = {}) {
    const customBase = (localStorage.getItem('7art_backend_url') || sessionStorage.getItem('7art_backend_url') || '').trim();

    // Check if running on Netlify or purely static web hosting
    const isStaticHost = !customBase && (
      window.location.hostname.endsWith('netlify.app') ||
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('vercel.app') ||
      window.location.protocol === 'file:'
    );

    // On Netlify, bypass backend fetch roundtrip directly into Standalone Engine for instant 0ms latency
    if (isStaticHost) {
      try {
        return StandaloneEngine.handleRequest(method, path, body, queryParams);
      } catch(e) {
        console.error('[Standalone Engine Error]', e);
        throw e;
      }
    }

    // Try HTTP request to Python backend server
    try {
      return await this._fetchRequest(method, path, body, queryParams);
    } catch (err) {
      // Fallback seamlessly to Standalone Engine if Python server is offline or returns 404
      const is404 = err.message?.includes('404');
      const isOffline = err.name === 'AbortError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');

      if (!customBase && (is404 || isOffline)) {
        console.info(`[API] Serving ${method} ${path} via Standalone Engine (Backend server inactive).`);
        return StandaloneEngine.handleRequest(method, path, body, queryParams);
      }
      throw err;
    }
  },

  getNetworkInfo() {
    return this.request('GET', '/api/network-info');
  },

  fixFirewall() {
    return this.request('POST', '/api/fix-firewall');
  },

  getDashboard(period = 'All orders') {
    return this.request('GET', '/api/dashboard', null, { period });
  },

  getNextToken() {
    return this.request('GET', '/api/orders/next-token');
  },

  listOrders(params = {}) {
    return this.request('GET', '/api/orders', null, params);
  },

  getOrder(token) {
    return this.request('GET', `/api/orders/${encodeURIComponent(token)}`);
  },

  async createOrder(data) {
    const res = await this.request('POST', '/api/orders', data);
    if (window.atelierCache) window.atelierCache.invalidate('customers');
    return res;
  },

  async updateOrder(token, data) {
    const res = await this.request('PUT', `/api/orders/${encodeURIComponent(token)}`, data);
    if (window.atelierCache) window.atelierCache.invalidate('customers');
    return res;
  },

  updateOrderStatus(token, status) {
    return this.request('POST', `/api/orders/${encodeURIComponent(token)}/status`, { status });
  },

  settleOrder(token, payMode = 'Cash', amount = null, deliver = true) {
    return this.request('POST', `/api/orders/${encodeURIComponent(token)}/settle`, { pay_mode: payMode, amount, deliver });
  },

  bulkStatusChange(tokens, status, cuttingMaster = null, sewingTailor = null) {
    return this.request('POST', '/api/orders/bulk-status', {
      tokens,
      status,
      cutting_master: cuttingMaster,
      sewing_tailor: sewingTailor
    });
  },

  deleteOrders(tokens, password) {
    return this.request('POST', '/api/orders/delete', { tokens, password });
  },

  async listCustomers(params = {}, forceRefresh = false) {
    const isDefault = !params.q && (!params.page || params.page === 1);
    const key = isDefault ? `customers_${params.limit || 25}` : null;
    if (key && !forceRefresh && window.atelierCache) {
      const hit = window.atelierCache.get(key);
      if (hit) return hit;
    }
    const res = await this.request('GET', '/api/customers', null, params);
    if (key && window.atelierCache) window.atelierCache.set(key, res);
    return res;
  },

  getCustomerOrders(phone) {
    return this.request('GET', `/api/customers/${encodeURIComponent(phone)}/orders`);
  },

  async listStaff(role = null, availableOnly = false, forceRefresh = false) {
    const key = `staff_${role || 'all'}_${availableOnly ? 'avail' : 'all'}`;
    if (!forceRefresh && window.atelierCache) {
      const hit = window.atelierCache.get(key);
      if (hit) return hit;
    }
    const res = await this.request('GET', '/api/staff', null, { role, available_only: availableOnly });
    if (window.atelierCache) window.atelierCache.set(key, res);
    return res;
  },

  getStaff(id) {
    return this.request('GET', `/api/staff/${id}`);
  },

  async addStaff(name, phone, role) {
    const res = await this.request('POST', '/api/staff', { name, phone, role });
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  async updateStaff(id, data) {
    const res = await this.request('PUT', `/api/staff/${id}`, data);
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  async setStaffRates(id, rates) {
    const res = await this.request('PUT', `/api/staff/${id}/rates`, { rates });
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  getFreePieces(token, role = 'cutting') {
    return this.request('GET', `/api/orders/${encodeURIComponent(token)}/free-pieces`, null, { role });
  },

  async executeBatchEntry(personId, entries) {
    const res = await this.request('POST', '/api/staff/batch-entry', { person_id: personId, entries });
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  listAdvances(worker = null, role = null) {
    return this.request('GET', '/api/advances', null, { worker, role });
  },

  addAdvance(worker, role, kind, amount, note = '', slipNo = '') {
    return this.request('POST', '/api/advances', { worker, role, kind, amount, note, slip_no: slipNo });
  },

  listSalarySlips(worker = null) {
    return this.request('GET', '/api/salary-slips', null, { worker });
  },

  getSalarySlip(slipNo) {
    return this.request('GET', `/api/salary-slips/${encodeURIComponent(slipNo)}`);
  },

  getUnsettledWork(worker, role) {
    return this.request('GET', '/api/salary-slips/unsettled', null, { worker, role });
  },

  generateSalarySlip(staffId, worker, role, items, advanceDeduct = 0, otherDeduct = 0, note = '') {
    return this.request('POST', '/api/salary-slips', {
      staff_id: staffId,
      worker,
      role,
      items,
      advance_deduct: advanceDeduct,
      other_deduct: otherDeduct,
      note
    });
  },

  async getSettings(forceRefresh = false) {
    if (!forceRefresh && window.atelierCache) {
      const hit = window.atelierCache.get('settings');
      if (hit) return hit;
    }
    const res = await this.request('GET', '/api/settings');
    if (window.atelierCache) window.atelierCache.set('settings', res);
    return res;
  },

  async saveSettings(settings) {
    const res = await this.request('POST', '/api/settings', settings);
    if (window.atelierCache) window.atelierCache.invalidate('settings');
    return res;
  },

  verifyPassword(key, password) {
    return this.request('POST', '/api/settings/verify-password', { key, password });
  },

  seedDemo() {
    return this.request('POST', '/api/seed-demo');
  },

  // --- Auth & User Management ---
  login(username, password) {
    return this.request('POST', '/api/auth/login', { username, password });
  },

  logout() {
    return this.request('POST', '/api/auth/logout');
  },

  listUsers() {
    return this.request('GET', '/api/users');
  },

  createUser(data) {
    return this.request('POST', '/api/users', data);
  },

  updateUser(id, data) {
    return this.request('PUT', `/api/users/${id}`, data);
  },

  deleteUser(id, data = null) {
    return this.request('DELETE', `/api/users/${id}`, data);
  },

  // --- Employee / Craftsman Portal ---
  getWorkerPortalData(worker, role = null) {
    return this.request('GET', '/api/worker-portal/my-work', null, { worker, role });
  },

  updateWorkerPiece(token, garment, pieceN, workerRole, markDone = true) {
    return this.request('POST', '/api/worker-portal/update-piece', {
      token,
      garment,
      piece_n: pieceN,
      worker_role: workerRole,
      mark_done: markDone
    });
  },

  testSupabase(url, key) {
    return this.request('POST', '/api/sync/supabase/test', { url, key });
  },

  syncSupabaseNow(url = null, key = null) {
    return this.request('POST', '/api/sync/supabase/now', { url, key });
  },

  restoreFromSupabase(url = null, key = null) {
    return this.request('POST', '/api/sync/supabase/restore', { url, key });
  },

  getOrderPdfUrl(token) {
    return `${this.baseUrl}/api/receipts/orders/${encodeURIComponent(token)}/pdf`;
  },

  getSalarySlipPdfUrl(slipNo) {
    return `${this.baseUrl}/api/receipts/salary-slips/${encodeURIComponent(slipNo)}/pdf`;
  },

  getExcelDownloadUrl() {
    return `${this.baseUrl}/api/export/excel`;
  },

  getBackupDownloadUrl() {
    return `${this.baseUrl}/api/export/backup`;
  }
};

window.API = API;
