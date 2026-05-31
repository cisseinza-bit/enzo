import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import Icon from '../components/ui/Icon.jsx'
import Counter from '../components/ui/Counter.jsx'
import { SHOPPING, BATCH } from '../data/program.js'

const TABS = ['Semaine', 'Courses', 'Batch']

export default function Programme() {
  const [tab, setTab] = useState('Semaine')
  const { program } = useApp()
  return (
    <div className="pb-6">
      <ScreenHeader subtitle={program.phase} title="Ton programme" />
      <div className="px-5">
        <Tabs tabs={TABS} value={tab} onChange={setTab} id="prog" />
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="mt-4">
        {tab === 'Semaine' && <WeekView />}
        {tab === 'Courses' && <ShoppingView />}
        {tab === 'Batch' && <BatchView />}
      </motion.div>
    </div>
  )
}

function WeekView() {
  const [open, setOpen] = useState(0)
  const { program } = useApp()
  return (
    <div className="space-y-2 px-5">
      <p className="rounded-2xl border border-ink-500/40 bg-ink-700/50 px-4 py-3 text-xs leading-snug text-muted">{program.phaseNote}</p>
      {program.days.map((d, i) => {
        const total = d.meals.reduce((a, m) => a + m.kcal, 0)
        const isOpen = open === i
        return (
          <div key={d.day} className="card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between p-4 text-left">
              <div>
                <p className="font-display text-lg font-bold">{d.day}</p>
                <p className="text-xs text-muted">{d.sport}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="tnum chip border border-lime/20 bg-lime/10 text-lime">{total} kcal</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-muted">
                  <Icon name="chevronDown" size={18} />
                </motion.span>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="divide-y divide-ink-500/40 border-t border-ink-500/40"
                >
                  {d.meals.map((m) => (
                    <div key={m.slot} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{m.slot}</p>
                        <p className="text-sm font-semibold">{m.name}</p>
                      </div>
                      <span className="tnum text-xs font-semibold text-lime">{m.kcal}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function ShoppingView() {
  const { shoppingChecked, toggleShopping } = useApp()
  const all = SHOPPING.flatMap((c) => c.items)
  const total = all.reduce((a, i) => a + i.price, 0)
  const checked = all.filter((i) => shoppingChecked[i.name]).length
  return (
    <div className="space-y-4 px-5">
      <div className="card flex items-center justify-between p-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Icon name="cart" size={14} strokeWidth={2.5} /> Panier estimé
          </p>
          <p className="font-display text-3xl font-extrabold text-lime"><Counter value={total} decimals={2} /> €</p>
        </div>
        <span className="tnum chip bg-ink-700 text-white">{checked}/{all.length} pris</span>
      </div>
      {SHOPPING.map((c) => (
        <div key={c.cat}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">{c.cat}</h3>
          <div className="card divide-y divide-ink-500/40 overflow-hidden">
            {c.items.map((it) => {
              const on = !!shoppingChecked[it.name]
              return (
                <button key={it.name} onClick={() => toggleShopping(it.name)} className="flex w-full items-center gap-3 p-4 text-left transition active:bg-ink-700/40">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${on ? 'border-lime bg-lime text-ink-900' : 'border-ink-500'}`}>
                    {on && <Icon name="check" size={13} strokeWidth={3} />}
                  </span>
                  <div className="flex-1">
                    <p className={`font-semibold transition ${on ? 'text-white/40 line-through' : ''}`}>{it.name}</p>
                    <p className="text-xs text-muted">{it.qty}</p>
                  </div>
                  <span className="tnum text-sm font-semibold text-muted">{it.price.toFixed(2)} €</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function BatchView() {
  return (
    <div className="space-y-4 px-5">
      <div className="card flex items-center justify-between p-5">
        <p className="flex items-center gap-2 font-display text-lg font-bold">
          <Icon name="batch" size={18} className="text-lime" strokeWidth={2.2} /> Batch cooking du dimanche
        </p>
        <span className="chip border border-flame/25 bg-flame/10 text-flame">{BATCH.duration}</span>
      </div>
      <div className="space-y-2">
        {BATCH.steps.map((s) => (
          <div key={s.n} className="card flex gap-3.5 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime font-display font-extrabold text-ink-900">{s.n}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold">{s.title}</p>
                <span className="tnum text-xs text-muted">{s.time}</span>
              </div>
              <p className="text-sm text-muted">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StorageCard title="Frigo (3 j)" items={BATCH.storage.frigo} />
        <StorageCard title="Congélo" items={BATCH.storage.congelo} />
      </div>
    </div>
  )
}

function StorageCard({ title, items }) {
  return (
    <div className="card p-4">
      <p className="mb-2 text-sm font-bold">{title}</p>
      <ul className="space-y-1 text-xs text-muted">
        {items.map((i) => <li key={i}>• {i}</li>)}
      </ul>
    </div>
  )
}
