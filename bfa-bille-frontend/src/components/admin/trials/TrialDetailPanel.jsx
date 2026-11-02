import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { STATUS_STYLE, displayName, initials } from './TrialTable'
import { relativeDate } from '../../../utils/dateUtils'

/* ============================================================
   TrialDetailPanel — Fiche de la demande sélectionnée (admin)
   ------------------------------------------------------------
   - Avatar, nom, « Reçue … · catégorie », détails du candidat
   - Message du parent entre guillemets
   - Accepter / Refuser (demande en attente), sinon le statut et
     le motif de refus ; suppression en lien discret
   ============================================================ */

const formatEssai = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

export default function TrialDetailPanel({ trial, onConfirm, onRefuse, onDelete }) {
  if (!trial) {
    return (
      <aside className="min-w-0 flex-1 basis-72 rounded-2xl border border-[#e3ede6] bg-white p-[22px] text-sm text-sombre/75">
        Sélectionnez une demande pour voir le détail.
      </aside>
    )
  }

  const st = STATUS_STYLE[trial.statut] ?? STATUS_STYLE['En attente']
  const rows = [
    ['Âge', `${trial.age} ans`],
    trial.poste ? ['Poste', trial.poste] : null,
    ['Téléphone', trial.telephone],
    ['Email', trial.email],
    formatEssai(trial.dateEssai) ? ['Essai souhaité', formatEssai(trial.dateEssai)] : null,
  ].filter(Boolean)

  return (
    <aside
      aria-label={`Détail de la demande de ${displayName(trial)}`}
      className="flex min-w-0 flex-1 basis-72 flex-col gap-3.5 rounded-2xl border border-[#e3ede6] bg-white p-[22px]"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-lg font-bold ${st.pill}`}
        >
          {initials(trial)}
        </span>
        <div className="min-w-0">
          <b className="block truncate text-lg">{displayName(trial)}</b>
          <p className="text-[13px] text-sombre/75">
            Reçue {relativeDate(trial.dateSoumission).toLowerCase()}
            {trial.categorie && ` · ${trial.categorie}`}
          </p>
        </div>
      </div>

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sombre/70">{k}</dt>
            <dd className="m-0 min-w-0 break-words">{v}</dd>
          </div>
        ))}
      </dl>

      {trial.message && (
        <blockquote className="m-0 rounded-[10px] bg-[#f4f7f5] p-3 text-[13px] text-[#3b4d42]">
          « {trial.message} »
        </blockquote>
      )}

      {trial.statut === 'En attente' ? (
        <>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => onConfirm(trial)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-vert text-sm font-semibold text-white transition hover:bg-vert-dark"
            >
              Accepter
            </button>
            <button
              type="button"
              onClick={() => onRefuse(trial)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[#cfe0d4] bg-white text-sm font-semibold text-[#14231a] transition hover:bg-[#f4f9f6]"
            >
              Refuser
            </button>
          </div>
          <p className="text-xs text-sombre/75">
            Un email est envoyé automatiquement au candidat.
          </p>
        </>
      ) : (
        <div className="space-y-1.5 text-sm">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.pill}`}>
            {st.label}
          </span>
          {trial.statut === 'Refusé' && trial.motifRefus && (
            <p className="text-[13px] text-sombre/75">Motif : {trial.motifRefus}</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onDelete(trial)}
        className="mt-1 inline-flex min-h-9 items-center gap-2 self-start text-xs font-medium text-erreur hover:underline"
      >
        <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
        Supprimer la demande
      </button>
    </aside>
  )
}
