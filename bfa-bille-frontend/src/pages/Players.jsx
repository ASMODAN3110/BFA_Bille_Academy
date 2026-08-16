import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import PlayerFilters from '../components/players/PlayerFilters'
import PlayerGrid from '../components/players/PlayerGrid'
import PlayerDetails from '../components/players/PlayerDetails'
import Pagination from '../components/ui/Pagination'
import usePlayerFilter from '../hooks/usePlayerFilter'
import { useCategories } from '../hooks/useCategories'
import { api } from '../utils/api'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Players — Page « Annuaire des joueurs » (/equipes)
   ------------------------------------------------------------
   - Données : GET /api/players (limit=100, tri serveur) +
     GET /api/categories (filtres) — plus de mock.
   - Filtres par catégorie, pagination locale, modale de fiche.
   ============================================================ */

const PAGE_SIZE = 8

export default function Players() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  const { categories: categoryOptions } = useCategories()

  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const {
    categories,
    counts,
    selectedCategory,
    setSelectedCategory,
    filteredPlayers,
  } = usePlayerFilter(players, categoryOptions)

  /* Chargement de l'effectif (le backend trie déjà nom puis prénom). */
  useEffect(() => {
    let active = true
    api('/api/players?limit=100')
      .then((data) => {
        if (!active) return
        setPlayers(data?.data?.items ?? [])
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || 'Impossible de charger les joueurs.')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  /* Retour à la 1re page dès qu'un filtre change. */
  useEffect(() => {
    setPage(1)
  }, [selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE))
  const pageItems = filteredPlayers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeLabel =
    selectedCategory === 'Tous'
      ? null
      : (categoryOptions.find((c) => c.id === selectedCategory)?.nom ?? null)

  return (
    <section id="equipes" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Annuaire des Joueurs"
            subtitle="Découvrez les talents de la BFA Academy. Cliquez sur une carte pour consulter la fiche complète d'un joueur."
          />
        </motion.div>

        <PlayerFilters
          categories={categories}
          counts={counts}
          active={selectedCategory}
          onChange={setSelectedCategory}
        />

        {loading ? (
          <p className="mb-8 text-center text-sm text-sombre/60">
            Chargement des joueurs…
          </p>
        ) : error ? (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
          >
            {error}
          </div>
        ) : (
          <p className="mb-8 text-center text-sm text-sombre/60">
            {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''}{' '}
            affiché{filteredPlayers.length > 1 ? 's' : ''}
            {activeLabel && ` · catégorie ${activeLabel}`}
          </p>
        )}

        {/* Lien vers les fiches techniques */}
        <div className="mb-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dore/30 bg-white p-5 sm:flex-row sm:gap-6">
          <p className="text-center text-sm text-sombre/70 sm:text-left">
            Consultez l'effectif complet, le staff et le palmarès de chaque
            catégorie.
          </p>
          <Button
            to="/equipes/technique/U9"
            variant="outline"
            size="sm"
            className="shrink-0 px-6"
          >
            Fiches techniques par catégorie →
          </Button>
        </div>

        {!loading && !error && (
          <>
            <PlayerGrid players={pageItems} onSelect={setSelectedPlayer} />
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Modale de fiche détaillée */}
      <PlayerDetails
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </section>
  )
}
