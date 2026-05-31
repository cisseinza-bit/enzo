import { Router } from 'express'
import express from 'express'
import { query } from '../db/pool.js'
import { config } from '../config.js'

// Webhook Stripe — monté AVANT le parser JSON global car il a besoin du body brut.
export const webhookRouter = Router()

webhookRouter.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!config.stripe.enabled || !config.stripe.webhookSecret) {
    return res.status(503).json({ error: 'Webhook Stripe non configuré' })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(config.stripe.secretKey)

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body, req.headers['stripe-signature'], config.stripe.webhookSecret
    )
  } catch (err) {
    console.error('[webhook] signature invalide', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object
        const userId = Number(s.client_reference_id)
        if (userId) {
          await query("UPDATE users SET tier = 'premium' WHERE id = $1", [userId])
          await query(
            `INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_sub_id, status, plan)
             VALUES ($1, $2, $3, 'active', $4)
             ON CONFLICT (user_id) DO UPDATE SET
               stripe_customer_id = EXCLUDED.stripe_customer_id,
               stripe_sub_id = EXCLUDED.stripe_sub_id,
               status = 'active', plan = EXCLUDED.plan, updated_at = now()`,
            [userId, s.customer, s.subscription, s.metadata?.plan || 'premium']
          )
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await query(
          "UPDATE subscriptions SET status = 'canceled', updated_at = now() WHERE stripe_sub_id = $1",
          [sub.id]
        )
        await query(
          "UPDATE users SET tier = 'locked' WHERE id = (SELECT user_id FROM subscriptions WHERE stripe_sub_id = $1)",
          [sub.id]
        )
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('[webhook] traitement échoué', err.message)
    return res.status(500).json({ error: 'Erreur traitement webhook' })
  }

  res.json({ received: true })
})
