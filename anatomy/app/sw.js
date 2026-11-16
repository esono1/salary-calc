// 肌肉圖譜的離線快取
// - 網頁外殼：有網路時先向網站確認新版，拿不到才用手機裡的版本
// - 模型資料 d/*.js：檔名帶內容雜湊，內容不會變，下載過一次就直接用手機裡的（打開更快）
const CACHE = 'muscle-atlas-v4';
const FILES = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-180.png', 'icon-maskable-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  const url = new URL(req.url);
  if (/\/d\/[0-9a-f]+-[\w]+\.js$/.test(url.pathname) || /hd\.bin$/.test(url.pathname)) {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
  const net = req.mode === 'navigate'
    ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'follow' })
    : fetch(req, { cache: url.pathname.endsWith('version.json') ? 'no-store' : 'no-cache' });
  e.respondWith(
    net.then(res => {
      if (res.ok && !url.pathname.endsWith('version.json')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./')).then(r => r || fetch(req)))
  );
});
