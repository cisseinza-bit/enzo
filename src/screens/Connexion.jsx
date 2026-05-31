import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../components/ui/Icon.jsx'

export default function Connexion() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setBusy(true); setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Connexion impossible.')
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col px-6 pt-[max(env(safe-area-inset-top),32px)] pb-10">
      <button onClick={() => navigate('/splash')} aria-label="Retour" className="mb-8 self-start text-muted">
        <Icon name="back" size={26} />
      </button>

      <div className="flex-1">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-700 text-lime shadow-glow">
            <Icon name="flame" size={32} strokeWidth={2.2} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tightest">Content de te revoir</h1>
          <p className="mt-2 text-sm text-muted">Reprends là où tu t’es arrêté.</p>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted">Email</span>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@email.fr" autoCapitalize="none" autoCorrect="off"
              className="w-full rounded-2xl border border-surface2 bg-surface px-5 py-4 text-lg font-semibold outline-none focus:border-lime"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted">Mot de passe</span>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="w-full rounded-2xl border border-surface2 bg-surface px-5 py-4 text-lg font-semibold outline-none focus:border-lime"
            />
          </label>
          {error && <p className="rounded-xl bg-flame/15 px-4 py-3 text-sm text-flame">{error}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={submit} disabled={busy || !email || !password} className={`btn-primary w-full ${busy || !email || !password ? 'opacity-40' : ''}`}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
        <p className="text-center text-xs text-muted">
          Pas encore de compte ? <Link to="/onboarding" className="font-bold text-lime">Commencer</Link>
        </p>
      </div>
    </div>
  )
}
