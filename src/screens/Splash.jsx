import { useNavigate } from 'react-router-dom'
import { DISCLAIMER } from '../data/program.js'

export default function Splash() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-full flex-col items-center justify-between px-6 py-14 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="animate-flame text-7xl">🔥</div>
        <div className="animate-fade-up">
          <h1 className="text-4xl font-black leading-none">
            COACH<br />
            <span className="text-lime">PERTE DE POIDS</span>
          </h1>
          <p className="mt-4 max-w-[260px] text-base font-medium text-white/80">
            Tu ne réfléchis pas. Tu suis.<br />Tu progresses.
          </p>
        </div>
      </div>

      <div className="w-full space-y-3">
        <button onClick={() => navigate('/onboarding')} className="btn-primary w-full">
          Commencer
        </button>
        <button onClick={() => navigate('/onboarding')} className="btn-ghost w-full">
          J’ai déjà un compte
        </button>
        <p className="px-2 pt-2 text-[10px] leading-snug text-muted">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
