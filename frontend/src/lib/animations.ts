import { Variants } from 'framer-motion'

// Ease curves
export const ease = {
  out:    [0.0, 0.0, 0.2, 1.0] as const,
  inOut:  [0.4, 0.0, 0.2, 1.0] as const,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as const,
}

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.28, ease: ease.out }
  },
  exit: {
    opacity: 0, y: -6,
    transition: { duration: 0.18, ease: ease.inOut }
  },
}

// Stagger container
export const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// Card entrance
export const cardVariants: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.32, ease: ease.out }
  },
}

// Fade up (lighter)
export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.22, ease: ease.out }
  },
}

// Fade only
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18 } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
}

// Sidebar
export const sidebarVariants: Variants = {
  expanded:  { width: 240, transition: { duration: 0.22, ease: ease.inOut } },
  collapsed: { width: 60,  transition: { duration: 0.22, ease: ease.inOut } },
}

// Progress bar fill
export const progressVariants = (target: number): Variants => ({
  initial: { width: '0%' },
  animate: {
    width: `${target}%`,
    transition: { duration: 0.9, ease: ease.out, delay: 0.1 }
  },
})

// Search overlay
export const overlayVariants: Variants = {
  initial: { opacity: 0, y: -12, scale: 0.97 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.18, ease: ease.out }
  },
  exit: {
    opacity: 0, y: -8, scale: 0.97,
    transition: { duration: 0.14, ease: ease.inOut }
  },
}

// Sidebar label (text fade on collapse)
export const labelVariants: Variants = {
  visible: { opacity: 1, x: 0,  transition: { duration: 0.15, delay: 0.1 } },
  hidden:  { opacity: 0, x: -6, transition: { duration: 0.1 } },
}
