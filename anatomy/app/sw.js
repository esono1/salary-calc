// 肌肉圖譜的離線快取：有網路時一律先向網站拿最新版，拿不到才用存在手機裡的版本。
const CACHE = 'muscle-atlas-v3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-180.png', 'icon-maskable-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  // 網頁本身用網址重新抓，確保每次都向伺服器確認有沒有新版
  const net = req.mode === 'navigate'
    ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'follow' })
    : fetch(req, { cache: req.url.includes('version.json') ? 'no-store' : 'no-cache' });
  e.respondWith(
    net.then(res => {
      if (res.ok && !req.url.includes('version.json')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./')).then(r => r || fetch(req)))
  );
});
