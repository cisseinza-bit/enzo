import { useApp } from '../context/AppContext.jsx'
import Icon from './ui/Icon.jsx'

// Verrouillage psychologique : utilisateurs PDF 17€ voient le contenu flouté + cadenas.
export default function LockOverlay({ children, label = 'Réservé aux abonnés' }) {
  const { tier } = useApp()
  if (tier === 'premium') return children
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="pointer-events-none select-none opacity-40 blur-[6px]">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/50 backdrop-blur-[2px]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-700 text-lime shadow-glow">
          <Icon name="lock" size={18} strokeWidth={2.2} />
        </span>
        <span className="text-xs font-semibold text-white/90">{label}</span>
      </div>
    </div>
  )
}
