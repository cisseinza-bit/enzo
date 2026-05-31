import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Fusionne les classes conditionnelles + résout les conflits Tailwind.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
