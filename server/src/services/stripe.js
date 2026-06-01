import Stripe from 'stripe'
import { config } from '../config.js'

// Client Stripe partagé, instancié à la demande (et seulement si une clé existe).
let _stripe = null
export function getStripe() {
  if (!config.stripe.enabled) return null
  if (!_stripe) _stripe = new Stripe(config.stripe.secretKey)
  return _stripe
}
