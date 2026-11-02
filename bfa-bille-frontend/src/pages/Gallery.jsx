import { useEffect, useMemo, useState } from 'react'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import AlbumFilters from '../components/gallery/AlbumFilters'
import AlbumGrid from '../components/gallery/AlbumGrid'
import AlbumDetails from '../components/gallery/AlbumDetails'
import { api } from '../utils/api'
import { ALBUM_THEMES, normalizeAlbum } from '../utils/albumAdapter'

/* ============================================================
   Gallery — Page « Galerie photos et vidéos » (/galerie), maquette Claude Design
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

  const visibleAlbums = filteredAlbums.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAlbums.length

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme)
    setVisibleCount(PAGE_SIZE) // on repart sur la première page
  }

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Galerie' }]}
        title="Galerie photos et vidéos"
        lead="Revivez les moments forts de notre académie en photos et en vidéos."
      />

      <section id="galerie" className="bg-[#fafcfa] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AlbumFilters
            themes={THEMES}
            active={selectedTheme}
            onChange={handleThemeChange}
          />

          {loading ? (
            <p className="py-10 text-center text-sm text-sombre/75">
              Chargement de la galerie…
            </p>
          ) : error ? (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
            >
              {error}
            </div>
          ) : (
            <>
              <p className="mb-6 mt-8 text-sm text-sombre/75" aria-live="polite">
                {filteredAlbums.length} album{filteredAlbums.length > 1 ? 's' : ''}
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
                    Charger plus d&rsquo;albums
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modale d'album + lightbox (toujours montées) */}
      <AlbumDetails
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </>
  )
}
