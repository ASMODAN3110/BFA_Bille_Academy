/* ============================================================
   resultsAdapter — Normalisation des résultats (Module 7)
   ------------------------------------------------------------
   Contrat backend :
   - Resultat = { id, equipeA, equipeB, scoreA, scoreB, date
     (ISO), type (AMICAL|CHAMPIONNAT), categorieId,
     categorie: { id, nom } | null }
   Le front consomme `type` en libellé (« Championnat »/« Amical »),
   `date` en "YYYY-MM-DD" et `categorie` en nom. À l'envoi
   (POST/PUT) on reconvertit le libellé en enum et le nom en
   categorieId (le formulaire garde l'id).
   ============================================================ */

const ENUM_TO_LABEL = { CHAMPIONNAT: 'Championnat', AMICAL: 'Amical' }
const LABEL_TO_ENUM = { Championnat: 'CHAMPIONNAT', Amical: 'AMICAL' }

export const toTypeLabel = (value) => ENUM_TO_LABEL[value] ?? value
export const toTypeEnum = (label) => LABEL_TO_ENUM[label] ?? label

/** Normalise un résultat du backend pour l'affichage (public + admin). */
export function normalizeResult(r) {
  return {
    id: r.id,
    date: String(r.date ?? '').slice(0, 10), // "YYYY-MM-DD" → parseLocalDate/formatDateCard OK
    equipeA: r.equipeA,
    equipeB: r.equipeB,
    scoreA: r.scoreA,
    scoreB: r.scoreB,
    type: toTypeLabel(r.type),
    categorie: r.categorie?.nom ?? '—',
    categorieId: r.categorieId, // conservé pour le filtre/liens
  }
}

/** Payload envoyé au backend (POST / PUT) depuis les champs du formulaire. */
export function toResultPayload(form) {
  return {
    date: form.date,
    equipeA: form.equipeA.trim(),
    equipeB: form.equipeB.trim(),
    scoreA: Number(form.scoreA),
    scoreB: Number(form.scoreB),
    type: toTypeEnum(form.type),
    categorieId: Number(form.categorie), // le formulaire stocke l'id
  }
}
