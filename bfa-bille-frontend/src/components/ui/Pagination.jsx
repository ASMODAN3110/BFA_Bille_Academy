import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   Pagination — Navigation par pages réutilisable
   ------------------------------------------------------------
   Props :
     - `currentPage`   : page active (1-indexée)
     - `totalPages`    : nombre total de pages
     - `onPageChange`  : callback(page)
     - `className`     : classes ajoutées au conteneur
     - `variant`       : 'default' (boutons ronds + Précédent / Suivant)
                         ou 'square' (maquette Claude Design : carrés
                         arrondis, flèches ← →)
   Rendu : boutons « Précédent » / « Suivant » + numéros de page.
   Masquée si une seule page.
   ============================================================ */

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  variant = 'default',
}) {
  if (totalPages <= 1) return null

  if (variant === 'square') {
    const squareClasses = (active, disabled) =>
      [
        'inline-flex h-11 min-w-11 items-center justify-center rounded-xl border px-2 font-semibold',
        'transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40',
        active
          ? 'border-vert bg-vert text-white'
          : disabled
            ? 'cursor-not-allowed border-[#e3ede6] bg-white text-sombre/40'
            : 'border-[#cfe6d6] bg-white hover:border-vert hover:text-vert',
      ].join(' ')

    return (
      <nav
        aria-label="Pagination"
        className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Page précédente"
          className={squareClasses(false, currentPage === 1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Aller à la page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={squareClasses(page === currentPage, false)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
          className={squareClasses(false, currentPage === totalPages)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    )
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const navButtonClasses = (disabled) =>
    [
      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
      'transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 active:scale-95',
      disabled
        ? 'cursor-not-allowed bg-white text-sombre/75 border border-clair'
        : 'border-2 border-dore text-dore-dark hover:bg-dore hover:text-vert-dark',
    ].join(' ')

  const pageButtonClasses = (active) =>
    [
      'inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold',
      'transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/40 active:scale-95',
      active
        ? 'bg-vert text-white shadow-lg shadow-vert/25'
        : 'bg-white text-sombre border border-clair hover:border-dore hover:text-vert',
    ].join(' ')

  return (
    <nav
      aria-label="Pagination des articles"
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className={navButtonClasses(currentPage === 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
        <span>Précédent</span>
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Aller à la page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            className={pageButtonClasses(isActive)}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className={navButtonClasses(currentPage === totalPages)}
      >
        <span>Suivant</span>
        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
      </button>
    </nav>
  )
}
