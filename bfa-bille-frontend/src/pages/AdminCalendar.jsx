import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import AdminCalendarGrid from '../components/admin/AdminCalendarGrid'
import EventsTable from '../components/admin/EventsTable'
import EventForm from '../components/admin/EventForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Button from '../components/ui/Button'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { normalizeEvent } from '../utils/eventAdapter'

/* ============================================================
   AdminCalendar — Gestion du calendrier (/admin/calendar)
   ------------------------------------------------------------
   - Données : GET /api/events?limit=100 (liste normalisée).
   - CRUD : POST/PUT/DELETE /admin/events (protégés, auth: true).
   - Vue mensuelle (grille) + liste détaillée (tableau)
   - `autoAdd` : ouvre le formulaire d'ajout au chargement
     (route /admin/events/add depuis les actions rapides)
   ============================================================ */

export default function AdminCalendar({ autoAdd = false }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [serverError, setServerError] = useState(null)

  /* Recharge les événements depuis le backend (tri date puis heure serveur). */
  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/api/events?limit=100', { auth: true })
      setEvents((data?.data?.items ?? []).map(normalizeEvent))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les événements.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  /* Route /admin/events/add → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setEditing(null)
      setServerError(null)
      setFormOpen(true)
    }
  }, [autoAdd])

  const goPrevMonth = () =>
    setCurrentMonth(
      (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1),
    )
  const goNextMonth = () =>
    setCurrentMonth(
      (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1),
    )

  /* Événements triés du plus ancien au plus récent. */
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  )

  const openAdd = () => {
    setEditing(null)
    setServerError(null)
    setFormOpen(true)
  }

  const openEdit = (event) => {
    setEditing(event)
    setServerError(null)
    setFormOpen(true)
  }

  /* Ajout (POST) / modification (PUT) — l'événement renvoyé par le
     backend est normalisé puis inséré dans la liste locale. */
  const handleSave = async (data) => {
    setServerError(null)
    try {
      const saved = editing
        ? await api(`/admin/events/${editing?.id}`, {
            method: 'PUT',
            body: data,
            auth: true,
          })
        : await api('/admin/events', { method: 'POST', body: data, auth: true })
      const normalized = normalizeEvent(saved?.data)
      setEvents((prev) =>
        editing
          ? prev.map((e) => (e.id === normalized.id ? normalized : e))
          : [...prev, normalized],
      )
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      setServerError(err?.message || 'Une erreur est survenue.')
    }
  }

  /* Suppression (DELETE) — puis retrait de la liste locale. */
  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    api(`/admin/events/${id}`, { method: 'DELETE', auth: true })
      .then(() => setEvents((prev) => prev.filter((e) => e.id !== id)))
      .catch((err) =>
        setError(err?.message || 'Impossible de supprimer l’événement.'),
      )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Calendrier"
        subtitle="Planification des matches et entraînements de l'académie."
        action={
          <Button type="button" onClick={openAdd} className="shrink-0">
            <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4" />
            Créer un événement
          </Button>
        }
      />

      {loading ? (
        <p className="text-center text-sm text-sombre/60">
          Chargement des événements…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-center text-sm font-medium text-erreur"
        >
          {error}
        </div>
      ) : (
        <>
          <AdminCalendarGrid
            events={events}
            currentMonth={currentMonth}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
          />

          <EventsTable
            events={sortedEvents}
            onEdit={openEdit}
            onDelete={setToDelete}
          />
        </>
      )}

      <EventForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
          setServerError(null)
        }}
        onSave={handleSave}
        event={editing}
        serverError={serverError}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'événement"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.titre ?? ''} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
