const CACHE_NAME = 'HOSTAI'; // Increment this version number whenever you update your app files
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  'HOSTAI.PNG'
];

// Install stage: Force the new service worker to take over immediately without waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate stage: Clean up and delete any old versions of the cache automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch stage: Serve from cache but look for fresh network updates in the background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
    
