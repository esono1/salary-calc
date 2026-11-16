// Fasciae, bursae and tendon sheaths (connective tissue layer).
import * as THREE from 'three';

export const CT_ZH = {
  // fasciae
  'Superficial investing cervical fascia': '頸筋膜淺層', 'Diaphragmatic fascia': '橫膈筋膜', 'Iliopsoas fascia': '髂腰筋膜', 'Transversalis fascia': '腹橫筋膜',
  'Investing abdominal fascia': '腹部包覆筋膜', 'Masseteric fascia': '咬肌筋膜', 'Superficial layer of temporal fascia': '顳筋膜淺層',
  'Anterior intermuscular septum of leg': '小腿前肌間隔', 'Crural fascia': '小腿筋膜', 'Fascia lata': '闊筋膜', 'Iliotibial tract': '髂脛束',
  'Flexor retinaculum of ankle': '踝屈肌支持帶', 'Iliopectineal arch': '髂恥弓', 'Inferior extensor retinaculum of ankle': '踝伸肌下支持帶',
  'Inferior fibular retinaculum': '腓骨肌下支持帶', 'Lateral femoral intermuscular septum': '股外側肌間隔', 'Medial femoral intermuscular septum': '股內側肌間隔',
  'Piriformis fascia': '梨狀肌筋膜', 'Plantar aponeurosis': '足底腱膜', 'Popliteal fascia': '膕筋膜', 'Posterior intermuscular septum of leg': '小腿後肌間隔',
  'Superficial transverse metatarsal ligament': '蹠淺橫韌帶', 'Superior extensor retinaculum of ankle': '踝伸肌上支持帶', 'Superior fibular retinaculum': '腓骨肌上支持帶',
  'Transverse intermuscular septum of leg': '小腿橫肌間隔', 'Clavipectoral fascia': '鎖胸筋膜', 'Pectoral fascia': '胸筋膜', 'Antebrachial fascia': '前臂筋膜',
  'Extensor retinaculum of wrist': '腕伸肌支持帶', 'Brachial fascia': '臂筋膜', 'Deltoid fascia': '三角肌筋膜', 'Dorsal fascia of hand': '手背筋膜',
  'Flexor retinaculum of wrist': '腕屈肌支持帶（腕橫韌帶）', 'Lateral intermuscular septum of arm': '臂外側肌間隔', 'Medial intermuscular septum of arm': '臂內側肌間隔',
  'Palmar aponeurosis': '掌腱膜', 'Superficial transverse metacarpal ligament': '掌淺橫韌帶', 'Anterior layer of thoracolumbar fascia': '胸腰筋膜前層',
  'Middle layer of thoracolumbar fascia': '胸腰筋膜中層', 'Posterior layer of thoracolumbar fascia': '胸腰筋膜後層',
  // bursae
  'Iliopectineal bursa': '髂恥滑液囊', 'Anserine bursa': '鵝足滑液囊', 'Bursa of piriformis muscle': '梨狀肌滑液囊', 'Deep infrapatellar bursa': '髕下深滑液囊',
  'Inferior subtendinous bursa of biceps femoris muscle': '股二頭肌腱下滑液囊（下）', 'Intermuscular gluteal bursae': '臀肌間滑液囊',
  'Lateral subtendinous bursa of gastrocnemius muscle': '腓腸肌外側腱下滑液囊', 'Medial subtendinous bursa of gastrocnemius muscle': '腓腸肌內側腱下滑液囊',
  'Sciatic bursa of gluteus maximus muscle': '臀大肌坐骨滑液囊', 'Sciatic bursa of obturator internus': '閉孔內肌坐骨滑液囊', 'Semimembranosus bursa': '半膜肌滑液囊',
  'Subcutaneous bursa of lateral malleolus': '外踝皮下滑液囊', 'Subcutaneous bursa of medial malleolus': '內踝皮下滑液囊', 'Subcutaneous bursa of tuberosity of tibia': '脛骨粗隆皮下滑液囊',
  'Subcutaneous calcaneal bursa': '跟骨皮下滑液囊', 'Subcutaneous infrapatellar bursa': '髕下皮下滑液囊', 'Subcutaneous prepatellar bursa': '髕前皮下滑液囊',
  'Subcutaneous trochanteric bursa': '轉子皮下滑液囊', 'Subfacial prepatellar bursa': '髕前筋膜下滑液囊', 'Subtendinous bursa of iliacus muscle': '髂肌腱下滑液囊',
  'Subtendinous bursa of obturator internus': '閉孔內肌腱下滑液囊', 'Subtendinous bursa of sartorius muscle': '縫匠肌腱下滑液囊', 'Subtendinous bursa of tibialis anterior': '脛前肌腱下滑液囊',
  'Subtendinous calcaneal bursa': '跟腱下滑液囊', 'Subtendinous prepatellar bursa': '髕前腱下滑液囊', 'Superior bursa of biceps femoris muscle': '股二頭肌上滑液囊',
  'Suprapatellar bursa': '髕上滑液囊', 'Trochanteric bursa of gluteus maximus muscle': '臀大肌轉子滑液囊', 'Trochanteric bursa of gluteus medius muscle': '臀中肌轉子滑液囊',
  'Trochanteric bursa of gluteus minimus muscle': '臀小肌轉子滑液囊', 'Bicipitoradial bursa': '肱二頭肌橈骨滑液囊', 'Coracobrachial bursa': '喙肱肌滑液囊',
  'Subacromial bursa': '肩峰下滑液囊', 'Subcutaneous acromial bursa': '肩峰皮下滑液囊', 'Subdeltoid bursa': '三角肌下滑液囊',
  'Subtendinous bursa of infraspinatus muscle': '棘下肌腱下滑液囊', 'Subtendinous bursa of teres major muscle': '大圓肌腱下滑液囊',
  'Subtendinous bursa of trapezius muscle': '斜方肌腱下滑液囊', 'Subtendinous bursa of triceps brachii muscle': '肱三頭肌腱下滑液囊',
  // tendon sheaths
  'Tendon sheath of extensor digitorum longus': '伸趾長肌腱鞘', 'Tendon sheath of extensor hallucis longus': '伸拇趾長肌腱鞘', 'Tendon sheath of tibialis anterior': '脛前肌腱鞘',
  'Common tendon sheath of fibularis muscles': '腓骨肌總腱鞘', 'Plantar tendon sheath of fibularis longus muscle': '腓骨長肌足底腱鞘',
  'Tendon sheath of flexor digitorum longus': '屈趾長肌腱鞘', 'Tendon sheath of flexor hallucis longus': '屈拇趾長肌腱鞘', 'Tendon sheath of tibialis posterior muscle': '脛後肌腱鞘',
  'Tendon sheath - abd. pollicis longus - ext. pollicis brevis': '外展拇長肌、伸拇短肌腱鞘', 'Tendon sheath of extensor carpi ulnaris': '尺側伸腕肌腱鞘',
  'Tendon sheath of extensor digiti minimi manus': '伸小指肌腱鞘', 'Tendon sheath of extensor digitorum and extensor indicis': '伸指肌、伸食指肌腱鞘',
  'Tendon sheath of extensor pollicis longus': '伸拇長肌腱鞘', 'Tendon sheath of extensors carpi radialis': '橈側伸腕肌腱鞘', 'Common flexor tendon sheath': '屈肌總腱鞘',
  'Tendon sheath of flexor carpi radialis': '橈側屈腕肌腱鞘', 'Tendon sheath of flexor pollicis longus': '屈拇長肌腱鞘', 'Intertubercular tendon sheath': '結節間腱鞘（肱二頭肌長頭）',
  'Cruciform part of fibrous sheath of digit of hand': '手指纖維鞘（十字部）', 'Synovial sheaths of digits of hand': '手指滑液鞘',
};

