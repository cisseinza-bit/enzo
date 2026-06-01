import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config.js'

// Client Anthropic partagé, instancié à la demande (et seulement si une clé existe).
let _client = null
export function getAnthropic() {
  if (!config.anthropic.enabled) return null
  if (!_client) {
    _client = new Anthropic({
      apiKey: config.anthropic.apiKey,
      baseURL: config.anthropic.baseUrl,
    })
  }
  return _client
}
