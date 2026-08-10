import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImages,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import Badge from '../../ui/Badge'
import AlbumActions from './AlbumActions'
import { parseLocalDate, formatDateCard } from '../../../utils/dateUtils'
import { staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation'

/* ============================================================
   AlbumGrid — Grille des albums (back-office galerie)
   ------------------------------------------------------------
   - Grille responsive : 3 colonnes (desktop) / 2 (tablette) / 1 (mobile)
   - Couverture cliquable → ouvre la vue médias (onOpen)
   - Thème (badge), titre, description, date, compteurs médias
   - Actions : ajouter des médias / modifier / supprimer
   ============================================================ */

const THEME_BADGE = {
  Entraînements: 'selected',
  Matchs: 'mvp',
  Événements: 'success',
  Portraits: 'default',
}

export default function AlbumGrid({ albums, onOpen, onAddMedia, onEdit, onDelete }) {
  if (!albums || albums.length === 0) return null

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {albums.map((album) => {
        const videoCount = album.medias.filter((m) => m.type === 'video').length
        return (
          <motion.div key={album.id} variants={staggerItem} className="h-full">
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-clair bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-vert/10">
              {/* Couverture cliquable */}
              <button
                type="button"
                onClick={() => onOpen(album)}
                aria-label={`Ouvrir l'album ${album.titre}`}
                className="relative block aspect-[16/10] w-full overflow-hidden text-left"
              >
                <img
                  src={album.coverImage}
                  alt={`Couverture de l'album ${album.titre}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-vert-dark/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <Badge variant={THEME_BADGE[album.theme] ?? 'default'}>
                    {album.theme}
                  </Badge>
                </span>
                <span className="absolute right-3 top-3 flex items-center gap-2">
                  {videoCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-vert">
                      <FontAwesomeIcon icon={faVideo} className="h-3 w-3" />
                      {videoCount}
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-vert">
                    <FontAwesomeIcon icon={faImages} className="h-3 w-3" />
                    {album.medias.length}
                  </span>
                </span>
              </button>

              {/* Corps de la carte */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 font-extrabold text-vert">
                  {album.titre}
                </h3>
                {album.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-sombre/60">
                    {album.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-sombre/50">
                  {formatDateCard(parseLocalDate(album.dateCreation))}
                </p>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-clair pt-3">
                  <AlbumActions
                    album={album}
                    onAddMedia={onAddMedia}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
