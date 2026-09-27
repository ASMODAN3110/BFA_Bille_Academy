import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { fadeUp } from '../hooks/useScrollAnimation'
import { api } from '../utils/api'

/* ============================================================
   AdminCategories — Gestion des catégories (/admin/categories)
   ------------------------------------------------------------
   - Données : GET /api/categories (public)
   - CRUD : POST/PUT/DELETE /admin/categories (protégés, auth: true)
   - Champs : nom, ageMin (9-17), ageMax (9-17)
   - Validation miroir du backend (nom ≥ 2, ageMin <= ageMax,
     pas de chevauchement de tranches).
   ============================================================ */

const emptyForm = { nom: '', ageMin: '', ageMax: '' }

function validateField(name, value, form) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'ageMin': {
      if (!v) return 'Ce champ est obligatoire.'
      const n = Number(v)
      if (!Number.isInteger(n)) return 'Doit être un entier.'
      if (n < 9 || n > 17) return 'Doit être entre 9 et 17 ans.'
      return ''
    }
    case 'ageMax': {
      if (!v) return 'Ce champ est obligatoire.'
      const n = Number(v)
      if (!Number.isInteger(n)) return 'Doit être un entier.'
      if (n < 9 || n > 17) return 'Doit être entre 9 et 17 ans.'
      if (form.ageMin && Number(form.ageMin) > n) return 'Doit être ≥ âge minimum.'
      return ''
    }
    default:
      return ''
  }
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/api/categories')
      setCategories(data?.data ?? [])
    } catch (err) {
      setError(err?.message || 'Impossible de charger les catégories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setServerError(null)
    setFormOpen(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ nom: cat.nom, ageMin: String(cat.ageMin), ageMax: String(cat.ageMax) })
    setErrors({})
    setServerError(null)
    setFormOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fieldErrors = {}
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key], form)
      if (err) fieldErrors[key] = err
    })
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setSaving(true)
    setServerError(null)
    try {
      const payload = {
        nom: form.nom.trim(),
        ageMin: Number(form.ageMin),
        ageMax: Number(form.ageMax),
      }
      if (editing) {
        await api(`/admin/categories/${editing.id}`, {
          method: 'PUT',
          body: payload,
          auth: true,
        })
      } else {
        await api('/admin/categories', {
          method: 'POST',
          body: payload,
          auth: true,
        })
      }
      setFormOpen(false)
      await loadCategories()
    } catch (err) {
      setServerError(err?.message || 'Erreur lors de l\'enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await api(`/admin/categories/${toDelete.id}`, { method: 'DELETE', auth: true })
      setToDelete(null)
      await loadCategories()
    } catch (err) {
      setError(err?.message || 'Erreur lors de la suppression.')
      setToDelete(null)
    }
  }

  const inputClass = (name) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-vert/30 ${
      errors[name] ? 'border-red-400 bg-red-50' : 'border-clair bg-white'
    }`

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader
        title="Catégories"
        subtitle="Gérez les catégories d'âge de l'académie et leurs règles (tranche d'âge)."
        action={
          <Button onClick={openCreate} size="sm">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Ajouter une catégorie
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-vert/20 border-t-vert" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-clair bg-white px-6 py-12 text-center">
          <FontAwesomeIcon icon={faLayerGroup} className="mx-auto mb-3 h-10 w-10 text-sombre/30" />
          <p className="text-sm font-medium text-sombre/75">
            Aucune catégorie. Cliquez sur « Ajouter une catégorie » pour commencer.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-clair bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-clair bg-clair/50">
              <tr>
                <th className="px-6 py-3 font-semibold text-sombre/75">Nom</th>
                <th className="px-6 py-3 font-semibold text-sombre/75">Âge minimum</th>
                <th className="px-6 py-3 font-semibold text-sombre/75">Âge maximum</th>
                <th className="px-6 py-3 text-right font-semibold text-sombre/75">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clair">
              {categories.map((cat) => (
                <tr key={cat.id} className="transition hover:bg-clair/30">
                  <td className="px-6 py-4 font-semibold text-vert">{cat.nom}</td>
                  <td className="px-6 py-4 text-sombre/75">{cat.ageMin} ans</td>
                  <td className="px-6 py-4 text-sombre/75">{cat.ageMax} ans</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-vert transition hover:bg-vert/10"
                        aria-label="Modifier"
                      >
                        <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(cat)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                        aria-label="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale formulaire */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        subtitle="Définissez le nom et la tranche d'âge (9 à 17 ans)."
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-sombre/75">
              Nom de la catégorie
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="ex : U13"
              className={inputClass('nom')}
            />
            {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-sombre/75">
                Âge minimum
              </label>
              <input
                type="number"
                name="ageMin"
                value={form.ageMin}
                onChange={handleChange}
                min="9"
                max="17"
                placeholder="ex : 13"
                className={inputClass('ageMin')}
              />
              {errors.ageMin && <p className="mt-1 text-xs text-red-500">{errors.ageMin}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sombre/75">
                Âge maximum
              </label>
              <input
                type="number"
                name="ageMax"
                value={form.ageMax}
                onChange={handleChange}
                min="9"
                max="17"
                placeholder="ex : 14"
                className={inputClass('ageMax')}
              />
              {errors.ageMax && <p className="mt-1 text-xs text-red-500">{errors.ageMax}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation suppression */}
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer la catégorie"
        message={
          toDelete
            ? `Voulez-vous vraiment supprimer la catégorie « ${toDelete.nom} » (${toDelete.ageMin}-${toDelete.ageMax} ans) ?`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </motion.div>
  )
}
