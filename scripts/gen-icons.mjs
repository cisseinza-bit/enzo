// Génère des icônes PNG d'app sans dépendance (encodeur PNG minimal via zlib).
import zlib from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const INK = [10, 10, 10]
const LIME = [200, 241, 53]
const FLAME = [255, 107, 53]

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
  const t = Buffer.from(type, 'ascii')
  const body = Buffer.concat([t, data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(size, draw) {
  const raw = Buffer.alloc(size * (size * 3 + 1))
  let p = 0
  for (let y = 0; y < size; y++) {
    raw[p++] = 0 // filter none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = draw(x, y, size)
      raw[p++] = r; raw[p++] = g; raw[p++] = b
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit, truecolor RGB
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// Fond noir, gros disque lime, point flame au centre (logo simple).
function draw(x, y, size) {
  const cx = size / 2, cy = size / 2
  const d = Math.hypot(x - cx, y - cy)
  if (d < size * 0.12) return FLAME
  if (d < size * 0.34) return LIME
  return INK
}

mkdirSync('public', { recursive: true })
for (const s of [192, 512]) {
  writeFileSync(`public/icon-${s}.png`, png(s, draw))
  console.log(`public/icon-${s}.png written`)
}
writeFileSync('public/apple-touch-icon.png', png(180, draw))
console.log('public/apple-touch-icon.png written')
