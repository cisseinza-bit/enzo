import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
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
    <div className="flex min-h-full flex-col items-center justify-between px-8 py-12 text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className={`text-6xl ${done ? 'animate-pop' : 'animate-flame'}`}>{done ? '🎉' : '⚙️'}</div>
        <h2 className="mt-6 text-2xl font-extrabold">
          {done ? 'Ton programme est prêt,' : 'On crée le programme de'}<br />
          <span className="text-lime">{profile.firstName || 'champion'}</span>
        </h2>

        {/* Mini-récap du profil pris en compte */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {foodLabel && <span className="chip bg-surface2 text-white">🍽️ {foodLabel}</span>}
          {budgetLabel && <span className="chip bg-surface2 text-white">🛒 {budgetLabel}</span>}
          <span className="chip bg-surface2 text-white">🪢 Corde quotidienne</span>
        </div>

        <div className="mt-8 h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-surface2">
          <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        <ul className="mt-6 w-full max-w-[280px] space-y-2 text-left">
          {STAGES.map((s, idx) => (
            <li key={s} className={`flex items-center gap-2 text-sm transition ${idx < i ? 'text-white' : idx === i ? 'text-lime' : 'text-muted/50'}`}>
              <span>{idx < i ? '✅' : idx === i ? '⏳' : '○'}</span> {s}
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[280px] text-xs leading-snug text-muted">
          {done
            ? 'On t’emmène à ton tableau de bord…'
            : 'Tu n’as rien à calculer. On s’occupe de tout — tu n’as plus qu’à suivre.'}
        </p>
      </div>

      <p className="max-w-[300px] text-[10px] leading-snug text-muted">{DISCLAIMER}</p>
    </div>
  )
}
