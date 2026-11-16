// Automatic rig: joint pivots from bone geometry, rigid bone segments, smooth muscle skin weights.
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

// Segment hierarchy. Bones without rest rotation: local axes = world axes (Y up, +Z front, +X = body's left).
export const SEGMENTS = [
  ['pelvis', null], ['lumbar', 'pelvis'], ['thorax', 'lumbar'], ['neck', 'thorax'], ['head', 'neck'], ['jaw', 'head'],
  ...['L', 'R'].flatMap(s => [
    ['scap_' + s, 'thorax'], ['arm_' + s, 'scap_' + s], ['forearm_' + s, 'arm_' + s], ['hand_' + s, 'forearm_' + s],
    ['fingers_' + s, 'hand_' + s], ['thumb_' + s, 'hand_' + s],
    ['thigh_' + s, 'pelvis'], ['leg_' + s, 'thigh_' + s], ['foot_' + s, 'leg_' + s], ['toes_' + s, 'foot_' + s],
  ]),
];
const SEG_INDEX = new Map(SEGMENTS.map((s, i) => [s[0], i]));

export function segmentOf(name, side) {
  const S = side === 'left' ? '_L' : side === 'right' ? '_R' : '';
  const n = name;
  const sided = base => base + (S || '_R');
  if (/Humerus/.test(n)) return sided('arm');
  if (/^(Radius|Ulna)$/.test(n)) return sided('forearm');
  if (/phalanx of first finger of hand|First metacarpal/.test(n)) return sided('thumb');
  if (/phalanx of .* of hand/.test(n)) return sided('fingers');
  if (/metacarpal|Capitate|Hamate|Lunate|Pisiform|Scaphoid|Trapezium|Trapezoid|Triquetrum/.test(n)) return sided('hand');
  if (/^(Clavicle|Scapula)$/.test(n)) return sided('scap');
  if (/^Femur$/.test(n)) return sided('thigh');
  if (/^(Tibia|Fibula|Patella)$/.test(n)) return sided('leg');
  if (/phalanx of .* of foot/.test(n)) return sided('toes');
  if (/metatarsal|Calcaneus|Cuboid|cuneiform|Navicular|Talus|Sesamoid bones of foot/.test(n)) return sided('foot');
  if (/^(Hip bone|Sacrum|Coccyx)$/.test(n)) return 'pelvis';
  if (/^Vertebra L/.test(n)) return 'lumbar';
  if (/^Vertebra T|rib|Costal cartilage|sternum|Xiphoid/i.test(n)) return 'thorax';
  if (/Atlas|Axis \(C2\)|^Vertebra C|Hyoid|Arytenoid|Corniculate|Cricoid|Thyroid cartilage/.test(n)) return 'neck';
  if (/^Mandible$|^Lower /.test(n)) return 'jaw';
  return 'head';
}

