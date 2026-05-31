import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import Counter from '../components/ui/Counter.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'

export default function Suivi() {
  const { weighIns, addWeighIn } = useApp()
  const fire = useReward()
  const [val, setVal] = useState('')

  const data = weighIns
  const first = data[0]?.weight
  const last = data[data.length - 1]?.weight
  const delta = first != null && last != null ? (last - first) : 0

  const submit = () => {
    if (!val) return
    addWeighIn(val); setVal('')
    fire('Pesée enregistrée')
  }

  return (
    <div className="pb-6">
      <ScreenHeader subtitle="Lundi matin" title="Ton suivi" />

      <div className="space-y-4 px-5">
        {/* Résumé */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Départ" value={first} unit="kg" />
          <Stat label="Actuel" value={last} unit="kg" />
          <Stat label="Évolution" value={delta} unit="kg" signed accent={delta <= 0 ? 'lime' : 'flame'} />
        </div>

        {/* Graphique */}
        <div className="card p-5">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <Icon name="suivi" size={14} strokeWidth={2.5} /> Tendance du poids
          </p>
          <WeightChart data={data} />
        </div>

        {/* Message contextuel */}
        <div className="flex items-start gap-3 rounded-2xl border border-ink-500/50 bg-ink-700/50 px-4 py-3.5">
          <Icon name={delta < 0 ? 'trophy' : 'heart'} size={18} className={delta < 0 ? 'text-lime' : 'text-flame'} strokeWidth={2.2} />
          <p className="text-sm leading-snug text-muted">
            {delta < 0
              ? 'Belle tendance ! On garde le cap, la régularité fait tout.'
              : 'Le poids varie de 1 à 2 kg par jour. On regarde la tendance du mois, pas un seul jour. Vérifie hydratation et sel.'}
          </p>
        </div>

        {/* Saisie */}
        <div className="card p-5">
          <p className="mb-3 font-display text-lg font-bold">Ajouter ma pesée du jour</p>
          <div className="flex gap-2">
            <input
              type="number" inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)}
              placeholder={`${last ?? 80} kg`}
              className="tnum flex-1 rounded-2xl border border-ink-500 bg-ink-800 px-4 py-3.5 font-semibold outline-none transition focus:border-lime"
            />
            <Button size="md" onClick={submit} className="px-6">OK</Button>
          </div>
        </div>

        {/* Bilan mensuel (1er lundi du mois) */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-display text-lg font-bold">
              <Icon name="camera" size={18} className="text-lime" strokeWidth={2.2} /> Bilan mensuel
            </p>
            <span className="chip bg-ink-700 text-muted">1er lundi</span>
          </div>
          <p className="mt-1.5 text-sm text-muted">Mensurations (taille, hanches, cuisses, bras) + photos face/profil/dos. On compare M vs M-1.</p>
          <Button variant="ghost" size="md" className="mt-4 w-full gap-2">
            <Icon name="ruler" size={16} strokeWidth={2.2} /> Démarrer mon bilan
          </Button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, unit, accent, signed }) {
  const color = accent === 'flame' ? 'text-flame' : accent === 'lime' ? 'text-lime' : 'text-white'
  const has = value != null
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card p-3.5 text-center"
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className={`font-display text-2xl font-extrabold ${color}`}>
        {has ? <>{signed && value > 0 ? '+' : ''}<Counter value={value} decimals={1} /></> : '—'}
      </p>
      <p className="text-[10px] text-faint">{unit}</p>
    </motion.div>
  )
}

function WeightChart({ data }) {
  const W = 320, H = 150, pad = 18
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
          <stop offset="0%" stopColor="#C8F135" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#C8F135" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#g)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      <motion.path
        d={line} fill="none" stroke="#C8F135" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeOut' }}
        style={{ filter: 'drop-shadow(0 0 4px #C8F13566)' }}
      />
      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.weight)} r="4" fill="#0A0A0B" stroke="#C8F135" strokeWidth="2.5" />
          <text x={x(i)} y={y(d.weight) - 10} textAnchor="middle" className="fill-white" fontSize="9.5" fontWeight="700">{d.weight}</text>
        </g>
      ))}
    </svg>
  )
}
