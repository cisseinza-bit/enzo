import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { PROFILES, BUDGETS, GOALS, DISCLAIMER } from '../data/program.js'

const TOTAL = 6

export default function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '', goal: 'perte', foodProfile: 'europeen',
    budget: 'equilibre', startWeight: '', height: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const next = () => (step < TOTAL - 1 ? setStep(step + 1) : finish())
  const back = () => (step > 0 ? setStep(step - 1) : navigate('/splash'))

  const finish = () => {
    completeOnboarding({
      ...form,
      startWeight: form.startWeight ? Number(form.startWeight) : null,
      height: form.height ? Number(form.height) : null,
    })
    navigate('/generation')
  }

  const canNext = {
    0: form.firstName.trim().length > 0,
    1: !!form.goal,
    2: !!form.foodProfile,
    3: !!form.budget,
    4: !!form.startWeight && !!form.height,
    5: true,
  }[step]

  return (
    <div className="flex min-h-full flex-col px-5 pt-[max(env(safe-area-inset-top),24px)] pb-8">
      {/* Barre de progression */}
      <div className="mb-8 flex items-center gap-3">
        <button onClick={back} className="text-2xl text-muted">‹</button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface2">
          <div className="h-full rounded-full bg-lime transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-muted">{step + 1}/{TOTAL}</span>
      </div>

      <div key={step} className="flex-1 animate-fade-up">
        {step === 0 && (
          <Step title="Comment tu t’appelles ?" sub="On personnalise tout pour toi.">
            <input
              autoFocus value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
              placeholder="Ton prénom"
              className="w-full rounded-2xl border border-surface2 bg-surface px-5 py-4 text-lg font-semibold outline-none focus:border-lime"
            />
          </Step>
        )}

        {step === 1 && (
          <Step title="Ton objectif principal ?">
            <CardChoice options={GOALS} value={form.goal} onChange={(v) => set('goal', v)} />
          </Step>
        )}

        {step === 2 && (
          <Step title="Ton profil alimentaire" sub="C’est ce qui rend ton programme unique.">
            <CardChoice
              options={PROFILES.map((p) => ({ id: p.id, label: p.label, emoji: p.emoji, desc: p.desc }))}
              value={form.foodProfile} onChange={(v) => set('foodProfile', v)} two
            />
          </Step>
        )}

        {step === 3 && (
          <Step title="Ton budget courses / semaine">
            <CardChoice
              options={BUDGETS.map((b) => ({ id: b.id, label: b.label, desc: b.range }))}
              value={form.budget} onChange={(v) => set('budget', v)}
            />
          </Step>
        )}

        {step === 4 && (
          <Step title="Tes mesures de départ" sub="Le point de comparaison du mois 1.">
            <div className="space-y-3">
              <NumField label="Poids actuel (kg)" value={form.startWeight} onChange={(v) => set('startWeight', v)} placeholder="80" />
              <NumField label="Taille (cm)" value={form.height} onChange={(v) => set('height', v)} placeholder="175" />
              <p className="rounded-xl bg-surface2/50 px-4 py-3 text-xs leading-snug text-muted">
                Le poids varie de 1 à 2 kg par jour, c’est normal. On ne réagit pas à un jour — on regarde la tendance du mois.
              </p>
            </div>
          </Step>
        )}

        {step === 5 && (
          <Step title="Tout est prêt." sub="Voici ce qu’on a retenu :">
            <ul className="space-y-2 text-sm">
              <Recap label="Prénom" value={form.firstName} />
              <Recap label="Objectif" value={GOALS.find((g) => g.id === form.goal)?.label} />
              <Recap label="Profil" value={PROFILES.find((p) => p.id === form.foodProfile)?.label} />
              <Recap label="Budget" value={BUDGETS.find((b) => b.id === form.budget)?.label} />
              <Recap label="Départ" value={`${form.startWeight || '—'} kg · ${form.height || '—'} cm`} />
            </ul>
            <p className="mt-5 text-[10px] leading-snug text-muted">{DISCLAIMER}</p>
          </Step>
        )}
      </div>

      <button onClick={next} disabled={!canNext} className={`btn-primary w-full ${!canNext ? 'opacity-40' : ''}`}>
        {step === TOTAL - 1 ? 'Générer mon programme' : 'Continuer'}
      </button>
    </div>
  )
}

function Step({ title, sub, children }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold leading-tight">{title}</h2>
      {sub && <p className="mt-2 text-sm text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function CardChoice({ options, value, onChange, two }) {
  return (
    <div className={`grid gap-3 ${two ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((o) => {
        const active = value === o.id
        return (
          <button
            key={o.id} onClick={() => onChange(o.id)}
            className={`rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
              active ? 'border-lime bg-lime/10' : 'border-surface2 bg-surface'
            }`}
          >
            {o.emoji && <span className="text-2xl">{o.emoji}</span>}
            <p className="mt-1 font-bold">{o.label}</p>
            {o.desc && <p className="text-xs text-muted">{o.desc}</p>}
          </button>
        )
      })}
    </div>
  )
}

function NumField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      <input
        type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-surface2 bg-surface px-5 py-4 text-lg font-semibold outline-none focus:border-lime"
      />
    </label>
  )
}

function Recap({ label, value }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
      <span className="text-muted">{label}</span>
      <span className="font-bold">{value || '—'}</span>
    </li>
  )
}
