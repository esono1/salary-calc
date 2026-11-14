// Build muscle geometry + layer/coverage data for the viewer.
import fs from 'node:fs';
import zlib from 'node:zlib';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { manifest, decodeChunk, R } from './decode.mjs';
import { ZH, REGIONS, REGION_ORDER } from './zh.mjs';

const QUALITY = process.env.Q || 'economy';
const OUT = process.env.OUT || 'out';
fs.mkdirSync(OUT, { recursive: true });
const en = JSON.parse(fs.readFileSync(R + '/names/en.json', 'utf8')).entries;
const la = JSON.parse(fs.readFileSync(R + '/names/la.json', 'utf8')).entries;
const S = new Map(manifest.structures.map(s => [s.id, s]));
const matKind = manifest.materials.map(m => m.kind);

function ancestors(s) { const r = []; while (s.parent) { s = S.get(s.parent); r.push(s.id); } return r; }

// ---- decode all needed chunks
const meshes = new Map();
async function loadSystem(sys, q) {
  for (const ch of manifest.chunks.filter(c => c.system === sys)) {
    const m = await decodeChunk(ch, q);
    for (const [k, v] of m) meshes.set(k, v);
  }
}
await loadSystem('muscular', QUALITY);
await loadSystem('skeletal', 'economy');
await loadSystem('regions', 'economy');

function weld(g, flagFn) {
  const map = new Map(), pos = [], flag = [], idx = new Uint32Array(g.idx.length);
  const remap = new Uint32Array(g.pos.length / 3);
  for (let v = 0; v < remap.length; v++) {
    const x = g.pos[v * 3], y = g.pos[v * 3 + 1], z = g.pos[v * 3 + 2];
    const key = Math.round(x * 20000) + ',' + Math.round(y * 20000) + ',' + Math.round(z * 20000);
    let r = map.get(key);
    if (r === undefined) { r = pos.length / 3; map.set(key, r); pos.push(x, y, z); flag.push(0); }
    if (flagFn && flagFn(g.mat[v])) flag[r] = 1;
    remap[v] = r;
  }
  const out = [];
  for (let k = 0; k < g.idx.length; k += 3) {
    const a = remap[g.idx[k]], b = remap[g.idx[k + 1]], c = remap[g.idx[k + 2]];
    if (a !== b && b !== c && a !== c) out.push(a, b, c);
  }
  return { pos: new Float32Array(pos), idx: new Uint32Array(out), flag: new Uint8Array(flag) };
}

// ---- muscles
const exclude = /fasciae|bursae|tendon_sheaths/;
const isTendon = m => ['tendon', 'ligament', 'fascia', 'cartilage'].includes(matKind[m]);
const M = [];
for (const s of manifest.structures) {
  if (s.system !== 'muscular' || s.kind !== 'structure' || !s.meshes) continue;
  const anc = ancestors(s);
  if (anc.some(a => exclude.test(a))) continue;
  const parts = s.meshes.map(i => meshes.get(i)).filter(Boolean);
  if (!parts.length) { console.warn('no mesh', s.id); continue; }
  const g = weld(parts[0], isTendon);
  if (g.pos.length / 3 > 65535) throw new Error('too many verts ' + s.id);
  const name = en[s.id]?.name || s.id;
  const zh = ZH[name];
  if (!zh) console.warn('no zh for', name);
  const path = [s.id, ...anc].join(' ');
  const region = (REGIONS.find(([re]) => re.test(path)) || [0, '其他'])[1];
  const tendonShare = g.flag.reduce((a, b) => a + b, 0) / g.flag.length;
  M.push({ id: s.id, en: name.replace(/^\((.*)\)$/, '$1'), la: la[s.id]?.name || '', zh: zh || name, side: s.side === 'left' ? 'L' : s.side === 'right' ? 'R' : '', region, g, allTendon: tendonShare > 0.95 });
}
// --- source fix: Z-Anatomy labels the upper and lower trapezius the other way round; swap by height
for (const side of ['L', 'R']) {
  const f = k => M.find(m => m.side === side && m.en.startsWith(k));
  const asc = f('Ascending part of trapezius'), desc = f('Descending part of trapezius');
  const maxY = m => { let y = -9; for (let i = 1; i < m.g.pos.length; i += 3) y = Math.max(y, m.g.pos[i]); return y; };
  if (asc && desc && maxY(asc) > maxY(desc)) { for (const k of ['en', 'la', 'zh']) [asc[k], desc[k]] = [desc[k], asc[k]]; asc.fixed = desc.fixed = 1; console.log('swapped trapezius', side); }
}
// --- the obliques' aponeuroses (rectus sheath) are part of their meshes; they cover rectus abdominis as a sheath, not as muscle
const IGN = new Map();
{
  const ab = /^(External abdominal oblique|Internal abdominal oblique|Transversus abdominis)/;
  M.forEach((m, mi) => { if (/^(Rectus abdominis|Pyramidalis)/.test(m.en)) IGN.set(mi, new Set(M.map((o, oi) => ab.test(o.en) ? oi : -1).filter(x => x >= 0))); });
}
console.log('muscles', M.length, 'tris', M.reduce((a, m) => a + m.g.idx.length / 3, 0), 'verts', M.reduce((a, m) => a + m.g.pos.length / 3, 0));

