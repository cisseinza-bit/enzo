import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const STORAGE_KEY = 'cpp-state-v1'

const defaultState = {
  onboarded: false,
  profile: {
    firstName: '',
    goal: 'perte',
    foodProfile: 'europeen',
    budget: 'equilibre',
    startWeight: null,
    height: null,
  },
  tier: 'premium',        // 'locked' (PDF 17€) | 'premium' (abonné)
  streak: 3,
  weekNumber: 1,
  doneTasks: {},          // { '2026-05-31:rope': true, ... }
  shoppingChecked: {},    // { 'Filets de poulet': true }
  weighIns: [             // suivi corporel (mock historique)
    { date: '2026-05-04', weight: 82.4 },
    { date: '2026-05-11', weight: 81.1 },
    { date: '2026-05-18', weight: 80.6 },
    { date: '2026-05-25', weight: 79.8 },
  ],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultState, ...JSON.parse(raw) }
  } catch (e) { /* ignore */ }
  return defaultState
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const today = new Date().toISOString().slice(0, 10)

  const value = useMemo(() => ({
    ...state,
    today,

    completeOnboarding(profile) {
      setState((s) => ({ ...s, onboarded: true, profile: { ...s.profile, ...profile } }))
    },
    setTier(tier) {
      setState((s) => ({ ...s, tier }))
    },
    toggleTask(key) {
      setState((s) => {
        const k = `${today}:${key}`
        const doneTasks = { ...s.doneTasks, [k]: !s.doneTasks[k] }
        return { ...s, doneTasks }
      })
    },
    isTaskDone(key) {
      return !!state.doneTasks[`${today}:${key}`]
    },
    toggleShopping(name) {
      setState((s) => ({
        ...s,
        shoppingChecked: { ...s.shoppingChecked, [name]: !s.shoppingChecked[name] },
      }))
    },
    addWeighIn(weight) {
      setState((s) => ({
        ...s,
        weighIns: [...s.weighIns, { date: today, weight: Number(weight) }],
      }))
    },
    reset() {
      localStorage.removeItem(STORAGE_KEY)
      setState(defaultState)
    },
  }), [state, today])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
