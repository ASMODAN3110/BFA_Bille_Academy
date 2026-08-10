import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   PlayerDetails — Modale de fiche détaillée d'un joueur
   ------------------------------------------------------------
   - Photo en grand, nom, poste, âge, date d'arrivée
   - Statistiques (matchs, buts, passes) si présentes
   - Fermeture : bouton ✕, clic sur le fond, touche Échap
   - Ouverture/fermeture animées (fade-in + scale)
   ============================================================ */

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function PlayerDetails({ player, onClose }) {
  // Touche Échap + verrouillage du scroll de la page
  useEffect(() => {
    if (!player) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [player, onClose])

  return (
    <AnimatePresence>
      {player && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        >
          {/* Fond assombri */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-vert-dark/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Contenu */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Fiche du joueur ${player.nom}`}
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fiche"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sombre shadow-md transition-colors hover:bg-dore hover:text-vert-dark"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>

            <div className="grid sm:grid-cols-[240px_1fr]">
              {/* Photo */}
              <div className="relative">
                <img
                  src={player.photo}
                  alt={`Photo de ${player.nom}`}
                  className="h-56 w-full object-cover sm:h-full sm:min-h-[300px]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-dore px-3 py-1 text-xs font-bold text-vert-dark">
                  {player.categorie}
                </span>
              </div>

              {/* Détails */}
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dore-dark">
                  {player.poste}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-vert md:text-3xl">
                  {player.nom}
                </h3>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-clair p-3">
                    <p className="text-xs text-sombre/60">Âge</p>
                    <p className="mt-0.5 font-bold text-sombre">{player.age} ans</p>
                  </div>
                  <div className="rounded-xl bg-clair p-3">
                    <p className="text-xs text-sombre/60">Arrivée au club</p>
                    <p className="mt-0.5 font-bold text-sombre">
                      {formatDate(player.dateArrivee)}
                    </p>
                  </div>
                </div>

                {player.stats && (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-sombre/60">
                      Statistiques
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-xl bg-vert p-3 text-white">
                        <p className="text-xl font-black text-dore">
                          {player.stats.matches}
                        </p>
                        <p className="text-xs text-white/80">Matchs</p>
                      </div>
                      <div className="rounded-xl bg-vert p-3 text-white">
                        <p className="text-xl font-black text-dore">
                          {player.stats.buts}
                        </p>
                        <p className="text-xs text-white/80">Buts</p>
                      </div>
                      <div className="rounded-xl bg-vert p-3 text-white">
                        <p className="text-xl font-black text-dore">
                          {player.stats.passes}
                        </p>
                        <p className="text-xs text-white/80">Passes</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
