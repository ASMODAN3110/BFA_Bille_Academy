import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'
import BouncingBall from '../ui/BouncingBall'
import { fadeUp, fadeIn } from '../../hooks/useScrollAnimation'

/* ============================================================
   Hero — Bannière d'accueil
   ------------------------------------------------------------
   - Titre d'accroche en doré, sous-titre en blanc
   - CTA « Inscrire mon enfant » (vert sur fond doré)
   - Ballon de football qui rebondit (animation CSS pure)
   ============================================================ */

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-vert">
      {/* Décorations d'arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-dore/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-dore/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Colonne texte */}
        <div className="text-center lg:text-left">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 rounded-full border border-dore/50 bg-dore/10 px-4 py-1.5 text-sm font-semibold text-dore">
              <FontAwesomeIcon icon={faFutbol} className="h-4 w-4" />
              Académie de football · Cameroun
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="mt-6 text-4xl font-black leading-tight tracking-tight text-dore sm:text-5xl lg:text-6xl"
          >
            Formez l&rsquo;élite de demain
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
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
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button to="/essais" size="lg">
              Inscrire mon enfant
              <span aria-hidden="true">→</span>
            </Button>
            <Button to="/equipes" variant="outline" size="lg">
              Découvrir les équipes
            </Button>
          </motion.div>
        </div>

        {/* Colonne ballon */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <BouncingBall speed={2.6} />
        </motion.div>
      </div>

      {/* Vague décorative en bas */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-vert-dark/60 to-transparent" />
    </section>
  )
}
