import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './context/AppContext.jsx'
import { RewardProvider } from './components/Reward.jsx'
import BottomNav from './components/BottomNav.jsx'
import FloatingUnlock from './components/FloatingUnlock.jsx'
import PageTransition from './components/PageTransition.jsx'

import Splash from './screens/Splash.jsx'
import Connexion from './screens/Connexion.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Generating from './screens/Generating.jsx'
import Home from './screens/Home.jsx'
import Programme from './screens/Programme.jsx'
import Sport from './screens/Sport.jsx'
import Suivi from './screens/Suivi.jsx'
import Decouverte from './screens/Decouverte.jsx'
import Compte from './screens/Compte.jsx'
import Paywall from './screens/Paywall.jsx'
import Bilan from './screens/Bilan.jsx'

export default function App() {
  const { onboarded, booting, refresh } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  // Retour de Stripe Checkout : on rafraîchit le tier et on nettoie l'URL.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('checkout') === 'success') {
      refresh?.()
      navigate(location.pathname, { replace: true })
    }
  }, [location.search, location.pathname, refresh, navigate])

  // Reprise de session en cours : court écran de chargement.
  if (booting) {
    return (
      <div className="app-shell flex items-center justify-center">
        <span className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-lime/30 animate-pulse-ring" />
          <span className="h-3 w-3 rounded-full bg-lime" />
        </span>
      </div>
    )
  }

  const inEntryFlow = ['/splash', '/connexion', '/onboarding', '/generation', '/abonnement'].includes(location.pathname)

  if (!onboarded && !inEntryFlow) {
    return (
      <div className="app-shell grain">
        <Routes location={location}>
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Splash />} />
        </Routes>
      </div>
    )
  }

  return (
    <RewardProvider>
      <div className="app-shell grain flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/splash" element={<Splash />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/generation" element={<Generating />} />
            <Route path="/abonnement" element={<Paywall />} />
            <Route path="/" element={<WithNav><Home /></WithNav>} />
            <Route path="/programme" element={<WithNav><Programme /></WithNav>} />
            <Route path="/sport" element={<WithNav><Sport /></WithNav>} />
            <Route path="/suivi" element={<WithNav><Suivi /></WithNav>} />
            <Route path="/bilan" element={<WithNav><Bilan /></WithNav>} />
            <Route path="/decouverte" element={<WithNav><Decouverte /></WithNav>} />
            <Route path="/compte" element={<WithNav><Compte /></WithNav>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </RewardProvider>
  )
}

function WithNav({ children }) {
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-2">
        <PageTransition>{children}</PageTransition>
      </main>
      <FloatingUnlock />
      <BottomNav />
    </>
  )
}
