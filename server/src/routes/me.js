import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, httpError } from '../middleware/error.js'

export const meRouter = Router()
meRouter.use(requireAuth)

// GET /api/me — profil complet de l'utilisateur courant.
meRouter.get('/', asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.first_name, u.tier,
            p.goal, p.food_profile, p.budget, p.start_weight, p.height,
            s.status AS sub_status, s.plan AS sub_plan, s.current_period_end
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     LEFT JOIN subscriptions s ON s.user_id = u.id
     WHERE u.id = $1`,
    [req.userId]
  )
  if (!rows.length) throw httpError(404, 'Utilisateur introuvable')
  res.json(rows[0])
}))

// PUT /api/me/profile — met à jour le profil.
meRouter.put('/profile', asyncHandler(async (req, res) => {
  const { goal, foodProfile, budget, startWeight, height, firstName } = req.body || {}

  if (firstName != null) {
    await query('UPDATE users SET first_name = $1 WHERE id = $2', [firstName, req.userId])
  }
  const { rows } = await query(
    `UPDATE profiles SET
       goal = COALESCE($2, goal),
       food_profile = COALESCE($3, food_profile),
       budget = COALESCE($4, budget),
       start_weight = COALESCE($5, start_weight),
       height = COALESCE($6, height),
       updated_at = now()
     WHERE user_id = $1
     RETURNING goal, food_profile, budget, start_weight, height`,
    [req.userId, goal, foodProfile, budget, startWeight, height]
  )
  res.json(rows[0])
}))
