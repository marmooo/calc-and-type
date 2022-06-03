var CACHE_NAME = "2022-06-03 10:30";
var urlsToCache = [
  "/calc-and-type/",
  "/calc-and-type/kohacu.webp",
  "/calc-and-type/index.js",
  "/calc-and-type/mp3/incorrect1.mp3",
  "/calc-and-type/mp3/end.mp3",
  "/calc-and-type/mp3/cat.mp3",
  "/calc-and-type/mp3/correct3.mp3",
  "/calc-and-type/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
