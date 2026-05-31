import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import LockOverlay from '../components/LockOverlay.jsx'
import OfferBanner from '../components/OfferBanner.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import Icon from '../components/ui/Icon.jsx'
import { INVISIBLE, CONCEPTS, RECIPES, FEED, PYRAMID } from '../data/program.js'

const TABS = ['Concepts', 'Calories', 'Recettes', 'Commu']

export default function Decouverte() {
  const [tab, setTab] = useState('Concepts')
  const { tier } = useApp()

  return (
    <div className="pb-6">
      <ScreenHeader title="Découverte" subtitle="Apprends en suivant" />
      <div className="px-5">
        <Tabs tabs={TABS} value={tab} onChange={setTab} id="disc" />
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-4 space-y-3 px-5"
      >
        {tab === 'Concepts' && <Concepts />}
        {tab === 'Calories' && <Invisible />}
        {tab === 'Recettes' && <Recipes />}
        {tab === 'Commu' && <Community />}
      </motion.div>

      {tier !== 'premium' && (
        <div className="px-5 pt-4"><OfferBanner /></div>
      )}
    </div>
  )
}

function Concepts() {
  return (
    <>
      <div className="card p-5">
        <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          <Icon name="brain" size={14} strokeWidth={2.5} /> La pyramide de la perte de poids
        </p>
        <div className="space-y-2">
          {[...PYRAMID].reverse().map((p) => (
            <div key={p.n} className="flex items-center gap-3" style={{ paddingLeft: `${(p.n - 1) * 9}px` }}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime font-display text-sm font-extrabold text-ink-900">{p.n}</span>
              <div>
                <span className="text-sm font-bold">{p.label}</span>
                <span className="ml-2 text-xs text-muted">{p.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {CONCEPTS.map((c, i) => (
        <div key={c.m}>
          {i === 0 ? <ConceptCard c={c} /> : <LockOverlay label={`Débloqué au mois ${c.m}`}><ConceptCard c={c} /></LockOverlay>}
        </div>
      ))}
    </>
  )
}

function ConceptCard({ c }) {
  return (
    <div className="card p-5">
      <span className="chip border border-flame/25 bg-flame/10 text-flame">Mois {c.m}</span>
      <p className="mt-2.5 font-display text-lg font-bold leading-tight">{c.title}</p>
      <p className="mt-1 text-sm leading-snug text-muted">{c.text}</p>
    </div>
  )
}

function Invisible() {
  return (
    <>
      <p className="text-sm text-muted">Même plaisir, deux fois moins de calories. Le secret : les calories invisibles.</p>
      {INVISIBLE.map((it) => (
        <div key={it.before} className="card flex items-center gap-3 p-4">
          <div className="flex-1">
            <p className="text-sm text-faint line-through">{it.before}</p>
            <p className="flex items-center gap-1 font-bold text-lime">
              <Icon name="arrow" size={14} strokeWidth={2.5} /> {it.after}
            </p>
          </div>
          <span className="tnum chip bg-lime font-bold text-ink-900">-{it.save} kcal</span>
        </div>
      ))}
    </>
  )
}

function Recipes() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {RECIPES.map((r) => {
        const card = (
          <div className="card h-full p-4">
            <span className="chip bg-ink-700 text-muted">{r.tag}</span>
            <p className="mt-2 font-display font-bold leading-tight">{r.name}</p>
            <p className="tnum mt-1 text-xs font-semibold text-lime">{r.kcal} kcal</p>
          </div>
        )
        return <div key={r.name}>{r.locked ? <LockOverlay label="Recette bonus">{card}</LockOverlay> : card}</div>
      })}
    </div>
  )
}

function Community() {
  return (
    <>
      <p className="text-sm text-muted">Tu n’es pas seul. Le feed de ceux qui suivent, comme toi.</p>
      {FEED.map((f, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between">
            <p className="font-bold">{f.who}</p>
            <span className="text-xs text-faint">{f.when}</span>
          </div>
          <p className="mt-1 text-sm">{f.text}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-flame">
            <Icon name="flame" size={14} strokeWidth={2.5} /> {f.cheers}
          </div>
        </div>
      ))}
    </>
  )
}
