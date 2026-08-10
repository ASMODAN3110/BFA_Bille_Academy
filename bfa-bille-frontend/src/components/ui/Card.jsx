/* ============================================================
   Card — Conteneur de carte réutilisable
   ------------------------------------------------------------
   - `variant` : 'default' (blanc, ombre légère) ou
                 'elevated' (blanc, ombre dorée au survol)
   - Sert de base aux cartes Valeurs, Actualités, Témoignages…
   ============================================================ */

const VARIANT_STYLES = {
  default:
    'bg-white rounded-2xl shadow-md shadow-vert/5 border border-clair',
  elevated:
    'bg-white rounded-2xl shadow-md shadow-vert/5 border border-clair hover:-translate-y-2 hover:shadow-xl hover:shadow-vert/10 transition-all duration-300',
}

export default function Card({ children, variant = 'default', className = '', ...props }) {
  return (
    <div className={`${VARIANT_STYLES[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
