import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   QuoteCartButton — Bouton flottant « Mon devis (n) »
   ------------------------------------------------------------
   Apparaît dès qu'au moins un produit est dans la sélection et ouvre le
   formulaire de devis. `notice` : message bref (« … ajouté à votre devis »)
   annoncé aux lecteurs d'écran et affiché au-dessus du bouton.
   ============================================================ */

export default function QuoteCartButton({ count, onClick, notice }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <div aria-live="polite" role="status" className="flex flex-col items-end">
        <AnimatePresence>
          {notice && (
            <motion.p
              key={notice}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="max-w-[16rem] rounded-xl bg-[#14231a] px-4 py-2 text-sm font-medium text-white shadow-lg"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {count > 0 && (
          <motion.button
            type="button"
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            aria-label={`Ouvrir mon devis, ${count} article${count > 1 ? 's' : ''}`}
            className="pointer-events-auto inline-flex min-h-14 items-center gap-3 rounded-full bg-vert px-6 font-semibold text-white shadow-xl shadow-vert/30 transition-colors hover:bg-vert-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-dore/60"
          >
            <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
            Mon devis
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-dore px-2 text-sm font-bold text-[#14231a]">
              {count}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
