import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/programme', label: 'Programme', icon: '📅' },
  { to: '/sport', label: 'Sport', icon: '🪢' },
  { to: '/suivi', label: 'Suivi', icon: '📈' },
  { to: '/decouverte', label: 'Plus', icon: '✨' },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 mx-auto w-full max-w-app bg-ink/95 backdrop-blur border-t border-surface2/70">
      <ul className="flex justify-between px-2 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1">
            <NavLink
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-lime' : 'text-muted'
                }`
              }
            >
              <span className="text-xl leading-none">{t.icon}</span>
              {t.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
