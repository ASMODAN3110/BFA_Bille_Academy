import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import BouncingBall from '../ui/BouncingBall'

/* ============================================================
   HeroPitchField — Calque d'animation du Hero : le ballon est « tiré » vers le rond central
   ------------------------------------------------------------
   Scénario en boucle :
     1. Le ballon est au repos.
     2. Le rond central d'un terrain apparaît dans un coin du Hero
        (coin différent à chaque tour).
     3. Le ballon est frappé : léger recul + écrasement (armé du pied),
        puis il part vers le centre du rond.
     4. Il roule en ralentissant (frottement, décélération), à une
        vitesse qui change à chaque tour (passe douce, normale, rapide,
        tir puissant : durée, violence du départ, recul du pied, rebonds
        et courbe s'adaptent), tourne sur lui-même au rythme de la distance
        parcourue, suit une légère trajectoire courbe et fait de
        petits rebonds de plus en plus courts sur la pelouse.
     5. Il s'arrête pile au centre : le rond central s'illumine.
     6. Le rond s'efface, puis un nouveau cycle repart d'ailleurs.
   Une ombre au sol suit le ballon et s'estompe pendant les petits
   rebonds. Mouvement désactivé si l'utilisateur préfère moins
   d'animations.
   ============================================================ */

/* Cibles possibles : les 4 coins du Hero, en fraction de sa largeur / hauteur
   (0 = bord gauche / haut, 1 = bord droit / bas). */
const CORNERS = [
  [0.88, 0.2],
  [0.12, 0.2],
  [0.12, 0.8],
  [0.88, 0.8],
]
/* Position de repos du ballon au premier affichage : colonne droite */
const REST = [0.74, 0.5]
const PITCH_OPACITY = 0.35
const RING_STROKE = 3

const rand = (min, max) => min + Math.random() * (max - min)

/* Types de frappe : la vitesse d'arrivée varie d'un tour à l'autre.
   - k       : multiplicateur de durée du trajet (plus petit = plus rapide)
   - exp     : exposant du frottement (plus grand = départ plus violent,
               puis longue glisse finale)
   - recoil  : recul du pied avant la frappe (px)
   - squash  : écrasement du ballon à l'impact
   - hop     : hauteur des petits rebonds sur la pelouse (px)
   - arc     : courbe de la trajectoire (fraction de la distance) */
const SHOTS = [
  { name: 'passe douce', k: 1.45, exp: 2, recoil: 6, squash: 0.06, hop: 8, arc: 0.14 },
  { name: 'normale', k: 1, exp: 2, recoil: 9, squash: 0.12, hop: 11, arc: 0.1 },
  { name: 'rapide', k: 0.6, exp: 2.3, recoil: 12, squash: 0.16, hop: 13, arc: 0.07 },
  { name: 'tir puissant', k: 0.3, exp: 2.8, recoil: 16, squash: 0.22, hop: 16, arc: 0.04 },
]

