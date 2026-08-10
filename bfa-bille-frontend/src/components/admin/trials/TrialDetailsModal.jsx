import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'
import { parseLocalDate, formatDateLong } from '../../../utils/dateUtils'

/* ============================================================
   TrialDetailsModal — Détails complets d'une demande d'essai
   ------------------------------------------------------------
   - Toutes les informations : nom, prénom, e-mail, téléphone,
     âge, catégorie, poste, dates, message (@EF15)
   - Statut en badge + motif de refus le cas échéant
   ============================================================ */

const STATUS_VARIANT = {
  'En attente': 'warning',
  Confirmé: 'success',
  Refusé: 'danger',
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-sombre/50">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-sombre">{value || '—'}</p>
    </div>
  )
}

export default function TrialDetailsModal({ open, onClose, trial }) {
  if (!trial) return null

  const fmt = (d) =>
    d ? formatDateLong(parseLocalDate(String(d).slice(0, 10))) : '—'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détails de la candidature"
      subtitle={`${trial.prenom} ${trial.nom}`}
      size="lg"
      footer={
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Fermer
        </Button>
      }
    >
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-clair bg-clair/50 px-4 py-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vert text-base font-extrabold text-white">
          {trial.nom.charAt(0)}
        </span>
        <div>
          <p className="font-bold text-sombre">
            {trial.prenom} {trial.nom}
          </p>
          <div className="mt-0.5">
            <Badge variant={STATUS_VARIANT[trial.statut] ?? 'default'}>
              {trial.statut}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field label="Prénom" value={trial.prenom} />
        <Field label="Nom" value={trial.nom} />
        <Field label="E-mail" value={trial.email} />
        <Field label="Téléphone" value={trial.telephone} />
        <Field label="Âge" value={`${trial.age} ans`} />
        <Field label="Catégorie" value={trial.categorie} />
        <Field label="Poste" value={trial.poste} />
        <Field label="Date d'essai" value={fmt(trial.dateEssai)} />
        <Field label="Date de soumission" value={fmt(trial.dateSoumission)} />
      </div>

      <div className="mt-5 rounded-xl border border-clair bg-clair/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-sombre/50">
          Message du candidat
        </p>
        <p className="mt-1.5 text-sm text-sombre">
          {trial.message || 'Aucun message fourni.'}
        </p>
      </div>

      {trial.motifRefus && (
        <div className="mt-4 rounded-xl border border-erreur/30 bg-erreur/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-erreur">
            Motif du refus
          </p>
          <p className="mt-1.5 text-sm font-medium text-erreur">
            {trial.motifRefus}
          </p>
        </div>
      )}
    </Modal>
  )
}
