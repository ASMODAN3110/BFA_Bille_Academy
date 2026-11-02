import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faImage } from '@fortawesome/free-solid-svg-icons'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'
import { getAlbumCover } from '../../utils/albumAdapter'

/* ============================================================
   AlbumCard — Carte d'un album (cliquable) — maquette Claude Design
   ------------------------------------------------------------
   Couverture de 220 px (1re image de l'album, dégradé si absente ou
   si le fichier est introuvable) avec le thème en pastille dorée en
   haut à gauche ; dessous, titre et nombre de médias, puis la date.
   Une pastille Play indique qu'il y a au moins une vidéo. Le clic
   ouvre la vue détaillée via onSelect.
   ============================================================ */

export default function AlbumCard({ album, onSelect }) {
  const hasVideo = album.medias.some((media) => media.type === 'video')
  const cover = getAlbumCover(album)
  const [coverFailed, setCoverFailed] = useState(false)
  const count = album.medias.length

  return (
    <button
      type="button"
      onClick={() => onSelect(album)}
      aria-label={`Ouvrir l'album ${album.titre}`}
      className="group block w-full overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-vert/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
    >
      <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-[#cfe6d6] to-menthe">
        {cover && !coverFailed && (
          <img
            src={cover}
            alt={`Couverture de l'album ${album.titre}`}
            loading="lazy"
            onError={() => setCoverFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {(!cover || coverFailed) && (
          <div className="flex h-full w-full items-center justify-center">
            <FontAwesomeIcon icon={faImage} className="h-10 w-10 text-vert/30" />
          </div>
        )}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-[#fff4cc] px-3 py-1 text-xs font-semibold text-dore-dark">
          {album.theme}
        </span>
        {hasVideo && (
          <span className="absolute bottom-3.5 left-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-vert shadow">
            <FontAwesomeIcon icon={faPlay} className="ml-0.5 h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className="px-5 py-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="line-clamp-1 text-[19px] font-semibold text-[#14231a] transition-colors group-hover:text-vert">
            {album.titre}
          </h3>
          <span className="shrink-0 text-sm text-sombre/70">
            {count} média{count > 1 ? 's' : ''}
          </span>
        </div>
        <p className="mt-1 text-sm text-sombre/70">
          {formatDateCard(parseLocalDate(album.dateCreation))}
        </p>
      </div>
    </button>
  )
}
