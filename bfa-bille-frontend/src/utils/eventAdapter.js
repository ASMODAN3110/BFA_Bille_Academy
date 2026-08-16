import { toDateKey } from './dateUtils'

/* ============================================================
   eventAdapter — Normalisation des événements backend
   ------------------------------------------------------------
   L'API renvoie des événements avec :
     date        : ISO UTC  "2026-08-19T00:00:00.000Z"
     heure       : unique    "17:00"   (pas de heureDebut/heureFin)
     type        : code      "MATCH" | "ENTRAINEMENT"
     categorie   : objet     { id, nom, ageMin, ageMax }
   Cette couche convertit vers ce que les composants existants
   attendent (dates "YYYY-MM-DD", libellés d'affichage, nom de
   catégorie). Les autres champs (equipeA/B, typeMatch, objectif,
   duree…) passent tels quels via le spread.
   ============================================================ */

const TYPE_LABEL = { MATCH: 'Match', ENTRAINEMENT: 'Entraînement' }

export function normalizeEvent(ev) {
  return {
    ...ev,
    date: toDateKey(new Date(ev.date)), // "YYYY-MM-DD"
    heure: ev.heure, // heure unique (plus de heureDebut/heureFin)
    type: TYPE_LABEL[ev.type] ?? ev.type, // libellé d'affichage
    categorie: ev.categorie?.nom ?? ev.categorie, // nom en lecture
  }
}
