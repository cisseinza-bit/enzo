import 'dotenv/config'

// Configuration centralisée, lue depuis l'environnement.
export const config = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://coach:coach@127.0.0.1:5432/coach',

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    baseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    get enabled() { return !!this.apiKey },
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    prices: {
      monthly: process.env.STRIPE_PRICE_MONTHLY || '',
      quarterly: process.env.STRIPE_PRICE_QUARTERLY || '',
      yearly: process.env.STRIPE_PRICE_YEARLY || '',
    },
    get enabled() { return !!this.secretKey },
  },

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}
