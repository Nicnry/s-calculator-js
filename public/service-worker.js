// public/service-worker.js
const CACHE_NAME = 'offline-cache-v1';
/* const urlsToCache = [
  '/',
  '/users'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(error => {
              console.warn(`Échec de mise en cache de ${url}:`, error);
              return null;
            });
          })
        );
      })
  );
});

urlsToCache.forEach(url => {
  cache.add(url).catch(error => {
    console.error(`Échec de mise en cache pour ${url}:`, error);
  });
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            const url = new URL(event.request.url);
            const pathname = url.pathname;
            
            if (
              urlsToCache.includes(pathname) || 
              pathname.match(/^\/users\/\d+$/) ||
              pathname === '/users/new' ||
              pathname.startsWith('/_next/static/')
            ) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache).catch(err => {
                    console.warn('Erreur lors de la mise en cache:', err);
                  });
                });
            }
              
            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('/')
                .catch(() => new Response('Vous êtes hors ligne et la page demandée n\'est pas en cache.'));
            }
            return new Response('', {status: 408, statusText: 'Offline'});
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
}); */