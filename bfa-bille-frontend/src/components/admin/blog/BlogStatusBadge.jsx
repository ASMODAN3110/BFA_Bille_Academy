/* ============================================================
   BlogStatusBadge — Pastille de statut d'un article
   ------------------------------------------------------------
   - Publié    : fond vert pâle, texte vert foncé
   - Brouillon : fond gris, texte gris foncé
   - Props : statut ('Publié' | 'Brouillon')
   ============================================================ */

export default function BlogStatusBadge({ statut }) {
  const isPublie = statut === 'Publié'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isPublie ? 'bg-[#dcefe2] text-vert-dark' : 'bg-[#eceff0] text-[#4a5750]'
      }`}
    >
      {isPublie ? 'Publié' : 'Brouillon'}
    </span>
  )
}
