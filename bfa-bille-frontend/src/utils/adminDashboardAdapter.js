/* ============================================================
   adminDashboardAdapter — Normalisation des données du tableau
   de bord (Module 9)
   ------------------------------------------------------------
   Le dashboard backend renvoie déjà la forme groupée attendue
   par StatsGrid (players/articles/trials/events/products).
   Ce fichier fournit les libellés français (statuts, timeline)
   et le formatage des dates pour les sections « récentes ».
   ============================================================ */

/** Libellés des statuts de demande d'essai (enum backend). */
export const STATUT_TRIAL_LABEL = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  REFUSE: 'Refusé',
}

/** Libellés des types d'événement de la timeline d'activité. */
export const ACTIVITY_TYPE_LABEL = {
  joueur: "Joueur ajouté",
  evenement: 'Événement',
  demande_essai: "Demande d'essai",
  article: 'Article',
  album: 'Album',
  resultat: 'Résultat',
  produit: 'Produit',
  devis: 'Demande de devis',
}

/** Formate une date ISO en "8 mars 2026" (fr-FR, robuste). */
export function formatDateFr(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Normalise les items de la timeline : ajoute le libellé du type. */
export function normalizeActivity(items) {
  return (items ?? []).map((a) => ({
    ...a,
    label: ACTIVITY_TYPE_LABEL[a.type] ?? a.type,
  }))
}

/** Normalise les dernières demandes d'essai (statut → libellé). */
export function normalizeRecentTrials(items) {
  return (items ?? []).map((t) => ({
    id: t.id,
    prenom: t.prenomJoueur ?? '',
    nom: t.nomJoueur ?? '',
    age: t.age,
    telephone: t.telephone,
    email: t.email,
    dateSoumission: t.dateSoumission,
    statut: STATUT_TRIAL_LABEL[t.statut] ?? t.statut,
  }))
}
