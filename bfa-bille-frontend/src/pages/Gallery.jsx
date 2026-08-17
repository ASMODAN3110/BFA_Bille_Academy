import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import AlbumFilters from '../components/gallery/AlbumFilters'
import AlbumGrid from '../components/gallery/AlbumGrid'
import AlbumDetails from '../components/gallery/AlbumDetails'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { ALBUM_THEMES, normalizeAlbum } from '../utils/albumAdapter'

/* ============================================================
   Gallery — Page « Galerie photos et vidéos » (/galerie)
   ------------------------------------------------------------
   - Données depuis le backend (Module 4) : GET /api/albums
     (public, sans token) → items normalisés via normalizeAlbum.
   - Filtres par thème (Tous + les 4 thèmes, Portraits inclus)
   - Grille d'albums 1 / 2 / 3 colonnes
   - Chargement progressif : bouton « Charger plus » (3 albums)
   - Clic sur un album → modale + lightbox (images) / lecteur vidéo
   ============================================================ */

const THEMES = ['Tous', ...ALBUM_THEMES]
const PAGE_SIZE = 3

export default function Gallery() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('Tous')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedAlbum, setSelectedAlbum] = useState(null)

  /* Chargement des albums (public, sans token). Une seule requête
     avec limit=100 : la pagination / le filtrage restent côté client. */
  useEffect(() => {
    let cancelled = false
    api('/api/albums?limit=100')
      .then((res) => {
        if (cancelled) return
        const items = (res?.data?.items ?? []).map(normalizeAlbum)
        // Diagnostic : nombre d'albums réellement reçus.
        console.log(`[galerie] ${items.length} album(s) chargé(s)`)
        setAlbums(items)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.message || 'Impossible de charger les albums.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredAlbums = useMemo(
    () =>
      selectedTheme === 'Tous'
        ? albums
        : albums.filter((album) => album.theme === selectedTheme),
    [selectedTheme, albums],
  )

  const counts = useMemo(() => {
    const result = { Tous: albums.length }
    for (const theme of ALBUM_THEMES) {
      result[theme] = albums.filter((a) => a.theme === theme).length
    }
    return result
  }, [albums])

  const visibleAlbums = filteredAlbums.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAlbums.length

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme)
    setVisibleCount(PAGE_SIZE) // on repart sur la première page
  }

  return (
    <section id="galerie" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Galerie"
            subtitle="Revivez les moments forts de notre académie en photos et en vidéos."
          />
        </motion.div>

        <AlbumFilters
          themes={THEMES}
          counts={counts}
          active={selectedTheme}
          onChange={handleThemeChange}
        />

        {loading ? (
          <p className="py-10 text-center text-sm text-sombre/60">
            Chargement de la galerie…
          </p>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
          >
            {error}
          </div>
        ) : (
          <>
            <p className="mb-8 text-center text-sm text-sombre/60">
              {filteredAlbums.length} album
              {filteredAlbums.length > 1 ? 's' : ''} affiché
              {filteredAlbums.length > 1 ? 's' : ''}
              {selectedTheme !== 'Tous' && ` · thème ${selectedTheme}`}
            </p>

            <AlbumGrid albums={visibleAlbums} onSelect={setSelectedAlbum} />

            {hasMore && (
              <div className="mt-10 text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="px-8"
                >
                  Charger plus de médias
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modale d'album + lightbox (toujours montées) */}
      <AlbumDetails
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </section>
  )
}
