import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Card from '../components/ui/Card'
import CategoryFilter from '../components/results/CategoryFilter'
import ResultsList from '../components/results/ResultsList'
import RankingTable from '../components/results/RankingTable'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'
import { parseLocalDate } from '../utils/dateUtils'
import { api } from '../utils/api'
import { normalizeResult } from '../utils/resultsAdapter'
import { useCategories } from '../hooks/useCategories'

/* ============================================================
   Results — Page « Résultats & Classements » (/resultats)
   ------------------------------------------------------------
   - Sélecteur de catégorie (Tous + catégories du backend) qui
     pilote à la fois les résultats et les classements
   - Résultats groupés par date, triés du plus récent au plus
     ancien (@EF35), filtrables par catégorie (client-side sur
     une seule requête GET /api/results)
   - Classements par catégorie (@EF36) : GET /api/rankings/:id —
     « Tous » agrège toutes les catégories, une catégorie choisie
     n'affiche que la sienne
   - Badges de type de match : Championnat (vert) / Amical (doré)
   - États de chargement / erreur sur chaque carte
   - Transition fade-in au changement de catégorie
   ============================================================ */

export default function Results() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  const { categories } = useCategories()
  const CATEGORIES = ['Tous', ...categories.map((c) => c.nom)]

  const [results, setResults] = useState([])
  const [classements, setClassements] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [loadingResults, setLoadingResults] = useState(true)
  const [errorResults, setErrorResults] = useState(null)
  const [loadingRankings, setLoadingRankings] = useState(false)
  const [errorRankings, setErrorRankings] = useState(null)

  // Résultats : une seule requête (100 max), filtre client-side.
  useEffect(() => {
    let active = true
    api('/api/results?limit=100')
      .then((data) => {
        if (active) setResults((data?.data?.items ?? []).map(normalizeResult))
      })
      .catch((err) => {
        if (active) setErrorResults(err?.message || 'Impossible de charger les résultats.')
      })
      .finally(() => {
        if (active) setLoadingResults(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Classements : la catégorie choisie, ou toutes si « Tous ».
  useEffect(() => {
    if (categories.length === 0) return
    const cibles =
      selectedCategory === 'Tous'
        ? categories
        : categories.filter((c) => c.nom === selectedCategory)
    if (cibles.length === 0) return
    let active = true
    setLoadingRankings(true)
    setErrorRankings(null)
    Promise.all(
      cibles.map((c) =>
        api(`/api/rankings/${c.id}`).then((d) => [c.nom, d?.data?.items ?? []]),
      ),
    )
      .then((entries) => {
        if (active) setClassements(Object.fromEntries(entries))
      })
      .catch((err) => {
        if (active) setErrorRankings(err?.message || 'Impossible de charger les classements.')
      })
      .finally(() => {
        if (active) setLoadingRankings(false)
      })
    return () => {
      active = false
    }
  }, [selectedCategory, categories])

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
  // Les catégories sans ligne (items vide) sont ignorées — les
  // classements restent « masqués tant qu'aucun classement n'existe ».
  const classementsToShow = useMemo(() => {
    const source =
      selectedCategory === 'Tous'
        ? classements
        : classements[selectedCategory]
          ? { [selectedCategory]: classements[selectedCategory] }
          : {}
    return Object.fromEntries(
      Object.entries(source).filter(
        ([, teams]) => Array.isArray(teams) && teams.length > 0,
      ),
    )
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
            {loadingResults ? (
              <p className="text-center text-sm text-sombre/60">
                Chargement des résultats…
              </p>
            ) : errorResults ? (
              <div
                role="alert"
                className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
              >
                {errorResults}
              </div>
            ) : (
              <ResultsList results={filteredResults} />
            )}
          </Card>

          {/* Classements — masqués tant qu'aucun classement n'existe */}
          {(loadingRankings || errorRankings || Object.keys(classementsToShow).length > 0) && (
            <Card className="p-6 md:p-8">
              <h3 className="mb-6 text-xl font-extrabold text-vert">
                Classements
              </h3>
              {loadingRankings ? (
                <p className="text-center text-sm text-sombre/60">
                  Chargement des classements…
                </p>
              ) : errorRankings ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
                >
                  {errorRankings}
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(classementsToShow).map(([categorie, teams]) => (
                    <RankingTable
                      key={categorie}
                      title={categorie}
                      teams={teams}
                    />
                  ))}
                </div>
              )}
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  )
}
