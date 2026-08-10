import { useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import Editor from '../../ui/Editor'
import FormInput from '../../trial/FormInput'
import FormSelect from '../../trial/FormSelect'

/* ============================================================
   BlogFormModal — Création / modification d'un article
   ------------------------------------------------------------
   - Champs : titre, catégorie, auteur, image (URL), contenu
     (via l'éditeur <Editor />)
   - Validation : titre (≥ 3), catégorie et auteur obligatoires,
     contenu (≥ 20 caractères une fois le HTML retiré)
   - Deux boutons de soumission dans le footer :
       * « Enregistrer »            → statut Publié
       * « Enregistrer comme brouillon » → statut Brouillon
     Le bouton cliqué est détecté via `e.nativeEvent.submitter`
   ============================================================ */

const BLOG_CATEGORIES = ['Matchs', 'Portraits', 'Communiqués', 'Événements']

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop'

const emptyForm = {
  titre: '',
  categorie: '',
  auteur: '',
  image: '',
  contenu: '',
}

/* Retire le balisage HTML pour mesurer / extraire le texte réel. */
const stripHtml = (html) =>
  String(html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function validateField(name, value) {
  const v = String(value ?? '').trim()
  switch (name) {
    case 'titre':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 3) return 'Doit contenir au moins 3 caractères.'
      return ''
    case 'categorie':
      if (!v) return 'Veuillez sélectionner une catégorie.'
      return ''
    case 'auteur':
      if (!v) return 'Ce champ est obligatoire.'
      if (v.length < 2) return 'Doit contenir au moins 2 caractères.'
      return ''
    case 'contenu':
      if (!stripHtml(value)) return 'Ce champ est obligatoire.'
      if (stripHtml(value).length < 20)
        return 'Le contenu doit comporter au moins 20 caractères.'
      return ''
    default:
      return ''
  }
}

export default function BlogFormModal({ open, onClose, onSave, post }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  /* Réinitialise le formulaire à chaque ouverture (sentinelle 'new'
     pour rester sûr en mode ajout / objet null). */
  const [openedFor, setOpenedFor] = useState(null)
  if (open && openedFor !== (post ? post.id : 'new')) {
    setOpenedFor(post ? post.id : 'new')
    setForm(
      post
        ? {
            titre: post.titre,
            categorie: post.categorie,
            auteur: post.auteur,
            image: post.image ?? '',
            contenu: post.contenu ?? '',
          }
        : emptyForm,
    )
    setErrors({})
    setTouched({})
  }
  if (!open && openedFor !== null) setOpenedFor(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const action = e.nativeEvent.submitter?.value ?? 'publish'
    const estPublie = action === 'publish'

    const allTouched = Object.keys(emptyForm).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    )
    setTouched(allTouched)
    const nextErrors = {}
    for (const key of Object.keys(emptyForm)) {
      const error = validateField(key, form[key])
      if (error) nextErrors[key] = error
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const today = new Date().toISOString().slice(0, 10)
    const contenuTexte = stripHtml(form.contenu)

    onSave({
      id: post?.id ?? Date.now(),
      titre: form.titre.trim(),
      categorie: form.categorie,
      auteur: form.auteur.trim(),
      image: form.image.trim() || DEFAULT_IMAGE,
      contenu: form.contenu.trim(),
      extrait: contenuTexte.slice(0, 140),
      datePublication: (post?.datePublication || '').trim() || today,
      dateModification: today,
      statut: estPublie ? 'Publié' : 'Brouillon',
      vues: post?.vues ?? 0,
      commentaires: post?.commentaires ?? 0,
      estPublie,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={post ? "Modifier l'article" : 'Nouvel article'}
      subtitle={
        post
          ? 'Mettez à jour les informations de l’article.'
          : 'Renseignez les informations du nouvel article.'
      }
      size="xl"
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            form="blog-form"
            variant="outline"
            size="sm"
            name="action"
            value="draft"
            aria-label="Enregistrer comme brouillon"
          >
            Enregistrer comme brouillon
          </Button>
          <Button
            type="submit"
            form="blog-form"
            variant="primary"
            size="sm"
            name="action"
            value="publish"
            aria-label="Enregistrer et publier"
          >
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="blog-form" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Titre"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : Victoire de l’U17 en coupe régionale"
            required
            error={touched.titre ? errors.titre : undefined}
            touched={touched.titre}
            className="sm:col-span-2"
          />
          <FormSelect
            label="Catégorie"
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            onBlur={handleBlur}
            options={BLOG_CATEGORIES}
            placeholder="Sélectionnez la catégorie…"
            required
            error={touched.categorie ? errors.categorie : undefined}
            touched={touched.categorie}
          />
          <FormInput
            label="Auteur"
            name="auteur"
            value={form.auteur}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex : J. Dubois"
            required
            error={touched.auteur ? errors.auteur : undefined}
            touched={touched.auteur}
          />
          <FormInput
            label="Image à la une (URL)"
            name="image"
            value={form.image}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://…"
            error={touched.image ? errors.image : undefined}
            touched={touched.image}
            className="sm:col-span-2"
          />
          <Editor
            label="Contenu"
            name="contenu"
            value={form.contenu}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.contenu ? errors.contenu : undefined}
            touched={touched.contenu}
            className="sm:col-span-2"
          />
        </div>
      </form>
    </Modal>
  )
}
