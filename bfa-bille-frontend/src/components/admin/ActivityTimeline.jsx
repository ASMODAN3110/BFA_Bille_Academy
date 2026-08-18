import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBagShopping,
  faCalendarDays,
  faClockRotateLeft,
  faEnvelopeOpenText,
  faImages,
  faNewspaper,
  faTrophy,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import { api } from '../../utils/api'
import {
  formatDateFr,
  normalizeActivity,
} from '../../utils/adminDashboardAdapter'

/* ============================================================
   ActivityTimeline — Timeline d'activité récente (tous modules)
   ------------------------------------------------------------
   - Appel GET /admin/recent/activity (auth) → items ≤ 10 triés
     par date décroissante : { type, id, titre, date }
   - Icône colorée selon le type + libellé français + date
   ============================================================ */

const TYPE_ICON = {
  joueur: faUserPlus,
  evenement: faCalendarDays,
  demande_essai: faUserCheck,
  article: faNewspaper,
  album: faImages,
  resultat: faTrophy,
  produit: faBagShopping,
  devis: faEnvelopeOpenText,
}

export default function ActivityTimeline() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    api('/admin/recent/activity', { auth: true })
      .then((data) => {
        if (active) setItems(normalizeActivity(data?.data?.items ?? []))
      })
      .catch((err) => {
        if (active) setError(err?.message || "Impossible de charger l'activité.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-sombre">Activité récente</h2>
      <p className="mt-0.5 text-sm text-sombre/60">
        Les derniers changements sur la plateforme.
      </p>

      <div className="mt-4">
        {error ? (
          <p className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm text-erreur">
            {error}
          </p>
        ) : loading ? (
          <p className="py-8 text-center text-sm text-sombre/50">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-sombre/50">
            Aucune activité récente.
          </p>
        ) : (
          <ul className="relative space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-clair">
            {items.map((it) => (
              <li
                key={`${it.type}-${it.id}`}
                className="relative flex items-start gap-3 pl-1"
              >
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vert/10 text-vert">
                  <FontAwesomeIcon
                    icon={TYPE_ICON[it.type] ?? faClockRotateLeft}
                    className="h-3.5 w-3.5"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-sombre">{it.label}</p>
                  <p className="truncate text-sm text-sombre/70">{it.titre}</p>
                  <p className="text-xs text-sombre/50">{formatDateFr(it.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
