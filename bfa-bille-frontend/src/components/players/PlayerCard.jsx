import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { staggerItem } from '../../hooks/useScrollAnimation'
import { getAge } from '../../utils/ageUtils'

/* ============================================================
   PlayerCard — Carte d'un joueur (cliquable) — maquette Claude Design
   ------------------------------------------------------------
   Bandeau photo (ou dégradé menthe si absente) avec, en bas, les
   initiales dans un carré vert à gauche et la catégorie en pastille
   dorée à droite. Dessous : nom complet, puis poste et âge.
   Le clic (ou Entrée / Espace) ouvre la fiche détaillée via onSelect.
   ============================================================ */

const initials = (player) =>
  `${player.prenom?.[0] ?? ''}${player.nom?.[0] ?? ''}`.toUpperCase() || '?'

export default function PlayerCard({ player, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(player)
    }
  }

  const fullName = [player.prenom, player.nom].filter(Boolean).join(' ')
  const age = player.dateNaissance ? getAge(player.dateNaissance) : null

  return (
    <motion.div variants={staggerItem}>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => onSelect(player)}
        onKeyDown={handleKeyDown}
        aria-label={`Voir la fiche de ${fullName}`}
        className="group h-full cursor-pointer overflow-hidden rounded-[20px] border-[#e3ede6] text-left shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-vert/10"
      >
        {/* Bandeau photo */}
        <div className="relative flex h-[200px] items-end justify-between overflow-hidden bg-gradient-to-br from-[#cfe6d6] to-menthe p-3.5">
          {player.photo && (
            <img
              src={player.photo}
              alt={`Photo de ${fullName}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-vert font-display text-xl font-extrabold text-white">
            {initials(player)}
          </span>
          <span className="relative rounded-full bg-[#fff4cc] px-3 py-1 text-xs font-semibold text-dore-dark">
            {player.categorie?.nom ?? player.categorie}
          </span>
        </div>

        {/* Infos */}
        <div className="px-5 py-[18px]">
          <h3 className="text-[19px] font-semibold leading-snug text-[#14231a] transition-colors duration-300 group-hover:text-vert">
            {fullName}
          </h3>
          <p className="mt-1 text-sm text-sombre/70">
            {[player.poste, age != null ? `${age} ans` : null].filter(Boolean).join(' · ')}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
