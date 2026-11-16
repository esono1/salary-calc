// Muscle origins / insertions from Z-Anatomy "insertions" patches.
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

const BONE_ZH = {
  'Atlas (C1)': '寰椎（C1）', 'Axis (C2)': '樞椎（C2）', 'Body of sternum': '胸骨體', 'Manubrium of sternum': '胸骨柄', 'Xiphoid process': '劍突',
  'Calcaneus': '跟骨', 'Capitate bone': '頭狀骨', 'Clavicle': '鎖骨', 'Coccyx': '尾骨', 'Cuboid bone': '骰骨', 'Ethmoid bone': '篩骨',
  'Femur': '股骨', 'Fibula': '腓骨', 'Frontal bone': '額骨', 'Hamate bone': '鉤骨', 'Hip bone': '髖骨', 'Humerus': '肱骨', 'Hyoid bone': '舌骨',
  'Inferior nasal concha bone': '下鼻甲', 'Intermediate cuneiform bone': '中間楔骨', 'Lacrimal bone': '淚骨', 'Lateral cuneiform bone': '外側楔骨',
  'Lunate bone': '月狀骨', 'Mandible': '下頜骨', 'Maxilla': '上頜骨', 'Medial cuneiform bone': '內側楔骨', 'Nasal bone': '鼻骨', 'Navicular bone': '舟狀骨（足）',
  'Occipital bone': '枕骨', 'Palatine bone': '腭骨', 'Parietal bone': '頂骨', 'Patella': '髕骨', 'Pisiform bone': '豌豆骨', 'Radius': '橈骨', 'Sacrum': '薦骨',
  'Scaphoid bone': '舟狀骨（手）', 'Scapula': '肩胛骨', 'Sphenoid bone': '蝶骨', 'Talus': '距骨', 'Temporal bone': '顳骨', 'Tibia': '脛骨',
  'Trapezium bone': '大多角骨', 'Trapezoid bone': '小多角骨', 'Triquetrum bone': '三角骨', 'Ulna': '尺骨', 'Vomer': '犁骨', 'Zygomatic bone': '顴骨',
  'Thyroid cartilage': '甲狀軟骨', 'Cricoid cartilage': '環狀軟骨', 'Arytenoid cartilage': '杓狀軟骨', 'Sesamoid bones of foot': '足籽骨',
};
const ORD = { First: 1, Second: 2, Third: 3, Fourth: 4, Fifth: 5, Sixth: 6, Seventh: 7, Eighth: 8, Ninth: 9, Tenth: 10, Eleventh: 11, Twelfth: 12 };
const ZH_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
export function boneZh(n) {
  if (BONE_ZH[n]) return BONE_ZH[n];
  let m;
  if ((m = /^Vertebra ([CTL])(\d+)$/.exec(n))) return '第' + ZH_NUM[+m[2]] + { C: '頸', T: '胸', L: '腰' }[m[1]] + '椎';
  if ((m = /^Costal cartilage of (\w+) rib$/.exec(n))) return '第' + ZH_NUM[ORD[m[1][0].toUpperCase() + m[1].slice(1)]] + '肋軟骨';
  if ((m = /^(\w+) rib$/.exec(n))) return '第' + ZH_NUM[ORD[m[1]]] + '肋';
  if ((m = /^(\w+) metacarpal bone$/.exec(n))) return '第' + ZH_NUM[ORD[m[1]]] + '掌骨';
  if ((m = /^(\w+) metatarsal bone$/.exec(n))) return '第' + ZH_NUM[ORD[m[1]]] + '蹠骨';
  if ((m = /^(Proximal|Middle|Distal) phalanx of (\w+) finger of (hand|foot)$/.exec(n))) {
    const k = ORD[m[2][0].toUpperCase() + m[2].slice(1)];
    const seg = { Proximal: '近節', Middle: '中節', Distal: '遠節' }[m[1]];
    return m[3] === 'hand' ? (k === 1 ? '拇指' : '第' + ZH_NUM[k] + '指') + seg + '指骨' : (k === 1 ? '拇趾' : '第' + ZH_NUM[k] + '趾') + seg + '趾骨';
  }
  return n;
}
// Group several bones into one readable label
function groupLabel(names) {
  const zh = names.map(boneZh);
  const out = [];
  const pick = (re, label) => { const hit = zh.filter(z => re.test(z)); if (hit.length > 1) { out.push(label); hit.forEach(h => zh.splice(zh.indexOf(h), 1)); } };
  pick(/頸椎|寰椎|樞椎/, '頸椎'); pick(/胸椎$/, '胸椎'); pick(/腰椎$/, '腰椎'); pick(/^第.+肋$/, '肋骨'); pick(/肋軟骨$/, '肋軟骨');
  pick(/掌骨$/, '掌骨'); pick(/蹠骨$/, '蹠骨'); pick(/指骨$/, '指骨'); pick(/趾骨$/, '趾骨');
  return [...out, ...zh];
}

// Patch base names that cover several muscles of our list
const MANUAL = {
  'Common extensor tendon': /^(Extensor carpi radialis brevis|Extensor digitorum|Extensor digiti minimi|Humeral head of extensor carpi ulnaris)$/,
  'Common flexor tendon': /^(Flexor carpi radialis|Palmaris longus muscle|Humero-ulnar head of flexor digitorum superficialis|Humeral head of flexor carpi ulnaris|Superficial head of pronator teres)$/,
  'Erector spinae': /^(Iliocostalis|Longissimus|Spinalis)/,
  'Iliopsoas muscle': /^(Iliacus muscle|Psoas major)$/,
  'Quadriceps femoris muscle': /^(Rectus femoris muscle|Vastus)/,
  'Patellar ligament': /^(Rectus femoris muscle|Vastus)/,
  'Triceps surae muscle': /gastrocnemius|^Soleus muscle$|^Calcaneal tendon$/,
  'Trochanteric insertion': /gemellus|^Obturator internus$|^Piriformis muscle$/,
};

