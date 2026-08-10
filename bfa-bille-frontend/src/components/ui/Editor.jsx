import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faHeading,
  faItalic,
  faLink,
  faListUl,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   Editor — Éditeur de contenu simplifié (WYSIWYG léger)
   ------------------------------------------------------------
   - Barre d'outils : Gras, Italique, Titre, Liste, Lien
   - Chaque action enveloppe la sélection courante dans le bon
     balisage HTML (ou insère un texte d'exemple si rien n'est
     sélectionné)
   - Reprend le style des champs de formulaire (focus doré,
     bordure verte / rouge, message d'erreur)
   - Props : label, name, value, onChange, onBlur, rows, error,
     touched, required, placeholder, className
   ============================================================ */

const STATUS_BORDER = {
  error: 'border-erreur focus-within:border-erreur focus-within:ring-erreur/30',
  valid: 'border-succes focus-within:border-succes focus-within:ring-succes/30',
  neutral: 'border-clair focus-within:border-dore focus-within:ring-dore/40',
}

const TOOLBAR = [
  {
    key: 'bold',
    label: 'Gras',
    icon: faBold,
    before: '<strong>',
    after: '</strong>',
    placeholder: 'Texte en gras',
  },
  {
    key: 'italic',
    label: 'Italique',
    icon: faItalic,
    before: '<em>',
    after: '</em>',
    placeholder: 'Texte en italique',
  },
  {
    key: 'heading',
    label: 'Titre',
    icon: faHeading,
    before: '<h3>',
    after: '</h3>',
    placeholder: 'Titre de section',
  },
  {
    key: 'list',
    label: 'Liste',
    icon: faListUl,
    before: '<ul><li>',
    after: '</li></ul>',
    placeholder: 'Élément de liste',
  },
  {
    key: 'link',
    label: 'Lien',
    icon: faLink,
    before: '<a href="https://">',
    after: '</a>',
    placeholder: 'https://…',
  },
]

export default function Editor({
  label,
  name,
  value,
  onChange,
  onBlur,
  rows = 8,
  error,
  touched,
  required = false,
  placeholder = 'Rédigez le contenu de l’article…',
  className = '',
}) {
  const taRef = useRef(null)
  const hasError = Boolean(error)
  const status = hasError ? 'error' : touched ? 'valid' : 'neutral'

  /* Enveloppe la sélection courante dans le balisage HTML choisi. */
  const apply = (item) => {
    const el = taRef.current
    if (!el) return
    const current = String(value ?? '')
    const start = el.selectionStart ?? current.length
    const end = el.selectionEnd ?? current.length
    const selected = current.slice(start, end) || item.placeholder
    const next =
      current.slice(0, start) + item.before + selected + item.after + current.slice(end)

    /* Repasse par onChange pour garder le champ contrôlé. */
    onChange({ target: { name, value: next } })

    /* Réajuste la sélection après le rendu (best-effort). */
    requestAnimationFrame(() => {
      el.focus()
      const s = start + item.before.length
      el.setSelectionRange(s, s + selected.length)
    })
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-vert">
        {label}
        {required && <span className="ml-0.5 text-erreur">*</span>}
      </label>

      <div
        className={`overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 focus-within:ring-2 ${hasError ? 'animate-shake' : ''} ${STATUS_BORDER[status]}`}
      >
        <div
          className="flex flex-wrap items-center gap-1 border-b border-clair bg-clair/40 px-2 py-1.5"
          role="toolbar"
          aria-label="Outils de mise en forme"
        >
          {TOOLBAR.map((item) => (
            <button
              key={item.key}
              type="button"
              title={item.label}
              aria-label={item.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => apply(item)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sombre/60 transition hover:bg-vert/10 hover:text-vert active:scale-90"
            >
              <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <textarea
          id={name}
          name={name}
          ref={taRef}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className="w-full resize-y bg-white px-4 py-3 text-sombre placeholder:text-sombre/40 focus:outline-none"
        />
      </div>

      {hasError && (
        <motion.p
          id={`${name}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-1.5 text-sm font-medium text-erreur"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
