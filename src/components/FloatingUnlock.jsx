import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from './Reward.jsx'
import Icon from './ui/Icon.jsx'

// Bouton flottant permanent — visible uniquement pour le tier "locked" (PDF 17€).
export default function FloatingUnlock() {
  const { tier, setTier } = useApp()
  const fire = useReward()
  if (tier === 'premium') return null
  return (
    <motion.button
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.3 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { setTier('premium'); fire('Accès complet débloqué') }}
      className="absolute bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink-900 shadow-glow"
    >
      <Icon name="unlock" size={17} strokeWidth={2.5} />
      Débloquer l’accès complet
    </motion.button>
  )
}
