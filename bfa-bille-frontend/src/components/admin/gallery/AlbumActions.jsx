import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImages,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   AlbumActions — Actions d'un album (back-office galerie)
   ------------------------------------------------------------
   - Ajouter des médias / Modifier / Supprimer (icônes)
   - Props : album, onAddMedia(album), onEdit(album), onDelete(album)
   ============================================================ */

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

export default function AlbumActions({ album, onAddMedia, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onAddMedia(album)}
        aria-label={`Ajouter des médias à ${album.titre}`}
        title="Ajouter des médias"
        className={`${actionButtonClasses} text-vert hover:bg-vert/10`}
      >
        <FontAwesomeIcon icon={faImages} className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onEdit(album)}
        aria-label={`Modifier l'album ${album.titre}`}
        title="Modifier"
        className={`${actionButtonClasses} text-dore hover:bg-dore/10`}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(album)}
        aria-label={`Supprimer l'album ${album.titre}`}
        title="Supprimer"
        className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
      >
        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
      </button>
    </div>
  )
}
