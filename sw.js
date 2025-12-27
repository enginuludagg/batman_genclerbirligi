
const CACHE_NAME = 'bgb-akademi-v1.2-cache';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  return self.clients.claim();
});

// Dinamik fetch yönetimi (Hata vermemesi için basitleştirildi)
self.addEventListener('fetch', (event) => {
  // Sadece GET isteklerini izle
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
