/* ============================================================
   adminUsersAdapter — Normalisation des administrateurs
   ------------------------------------------------------------
   - Libellés des rôles (ADMIN / SUPER_ADMIN)
   - Formatage des dates de création / dernière connexion
   ============================================================ */

/** Libellés d'affichage des rôles d'administrateur. */
export const ROLE_LABEL = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super admin',
}

/** Libellé d'un rôle (repli sur la valeur brute si inconnu). */
export function roleLabel(role) {
  return ROLE_LABEL[role] ?? role
}

/** Formate une date ISO en "12 mars 2026" (fr-FR, robuste). */
export function formatDateFr(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** "12 mars 2026 à 14:05" pour la dernière connexion (null → "—"). */
export function formatConnexion(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

/** Normalise un admin venant de l'API. */
export function normalizeAdmin(a) {
  return {
    ...a,
    roleLabel: roleLabel(a.role),
    dateCreationFr: formatDateFr(a.dateCreation),
    derniereConnexionFr: formatConnexion(a.derniereConnexion),
  }
}
