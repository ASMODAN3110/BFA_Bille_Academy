import { useState } from 'react'
import { parseLocalDate } from '../../utils/dateUtils'

/* ============================================================
   EventPanel — Panneau d'édition rapide d'un événement
   ------------------------------------------------------------
   - Titre « Match U15 — 7 nov. », champs titre / date / heure /
     lieu, boutons Enregistrer et Supprimer (maquette Claude Design)
   - « Tous les détails… » ouvre le formulaire complet (modale)
   - Remonté avec `key={event.id}` : l'état local repart de
     l'événement sélectionné
   ============================================================ */

const input =
  'h-[42px] w-full min-w-0 rounded-[10px] border border-[#cfe0d4] bg-white px-2.5 text-sm outline-none transition focus:border-vert focus:ring-2 focus:ring-vert/20'

function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </label>
      <input id={id} className={input} {...props} />
    </div>
  )
}

export default function EventPanel({ event, error, saving, onSave, onDelete, onFull }) {
  const [form, setForm] = useState(() => ({
    titre: event?.titre ?? '',
    date: event?.date ?? '',
    heure: event?.heure ?? '',
    lieu: event?.lieu ?? '',
  }))

  if (!event) {
    return (
      <aside className="min-w-0 flex-1 basis-72 rounded-2xl border border-[#e3ede6] bg-white p-5 text-sm text-sombre/75">
        Sélectionnez un événement dans le calendrier pour le modifier, ou créez-en un nouveau.
      </aside>
    )
  }

  const set = (name) => (e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))
  const shortDate = parseLocalDate(event.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <aside className="min-w-0 flex-1 basis-72 rounded-2xl border border-[#e3ede6] bg-white p-5">
      <h2 className="mb-3.5 text-base font-bold">
        {event.type} {event.categorie} — {shortDate}
      </h2>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSave(event, form)
        }}
      >
        {error && (
          <p role="alert" className="rounded-lg border border-erreur/30 bg-erreur/10 px-3 py-2 text-sm text-erreur">
            {error}
          </p>
        )}
        <Field label="Titre" id="ev-titre" value={form.titre} onChange={set('titre')} required />
        <div className="grid grid-cols-[3fr_2fr] gap-3">
          <Field label="Date" id="ev-date" type="date" value={form.date} onChange={set('date')} required />
          <Field label="Heure" id="ev-heure" type="time" value={form.heure} onChange={set('heure')} required />
        </div>
        <Field label="Lieu" id="ev-lieu" value={form.lieu} onChange={set('lieu')} required />
        <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(event)}
            className="inline-flex h-11 items-center rounded-xl px-3.5 text-sm font-semibold text-[#b3261e] transition hover:bg-erreur/10"
          >
            Supprimer
          </button>
          <button
            type="button"
            onClick={() => onFull(event)}
            className="ml-auto min-h-9 text-[13px] font-semibold text-vert-dark hover:underline"
          >
            Tous les détails…
          </button>
        </div>
      </form>
    </aside>
  )
}
