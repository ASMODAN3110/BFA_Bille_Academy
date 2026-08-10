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
      <Button
        type="button"
        variant={quote.estTraite ? 'filter' : 'primary'}
        size="sm"
        onClick={() => onToggleTraite(quote)}
        aria-label={
          quote.estTraite
            ? `Marquer la demande de ${quote.nomComplet} comme non traitée`
            : `Marquer la demande de ${quote.nomComplet} comme traitée`
        }
      >
        <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
        {quote.estTraite ? 'Non traité' : 'Marquer comme traité'}
      </Button>
    </div>
  )
}
