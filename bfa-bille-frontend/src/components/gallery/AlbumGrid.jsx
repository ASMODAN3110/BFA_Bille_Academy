import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import AlbumCard from './AlbumCard'

/* ============================================================
   AlbumGrid — Grille des albums (maquette Claude Design)
   ------------------------------------------------------------
   Colonnes automatiques (cartes de 300 px minimum). État vide si
   aucun album ne correspond au filtre.
   ============================================================ */

export default function AlbumGrid({ albums, onSelect }) {
  if (albums.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-dore/40 bg-white p-12 text-center">
        <FontAwesomeIcon icon={faImages} className="mx-auto h-12 w-12 text-dore/60" />
        <p className="mt-4 font-semibold text-sombre">Aucun album dans ce thème.</p>
        <p className="mt-1 text-sm text-sombre/75">
          Modifiez le filtre pour afficher d&rsquo;autres albums.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onSelect={onSelect} />
      ))}
    </div>
  )
}
