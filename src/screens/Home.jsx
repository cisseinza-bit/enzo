import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import OfferBanner from '../components/OfferBanner.jsx'
import { WEEK } from '../data/program.js'

const DAILY_TASKS = [
  { key: 'rope', label: 'Corde à sauter', emoji: '🪢' },
  { key: 'checker10', label: 'Le Checker · 10h', emoji: '🥤' },
  { key: 'checker16', label: 'Le Checker · 16h', emoji: '🥤' },
  { key: 'water', label: '2L d’eau', emoji: '💧' },
  { key: 'meals', label: 'Repas du jour suivis', emoji: '🍽️' },
]

export default function Home() {
  const { profile, streak, isTaskDone, toggleTask } = useApp()
  const fire = useReward()

  const dayIndex = (new Date().getDay() + 6) % 7 // lundi = 0
  const todayPlan = WEEK.days[dayIndex]

  const done = DAILY_TASKS.filter((t) => isTaskDone(t.key)).length
  const total = DAILY_TASKS.length

  const onToggle = (t) => {
    const wasDone = isTaskDone(t.key)
    toggleTask(t.key)
    if (!wasDone) fire(['Bien joué 🔥', 'Continue comme ça 💪', '+1 jour 🟢'][done % 3])
  }

  return (
    <div className="space-y-5 pb-6">
      <ScreenHeader
        subtitle={`Semaine ${WEEK.number} · ${WEEK.phase}`}
        title={`Salut ${profile.firstName || ''} 👋`}
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5">
              <span className="animate-flame text-lg">🔥</span>
              <span className="font-extrabold">{streak}</span>
            </div>
            <Link
              to="/compte"
              aria-label="Mon compte"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-sm font-black text-ink active:scale-95 transition"
            >
              {(profile.firstName || '?').slice(0, 1).toUpperCase()}
            </Link>
          </div>
        }
      />

      <div className="px-5">
        {/* Anneau du jour */}
        <div className="card flex items-center gap-5 p-5">
          <ProgressRing value={done} max={total}>
            <span className="text-2xl font-black">{done}/{total}</span>
            <span className="text-[10px] font-semibold text-muted">aujourd’hui</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm text-muted">{todayPlan.day}</p>
            <p className="font-bold leading-tight">{todayPlan.sport}</p>
            <p className="mt-2 text-xs text-muted">
              {done === total ? 'Journée complète, bravo 🏆' : `Plus que ${total - done} action${total - done > 1 ? 's' : ''}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist quotidienne */}
      <div className="space-y-2 px-5">
        {DAILY_TASKS.map((t) => {
          const checked = isTaskDone(t.key)
          return (
            <button
              key={t.key} onClick={() => onToggle(t)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                checked ? 'border-lime/40 bg-lime/10' : 'border-surface2 bg-surface'
              }`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className={`flex-1 font-semibold ${checked ? 'text-white/60 line-through' : ''}`}>{t.label}</span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                checked ? 'border-lime bg-lime text-ink' : 'border-surface2'
              }`}>{checked ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>

      {/* Repas du jour */}
      <div className="px-5">
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted">Tes repas du jour</h3>
        <div className="card divide-y divide-surface2/60">
          {todayPlan.meals.map((m) => (
            <div key={m.slot} className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted">{m.slot}</p>
                <p className="font-semibold">{m.name}</p>
              </div>
              <span className="chip bg-surface2 text-lime">{m.kcal} kcal</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5">
        <OfferBanner />
      </div>
    </div>
  )
}
