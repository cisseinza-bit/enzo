import { motion } from 'framer-motion'

// Transition d'entrée d'écran : léger glissement + fondu, ressort doux.
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.6 }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  )
}
