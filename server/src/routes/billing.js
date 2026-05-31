import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, httpError } from '../middleware/error.js'
import { config } from '../config.js'

export const billingRouter = Router()

// Tarifs publics (affichage front).
const PLANS = [
  { id: 'monthly', label: 'Mensuel sans engagement', price: 39, period: 'mois' },
  { id: 'quarterly', label: 'Trimestriel', price: 97, period: '3 mois', save: '-17%' },
  { id: 'yearly', label: 'Annuel', price: 297, period: 'an', save: '-37%' },
]

// GET /api/billing/plans — public.
billingRouter.get('/plans', (req, res) => {
  res.json({ enabled: config.stripe.enabled, plans: PLANS })
})

billingRouter.use(requireAuth)

// POST /api/billing/checkout  { plan }
// Crée une session Stripe Checkout si configuré ; sinon renvoie un mode désactivé.
billingRouter.post('/checkout', asyncHandler(async (req, res) => {
  const { plan } = req.body || {}
  if (!PLANS.some((p) => p.id === plan)) throw httpError(400, 'Plan inconnu')

  if (!config.stripe.enabled) {
    return res.status(503).json({
      error: 'Paiement non configuré',
      hint: 'Renseigne STRIPE_SECRET_KEY et les STRIPE_PRICE_* pour activer le checkout.',
    })
  }

  // Intégration Stripe (chargée dynamiquement pour ne pas exiger la dépendance hors prod).
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(config.stripe.secretKey)
  const price = config.stripe.prices[plan]
  if (!price) throw httpError(400, `Price Stripe manquant pour le plan ${plan}`)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    client_reference_id: String(req.userId),
    success_url: `${config.corsOrigin}/?checkout=success`,
    cancel_url: `${config.corsOrigin}/?checkout=cancel`,
  })
  res.json({ url: session.url })
}))

// POST /api/billing/dev-unlock — DEV uniquement : passe l'utilisateur en premium.
// Permet de tester le déverrouillage sans Stripe.
billingRouter.post('/dev-unlock', asyncHandler(async (req, res) => {
  if (config.nodeEnv === 'production') throw httpError(403, 'Indisponible en production')
  await query("UPDATE users SET tier = 'premium' WHERE id = $1", [req.userId])
  await query(
    `INSERT INTO subscriptions (user_id, status, plan) VALUES ($1, 'active', 'dev')
     ON CONFLICT (user_id) DO UPDATE SET status = 'active', plan = 'dev', updated_at = now()`,
    [req.userId]
  )
  res.json({ tier: 'premium' })
}))
