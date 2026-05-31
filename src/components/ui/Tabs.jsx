import { motion } from 'framer-motion'

// Segmented control avec pastille active glissante (layoutId).
export default function Tabs({ tabs, value, onChange, id = 'tabs' }) {
  return (
    <div className="flex rounded-2xl border border-ink-500/50 bg-ink-800 p-1">
      {tabs.map((t) => {
        const active = value === t
        return (
          <button
            key={t} onClick={() => onChange(t)}
            className="relative flex-1 rounded-xl py-2 text-xs font-bold transition-colors"
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-xl bg-lime"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative ${active ? 'text-ink-900' : 'text-muted'}`}>{t}</span>
          </button>
        )
      })}
    </div>
  )
}