// ---- skin + skeleton merged
function merge(list) {
  let nv = 0, ni = 0; for (const g of list) { nv += g.pos.length; ni += g.idx.length; }
  const pos = new Float32Array(nv), idx = new Uint32Array(ni); let pv = 0, pi = 0;
  for (const g of list) { pos.set(g.pos, pv); for (let k = 0; k < g.idx.length; k++) idx[pi + k] = g.idx[k] + pv / 3; pv += g.pos.length; pi += g.idx.length; }
  return { pos, idx };
}
const skinParts = [], boneParts = [];
for (const s of manifest.structures) {
  if (!s.meshes) continue;
  for (const i of s.meshes) {
    const g = meshes.get(i); if (!g) continue;
    if (s.system === 'regions') {
      const kinds = {}; for (const m of g.mat) kinds[matKind[m]] = (kinds[matKind[m]] || 0) + 1;
      const top = Object.entries(kinds).sort((a, b) => b[1] - a[1])[0][0];
      if (top === 'skin') skinParts.push(g);
    } else if (s.system === 'skeletal') boneParts.push(g);
  }
}
const skin = merge(skinParts);
const bone = weld({ ...merge(boneParts), mat: [] });
console.log('skin tris', skin.idx.length / 3, 'bone tris', bone.idx.length / 3, 'bone verts', bone.pos.length / 3);

function bvhOf(g) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(g.pos, 3));
  geo.setIndex(new THREE.BufferAttribute(g.idx.slice(), 1));
  return { bvh: new MeshBVH(geo), geo };
}
const skinB = bvhOf(skin);
// merged muscles with vertex -> muscle map
const allM = merge(M.map(m => m.g));
const vOwner = new Uint16Array(allM.pos.length / 3);
{ let o = 0; M.forEach((m, i) => { const n = m.g.pos.length / 3; vOwner.fill(i, o, o + n); o += n; }); }
const musB = bvhOf(allM);
const boneB = bvhOf(bone);
const vFlag = new Uint8Array(allM.pos.length / 3);
{ let o = 0; M.forEach(m => { vFlag.set(m.g.flag, o); o += m.g.flag.length; }); }
const musIdx = musB.geo.index.array;

