import { useApp } from '../context/AppContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { PROFILES, BUDGETS, GOALS } from '../data/program.js'

export default function Compte() {
  const { profile, tier, setTier, reset, streak, online, user, logout } = useApp()

  const foodLabel = PROFILES.find((p) => p.id === profile.foodProfile)?.label
  const budgetLabel = BUDGETS.find((b) => b.id === profile.budget)?.label
  const goalLabel = GOALS.find((g) => g.id === profile.goal)?.label

  return (
    <div className="pb-6">
      <ScreenHeader subtitle="Mon espace" title="Compte" />

      <div className="space-y-5 px-5">
        {/* Carte profil */}
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-2xl font-black text-ink">
              {(profile.firstName || '?').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-extrabold">{profile.firstName || 'Toi'}</p>
              <p className="text-xs text-muted">🔥 {streak} jours de série</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide">
                {online
                  ? <span className="text-lime">● Connecté · {user.email}</span>
                  : <span className="text-muted">○ Mode démo (local)</span>}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Mini label="Objectif" value={goalLabel} />
            <Mini label="Profil" value={foodLabel} />
            <Mini label="Budget" value={budgetLabel} />
          </div>
        </div>

        {/* Statut d'abonnement */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Mon accès</p>
              <p className="mt-1 font-display text-xl font-extrabold">
                {tier === 'premium'
                  ? <span className="text-lime">Premium · complet</span>
                  : <span className="text-flame">Limité · PDF 17€</span>}
              </p>
            </div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tier === 'premium' ? 'bg-lime/15 text-lime' : 'bg-flame/15 text-flame'}`}>
              <Icon name={tier === 'premium' ? 'unlock' : 'lock'} size={22} strokeWidth={2.2} />
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-snug text-muted">
            {tier === 'premium'
              ? 'Tu as accès à tout : programmes hebdo, concepts, recettes bonus et communauté.'
              : 'Tu vois l’app, mais les contenus avancés sont verrouillés. Passe en illimité pour tout débloquer.'}
          </p>

          {/* Bascule de démonstration du verrouillage psychologique */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setTier('premium')}
              className={`rounded-xl py-3 text-sm font-bold transition ${tier === 'premium' ? 'bg-lime text-ink-900' : 'bg-ink-700 text-white'}`}
            >Premium</button>
            <button
              onClick={() => setTier('locked')}
              className={`rounded-xl py-3 text-sm font-bold transition ${tier === 'locked' ? 'bg-flame text-ink-900' : 'bg-ink-700 text-white'}`}
            >Limité (démo)</button>
          </div>
          <p className="mt-2.5 text-[10px] leading-snug text-faint">
            Bascule de démonstration : en mode « Limité », l’app floute les contenus avancés et affiche le bouton « Débloquer ».
          </p>
        </div>

        {/* Déconnexion / Réinitialiser */}
        {online && (
          <Button variant="ghost" size="md" onClick={logout} className="w-full gap-2">
            <Icon name="logout" size={16} strokeWidth={2.2} /> Se déconnecter
          </Button>
        )}
        <button
          onClick={() => { if (confirm('Réinitialiser toutes tes données locales ?')) reset() }}
          className="w-full rounded-2xl border border-ink-500/50 py-4 text-center text-sm font-semibold text-muted active:scale-[0.98] transition"
        >
          Réinitialiser mes données
        </button>
      </div>
    </div>
  )
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl bg-surface2/60 px-2 py-2">
      <p className="text-[10px] uppercase text-muted">{label}</p>
      <p className="text-xs font-bold leading-tight">{value || '—'}</p>
    </div>
  )
}
