var cacheName = 'SEO-Web-Dev-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/style1.css',
  '/js/main.js',
  '/js/util.js',
  '/js/main1.js',
  '/js/sendEmail.js',
  '/thank-you.html'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      // Cache files individually instead of using addAll
      // This way, one failed file won't break the entire cache
      var cachePromises = filesToCache.map(function(url) {
        return fetch(url).then(function(response) {
          if (response.ok) {
            return cache.put(url, response);
          }
        }).catch(function(error) {
          console.warn('Service Worker: Failed to cache ' + url, error);
          // Continue even if individual file fails
        });
      });
      
      return Promise.all(cachePromises).then(function() {
        console.log('Service Worker: Caching complete');
      });
    }).catch(function(error) {
      console.warn('Service Worker: Failed to open cache', error);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(e.request).catch(function() {
        // Return a fallback response if fetch fails
        if (e.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});