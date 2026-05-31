import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import OfferBanner from '../components/OfferBanner.jsx'
import Counter from '../components/ui/Counter.jsx'
import Icon from '../components/ui/Icon.jsx'

const DAILY_TASKS = [
  { key: 'rope', label: 'Corde à sauter', icon: 'sport' },
  { key: 'checker10', label: 'Le Checker · 10h', icon: 'checker' },
  { key: 'checker16', label: 'Le Checker · 16h', icon: 'checker' },
  { key: 'water', label: '2L d’eau', icon: 'water' },
  { key: 'meals', label: 'Repas du jour suivis', icon: 'meal' },
]

const stagger = { show: { transition: { staggerChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
}

export default function Home() {
  const { profile, streak, isTaskDone, toggleTask, program } = useApp()
  const fire = useReward()

  const dayIndex = (new Date().getDay() + 6) % 7 // lundi = 0
  const todayPlan = program.days[dayIndex]

  const done = DAILY_TASKS.filter((t) => isTaskDone(t.key)).length
  const total = DAILY_TASKS.length

  const onToggle = (t) => {
    const wasDone = isTaskDone(t.key)
    toggleTask(t.key)
    if (!wasDone) fire(['Bien joué', 'Continue comme ça', '+1 action'][done % 3])
  }

  return (
    <div className="pb-6">
      <ScreenHeader
        subtitle={`Semaine ${program.number} · ${program.phase}`}
        title={`Salut${profile.firstName ? ' ' + profile.firstName : ''}`}
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-flame/30 bg-flame/10 px-3 py-1.5">
              <Icon name="flame" size={16} className="text-flame" strokeWidth={2.5} />
              <span className="tnum font-display text-base font-extrabold text-flame">{streak}</span>
            </div>
            <Link
              to="/compte" aria-label="Mon compte"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-sm font-black text-ink-900 active:scale-95 transition"
            >
              {(profile.firstName || '?').slice(0, 1).toUpperCase()}
            </Link>
          </div>
        }
      />

      {/* Anneau du jour — pièce maîtresse */}
      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="card flex items-center gap-5 p-6"
        >
          <ProgressRing value={done} max={total} size={128} stroke={12}>
            <span className="font-display text-3xl font-extrabold leading-none">
              <Counter value={done} />/{total}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted">aujourd’hui</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{todayPlan.day}</p>
            <p className="mt-0.5 font-display text-xl font-bold leading-tight">{todayPlan.sport}</p>
            <p className="mt-2 text-sm text-muted">
              {done === total
                ? 'Journée complète. Respect.'
                : `Plus que ${total - done} action${total - done > 1 ? 's' : ''}.`}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Checklist quotidienne */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-5 space-y-2 px-5">
        {DAILY_TASKS.map((t) => {
          const checked = isTaskDone(t.key)
          return (
            <motion.button
              key={t.key} variants={item} onClick={() => onToggle(t)} whileTap={{ scale: 0.985 }}
              className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors ${
                checked ? 'border-lime/40 bg-lime/[0.07]' : 'border-ink-500/60 bg-surface'
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${checked ? 'bg-lime/15 text-lime' : 'bg-ink-700 text-muted'}`}>
                <Icon name={t.icon} size={18} strokeWidth={2.2} />
              </span>
              <span className={`flex-1 font-semibold transition ${checked ? 'text-white/50 line-through' : ''}`}>{t.label}</span>
              <motion.span
                animate={checked ? { scale: 1 } : { scale: 1 }}
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                  checked ? 'border-lime bg-lime text-ink-900' : 'border-ink-500'
                }`}
              >
                {checked && <Icon name="check" size={14} strokeWidth={3} />}
              </motion.span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Repas du jour */}
      <div className="mt-6 px-5">
        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-muted">Tes repas du jour</h3>
        <div className="card divide-y divide-ink-500/40 overflow-hidden">
          {todayPlan.meals.map((m) => (
            <div key={m.slot} className="flex items-center justify-between p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{m.slot}</p>
                <p className="font-semibold">{m.name}</p>
              </div>
              <span className="tnum chip border border-lime/20 bg-lime/10 text-lime">{m.kcal} kcal</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 px-5">
        <OfferBanner />
      </div>
    </div>
  )
}
