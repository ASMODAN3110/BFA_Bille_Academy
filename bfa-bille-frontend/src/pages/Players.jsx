import { useEffect, useState } from 'react'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import PlayerFilters from '../components/players/PlayerFilters'
import PlayerGrid from '../components/players/PlayerGrid'
import PlayerDetails from '../components/players/PlayerDetails'
import Pagination from '../components/ui/Pagination'
import usePlayerFilter from '../hooks/usePlayerFilter'
import { useCategories } from '../hooks/useCategories'
import { api } from '../utils/api'

/* ============================================================
   Players — Page « Annuaire des joueurs » (/equipes), maquette Claude Design
   ------------------------------------------------------------
   - Données : GET /api/players (limit=100, tri serveur) +
     GET /api/categories (filtres) — plus de mock.
   - Bandeau de titre, recherche + filtres catégorie / poste,
     grille de cartes, pagination locale, modale de fiche.
   ============================================================ */

const PAGE_SIZE = 8

export default function Players() {
  const { categories: categoryOptions } = useCategories()

  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const {
    categories,
    postes,
    selectedCategory,
    setSelectedCategory,
    selectedPoste,
    setSelectedPoste,
    search,
    setSearch,
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

  /* Retour à la 1re page dès qu'un filtre ou la recherche change. */
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, selectedPoste, search])

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE))
  const pageItems = filteredPlayers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const total = filteredPlayers.length

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Joueurs' }]}
        title="Annuaire des joueurs"
        lead="Découvrez les talents de l'académie, par catégorie et par poste. Cliquez sur une carte pour consulter la fiche complète d'un joueur."
      />

      <section id="equipes" className="bg-[#fafcfa] py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PlayerFilters
            search={search}
            onSearch={setSearch}
            categories={categories}
            active={selectedCategory}
            onChange={setSelectedCategory}
            postes={postes}
            poste={selectedPoste}
            onPoste={setSelectedPoste}
          />

          <div className="mb-6 mt-8" aria-live="polite">
            {loading ? (
              <p className="text-sm text-sombre/75">Chargement des joueurs…</p>
            ) : error ? (
              <div
                role="alert"
                className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
              >
                {error}
              </div>
            ) : (
              <p className="text-sm text-sombre/75">
                {total} joueur{total > 1 ? 's' : ''} affiché{total > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {!loading && !error && (
            <>
              <PlayerGrid players={pageItems} onSelect={setSelectedPlayer} />
              <Pagination
                variant="square"
                className="mt-10"
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}

          {/* Lien vers les fiches techniques */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e3ede6] bg-white p-6 sm:flex-row">
            <p className="text-center text-[15px] text-sombre/80 sm:text-left">
              Consultez l&rsquo;effectif complet, le staff et le palmarès de chaque
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
        </div>
      </section>

      {/* Modale de fiche détaillée */}
      <PlayerDetails
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  )
}
