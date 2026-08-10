import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   BlogActions — Actions d'un article (ligne de tableau)
   ------------------------------------------------------------
   - Modifier        (crayon doré)
   - Publier / Dépublier (œil vert / œil barré orange)
   - Supprimer       (poubelle rouge, avec confirmation page)
   ------------------------------------------------------------
   Props : post, onEdit, onTogglePublish, onDelete
   ============================================================ */

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

export default function BlogActions({ post, onEdit, onTogglePublish, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(post)}
        aria-label={`Modifier l'article ${post.titre}`}
        title="Modifier"
        className={`${actionButtonClasses} text-dore hover:bg-dore/10`}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onTogglePublish(post)}
        aria-label={
          post.estPublie
            ? `Dépublier l'article ${post.titre}`
            : `Publier l'article ${post.titre}`
        }
        title={post.estPublie ? 'Dépublier' : 'Publier'}
        className={`${actionButtonClasses} ${
          post.estPublie
            ? 'text-orange-500 hover:bg-orange-500/10'
            : 'text-succes hover:bg-succes/10'
        }`}
      >
        <FontAwesomeIcon
          icon={post.estPublie ? faEyeSlash : faEye}
          className="h-4 w-4"
        />
      </button>

      <button
        type="button"
        onClick={() => onDelete(post)}
        aria-label={`Supprimer l'article ${post.titre}`}
        title="Supprimer"
        className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
      >
        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
      </button>
    </div>
  )
}
