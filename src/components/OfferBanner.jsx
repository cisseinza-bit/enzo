import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { OFFERS } from '../data/program.js'

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
    <div className="rounded-2xl bg-gradient-to-r from-flame to-[#ff8d5e] p-4 text-ink">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">Offre limitée · expire dans {time}</p>
          <p className="text-lg font-extrabold leading-tight">{offer.label}</p>
          <p className="text-xs font-semibold opacity-80">{offer.sub}</p>
        </div>
        <button
          onClick={() => setTier('premium')}
          className="shrink-0 rounded-xl bg-ink px-4 py-2 text-sm font-extrabold text-lime active:scale-95 transition"
        >
          🔓 Débloquer
        </button>
      </div>
    </div>
  )
}
