import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from './ui/Icon.jsx'

const tabs = [
  { to: '/', label: 'Accueil', icon: 'home' },
  { to: '/programme', label: 'Programme', icon: 'programme' },
  { to: '/sport', label: 'Sport', icon: 'sport' },
  { to: '/suivi', label: 'Suivi', icon: 'suivi' },
  { to: '/decouverte', label: 'Plus', icon: 'plus' },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 mx-auto w-full max-w-app border-t border-ink-500/40 bg-ink-900/80 backdrop-blur-xl">
      <ul className="flex justify-between px-3 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1">
            <NavLink to={t.to} end={t.to === '/'} className="block">
              {({ isActive }) => (
                <motion.div
                  className="relative flex flex-col items-center gap-1 py-1.5"
                  animate={{ color: isActive ? '#C8F135' : '#7A7A85' }}
                  transition={{ duration: 0.2 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-glow"
                      className="absolute -top-2 h-1 w-8 rounded-full bg-lime shadow-glow"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <motion.div animate={{ scale: isActive ? 1.06 : 1, y: isActive ? -1 : 0 }}>
                    <Icon name={t.icon} size={22} strokeWidth={isActive ? 2.4 : 2} />
                  </motion.div>
                  <span className="text-[10px] font-semibold tracking-tight">{t.label}</span>
                </motion.div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
