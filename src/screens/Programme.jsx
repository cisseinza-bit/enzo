import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { SHOPPING, BATCH } from '../data/program.js'

const TABS = ['Semaine', 'Courses', 'Batch']

export default function Programme() {
  const [tab, setTab] = useState('Semaine')
  const { program } = useApp()
  return (
    <div className="pb-6">
      <ScreenHeader subtitle={program.phase} title="Ton programme" />
      <div className="px-5">
        <div className="mb-4 flex rounded-2xl bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${tab === t ? 'bg-lime text-ink' : 'text-muted'}`}
            >{t}</button>
          ))}
        </div>
      </div>
      {tab === 'Semaine' && <WeekView />}
      {tab === 'Courses' && <ShoppingView />}
      {tab === 'Batch' && <BatchView />}
    </div>
  )
}

function WeekView() {
  const [open, setOpen] = useState(0)
  const { program } = useApp()
  return (
    <div className="space-y-2 px-5">
      <p className="rounded-xl bg-surface2/50 px-4 py-3 text-xs leading-snug text-muted">{program.phaseNote}</p>
      {program.days.map((d, i) => {
        const total = d.meals.reduce((a, m) => a + m.kcal, 0)
        const isOpen = open === i
        return (
          <div key={d.day} className="card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between p-4 text-left">
              <div>
                <p className="font-bold">{d.day}</p>
                <p className="text-xs text-muted">{d.sport}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip bg-surface2 text-lime">{total} kcal</span>
                <span className={`text-muted transition ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
              </div>
            </button>
            {isOpen && (
              <div className="animate-fade-up divide-y divide-surface2/60 border-t border-surface2/60">
                {d.meals.map((m) => (
                  <div key={m.slot} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-muted">{m.slot}</p>
                      <p className="text-sm font-semibold">{m.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-lime">{m.kcal}</span>
                  </div>
                ))}
              </div>
            )}
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
      <div className="card flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted">Panier estimé</p>
          <p className="text-2xl font-black text-lime">{total.toFixed(2)} €</p>
        </div>
        <span className="chip bg-surface2 text-white">{checked}/{all.length} pris</span>
      </div>
      {SHOPPING.map((c) => (
        <div key={c.cat}>
          <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted">{c.cat}</h3>
          <div className="card divide-y divide-surface2/60">
            {c.items.map((it) => {
              const on = !!shoppingChecked[it.name]
              return (
                <button key={it.name} onClick={() => toggleShopping(it.name)} className="flex w-full items-center gap-3 p-4 text-left active:bg-surface2/40">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-lime bg-lime text-ink' : 'border-surface2'}`}>{on ? '✓' : ''}</span>
                  <div className="flex-1">
                    <p className={`font-semibold ${on ? 'text-white/50 line-through' : ''}`}>{it.name}</p>
                    <p className="text-xs text-muted">{it.qty}</p>
                  </div>
                  <span className="text-sm font-semibold text-muted">{it.price.toFixed(2)} €</span>
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
      <div className="card flex items-center justify-between p-4">
        <p className="font-bold">Batch cooking du dimanche</p>
        <span className="chip bg-flame/20 text-flame">{BATCH.duration}</span>
      </div>
      <div className="space-y-2">
        {BATCH.steps.map((s) => (
          <div key={s.n} className="card flex gap-3 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime font-black text-ink">{s.n}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold">{s.title}</p>
                <span className="text-xs text-muted">{s.time}</span>
              </div>
              <p className="text-sm text-muted">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StorageCard title="🧊 Frigo (3 j)" items={BATCH.storage.frigo} />
        <StorageCard title="❄️ Congélo" items={BATCH.storage.congelo} />
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
