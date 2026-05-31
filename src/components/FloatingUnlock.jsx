import { useApp } from '../context/AppContext.jsx'
import { useReward } from './Reward.jsx'

// Bouton flottant permanent — visible uniquement pour le tier "locked" (PDF 17€).
// "Débloquer l'accès complet" : conversion vers l'abonnement.
export default function FloatingUnlock() {
  const { tier, setTier } = useApp()
  const fire = useReward()
  if (tier === 'premium') return null
  return (
    <button
      onClick={() => { setTier('premium'); fire('Accès complet débloqué 🔓') }}
      className="absolute bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-lime px-4 py-3 text-sm font-extrabold text-ink shadow-[0_8px_24px_rgba(200,241,53,0.35)] active:scale-95 transition animate-pop"
    >
      🔓 Débloquer l’accès complet
    </button>
  )
}
