import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import { useReward } from '../components/Reward.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import Photo from '../components/ui/Photo.jsx'

const FIELDS = [
  { key: 'waist', label: 'Tour de taille', hint: 'Au niveau du nombril' },
  { key: 'hips', label: 'Tour de hanches', hint: 'Au point le plus large' },
  { key: 'thighs', label: 'Tour de cuisse', hint: 'Mi-cuisse, jambe détendue' },
  { key: 'arms', label: 'Tour de bras', hint: 'Bras détendu, mi-hauteur' },
]
const ANGLES = [
  { key: 'front', label: 'Face' },
  { key: 'side', label: 'Profil' },
  { key: 'back', label: 'Dos' },
]

// Lit un fichier image en data URL pour aperçu + envoi.
const readFile = (file) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onload = () => res(r.result)
  r.onerror = rej
  r.readAsDataURL(file)
})

export default function Bilan() {
  const navigate = useNavigate()
  const { measurements, addMeasurement, today } = useApp()
  const fire = useReward()

  // M-1 = dernier bilan antérieur à aujourd'hui (on ignore une éventuelle saisie du jour).
  const prev = [...measurements].reverse().find((m) => m.date !== today)
  const [vals, setVals] = useState({ waist: '', hips: '', thighs: '', arms: '' })
  const [photos, setPhotos] = useState({})
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setVals((s) => ({ ...s, [k]: v }))

  const pickPhoto = async (key, file) => {
    if (!file) return
    const url = await readFile(file)
    setPhotos((p) => ({ ...p, [key]: url }))
  }

  const filledCount = FIELDS.filter((f) => vals[f.key]).length
  const canSave = filledCount > 0

  const submit = async () => {
    setBusy(true)
    const payload = {
      waist: vals.waist ? Number(vals.waist) : null,
      hips: vals.hips ? Number(vals.hips) : null,
      thighs: vals.thighs ? Number(vals.thighs) : null,
      arms: vals.arms ? Number(vals.arms) : null,
      photos,
    }
    await addMeasurement(payload)
    fire('Bilan du mois enregistré')
    setSaved(true)
    setBusy(false)
  }

  return (
    <div className="pb-8">
      <header className="flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),24px)] pb-4">
        <button onClick={() => navigate('/suivi')} aria-label="Retour" className="text-muted"><Icon name="back" size={26} /></button>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">1er lundi du mois</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tightest">Bilan mensuel</h1>
        </div>
      </header>

      {saved ? (
        <Done prev={prev} vals={vals} photos={photos} onClose={() => navigate('/suivi')} />
      ) : (
        <div className="space-y-5 px-5">
          <p className="rounded-2xl border border-ink-500/40 bg-ink-700/50 px-4 py-3 text-sm leading-snug text-muted">
            Les photos ne mentent jamais. On compare ce mois au précédent — c’est la vraie mesure du changement.
          </p>

          {/* Mensurations */}
          <div className="space-y-2.5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
              <Icon name="ruler" size={14} strokeWidth={2.5} /> Mensurations (cm)
            </h3>
            {FIELDS.map((f) => {
              const before = prev?.[f.key]
              const now = vals[f.key] ? Number(vals[f.key]) : null
              const delta = before != null && now != null ? now - before : null
              return (
                <div key={f.key} className="card flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{f.label}</p>
                    <p className="text-xs text-muted">{f.hint}{before != null ? ` · M-1 : ${before} cm` : ''}</p>
                  </div>
                  {delta != null && (
                    <span className={`tnum chip ${delta <= 0 ? 'bg-lime/15 text-lime' : 'bg-flame/15 text-flame'}`}>
                      {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                    </span>
                  )}
                  <input
                    type="number" inputMode="decimal" value={vals[f.key]} onChange={(e) => set(f.key, e.target.value)}
                    placeholder="—"
                    className="tnum w-20 rounded-xl border border-ink-500 bg-ink-800 px-3 py-2.5 text-center font-semibold outline-none focus:border-lime"
                  />
                </div>
              )
            })}
          </div>

          {/* Photos */}
          <div className="space-y-2.5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
              <Icon name="camera" size={14} strokeWidth={2.5} /> Photos de suivi
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {ANGLES.map((a) => (
                <PhotoSlot key={a.key} label={a.label} value={photos[a.key]} onPick={(f) => pickPhoto(a.key, f)} />
              ))}
            </div>
            <p className="text-[10px] leading-snug text-faint">Tes photos restent privées, utilisées uniquement pour ta comparaison mensuelle.</p>
          </div>

          <Button onClick={submit} disabled={!canSave || busy} className="gap-2">
            {busy ? 'Enregistrement…' : <>Enregistrer mon bilan <Icon name="check" size={18} strokeWidth={2.5} /></>}
          </Button>
        </div>
      )}
    </div>
  )
}

function PhotoSlot({ label, value, onPick }) {
  const ref = useRef(null)
  return (
    <button
      onClick={() => ref.current?.click()}
      className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed border-ink-500/70 bg-ink-800"
    >
      {value
        ? <Photo src={value} alt={label} className="absolute inset-0 h-full w-full" />
        : <span className="flex h-full flex-col items-center justify-center gap-1 text-muted">
            <Icon name="camera" size={22} strokeWidth={2} />
            <span className="text-[11px] font-semibold">{label}</span>
          </span>}
      {value && (
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-ink-900/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">{label}</span>
      )}
      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
    </button>
  )
}

function Done({ prev, vals, photos, onClose }) {
  const taken = Object.keys(photos).length
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-5 px-5"
    >
      <div className="card flex flex-col items-center p-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/15 text-lime shadow-glow">
          <Icon name="trophy" size={30} strokeWidth={2} />
        </span>
        <p className="mt-3 font-display text-2xl font-extrabold">Bilan enregistré</p>
        <p className="mt-1 text-sm text-muted">
          {prev ? 'Ta comparaison avec le mois dernier est prête.' : 'C’est ton point de départ. Rendez-vous le 1er lundi prochain.'}
        </p>
      </div>

      {/* Comparaison M-1 vs M */}
      {prev && (
        <div className="card divide-y divide-ink-500/40 overflow-hidden">
          {FIELDS.map((f) => {
            const before = prev[f.key]
            const now = vals[f.key] ? Number(vals[f.key]) : null
            if (before == null || now == null) return null
            const delta = now - before
            return (
              <div key={f.key} className="flex items-center justify-between p-4">
                <span className="font-semibold">{f.label}</span>
                <span className="tnum flex items-center gap-2 text-sm">
                  <span className="text-muted">{before}</span>
                  <Icon name="arrow" size={13} className="text-faint" />
                  <span className="font-bold">{now}</span>
                  <span className={`chip ${delta <= 0 ? 'bg-lime/15 text-lime' : 'bg-flame/15 text-flame'}`}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)} cm
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      )}

      {taken > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(photos).map(([k, url]) => (
            <Photo key={k} src={url} alt={k} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      )}

      <Button onClick={onClose} variant="ghost">Retour au suivi</Button>
    </motion.div>
  )
}
