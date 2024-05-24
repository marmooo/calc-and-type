const CACHE_NAME = "2024-05-24 09:50";
const urlsToCache = [
  "/calc-and-type/",
  "/calc-and-type/kohacu.webp",
  "/calc-and-type/index.js",
  "/calc-and-type/mp3/incorrect1.mp3",
  "/calc-and-type/mp3/end.mp3",
  "/calc-and-type/mp3/cat.mp3",
  "/calc-and-type/mp3/correct3.mp3",
  "/calc-and-type/favicon/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
