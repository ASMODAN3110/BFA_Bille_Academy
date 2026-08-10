/* ============================================================
   PageHeader — En-tête de page admin (titre + sous-titre + action)
   ------------------------------------------------------------
   - Titre vert foncé, sous-titre gris, action optionnelle à droite
   ============================================================ */

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-vert md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-sombre/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
