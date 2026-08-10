import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { staggerItem } from '../../hooks/useScrollAnimation'

/* ============================================================
   PlayerCard — Carte d'un joueur (cliquable)
   ------------------------------------------------------------
   Photo, nom, poste (en doré), âge et catégorie. Le clic
   (ou la touche Entrée) ouvre la fiche détaillée via onSelect.
   Survol : scale + ombre renforcée.
   ============================================================ */

export default function PlayerCard({ player, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(player)
    }
  }

  return (
    <motion.div variants={staggerItem}>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => onSelect(player)}
        onKeyDown={handleKeyDown}
        aria-label={`Voir la fiche de ${player.nom}`}
        className="group h-full cursor-pointer overflow-hidden text-left transition-transform duration-300 hover:scale-[1.03]"
      >
        {/* Photo */}
        <div className="relative overflow-hidden">
          <img
            src={player.photo}
            alt={`Photo de ${player.nom}`}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 rounded-full bg-vert/90 px-3 py-1 text-xs font-bold text-white shadow">
            {player.categorie}
          </span>
        </div>

        {/* Infos */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-sombre transition-colors duration-300 group-hover:text-vert">
            {player.nom}
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-dore-dark">
            {player.poste}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-clair pt-3 text-sm">
            <span className="text-sombre/70">{player.age} ans</span>
            <span className="font-semibold text-vert opacity-80 transition-opacity group-hover:opacity-100">
              Voir la fiche →
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
