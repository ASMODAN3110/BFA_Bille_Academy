/* ============================================================
   SectionTitle — Titre de section avec décor doré
   ------------------------------------------------------------
   - `title`   : texte principal du titre
   - `subtitle`: sous-titre optionnel
   - `align`   : 'center' (défaut) ou 'left'
   - `light`   : true lorsque la section a un fond sombre
                 (titre blanc, soulignement doré)
   ============================================================ */

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) {
  const isCenter = align === 'center'

  return (
    <div
      className={`mb-10 md:mb-14 ${
        isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'
      } ${className}`}
    >
      {/* Décor doré */}
      <div
        className={`flex items-center gap-2 mb-4 ${
          isCenter ? 'justify-center' : ''
        }`}
      >
        <span className="h-1 w-10 rounded-full bg-dore" />
        <span className="h-1 w-3 rounded-full bg-dore/60" />
        <span className="h-1 w-1.5 rounded-full bg-dore/40" />
      </div>

      <h2
        className={`font-extrabold text-3xl md:text-4xl lg:text-[2.6rem] leading-tight tracking-tight ${
          light ? 'text-white' : 'text-sombre'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg ${
            light ? 'text-white/80' : 'text-sombre/70'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
