import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import { ROPE, WEEK } from '../data/program.js'

export default function Sport() {
  const { weekNumber, toggleTask, isTaskDone } = useApp()
  const fire = useReward()
  const plan = ROPE[weekNumber] || ROPE[1]

  const [phase, setPhase] = useState('idle')   // idle | work | rest | done
  const [setIndex, setSetIndex] = useState(0)
  const [left, setLeft] = useState(plan.work)
  const tick = useRef(null)

  const duration = phase === 'rest' ? plan.rest : plan.work

  useEffect(() => () => clearInterval(tick.current), [])

  const start = () => {
    setPhase('work'); setSetIndex(0); setLeft(plan.work)
    run('work', 0, plan.work)
  }

  const run = (ph, idx, secs) => {
    clearInterval(tick.current)
    setPhase(ph); setSetIndex(idx); setLeft(secs)
    tick.current = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1
        clearInterval(tick.current)
        advance(ph, idx)
        return 0
      })
    }, 1000)
  }

  const advance = (ph, idx) => {
    if (ph === 'work') {
      if (idx + 1 >= plan.sets) return finish()
      run('rest', idx, plan.rest)
    } else {
      run('work', idx + 1, plan.work)
    }
  }

  const finish = () => {
    clearInterval(tick.current)
    setPhase('done')
    if (!isTaskDone('rope')) toggleTask('rope')
    fire('Séance corde validée 🪢🔥')
  }

  const stop = () => { clearInterval(tick.current); setPhase('idle'); setLeft(plan.work); setSetIndex(0) }

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const ringColor = phase === 'rest' ? '#FF6B35' : '#C8F135'

  return (
    <div className="pb-6">
      <ScreenHeader subtitle={`Semaine ${weekNumber}`} title="Corde à sauter" />

      <div className="px-5">
        <p className="mb-5 rounded-xl bg-surface2/50 px-4 py-3 text-center text-sm font-semibold">
          🎯 {plan.label} · repos {plan.rest}s
        </p>

        <div className="flex flex-col items-center">
          <ProgressRing value={left} max={duration} size={220} stroke={14} color={ringColor}>
            <span className="text-xs font-bold uppercase tracking-widest text-muted">
              {phase === 'idle' && 'Prêt ?'}
              {phase === 'work' && 'Saute !'}
              {phase === 'rest' && 'Repos'}
              {phase === 'done' && 'Terminé'}
            </span>
            <span className="text-5xl font-black tabular-nums">{mmss(left)}</span>
            {phase !== 'idle' && phase !== 'done' && (
              <span className="text-xs font-semibold text-muted">Série {setIndex + 1}/{plan.sets}</span>
            )}
          </ProgressRing>

          <div className="mt-8 w-full space-y-3">
            {phase === 'idle' && <button onClick={start} className="btn-primary w-full">Démarrer</button>}
            {(phase === 'work' || phase === 'rest') && <button onClick={stop} className="btn-ghost w-full">Arrêter</button>}
            {phase === 'done' && (
              <div className="card p-5 text-center">
                <p className="text-3xl">🏆</p>
                <p className="mt-2 font-extrabold">Bravo, séance bouclée !</p>
                <p className="text-sm text-muted">Pense au Checker et à tes 2L d’eau.</p>
                <button onClick={stop} className="btn-primary mt-4 w-full">Refaire</button>
              </div>
            )}
          </div>
        </div>

        {/* Routine de la semaine */}
        <h3 className="mb-2 mt-8 text-sm font-extrabold uppercase tracking-wide text-muted">Routine de la semaine</h3>
        <div className="card divide-y divide-surface2/60">
          {WEEK.days.map((d) => (
            <div key={d.day} className="flex items-center justify-between p-3.5">
              <span className="text-sm font-semibold">{d.day}</span>
              <span className="text-xs text-muted">{d.sport}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
