import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

// Compteur qui s'anime de 0 jusqu'à la valeur, en chiffres tabulaires.
// "Chiffres concrets, pas des %" → on les rend vivants.
export default function Counter({ value, decimals = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 90, damping: 18 })

  useEffect(() => { if (inView) mv.set(value) }, [inView, value, mv])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals)
    })
  }, [spring, decimals])

  return <span ref={ref} className={`tnum ${className}`}>0</span>
}
