import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import PlayerCard from './PlayerCard'
import {
  useScrollAnimation,
  staggerContainer,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   PlayerGrid — Grille des joueurs
   ------------------------------------------------------------
   - Mobile : 1 colonne · Tablette : 2 · Desktop : 4
   - Apparition en cascade (stagger) au scroll
   - État vide si aucun joueur ne correspond au filtre
   ============================================================ */

export default function PlayerGrid({ players, onSelect }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.05 })

  if (players.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-dore/40 bg-white p-12 text-center">
        <FontAwesomeIcon
          icon={faUsers}
          className="mx-auto h-12 w-12 text-dore/60"
        />
        <p className="mt-4 font-semibold text-sombre">
          Aucun joueur dans cette catégorie.
        </p>
        <p className="mt-1 text-sm text-sombre/60">
          Modifiez le filtre pour afficher d&rsquo;autres joueurs.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
