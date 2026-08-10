import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faImages,
  faFilm,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons'
import MediaModal from './MediaModal'
import MediaLightbox from './MediaLightbox'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   AlbumDetails — Vue détaillée d'un album (+ lightbox)
   ------------------------------------------------------------
   - Ouvre une modale avec la grille des médias de l'album
   - Clic sur un média → lightbox plein écran (photos + vidéos)
   - Gère le clavier (Échap / flèches) et le verrouillage du
     scroll, pour la modale comme pour la lightbox
   ============================================================ */

export default function AlbumDetails({ album, onClose }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Ferme la lightbox quand l'album se referme.
  useEffect(() => {
    if (!album) {
      setIsLightboxOpen(false)
      setLightboxIndex(0)
    }
  }, [album])

  // Clavier (Échap / flèches) + verrouillage du scroll.
  useEffect(() => {
    if (!album) return undefined

    const navigate = (dir) => {
      setLightboxIndex((i) => {
        const len = album.medias.length
        return (i + dir + len) % len
      })
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false)
        else onClose()
      } else if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') navigate(-1)
        else if (e.key === 'ArrowRight') navigate(1)
      }
    }

    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [album, isLightboxOpen, onClose])

  const openMedia = (i) => {
    setLightboxIndex(i)
    setIsLightboxOpen(true)
  }

  const videoCount = (album?.medias ?? []).filter(
    (m) => m.type === 'video',
  ).length

  return (
    <>
      <MediaModal
        isOpen={Boolean(album)}
        onClose={onClose}
        label={`Album : ${album?.titre ?? ''}`}
        maxWidth="max-w-4xl"
      >
        {/* En-tête */}
        <div className="border-b border-clair bg-clair/60 px-6 py-5 pr-16 md:px-8">
          <span className="inline-block rounded-full bg-dore px-3 py-1 text-xs font-bold uppercase tracking-wide text-vert-dark">
            {album?.theme}
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-vert md:text-2xl">
            {album?.titre}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sombre/60">
            {album && (
              <>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="h-3.5 w-3.5 text-dore-dark"
                  />
                  {formatDateCard(parseLocalDate(album.date))}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faImages}
                    className="h-3.5 w-3.5 text-dore-dark"
                  />
                  {album.medias.length} médias
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faFilm}
                    className="h-3.5 w-3.5 text-dore-dark"
                  />
                  {videoCount} vidéo{videoCount > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Grille de médias */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(album?.medias ?? []).map((media, i) => (
              <button
                key={media.id}
                type="button"
                onClick={() => openMedia(i)}
                aria-label={`Ouvrir le média ${i + 1}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-vert focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40"
              >
                {media.type === 'video' ? (
                  <>
                    <img
                      src={album.coverImage}
                      alt={`Aperçu vidéo ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-vert-dark/30">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-dore text-vert-dark shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faPlay} className="ml-0.5 h-5 w-5" />
                      </span>
                    </span>
                  </>
                ) : (
                  <img
                    src={media.url}
                    alt={`Photo ${i + 1} — ${album.titre}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-sombre/50">
            Cliquez sur un média pour l&rsquo;afficher en plein écran.
          </p>
        </div>
      </MediaModal>

      {/* Lightbox plein écran (toujours montée, pilotée par `open`) */}
      <MediaLightbox
        open={isLightboxOpen}
        medias={album ? album.medias : []}
        index={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(dir) => {
          setLightboxIndex((i) => {
            const len = album ? album.medias.length : 0
            if (!len) return i
            return (i + dir + len) % len
          })
        }}
      />
    </>
  )
}
