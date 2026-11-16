// Schematic main lymphatic ducts (not in the source model): cisterna chyli, thoracic duct, right lymphatic duct.
// Paths follow the model's own vertebrae and the venous angles (internal jugular + subclavian veins).
import * as THREE from 'three';

const P = (x, y, z) => new THREE.Vector3(x, y, z);

function pts(g) { const out = []; for (let i = 0; i < g.pos.length; i += 3) out.push(P(g.pos[i], g.pos[i + 1], g.pos[i + 2])); return out; }

// front surface of a vertebral body, on the midline
function vertebraFront(list) {
  const mid = list.filter(v => Math.abs(v.x) < 0.012);
  const ys = mid.map(v => v.y).sort((a, b) => a - b), yc = ys[Math.floor(ys.length / 2)];
  const zMax = Math.max(...mid.map(v => v.z));
  return P(0, yc, zMax);
}

// closest approach between two vessels = venous angle
function junction(a, b) {
  let best = 1e9, pa = null, pb = null;
  const step = Math.max(1, Math.floor(a.length / 1500)), stepB = Math.max(1, Math.floor(b.length / 1500));
  for (let i = 0; i < a.length; i += step) for (let j = 0; j < b.length; j += stepB) {
    const d = a[i].distanceToSquared(b[j]); if (d < best) { best = d; pa = a[i]; pb = b[j]; }
  }
  return pa.clone().add(pb).multiplyScalar(0.5);
}

function tube(points, r, segs = 120, radial = 10) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const geo = new THREE.TubeGeometry(curve, segs, r, radial, false);
  const g = geo.toNonIndexed ? geo : geo;
  return { pos: Float32Array.from(geo.attributes.position.array), idx: Uint32Array.from(geo.index.array) };
}
function blob(center, rx, ry, rz) {
  const geo = new THREE.SphereGeometry(1, 16, 12);
  const p = geo.attributes.position.array;
  for (let i = 0; i < p.length; i += 3) { p[i] = center.x + p[i] * rx; p[i + 1] = center.y + p[i + 1] * ry; p[i + 2] = center.z + p[i + 2] * rz; }
  return { pos: Float32Array.from(p), idx: Uint32Array.from(geo.index.array) };
}

/** boneParts: [{name, side, g}], vessels: [{en, side, g}] (already in SYS) */
export function lymphDucts(boneParts, vessels) {
  const V = name => boneParts.filter(b => b.name === name).flatMap(b => pts(b.g));
  const front = n => vertebraFront(V('Vertebra ' + n));
  const vessel = (re, side) => vessels.filter(v => re.test(v.en) && (v.side === side || new RegExp('^' + (side === 'L' ? 'Left' : 'Right') + ' ', 'i').test(v.en))).flatMap(v => pts(v.g));
  const angleL = junction(vessel(/internal jugular vein$/i, 'L'), vessel(/subclavian vein$/i, 'L'));
  const angleR = junction(vessel(/internal jugular vein$/i, 'R'), vessel(/subclavian vein$/i, 'R'));

  const off = (p, dx, dz) => P(p.x + dx, p.y, p.z + dz);
  const L1 = front('L1'), L2 = front('L2'), T12 = front('T12');
  // cisterna chyli: in front of L1–L2, slightly right of the midline (right = −x)
  const cc = P(-0.008, (L1.y + L2.y) / 2 + 0.005, Math.max(L1.z, L2.z) + 0.007);
  const out = [];
  out.push({ en: 'Cisterna chyli', zh: '乳糜池（示意）', g: blob(cc, 0.006, 0.022, 0.005),
    info: '乳糜池：位於第一、二腰椎前方的膨大囊，收集下肢、骨盆和腹部（包括腸道吸收的脂肪「乳糜」）的淋巴，往上延續成胸管。（原始模型沒有淋巴管，這是依教科書位置畫的示意圖。）' });

  // thoracic duct: right of midline up to ~T5, crosses to the left at T4–T5, left of the oesophagus to C7, arches into the left venous angle
  const path = [P(cc.x, cc.y + 0.02, cc.z), off(T12, -0.008, 0.008)];
  for (const n of ['T10', 'T8', 'T6']) path.push(off(front(n), -0.007, 0.007));
  path.push(off(front('T4'), 0.002, 0.008));
  for (const n of ['T2', 'T1']) path.push(off(front(n), 0.012, 0.008));
  const c7 = off(front('C7'), 0.018, 0.006);
  path.push(c7);
  const arch = P(c7.x * 0.4 + angleL.x * 0.6, Math.max(c7.y, angleL.y) + 0.025, c7.z * 0.5 + angleL.z * 0.5 + 0.008);
  path.push(arch, angleL);
  out.push({ en: 'Thoracic duct', zh: '胸管（示意）', g: tube(path, 0.0022),
    info: '胸管：全身最大的淋巴管，長約 40 公分。從乳糜池沿脊椎前方往上，在胸部中段由右側跨到左側，最後在頸部注入左側頸內靜脈和鎖骨下靜脈交會處（左靜脈角）。收集除了右上半身以外、約四分之三身體的淋巴。（示意圖）' });

  // right lymphatic duct: short trunk ending at the right venous angle
  const rStart = P(angleR.x * 0.75, angleR.y - 0.012, angleR.z - 0.004);
  out.push({ en: 'Right lymphatic duct', zh: '右淋巴管（示意）', g: tube([rStart, P((rStart.x + angleR.x) / 2, angleR.y - 0.004, angleR.z), angleR], 0.0018, 24, 8),
    info: '右淋巴管：約 1 到 2 公分的短管，收集右側頭頸、右上肢和右胸的淋巴，注入右側頸內靜脈和鎖骨下靜脈交會處（右靜脈角）。（示意圖）' });
  return out;
}
