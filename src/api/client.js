// Client API léger pour le backend Coach Perte de Poids.
// Base configurable via VITE_API_URL ; le token JWT est persisté en localStorage.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const TOKEN_KEY = 'cpp-token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'content-type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.authorization = `Bearer ${token}`
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const api = {
  health: () => request('/health', { auth: false }),

  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),

  // Utilisateur
  me: () => request('/me'),
  updateProfile: (payload) => request('/me/profile', { method: 'PUT', body: payload }),

  // Programmes
  programs: () => request('/programs'),
  program: (week) => request(`/programs/${week}`),
  regenerate: (week) => request(`/programs/${week}/regenerate`, { method: 'POST' }),

  // Suivi
  weighIns: () => request('/tracking/weigh-ins'),
  addWeighIn: (weight, date) => request('/tracking/weigh-ins', { method: 'POST', body: { weight, date } }),
  tasks: (day) => request(`/tracking/tasks${day ? `?day=${day}` : ''}`),
  toggleTask: (taskKey, done, day) => request('/tracking/tasks', { method: 'POST', body: { taskKey, done, day } }),
  measurements: () => request('/tracking/measurements'),
  addMeasurement: (payload) => request('/tracking/measurements', { method: 'POST', body: payload }),

  // Billing
  plans: () => request('/billing/plans', { auth: false }),
  billingStatus: () => request('/billing/status'),
  checkout: (plan) => request('/billing/checkout', { method: 'POST', body: { plan } }),
  portal: () => request('/billing/portal', { method: 'POST' }),
  devUnlock: () => request('/billing/dev-unlock', { method: 'POST' }),
}
