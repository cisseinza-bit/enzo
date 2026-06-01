import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../api/client.js'
import { useReward } from '../components/Reward.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'

const PERKS = [
  'Nouveau programme chaque vendredi',
  'Batch cooking guidé du dimanche',
  'Concepts & recettes bonus débloqués',
  'Suivi corporel + bilan mensuel',
  'Communauté privée',
]

// Fallback si l'API est injoignable (mode démo).
const FALLBACK = [
  { id: 'monthly', label: 'Mensuel sans engagement', price: 39, period: 'mois' },
  { id: 'quarterly', label: 'Trimestriel', price: 97, period: '3 mois', save: '-17%' },
  { id: 'yearly', label: 'Annuel', price: 297, period: 'an', save: '-37%' },
]

export default function Paywall() {
  const navigate = useNavigate()
  const { online, setTier } = useApp()
  const fire = useReward()
  const [plans, setPlans] = useState(FALLBACK)
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [selected, setSelected] = useState('quarterly')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.plans().then((d) => {
      if (d.plans?.length) setPlans(d.plans)
      setStripeEnabled(!!d.enabled)
    }).catch(() => {})
  }, [])

  const subscribe = async () => {
    setBusy(true); setError('')
    try {
      if (online && stripeEnabled) {
        // Vrai paiement : on part vers Stripe Checkout.
        const { url } = await api.checkout(selected)
        window.location.href = url
        return
      }
      // Pas de Stripe (démo / clé absente) : déverrouillage direct.
      await setTier('premium')
      fire('Bienvenue dans le programme complet')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Paiement indisponible pour le moment.')
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden px-5 pt-[max(env(safe-area-inset-top),24px)] pb-8">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-lime/12 blur-[70px]" />

      <button onClick={() => navigate(-1)} aria-label="Fermer" className="relative mb-4 self-start text-muted">
        <Icon name="back" size={26} />
      </button>

      <div className="relative">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/15 text-lime shadow-glow">
          <Icon name="unlock" size={26} strokeWidth={2.2} />
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tightest">
          Passe en<br /><span className="text-lime">illimité</span>
        </h1>
        <p className="mt-2 text-sm text-muted">Tu suis. Tu progresses. On s’occupe du reste.</p>
      </div>

      {/* Avantages */}
      <ul className="relative mt-6 space-y-2.5">
        {PERKS.map((p) => (
          <li key={p} className="flex items-center gap-3 text-sm font-medium">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
              <Icon name="check" size={14} strokeWidth={3} />
            </span>
            {p}
          </li>
        ))}
      </ul>

      {/* Plans */}
      <div className="relative mt-6 space-y-2.5">
        {plans.map((p) => {
          const active = selected === p.id
          return (
            <motion.button
              key={p.id} onClick={() => setSelected(p.id)} whileTap={{ scale: 0.99 }}
              className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-colors ${
                active ? 'border-lime bg-lime/[0.07]' : 'border-ink-500/60 bg-surface'
              }`}
            >
              <div>
                <p className="font-bold">{p.label}</p>
                <p className="tnum text-xs text-muted">
                  {p.id === 'monthly' ? 'Flexible, résiliable à tout moment' : `Soit ${(p.price / (p.id === 'quarterly' ? 3 : 12)).toFixed(0)}€/mois`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {p.save && <span className="chip bg-flame/15 text-flame">{p.save}</span>}
                <span className="tnum font-display text-2xl font-extrabold">{p.price}€</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? 'border-lime bg-lime text-ink-900' : 'border-ink-500'}`}>
                  {active && <Icon name="check" size={12} strokeWidth={3} />}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {error && <p className="relative mt-4 rounded-xl bg-flame/15 px-4 py-3 text-sm text-flame">{error}</p>}

      <div className="relative mt-auto pt-6">
        <Button onClick={subscribe} disabled={busy} className="gap-2">
          {busy ? 'Redirection…' : <>Débloquer maintenant <Icon name="arrow" size={18} strokeWidth={2.5} /></>}
        </Button>
        <p className="mt-3 text-center text-[10px] leading-snug text-faint">
          {stripeEnabled
            ? 'Paiement sécurisé via Stripe. Sans engagement sur l’offre mensuelle.'
            : 'Mode démonstration : le paiement réel s’active dès que Stripe est configuré.'}
        </p>
      </div>
    </div>
  )
}
