/* ============================================================
   categories — Catégories d'âge de l'académie (U9 / U15 / U17)
   ------------------------------------------------------------
   - Constante de référence partagée (formulaires publics + admin,
     filtres, statistiques), pas des données de démonstration.
   - Correspond à la table `Categorie` du backend ; sera remplacée
     par GET /admin/categories quand le backend CRUD existera.
   ============================================================ */

export const categories = ['U9', 'U15', 'U17']
