import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import { RewardProvider } from './components/Reward.jsx'
import BottomNav from './components/BottomNav.jsx'

import Splash from './screens/Splash.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Generating from './screens/Generating.jsx'
import Home from './screens/Home.jsx'
import Programme from './screens/Programme.jsx'
import Sport from './screens/Sport.jsx'
import Suivi from './screens/Suivi.jsx'
import Decouverte from './screens/Decouverte.jsx'

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
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/generation" element={<Generating />} />
          <Route path="/" element={<WithNav><Home /></WithNav>} />
          <Route path="/programme" element={<WithNav><Programme /></WithNav>} />
          <Route path="/sport" element={<WithNav><Sport /></WithNav>} />
          <Route path="/suivi" element={<WithNav><Suivi /></WithNav>} />
          <Route path="/decouverte" element={<WithNav><Decouverte /></WithNav>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </RewardProvider>
  )
}

function WithNav({ children }) {
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-2">{children}</main>
      <BottomNav />
    </>
  )
}