export function ctInfo(name, kind) {
  if (kind === 1) return '滑液囊：裝著少量滑液的扁平小囊，墊在肌腱、骨頭或皮膚之間減少摩擦。發炎時就是「滑囊炎」。';
  if (kind === 2) return '腱鞘：包住長肌腱的滑液管道，讓肌腱經過關節時能順暢滑動。發炎時就是「腱鞘炎」。';
  if (/retinaculum/.test(name)) return '支持帶：像束帶一樣橫跨關節，把底下經過的肌腱固定住，避免肌肉收縮時肌腱彈起來。';
  if (/intermuscular septum/.test(name)) return '肌間隔：從外層筋膜伸到骨頭的隔板，把肢體分成不同的肌肉腔室，也讓肌肉附著。';
  if (/^Fascia lata/.test(name)) return '闊筋膜：包住整個大腿的深筋膜，外側增厚成髂脛束；闊筋膜張肌和臀大肌拉緊它來穩定髖和膝。';
  if (/^Iliotibial tract/.test(name)) return '髂脛束：闊筋膜外側增厚的帶狀部分，從髂嵴延伸到脛骨外側；闊筋膜張肌和臀大肌拉緊它來穩定膝蓋外側。跑者常見的「髂脛束症候群」就在這裡。';
  if (/thoracolumbar/.test(name)) return '胸腰筋膜：包住豎脊肌和腰方肌；背闊肌、腹內斜肌、腹橫肌都附著在上面，把上肢、軀幹和骨盆的力量連在一起。';
  if (/Plantar aponeurosis/.test(name)) return '足底腱膜：從跟骨延伸到腳趾的堅韌腱膜，撐住足弓。發炎時就是「足底筋膜炎」。';
  if (/Palmar aponeurosis/.test(name)) return '掌腱膜：掌心皮下的三角形腱膜，保護底下的肌腱和血管神經，掌長肌拉緊它。';
  if (/transverse meta/.test(name)) return '連接各指（趾）根部的橫向韌帶，讓手指或腳趾一起受力。';
  if (/Iliopectineal arch/.test(name)) return '髂恥弓：把腹股溝韌帶下方的空間分成肌肉通道（髂腰肌）和血管通道。';
  if (/Flexor retinaculum of wrist/.test(name)) return '腕屈肌支持帶（腕橫韌帶）：構成腕隧道的頂，正中神經和屈指肌腱從底下通過。被壓迫時就是「腕隧道症候群」。';
  return '深筋膜：包住肌肉或肌群的結締組織薄膜，分隔肌群、讓肌肉之間順暢滑動，也是許多肌肉的附著處。';
}

