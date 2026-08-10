import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faImage,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import { staggerItem } from '../../hooks/useScrollAnimation'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   AlbumCard — Carte d'un album (cliquable)
   ------------------------------------------------------------
   Image de couverture (zoom +5 % au survol), titre, date
   ("12 Oct 2024"), badge de thème. Une icône Play indique que
   l'album contient au moins une vidéo. Le clic ouvre la vue
   détaillée via onSelect.
   ============================================================ */

export default function AlbumCard({ album, onSelect }) {
  const hasVideo = album.medias.some((media) => media.type === 'video')
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(album)
    }
  }

  return (
    <motion.div variants={staggerItem}>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => onSelect(album)}
        onKeyDown={handleKeyDown}
        aria-label={`Ouvrir l'album ${album.titre}`}
        className="group h-full cursor-pointer overflow-hidden text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-vert/15"
      >
        {/* Couverture */}
        <div className="relative overflow-hidden bg-vert">
          <img
            src={album.coverImage}
            alt={`Couverture de l'album ${album.titre}`}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge de thème */}
          <span className="absolute left-3 top-3 rounded-full bg-vert/90 px-3 py-1 text-xs font-bold text-white shadow backdrop-blur-sm">
            {album.theme}
          </span>

          {/* Nombre de médias */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <FontAwesomeIcon icon={faImage} className="h-3 w-3 text-dore" />
            {album.medias.length}
          </span>

          {/* Badge vidéo */}
          {hasVideo && (
            <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-dore text-vert-dark shadow-lg">
              <FontAwesomeIcon icon={faPlay} className="ml-0.5 h-4 w-4" />
            </span>
          )}
        </div>

        {/* Infos */}
        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-bold text-sombre transition-colors duration-300 group-hover:text-vert">
            {album.titre}
          </h3>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-sombre/60">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="h-3.5 w-3.5 text-dore-dark"
              />
              {formatDateCard(parseLocalDate(album.date))}
            </span>
            <span className="font-semibold text-vert opacity-80 transition-opacity group-hover:opacity-100">
              Voir →
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
