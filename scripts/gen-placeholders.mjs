// Génère des placeholders photo locaux (dark/lime) pour que la mise en page
// soit démontrable sans réseau. À remplacer par les vraies photos (mêmes noms).
// Encodeur PNG minimal via zlib, sans dépendance.
import zlib from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

function crc32(buf) {
  let c, crc = 0xffffffff
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crc = (crc >>> 8) ^ c
  }
  return (crc ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function png(w, h, draw) {
  const raw = Buffer.alloc(h * (w * 3 + 1))
  let p = 0
  for (let y = 0; y < h; y++) {
    raw[p++] = 0
    for (let x = 0; x < w; x++) {
      const [r, g, b] = draw(x, y, w, h)
      raw[p++] = r; raw[p++] = g; raw[p++] = b
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// Dégradé radial chaud sur fond sombre + léger grain → lecture "photo placeholder".
function tile(accent) {
  const [ar, ag, ab] = accent
  return (x, y, w, h) => {
    const cx = w * 0.5, cy = h * 0.42
    const d = Math.hypot(x - cx, y - cy) / (Math.max(w, h) * 0.7)
    const t = Math.max(0, 1 - d)
    const base = 14
    const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
    const n = (noise - 0.5) * 8
    return [
      Math.min(255, base + ar * t * 0.55 + n),
      Math.min(255, base + ag * t * 0.55 + n),
      Math.min(255, base + ab * t * 0.55 + n),
    ]
  }
}

mkdirSync('public/img', { recursive: true })

const PHOTOS = {
  'hero-rope':     { w: 768, h: 1024, accent: [200, 241, 53] }, // lime
  'meal-bowl':     { w: 800, h: 800, accent: [120, 200, 90] },  // vert
  'meal-burger':   { w: 800, h: 800, accent: [220, 130, 60] },  // orange chaud
  'checker-shake': { w: 800, h: 800, accent: [150, 90, 60] },   // cacao
}

for (const [name, { w, h, accent }] of Object.entries(PHOTOS)) {
  writeFileSync(`public/img/${name}.png`, png(w, h, tile(accent)))
  console.log(`✓ public/img/${name}.png (placeholder ${w}x${h})`)
}
