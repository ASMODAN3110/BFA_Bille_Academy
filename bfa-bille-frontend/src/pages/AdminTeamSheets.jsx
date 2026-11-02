import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { api } from '../utils/api'
import { useCategories } from '../hooks/useCategories'
import { fullName } from '../utils/teamSheetAdapter'
import { relativeDate } from '../utils/dateUtils'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminTeamSheets — Fiches techniques (/admin/team-sheets)
   ------------------------------------------------------------
   Module 5 — CRUD back-office des fiches par catégorie :
   - Pastilles de catégories via useCategories() (ids réels).
   - GET /admin/team-sheets/categorie/:id (Bearer) → fiche ; un 404
     « …non disponible… » = aucune fiche → formulaire vierge.
   - Mise en page de la maquette : carte principale (saison,
     effectif, staff) + colonne latérale (objectifs, palmarès).
   - staff / palmares / objectifs = TEXTES multilignes (textarea) ;
     saison au format AAAA-AAAA (validation locale miroir).
   - effectif = lecture seule (gestion des joueurs = Module 1).
   - Enregistrement : POST (création) ou PUT (mise à jour) ; DELETE.
   - Erreurs backend (400 / 404 / 409) affichées au-dessus de la fiche.
   ============================================================ */

const SAISON_RE = /^\d{4}-\d{4}$/
const SAISON_ERROR = 'La saison doit être au format AAAA-AAAA (ex : 2025-2026).'

const EMPTY_FORM = { saison: '', staff: '', palmares: '', objectifs: '' }

const EFFECTIF_PREVIEW = 3

const fieldClasses =
  'w-full rounded-[10px] border bg-white px-3 text-sm text-sombre placeholder:text-sombre/50 transition focus:outline-none focus:ring-2 focus:ring-vert/25'

