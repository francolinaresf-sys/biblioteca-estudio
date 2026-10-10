/* Service worker: guarda una copia de todo lo que abres para poder
   revisarlo sin conexión. Siempre intenta traer la versión más nueva
   cuando hay red (red primero, caché como respaldo). */
const CACHE = 'biblioteca-v1';
const BASE = ['./', 'index.html', 'ver.html', 'catalogo.json', 'assets/estilos.css', 'assets/app.js', 'assets/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }))
  );
});
