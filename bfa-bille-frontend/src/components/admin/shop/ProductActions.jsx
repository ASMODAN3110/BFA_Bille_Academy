import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   ProductActions — Actions d'un produit (ligne de tableau)
   ------------------------------------------------------------
   - Modifier  (crayon doré)
   - Supprimer (poubelle rouge, avec confirmation page)
   ------------------------------------------------------------
   Props : product, onEdit, onDelete
   ============================================================ */

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

export default function ProductActions({ product, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(product)}
        aria-label={`Modifier le produit ${product.nom}`}
        title="Modifier"
        className={`${actionButtonClasses} text-dore hover:bg-dore/10`}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(product)}
        aria-label={`Supprimer le produit ${product.nom}`}
        title="Supprimer"
        className={`${actionButtonClasses} text-erreur hover:bg-erreur/10`}
      >
        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
      </button>
    </div>
  )
}
