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

/** Normalise une demande de devis pour l'administration. */
export function normalizeQuote(q) {
  return {
    id: q.id,
    nomComplet: q.nomComplet,
    email: q.email,
    telephone: q.telephone,
    quantite: q.quantite,
    taille: q.taille ? toTailleLabel(q.taille) : null,
    message: q.message ?? '',
    dateDemande: q.dateDemande,
    estTraite: q.estTraite,
    produit: q.produit?.nom ?? '—',
    produitId: q.produitId,
  }
}

/** Payload envoyé au backend (POST /api/quotes) depuis le formulaire. */
export function toQuotePayload(form, produitId) {
  return {
    nomComplet: String(form.nom ?? '').trim(),
    email: String(form.email ?? '').trim(),
    telephone: String(form.telephone ?? '').trim(),
    produitId,
    quantite: Number(form.quantite),
    taille: form.taille ? toTailleEnum(form.taille) : null,
    message: String(form.message ?? '').trim() || undefined,
  }
}
