import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { errorHandler } from './middleware/error.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import { programsRouter } from './routes/programs.js'
import { trackingRouter } from './routes/tracking.js'
import { billingRouter } from './routes/billing.js'
import { webhookRouter } from './routes/webhook.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: config.corsOrigin, credentials: true }))

  // Le webhook Stripe doit recevoir le body brut → monté avant express.json().
  app.use('/api/webhook', webhookRouter)

  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (req, res) => res.json({
    ok: true,
    anthropic: config.anthropic.enabled ? 'live' : 'deterministic',
    stripe: config.stripe.enabled ? 'live' : 'disabled',
  }))

  app.use('/api/auth', authRouter)
  app.use('/api/me', meRouter)
  app.use('/api/programs', programsRouter)
  app.use('/api/tracking', trackingRouter)
  app.use('/api/billing', billingRouter)

  app.use((req, res) => res.status(404).json({ error: 'Route inconnue' }))
  app.use(errorHandler)

  return app
}
