import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import FormInput from '../../trial/FormInput'
import FormSelect from '../../trial/FormSelect'
import FormTextarea from '../../trial/FormTextarea'
import MediaUploadField from '../../ui/MediaUploadField'
import { PRODUCT_CATEGORIES } from './ShopFilters'
import { toProductPayload } from '../../../utils/shopAdapter'

/* ============================================================
   ProductFormModal — Création / modification d'un produit
   ------------------------------------------------------------
   - Champs : nom, catégorie, description, prix, tailles
     (multi-select par pastilles), stock, image (URL)
   - Validation (@EF44) : nom obligatoire (≥ 2), prix > 0,
     stock ≥ 0 (entier), catégorie / description / tailles
     obligatoires
   - Boutons : Annuler / Enregistrer
   - Props : open, onClose, onSave(data), product (null = ajout)
   ============================================================ */

/* Tailles alignées sur l'enum backend (S/M/L/XL/UNIQUE) — le backend
   rejette toute autre valeur (@EF41). « Unique » est le libellé du
   libellé « UNIQUE » ; toProductPayload reconvertit vers l'enum. */
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'Unique']

const emptyForm = {
  nom: '',
  description: '',
  prix: '',
  categorie: '',
  tailles: [],
  image: '',
  stock: '',
  estNouveau: false,
}

function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'nom':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'description':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 10) return 'Doit contenir au moins 10 caractères.'
      return ''
    case 'prix': {
      if (v === '') return 'Ce champ est obligatoire.'
      const prix = Number(v)
      if (Number.isNaN(prix) || prix <= 0) return 'Doit être un prix supérieur à 0.'
      return ''
    }
    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      return ''
    case 'tailles':
      if (!value || value.length === 0) return 'Sélectionnez au moins une taille.'
      return ''
    case 'stock': {
      if (v === '') return 'Ce champ est obligatoire.'
      const stock = Number(v)
      if (!Number.isInteger(stock)) return 'Doit être un nombre entier.'
      if (stock < 0) return 'Doit être positif ou nul.'
      return ''
    }
    default:
      return ''
  }
}

export default function ProductFormModal({
  open,
  onClose,
  onSave,
  product,
  serverError,
}) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  /* Réinitialise le formulaire à chaque ouverture (sentinelle 'new'
     pour rester sûr en mode ajout / objet null). */
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (product ? product.id : 'new')) {
    setOpenedFor(product ? product.id : 'new')
    setForm(
      product
        ? {
            nom: product.nom,
            description: product.description,
            prix: String(product.prix),
            categorie: product.categorie,
            tailles: [...(product.tailles ?? [])],
            image: product.image ?? '',
            stock: String(product.stock ?? 0),
            estNouveau: product.estNouveau ?? false,
          }
        : emptyForm,
    )
    setErrors({})
    setTouched({})
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  // Renseigné par le champ média (upload MinIO → URL publique).
  const setImage = (value) => setForm((prev) => ({ ...prev, image: value }))

  /* Bascule une taille dans la sélection (multi-select). */
  const toggleSize = (size) => {
    setForm((prev) => {
      const has = prev.tailles.includes(size)
      return {
        ...prev,
        tailles: has
          ? prev.tailles.filter((s) => s !== size)
          : [...prev.tailles, size],
      }
    })
    if (errors.tailles) {
      setErrors((prev) => ({ ...prev, tailles: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = Object.keys(emptyForm).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)
    const nextErrors = {}
    for (const key of Object.keys(emptyForm)) {
      if (key === 'image' || key === 'estNouveau') continue
      const error = validateField(key, form[key])
      if (error) nextErrors[key] = error
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // toProductPayload mappe « Unique » → « UNIQUE », trime les chaînes,
    // convertit les nombres et met image à null si vide.
    onSave(toProductPayload(form))
  }

  const hasTailleError = Boolean(touched.tailles && errors.tailles)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? 'Modifier le produit' : 'Ajouter un produit'}
      subtitle={
        product
          ? 'Mettez à jour les informations et le stock du produit.'
          : 'Renseignez les informations du nouveau produit.'
      }
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="product-form" variant="primary" size="sm">
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : T-Shirt Héritage"
            required
            error={touched.nom ? errors.nom : undefined}
            touched={touched.nom}
          />
          <FormSelect
            label="Catégorie"
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            onBlur={handleBlur}
            options={PRODUCT_CATEGORIES}
            placeholder="Sélectionnez…"
            required
            error={touched.categorie ? errors.categorie : undefined}
            touched={touched.categorie}
          />
          <FormTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Description du produit…"
            rows={3}
            required
            error={touched.description ? errors.description : undefined}
            touched={touched.description}
            className="sm:col-span-2"
          />
          <FormInput
            label="Prix (€)"
            name="prix"
            type="number"
            min="0"
            step="0.5"
            value={form.prix}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : 35"
            required
            error={touched.prix ? errors.prix : undefined}
            touched={touched.prix}
          />
          <FormInput
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : 10"
            required
            error={touched.stock ? errors.stock : undefined}
            touched={touched.stock}
          />

          {/* Tailles — multi-select par pastilles à bascule */}
          <div className="sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-vert">
              Tailles
              <span className="ml-0.5 text-erreur">*</span>
            </span>
            <div
              className={`flex flex-wrap gap-2 rounded-xl border-2 p-3 transition-all duration-200 ${
                hasTailleError ? 'border-erreur bg-erreur/5' : 'border-clair'
              }`}
            >
              {SIZE_OPTIONS.map((size) => {
                const selected = form.tailles.includes(size)
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={selected}
                    aria-label={`Taille ${size}`}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                      selected
                        ? 'bg-vert text-white shadow-lg shadow-vert/25'
                        : 'border border-clair bg-white text-sombre hover:border-dore hover:text-vert'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {hasTailleError && (
              <motion.p
                id="tailles-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm font-medium text-erreur"
              >
                {errors.tailles}
              </motion.p>
            )}
          </div>

          <MediaUploadField
            label="Image"
            name="image"
            value={form.image}
            onChange={setImage}
            onBlur={handleBlur}
            dossier="boutique"
            error={touched.image ? errors.image : undefined}
            touched={touched.image}
            className="sm:col-span-2"
          />
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-clair bg-clair/30 px-4 py-3">
          <input
            type="checkbox"
            name="estNouveau"
            checked={form.estNouveau}
            onChange={handleChange}
            className="h-5 w-5 accent-vert"
          />
          <span className="text-sm font-semibold text-sombre">
            Marquer comme « Nouveau » (badge doré sur le site)
          </span>
        </label>

        {serverError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-2.5 text-sm font-medium text-erreur"
          >
            {serverError}
          </p>
        )}
      </form>
    </Modal>
  )
}
