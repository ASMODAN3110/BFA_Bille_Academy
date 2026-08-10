import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons'
import { staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation'

/* ============================================================
   MediaGrid — Grille des médias d'un album (@EF24)
   ------------------------------------------------------------
   - Vignettes images (aperçu réel) / vidéos (icône lecture)
   - Clic sur un média → aperçu agrandi (onPreview)
   - Suppression par média (onDeleteMedia), avec confirmation
     gérée par la page parente
   - Grille responsive : 4 colonnes (desktop) / 3 (tablette) / 2 (mobile)
   ============================================================ */

export default function MediaGrid({ album, onPreview, onDeleteMedia }) {
  if (!album) return null

  if (album.medias.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-clair p-10 text-center">
        <FontAwesomeIcon icon={faVideo} className="mx-auto h-10 w-10 text-sombre/20" />
        <p className="mt-3 font-bold text-sombre/70">
          Aucun média dans cet album.
        </p>
        <p className="mt-1 text-sm text-sombre/50">
          Utilisez « Ajouter des médias » pour importer des photos ou vidéos.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
    >
      {album.medias.map((media) => (
        <motion.div key={media.id} variants={staggerItem} className="group relative">
          <button
            type="button"
            onClick={() => onPreview(media)}
            aria-label={`Visualiser ${media.nomFichier ?? 'le média'}`}
            title="Visualiser"
            className="block w-full overflow-hidden rounded-xl border border-clair bg-white shadow-sm transition hover:shadow-lg hover:shadow-vert/10"
          >
            {media.type === 'video' ? (
              <span className="relative flex aspect-video w-full items-center justify-center bg-vert-dark/90">
                <FontAwesomeIcon icon={faPlay} className="h-8 w-8 text-dore" />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  <FontAwesomeIcon icon={faVideo} className="h-2.5 w-2.5" />
                  Vidéo
                </span>
              </span>
            ) : (
              <span className="relative block aspect-video w-full overflow-hidden">
                <img
                  src={media.url}
                  alt={media.nomFichier ?? 'Photo de l’album'}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>
            )}
          </button>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-xs font-semibold text-sombre">
              {media.nomFichier ?? 'Sans titre'}
            </p>
            <button
              type="button"
              onClick={() => onDeleteMedia(media)}
              aria-label={`Supprimer le média ${media.nomFichier ?? media.id}`}
              title="Supprimer"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-erreur transition hover:bg-erreur/10 active:scale-95"
            >
              <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
