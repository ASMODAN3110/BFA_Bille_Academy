import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'
import { club } from '../../config/site'
import { useScrollAnimation, scaleIn } from '../../hooks/useScrollAnimation'

/* ============================================================
   CTA — Appel à l'action final
   ------------------------------------------------------------
   Bannière « Rejoignez l'aventure » + bouton Contactez-nous
   - Image de fond (terrain de football) + voile vert foncé
   ============================================================ */

/** Image de fond du CTA (terrain/ballon de football). */
const CTA_BG =
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80'

export default function CTA() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.3 })

  return (
    <section className="bg-vert-dark">
      <motion.div
        ref={ref}
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vert via-vert to-vert-dark px-6 py-16 text-center shadow-2xl shadow-vert/40 md:px-12 md:py-20"
      >
        {/* Image de fond (pleine, sans voile) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${CTA_BG}')` }}
        />
        {/* Léger voile vert : garde les écritures (blanc/doré) lisibles
            sur l'image tout en laissant la photo bien visible. */}
        <div aria-hidden="true" className="absolute inset-0 bg-vert-dark/60" />

        {/* Décorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-dore/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-dore/10 blur-3xl"
        />
        <FontAwesomeIcon
          icon={faFutbol}
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rotate-12 text-dore/10"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-dore/50 bg-dore/10 px-4 py-1.5 text-sm font-semibold text-dore">
            <FontAwesomeIcon icon={faFutbol} className="h-4 w-4" />
            {club.tagline}
          </span>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
            Rejoignez <span className="text-dore">l&rsquo;aventure</span>
            <br />
            BFA Bille Academy
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            Inscrivez votre enfant dès aujourd&rsquo;hui et offrez-lui les
            clés de son avenir sportif. Une place vous attend au sein de
            notre grande famille.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href={`mailto:${club.email}`}
              variant="secondary"
              size="lg"
            >
              Contactez-nous
            </Button>
            <Button to="/essais" variant="outline" size="lg" glare>
              Voir les essais
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
