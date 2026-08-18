import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import TeamSelector from '../components/team/TeamSelector'
import FormInput from '../components/trial/FormInput'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { api } from '../utils/api'
import { useCategories } from '../hooks/useCategories'
import { fullName } from '../utils/teamSheetAdapter'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminTeamSheets — Fiches techniques (/admin/team-sheets)
   ------------------------------------------------------------
   Module 5 — CRUD back-office des fiches par catégorie :
   - Onglets de catégories via useCategories() (ids réels : 13/14/15).
   - GET /admin/team-sheets/categorie/:id (Bearer) → fiche ; un 404
     « …non disponible… » = aucune fiche → formulaire vierge.
   - staff / palmares / objectifs = TEXTES multilignes (textarea) ;
     saison au format AAAA-AAAA (validation locale miroir).
   - effectif = lecture seule (gestion des joueurs = Module 1).
   - Enregistrement : POST (création) ou PUT (mise à jour) ; DELETE.
   - Erreurs backend (400 / 404 / 409) affichées dans le formulaire.
   ============================================================ */

const SAISON_RE = /^\d{4}-\d{4}$/
const SAISON_ERROR = 'La saison doit être au format AAAA-AAAA (ex : 2025-2026).'

const EMPTY_FORM = { saison: '', staff: '', palmares: '', objectifs: '' }

const EFFECTIF_COLUMNS = [
  { key: 'nom', label: 'Joueur' },
  { key: 'poste', label: 'Poste' },
]

