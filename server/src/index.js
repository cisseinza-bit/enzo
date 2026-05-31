import { createApp } from './app.js'
import { config } from './config.js'
import { pool } from './db/pool.js'

const app = createApp()

const server = app.listen(config.port, () => {
  console.log(`[api] Coach Perte de Poids — port ${config.port}`)
  console.log(`[api] génération : ${config.anthropic.enabled ? 'Anthropic' : 'déterministe'}`)
  console.log(`[api] paiement   : ${config.stripe.enabled ? 'Stripe' : 'désactivé'}`)
})

// Arrêt propre.
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    console.log(`\n[api] arrêt (${sig})…`)
    server.close(() => pool.end().then(() => process.exit(0)))
  })
}