/* Champ libellé + saisie (input ou textarea) au style de la maquette. */
function Field({ label, name, value, onChange, rows, error, hint, placeholder, className = '' }) {
  const border = error ? 'border-erreur' : 'border-[#cfe0d4] focus:border-vert'
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </label>
      {rows ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`${fieldClasses} ${border} resize-y py-2.5`}
        />
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${fieldClasses} ${border} h-11`}
        />
      )}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-erreur">
          {error}
        </p>
      )}
      {hint && !error && <p className="mt-1.5 text-xs text-sombre/70">{hint}</p>}
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
  const [showAll, setShowAll] = useState(false)

  const activeName = useMemo(
    () => categories.find((c) => c.id === activeId)?.nom ?? '',
    [categories, activeId],
  )

  /* Onglet par défaut : première catégorie. */
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
    setShowAll(false)
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

  const effectif = (fiche?.effectif ?? []).map((j) => ({
    nom: fullName(j),
    poste: j.poste,
  }))
  const effectifShown = showAll ? effectif : effectif.slice(0, EFFECTIF_PREVIEW)
  const saisonLabel = (fiche?.saison ?? form.saison).replace('-', '/')

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Fiches techniques"
        subtitle="Une fiche par catégorie : effectif, staff, objectifs, palmarès."
        action={
          <span className="inline-flex flex-wrap gap-2.5">
            {activeName && (
              <Link
                to={`/equipes/technique/${encodeURIComponent(activeName)}`}
                target="_blank"
                className="inline-flex h-11 items-center rounded-xl border border-[#cfe0d4] bg-white px-4 text-sm font-semibold text-vert-dark transition hover:bg-[#f4f9f6]"
              >
                Aperçu public
              </Link>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loadingFiche || Boolean(fetchError)}
              className="inline-flex h-11 items-center rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : fiche ? 'Enregistrer' : 'Créer la fiche'}
            </button>
          </span>
        }
      />

      {/* Erreur d'enregistrement / suppression — bandeau au-dessus de la fiche. */}
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
        <p className="py-10 text-center text-sm text-sombre/75">
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
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choisir une catégorie">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === activeId}
                onClick={() => setActiveId(c.id)}
                className={`inline-flex h-10 items-center rounded-[10px] border px-3.5 text-[13px] transition ${
                  c.id === activeId
                    ? 'border-vert bg-menthe font-semibold text-vert-dark'
                    : 'border-[#e3ede6] bg-white font-medium text-[#3b4d42] hover:border-vert/50'
                }`}
              >
                {c.nom}
              </button>
            ))}
          </div>

          {loadingFiche ? (
            <p className="py-10 text-center text-sm text-sombre/75">
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
            <div className="flex flex-wrap items-start gap-4">
              <section className="min-w-0 flex-[999_1_35rem] overflow-hidden rounded-2xl border border-[#e3ede6] bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-[18px]">
                  <div>
                    <h2 className="text-lg font-bold">
                      {activeName}
                      {saisonLabel && ` — Saison ${saisonLabel}`}
                    </h2>
                    {(fiche?.updatedAt || !fiche) && (
                      <span className="text-[13px] text-sombre/75">
                        {fiche
                          ? `Dernière modification : ${relativeDate(fiche.updatedAt).toLowerCase()}`
                          : "Cette catégorie n'a pas encore de fiche."}
                      </span>
                    )}
                  </div>
                  {fiche && (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex min-h-9 items-center gap-2 text-xs font-medium text-erreur hover:underline"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="h-3 w-3" />
                      Supprimer la fiche
                    </button>
                  )}
                </div>

                <div className="border-t border-[#eef3ef] px-5 py-[18px]">
                  <Field
                    label="Saison"
                    name="saison"
                    value={form.saison}
                    onChange={updateField('saison')}
                    placeholder="2026-2027"
                    error={formErrors.saison}
                    className="max-w-xs"
                  />
                </div>

                <div className="border-t border-[#eef3ef] px-5 py-[18px]">
                  <h3 className="mb-2.5 text-sm font-bold">Effectif ({effectif.length})</h3>
                  {effectif.length > 0 ? (
                    <>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase text-sombre/70">
                            <th scope="col" className="py-2 pr-3 font-semibold">Joueur</th>
                            <th scope="col" className="py-2 font-semibold">Poste</th>
                          </tr>
                        </thead>
                        <tbody>
                          {effectifShown.map((j, i) => (
                            <tr key={`${j.nom}-${i}`} className="border-t border-[#f1f5f2]">
                              <td className="py-2 pr-3">{j.nom}</td>
                              <td className="py-2">{j.poste}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {effectif.length > EFFECTIF_PREVIEW && (
                        <button
                          type="button"
                          onClick={() => setShowAll((v) => !v)}
                          className="mt-2 min-h-9 text-[13px] font-semibold text-vert-dark hover:underline"
                        >
                          {showAll ? 'Réduire la liste' : `Voir les ${effectif.length} joueurs →`}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="rounded-xl border border-dashed border-[#e3ede6] px-4 py-5 text-center text-sm text-sombre/75">
                      Aucun joueur dans cette catégorie. L'effectif est géré depuis la page Joueurs.
                    </p>
                  )}
                </div>

                <div className="border-t border-[#eef3ef] px-5 py-[18px]">
                  <Field
                    label="Staff technique"
                    name="staff"
                    value={form.staff}
                    onChange={updateField('staff')}
                    rows={4}
                    placeholder={'M. Essomba — Entraîneur principal\nMme Ngo — Préparatrice physique'}
                    hint="Une personne par ligne."
                  />
                </div>
              </section>

              <aside className="flex min-w-0 flex-1 basis-72 flex-col gap-4">
                <section className="rounded-2xl border border-[#e3ede6] bg-white p-5">
                  <Field
                    label="Objectifs de la saison"
                    name="objectifs"
                    value={form.objectifs}
                    onChange={updateField('objectifs')}
                    rows={5}
                    placeholder={'Finir dans le top 2\nIntégrer 3 joueurs en U17'}
                    hint="Une ligne par objectif."
                  />
                </section>
                <section className="rounded-2xl border border-[#e3ede6] bg-white p-5">
                  <Field
                    label="Palmarès"
                    name="palmares"
                    value={form.palmares}
                    onChange={updateField('palmares')}
                    rows={5}
                    placeholder={'2025 — Vainqueur coupe régionale\n2024 — Finaliste championnat'}
                    hint="Une ligne par titre."
                  />
                </section>
              </aside>
            </div>
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
