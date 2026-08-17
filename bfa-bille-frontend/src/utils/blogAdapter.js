/* ============================================================
   blogAdapter — Normalisation des articles du blog (Module 6)
   ------------------------------------------------------------
   Contrat backend :
   - Article = { id, titre, contenu (HTML), image|null, categorie
     (enum MATCHS|EVENEMENTS|PORTRAITS|COMMUNIQUES), datePublication
     (ISO UTC), auteur, estPublie, extrait|null, administrateurId }
   Le front consomme un libellé de catégorie et `post.date` en
   "YYYY-MM-DD" ; `statut`, `vues`, `commentaires`,
   `dateModification` n'existent pas en base : ils sont dérivés
   pour ne casser aucun composant.
   À l'envoi (POST/PUT) on reconvertit le libellé en enum.
   ============================================================ */

/** Image de couverture par défaut quand `image` est null (seed). */
export const DEFAULT_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop'

const ENUM_TO_LABEL = {
  MATCHS: 'Matchs',
  EVENEMENTS: 'Événements',
  PORTRAITS: 'Portraits',
  COMMUNIQUES: 'Communiqués',
}

const LABEL_TO_ENUM = {
  Matchs: 'MATCHS',
  Événements: 'EVENEMENTS',
  Portraits: 'PORTRAITS',
  Communiqués: 'COMMUNIQUES',
}

export const toCategoryLabel = (value) => ENUM_TO_LABEL[value] ?? value
export const toCategoryEnum = (label) => LABEL_TO_ENUM[label] ?? label

/** Normalise un article du backend pour l'affichage (public + admin). */
export function normalizeArticle(a) {
  const datePublication = String(a.datePublication ?? '').slice(0, 10)
  return {
    id: a.id,
    titre: a.titre,
    contenu: a.contenu,
    image: a.image || DEFAULT_BLOG_IMAGE,
    categorie: toCategoryLabel(a.categorie),
    date: datePublication, // clé attendue par BlogCard / BlogDetails / Blog
    datePublication, // clé attendue par AdminBlog / BlogTable
    dateModification: null, // pas de colonne en base → pas de « Modifié »
    auteur: a.auteur,
    estPublie: a.estPublie,
    statut: a.estPublie ? 'Publié' : 'Brouillon',
    extrait: a.extrait ?? '',
    vues: 0, // pas de colonne en base
    commentaires: 0, // pas de colonne en base
  }
}

/** Payload envoyé au backend (POST / PUT) depuis les champs du formulaire. */
export function toArticlePayload(form) {
  return {
    titre: form.titre,
    contenu: form.contenu,
    categorie: toCategoryEnum(form.categorie),
    auteur: form.auteur,
    image: form.image,
    estPublie: form.estPublie,
    datePublication: form.datePublication,
  }
}
