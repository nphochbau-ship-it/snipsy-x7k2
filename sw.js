// Offline cache: app shell is cache-first; leaderboard (textdb) always goes to network.
const V = 'pas-mvhrmu1a';
const CORE = ['./', './index.html', './app.js?v=mvhrmu1a', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('pas-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.includes('/classic/') || u.pathname.includes('/v1/')) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: u.pathname.endsWith('/') || u.pathname.endsWith('index.html') }).then(r => r || fetch(e.request).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(e.request, cp)); } return res; }).catch(() => caches.match('./index.html'))));
});
