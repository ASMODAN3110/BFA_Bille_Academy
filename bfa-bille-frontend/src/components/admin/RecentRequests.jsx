import { useCallback, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faInbox } from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Table from '../ui/Table'
import Button from '../ui/Button'
import { api } from '../../utils/api'
import { parseLocalDate, formatDateCard } from '../../utils/dateUtils'

/* ============================================================
   RecentRequests — Dernières demandes d'essai (tableau de bord)
   ------------------------------------------------------------
   Module 3 — branché sur le backend :
   - GET /admin/trials?limit=100 (Bearer) → les 5 plus récentes
     (triées par dateSoumission décroissante) affichées dans une
     mini-table avec Badge de statut + lien « Voir tout ».
   - Empty state conservé quand la liste est vide.
   - Les statuts backend (EN_ATTENTE / CONFIRME / REFUSE) sont
     traduits en libellés français comme dans AdminTrials.
   ============================================================ */

const PAGE_LIMIT = 100
const RECENT_COUNT = 5

const STATUT_LABEL = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  REFUSE: 'Refusé',
}

const STATUS_VARIANT = {
  'En attente': 'warning',
  Confirmé: 'success',
  Refusé: 'danger',
}

const displayName = (t) =>
  t.prenom && t.nom && t.nom.includes(t.prenom)
    ? t.nom
    : `${t.prenom} ${t.nom}`.trim()

export default function RecentRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  /* Compteur de requêtes : ignore une réponse périmée (StrictMode
     double-montage, remontage après navigation). */
  const loadSeq = useRef(0)

  const load = useCallback(async () => {
    const requestId = ++loadSeq.current
    setLoading(true)
    setError(null)
    try {
      const res = await api(`/admin/trials?limit=${PAGE_LIMIT}`, { auth: true })
      if (requestId !== loadSeq.current) return // réponse périmée
      const items = res?.data?.items ?? []
      const recent = items
        .map((d) => ({
          id: d.id,
          prenom: d.prenomJoueur ?? '',
          nom: d.nomJoueur ?? '',
          age: d.age,
          telephone: d.telephone,
          email: d.email,
          dateSoumission: d.dateSoumission,
          statut: STATUT_LABEL[d.statut] ?? d.statut,
        }))
        .sort((a, b) => {
          const da = a.dateSoumission ? new Date(a.dateSoumission).getTime() : 0
          const db = b.dateSoumission ? new Date(b.dateSoumission).getTime() : 0
          return db - da
        })
        .slice(0, RECENT_COUNT)
      setRequests(recent)
    } catch (err) {
      if (requestId !== loadSeq.current) return
      setError(err?.message || 'Impossible de charger les demandes.')
    } finally {
      if (requestId === loadSeq.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const columns = [
    {
      key: 'candidat',
      label: 'Candidat',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vert/10 text-sm font-extrabold text-vert">
            {row.nom.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sombre">
              {displayName(row)}
            </p>
            <p className="truncate text-xs text-sombre/60">
              {row.email ?? row.telephone ?? '—'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'age',
      label: 'Âge',
      render: (row) => (
        <span className="font-semibold text-sombre">{row.age} ans</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) =>
        formatDateCard(parseLocalDate(row.dateSoumission?.slice(0, 10) ?? '')),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.statut] ?? 'default'}>
          {row.statut}
        </Badge>
      ),
    },
  ]

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-sombre">
            Demandes d'essai récentes
          </h2>
          <p className="mt-0.5 text-sm text-sombre/60">
            Les dernières candidatures reçues pour les essais.
          </p>
        </div>
        {requests.length > 0 && (
          <Button to="/admin/trials" variant="secondary" size="sm">
            Voir tout
            <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
        >
          Impossible de charger les dernières demandes — {error}
        </div>
      ) : loading ? (
        <p className="py-8 text-center text-sm text-sombre/50">
          Chargement des demandes…
        </p>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <FontAwesomeIcon icon={faInbox} className="h-10 w-10 text-sombre/20" />
          <p className="font-bold text-sombre/70">
            Aucune demande récente pour le moment.
          </p>
          <p className="text-sm text-sombre/50">
            Les candidatures du formulaire public apparaîtront ici.
          </p>
        </div>
      ) : (
        <Table columns={columns} rows={requests} rowKey="id" />
      )}
    </Card>
  )
}
