import fs from 'node:fs';
// 版本號：台灣時間 年.月.日-時分
const VERSION = process.env.VERSION || new Date(Date.now() + 8 * 3600e3).toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+).*/, '$1.$2.$3-$4$5');
const t = fs.readFileSync('template.html', 'utf8');
const meta = fs.readFileSync('out/meta.json', 'utf8').replace(/</g, '\\u003c');
const geo = fs.readFileSync('out/body.bin').toString('base64');
fs.writeFileSync(process.env.OUTFILE || 'out/muscle-atlas.html', t.replaceAll('__VERSION__', VERSION).replace('__HDURL__', process.env.HDURL || 'app/hd.bin').replace('__META__', () => meta).replace('__GEO__', () => geo));
console.log(fs.statSync('out/muscle-atlas.html').size);
