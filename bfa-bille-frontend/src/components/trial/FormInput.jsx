import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   FormInput — Champ de saisie réutilisable
   ------------------------------------------------------------
   - Label associé au champ (htmlFor / id)
   - Bordure dorée au focus, verte si valide, rouge si erreur
   - Icône de statut (✓ / !) et message d'erreur (aria-live)
   - Secousse (shake) sur le champ invalide
   ============================================================ */

const STATUS_BORDER = {
  error: 'border-erreur focus:border-erreur focus:ring-erreur/30',
  valid: 'border-succes focus:border-succes focus:ring-succes/30',
  neutral: 'border-clair focus:border-dore focus:ring-dore/40',
}

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  autoFocus = false,
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
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sombre placeholder:text-sombre/40 transition-all duration-200 focus:outline-none focus:ring-2 ${hasError ? 'animate-shake' : ''} ${STATUS_BORDER[status]}`}
          {...props}
        />

        {hasError ? (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-erreur"
          />
        ) : showValid ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-succes"
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