export function buildAttachments({ manifest, en, meshes, M, boneStructs, segIndexOf, weld }) {
  // bone lookup BVH with per-vertex structure index
  let nv = 0, ni = 0; for (const b of boneStructs) { nv += b.g.pos.length / 3; ni += b.g.idx.length; }
  const P = new Float32Array(nv * 3), I = new Uint32Array(ni), owner = new Uint16Array(nv);
  let pv = 0, pi = 0;
  boneStructs.forEach((b, k) => { P.set(b.g.pos, pv * 3); for (let j = 0; j < b.g.idx.length; j++) I[pi + j] = b.g.idx[j] + pv; owner.fill(k, pv, pv + b.g.pos.length / 3); pv += b.g.pos.length / 3; pi += b.g.idx.length; });
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setIndex(new THREE.BufferAttribute(I, 1));
  const bvh = new MeshBVH(geo); const idx = geo.index.array;
  const p = new THREE.Vector3(), tgt = {};

  const byName = new Map(); M.forEach((m, i) => { const k = m.en.toLowerCase(); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(i); });
  function musclesFor(base, side) {
    const sideOk = i => !side || !M[i].side || M[i].side === side;
    let hit;
    if (MANUAL[base]) hit = M.map((m, i) => MANUAL[base].test(m.en) ? i : -1).filter(i => i >= 0);
    else {
      hit = byName.get(base.toLowerCase());
      if (!hit) { const bl = base.toLowerCase().replace(/ muscles?$/, ''); hit = M.map((m, i) => m.en.toLowerCase().includes(bl) ? i : -1).filter(i => i >= 0); }
    }
    return (hit || []).filter(sideOk);
  }

  // collect source patches; bases drawn on one side only get mirrored to the other side
  const src = [];
  const sidesOf = new Map();
  for (const s of manifest.structures) {
    if (s.system !== 'insertions' || s.kind !== 'structure' || !s.meshes) continue;
    const name = en[s.id]?.name || '';
    const mm = /\((origin|insertion)[^)]*\)\s*$/.exec(name); if (!mm) continue;
    const base = name.slice(0, mm.index).trim().replace(/^\((.*)\)$/, '$1');
    const side = s.side === 'left' ? 'L' : s.side === 'right' ? 'R' : '';
    const raw = meshes.get(s.meshes[0]); if (!raw) continue;
    const g = weld(raw); if (!g.idx.length) continue;
    // the patellar ligament is the quadriceps' distal attachment at both ends
    const type = base === 'Patellar ligament' ? 'insertion' : mm[1];
    src.push({ base, side, type, g });
    if (!sidesOf.has(base)) sidesOf.set(base, new Set()); sidesOf.get(base).add(side);
  }
  for (const p of [...src]) {
    const sides = sidesOf.get(p.base);
    if (!p.side || sides.size !== 1) continue;
    const other = p.side === 'L' ? 'R' : 'L';
    const pos = Float32Array.from(p.g.pos); for (let k = 0; k < pos.length; k += 3) pos[k] = -pos[k];
    const idx = Uint32Array.from(p.g.idx); for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
    src.push({ base: p.base, side: other, type: p.type, g: { pos, idx } });
  }

  const patches = [];
  for (const { base, side, type, g } of src) {
    const mus = musclesFor(base, side);
    if (!mus.length) continue;
    const mm = [, type];
    // which bones does it sit on (vote over vertices)
    const votes = new Map();
    for (let v = 0; v < g.pos.length; v += 3) {
      p.set(g.pos[v], g.pos[v + 1], g.pos[v + 2]);
      bvh.closestPointToPoint(p, tgt);
      const k = owner[idx[tgt.faceIndex * 3]];
      votes.set(k, (votes.get(k) || 0) + 1);
    }
    const total = g.pos.length / 3;
    const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
    const bones = ranked.filter(([, c]) => c / total >= 0.15).map(([k]) => boneStructs[k].name);
    const segName = boneStructs[ranked[0][0]];
    if (process.env.DBG && new RegExp(process.env.DBG).test(base)) console.log('DBG', base, side, type, ranked.slice(0, 4).map(([k, c]) => boneStructs[k].name + ' ' + Math.round(c / total * 100) + '%').join(', '));
    // source labels latissimus' small scapular (inferior angle) slip as "insertion"; it is part of the origin
    let t = mm[1] === 'origin' ? 0 : 1;
    if (base === 'Latissimus dorsi muscle' && bones[0] === 'Scapula') t = 0;
    patches.push({ mus, type: t, bones, seg: segIndexOf(segName.name, segName.side), g });
  }
  // per-muscle readable summary
  const org = M.map(() => new Set()), ins = M.map(() => new Set());
  patches.forEach(pt => pt.mus.forEach(i => pt.bones.forEach(b => (pt.type ? ins : org)[i].add(b))));
  const summary = M.map((m, i) => ({ o: groupLabel([...org[i]]), n: groupLabel([...ins[i]]) }));
  return { patches, summary };
}
