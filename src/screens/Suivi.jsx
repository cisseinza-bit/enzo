import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'

export default function Suivi() {
  const { weighIns, addWeighIn, profile } = useApp()
  const fire = useReward()
  const [val, setVal] = useState('')

  const data = weighIns
  const first = data[0]?.weight
  const last = data[data.length - 1]?.weight
  const delta = first != null && last != null ? (last - first) : 0

  const submit = () => {
    if (!val) return
    addWeighIn(val); setVal('')
    fire('Pesée enregistrée 📈')
  }

  return (
    <div className="pb-6">
      <ScreenHeader subtitle="Lundi matin" title="Ton suivi" />

      <div className="space-y-5 px-5">
        {/* Résumé */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Départ" value={`${first ?? '—'}`} unit="kg" />
          <Stat label="Actuel" value={`${last ?? '—'}`} unit="kg" />
          <Stat label="Évolution" value={`${delta > 0 ? '+' : ''}${delta.toFixed(1)}`} unit="kg" accent={delta <= 0 ? 'lime' : 'flame'} />
        </div>

        {/* Graphique */}
        <div className="card p-4">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-muted">Tendance du poids</p>
          <WeightChart data={data} />
        </div>

        {/* Message contextuel */}
        <p className="rounded-xl bg-surface2/50 px-4 py-3 text-xs leading-snug text-muted">
          {delta < 0
            ? '👏 Belle tendance ! On garde le cap, la régularité fait tout.'
            : 'Le poids varie de 1 à 2 kg par jour. On regarde la tendance du mois, pas un seul jour. Vérifie hydratation et sel.'}
        </p>

        {/* Saisie */}
        <div className="card p-4">
          <p className="mb-2 text-sm font-bold">Ajouter ma pesée du jour</p>
          <div className="flex gap-2">
            <input
              type="number" inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)}
              placeholder={`${last ?? 80} kg`}
              className="flex-1 rounded-2xl border border-surface2 bg-surface px-4 py-3 font-semibold outline-none focus:border-lime"
            />
            <button onClick={submit} className="rounded-2xl bg-lime px-5 font-extrabold text-ink active:scale-95 transition">OK</button>
          </div>
        </div>

        {/* Bilan mensuel (1er lundi du mois) */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="font-bold">📸 Bilan mensuel</p>
            <span className="chip bg-surface2 text-muted">1er lundi</span>
          </div>
          <p className="mt-1 text-sm text-muted">Mensurations (taille, hanches, cuisses, bras) + photos face/profil/dos. On compare M vs M-1.</p>
          <button className="btn-ghost mt-3 w-full">Démarrer mon bilan</button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, unit, accent }) {
  const color = accent === 'flame' ? 'text-flame' : accent === 'lime' ? 'text-lime' : 'text-white'
  return (
    <div className="card p-3 text-center">
      <p className="text-[10px] font-semibold uppercase text-muted">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] text-muted">{unit}</p>
    </div>
  )
}

function WeightChart({ data }) {
  const W = 320, H = 140, pad = 16
  if (data.length < 2) return <p className="py-8 text-center text-sm text-muted">Ajoute quelques pesées pour voir ta courbe.</p>
  const ws = data.map((d) => d.weight)
  const min = Math.min(...ws) - 0.5, max = Math.max(...ws) + 0.5
  const x = (i) => pad + (i * (W - 2 * pad)) / (data.length - 1)
  const y = (w) => pad + (1 - (w - min) / (max - min)) * (H - 2 * pad)
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.weight)}`).join(' ')
  const area = `${line} L ${x(data.length - 1)} ${H - pad} L ${x(0)} ${H - pad} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8F135" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C8F135" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={line} fill="none" stroke="#C8F135" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.weight)} r="4" fill="#0A0A0A" stroke="#C8F135" strokeWidth="2.5" />
          <text x={x(i)} y={y(d.weight) - 9} textAnchor="middle" className="fill-white" fontSize="9" fontWeight="700">{d.weight}</text>
        </g>
      ))}
    </svg>
  )
}
