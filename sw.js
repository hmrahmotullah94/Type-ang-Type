// ===== SERVICE WORKER - Typing Job PWA =====
const CACHE_NAME = 'typing-job-v1';
const ASSETS = [
  '/Typing-jobs-Rahmot/',
  '/Typing-jobs-Rahmot/index.html',
  '/Typing-jobs-Rahmot/style.css',
  '/Typing-jobs-Rahmot/app.js',
  '/Typing-jobs-Rahmot/manifest.json',
  '/Typing-jobs-Rahmot/icon-192.png',
  '/Typing-jobs-Rahmot/icon-512.png',
  '/Typing-jobs-Rahmot/icon-512-maskable.png'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first strategy
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('/Typing-jobs-Rahmot/index.html'));
    })
  );
});
