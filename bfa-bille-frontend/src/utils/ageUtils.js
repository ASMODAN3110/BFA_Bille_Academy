/* ============================================================
   ageUtils — Calcul de l'âge d'un joueur
   ------------------------------------------------------------
   Âge en années révolues depuis `dateNaissance` (ISO 8601,
   termine par « Z » ou format "YYYY-MM-DD"), sur le modèle du
   helper backend (`src/utils/dateUtils.ts` → calculateAge),
   en cohérence avec le contrat Module 1 (getAge fourni).
   ============================================================ */

export function getAge(dateNaissanceIso) {
  const d = new Date(dateNaissanceIso)
  const now = new Date()
  let age = now.getUTCFullYear() - d.getUTCFullYear()
  const m = now.getUTCMonth() - d.getUTCMonth()
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--
  return age
}
