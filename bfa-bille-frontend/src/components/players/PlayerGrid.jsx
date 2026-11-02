import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import PlayerCard from './PlayerCard'
import { useRevealOnce, staggerContainer } from '../../hooks/useScrollAnimation'

/* ============================================================
   PlayerGrid — Grille des joueurs
   ------------------------------------------------------------
   - Colonnes automatiques (cartes de 250 px minimum)
   - Apparition en cascade (stagger), une seule fois par chargement de page
   - État vide si aucun joueur ne correspond au filtre
   ============================================================ */

export default function PlayerGrid({ players, onSelect }) {
  const { ref, initial, animate } = useRevealOnce('joueurs', 0.05)

  if (players.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-dore/40 bg-white p-12 text-center">
        <FontAwesomeIcon
          icon={faUsers}
          className="mx-auto h-12 w-12 text-dore/60"
        />
        <p className="mt-4 font-semibold text-sombre">
          Aucun joueur ne correspond à votre recherche.
        </p>
        <p className="mt-1 text-sm text-sombre/75">
          Modifiez la recherche ou les filtres pour afficher d&rsquo;autres joueurs.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial={initial}
      animate={animate}
      className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6"
    >
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
