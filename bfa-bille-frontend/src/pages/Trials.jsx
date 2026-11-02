import PageHero from '../components/layout/PageHero'
import TrialForm from '../components/trial/TrialForm'
import TrialSteps from '../components/trial/TrialSteps'

/* ============================================================
   Trials — Page « Inscription aux essais » (/essais), maquette Claude Design
   ------------------------------------------------------------
   - Bandeau de titre
   - Deux colonnes : « Comment ça se passe » (3 étapes) à gauche,
     formulaire de prise de rendez-vous (TrialForm) à droite :
     validation en temps réel et message de confirmation.
   Sur mobile les colonnes s'empilent.
   ============================================================ */

export default function Trials() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Accueil', to: '/' }, { label: "Inscription aux essais" }]}
        title="Inscription aux essais"
        lead="Remplissez le formulaire : l'équipe technique vous recontacte pour confirmer la date et le lieu."
      />

      <section id="essais" className="bg-[#fafcfa] py-10 md:py-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-10 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-[1_1_320px]">
            <TrialSteps />
          </div>
          <div className="min-w-0 flex-[2_1_520px]">
            <TrialForm />
          </div>
        </div>
      </section>
    </>
  )
}
