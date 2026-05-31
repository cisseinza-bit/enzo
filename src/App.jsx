import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import { RewardProvider } from './components/Reward.jsx'
import BottomNav from './components/BottomNav.jsx'
import FloatingUnlock from './components/FloatingUnlock.jsx'

import Splash from './screens/Splash.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Generating from './screens/Generating.jsx'
import Home from './screens/Home.jsx'
import Programme from './screens/Programme.jsx'
import Sport from './screens/Sport.jsx'
import Suivi from './screens/Suivi.jsx'
import Decouverte from './screens/Decouverte.jsx'
import Compte from './screens/Compte.jsx'

export default function App() {
  const { onboarded } = useApp()
  const location = useLocation()

  // Tant que l'onboarding n'est pas fait, on enferme l'utilisateur dans le tunnel d'entrée.
  const inEntryFlow = ['/splash', '/onboarding', '/generation'].includes(location.pathname)

  if (!onboarded && !inEntryFlow) {
    return (
      <div className="app-shell">
        <Splash />
      </div>
    )
  }

  return (
    <RewardProvider>
      <div className="app-shell flex flex-col">
        <Routes location={location}>
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/generation" element={<Generating />} />
          <Route path="/" element={<WithNav key={location.pathname}><Home /></WithNav>} />
          <Route path="/programme" element={<WithNav key={location.pathname}><Programme /></WithNav>} />
          <Route path="/sport" element={<WithNav key={location.pathname}><Sport /></WithNav>} />
          <Route path="/suivi" element={<WithNav key={location.pathname}><Suivi /></WithNav>} />
          <Route path="/decouverte" element={<WithNav key={location.pathname}><Decouverte /></WithNav>} />
          <Route path="/compte" element={<WithNav key={location.pathname}><Compte /></WithNav>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </RewardProvider>
  )
}

function WithNav({ children }) {
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-2">
        {/* La clé sur la route relance l'animation d'entrée à chaque changement d'écran */}
        <div className="animate-fade-up">{children}</div>
      </main>
      <FloatingUnlock />
      <BottomNav />
    </>
  )
}
