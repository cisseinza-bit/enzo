import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import Photo from '../components/ui/Photo.jsx'
import { ROPE } from '../data/program.js'
import { IMAGES } from '../data/images.js'

export default function Sport() {
  const { weekNumber, toggleTask, isTaskDone, program } = useApp()
  const fire = useReward()
  const plan = program.rope || ROPE[weekNumber] || ROPE[1]

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
    fire('Séance corde validée')
  }

  const stop = () => { clearInterval(tick.current); setPhase('idle'); setLeft(plan.work); setSetIndex(0) }

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const ringColor = phase === 'rest' ? '#FF6B35' : '#C8F135'

  const running = phase === 'work' || phase === 'rest'

  return (
    <div className="pb-6">
      <ScreenHeader subtitle={`Semaine ${weekNumber}`} title="Corde à sauter" />

      <div className="px-5">
        {phase === 'idle' && (
          <Photo src={IMAGES.heroRope.local} alt={IMAGES.heroRope.alt} overlay className="mb-4 h-40 w-full rounded-3xl">
            <div className="flex h-full flex-col justify-end p-5">
              <p className="font-display text-2xl font-extrabold leading-tight text-white">Tous les jours.<br />Sans exception.</p>
            </div>
          </Photo>
        )}
        <p className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-ink-500/40 bg-ink-700/50 px-4 py-3 text-center text-sm font-semibold">
          <Icon name="timer" size={15} className="text-lime" strokeWidth={2.4} />
          {plan.label} · repos {plan.rest}s
        </p>

        <div className="flex flex-col items-center">
          <div className="relative">
            {running && phase === 'work' && (
              <span className="absolute inset-0 rounded-full bg-lime/20 animate-pulse-ring" />
            )}
            <ProgressRing value={left} max={duration} size={232} stroke={14} color={ringColor}>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                {phase === 'idle' && 'Prêt ?'}
                {phase === 'work' && 'Saute !'}
                {phase === 'rest' && 'Repos'}
                {phase === 'done' && 'Terminé'}
              </span>
              <span className="font-display text-6xl font-extrabold tabular-nums leading-none">{mmss(left)}</span>
              {running && (
                <span className="mt-1 text-xs font-semibold text-muted">Série {setIndex + 1}/{plan.sets}</span>
              )}
            </ProgressRing>
          </div>

          <div className="mt-8 w-full space-y-3">
            {phase === 'idle' && (
              <Button onClick={start} className="gap-2"><Icon name="play" size={18} strokeWidth={2.5} /> Démarrer</Button>
            )}
            {running && (
              <Button variant="ghost" onClick={stop} className="gap-2"><Icon name="stop" size={16} strokeWidth={2.5} /> Arrêter</Button>
            )}
            {phase === 'done' && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="card p-6 text-center"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime/15 text-lime shadow-glow">
                  <Icon name="trophy" size={28} strokeWidth={2} />
                </span>
                <p className="mt-3 font-display text-xl font-extrabold">Séance bouclée !</p>
                <p className="text-sm text-muted">Pense au Checker et à tes 2L d’eau.</p>
                <Button onClick={stop} size="md" className="mt-4 w-full gap-2"><Icon name="redo" size={16} strokeWidth={2.5} /> Refaire</Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Routine de la semaine */}
        <h3 className="mb-2.5 mt-9 text-xs font-bold uppercase tracking-[0.12em] text-muted">Routine de la semaine</h3>
        <div className="card divide-y divide-ink-500/40 overflow-hidden">
          {program.days.map((d) => (
            <div key={d.day} className="flex items-center justify-between p-4">
              <span className="text-sm font-bold">{d.day}</span>
              <span className="text-xs text-muted">{d.sport}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
