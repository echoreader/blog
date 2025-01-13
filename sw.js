const CACHE_NAME = 'blog-cache-v1';
const urlsToCache = ['/']; // URL default yang akan di-cache

// Event: Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Event: Fetch dari cache atau jaringan
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Event: Perbarui cache setiap seminggu sekali
const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 1 minggu dalam milidetik

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Hapus cache lama
          }
        })
      );
    })
  );

  // Perbarui cache setiap seminggu
  setInterval(() => {
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urlsToCache);
    });
  }, UPDATE_INTERVAL);
});