// ---- sampling + rays
let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), p = new THREE.Vector3(), d = new THREE.Vector3();
const ray = new THREE.Ray(); const tgt = {};
const samples = []; // per muscle: array of Uint16Array (coverers, nearest first)
const t0 = Date.now();
M.forEach((m, mi) => {
  const g = m.g, nt = g.idx.length / 3;
  const cum = new Float64Array(nt); let area = 0;
  for (let t = 0; t < nt; t++) {
    a.fromArray(g.pos, g.idx[t * 3] * 3); b.fromArray(g.pos, g.idx[t * 3 + 1] * 3); c.fromArray(g.pos, g.idx[t * 3 + 2] * 3);
    const tend = g.flag[g.idx[t * 3]] && g.flag[g.idx[t * 3 + 1]] && g.flag[g.idx[t * 3 + 2]];
    if (!tend || m.allTendon) area += b.sub(a).cross(c.sub(a)).length() / 2;
    cum[t] = area;
  }
  m.area = area;
  const N = Math.max(150, Math.min(900, Math.round(area * 1e4 * 2.5)));
  const list = [], blocked = [];
  const out = new THREE.Vector3();
  for (let k = 0; k < N; k++) {
    const r = rnd() * area; let lo = 0, hi = nt - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] <= r) lo = mid + 1; else hi = mid; }
    a.fromArray(g.pos, g.idx[lo * 3] * 3); b.fromArray(g.pos, g.idx[lo * 3 + 1] * 3); c.fromArray(g.pos, g.idx[lo * 3 + 2] * 3);
    let u = rnd(), v = rnd(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    p.copy(a).addScaledVector(b.sub(a), u).addScaledVector(c.sub(a), v);
    skinB.bvh.closestPointToPoint(p, tgt);
    d.copy(tgt.point).sub(p); const dist = d.length();
    if (dist < 1e-6) { list.push(new Uint16Array(0)); blocked.push(0); continue; }
    d.multiplyScalar(1 / dist);
    out.add(d);
    ray.origin.copy(p); ray.direction.copy(d);
    const bh = boneB.bvh.raycastFirst(ray, THREE.DoubleSide);
    if (bh && bh.distance < dist) { blocked.push(1); } else blocked.push(0);
    const hits = musB.bvh.raycast(ray, THREE.DoubleSide);
    const near = new Map();
    for (const h of hits) {
      if (h.distance > dist + 0.003) continue;
      const i0 = musIdx[h.faceIndex * 3], i1 = musIdx[h.faceIndex * 3 + 1], i2 = musIdx[h.faceIndex * 3 + 2];
      const o = vOwner[i0];
      if (o === mi || IGN.get(mi)?.has(o)) continue;
      if (vFlag[i0] && vFlag[i1] && vFlag[i2] && !M[o].allTendon) continue; // aponeurosis / tendon does not count as cover
      if (!near.has(o) || near.get(o) > h.distance) near.set(o, h.distance);
    }
    list.push(Uint16Array.from([...near.entries()].sort((x, y) => x[1] - y[1]).map(x => x[0])));
  }
  let keep = list.filter((_, k) => !blocked[k]);
  m.out = out.normalize().toArray().map(v => +v.toFixed(3));
  m.boneBlocked = 1 - keep.length / list.length;
  if (keep.length < 25) keep = list;
  samples.push(keep);
});
console.log('rays done', ((Date.now() - t0) / 1000).toFixed(1) + 's');

// ---- coverage matrix
M.forEach((m, mi) => {
  const any = new Map(), direct = new Map(); const n = samples[mi].length; let exposed = 0;
  for (const s of samples[mi]) {
    if (!s.length) { exposed++; continue; }
    direct.set(s[0], (direct.get(s[0]) || 0) + 1);
    for (const o of s) any.set(o, (any.get(o) || 0) + 1);
  }
  m.exposed = exposed / n;
  m.coveredBy = [...any.entries()].map(([o, k]) => [o, k / n, (direct.get(o) || 0) / n]).filter(x => x[1] >= 0.05).sort((x, y) => y[1] - x[1]);
});

// ---- peel layers
const layer = new Int32Array(M.length).fill(0);
let remaining = M.length, L = 0;
const TAU = 0.5;
while (remaining > 0) {
  L++;
  const exp = M.map((m, mi) => {
    if (layer[mi]) return -1;
    let e = 0; for (const s of samples[mi]) { let cov = false; for (const o of s) if (!layer[o]) { cov = true; break; } if (!cov) e++; }
    return e / samples[mi].length;
  });
  const mx = Math.max(...exp);
  const thr = Math.min(TAU, mx * 0.9);
  exp.forEach((e, mi) => { if (e >= thr && e >= 0) { layer[mi] = L; remaining--; } });
}
// symmetric pairs share the shallower layer
const byKey = new Map();
M.forEach((m, mi) => { const k = m.en; if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(mi); });
for (const arr of byKey.values()) { const mn = Math.min(...arr.map(i => layer[i])); arr.forEach(i => layer[i] = mn); }
M.forEach((m, mi) => m.layer = layer[mi]);
const hist = {}; M.forEach(m => hist[m.layer] = (hist[m.layer] || 0) + 1);
console.log('layers', hist);

