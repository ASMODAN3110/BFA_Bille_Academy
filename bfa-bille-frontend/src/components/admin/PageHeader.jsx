/* ============================================================
   PageHeader — En-tête de page admin (titre + sous-titre + action)
   ------------------------------------------------------------
   - Titre en Barlow Condensed (même police que le site public),
     sous-titre gris, action optionnelle à droite (passe sous le
     titre sur mobile)
   ============================================================ */

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <h1 className="font-display text-4xl font-bold leading-none text-[#14231a]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-sombre/75">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
