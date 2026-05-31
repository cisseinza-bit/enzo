import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { OFFERS } from '../data/program.js'
import Icon from './ui/Icon.jsx'

function useCountdown(seconds = 6 * 3600 + 42 * 60) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const id = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

// Bannière offre limitée (modèle Higgsfield) — affichée aux non-abonnés.
export default function OfferBanner() {
  const { tier, weekNumber, setTier } = useApp()
  const time = useCountdown()
  if (tier === 'premium') return null
  const offer = OFFERS[(weekNumber - 1) % OFFERS.length]
  return (
    <div className="relative overflow-hidden rounded-3xl border border-flame/30 bg-gradient-to-br from-flame/15 via-ink-700 to-ink-700 p-5">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-flame/20 blur-2xl" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-flame">
            <Icon name="timer" size={13} strokeWidth={2.5} />
            <span className="tnum">Expire dans {time}</span>
          </p>
          <p className="mt-1 font-display text-xl font-extrabold leading-tight text-white">{offer.label}</p>
          <p className="text-xs font-medium text-muted">{offer.sub}</p>
        </div>
        <button
          onClick={() => setTier('premium')}
          className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-flame px-4 py-2.5 text-sm font-bold text-ink-900 shadow-glow-flame active:scale-95 transition"
        >
          <Icon name="unlock" size={15} strokeWidth={2.5} />
          Débloquer
        </button>
      </div>
    </div>
  )
}
