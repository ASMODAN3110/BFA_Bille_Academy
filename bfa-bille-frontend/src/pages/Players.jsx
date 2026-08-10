import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import PlayerFilters from '../components/players/PlayerFilters'
import PlayerGrid from '../components/players/PlayerGrid'
import PlayerDetails from '../components/players/PlayerDetails'
import { players } from '../data/mockData'
import usePlayerFilter from '../hooks/usePlayerFilter'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   Players — Page « Annuaire des joueurs » (/equipes)
   ------------------------------------------------------------
   - Filtres par catégorie (Tous, U9, U15, U17)
   - Grille responsive 1 / 2 / 4 colonnes
   - Modale de fiche détaillée au clic sur une carte
   ============================================================ */

export default function Players() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  const { categories, counts, selectedCategory, setSelectedCategory, filteredPlayers } =
    usePlayerFilter(players)

  const [selectedPlayer, setSelectedPlayer] = useState(null)

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

        <p className="mb-8 text-center text-sm text-sombre/60">
          {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''}{' '}
          affiché{filteredPlayers.length > 1 ? 's' : ''}
          {selectedCategory !== 'Tous' && ` · catégorie ${selectedCategory}`}
        </p>

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

        <PlayerGrid players={filteredPlayers} onSelect={setSelectedPlayer} />
      </div>

      {/* Modale de fiche détaillée */}
      <PlayerDetails
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </section>
  )
}
