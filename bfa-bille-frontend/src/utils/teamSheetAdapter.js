/* ============================================================
   teamSheetAdapter — Normalisation des fiches techniques
   ------------------------------------------------------------
   L'API renvoie : staff / palmares / objectifs = TEXTES multilignes
   ("\n"), saison "AAAA-AAAA", effectif = [{ nom, prenom, poste }].
   Cette couche convertit vers ce que les composants affichent :
   tableaux de lignes + nom complet "Prenom Nom".
   ============================================================ */

/** Découpe un texte multiligne en lignes non vides (trim). */
export function splitLines(text) {
  return String(text ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Nom complet affiché : "Prenom Nom" (nom = nom de famille). */
export function fullName(joueur) {
  return [joueur.prenom, joueur.nom].filter(Boolean).join(' ')
}

export function normalizeFiche(fiche) {
  if (!fiche) return null
  return {
    ...fiche,
    effectif: (fiche.effectif ?? []).map((j) => ({
      nom: fullName(j),
      poste: j.poste,
    })),
    staff: splitLines(fiche.staff),
    palmares: splitLines(fiche.palmares),
    objectifs: splitLines(fiche.objectifs),
  }
}
