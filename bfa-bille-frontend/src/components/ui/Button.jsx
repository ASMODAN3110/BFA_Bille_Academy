import { Link } from 'react-router-dom'

/* ============================================================
   Button — Bouton CTA réutilisable avec variantes
   ------------------------------------------------------------
   - variant : 'primary' (vert), 'secondary' (doré),
               'outline' (contour doré)
   - Rendu automatique :
       * <Link>     si une prop `to` (route interne)
       * <a>        si une prop `href` (lien externe / mailto)
       * <button>   sinon
   ============================================================ */

const VARIANT_STYLES = {
  primary: 'bg-vert text-white hover:bg-vert-dark shadow-lg shadow-vert/25',
  secondary:
    'bg-dore text-vert-dark hover:bg-dore-dark shadow-lg shadow-dore/30',
  outline:
    'border-2 border-dore text-dore hover:bg-dore hover:text-vert-dark',
  danger: 'bg-erreur text-white hover:opacity-90 shadow-lg shadow-erreur/25',
  filter:
    'bg-white text-sombre border border-clair shadow-sm hover:border-dore hover:text-vert',
  'filter-active':
    'bg-vert text-white border border-vert shadow-lg shadow-vert/25',
}

const SIZE_STYLES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm md:text-base',
  lg: 'px-8 py-4 text-base md:text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40',
    'active:scale-95',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
