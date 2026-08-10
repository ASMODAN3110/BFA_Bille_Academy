import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   FormTextarea — Zone de texte réutilisable
   ------------------------------------------------------------
   Même logique visuelle que FormInput (focus doré, vert/rouge,
   message d'erreur), avec une icône de statut en haut à droite.
   ============================================================ */

const STATUS_BORDER = {
  error: 'border-erreur focus:border-erreur focus:ring-erreur/30',
  valid: 'border-succes focus:border-succes focus:ring-succes/30',
  neutral: 'border-clair focus:border-dore focus:ring-dore/40',
}

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  error,
  touched,
  required = false,
  className = '',
  ...props
}) {
  const hasError = Boolean(error)
  const showValid = touched && !hasError
  const status = hasError ? 'error' : showValid ? 'valid' : 'neutral'

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-vert">
        {label}
        {required && <span className="ml-0.5 text-erreur">*</span>}
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full resize-y rounded-xl border-2 bg-white px-4 py-3 text-sombre placeholder:text-sombre/40 transition-all duration-200 focus:outline-none focus:ring-2 ${hasError ? 'animate-shake' : ''} ${STATUS_BORDER[status]}`}
          {...props}
        />

        {hasError ? (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="pointer-events-none absolute right-4 top-4 text-erreur"
          />
        ) : showValid ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="pointer-events-none absolute right-4 top-4 text-succes"
          />
        ) : null}
      </div>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  )
}
