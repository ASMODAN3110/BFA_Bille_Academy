import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   MediaGrid — Médias d'un album (@EF24)
   ------------------------------------------------------------
   - Vignettes carrées : images (aperçu réel) / vidéos (icône lecture)
   - La photo de couverture (1re image) est cerclée d'or
   - Clic → aperçu agrandi (onPreview) ; corbeille → suppression
     (confirmation gérée par la page parente)
   - 3 colonnes (téléphone) / 4 (tablette) / 6 (grand écran)
   ============================================================ */

function Thumb({ media }) {
  const [failed, setFailed] = useState(false)
  if (media.type === 'video') {
    return (
      <span className="relative flex h-full w-full items-center justify-center bg-vert-dark/90">
        <FontAwesomeIcon icon={faPlay} className="h-6 w-6 text-dore" />
        <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          <FontAwesomeIcon icon={faVideo} className="h-2.5 w-2.5" />
          Vidéo
        </span>
      </span>
    )
  }
  if (failed) return <span className="block h-full w-full bg-[#dcefe2]" />
  return (
    <img
      src={media.url}
      alt={media.nom ?? 'Photo de l’album'}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  )
}

export default function MediaGrid({ album, onPreview, onDeleteMedia }) {
  if (!album) return null

  if (album.medias.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#cfe0d4] p-10 text-center">
        <FontAwesomeIcon icon={faVideo} className="mx-auto h-10 w-10 text-sombre/20" />
        <p className="mt-3 font-bold text-sombre/75">Aucun média dans cet album.</p>
        <p className="mt-1 text-sm text-sombre/75">
          Utilisez « Ajouter des photos » pour importer des photos ou vidéos.
        </p>
      </div>
    )
  }

  const coverId = album.medias.find((m) => m.type === 'image')?.id

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
      {album.medias.map((media) => (
        <div key={media.id} className="group relative">
          <button
            type="button"
            onClick={() => onPreview(media)}
            aria-label={`Visualiser ${media.nom ?? 'le média'}`}
            title="Visualiser"
            className={`block aspect-square w-full overflow-hidden rounded-[10px] bg-[#dcefe2] ${
              media.id === coverId ? 'outline outline-[3px] outline-dore' : ''
            }`}
          >
            <Thumb media={media} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteMedia(media)}
            aria-label={`Supprimer le média ${media.nom ?? media.id}`}
            title="Supprimer"
            className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-erreur shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