/** structures under fasciae / bursae / tendon sheaths of the muscular system */
export function collectCT({ manifest, en, meshes, ancestors, weld }) {
  const out = [];
  for (const s of manifest.structures) {
    if (s.system !== 'muscular' || s.kind !== 'structure' || !s.meshes) continue;
    const a = ancestors(s).join(' ');
    const kind = /bursae/.test(a) ? 1 : /tendon_sheaths/.test(a) ? 2 : /fasciae/.test(a) ? 0 : -1;
    if (kind < 0) continue;
    const raw = meshes.get(s.meshes[0]); if (!raw) continue;
    const g = weld(raw); if (!g.idx.length) continue;
    const en0 = (en[s.id]?.name || s.id).replace(/^\((.*)\)$/, '$1');
    out.push({ en: en0, zh: CT_ZH[en0] || en0, kind, side: s.side === 'left' ? 'L' : s.side === 'right' ? 'R' : '', g, info: ctInfo(en0, kind) });
  }
  return out;
}

/** muscles touching a CT mesh (within 6 mm), most contact first */
export function relatedMuscles(g, musBVH, vOwner, musIdx, M, side) {
  const p = new THREE.Vector3(), tgt = {}, cnt = new Map();
  const n = g.pos.length / 3, step = Math.max(1, Math.floor(n / 500));
  let used = 0;
  for (let v = 0; v < n; v += step) {
    p.set(g.pos[v * 3], g.pos[v * 3 + 1], g.pos[v * 3 + 2]);
    if (!musBVH.closestPointToPoint(p, tgt, 0, 0.006)) continue;
    const o = vOwner[musIdx[tgt.faceIndex * 3]]; used++;
    if (side && M[o].side && M[o].side !== side) continue;
    cnt.set(o, (cnt.get(o) || 0) + 1);
  }
  const total = Math.max(1, Math.ceil(n / step));
  return [...cnt.entries()].filter(([, c]) => c / total >= 0.04).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([o]) => o);
}
