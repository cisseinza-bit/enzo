import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, setToken, getToken } from '../api/client.js'
import { WEEK } from '../data/program.js'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const LOCAL_KEY = 'cpp-local-v2'   // état purement local (shopping, streak, démo offline)

// Historique de pesées mocké, utilisé en mode démo offline.
const DEMO_WEIGH_INS = [
  { date: '2026-05-04', weight: 82.4 },
  { date: '2026-05-11', weight: 81.1 },
  { date: '2026-05-18', weight: 80.6 },
  { date: '2026-05-25', weight: 79.8 },
]

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { shoppingChecked: {}, streak: 3 }
}

const today = () => new Date().toISOString().slice(0, 10)

export function AppProvider({ children }) {
  const [booting, setBooting] = useState(true)
  const [online, setOnline] = useState(false)   // backend joignable + authentifié
  const [authed, setAuthed] = useState(false)
  const [demo, setDemo] = useState(false)        // onboarding terminé hors-ligne

  const [user, setUser] = useState({ firstName: '', email: '', tier: 'premium' })
  const [profile, setProfile] = useState({
    firstName: '', goal: 'perte', foodProfile: 'europeen', budget: 'equilibre',
    startWeight: null, height: null,
  })
  const [program, setProgram] = useState(WEEK)   // forme identique au mock
  const [weekNumber] = useState(1)
  const [weighIns, setWeighIns] = useState([])
  const [doneTasks, setDoneTasks] = useState({}) // { 'YYYY-MM-DD:key': bool }
  const [local, setLocal] = useState(loadLocal)

  // Persiste l'état local (shopping, streak).
  useEffect(() => { localStorage.setItem(LOCAL_KEY, JSON.stringify(local)) }, [local])

  // Charge les données d'un utilisateur authentifié depuis l'API.
  const loadUserData = useCallback(async () => {
    const me = await api.me()
    setUser({ firstName: me.first_name, email: me.email, tier: me.tier })
    setProfile({
      firstName: me.first_name, goal: me.goal, foodProfile: me.food_profile,
      budget: me.budget, startWeight: me.start_weight, height: me.height,
    })
    const [prog, wi, tasks] = await Promise.all([
      api.program(weekNumber).catch(() => null),
      api.weighIns().catch(() => []),
      api.tasks(today()).catch(() => []),
    ])
    if (prog?.data) setProgram(prog.data)
    setWeighIns(wi.map((w) => ({ date: w.date.slice(0, 10), weight: Number(w.weight) })))
    const map = {}
    for (const t of tasks) map[`${t.day.slice(0, 10)}:${t.task_key}`] = t.done
    setDoneTasks(map)
    setAuthed(true)
    setOnline(true)
  }, [weekNumber])

  // Au démarrage : si un token existe, on tente de reprendre la session.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (getToken()) {
        try {
          await loadUserData()
        } catch (err) {
          // 401 → token périmé ; autre → backend injoignable, on reste sur splash.
          if (String(err.message).includes('401') || /invalide|expir/i.test(err.message)) {
            setToken(null)
          }
        }
      }
      if (!cancelled) setBooting(false)
    })()
    return () => { cancelled = true }
  }, [loadUserData])

  const onboarded = authed || demo

  const value = useMemo(() => ({
    booting, online, authed, onboarded, demo,
    today: today(),
    profile, user, program, weekNumber, weighIns,
    streak: local.streak ?? 0,
    tier: user.tier,
    shoppingChecked: local.shoppingChecked || {},

    // --- Auth / onboarding ---
    async completeOnboarding(form) {
      const profilePayload = {
        goal: form.goal, foodProfile: form.foodProfile, budget: form.budget,
        startWeight: form.startWeight ? Number(form.startWeight) : null,
        height: form.height ? Number(form.height) : null,
      }
      // Mode connecté : on enregistre le compte si email + mot de passe fournis.
      if (form.email && form.password) {
        try {
          const { token } = await api.register({
            email: form.email, password: form.password,
            firstName: form.firstName, profile: profilePayload,
          })
          setToken(token)
          await loadUserData()
          return { ok: true, online: true }
        } catch (err) {
          // Backend indisponible → on bascule en démo locale plutôt que de bloquer.
          if (/HTTP 4\d\d/.test(err.message) || /email|mot de passe|utilisé/i.test(err.message)) {
            return { ok: false, error: err.message }
          }
        }
      }
      // Démo offline : pas de compte, données mockées.
      setProfile({ firstName: form.firstName, ...profilePayload })
      setUser((u) => ({ ...u, firstName: form.firstName, tier: 'premium' }))
      setProgram(WEEK)
      setWeighIns(DEMO_WEIGH_INS)
      setDemo(true)
      return { ok: true, online: false }
    },

    async login(email, password) {
      const { token } = await api.login({ email, password })
      setToken(token)
      await loadUserData()
    },

    logout() {
      setToken(null)
      setAuthed(false); setOnline(false); setDemo(false)
      setWeighIns([]); setDoneTasks({}); setProgram(WEEK)
      setUser({ firstName: '', email: '', tier: 'premium' })
    },

    // --- Tier (déblocage premium) ---
    async setTier(tier) {
      if (online && tier === 'premium') {
        try { await api.devUnlock() } catch { /* ignore, on bascule quand même côté UI */ }
      }
      setUser((u) => ({ ...u, tier }))
    },

    // --- Tâches quotidiennes ---
    isTaskDone(key) {
      return !!doneTasks[`${today()}:${key}`]
    },
    toggleTask(key) {
      const d = today()
      const next = !doneTasks[`${d}:${key}`]
      setDoneTasks((m) => ({ ...m, [`${d}:${key}`]: next }))
      if (online) api.toggleTask(key, next, d).catch(() => {})
    },

    // --- Courses (local) ---
    toggleShopping(name) {
      setLocal((s) => ({ ...s, shoppingChecked: { ...s.shoppingChecked, [name]: !s.shoppingChecked?.[name] } }))
    },

    // --- Pesées ---
    async addWeighIn(weight) {
      const w = Number(weight)
      const d = today()
      setWeighIns((list) => {
        const without = list.filter((x) => x.date !== d)
        return [...without, { date: d, weight: w }].sort((a, b) => a.date.localeCompare(b.date))
      })
      if (online) api.addWeighIn(w).catch(() => {})
    },

    reset() {
      localStorage.removeItem(LOCAL_KEY)
      setToken(null)
      setLocal({ shoppingChecked: {}, streak: 3 })
      setAuthed(false); setOnline(false); setDemo(false)
      setWeighIns([]); setDoneTasks({}); setProgram(WEEK)
      setUser({ firstName: '', email: '', tier: 'premium' })
      setProfile({ firstName: '', goal: 'perte', foodProfile: 'europeen', budget: 'equilibre', startWeight: null, height: null })
    },
  }), [booting, online, authed, demo, profile, user, program, weekNumber, weighIns, doneTasks, local, loadUserData])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
