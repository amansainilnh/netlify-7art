const CACHE_NAME = '7art-studio-v8-network-first';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/studio.bundle.js',
  '/icons/icon.svg',
  '/manifest.json'
];

// Pre-cache core shell for zero-delay startup and offline capability
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Purge obsolete caches on new version activation
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First Strategy with Cache Fallback for instant updates & offline reliability
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 1. Never cache live dynamic APIs (orders, tokens, auth must be live)
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 2. Navigation / HTML Document requests: Network-First with Cache Fallback
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then((netResp) => {
          if (netResp && netResp.status === 200) {
            const clone = netResp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          }
          return netResp;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Static Assets (.js, .css, .svg, icons, fonts): Network-First with Cache Fallback
  e.respondWith(
    fetch(e.request)
      .then((netResp) => {
        if (netResp && netResp.status === 200) {
          const clone = netResp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return netResp;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
