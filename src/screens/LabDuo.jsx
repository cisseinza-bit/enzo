import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Icon from '../components/ui/Icon.jsx'
import Photo from '../components/ui/Photo.jsx'
import { photoForMeal, IMAGES } from '../data/images.js'

// ── TEST DIRECTION DUOLINGO ────────────────────────────────────────────
// Fond clair, couleurs saturées, boutons à ombre 3D portée, gros arrondis,
// mascotte, rebonds. À comparer avec la direction Athletic (le reste de l'app).
// Route /lab/duo — n'affecte pas le design principal.

const TASKS = [
  { key: 'rope', label: 'Corde à sauter', icon: 'sport', color: '#58CC02', done: true },
  { key: 'checker10', label: 'Le Checker · 10h', icon: 'checker', color: '#1CB0F6', done: true },
  { key: 'checker16', label: 'Le Checker · 16h', icon: 'checker', color: '#1CB0F6', done: false },
  { key: 'water', label: '2L d’eau', icon: 'water', color: '#1CB0F6', done: false },
  { key: 'meals', label: 'Repas suivis', icon: 'meal', color: '#FF9600', done: false },
]

export default function LabDuo() {
  const { profile } = useApp()
  const done = TASKS.filter((t) => t.done).length
  return (
    <div className="min-h-full bg-[#FFFFFF] pb-10 text-[#3C3C3C]">
      {/* Top bar style Duolingo */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),20px)] pb-3">
        <Link to="/" className="rounded-full bg-[#F0F0F0] p-2 text-[#AFAFAF]"><Icon name="back" size={20} /></Link>
        <div className="flex items-center gap-4">
          <Stat icon="flame" color="#FF9600" value="3" />
          <Stat icon="trophy" color="#FFC800" value="120" />
          <span className="flex items-center gap-1 font-extrabold text-[#1CB0F6]">
            <Icon name="water" size={20} className="fill-[#1CB0F6]" /> 5
          </span>
        </div>
      </div>

      {/* Bandeau mascotte + progression du jour */}
      <div className="px-5">
        <DuoCard color="#58CC02" className="flex items-center gap-4 p-5 text-white">
          <motion.div
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 12 }}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-5xl"
          >🦉</motion.div>
          <div>
            <p className="text-lg font-extrabold leading-tight">Salut {profile.firstName || 'champion'} !</p>
            <p className="text-sm font-semibold text-white/90">Plus que {TASKS.length - done} pour finir ta journée 💪</p>
          </div>
        </DuoCard>
      </div>

      {/* Barre de progression segmentée */}
      <div className="mt-5 px-5">
        <div className="flex gap-1.5">
          {TASKS.map((t, i) => (
            <div key={i} className="h-3 flex-1 overflow-hidden rounded-full bg-[#E5E5E5]">
              <motion.div
                className="h-full rounded-full" style={{ background: t.color }}
                initial={{ width: 0 }} animate={{ width: t.done ? '100%' : 0 }}
                transition={{ delay: 0.1 * i, type: 'spring', stiffness: 200, damping: 22 }}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm font-bold text-[#AFAFAF]">{done}/{TASKS.length} missions du jour</p>
      </div>

      {/* Repas vedette avec photo */}
      <div className="mt-6 px-5">
        <DuoCard color="#FFC800" className="overflow-hidden p-0">
          <Photo src={IMAGES.mealBowl.local} alt="Plat du jour" className="h-40 w-full" />
          <div className="bg-white p-4">
            <span className="rounded-full bg-[#FFF4D6] px-2.5 py-1 text-xs font-extrabold text-[#E6A800]">PLAT DU JOUR</span>
            <p className="mt-2 text-xl font-extrabold text-[#3C3C3C]">Bowl poulet & légumes</p>
            <p className="text-sm font-bold text-[#AFAFAF]">450 kcal · prêt en 10 min</p>
          </div>
        </DuoCard>
      </div>

      {/* Missions du jour — boutons 3D */}
      <div className="mt-6 space-y-3 px-5">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#AFAFAF]">Tes missions</h3>
        {TASKS.map((t, i) => (
          <motion.button
            key={t.key}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ y: 2 }}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-b-4 bg-white p-4 text-left"
            style={{ borderColor: t.done ? t.color : '#E5E5E5' }}
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
              style={{ background: t.color, boxShadow: `0 4px 0 ${shade(t.color)}` }}
            >
              <Icon name={t.icon} size={24} strokeWidth={2.5} />
            </span>
            <span className="flex-1 text-lg font-extrabold text-[#3C3C3C]">{t.label}</span>
            {t.done
              ? <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: t.color }}><Icon name="check" size={18} className="text-white" strokeWidth={3.5} /></span>
              : <span className="h-8 w-8 rounded-full border-2 border-[#E5E5E5]" />}
          </motion.button>
        ))}

        {/* CTA principal façon Duolingo */}
        <motion.button
          whileTap={{ y: 3 }}
          className="mt-4 w-full rounded-2xl bg-[#58CC02] py-4 text-center text-lg font-extrabold uppercase tracking-wide text-white"
          style={{ boxShadow: '0 5px 0 #45A302' }}
        >
          Continuer
        </motion.button>
      </div>
    </div>
  )
}

function DuoCard({ color, className = '', children }) {
  return (
    <div
      className={`rounded-3xl border-2 border-b-[6px] ${className}`}
      style={{ borderColor: shade(color), background: color }}
    >
      {children}
    </div>
  )
}

function Stat({ icon, color, value }) {
  return (
    <span className="flex items-center gap-1 font-extrabold" style={{ color }}>
      <Icon name={icon} size={20} style={{ fill: color }} /> {value}
    </span>
  )
}

// Assombrit une couleur hex pour l'ombre 3D portée.
function shade(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, ((n >> 16) & 255) - 40)
  const g = Math.max(0, ((n >> 8) & 255) - 40)
  const b = Math.max(0, (n & 255) - 40)
  return `rgb(${r},${g},${b})`
}
