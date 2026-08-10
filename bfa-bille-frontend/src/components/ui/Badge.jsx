/* ============================================================
   Badge — Étiquette de statut réutilisable
   ------------------------------------------------------------
   - Variantes : 'selected' (vert), 'mvp' (doré), 'default' (neutre)
   - Statuts    : 'success' (vert), 'warning' (orange),
                  'danger' (rouge)
   - Survol : léger zoom (scale 1.05)
   ============================================================ */

const VARIANT_STYLES = {
  selected: 'border-vert/30 bg-vert/10 text-vert',
  mvp: 'border-dore/40 bg-dore/15 text-dore-dark',
  default: 'border-clair bg-clair text-sombre',
  success: 'border-succes/30 bg-succes/10 text-succes',
  warning: 'border-orange-500/30 bg-orange-500/10 text-orange-600',
  danger: 'border-erreur/30 bg-erreur/10 text-erreur',
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide transition-transform duration-200 hover:scale-105 ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
