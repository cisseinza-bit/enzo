import {
  Home, CalendarDays, Activity, TrendingUp, Sparkles, User,
  Flame, Droplets, Utensils, GlassWater, Lock, Unlock, Check,
  ChevronDown, ChevronLeft, Play, Square, RotateCcw, Plus,
  ShoppingCart, ChefHat, Timer, Trophy, Heart, Zap, Brain,
  ArrowRight, Settings2, LogOut, Camera, Ruler,
} from 'lucide-react'

// Registre sémantique : on nomme par usage, pas par glyphe.
// Permet de changer l'icône d'un concept en un seul endroit.
const REGISTRY = {
  home: Home, programme: CalendarDays, sport: Activity, suivi: TrendingUp,
  plus: Sparkles, compte: User,
  flame: Flame, water: Droplets, meal: Utensils, checker: GlassWater,
  lock: Lock, unlock: Unlock, check: Check,
  chevronDown: ChevronDown, back: ChevronLeft, play: Play, stop: Square,
  redo: RotateCcw, add: Plus, cart: ShoppingCart, batch: ChefHat,
  timer: Timer, trophy: Trophy, heart: Heart, energy: Zap, brain: Brain,
  arrow: ArrowRight, settings: Settings2, logout: LogOut, camera: Camera, ruler: Ruler,
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 2, ...rest }) {
  const Cmp = REGISTRY[name]
  if (!Cmp) return null
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} {...rest} />
}