// ---- write binary
const bb = new THREE.Box3();
for (let i = 0; i < allM.pos.length; i += 3) bb.expandByPoint(p.fromArray(allM.pos, i));
for (let i = 0; i < bone.pos.length; i += 3) bb.expandByPoint(p.fromArray(bone.pos, i));
const min = bb.min.toArray(), size = bb.getSize(new THREE.Vector3()).toArray();
const q = (pos) => { const o = new Uint16Array(pos.length); for (let i = 0; i < pos.length; i++) o[i] = Math.round((pos[i] - min[i % 3]) / size[i % 3] * 65535); return o; };
const chunks = []; let off = 0;
const push = (ta) => { const buf = Buffer.from(ta.buffer, ta.byteOffset, ta.byteLength); const o = off; chunks.push(buf); off += buf.length; if (off % 4) { const pad = 4 - off % 4; chunks.push(Buffer.alloc(pad)); off += pad; } return o; };
const meta = {
  min, size, regions: REGION_ORDER,
  attribution: 'Z-Anatomy (CC BY-SA 4.0), based on BodyParts3D © DBCLS; glTF conversion by Svitylo 3D Anatomy Atlas data 1.2.0',
  muscles: M.map(m => ({
    id: m.id.replace('muscular.', ''), zh: m.zh, en: m.en, la: m.la, side: m.side, region: REGION_ORDER.indexOf(m.region), layer: m.layer,
    exposed: Math.round(m.exposed * 100), o: m.out, fx: m.fixed || 0, sheath: IGN.has(M.indexOf(m)) ? 1 : 0, tendon: m.allTendon ? 1 : 0,
    cb: m.coveredBy.map(x => [x[0], Math.round(x[1] * 100), Math.round(x[2] * 100)]),
    nv: m.g.pos.length / 3, ni: m.g.idx.length,
    p: push(q(m.g.pos)), i: push(Uint16Array.from(m.g.idx)), f: push(m.g.flag),
  })),
};
meta.bone = { nv: bone.pos.length / 3, ni: bone.idx.length, p: push(q(bone.pos)), i: push(bone.idx) };
const bin = Buffer.concat(chunks);
fs.writeFileSync(OUT + '/body.bin', zlib.gzipSync(bin, { level: 9 }));
fs.writeFileSync(OUT + '/meta.json', JSON.stringify(meta));
console.log('bin', bin.length, 'gz', fs.statSync(OUT + '/body.bin').size, 'meta', fs.statSync(OUT + '/meta.json').size);

// ---- sanity report
const find = (z, side = 'R') => M.findIndex(m => m.zh.startsWith(z) && m.side === side);
for (const z of ['胸大肌（胸肋頭）', '胸小肌', '斜方肌（中部', '大菱形肌', '背闊肌', '臀大肌', '臀中肌', '臀小肌', '梨狀肌', '股直肌', '股中間肌', '肱二頭肌（長頭）', '肱肌', '腹直肌', '腹外斜肌', '腹內斜肌', '腹橫肌', '腓腸肌（內側頭）', '比目魚肌', '脛後肌', '棘上肌', '肩胛下肌', '腰大肌', '胸最長肌', '腰多裂肌', '三角肌（中束']) {
  const i = find(z); if (i < 0) { console.log('??', z); continue; }
  const m = M[i];
  console.log(`L${m.layer} ${m.zh} 外露${Math.round(m.exposed * 100)}% ← ` + m.coveredBy.slice(0, 5).map(x => `${M[x[0]].zh}${M[x[0]].side}${Math.round(x[1] * 100)}%`).join('、'));
}
