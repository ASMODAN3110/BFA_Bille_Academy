import { useEffect, useRef } from 'react'
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

/* Sections déjà apparues depuis le chargement de la page. Variable de module :
   elle survit à la navigation interne (SPA) mais est remise à zéro par un
   rechargement (F5) — c'est exactement la règle voulue. */
const played = new Set()

/** Marque une section comme jouée (après la fin de son animation). */
export function markPlayed(id, delayMs = 1500) {
  const timer = setTimeout(() => played.add(id), delayMs)
  return () => clearTimeout(timer)
}

/** Vrai si cette section a déjà joué son animation depuis le chargement. */
export const hasPlayed = (id) => played.has(id)

/**
 * useRevealOnce
 * -------------
 * Apparition d'une section quand elle entre à l'écran, UNE SEULE FOIS par
 * chargement de page : pas de rejeu en remontant / redescendant, ni en
 * revenant sur la page par la navigation interne. Seul un rechargement
 * de la page la rejoue.
 *
 * Retourne `ref`, `initial` et `animate` à passer au motion.* :
 *   const { ref, initial, animate } = useRevealOnce('valeurs')
 *   <motion.div ref={ref} variants={fadeUp} initial={initial} animate={animate}>
 * ainsi que `revealed` (déjà visible ou en cours d'apparition) pour les
 * compteurs.
 */
export function useRevealOnce(id, amount = 0.2) {
  const ref = useRef(null)
  const already = played.has(id)
  const isInView = useInView(ref, { once: true, amount })

  useEffect(() => {
    if (!isInView) return undefined
    return markPlayed(id)
  }, [isInView, id])

  return {
    ref,
    initial: already ? false : 'hidden',
    animate: already || isInView ? 'visible' : 'hidden',
    revealed: already || isInView,
    already,
  }
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
