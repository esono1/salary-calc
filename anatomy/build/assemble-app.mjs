// Offline / installable build: three.js inlined, no web fonts, PWA hooks.
import fs from 'node:fs';
// 版本號：台灣時間 年.月.日-時分
const VERSION = process.env.VERSION || new Date(Date.now() + 8 * 3600e3).toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+).*/, '$1.$2.$3-$4$5');
const OUT = process.argv[2] || 'app';
fs.mkdirSync(OUT, { recursive: true });
let t = fs.readFileSync('template.html', 'utf8');
const three = fs.readFileSync('t147/node_modules/three/build/three.min.js', 'utf8');
const orbit = fs.readFileSync('t147/node_modules/three/examples/js/controls/OrbitControls.js', 'utf8');
const rep = (a, b) => { if (!t.includes(a)) throw new Error('missing: ' + a.slice(0, 60)); t = t.replace(a, () => b); };
rep('<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>', '<script>' + three.replace(/<\/script/gi, '<\\/script') + '</script>');
rep('<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"></script>', '<script>' + orbit + '</script>');
t = t.replace(/<link rel="preconnect"[^>]*>\n/, '').replace(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>\n/, '');
rep('<meta name="claude:viewport-fit-sides" content="cover">\n', '');
rep('<title>', `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#9c2f3c">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="肌肉圖譜">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-180.png">
<style>html,body{margin:0}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
<title>`);
rep('<div class="app">', '</head>\n<body>\n<div class="app">');
const meta = fs.readFileSync('out/meta.json', 'utf8').replace(/</g, '\\u003c');
// 模型資料另存成小檔案（檔名帶內容雜湊，可長期快取），網頁外殼載入後再依序下載並顯示進度
import crypto from 'node:crypto';
const GEO_CHUNKS = (() => {
  const metaTxt = fs.readFileSync('out/meta.json', 'utf8').replace(/</g, '\\u003c');
  const b64 = fs.readFileSync('out/body.bin').toString('base64');
  const hash = crypto.createHash('sha256').update(metaTxt).update(b64).digest('hex').slice(0, 10);
  const dir = OUT + '/d';
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const metaFile = `d/${hash}-meta.js`;
  fs.writeFileSync(OUT + '/' + metaFile, `window.__META=${metaTxt};\n`);
  const n = Math.max(1, Math.ceil(b64.length / 400000)), size = Math.ceil(b64.length / n), files = [];
  for (let i = 0; i < n; i++) { const f = `d/${hash}-${i}.js`; fs.writeFileSync(OUT + '/' + f, `__ld(${i},"${b64.slice(i * size, (i + 1) * size)}");\n`); files.push(f); }
  return `<script>
(function () {
  var files = ${JSON.stringify(files)}, done = 0, total = files.length + 1;
  window.__parts = [];
  function prog() { var p = Math.round(done / total * 100), t = document.getElementById('ldTxt'), b = document.getElementById('ldBar'); if (t) t.textContent = '正在下載模型… ' + p + '%'; if (b) b.style.width = p + '%'; }
  window.__ld = function (i, s) { window.__parts[i] = s; };
  function load(src) { return new Promise(function (ok, bad) { var s = document.createElement('script'); s.src = src; s.onload = function () { done++; prog(); ok(); }; s.onerror = function () { bad(new Error('無法載入 ' + src)); }; document.head.appendChild(s); }); }
  window.__dataReady = (async function () {
    await load(${JSON.stringify(metaFile)});
    for (var k = 0; k < files.length; k += 4) await Promise.all(files.slice(k, k + 4).map(load));
    // 刪掉快取裡舊版本的模型資料，避免手機空間越用越多
    try {
      var keep = files.concat([${JSON.stringify(metaFile)}]);
      caches.keys().then(function (ks) { ks.forEach(function (n) { caches.open(n).then(function (c) { c.keys().then(function (rs) { rs.forEach(function (r) { var k = r.url.indexOf('/d/'); if (k < 0) return; var f = r.url.slice(k + 1).split('?')[0]; if (keep.indexOf(f) < 0) c.delete(r); }); }); }); }); });
    } catch (e) {}
  })();
})();
</script>`;
})();
t = t.replaceAll('__VERSION__', VERSION).replace('__HDURL__', 'hd.bin').replace('__DATA__', () => GEO_CHUNKS);
t += `
<script>
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
</script>
</body>
</html>
`;
fs.writeFileSync(OUT + '/index.html', t);
fs.writeFileSync(OUT + '/version.json', JSON.stringify({ v: VERSION }) + '\n');
console.log('index.html', fs.statSync(OUT + '/index.html').size, 'version', VERSION, 'data files', fs.readdirSync(OUT + '/d').length);

// 安全檢查：網頁裡每一段程式都要能被解析，有語法錯誤就中止（避免發布壞掉的網頁）
{
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const html = fs.readFileSync(OUT + '/index.html', 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, src] of scripts.entries()) {
    try { new AsyncFunction(src); } catch (e) { console.error(`第 ${i + 1} 段程式有語法錯誤：${e.message}`); process.exit(1); }
  }
  for (const f of fs.readdirSync(OUT + '/d')) {
    try { new Function(fs.readFileSync(OUT + '/d/' + f, 'utf8')); } catch (e) { console.error(`${f} 有語法錯誤：${e.message}`); process.exit(1); }
  }
  console.log('語法檢查通過：', scripts.length, '段程式、', fs.readdirSync(OUT + '/d').length, '個資料檔');
}
