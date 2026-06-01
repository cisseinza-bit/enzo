import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, httpError } from '../middleware/error.js'
import { config } from '../config.js'
import { getStripe } from '../services/stripe.js'

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

// GET /api/billing/status — état de l'abonnement de l'utilisateur courant.
billingRouter.get('/status', asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT u.tier, s.status, s.plan, s.current_period_end
     FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id
     WHERE u.id = $1`,
    [req.userId]
  )
  res.json(rows[0] || { tier: 'locked', status: 'inactive' })
}))

// POST /api/billing/checkout  { plan }
// Crée une session Stripe Checkout si configuré ; sinon renvoie un mode désactivé.
billingRouter.post('/checkout', asyncHandler(async (req, res) => {
  const { plan } = req.body || {}
  if (!PLANS.some((p) => p.id === plan)) throw httpError(400, 'Plan inconnu')

  const stripe = getStripe()
  if (!stripe) {
    return res.status(503).json({
      error: 'Paiement non configuré',
      hint: 'Renseigne STRIPE_SECRET_KEY et les STRIPE_PRICE_* pour activer le checkout.',
    })
  }

  const price = config.stripe.prices[plan]
  if (!price) throw httpError(400, `Price Stripe manquant pour le plan ${plan}`)

  // Email du client pour préremplir le checkout + retrouver le compte au webhook.
  const { rows } = await query('SELECT email, stripe_customer_id FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id WHERE u.id = $1', [req.userId])
  const user = rows[0] || {}

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    client_reference_id: String(req.userId),
    customer: user.stripe_customer_id || undefined,
    customer_email: user.stripe_customer_id ? undefined : user.email,
    metadata: { userId: String(req.userId), plan },
    subscription_data: { metadata: { userId: String(req.userId), plan } },
    success_url: `${config.corsOrigin}/?checkout=success`,
    cancel_url: `${config.corsOrigin}/?checkout=cancel`,
    allow_promotion_codes: true,
  })
  res.json({ url: session.url })
}))

// POST /api/billing/portal — ouvre le portail client Stripe (gérer/annuler l'abo).
billingRouter.post('/portal', asyncHandler(async (req, res) => {
  const stripe = getStripe()
  if (!stripe) return res.status(503).json({ error: 'Paiement non configuré' })

  const { rows } = await query('SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1', [req.userId])
  const customer = rows[0]?.stripe_customer_id
  if (!customer) throw httpError(400, 'Aucun abonnement actif')

  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${config.corsOrigin}/compte`,
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
