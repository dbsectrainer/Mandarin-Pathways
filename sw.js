const CACHE_VERSION = '2';
const CACHE_NAME = `mandarin-pathways-v${CACHE_VERSION}`;

// Cache groups for different types of resources
const STATIC_CACHE = `static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${CACHE_VERSION}`;
const FONT_CACHE = `fonts-v${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './',
  'index.html',
  'day.html',
  'reading.html',
  'writing.html',
  'supplementary.html',
  'manifest.json',
  'css/styles.min.css',
  'css/video-player.css',
  'css/native-speaker.css',
  'css/reading.css',
  'css/writing.css',
  'js/script.min.js',
  'js/video-loader.js',
  'js/video-loader-supplementary.js',
  'js/character-drawing.js',
  'js/notifications.js',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png'
];

// External fonts and styles are handled separately to avoid CORS issues
const FONT_ASSETS = [];

// Compression and caching headers
const COMPRESSION_HEADERS = new Headers({
  'Content-Encoding': 'gzip, br',
  'Cache-Control': 'public, max-age=31536000',
  'Vary': 'Accept-Encoding'
});

// Headers for HTML files to enable bfcache
const HTML_HEADERS = new Headers({
  'Cache-Control': 'no-cache',
  'Vary': 'Accept-Encoding'
});

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache fonts separately
      caches.open(FONT_CACHE).then((cache) => {
        return cache.addAll(FONT_ASSETS);
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version
          if (!cacheName.endsWith(CACHE_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement stale-while-revalidate strategy with compression
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // HTML files - Network first with bfcache support
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request.url, {
        headers: HTML_HEADERS
      })
      .then(response => {
        // Clone the response before caching
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // CSS and JS - Network first with compression and caching
  if (event.request.destination === 'style' || event.request.destination === 'script') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request, {
          headers: COMPRESSION_HEADERS
        }).then(response => {
          // Clone and cache the new response
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
        
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Images - Cache first then network
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Audio and text files - Cache first, then network
  if (
    event.request.url.includes('/audio_files/') ||
    event.request.url.includes('/text_files/') ||
    event.request.url.includes('/reading_files/') ||
    event.request.url.includes('/writing_files/')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request)
          .then((response) => {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
            return response;
          })
        )
    );
    return;
  }

  // Default fetch behavior
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Mandarin Pathways', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'start') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'settings') {
    // Notify clients to open settings
    event.waitUntil(
      clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'notificationClick',
            action: 'settings'
          });
        });
      })
    );
  } else {
    // Default action when clicking the notification body
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for pending actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(
      // Sync progress data when online
      syncProgress()
    );
  }
});

// Helper function to sync progress
async function syncProgress() {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    // Notify client to sync progress
    client.postMessage({
      type: 'sync-complete'
    });
  });
}
