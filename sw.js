
const CACHE_NAME = 'bgb-v1.2-cache';

// Service worker kurulumu
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Aktivasyon ve eski cache temizliği
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Network-first stratejisi (Daha güvenli)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
