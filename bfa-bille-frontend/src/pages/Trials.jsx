import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import TrialForm from '../components/trial/TrialForm'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Trials — Page « Inscription aux essais » (/essais)
   ------------------------------------------------------------
   - Titre + sous-titre
   - Formulaire de prise de rendez-vous (TrialForm) :
     validation en temps réel, soumission simulée et message
     de confirmation.
   ============================================================ */

export default function Trials() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })

  return (
    <section id="essais" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Inscription aux essais"
            subtitle="Rejoignez la BFA Academy. Remplissez le formulaire ci-dessous et notre équipe reviendra vers vous pour confirmer la date de votre essai."
          />
        </motion.div>

        <TrialForm />
      </div>
    </section>
  )
}
