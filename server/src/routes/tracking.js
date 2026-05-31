import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, httpError } from '../middleware/error.js'

export const trackingRouter = Router()
trackingRouter.use(requireAuth)

// --- Pesées ---

// GET /api/tracking/weigh-ins
trackingRouter.get('/weigh-ins', asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT recorded_on AS date, weight FROM weigh_ins WHERE user_id = $1 ORDER BY recorded_on',
    [req.userId]
  )
  res.json(rows)
}))

// POST /api/tracking/weigh-ins  { weight, date? }
trackingRouter.post('/weigh-ins', asyncHandler(async (req, res) => {
  const { weight, date } = req.body || {}
  const w = Number(weight)
  if (!w || w < 20 || w > 400) throw httpError(400, 'Poids invalide')
  const { rows } = await query(
    `INSERT INTO weigh_ins (user_id, weight, recorded_on)
     VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE))
     ON CONFLICT (user_id, recorded_on) DO UPDATE SET weight = EXCLUDED.weight
     RETURNING recorded_on AS date, weight`,
    [req.userId, w, date || null]
  )
  res.status(201).json(rows[0])
}))

// --- Tâches quotidiennes ---

// GET /api/tracking/tasks?day=YYYY-MM-DD
trackingRouter.get('/tasks', asyncHandler(async (req, res) => {
  const day = req.query.day || null
  const { rows } = await query(
    `SELECT day, task_key, done FROM task_logs
     WHERE user_id = $1 AND ($2::date IS NULL OR day = $2::date)`,
    [req.userId, day]
  )
  res.json(rows)
}))

// POST /api/tracking/tasks  { taskKey, day?, done }
trackingRouter.post('/tasks', asyncHandler(async (req, res) => {
  const { taskKey, day, done = true } = req.body || {}
  if (!taskKey) throw httpError(400, 'taskKey requis')
  const { rows } = await query(
    `INSERT INTO task_logs (user_id, day, task_key, done)
     VALUES ($1, COALESCE($2::date, CURRENT_DATE), $3, $4)
     ON CONFLICT (user_id, day, task_key) DO UPDATE SET done = EXCLUDED.done
     RETURNING day, task_key, done`,
    [req.userId, day || null, taskKey, !!done]
  )
  res.json(rows[0])
}))

// --- Mensurations mensuelles ---

// GET /api/tracking/measurements
trackingRouter.get('/measurements', asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT recorded_on AS date, waist, hips, thighs, arms, photos FROM measurements WHERE user_id = $1 ORDER BY recorded_on',
    [req.userId]
  )
  res.json(rows)
}))

// POST /api/tracking/measurements
trackingRouter.post('/measurements', asyncHandler(async (req, res) => {
  const { waist, hips, thighs, arms, photos = {}, date } = req.body || {}
  const { rows } = await query(
    `INSERT INTO measurements (user_id, recorded_on, waist, hips, thighs, arms, photos)
     VALUES ($1, COALESCE($2::date, CURRENT_DATE), $3, $4, $5, $6, $7)
     RETURNING recorded_on AS date, waist, hips, thighs, arms, photos`,
    [req.userId, date || null, waist ?? null, hips ?? null, thighs ?? null, arms ?? null, JSON.stringify(photos)]
  )
  res.status(201).json(rows[0])
}))
