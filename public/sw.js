const CACHE_NAME = 'flat-white-3d-cache-v1';
const ASSETS_TO_CACHE = [
  '/models/base_coffee_cup_draco.glb',
  '/models/moka_pot_draco.glb',
  '/models/canarian_cafe_-_coffee_machine_draco.glb',
  '/models/coffee_maker_low_poly_draco.glb',
  '/models/catoon_coffe_draco.glb',
  '/models/coffee_cup_with_plate_opt.glb',
  '/models/latte_art_opt.glb',
  '/hero.mp4',
  '/interior.mp4',
  '/reference.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first strategy for 3D models, draco decoders, and videos
  if (
    url.pathname.startsWith('/models/') || 
    url.pathname.startsWith('/draco/') || 
    url.pathname.endsWith('.mp4')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
