// GANTI VERSION INI SETIAP KALI UPDATE (Misal: v4, v5, dst)
const CACHE_NAME = 'sandikata-v4-local-icon'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './ico192.png',  // DAFTARKAN ICON 192 DI SINI
  './ico512.png',  // DAFTARKAN ICON 512 DI SINI
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
];

// 1. Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets & new icons');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate & Hapus Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Clear old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
