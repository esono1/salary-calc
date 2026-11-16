// Offline / installable build: three.js inlined, no web fonts, PWA hooks.
import fs from 'node:fs';
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
const geo = fs.readFileSync('out/body.bin').toString('base64');
t = t.replace('__HDURL__', 'hd.bin').replace('__META__', () => meta).replace('__GEO__', () => geo);
t += `
<script>
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
</script>
</body>
</html>
`;
fs.writeFileSync(OUT + '/index.html', t);
console.log('index.html', fs.statSync(OUT + '/index.html').size);
