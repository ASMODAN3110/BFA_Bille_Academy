import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarCheck,
  faFutbol,
  faMedal,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import {
  useRevealOnce,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'
import useHomeData from '../../hooks/useHomeData'

/* ============================================================
   Stats — Chiffres clés avec compteur animé
   ------------------------------------------------------------
   Le compteur démarre lorsque la section entre dans le viewport.
   ============================================================ */

const STAT_ICONS = {
  futbol: faFutbol,
  users: faUsers,
  medal: faMedal,
  'calendar-check': faCalendarCheck,
}

/* Petit composant compteur animé (0 → valeur) */
function Counter({ value, isInView, instant }) {
  const nodeRef = useRef(null)

  useEffect(() => {
    if (instant) {
      if (nodeRef.current) nodeRef.current.textContent = String(value)
      return undefined
    }
    if (!isInView) return undefined

    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = String(Math.round(latest))
        }
      },
    })
    return () => controls.stop()
  }, [isInView, value, instant])

  return <span ref={nodeRef}>0</span>
}

function StatsContent({ stats }) {
  const { ref, initial, animate, revealed, already } = useRevealOnce('stats', 0.3)

  // Section masquée tant qu'aucune statistique n'est disponible.
  if (stats.length === 0) return null

  return (
    <section id="stats" className="relative overflow-hidden bg-white py-12 md:py-14">
      {/* Décor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-dore/10 blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial={initial}
          animate={animate}
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="py-2"
            >
              <FontAwesomeIcon
                icon={STAT_ICONS[stat.icon]}
                className="h-6 w-6 text-dore-dark"
              />
              <p className="mt-2 font-display text-5xl font-extrabold leading-none text-vert md:text-6xl">
                <Counter value={stat.value} isInView={revealed} instant={already} />
                <span>{stat.suffix}</span>
              </p>
              <p className="mt-2 text-[15px] text-sombre/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* Les données arrivent après le premier rendu : le contenu (et son
   détecteur de scroll) n'est monté qu'une fois qu'elles sont là. */
export default function Stats() {
  const { stats } = useHomeData()
  if (stats.length === 0) return null
  return <StatsContent stats={stats} />
}
