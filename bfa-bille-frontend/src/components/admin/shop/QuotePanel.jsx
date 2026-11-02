import { QuotePill } from './QuoteRequests'

/* ============================================================
   QuotePanel — Détail du devis sélectionné (colonne de droite)
   ------------------------------------------------------------
   - « Devis #12 » + pastille, « Reçu il y a 20 min · Marie T. · tél. »
   - Articles : « Maillot domicile BFA · M × 2 »
   - « Marquer traité » (PUT /admin/quotes/:id/treat) + « Répondre »
     (mailto:) ; message du client s'il y en a un
   ============================================================ */

/** « il y a 20 min », « il y a 3 h », « hier », « il y a 4 j », sinon la date. */
function ago(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const min = Math.max(0, Math.round((Date.now() - d.getTime()) / 60000))
  if (min < 1) return "à l'instant"
  if (min < 60) return `il y a ${min} min`
  if (min < 1440) return `il y a ${Math.round(min / 60)} h`
  const days = Math.round(min / 1440)
  if (days === 1) return 'hier'
  if (days < 7) return `il y a ${days} j`
  return `le ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export default function QuotePanel({ quote, onTreat }) {
  if (!quote) {
    return (
      <aside className="min-w-0 flex-1 basis-72 rounded-2xl border border-[#e3ede6] bg-white p-5 text-sm text-sombre/75">
        Aucune demande de devis à afficher.
      </aside>
    )
  }

  const subject = encodeURIComponent(`Demande de devis — ${quote.produit}`)

  return (
    <aside
      aria-label={`Détail du devis ${quote.id}`}
      className="flex min-w-0 flex-1 basis-72 flex-col gap-3 rounded-2xl border border-[#e3ede6] bg-white p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <b className="text-base">Devis #{quote.id}</b>
        <QuotePill traite={quote.estTraite} />
      </div>

      <p className="text-[13px] text-sombre/75">
        Reçu {ago(quote.dateDemande)} · {quote.nomComplet}
        {quote.telephone && ` · ${quote.telephone}`}
        <br />
        <a href={`mailto:${quote.email}`} className="break-all hover:underline">
          {quote.email}
        </a>
      </p>

      <ul className="m-0 list-none rounded-xl border border-[#eef3ef] p-0 text-sm">
        {quote.lignes.map((l, i) => (
          <li
            key={l.id}
            className={`flex justify-between gap-3 px-3 py-2.5 ${i > 0 ? 'border-t border-[#eef3ef]' : ''}`}
          >
            <span className="min-w-0">
              {l.produit}
              {l.taille && ` · ${l.taille}`}
            </span>
            <b className="shrink-0">× {l.quantite}</b>
          </li>
        ))}
      </ul>

      {quote.message && (
        <blockquote className="m-0 rounded-[10px] bg-[#f4f7f5] p-3 text-[13px] text-[#3b4d42]">
          « {quote.message} »
        </blockquote>
      )}

      <div className="flex flex-wrap gap-2.5">
        {!quote.estTraite && (
          <button
            type="button"
            onClick={() => onTreat(quote)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] bg-vert px-4 text-[13px] font-semibold text-white transition hover:bg-vert-dark"
          >
            Marquer traité
          </button>
        )}
        <a
          href={`mailto:${quote.email}?subject=${subject}`}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-[#cfe0d4] bg-white px-4 text-[13px] font-semibold text-vert-dark transition hover:bg-[#f4f9f6]"
        >
          Répondre
        </a>
      </div>
    </aside>
  )
}