/* Textarea réutilisable (même style que FormInput). */
function FormTextarea({ label, name, value, onChange, rows = 4, error, hint, placeholder, className = '' }) {
  const hasError = Boolean(error)
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-vert">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`w-full resize-y rounded-xl border-2 bg-white px-4 py-3 text-sombre placeholder:text-sombre/40 transition-all duration-200 focus:outline-none focus:ring-2 ${
          hasError
            ? 'border-erreur focus:border-erreur focus:ring-erreur/30'
            : 'border-clair focus:border-dore focus:ring-dore/40'
        }`}
      />
      {hasError && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-erreur">
          {error}
        </p>
      )}
      {hint && !hasError && (
        <p className="mt-1.5 text-xs text-sombre/50">{hint}</p>
      )}
    </div>
  )
}

export default function AdminTeamSheets() {
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useCategories()
  const [activeId, setActiveId] = useState(null)
  const [fiche, setFiche] = useState(null)
  const [loadingFiche, setLoadingFiche] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const activeName = useMemo(
    () => categories.find((c) => c.id === activeId)?.nom ?? '',
    [categories, activeId],
  )

  /* Onglet par défaut : première catégorie (U9). */
  useEffect(() => {
    if (categories.length > 0 && activeId == null) {
      setActiveId(categories[0].id)
    }
  }, [categories, activeId])

  /* Chargement de la fiche de la catégorie active. */
  useEffect(() => {
    if (activeId == null) return
    let cancelled = false
    setLoadingFiche(true)
    setFetchError(null)
    setSaveError(null)
    setSaveSuccess(false)
    api(`/admin/team-sheets/categorie/${activeId}`, { auth: true })
      .then((res) => {
        if (cancelled) return
        const d = res?.data
        setFiche(d ?? null)
        setForm({
          saison: d?.saison ?? '',
          staff: d?.staff ?? '',
          palmares: d?.palmares ?? '',
          objectifs: d?.objectifs ?? '',
        })
        setLoadingFiche(false)
      })
      .catch((err) => {
        if (cancelled) return
        if (err?.status === 404) {
          // Aucune fiche pour cette catégorie → formulaire vierge.
          setFiche(null)
          setForm(EMPTY_FORM)
        } else {
          setFetchError(err?.message || 'Impossible de charger la fiche.')
        }
        setLoadingFiche(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeId])

  const updateField = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    setSaveSuccess(false)
  }

  const validate = () => {
    const errors = {}
    if (!SAISON_RE.test(form.saison.trim())) errors.saison = SAISON_ERROR
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /* ⚠️ React Compiler : ids lus au 1er niveau du handler (garde null). */
  const handleSave = async () => {
    const existingId = fiche?.id
    setSaveError(null)
    setSaveSuccess(false)
    if (!validate()) return
    setSaving(true)
    const body = {
      saison: form.saison.trim(),
      staff: form.staff.trim(),
      palmares: form.palmares.trim(),
      objectifs: form.objectifs.trim(),
    }
    try {
      const res = existingId != null
        ? await api(`/admin/team-sheets/${existingId}`, { method: 'PUT', body, auth: true })
        : await api('/admin/team-sheets', {
            method: 'POST',
            body: { categorieId: activeId, ...body },
            auth: true,
          })
      const d = res?.data
      setFiche(d ?? null)
      setForm({
        saison: d?.saison ?? body.saison,
        staff: d?.staff ?? body.staff,
        palmares: d?.palmares ?? body.palmares,
        objectifs: d?.objectifs ?? body.objectifs,
      })
      setSaveSuccess(true)
    } catch (err) {
      // 409 « …existe déjà… » / 400 validation / 404 → message backend.
      setSaveError(err?.message || "Impossible d'enregistrer la fiche.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    const id = fiche?.id
    if (id == null) return
    setConfirmDelete(false)
    api(`/admin/team-sheets/${id}`, { method: 'DELETE', auth: true })
      .then(() => {
        setFiche(null)
        setForm(EMPTY_FORM)
        setSaveSuccess(false)
      })
      .catch((err) =>
        setSaveError(err?.message || 'Impossible de supprimer la fiche.'),
      )
  }

  const effectifRows = (fiche?.effectif ?? []).map((j) => ({
    nom: fullName(j),
    poste: j.poste,
  }))

  const categoryNames = categories.map((c) => c.nom)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Fiches techniques"
        subtitle="Profils techniques par catégorie : effectif, staff, objectifs et palmarès."
      />

      {/* Erreur d'enregistrement / suppression — bandeau au-dessus du formulaire. */}
      {saveError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
        >
          <span>{saveError}</span>
          <button
            type="button"
            onClick={() => setSaveError(null)}
            aria-label="Fermer l'erreur"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-erreur/70 transition hover:bg-erreur/10"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </div>
      )}

      {saveSuccess && (
        <div
          role="status"
          className="rounded-xl border border-succes/30 bg-succes/10 px-4 py-3 text-sm font-medium text-succes"
        >
          Fiche enregistrée avec succès.
        </div>
      )}

      {categoriesLoading ? (
        <p className="py-10 text-center text-sm text-sombre/60">
          Chargement des catégories…
        </p>
      ) : categoriesError ? (
        <div
          role="alert"
          className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
        >
          {categoriesError}
        </div>
      ) : (
        <>
          <TeamSelector
            categories={categoryNames}
            active={activeName}
            onChange={(name) => {
              const next = categories.find((c) => c.nom === name)
              if (next) setActiveId(next.id)
            }}
          />

          {loadingFiche ? (
            <p className="py-10 text-center text-sm text-sombre/60">
              Chargement de la fiche…
            </p>
          ) : fetchError ? (
            <div
              role="alert"
              className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
            >
              {fetchError}
            </div>
          ) : (
            <Card className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-vert">
                  {fiche
                    ? `Fiche ${activeName} — ${fiche.saison}`
                    : `Fiche ${activeName}`}
                </h2>
                {fiche && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
                    Supprimer la fiche
                  </Button>
                )}
              </div>

              <div className="mt-6 grid gap-5">
                <div className="max-w-xs">
                  <FormInput
                    label="Saison"
                    name="saison"
                    value={form.saison}
                    onChange={updateField('saison')}
                    placeholder="2025-2026"
                    error={formErrors.saison}
                    touched={Boolean(formErrors.saison)}
                    required
                  />
                </div>

                <FormTextarea
                  label="Staff technique"
                  name="staff"
                  value={form.staff}
                  onChange={updateField('staff')}
                  rows={4}
                  placeholder="Entraîneur : Nom Prénom&#10;Adjoint : Nom Prénom"
                  hint="Une personne par ligne (ex : « Entraîneur : Paul Biya »)."
                />

                <FormTextarea
                  label="Objectifs de la saison"
                  name="objectifs"
                  value={form.objectifs}
                  onChange={updateField('objectifs')}
                  rows={4}
                  placeholder="Développement des fondamentaux&#10;Initiation au jeu collectif"
                  hint="Une ligne par objectif."
                />

                <FormTextarea
                  label="Palmarès"
                  name="palmares"
                  value={form.palmares}
                  onChange={updateField('palmares')}
                  rows={4}
                  placeholder="Champion du tournoi jeunes 2025"
                  hint="Une ligne par titre ; sauvegardez pour enregistrer."
                />

                {/* Effectif — lecture seule (gestion des joueurs = Module 1). */}
                <div>
                  <h3 className="mb-2 text-sm font-bold text-vert">Effectif</h3>
                  {effectifRows.length > 0 ? (
                    <Table
                      columns={EFFECTIF_COLUMNS}
                      rows={effectifRows}
                      rowKey="__index__"
                      // 2 colonnes seulement → s'adapte sans scroll ; et dans
                      // la grille du formulaire, min-width:0 empêche le
                      // tableau d'étirer toute la piste sur mobile.
                      minWidth={0}
                    />
                  ) : (
                    <p className="rounded-xl border border-dashed border-clair px-4 py-5 text-center text-sm text-sombre/60">
                      {fiche
                        ? "Aucun joueur dans l'effectif de cette catégorie."
                        : 'L\'effectif est géré depuis la page Équipes (Module 1) — créez la fiche pour la lier à la catégorie.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? 'Enregistrement…'
                    : fiche
                      ? 'Enregistrer la fiche'
                      : 'Créer la fiche'}
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Supprimer la fiche"
        message={`Voulez-vous vraiment supprimer la fiche technique de la catégorie ${activeName} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </motion.div>
  )
}
