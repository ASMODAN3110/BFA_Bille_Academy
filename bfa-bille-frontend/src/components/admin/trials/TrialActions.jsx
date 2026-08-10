import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faCircleCheck,
  faCircleXmark,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   TrialActions — Actions d'une demande d'essai (admin)
   ------------------------------------------------------------
   - Voir détails (modale @EF15)
   - Valider  → statut « Confirmé » (@EF18)
   - Refuser  → modale de motif, puis statut « Refusé » (@EF19)
   - Supprimer (avec confirmation)
   ============================================================ */

const actionButtonClasses =
  'flex h-9 w-9 items-center justify-center rounded-lg transition active:scale-95'

/* Le mock admin stocke parfois le nom complet dans « nom »
   (ex : « Lucas Dupont ») — évite « Lucas Lucas Dupont »
   dans les libellés accessibles (aria-label, title). */
const displayName = (t) =>
  t.prenom && t.nom && t.nom.includes(t.prenom)
    ? t.nom
    : `${t.prenom} ${t.nom}`.trim()

export default function TrialActions({
  trial,
  onConfirm,
  onRefuse,
  onDetails,
  onDelete,
}) {
  const name = displayName(trial)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onDetails(trial)}
        aria-label={`Voir les détails de ${name}`}
        title="Voir détails"
        className={`${actionButtonClasses} text-sombre/50 hover:bg-vert/10 hover:text-vert`}
      >
        <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onConfirm(trial)}
        disabled={trial.statut === 'Confirmé'}
        aria-label={`Valider ${name}`}
        title="Valider"
        className={`${actionButtonClasses} text-succes hover:bg-succes/10 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onRefuse(trial)}
        disabled={trial.statut === 'Refusé'}
        aria-label={`Refuser ${name}`}
        title="Refuser"
        className={`${actionButtonClasses} text-erreur hover:bg-erreur/10 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(trial)}
        aria-label={`Supprimer ${name}`}
        title="Supprimer"
        className={`${actionButtonClasses} text-sombre/40 hover:bg-erreur/10 hover:text-erreur`}
      >
        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
      </button>
    </div>
  )
}
