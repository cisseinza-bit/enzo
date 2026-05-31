import { verifyToken } from '../util/jwt.js'

// Middleware d'authentification : exige un Bearer token valide.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Token manquant' })
  try {
    const payload = verifyToken(token)
    req.userId = payload.sub
    req.userTier = payload.tier
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}
