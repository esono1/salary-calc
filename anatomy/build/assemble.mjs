import fs from 'node:fs';
// 版本號：台灣時間 年.月.日-時分
const VERSION = process.env.VERSION || new Date(Date.now() + 8 * 3600e3).toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+).*/, '$1.$2.$3-$4$5');
const t = fs.readFileSync('template.html', 'utf8');
const meta = fs.readFileSync('out/meta.json', 'utf8').replace(/</g, '\\u003c');
const GEO_CHUNKS = (() => {
  const b64 = fs.readFileSync('out/body.bin').toString('base64');
  const n = Math.max(1, Math.ceil(b64.length / 160000)), size = Math.ceil(b64.length / n), out = [];
  // 下載進度：資料切成小段，每段到達時更新「正在下載模型… xx%」
  out.push(`<script>window.__parts=[];window.__ld=function(i,n,s){__parts[i]=s;var p=Math.round((i+1)/n*100),t=document.getElementById('ldTxt'),b=document.getElementById('ldBar');if(t)t.textContent='正在下載模型… '+p+'%';if(b)b.style.width=p+'%';};</script>`);
  for (let i = 0; i < n; i++) out.push(`<script>__ld(${i},${n},"${b64.slice(i * size, (i + 1) * size)}")</script>`);
  return `<script>window.__META=${fs.readFileSync('out/meta.json', 'utf8').replace(/</g, '\\u003c')};</script>\n` + out.join('\n');
})();
fs.writeFileSync(process.env.OUTFILE || 'out/muscle-atlas.html', t.replaceAll('__VERSION__', VERSION).replace('__HDURL__', process.env.HDURL || 'app/hd.bin').replace('__DATA__', () => GEO_CHUNKS));
console.log(fs.statSync('out/muscle-atlas.html').size);
