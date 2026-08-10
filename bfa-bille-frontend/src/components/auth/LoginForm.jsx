import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'
import FormInput from '../trial/FormInput'
import FormStatus from '../trial/FormStatus'
import useAuth from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validators'

/* ============================================================
   LoginForm — Formulaire de connexion au back-office
   ------------------------------------------------------------
   - Champs Email + Mot de passe (@EF46)
   - Validation champ par champ (perte de focus + temps réel si
     erreur déjà affichée) — calquée sur les essais
   - Appel `login()` du contexte (1,5 s simulé) (@EF47)
   - Message d'erreur « Identifiants incorrects » en cas d'échec
   - Redirection vers /admin/dashboard en cas de succès (@EF46)
   ============================================================ */

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [authError, setAuthError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  /* Mise à jour d'un champ + revalidation en temps réel si le
     champ présente déjà une erreur ; efface l'erreur d'auth. */
  const handleChange = (e) => {
    const { name, value } = e.target
    const validator = name === 'email' ? validateEmail : validatePassword

    if (name === 'email') setEmail(value)
    else setPassword(value)

    if (authError) setAuthError(null)
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validator(value) }))
    }
  }

  /* Marque le champ comme « touché » et le valide (à la perte de
     focus ou à la soumission). */
  const handleBlur = (e) => {
    const { name, value } = e.target
    const validator = name === 'email' ? validateEmail : validatePassword
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors((prev) => ({ ...prev, [name]: validator(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError(null)

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setTouched({ email: true, password: true })
    setFieldErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors).find((key) => nextErrors[key])
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid)
      if (el) {
        el.focus()
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/admin/dashboard', { replace: true })
    } catch {
      // Identifiants invalides (@EF47).
      setAuthError(
        'Veuillez vérifier votre adresse email et votre mot de passe, puis réessayer.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="admin@bfa-academy.com"
        error={fieldErrors.email}
        touched={touched.email}
        required
        autoFocus
        autoComplete="email"
      />

      <FormInput
        label="Mot de passe"
        name="password"
        type="password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="••••••••"
        error={fieldErrors.password}
        touched={touched.password}
        required
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faCircleNotch} className="h-4 w-4 animate-spin" />
            Connexion en cours…
          </>
        ) : (
          'Se connecter'
        )}
      </Button>

      {/* Erreur d'authentification (identifiants incorrects) */}
      {authError && (
        <FormStatus
          status="error"
          title="Identifiants incorrects"
          text={authError}
        />
      )}
    </form>
  )
}
