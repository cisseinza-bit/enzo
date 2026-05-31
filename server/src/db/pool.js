import pg from 'pg'
import { config } from '../config.js'

// Pool partagé pour toute l'application.
export const pool = new pg.Pool({ connectionString: config.databaseUrl })

pool.on('error', (err) => {
  console.error('[db] erreur inattendue du pool', err)
})

export const query = (text, params) => pool.query(text, params)
