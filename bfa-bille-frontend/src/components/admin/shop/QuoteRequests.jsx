import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   QuoteRequests — Liste des demandes de devis (onglet « Devis »)
   ------------------------------------------------------------
   - Une ligne par devis : avatar (initiales), nom, « N articles ·
     date », pastille À traiter / Traité ; clic = détail à droite
   ============================================================ */

export const initials = (nomComplet) =>
  String(nomComplet ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

const formatDate = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function QuotePill({ traite }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        traite ? 'bg-[#dcefe2] text-vert-dark' : 'bg-[#fff3c9] text-dore-dark'
      }`}
    >
      {traite ? 'Traité' : 'À traiter'}
    </span>
  )
}

export default function QuoteRequests({ quotes, activeId, onSelect }) {
  if (quotes.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <FontAwesomeIcon icon={faEnvelopeOpenText} className="mx-auto h-10 w-10 text-sombre/20" />
        <p className="mt-3 text-sm font-bold text-sombre/75">Aucune demande de devis.</p>
      </div>
    )
  }

  return (
    <ul>
      {quotes.map((q) => {
        const n = q.lignes.length
        return (
          <li key={q.id} className="border-t border-[#eef3ef]">
            <button
              type="button"
              onClick={() => onSelect(q.id)}
              aria-current={q.id === activeId}
              className={`flex min-h-[68px] w-full flex-wrap items-center gap-x-3.5 gap-y-2 px-3 py-3 text-left text-sm transition hover:bg-[#f4f9f6] sm:px-[18px] ${
                q.id === activeId ? 'bg-[#f1f8f3]' : ''
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                  q.estTraite ? 'bg-[#dcefe2] text-vert-dark' : 'bg-[#fff3c9] text-dore-dark'
                }`}
              >
                {initials(q.nomComplet)}
              </span>
              <span className="min-w-0 flex-1 basis-40">
                <b className="block truncate font-semibold">{q.nomComplet}</b>
                <span className="block truncate text-xs text-sombre/75">
                  {n} article{n > 1 ? 's' : ''} · {formatDate(q.dateDemande)}
                </span>
              </span>
              <QuotePill traite={q.estTraite} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
