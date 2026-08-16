import { useEffect, useMemo, useState } from 'react'
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

/* ============================================================
   AdminCalendar — Gestion du calendrier (/admin/calendar)
   ------------------------------------------------------------
   - CRUD complet des événements : créer, modifier, supprimer
   - Vue mensuelle (grille) + liste détaillée (tableau)
   - `autoAdd` : ouvre le formulaire d'ajout au chargement
     (route /admin/events/add depuis les actions rapides)
   ============================================================ */

export default function AdminCalendar({ autoAdd = false }) {
  /* ⚠️ Plus de données mock : la liste part vide. Les événements
     arriveront du backend (GET /admin/evenements) quand les
     endpoints CRUD existeront. */
  const [events, setEvents] = useState([])
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  /* Route /admin/events/add → ouvre le formulaire d'ajout. */
  useEffect(() => {
    if (autoAdd) {
      setEditing(null)
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
    setFormOpen(true)
  }

  const openEdit = (event) => {
    setEditing(event)
    setFormOpen(true)
  }

  const handleSave = (data) => {
    setEvents((prev) =>
      editing
        ? prev.map((e) => (e.id === editing.id ? data : e))
        : [...prev, data],
    )
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    setEvents((prev) => prev.filter((e) => e.id !== toDelete.id))
    setToDelete(null)
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

      <EventForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        event={editing}
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
