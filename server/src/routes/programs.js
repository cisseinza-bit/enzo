import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, httpError } from '../middleware/error.js'
import { generateProgram } from '../services/programGenerator.js'

export const programsRouter = Router()
programsRouter.use(requireAuth)

async function loadProfile(userId) {
  const { rows } = await query('SELECT * FROM profiles WHERE user_id = $1', [userId])
  if (!rows.length) throw httpError(404, 'Profil introuvable')
  return rows[0]
}

// GET /api/programs — liste des semaines générées.
programsRouter.get('/', asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT id, week_number, phase, source, created_at FROM programs WHERE user_id = $1 ORDER BY week_number',
    [req.userId]
  )
  res.json(rows)
}))

// GET /api/programs/:week — le programme d'une semaine (le génère si absent).
programsRouter.get('/:week', asyncHandler(async (req, res) => {
  const week = Number(req.params.week)
  if (!Number.isInteger(week) || week < 1) throw httpError(400, 'Semaine invalide')

  const existing = await query(
    'SELECT week_number, phase, source, data FROM programs WHERE user_id = $1 AND week_number = $2',
    [req.userId, week]
  )
  if (existing.rows.length) return res.json(existing.rows[0])

  const profile = await loadProfile(req.userId)
  const { source, data } = await generateProgram({ profile, weekNumber: week })
  const { rows } = await query(
    `INSERT INTO programs (user_id, week_number, phase, source, data)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, week_number) DO UPDATE SET data = EXCLUDED.data, source = EXCLUDED.source
     RETURNING week_number, phase, source, data`,
    [req.userId, week, data.phase || `Semaine ${week}`, source, data]
  )
  res.status(201).json(rows[0])
}))

// POST /api/programs/:week/regenerate — force une nouvelle génération.
programsRouter.post('/:week/regenerate', asyncHandler(async (req, res) => {
  const week = Number(req.params.week)
  if (!Number.isInteger(week) || week < 1) throw httpError(400, 'Semaine invalide')

  const profile = await loadProfile(req.userId)
  const { source, data } = await generateProgram({ profile, weekNumber: week })
  const { rows } = await query(
    `INSERT INTO programs (user_id, week_number, phase, source, data)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, week_number) DO UPDATE SET data = EXCLUDED.data, source = EXCLUDED.source, created_at = now()
     RETURNING week_number, phase, source, data`,
    [req.userId, week, data.phase || `Semaine ${week}`, source, data]
  )
  res.json(rows[0])
}))
