const CACHE_NAME = 'sandikata-v2'; // GANTI INI KE 'v2', 'v3', dst setiap kali update kode!
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
];

// 1. Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Paksa SW baru untuk segera aktif
  self.skipWaiting();
});

// 2. Activate & Hapus Cache Lama (Penting untuk Update Otomatis)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Menghapus cache lama:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // Biarkan SW baru mengontrol semua klien yang terbuka
  return self.clients.claim();
});

// 3. Fetch (Strategi: Cache First, lalu Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Jika ada di cache, pakai cache. Jika tidak, ambil dari internet.
      return cachedResponse || fetch(event.request);
    })
  );
});