export default function HeroPitchField() {
  const reduceMotion = useReducedMotion()
  const fieldRef = useRef(null)
  const ballBoxRef = useRef(null)

  /* Ballon : position au sol, rotation, petits rebonds, écrasement */
  const ballX = useMotionValue(0)
  const ballY = useMotionValue(0)
  const rotation = useMotionValue(0)
  const hop = useMotionValue(0)
  const squashX = useMotionValue(1)
  const squashY = useMotionValue(1)
  const shadowScale = useTransform(hop, [-12, 0], [0.75, 1])
  const shadowOpacity = useTransform(hop, [-12, 0], [0.55, 1])

  /* Rond central : position (coin), opacité, échelle, trait du cercle */
  const pitchX = useMotionValue(0)
  const pitchY = useMotionValue(0)
  const pitchOpacity = useMotionValue(reduceMotion ? PITCH_OPACITY : 0)
  const pitchScale = useMotionValue(1)
  const ringStroke = useMotionValue(RING_STROKE)

  useEffect(() => {
    if (reduceMotion) return undefined

    let cancelled = false

    /* Le ballon démarre au repos dans la colonne droite du Hero */
    const startField = fieldRef.current
    if (startField) {
      ballX.set((REST[0] - 0.5) * startField.clientWidth)
      ballY.set((REST[1] - 0.5) * startField.clientHeight)
    }
    const timers = new Set()
    const running = new Set()

    const sleep = (seconds) =>
      new Promise((resolve) => {
        const id = setTimeout(() => {
          timers.delete(id)
          resolve()
        }, seconds * 1000)
        timers.add(id)
      })

    const to = (value, target, options) => {
      const controls = animate(value, target, options)
      running.add(controls)
      return controls
    }

    async function loop() {
      let lastCorner = -1
      let lastShot = -1
      await sleep(1.1) // ballon au repos au premier affichage

      while (!cancelled) {
        const field = fieldRef.current
        const box = ballBoxRef.current
        if (!field || !box) return

        /* --- 1. Le rond apparaît dans un coin (différent du précédent) --- */
        let k
        do {
          k = Math.floor(Math.random() * CORNERS.length)
        } while (k === lastCorner)
        lastCorner = k
        const [fx, fy] = CORNERS[k]
        /* Décalage par rapport au centre du Hero */
        const targetX = (fx - 0.5) * field.clientWidth
        const targetY = (fy - 0.5) * field.clientHeight

        pitchX.set(targetX)
        pitchY.set(targetY)
        pitchScale.set(0.7)
        await Promise.all([
          to(pitchOpacity, PITCH_OPACITY, { duration: 0.7, ease: 'easeOut' }),
          to(pitchScale, 1, { duration: 0.9, ease: 'easeOut' }),
        ])
        if (cancelled) return

        /* --- 2. Le ballon « remarque » le rond, puis est frappé --- */
        await sleep(rand(0.35, 0.7))
        if (cancelled) return

        /* Type de frappe de ce tour (jamais deux fois de suite le même) */
        let m
        do {
          m = Math.floor(Math.random() * SHOTS.length)
        } while (m === lastShot)
        lastShot = m
        const shot = SHOTS[m]

        const x0 = ballX.get()
        const y0 = ballY.get()
        const dx = targetX - x0
        const dy = targetY - y0
        const dist = Math.hypot(dx, dy) || 1
        const ux = dx / dist
        const uy = dy / dist

        /* Armé du pied : léger recul + écrasement */
        await Promise.all([
          to(ballX, x0 - ux * shot.recoil, { duration: 0.14, ease: 'easeOut' }),
          to(ballY, y0 - uy * shot.recoil, { duration: 0.14, ease: 'easeOut' }),
          to(squashX, 1 + shot.squash, { duration: 0.14, ease: 'easeOut' }),
          to(squashY, 1 - shot.squash, { duration: 0.14, ease: 'easeOut' }),
        ])
        if (cancelled) return

        /* --- 3. Frappe : le ballon part en roulant, en ralentissant --- */
        const startX = ballX.get()
        const startY = ballY.get()
        const rollX = targetX - startX
        const rollY = targetY - startY
        const rollDist = Math.hypot(rollX, rollY) || 1
        const radius = Math.max(box.clientWidth / 2, 24)
        const rot0 = rotation.get()
        const dir = Math.abs(rollX) > 8 ? Math.sign(rollX) : Math.sign(rollY) || 1
        /* Légère courbe (effet) perpendiculaire à la trajectoire */
        const arc = rand(-1, 1) * shot.arc * rollDist
        const perpX = -rollY / rollDist
        const perpY = rollX / rollDist
        const duration = (1.3 + rollDist / 600) * shot.k
        /* Frottement : vitesse maximale au départ, nulle à l'arrivée */
        const friction = (t) => 1 - Math.pow(1 - t, shot.exp)

        to(squashX, 1, { duration: 0.3, ease: 'easeOut' })
        to(squashY, 1, { duration: 0.3, ease: 'easeOut' })

        await to(0, 1, {
          duration,
          ease: friction,
          onUpdate: (p) => {
            const bend = Math.sin(p * Math.PI) * arc
            ballX.set(startX + rollX * p + perpX * bend)
            ballY.set(startY + rollY * p + perpY * bend)
            /* Le ballon tourne de (distance roulée / rayon) radians */
            rotation.set(rot0 + dir * ((rollDist * p) / radius) * (180 / Math.PI))
            /* Petits rebonds de plus en plus courts et amortis */
            hop.set(
              -Math.abs(Math.sin(p * Math.PI * 3.5)) * Math.pow(1 - p, 1.6) * shot.hop,
            )
          },
        })
        if (cancelled) return
        hop.set(0)

        /* --- 4. Arrivé au centre : le rond s'illumine --- */
        await to(ringStroke, 7, { duration: 0.25, ease: 'easeOut' })
        await to(ringStroke, RING_STROKE, { duration: 0.6, ease: 'easeInOut' })
        if (cancelled) return

        /* --- 5. Pause, puis le rond s'efface --- */
        await sleep(1.3)
        if (cancelled) return
        await to(pitchOpacity, 0, { duration: 0.8, ease: 'easeInOut' })
        if (cancelled) return
        await sleep(rand(0.9, 1.6))
      }
    }

    loop()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      running.forEach((c) => c.stop())
    }
  }, [
    reduceMotion,
    ballX,
    ballY,
    rotation,
    hop,
    squashX,
    squashY,
    pitchX,
    pitchY,
    pitchOpacity,
    pitchScale,
    ringStroke,
  ])

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Motif de terrain : rond central + ligne médiane */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-40 -mt-40 h-80 w-80"
        style={{ x: pitchX, y: pitchY, opacity: pitchOpacity, scale: pitchScale }}
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      >
        <circle cx="100" cy="100" r="90" />
        <motion.circle cx="100" cy="100" r="30" strokeWidth={ringStroke} />
        <path d="M100 10v180M10 100h180" />
      </motion.svg>

      {/* Ballon : au sol (x, y) dans le Hero, avec ombre ; il tourne et rebondit légèrement */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ x: ballX, y: ballY }}
      >
        <div ref={ballBoxRef} className="relative">
          <motion.div
            style={{
              y: hop,
              rotate: rotation,
              scaleX: squashX,
              scaleY: squashY,
            }}
          >
            <BouncingBall bounce={false} spin={false} height="clamp(6rem, 9vw, 8rem)" />
          </motion.div>
          {/* Ombre au sol : suit le ballon, s'estompe quand il décolle */}
          <div className="absolute inset-x-0 -bottom-3 flex justify-center">
            <motion.span
              aria-hidden="true"
              className="block h-3 w-2/3 rounded-[50%]"
              style={{
                scale: shadowScale,
                opacity: shadowOpacity,
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 80%)',
                filter: 'blur(2px)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