const V = () => new THREE.Vector3();
function verts(g) { const out = []; for (let i = 0; i < g.pos.length; i += 3) out.push(new THREE.Vector3(g.pos[i], g.pos[i + 1], g.pos[i + 2])); return out; }
function centroid(list) { const c = V(); list.forEach(v => c.add(v)); return c.multiplyScalar(1 / Math.max(1, list.length)); }
function sphereFit(list) {
  // least squares: x^2+y^2+z^2 = 2ax + 2by + 2cz + d
  const A = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], b = [0, 0, 0, 0];
  for (const p of list) {
    const r = [2 * p.x, 2 * p.y, 2 * p.z, 1], f = p.lengthSq();
    for (let i = 0; i < 4; i++) { b[i] += r[i] * f; for (let j = 0; j < 4; j++) A[i][j] += r[i] * r[j]; }
  }
  // gaussian elimination
  for (let i = 0; i < 4; i++) {
    let m = i; for (let k = i + 1; k < 4; k++) if (Math.abs(A[k][i]) > Math.abs(A[m][i])) m = k;
    [A[i], A[m]] = [A[m], A[i]]; [b[i], b[m]] = [b[m], b[i]];
    for (let k = i + 1; k < 4; k++) { const f = A[k][i] / A[i][i]; for (let j = i; j < 4; j++) A[k][j] -= f * A[i][j]; b[k] -= f * b[i]; }
  }
  const x = [0, 0, 0, 0];
  for (let i = 3; i >= 0; i--) { let s = b[i]; for (let j = i + 1; j < 4; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
  return new THREE.Vector3(x[0], x[1], x[2]);
}
const byY = (list, frac, top) => { const ys = list.map(v => v.y).sort((a, b) => a - b); const t = top ? ys[Math.floor(ys.length * (1 - frac))] : ys[Math.floor(ys.length * frac)]; return list.filter(v => top ? v.y >= t : v.y <= t); };
const farFrom = (list, p, frac) => { const d = list.map(v => v.distanceTo(p)).sort((a, b) => a - b); const t = d[Math.floor(d.length * (1 - frac))]; return list.filter(v => v.distanceTo(p) >= t); };

/**
 * boneStructs: [{name, side, g:{pos, idx}}] — every skeletal mesh.
 * Returns { skel:[{name,parent,pivot}], bone:{pos,idx,seg(Uint8)}, segBVH }
 */
export function buildSkeleton(boneStructs) {
  const find = (re, side) => boneStructs.filter(b => re.test(b.name) && (!side || b.side === side));
  const vs = (re, side) => find(re, side).flatMap(b => verts(b.g));
  const piv = {};
  const mid = (a, b) => a.clone().add(b).multiplyScalar(0.5);
  piv.pelvis = centroid(vs(/^Sacrum$/));
  const sacTop = centroid(byY(vs(/^Sacrum$/), 0.15, true));
  piv.lumbar = mid(centroid(vs(/^Vertebra L5$/)), sacTop);
  piv.thorax = mid(centroid(vs(/^Vertebra T12$/)), centroid(vs(/^Vertebra L1$/)));
  piv.neck = mid(centroid(vs(/^Vertebra C7$/)), centroid(vs(/^Vertebra T1$/)));
  piv.head = centroid(vs(/^Atlas/)).add(new THREE.Vector3(0, 0.012, 0));
  {
    const top = byY(vs(/^Mandible$/), 0.1, true);
    const zs = top.map(v => v.z).sort((a, b) => a - b), zm = zs[Math.floor(zs.length / 2)];
    piv.jaw = centroid(top.filter(v => v.z <= zm));
  }
  for (const [S, side] of [['L', 'left'], ['R', 'right']]) {
    const hum = vs(/^Humerus$/, side);
    const humTop = byY(hum, 0.07, true);
    piv['arm_' + S] = sphereFit(humTop.filter(v => Math.abs(v.x) <= [...humTop].map(q => Math.abs(q.x)).sort((a, b) => a - b)[Math.floor(humTop.length * 0.6)]));
    piv['forearm_' + S] = centroid(byY(hum, 0.05, false));
    piv['hand_' + S] = centroid(vs(/^(Scaphoid|Lunate|Triquetrum) bone$/, side));
    const mc = ['Second', 'Third', 'Fourth', 'Fifth'].flatMap(k => farFrom(vs(new RegExp('^' + k + ' metacarpal'), side), piv['hand_' + S], 0.3));
    piv['fingers_' + S] = centroid(mc);
    piv['thumb_' + S] = centroid(vs(/^Trapezium bone$/, side));
    const cl = vs(/^Clavicle$/, side); const mn = Math.min(...cl.map(v => Math.abs(v.x)));
    piv['scap_' + S] = centroid(cl.filter(v => Math.abs(v.x) < mn + 0.012));
    const fem = vs(/^Femur$/, side);
    const femTop = byY(fem, 0.1, true);
    const axs = femTop.map(v => Math.abs(v.x)).sort((a, b) => a - b);
    piv['thigh_' + S] = sphereFit(femTop.filter(v => Math.abs(v.x) <= axs[Math.floor(axs.length * 0.45)]));
    piv['leg_' + S] = centroid(byY(fem, 0.04, false));
    piv['foot_' + S] = centroid(byY(vs(/^Talus$/, side), 0.5, true));
    const mt = ['First', 'Second', 'Third', 'Fourth', 'Fifth'].flatMap(k => farFrom(vs(new RegExp('^' + k + ' metatarsal'), side), piv['foot_' + S], 0.3));
    piv['toes_' + S] = centroid(mt);
  }
  const skel = SEGMENTS.map(([name, parent]) => ({ name, parent, pivot: piv[name].toArray().map(v => +v.toFixed(4)) }));

  // merged bone geometry with per-vertex segment
  let nv = 0, ni = 0; for (const b of boneStructs) { nv += b.g.pos.length / 3; ni += b.g.idx.length; }
  const pos = new Float32Array(nv * 3), idx = new Uint32Array(ni), seg = new Uint8Array(nv);
  const segGeoms = SEGMENTS.map(() => []);
  let pv = 0, pi = 0;
  for (const b of boneStructs) {
    const si = SEG_INDEX.get(segmentOf(b.name, b.side));
    pos.set(b.g.pos, pv * 3); for (let k = 0; k < b.g.idx.length; k++) idx[pi + k] = b.g.idx[k] + pv;
    seg.fill(si, pv, pv + b.g.pos.length / 3);
    segGeoms[si].push(b.g);
    pv += b.g.pos.length / 3; pi += b.g.idx.length;
  }
  const segBVH = segGeoms.map(list => {
    if (!list.length) return null;
    let n = 0, m = 0; for (const g of list) { n += g.pos.length; m += g.idx.length; }
    const P = new Float32Array(n), I = new Uint32Array(m); let a = 0, c = 0;
    for (const g of list) { P.set(g.pos, a); for (let k = 0; k < g.idx.length; k++) I[c + k] = g.idx[k] + a / 3; a += g.pos.length; c += g.idx.length; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setIndex(new THREE.BufferAttribute(I, 1));
    geo.computeBoundingBox();
    return { bvh: new MeshBVH(geo), box: geo.boundingBox };
  });
  return { skel, bone: { pos, idx, seg }, segBVH };
}

/** Skin weights for one muscle geometry: Uint8Array(nv*8) = 4 segment indices + 4 weights (0..255) */
export function muscleWeights(g, segBVH, { tau = 0.012, iters = 8, reach = 0.22 } = {}) {
  const nv = g.pos.length / 3, NS = segBVH.length;
  const W = new Float32Array(nv * NS);
  const p = new THREE.Vector3(), tgt = {};
  const box = new THREE.Box3();
  for (let i = 0; i < nv * 3; i += 3) box.expandByPoint(p.set(g.pos[i], g.pos[i + 1], g.pos[i + 2]));
  box.expandByScalar(reach);
  const cand = []; segBVH.forEach((s, i) => { if (s && s.box.intersectsBox(box)) cand.push(i); });
  const d = new Float32Array(NS);
  for (let v = 0; v < nv; v++) {
    p.set(g.pos[v * 3], g.pos[v * 3 + 1], g.pos[v * 3 + 2]);
    let dmin = 1e9;
    for (const s of cand) {
      const bx = segBVH[s].box.distanceToPoint(p);
      if (bx > reach) { d[s] = 1e9; continue; }
      segBVH[s].bvh.closestPointToPoint(p, tgt, 0, reach + 0.05);
      d[s] = tgt.distance ?? 1e9; if (d[s] < dmin) dmin = d[s];
    }
    if (dmin >= 1e9) { // far from everything: use nearest box
      for (const s of cand) { d[s] = segBVH[s].box.distanceToPoint(p); if (d[s] < dmin) dmin = d[s]; }
    }
    let sum = 0;
    for (const s of cand) { const w = d[s] >= 1e9 ? 0 : Math.exp(-(d[s] - dmin) / tau); W[v * NS + s] = w; sum += w; }
    for (const s of cand) W[v * NS + s] /= sum || 1;
  }
  // smoothing over mesh edges
  const nb = Array.from({ length: nv }, () => new Set());
  for (let k = 0; k < g.idx.length; k += 3) { const a = g.idx[k], b = g.idx[k + 1], c = g.idx[k + 2]; nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b); }
  const nbA = nb.map(s => [...s]);
  let cur = W, next = new Float32Array(W.length);
  for (let it = 0; it < iters; it++) {
    for (let v = 0; v < nv; v++) {
      const n = nbA[v];
      for (const s of cand) {
        let acc = 0; for (const u of n) acc += cur[u * NS + s];
        next[v * NS + s] = n.length ? 0.5 * cur[v * NS + s] + 0.5 * acc / n.length : cur[v * NS + s];
      }
    }
    [cur, next] = [next, cur];
  }
  // top-4 influences: [i0,i1,i2,i3, w0,w1,w2,w3] (weights 0..255, sum 255)
  const out = new Uint8Array(nv * 8);
  for (let v = 0; v < nv; v++) {
    const top = cand.map(s => [s, cur[v * NS + s]]).sort((a, b) => b[1] - a[1]).slice(0, 4).filter(x => x[1] > 0.01);
    const sum = top.reduce((a, x) => a + x[1], 0) || 1;
    let acc = 0;
    top.forEach(([s, w], k) => {
      out[v * 8 + k] = s;
      const q = k === top.length - 1 ? 255 - acc : Math.round(w / sum * 255);
      out[v * 8 + 4 + k] = q; acc += q;
    });
  }
  return out;
}
