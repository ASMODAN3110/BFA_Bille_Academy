import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import AlbumCard from './AlbumCard'
import {
  useScrollAnimation,
  staggerContainer,
} from '../../hooks/useScrollAnimation'

/* ============================================================
   AlbumGrid — Grille des albums
   ------------------------------------------------------------
   - Mobile : 1 colonne · Tablette : 2 · Desktop : 3
   - Apparition en cascade (stagger) au scroll
   - État vide si aucun album ne correspond au filtre
   ============================================================ */

export default function AlbumGrid({ albums, onSelect }) {
  const { ref, isInView } = useScrollAnimation({ amount: 0.05 })

  if (albums.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-dore/40 bg-white p-12 text-center">
        <FontAwesomeIcon
          icon={faImages}
          className="mx-auto h-12 w-12 text-dore/60"
        />
        <p className="mt-4 font-semibold text-sombre">
          Aucun album dans ce thème.
        </p>
        <p className="mt-1 text-sm text-sombre/60">
          Modifiez le filtre pour afficher d&rsquo;autres albums.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
