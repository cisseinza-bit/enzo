import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DISCLAIMER } from '../data/program.js'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

export default function Splash() {
  const navigate = useNavigate()
  return (
    <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-6 py-16 text-center">
      {/* Halo lumineux d'ambiance */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime/15 blur-[80px]" />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-ink-700 shadow-glow"
        >
          <span className="absolute inset-0 rounded-3xl bg-lime/20 blur-md" />
          <Icon name="flame" size={48} className="relative text-lime" strokeWidth={2.2} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 24 }}
        >
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tightest">
            Coach<br /><span className="text-lime">Perte de poids</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[260px] text-base font-medium text-white/70">
            Tu ne réfléchis pas. Tu suis.<br />Tu progresses.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative w-full space-y-3"
      >
        <Button onClick={() => navigate('/onboarding')} className="gap-2">
          Commencer <Icon name="arrow" size={18} strokeWidth={2.5} />
        </Button>
        <Button variant="ghost" onClick={() => navigate('/connexion')}>
          J’ai déjà un compte
        </Button>
        <p className="px-2 pt-2 text-[10px] leading-snug text-faint">{DISCLAIMER}</p>
      </motion.div>
    </div>
  )
}
