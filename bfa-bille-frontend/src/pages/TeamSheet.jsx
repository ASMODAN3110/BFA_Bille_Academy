import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/layout/Breadcrumb'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TeamSelector from '../components/team/TeamSelector'
import RosterTable from '../components/team/RosterTable'
import StaffList from '../components/team/StaffList'
import ObjectivesList from '../components/team/ObjectivesList'
import PalmaresList from '../components/team/PalmaresList'
import { teamSheets } from '../data/mockData'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   TeamSheet — Fiche technique d'une catégorie
               (/equipes/technique/:categorie)
   ------------------------------------------------------------
   - Fil d'ariane (Accueil › Équipes › Fiches techniques › U15)
   - Sélecteur de catégorie (U9 | U15 | U17) via l'URL
   - Effectif (tableau + statuts), staff, objectifs, palmarès
   - Redirection vers U9 si aucune catégorie ou catégorie inconnue
   ============================================================ */

const CATEGORIES = Object.keys(teamSheets) // ['U9', 'U15', 'U17']

export default function TeamSheet() {
  const { categorie } = useParams()
  const navigate = useNavigate()
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })

  // Redirection vers la première catégorie (U9) si l'URL est
  // invalide ou absente.
  useEffect(() => {
    if (categorie && !teamSheets[categorie]) {
      navigate(`/equipes/technique/${CATEGORIES[0]}`, { replace: true })
    }
  }, [categorie, navigate])

  const team = teamSheets[categorie] ?? teamSheets[CATEGORIES[0]]

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Équipes', href: '/equipes' },
    { label: 'Fiches techniques', href: '/equipes/technique' },
    { label: team.categorie },
  ]

  return (
    <section id="fiche-technique" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Fil d'ariane */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Fiches Techniques"
            subtitle="Profils techniques détaillés, effectifs et données historiques par catégorie."
          />
        </motion.div>

        <TeamSelector
          categories={CATEGORIES}
          active={team.categorie}
          onChange={(cat) => navigate(`/equipes/technique/${cat}`)}
        />

        {/* Contenu de la fiche — re-animé à chaque changement */}
        <motion.div
          key={team.categorie}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-10 space-y-8"
        >
          {/* Effectif */}
          <Card className="p-6 md:p-8">
            <h3 className="mb-4 text-xl font-extrabold text-vert">
              Effectif {team.saison}
            </h3>
            <RosterTable effectif={team.effectif} />
            <div className="mt-5 flex justify-end">
              <Button
                to="/equipes"
                variant="outline"
                size="sm"
                className="px-6"
              >
                Voir tout l'effectif →
              </Button>
            </div>
          </Card>

          {/* Staff technique */}
          <Card className="p-6 md:p-8">
            <h3 className="mb-5 text-xl font-extrabold text-vert">
              Staff Technique
            </h3>
            <StaffList staff={team.staff} />
          </Card>

          {/* Objectifs de la saison */}
          <Card className="p-6 md:p-8">
            <h3 className="mb-5 text-xl font-extrabold text-vert">
              Objectifs Saison
            </h3>
            <ObjectivesList objectifs={team.objectifs} />
          </Card>

          {/* Palmarès */}
          <Card className="p-6 md:p-8">
            <h3 className="mb-5 text-xl font-extrabold text-vert">Palmarès</h3>
            <PalmaresList palmares={team.palmares} />
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
