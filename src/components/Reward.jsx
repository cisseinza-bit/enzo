import { createContext, useContext, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './ui/Icon.jsx'

const RewardCtx = createContext(() => {})
export const useReward = () => useContext(RewardCtx)

// Micro-récompense : toast animé à ressort à chaque action complétée (dopamine loop).
export function RewardProvider({ children }) {
  const [reward, setReward] = useState(null)
  const fire = useCallback((msg = 'Bien joué') => {
    setReward({ msg, id: Date.now() })
    setTimeout(() => setReward(null), 1600)
  }, [])

  return (
    <RewardCtx.Provider value={fire}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-24 z-50 mx-auto flex max-w-app justify-center px-5">
        <AnimatePresence>
          {reward && (
            <motion.div
              key={reward.id}
              initial={{ scale: 0.6, opacity: 0, y: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink-900 shadow-glow"
            >
              <Icon name="flame" size={16} className="text-flame" strokeWidth={2.5} />
              {reward.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RewardCtx.Provider>
  )
}
