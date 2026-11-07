/* Service worker Lembur Neraca
   Menyimpan "kulit" aplikasi (halaman pembuka + ikon) agar aplikasi cepat terbuka.
   Data lembur TIDAK disimpan di sini — selalu diambil langsung dari Spreadsheet. */
const VERSI = "lembur-v1";
const FILE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "ikon/ikon-192.png",
  "ikon/ikon-512.png",
  "ikon/favicon-32.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(FILE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((k) => Promise.all(k.filter((n) => n !== VERSI).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // Google tidak disentuh
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const salin = r.clone();
        caches.open(VERSI).then((c) => c.put(e.request, salin));
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
