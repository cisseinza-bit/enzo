import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../components/ui/Icon.jsx'
import { PROFILES, BUDGETS, DISCLAIMER } from '../data/program.js'

const STAGES = [
  'Analyse de ton profil alimentaire…',
  'Calcul de tes calories cibles…',
  'Sélection des féculents malins…',
  'Construction de tes 7 jours…',
  'Préparation du batch cooking…',
  'Programme corde à sauter…',
]

export default function Generating() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (i < STAGES.length) {
      const t = setTimeout(() => setI(i + 1), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => navigate('/'), 900)
    return () => clearTimeout(t)
  }, [i, navigate])

  const done = i >= STAGES.length
  const pct = Math.round((Math.min(i, STAGES.length) / STAGES.length) * 100)
  const foodLabel = PROFILES.find((p) => p.id === profile.foodProfile)?.label
  const budgetLabel = BUDGETS.find((b) => b.id === profile.budget)?.label

  return (
    <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-8 py-12 text-center">
      <div className="pointer-events-none absolute top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-lime/10 blur-[70px]" />
      <div className="relative flex flex-1 flex-col items-center justify-center">
        {/* Pastille animée : spinner en cours, check à la fin */}
        <motion.div
          animate={done ? { scale: [0.8, 1.1, 1] } : { rotate: 360 }}
          transition={done ? { duration: 0.5 } : { repeat: Infinity, duration: 2, ease: 'linear' }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-ink-700 text-lime shadow-glow"
        >
          <Icon name={done ? 'check' : 'settings'} size={40} strokeWidth={2.2} />
        </motion.div>

        <h2 className="mt-7 font-display text-3xl font-extrabold leading-[0.95] tracking-tightest">
          {done ? 'Ton programme est prêt,' : 'On crée le programme de'}<br />
          <span className="text-lime">{profile.firstName || 'champion'}</span>
        </h2>

        {/* Mini-récap du profil pris en compte */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {foodLabel && <span className="chip border border-ink-500/60 bg-ink-700 text-white">{foodLabel}</span>}
          {budgetLabel && <span className="chip border border-ink-500/60 bg-ink-700 text-white">{budgetLabel}</span>}
          <span className="chip border border-ink-500/60 bg-ink-700 text-white">Corde quotidienne</span>
        </div>

        <div className="mt-8 h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-ink-700">
          <motion.div className="h-full rounded-full bg-lime" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>

        <ul className="mt-6 w-full max-w-[280px] space-y-2.5 text-left">
          {STAGES.map((s, idx) => {
            const state = idx < i ? 'done' : idx === i ? 'active' : 'todo'
            return (
              <li key={s} className={`flex items-center gap-2.5 text-sm transition ${state === 'done' ? 'text-white' : state === 'active' ? 'text-lime' : 'text-faint'}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${state === 'done' ? 'bg-lime/15 text-lime' : state === 'active' ? 'bg-lime/15 text-lime' : 'bg-ink-700'}`}>
                  {state === 'done' ? <Icon name="check" size={12} strokeWidth={3} />
                    : state === 'active' ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}><Icon name="settings" size={12} /></motion.span>
                    : <span className="h-1.5 w-1.5 rounded-full bg-faint" />}
                </span>
                {s}
              </li>
            )
          })}
        </ul>

        <p className="mt-6 max-w-[280px] text-xs leading-snug text-muted">
          {done
            ? 'On t’emmène à ton tableau de bord…'
            : 'Tu n’as rien à calculer. On s’occupe de tout — tu n’as plus qu’à suivre.'}
        </p>
      </div>

      <p className="relative max-w-[300px] text-[10px] leading-snug text-faint">{DISCLAIMER}</p>
    </div>
  )
}
