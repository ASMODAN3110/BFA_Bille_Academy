import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHammer, faFutbol } from '@fortawesome/free-solid-svg-icons'
import Button from '../components/ui/Button'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Placeholder — Page provisoire pour les sections à venir
   ------------------------------------------------------------
   Utilisée tant que les pages (Blog, Boutique, Admin, etc.)
   ne sont pas encore développées.
   ============================================================ */

const TITLES = {
  '/equipes': 'Annuaire des Équipes',
  '/calendrier': 'Calendrier',
  '/essais': 'Essais & Détections',
  '/galerie': 'Galerie Photos',
  '/equipes/technique': 'Fiches Techniques',
  '/blog': 'Le Blog du Club',
  '/resultats': 'Résultats',
  '/boutique': 'Boutique',
  '/admin': 'Back-office',
}

export default function Placeholder({ page }) {
  const title = TITLES[page] ?? 'Page'

  return (
    <section className="flex min-h-[70vh] items-center bg-clair py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-vert text-dore shadow-lg shadow-vert/20">
          <FontAwesomeIcon icon={faHammer} className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-vert md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sombre/70">
          Cette page est en cours de construction. Revenez bientôt pour
          découvrir tout le contenu du club !
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button to="/" variant="primary">
            <FontAwesomeIcon icon={faFutbol} className="h-4 w-4" />
            Retour à l&rsquo;accueil
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
