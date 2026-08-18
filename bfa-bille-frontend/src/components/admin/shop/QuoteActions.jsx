import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faReply } from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'

/* ============================================================
   QuoteActions — Actions d'une demande de devis
   ------------------------------------------------------------
   - « Répondre » : ouvre le client mail pré-rempli (mailto:)
   - « Marquer comme traité » / « Non traité » : bascule l'état
   ------------------------------------------------------------
   Props : quote, onToggleTraite
   ============================================================ */

export default function QuoteActions({ quote, onToggleTraite }) {
  const subject = encodeURIComponent(`Demande de devis — ${quote.produit}`)
  const mailto = `mailto:${quote.email}?subject=${subject}`

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Button
        href={mailto}
        variant="outline"
        size="sm"
        aria-label={`Répondre à ${quote.nomComplet}`}
      >
        <FontAwesomeIcon icon={faReply} className="h-3.5 w-3.5" />
        Répondre
      </Button>
      {quote.estTraite ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-succes/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-succes">
          <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
          Traité
        </span>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onToggleTraite(quote)}
          aria-label={`Marquer la demande de ${quote.nomComplet} comme traitée`}
        >
          <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
          Marquer comme traité
        </Button>
      )}
    </div>
  )
}
