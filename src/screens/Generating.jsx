import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

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
    const t = setTimeout(() => navigate('/'), 600)
    return () => clearTimeout(t)
  }, [i, navigate])

  const pct = Math.round((i / STAGES.length) * 100)

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 text-center">
      <div className="animate-flame text-6xl">⚙️</div>
      <h2 className="mt-6 text-2xl font-extrabold">
        On crée le programme de<br /><span className="text-lime">{profile.firstName || 'champion'}</span>
      </h2>

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
    </div>
  )
}
