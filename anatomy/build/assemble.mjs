import fs from 'node:fs';
const t = fs.readFileSync('template.html', 'utf8');
const meta = fs.readFileSync('out/meta.json', 'utf8').replace(/</g, '\\u003c');
const geo = fs.readFileSync('out/body.bin').toString('base64');
fs.writeFileSync('out/muscle-atlas.html', t.replace('__META__', () => meta).replace('__GEO__', () => geo));
console.log(fs.statSync('out/muscle-atlas.html').size);
