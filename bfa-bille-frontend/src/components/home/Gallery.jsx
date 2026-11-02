import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import useHomeData from '../../hooks/useHomeData'
import MediaLightbox from '../gallery/MediaLightbox'
import {
  useRevealOnce,
  staggerContainer,
  staggerItem,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   Gallery — Mosaïque de photos (accueil)
   ------------------------------------------------------------
   Remplace le carrousel : toutes les photos sont visibles d'un coup,
   sans clic ni défilement automatique.
   - 5 photos : une grande vignette (2×2) + 4 petites, sur 4 colonnes
   - 3 ou 4 photos : une grande (2×2) + 2 petites, sur 3 colonnes
   - 1 ou 2 photos : une rangée, colonnes égales
   Apparition en cascade (fondu + montée) à l'arrivée sur la section, une
   seule fois par chargement de page (voir useRevealOnce).
   Un clic sur une vignette ouvre la photo en plein écran (visionneuse
   partagée avec la page Galerie) : flèches ou ← → pour parcourir toutes
   les photos chargées, Échap pour fermer. Légende sur chaque vignette,
   zoom léger au survol. « Voir toute la galerie » mène à la page Galerie.
   Si une image ne se charge pas, un fond dégradé la remplace.
   ============================================================ */

/** Nombre de vignettes affichées selon le nombre de photos disponibles. */
const visibleCount = (n) => (n >= 5 ? 5 : n >= 3 ? 3 : n)

const GRID_COLS = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  5: 'lg:grid-cols-4',
}

function Tile({ photo, large, onOpen }) {
  const [broken, setBroken] = useState(false)

  return (
    <motion.div
      variants={staggerItem}
      className={large ? 'col-span-2 row-span-2' : undefined}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[20px] border border-[#e3ede6] bg-gradient-to-br from-menthe to-[#fff8e1] text-left"
        aria-label={`Agrandir la photo : ${photo.caption}`}
        aria-haspopup="dialog"
      >
        {!broken && (
          <img
            src={photo.image}
            alt={photo.caption}
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-12 md:p-5 md:pt-14">
          <p
            className={`flex items-center gap-2 font-semibold text-white ${
              large ? 'text-base md:text-lg' : 'text-sm'
            }`}
          >
            <FontAwesomeIcon icon={faCamera} className="h-4 w-4 shrink-0 text-dore" />
            <span className="truncate">{photo.caption}</span>
          </p>
        </div>
      </button>
    </motion.div>
  )
}

function GalleryContent({ gallery }) {
  const { ref, initial, animate } = useRevealOnce('galerie', 0.15)
  const photos = gallery.slice(0, visibleCount(gallery.length))
  const cols = GRID_COLS[photos.length] ?? 'lg:grid-cols-4'
  const hasLarge = photos.length >= 3

  /* Visionneuse : parcourt toutes les photos chargées, pas seulement les vignettes */
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const medias = gallery.map((g) => ({
    id: g.id,
    url: g.image,
    type: 'image',
    caption: g.caption,
  }))
  const navigate = (dir) =>
    setIndex((i) => (i + dir + medias.length) % medias.length)

  /* Clavier (Échap / flèches) + verrouillage du scroll tant qu'elle est ouverte */
  useEffect(() => {
    if (!open) return undefined
    const count = gallery.length
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, gallery.length])

  return (
    <section id="galerie" className="bg-[#fafcfa] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-4xl font-bold leading-none text-[#14231a] md:text-5xl">
            Galerie
          </h2>
          <Link
            to="/galerie"
            className="shrink-0 text-[15px] font-semibold text-[#0f6b33] transition-colors hover:text-vert"
          >
            Voir toute la galerie →
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-sombre/75">
          Quelques instants de vie du club, en images.
        </p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial={initial}
          animate={animate}
          className={`mt-8 grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[13rem] lg:auto-rows-[14rem] ${cols}`}
        >
          {photos.map((photo, i) => (
            <Tile
              key={photo.id}
              photo={photo}
              large={hasLarge && i === 0}
              onOpen={() => {
                setIndex(i)
                setOpen(true)
              }}
            />
          ))}
        </motion.div>
      </div>

      <MediaLightbox
        open={open}
        medias={medias}
        index={index}
        onClose={() => setOpen(false)}
        onNavigate={navigate}
      />
    </section>
  )
}

/* Les données arrivent après le premier rendu : le contenu (et son
   détecteur de scroll) n'est monté qu'une fois qu'elles sont là. */
export default function Gallery() {
  const { gallery } = useHomeData()
  if (gallery.length === 0) return null
  return <GalleryContent gallery={gallery} />
}
