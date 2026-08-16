import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   FormSelect — Liste déroulante réutilisable
   ------------------------------------------------------------
   Même logique visuelle que FormInput (focus doré, vert/rouge,
   message d'erreur), avec une flèche personnalisée.
   `options` accepte des chaînes (« Gardien ») ou des objets
   { value, label } (catégories : value = id, label = nom).
   ============================================================ */

/* Normalise une option : valeur + libellé affiché. */
const toOption = (opt) =>
  opt && typeof opt === 'object' && !Array.isArray(opt)
    ? { value: opt.value, label: opt.label }
    : { value: opt, label: opt }

const STATUS_BORDER = {
  error: 'border-erreur focus:border-erreur focus:ring-erreur/30',
  valid: 'border-succes focus:border-succes focus:ring-succes/30',
  neutral: 'border-clair focus:border-dore focus:ring-dore/40',
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Sélectionnez...',
  error,
  touched,
  required = false,
  className = '',
  ...props
}) {
  const hasError = Boolean(error)
  const showValid = touched && !hasError
  const status = hasError ? 'error' : showValid ? 'valid' : 'neutral'
  const isEmpty = value === '' || value == null

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-vert">
        {label}
        {required && <span className="ml-0.5 text-erreur">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full cursor-pointer appearance-none rounded-xl border-2 bg-white py-3 pl-4 pr-11 transition-all duration-200 focus:outline-none focus:ring-2 ${isEmpty ? 'text-sombre/40' : 'text-sombre'} ${hasError ? 'animate-shake' : ''} ${STATUS_BORDER[status]}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, i) => {
            const { value: optValue, label: optLabel } = toOption(opt)
            return (
              <option key={optValue ?? i} value={optValue}>
                {optLabel}
              </option>
            )
          })}
        </select>

        <FontAwesomeIcon
          icon={faChevronDown}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sombre/40"
        />

        {hasError ? (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-erreur"
          />
        ) : showValid ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-succes"
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
