import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * useScrollAnimation
 * ---------------
 * Hook d'animation au scroll basé sur Framer Motion.
 *
 * Retourne une `ref` à accrocher à l'élément et un booléen
 * `isInView` qui passe à `true` lorsque l'élément entre dans
 * le viewport. Combine le tout avec les variantes `variants`
 * (voir `fadeUp`, `fadeIn`, `scaleIn`) pour animer proprement :
 *
 *   const { ref, isInView } = useScrollAnimation()
 *   <motion.div ref={ref} animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
 *     ...
 *   </motion.div>
 *
 * @param {object} options Options de IntersectionObserver
 *   (once, amount, margin, ...) — voir la doc framer-motion/useInView.
 */
export function useScrollAnimation(options = { once: true, amount: 0.2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, options)
  return { ref, isInView }
}

/* ============================================================
   Variantes d'animation partagées
   ============================================================ */

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}
