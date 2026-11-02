import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faPlus } from '@fortawesome/free-solid-svg-icons'
import { getAlbumCover } from '../../../utils/albumAdapter'

/* Couverture d'un album. Si l'URL échoue (média manquant en stockage),
   on retombe sur le dégradé de la maquette plutôt qu'une image cassée. */
function AlbumCover({ cover, title }) {
  const [failed, setFailed] = useState(false)
  if (cover && !failed) {
    return (
      <img
        src={cover}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
        title={`Couverture de l'album ${title}`}
      />
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#bfe3cb] to-menthe">
      <FontAwesomeIcon icon={faImages} className="h-8 w-8 text-vert/30" />
    </div>
  )
}

/* ============================================================
   AlbumGrid — Grille des albums (back-office galerie)
   ------------------------------------------------------------
   - Cartes : couverture (150 px), titre, « 24 médias · Matchs »
   - Clic = sélection (les médias s'affichent sous la grille)
   - Dernière carte en pointillés : « Ajouter des photos »
   - 1 colonne (téléphone) / 2 (tablette) / 4 (grand écran)
   ============================================================ */

export default function AlbumGrid({ albums, selectedId, onSelect, onAddPhotos }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {albums.map((album) => {
        const on = album.id === selectedId
        const n = album.medias.length
        return (
          <button
            key={album.id}
            type="button"
            onClick={() => onSelect(album.id)}
            aria-pressed={on}
            aria-label={`Ouvrir l'album ${album.titre}`}
            className={`overflow-hidden rounded-2xl border bg-white text-left transition hover:shadow-md ${
              on ? 'border-vert ring-2 ring-vert/25' : 'border-[#e3ede6]'
            }`}
          >
            <div className="h-[150px]">
              <AlbumCover cover={getAlbumCover(album)} title={album.titre} />
            </div>
            <div className="p-3.5">
              <b className="line-clamp-1 font-semibold">{album.titre}</b>
              <div className="mt-0.5 text-xs text-sombre/75">
                {n} média{n > 1 ? 's' : ''} · {album.theme}
              </div>
            </div>
          </button>
        )
      })}
      <button
        type="button"
        onClick={onAddPhotos}
        className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#b9d4c1] bg-[#fafcfa] p-4 text-sm font-semibold text-vert-dark transition hover:bg-menthe sm:min-h-[218px]"
      >
        <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
        Ajouter des photos
        <span className="text-xs font-normal text-sombre/75">Glisser-déposer ou parcourir</span>
      </button>
    </section>
  )
}
