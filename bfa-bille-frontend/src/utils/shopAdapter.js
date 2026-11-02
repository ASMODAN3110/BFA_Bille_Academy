/* ============================================================
   shopAdapter — Normalisation boutique (Module 8)
   ------------------------------------------------------------
   Contrat backend :
   - Produit = { id, nom, description, prix (Float), image|null,
     tailles (enum[] : S/M/L/XL/UNIQUE), categorie
     (Vêtements|Équipement|Accessoires), estNouveau, stock, … }
   - Devis = { id, nomComplet, email, telephone, quantite,
     taille (enum|null), message|null, dateDemande (ISO),
     estTraite, produit: { id, nom } | null }
   Le front consomme `tailles` en libellés (« Unique » plutôt que
   « UNIQUE ») ; à l'envoi on reconvertit vers l'enum.
   ============================================================ */

/** Image de repli quand `image` est null, vide ou un chemin de
    démo `/images/produits/*.jpg` (visuels du seed absents du
    frontend → toutes les images du seed basculent sur le repli). */
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop'

const TAILLE_LABELS = { S: 'S', M: 'M', L: 'L', XL: 'XL', UNIQUE: 'Unique' }

export const toTailleLabel = (value) => TAILLE_LABELS[value] ?? value
export const toTailleEnum = (label) =>
  Object.keys(TAILLE_LABELS).find((key) => TAILLE_LABELS[key] === label) ?? label

/** Normalise un produit du backend pour l'affichage (public + admin). */
export function normalizeProduct(p) {
  return {
    id: p.id,
    nom: p.nom,
    description: p.description,
    prix: p.prix,
    image:
      !p.image || String(p.image).startsWith('/images/')
        ? DEFAULT_PRODUCT_IMAGE
        : p.image,
    tailles: (p.tailles ?? []).map(toTailleLabel),
    categorie: p.categorie,
    estNouveau: p.estNouveau,
    stock: p.stock,
  }
}

/** Payload envoyé au backend (POST / PUT produit) depuis le formulaire. */
export function toProductPayload(form) {
  return {
    nom: String(form.nom ?? '').trim(),
    description: String(form.description ?? '').trim(),
    prix: Number(form.prix),
    categorie: form.categorie,
    tailles: (form.tailles ?? []).map(toTailleEnum),
    estNouveau: Boolean(form.estNouveau),
    stock: Number(form.stock),
    image: String(form.image ?? '').trim() || null,
  }
}

/** Normalise une demande de devis (une ou plusieurs lignes) pour l'administration. */
export function normalizeQuote(q) {
  const lignes = (q.lignes ?? []).map((l) => ({
    id: l.id,
    produit: l.produitNom ?? '—',
    quantite: l.quantite,
    taille: l.taille ? toTailleLabel(l.taille) : null,
  }))
  const premiere = lignes[0]
  return {
    id: q.id,
    nomComplet: q.nomComplet,
    email: q.email,
    telephone: q.telephone,
    message: q.message ?? '',
    dateDemande: q.dateDemande,
    estTraite: q.estTraite,
    lignes,
    // Résumé pour les listes et l'objet des e-mails : « Maillot BFA » ou « Maillot BFA (+2 autres articles) »
    produit: !premiere
      ? '—'
      : lignes.length > 1
        ? `${premiere.produit} (+${lignes.length - 1} autre${lignes.length > 2 ? 's' : ''} article${lignes.length > 2 ? 's' : ''})`
        : premiere.produit,
    quantite: lignes.reduce((total, l) => total + (Number(l.quantite) || 0), 0),
  }
}

/** Nombre maximal d'articles (lignes) dans une demande de devis (miroir du backend). */
export const MAX_LIGNES_DEVIS = 20

/**
 * Payload envoyé au backend (POST /api/quotes) : le client et la liste des articles
 * du devis (`items` : { productId, quantite, taille }).
 */
export function toQuotePayload(form, items) {
  return {
    nomComplet: String(form.nom ?? '').trim(),
    email: String(form.email ?? '').trim(),
    telephone: String(form.telephone ?? '').trim(),
    message: String(form.message ?? '').trim() || undefined,
    lignes: items.map((item) => ({
      produitId: item.productId,
      quantite: Number(item.quantite),
      taille: item.taille ? toTailleEnum(item.taille) : null,
    })),
  }
}
