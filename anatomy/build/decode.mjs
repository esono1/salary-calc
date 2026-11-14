// Decode Svitylo/Z-Anatomy GLB chunks into per-mesh geometry.
import fs from 'node:fs';
import path from 'node:path';
import { MeshoptDecoder } from 'meshoptimizer';

export const R = path.resolve('../pk/sv/package/releases/1.2.0');
export const manifest = JSON.parse(fs.readFileSync(R + '/manifest.json', 'utf8'));

const CT = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
const NC = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

function readGlb(file) {
  const d = fs.readFileSync(file);
  const jl = d.readUInt32LE(12);
  const json = JSON.parse(d.subarray(20, 20 + jl).toString('utf8'));
  const bo = 20 + jl;
  const bl = d.readUInt32LE(bo);
  const bin = new Uint8Array(d.buffer, d.byteOffset + bo + 8, bl);
  return { json, bin };
}

function viewData(json, bin, vi) {
  const v = json.bufferViews[vi];
  const e = v.extensions?.EXT_meshopt_compression;
  if (!e) return { data: bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength), stride: v.byteStride };
  const out = new Uint8Array(e.count * e.byteStride);
  const src = bin.subarray(e.byteOffset || 0, (e.byteOffset || 0) + e.byteLength);
  MeshoptDecoder.decodeGltfBuffer(out, e.count, e.byteStride, src, e.mode, e.filter);
  return { data: out, stride: e.byteStride };
}

function accessor(json, bin, cache, ai) {
  const a = json.accessors[ai];
  if (!cache[a.bufferView]) cache[a.bufferView] = viewData(json, bin, a.bufferView);
  const { data, stride } = cache[a.bufferView];
  const T = CT[a.componentType], nc = NC[a.type];
  const es = T.BYTES_PER_ELEMENT * nc;
  const st = stride || es;
  const out = new T(a.count * nc);
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const get = { 5120: 'getInt8', 5121: 'getUint8', 5122: 'getInt16', 5123: 'getUint16', 5125: 'getUint32', 5126: 'getFloat32' }[a.componentType];
  const off = a.byteOffset || 0;
  for (let i = 0; i < a.count; i++)
    for (let c = 0; c < nc; c++) out[i * nc + c] = dv[get](off + i * st + c * T.BYTES_PER_ELEMENT, true);
  return { arr: out, a, nc };
}

// Returns Map<globalMeshIndex, {pos: Float32Array, idx: Uint32Array}>
export async function decodeChunk(chunk, quality) {
  await MeshoptDecoder.ready;
  const { json, bin } = readGlb(path.join(R, chunk.files[quality].path));
  const out = new Map();
  for (const node of json.nodes) {
    if (node.mesh == null) continue;
    const t = node.translation || [0, 0, 0], s = node.scale || [1, 1, 1];
    if (node.rotation && node.rotation.some((v, i) => Math.abs(v - (i === 3 ? 1 : 0)) > 1e-6)) throw new Error('rotation');
    for (const prim of json.meshes[node.mesh].primitives) {
      const cache = {};
      const P = accessor(json, bin, cache, prim.attributes.POSITION);
      const I = accessor(json, bin, cache, prim.attributes._ID);
      const X = accessor(json, bin, cache, prim.indices);
      let div = 1;
      if (P.a.normalized) div = { 5122: 32767, 5123: 65535, 5120: 127, 5121: 255 }[P.a.componentType];
      const n = P.a.count;
      // group triangles by mesh id (of first vertex)
      const groups = new Map();
      for (let k = 0; k < X.arr.length; k += 3) {
        const v0 = X.arr[k];
        const id = I.arr[v0 * 2];
        let g = groups.get(id);
        if (!g) groups.set(id, g = []);
        g.push(X.arr[k], X.arr[k + 1], X.arr[k + 2]);
      }
      for (const [id, tri] of groups) {
        const remap = new Map();
        const pos = [], mat = [];
        const idx = new Uint32Array(tri.length);
        for (let k = 0; k < tri.length; k++) {
          const v = tri[k];
          let r = remap.get(v);
          if (r === undefined) {
            r = remap.size; remap.set(v, r);
            for (let c = 0; c < 3; c++) pos.push(P.arr[v * 3 + c] / div * s[c] + t[c]);
            mat.push(I.arr[v * 2 + 1]);
          }
          idx[k] = r;
        }
        const prev = out.get(id);
        if (prev) {
          const base = prev.pos.length / 3;
          const np = new Float32Array(prev.pos.length + pos.length); np.set(prev.pos); np.set(pos, prev.pos.length);
          const ni = new Uint32Array(prev.idx.length + idx.length); ni.set(prev.idx); for (let k = 0; k < idx.length; k++) ni[prev.idx.length + k] = idx[k] + base;
          out.set(id, { pos: np, idx: ni, mat: prev.mat.concat(mat) });
        } else out.set(id, { pos: new Float32Array(pos), idx, mat });
      }
    }
  }
  return out;
}

if (process.argv[1].endsWith('decode.mjs')) {
  const ch = manifest.chunks.find(c => c.id === 'muscular.epaxial_muscles');
  const m = await decodeChunk(ch, 'economy');
  console.log(ch.meshStart, ch.meshCount, [...m.keys()].slice(0, 10), m.size);
  const g = m.values().next().value;
  let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (const g of m.values()) for (let i = 0; i < g.pos.length; i++) { mn[i % 3] = Math.min(mn[i % 3], g.pos[i]); mx[i % 3] = Math.max(mx[i % 3], g.pos[i]); }
  console.log(mn, mx);
}
