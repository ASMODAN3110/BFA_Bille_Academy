/* ============================================================
   BlogStatusBadge — Pastille de statut d'un article
   ------------------------------------------------------------
   - Publié  : texte + point vert (#4CAF50)
   - Brouillon : texte + point orange (#FF9800)
   - Props : statut ('Publié' | 'Brouillon')
   ============================================================ */

export default function BlogStatusBadge({ statut }) {
  const isPublie = statut === 'Publié'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        isPublie ? 'bg-succes/10 text-succes' : 'bg-orange-500/10 text-orange-500'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${isPublie ? 'bg-succes' : 'bg-orange-500'}`}
        aria-hidden="true"
      />
      {isPublie ? 'Publié' : 'Brouillon'}
    </span>
  )
}
