var CACHE_NAME="2023-04-01 11:15",urlsToCache=["/calc-and-type/","/calc-and-type/kohacu.webp","/calc-and-type/index.js","/calc-and-type/mp3/incorrect1.mp3","/calc-and-type/mp3/end.mp3","/calc-and-type/mp3/cat.mp3","/calc-and-type/mp3/correct3.mp3","/calc-and-type/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})