// Petit helper pour gérer les erreurs async sans try/catch partout.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Gestionnaire d'erreurs final.
export function errorHandler(err, req, res, _next) {
  console.error('[error]', err.message)
  if (err.status) return res.status(err.status).json({ error: err.message })
  res.status(500).json({ error: 'Erreur serveur' })
}

export function httpError(status, message) {
  const e = new Error(message)
  e.status = status
  return e
}
