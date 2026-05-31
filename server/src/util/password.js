import crypto from 'node:crypto'

// Hachage de mot de passe avec scrypt (intégré à Node, pas de dépendance native).
// Format stocké : scrypt$<saltHex>$<hashHex>

export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

export function verifyPassword(password, stored) {
  try {
    const [scheme, saltHex, hashHex] = stored.split('$')
    if (scheme !== 'scrypt') return false
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    const actual = crypto.scryptSync(password, salt, expected.length)
    return crypto.timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}
