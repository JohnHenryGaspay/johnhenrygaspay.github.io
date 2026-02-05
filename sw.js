var cacheName = 'SEO-Web-Dev';
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
      // Use addAll but with error handling for failed requests
      return cache.addAll(filesToCache).catch(function(error) {
        console.warn('Service Worker: Some files failed to cache', error);
        // Continue even if some files fail to cache
        return Promise.resolve();
      });
    }).catch(function(error) {
      console.warn('Service Worker: Failed to open cache', error);
      return Promise.resolve();
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).catch(function() {
        // Return a fallback response if fetch fails
        return caches.match('/index.html');
      });
    })
  );
});