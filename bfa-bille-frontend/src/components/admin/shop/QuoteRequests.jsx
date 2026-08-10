import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import Card from '../../ui/Card'
import QuoteActions from './QuoteActions'
import { staggerItem } from '../../../hooks/useScrollAnimation'

/* ============================================================
   QuoteRequests — Demandes de devis de la boutique
   ------------------------------------------------------------
   - Liste : demandeur (avatar initiales), e-mail, date, produit,
     quantité / taille, message (extrait)
   - Badge « Nouveau » sur les demandes non traitées
   - Actions : Répondre (mailto) / Marquer comme traité
   - Desktop : lignes en colonne · Mobile : cartes empilées
   ============================================================ */

const initials = (nomComplet) =>
  String(nomComplet ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

const formatQuoteDate = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const date = d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const heure = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${date} · ${heure}`
}

export default function QuoteRequests({ quotes, onToggleTraite }) {
  const pending = quotes.filter((q) => !q.estTraite).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-vert">
            Demandes de devis
          </h2>
          <p className="text-sm text-sombre/60">
            {quotes.length} demande(s) —{' '}
            <span className="font-semibold text-dore">{pending}</span> en attente
          </p>
        </div>
      </div>

      <Card className="divide-y divide-clair overflow-hidden">
        {quotes.length === 0 ? (
          <div className="p-10 text-center">
            <FontAwesomeIcon
              icon={faEnvelopeOpenText}
              className="mx-auto h-10 w-10 text-sombre/20"
            />
            <p className="mt-3 font-bold text-sombre/70">
              Aucune demande de devis.
            </p>
          </div>
        ) : (
          quotes.map((quote) => (
            <motion.div
              key={quote.id}
              variants={staggerItem}
              className={`flex flex-col gap-3 p-4 transition-colors hover:bg-clair/60 md:flex-row md:items-center md:justify-between ${
                quote.estTraite ? 'opacity-60' : 'bg-vert/[0.02]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vert/10 text-xs font-extrabold text-vert">
                    {initials(quote.nomComplet)}
                  </span>
                  <p className="font-bold text-sombre">{quote.nomComplet}</p>
                  {!quote.estTraite && (
                    <span className="rounded-full bg-dore/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-dore-dark">
                      Nouveau
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-sombre/50">
                  {quote.email} · {formatQuoteDate(quote.dateDemande)}
                </p>

                <p className="mt-2 text-sm">
                  <span className="font-semibold text-vert">{quote.produit}</span>
                  <span className="text-sombre/60"> × {quote.quantite}</span>
                  {quote.taille && (
                    <span className="text-sombre/60"> — {quote.taille}</span>
                  )}
                </p>

                <p className="mt-1 line-clamp-2 text-sm text-sombre/70">
                  {quote.message}
                </p>
              </div>

              <QuoteActions quote={quote} onToggleTraite={onToggleTraite} />
            </motion.div>
          ))
        )}
      </Card>
    </div>
  )
}
