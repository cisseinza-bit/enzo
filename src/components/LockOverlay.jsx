import { useApp } from '../context/AppContext.jsx'

// Verrouillage psychologique : utilisateurs PDF 17€ voient le contenu flouté + cadenas.
export default function LockOverlay({ children, label = 'Réservé aux abonnés' }) {
  const { tier } = useApp()
  if (tier === 'premium') return children
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/40">
        <span className="text-2xl">🔒</span>
        <span className="text-xs font-semibold text-white/90">{label}</span>
      </div>
    </div>
  )
}
