import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleNotch,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Button from '../ui/Button'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormTextarea from './FormTextarea'
import FormStatus from './FormStatus'
import useTrialForm, { todayISO } from '../../hooks/useTrialForm'
import { categories } from '../../data/mockData'
import { useScrollAnimation, fadeUp } from '../../hooks/useScrollAnimation'

/* ============================================================
   TrialForm — Formulaire d'inscription aux essais
   ------------------------------------------------------------
   - 2 colonnes en desktop (pleine largeur : date, message, bouton)
   - 1 colonne en tablette / mobile
   - Validation en temps réel (vert/rouge + shake), focus auto
     sur le champ « Nom », bouton désactivé pendant l'envoi,
     message de confirmation après soumission.
   ============================================================ */

export default function TrialForm() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    submitStatus,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useTrialForm()

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="mx-auto max-w-4xl"
    >
      <Card className="overflow-hidden border-t-4 border-t-dore p-6 shadow-lg shadow-vert/10 md:p-10">
        <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
          {/* Ligne 1 : Nom | Prénom */}
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Votre nom"
              required
              autoFocus
              error={errors.nom}
              touched={touched.nom}
            />
            <FormInput
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Votre prénom"
              error={errors.prenom}
              touched={touched.prenom}
            />
          </div>

          {/* Ligne 2 : Âge | Catégorie */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormInput
              label="Âge"
              name="age"
              type="number"
              min={9}
              max={17}
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ex : 14"
              required
              error={errors.age}
              touched={touched.age}
            />
            <FormSelect
              label="Catégorie"
              name="categorie"
              options={categories}
              placeholder="Sélectionnez une catégorie"
              value={formData.categorie}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={errors.categorie}
              touched={touched.categorie}
            />
          </div>

          {/* Ligne 3 : Téléphone | Email */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormInput
              label="Téléphone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+237 690 00 00 00"
              required
              error={errors.telephone}
              touched={touched.telephone}
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="exemple@email.com"
              required
              error={errors.email}
              touched={touched.email}
            />
          </div>

          {/* Date souhaitée : pleine largeur */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormInput
              label="Date souhaitée pour l'essai"
              name="dateEssai"
              type="date"
              min={todayISO()}
              value={formData.dateEssai}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={errors.dateEssai}
              touched={touched.dateEssai}
              className="md:col-span-2"
            />
          </div>

          {/* Message : pleine largeur */}
          <div className="mt-5">
            <FormTextarea
              label="Message (Optionnel)"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Expérience précédente, poste préféré..."
              error={errors.message}
              touched={touched.message}
            />
          </div>

          {/* Message de confirmation / d'erreur */}
          <FormStatus status={submitStatus} />

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {submitStatus === 'success' ? (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={resetForm}
                className="w-full sm:w-auto"
              >
                Envoyer une autre demande
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Envoyer
                  </>
                )}
              </Button>
            )}

            {submitStatus !== 'success' && (
              <p className="text-xs text-sombre/50">
                Les champs marqués d'un <span className="text-erreur">*</span>{' '}
                sont obligatoires.
              </p>
            )}
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
