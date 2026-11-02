import { Link } from 'react-router-dom'

/* ============================================================
   PageHero — Bandeau de titre des pages publiques (maquette Claude Design)
   ------------------------------------------------------------
   Fond dégradé menthe → blanc → crème doré, fil d'ariane discret,
   grand titre en police display et phrase d'introduction.
   - `crumbs` : [{ label, to? }] — ex. [{ label: 'Accueil', to: '/' }, { label: 'Joueurs' }]
   - `title`  : titre de la page (balise h1)
   - `lead`   : phrase d'introduction (facultative)
   - `children` : contenu additionnel sous l'introduction (facultatif)
   ============================================================ */

export default function PageHero({ crumbs = [], title, lead, children }) {
  return (
    <section className="bg-gradient-to-br from-menthe via-[#f6fbf7] to-[#fff8e1] py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {crumbs.length > 0 && (
          <nav
            aria-label="Fil d'ariane"
            className="mb-3.5 flex flex-wrap items-center gap-x-2 text-[13px] text-sombre/70"
          >
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-vert">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-[#14231a] md:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sombre/80">{lead}</p>
        )}
        {children}
      </div>
    </section>
  )
}
