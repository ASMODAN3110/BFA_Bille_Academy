import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import AdminCalendarGrid from '../components/admin/AdminCalendarGrid'
import EventsTable from '../components/admin/EventsTable'
import EventPanel from '../components/admin/EventPanel'
import EventForm from '../components/admin/EventForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'
import { normalizeEvent } from '../utils/eventAdapter'

/* ============================================================
   AdminCalendar — Gestion du calendrier (/admin/calendar)
   ------------------------------------------------------------
   - Données : GET /api/events?limit=100 (liste normalisée).
   - CRUD : POST/PUT/DELETE /admin/events (protégés, auth: true).
   - Vue mensuelle (grille) ou liste (bascule Mois / Liste) + panneau
     d'édition rapide de l'événement sélectionné (maquette Claude Design)
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
  const [view, setView] = useState('mois')
  const [selectedId, setSelectedId] = useState(null)
  const [panelError, setPanelError] = useState(null)
  const [panelSaving, setPanelSaving] = useState(false)
  const panelRef = useRef(null)

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

  /* Sélection : sur téléphone le panneau est sous la grille, on y amène l'écran. */
  const selectEvent = (id) => {
    setSelectedId(id)
    setPanelError(null)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  /* Enregistrement rapide : le backend exige le corps complet → on repart
     de l'événement et on n'écrase que titre / date / heure / lieu. */
  const handleQuickSave = async (event, patch) => {
    setPanelError(null)
    setPanelSaving(true)
    const code = event.type === 'Match' ? 'MATCH' : 'ENTRAINEMENT'
    const body = {
      titre: patch.titre.trim(),
      date: patch.date,
      heure: patch.heure,
      lieu: patch.lieu.trim(),
      type: code,
      categorieId: event.categorieId,
    }
    if (code === 'MATCH') {
      body.equipeA = event.equipeA
      body.equipeB = event.equipeB
      if (event.typeMatch) body.typeMatch = event.typeMatch
    } else {
      if (event.objectif) body.objectif = event.objectif
      if (event.duree != null) body.duree = event.duree
    }
    try {
      const saved = await api(`/admin/events/${event.id}`, {
        method: 'PUT',
        body,
        auth: true,
      })
      const normalized = normalizeEvent(saved?.data)
      setEvents((prev) => prev.map((e) => (e.id === normalized.id ? normalized : e)))
    } catch (err) {
      setPanelError(err?.message || 'Impossible d’enregistrer l’événement.')
    } finally {
      setPanelSaving(false)
    }
  }

  const selectedEvent = events.find((e) => e.id === selectedId) ?? null

  /* Suppression (DELETE) — puis retrait de la liste locale. */
  const handleDelete = () => {
    const id = toDelete?.id
    if (id == null) return
    setToDelete(null)
    api(`/admin/events/${id}`, { method: 'DELETE', auth: true })
      .then(() => {
        setEvents((prev) => prev.filter((e) => e.id !== id))
        setSelectedId((cur) => (cur === id ? null : cur))
      })
      .catch((err) =>
        setError(err?.message || 'Impossible de supprimer l’événement.'),
      )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Calendrier"
        subtitle="Matchs, entraînements et événements de l'académie."
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Nouvel événement
          </button>
        }
      />

      {loading ? (
        <p className="text-center text-sm text-sombre/75">
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
        <div className="flex flex-wrap items-start gap-4">
          <AdminCalendarGrid
            events={events}
            currentMonth={currentMonth}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            view={view}
            onViewChange={setView}
            selectedId={selectedId}
            onSelect={selectEvent}
          >
            <EventsTable
              bare
              events={sortedEvents}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          </AdminCalendarGrid>
          <div ref={panelRef} className="flex min-w-0 flex-1 basis-72 scroll-mt-20">
            <EventPanel
              key={selectedEvent?.id ?? 'none'}
              event={selectedEvent}
              error={panelError}
              saving={panelSaving}
              onSave={handleQuickSave}
              onDelete={setToDelete}
              onFull={openEdit}
            />
          </div>
        </div>
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
