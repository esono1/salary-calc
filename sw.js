// 薪資計算網頁版：幫網頁加上「跨來源隔離」的標頭（GitHub Pages 自己不能設），
// 這樣工作單辨識才能用手機的多個處理器核心。只改標頭，不快取任何東西、也不碰任何資料。
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.mode !== 'navigate') return;              // 只處理網頁本身，其他（假表、辨識元件）照常
  e.respondWith(fetch(req).then(res => {
    if (!res || res.status === 0) return res;
    const h = new Headers(res.headers);
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    h.set('Cross-Origin-Embedder-Policy', 'require-corp');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }));
});
