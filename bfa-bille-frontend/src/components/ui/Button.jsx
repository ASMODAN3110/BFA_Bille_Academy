import { Link } from 'react-router-dom'
import './GlareHover.css'

/* ============================================================
   Button — Bouton CTA réutilisable avec variantes
   ------------------------------------------------------------
   - variant : 'primary' (vert), 'secondary' (doré),
               'outline' (contour doré), 'danger', 'filter'
   - glare : ajoute le reflet lumineux au survol (GlareHover).
             Le reflet est porté par le bouton LUI-MÊME (les
             classes .glare-hover glare-hover--btn sont posées
             sur l'élément Link / <a> / <button>) — pas par un
             wrapper derrière lui. Couleurs par variante via
             --gh-bg / --gh-bg-hover.
   - Rendu automatique :
       * <Link>     si une prop `to` (route interne)
       * <a>        si une prop `href` (lien externe / mailto)
       * <button>   sinon
   ============================================================ */

const VARIANT_STYLES = {
  primary: 'bg-vert text-white hover:bg-vert-light shadow-lg shadow-vert/25',
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

/* Variables CSS du reflet pour la variante bouton.
   --gh-bg / --gh-bg-hover suivent la charte (survol = teinte
   claire : vert-light pour le primary, dore-dark pour secondary). */
const GLARE_DEFAULTS = {
  '--gh-br': '9999px', // pill, comme rounded-full
  '--gh-border': 'transparent', // pas de bordure de reflet
  '--gh-angle': '-45deg',
  '--gh-duration': '650ms',
  '--gh-size': '250%',
  '--gh-rgba': 'rgba(255, 255, 255, 0.35)',
  '--gh-width': 'auto',
  '--gh-height': 'auto',
}

const GLARE_VARIANT_VARS = {
  primary: { '--gh-bg': '#006400', '--gh-bg-hover': '#0a7a0a' },
  secondary: { '--gh-bg': '#D4AF37', '--gh-bg-hover': '#b8972f' },
  danger: { '--gh-bg': '#e53935', '--gh-bg-hover': '#c62828' },
  /* outline = « bouton hover doré » : bordure dorée, fond doré au
     survol. Le fond au repos reste transparent, --gh-bg-hover
     porte le doré ; --gh-border conserve la bordure (2px via
     .glare-hover--btn, voir GlareHover.css). */
  outline: {
    '--gh-bg': 'transparent',
    '--gh-bg-hover': '#D4AF37',
    '--gh-border': '#D4AF37',
  },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  glare = false,
  className = '',
  ...props
}) {
  const glareOn = Boolean(glare)
  const glareOptions = typeof glare === 'object' && glare !== null ? glare : {}
  const { style: extraStyle, ...rest } = props

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40',
    'active:scale-95',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    glareOn && GLARE_VARIANT_VARS[variant]
      ? 'glare-hover glare-hover--btn'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const style = glareOn
    ? {
        ...GLARE_DEFAULTS,
        ...(GLARE_VARIANT_VARS[variant] || {}),
        ...glareOptions,
        ...extraStyle,
      }
    : extraStyle

  if (to) {
    return (
      <Link to={to} className={classes} style={style} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} style={style} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} style={style} {...rest}>
      {children}
    </button>
  )
}
