import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import HeroPitchField from './HeroPitchField'
import { fadeUp, hasPlayed, markPlayed } from '../../hooks/useScrollAnimation'

/* ============================================================
   Hero — Bannière d'accueil
   ------------------------------------------------------------
   - Image de fond (stade) + voile sombre pour la lisibilité
   - Titre d'accroche en police display, CTA pilule
   - Animation plein Hero : un ballon roule vers le rond central d'un terrain
   ============================================================ */

/** Image de fond du Hero (terrain/stade de football). */
const HERO_BG =
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&q=80'

export default function Hero() {
  /* Cascade d'apparition jouée une seule fois par chargement de page */
  const [initial] = useState(() => (hasPlayed('hero') ? false : 'hidden'))
  useEffect(() => markPlayed('hero', 2000), [])

  return (
    <section className="relative overflow-hidden bg-vert-dark">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      {/* Calque d'animation (ballon + rond central), sous le texte */}
      <HeroPitchField />

      <div className="relative z-10 mx-auto flex min-h-[34rem] max-w-7xl items-center px-4 py-16 sm:px-6 md:py-24 lg:min-h-[38rem] lg:px-8">
        {/* Colonne texte */}
        <div className="text-center lg:max-w-2xl lg:text-left">
          <motion.h1
            variants={fadeUp}
            initial={initial}
            animate="visible"
            transition={{ delay: 0.15 }}
            className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Formez l&rsquo;élite
            <br />
            de demain.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={initial}
            animate="visible"
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-lg text-white/90 sm:text-xl lg:mx-0"
          >
            BFA Bille Academy — Former, Discipliner, Révéler.
            <br className="hidden sm:block" />
            L&rsquo;excellence du football amateur au Cameroun.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial={initial}
            animate="visible"
            transition={{ delay: 0.45 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button to="/essais" size="lg" glare>
              Inscrire mon enfant
              <span aria-hidden="true">→</span>
            </Button>
            <Link to="/equipes" className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition hover:bg-white hover:text-[#14231a]">
              Découvrir les équipes
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
