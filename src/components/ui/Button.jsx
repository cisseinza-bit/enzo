import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn.js'

const variants = cva(
  'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-colors disabled:opacity-40 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary: 'bg-lime text-ink-900 shadow-glow',
        ghost: 'bg-ink-700 text-white border border-ink-500/50',
        flame: 'bg-flame text-ink-900 shadow-glow-flame',
        subtle: 'bg-transparent text-muted border border-ink-500/50',
      },
      size: {
        lg: 'py-4 px-6 text-base w-full',
        md: 'py-3 px-5 text-sm',
        sm: 'py-2 px-4 text-xs',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg' },
  }
)

export default function Button({ variant, size, className, children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(variants({ variant, size }), className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}
