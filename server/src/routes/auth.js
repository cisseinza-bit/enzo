import { Router } from 'express'
import { query } from '../db/pool.js'
import { hashPassword, verifyPassword } from '../util/password.js'
import { signToken } from '../util/jwt.js'
import { asyncHandler, httpError } from '../middleware/error.js'

export const authRouter = Router()

const emailOk = (e) => typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)

// POST /api/auth/register
authRouter.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName = '', profile = {} } = req.body || {}
  if (!emailOk(email)) throw httpError(400, 'Email invalide')
  if (!password || password.length < 8) throw httpError(400, 'Mot de passe trop court (min 8)')

  const exists = await query('SELECT 1 FROM users WHERE email = $1', [email.toLowerCase()])
  if (exists.rowCount) throw httpError(409, 'Cet email est déjà utilisé')

  const { rows } = await query(
    `INSERT INTO users (email, password_hash, first_name)
     VALUES ($1, $2, $3) RETURNING id, email, first_name, tier`,
    [email.toLowerCase(), hashPassword(password), firstName]
  )
  const user = rows[0]

  await query(
    `INSERT INTO profiles (user_id, goal, food_profile, budget, start_weight, height)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [user.id, profile.goal || 'perte', profile.foodProfile || 'europeen',
     profile.budget || 'equilibre', profile.startWeight ?? null, profile.height ?? null]
  )
  await query('INSERT INTO subscriptions (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [user.id])

  const token = signToken({ sub: user.id, tier: user.tier })
  res.status(201).json({ token, user })
}))

// POST /api/auth/login
authRouter.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}
  if (!emailOk(email) || !password) throw httpError(400, 'Identifiants manquants')

  const { rows } = await query(
    'SELECT id, email, first_name, tier, password_hash FROM users WHERE email = $1',
    [email.toLowerCase()]
  )
  const user = rows[0]
  if (!user || !verifyPassword(password, user.password_hash)) {
    throw httpError(401, 'Email ou mot de passe incorrect')
  }
  const token = signToken({ sub: user.id, tier: user.tier })
  res.json({ token, user: { id: user.id, email: user.email, first_name: user.first_name, tier: user.tier } })
}))
