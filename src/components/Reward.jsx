import { createContext, useContext, useCallback, useState } from 'react'

const RewardCtx = createContext(() => {})
export const useReward = () => useContext(RewardCtx)

// Micro-récompense : petit pop animé à chaque action complétée (dopamine loop).
export function RewardProvider({ children }) {
  const [reward, setReward] = useState(null)
  const fire = useCallback((msg = 'Bien joué 🔥') => {
    setReward({ msg, id: Date.now() })
    setTimeout(() => setReward(null), 1400)
  }, [])
  return (
    <RewardCtx.Provider value={fire}>
      {children}
      {reward && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center">
          <div key={reward.id} className="animate-pop rounded-full bg-lime px-5 py-2 text-sm font-extrabold text-ink shadow-lg">
            {reward.msg}
          </div>
        </div>
      )}
    </RewardCtx.Provider>
  )
}
