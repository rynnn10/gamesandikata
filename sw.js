// GANTI VERSION INI SETIAP KALI UPDATE KODE (Misal: v3, v4, dst)
const CACHE_NAME = 'sandikata-v3-autoicon'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  // Kita cache link icon otomatisnya juga:
  'https://ui-avatars.com/api/?name=SK&background=86efac&color=d946ef&size=192&rounded=true&bold=true&length=2',
  'https://ui-avatars.com/api/?name=SK&background=86efac&color=d946ef&size=512&rounded=true&bold=true&length=2'
];

// 1. Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets & icons');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate & Bersihkan Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Hapus cache lama:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. Fetch (Cache First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
