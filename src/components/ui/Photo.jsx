import { useState } from 'react'
import { cn } from '../../lib/cn.js'

// Image avec fade-in au chargement + repli sombre si la photo manque.
// Overlay dégradé optionnel pour garder le texte lisible par-dessus.
export default function Photo({ src, alt = '', className, imgClassName, overlay = false, children }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  return (
    <div className={cn('relative overflow-hidden bg-ink-700', className)}>
      {!error && (
        <img
          src={src} alt={alt} loading="lazy" decoding="async"
          onLoad={() => setLoaded(true)} onError={() => setError(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-500',
            loaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-sm',
            imgClassName
          )}
        />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />}
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  )
}
