/* ============================================================
   validators — Validation des champs du formulaire de connexion
   ------------------------------------------------------------
   - validateEmail : obligatoire + format email valide
   - validatePassword : obligatoire + au moins 6 caractères (mock)
   Retourne un message d'erreur en français, ou '' si le champ
   est valide.
   ============================================================ */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value) {
  const v = String(value ?? '').trim()
  if (!v) return 'Ce champ est obligatoire.'
  if (!EMAIL_RE.test(v))
    return 'Adresse email invalide (ex : admin@bfa-academy.com).'
  return ''
}

export function validatePassword(value) {
  const v = String(value ?? '')
  if (!v) return 'Ce champ est obligatoire.'
  if (v.length < 6)
    return 'Le mot de passe doit contenir au moins 6 caractères.'
  return ''
}
