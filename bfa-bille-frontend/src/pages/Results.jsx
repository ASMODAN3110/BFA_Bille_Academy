import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Card from '../components/ui/Card'
import CategoryFilter from '../components/results/CategoryFilter'
import ResultsList from '../components/results/ResultsList'
import RankingTable from '../components/results/RankingTable'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'
import { parseLocalDate } from '../utils/dateUtils'

/* ============================================================
   Results — Page « Résultats & Classements » (/resultats)
   ------------------------------------------------------------
   - Sélecteur de catégorie (Tous, U17 A, U15 Elite) qui pilote
     à la fois les résultats et les classements
   - Résultats groupés par date, triés du plus récent au plus
     ancien (@EF35), filtrables par catégorie
   - Classements par catégorie (@EF36) : « Tous » affiche les
     deux tableaux, une catégorie choisie n'affiche que le sien
   - Badges de type de match : Championnat (vert) / Amical (doré)
   - Transition fade-in au changement de catégorie
   ============================================================ */

/* ['Tous', ...Object.keys(classements)] — classements vide → « Tous » seul. */
const CATEGORIES = ['Tous']

export default function Results() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  // ⚠️ Plus de données mock : aucun résultat ni classement.
  // Seront branchés au backend (module « Résultats »).
  const [results] = useState([])
  const [classements] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  // Résultats filtrés par catégorie et triés par date décroissante.
  const filteredResults = useMemo(() => {
    const byCategory =
      selectedCategory === 'Tous'
        ? results
        : results.filter((result) => result.categorie === selectedCategory)
    return [...byCategory].sort(
      (a, b) => parseLocalDate(b.date) - parseLocalDate(a.date),
    )
  }, [selectedCategory, results])

  // Classements à afficher : une seule catégorie, ou toutes si « Tous ».
  const classementsToShow = useMemo(() => {
    if (selectedCategory === 'Tous') return classements
    return classements[selectedCategory] ? { [selectedCategory]: classements[selectedCategory] } : {}
  }, [selectedCategory, classements])

  return (
    <section id="resultats" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Résultats & Classements"
            subtitle="Suivez les performances de nos équipes, résultats de matchs et classements par catégorie."
          />
        </motion.div>

        <CategoryFilter
          categories={CATEGORIES}
          active={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Contenu — re-animé (fade-in) à chaque changement de catégorie */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Résultats */}
          <Card className="p-6 md:p-8">
            <h3 className="mb-5 text-xl font-extrabold text-vert">Résultats</h3>
            <ResultsList results={filteredResults} />
          </Card>

          {/* Classements — masqués tant qu'aucun classement n'existe */}
          {Object.keys(classementsToShow).length > 0 && (
            <Card className="p-6 md:p-8">
              <h3 className="mb-6 text-xl font-extrabold text-vert">
                Classements
              </h3>
              <div className="space-y-8">
                {Object.entries(classementsToShow).map(([categorie, teams]) => (
                  <RankingTable
                    key={categorie}
                    title={categorie}
                    teams={teams}
                  />
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  )
}
