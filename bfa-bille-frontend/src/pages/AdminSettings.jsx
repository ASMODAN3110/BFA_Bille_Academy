import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/admin/PageHeader'
import useAuth from '../hooks/useAuth'
import { api, getToken, setSession } from '../utils/api'
import { fadeUp } from '../hooks/useScrollAnimation'
import UsersManager from '../components/admin/users/UsersManager'

/* ============================================================
   AdminSettings — Paramètres du back-office (/admin/settings)
   ------------------------------------------------------------
   Maquette Claude Design : deux cartes côte à côte.
   1. « Mon compte » : nom, e-mail, mot de passe actuel + nouveau
      - profil     → PUT /admin/users/:id (si nom / e-mail modifiés)
      - mot de passe → PUT /admin/profile/password (si renseigné)
   2. « Utilisateurs du back-office » (création, reset mot de passe)
   ============================================================ */

const input =
  'h-11 w-full rounded-[10px] border bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-vert/20'

function Field({ label, name, error, hint, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        className={`${input} ${error ? 'border-erreur' : 'border-[#cfe0d4] focus:border-vert'}`}
        {...props}
      />
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-erreur">
          {error}
        </p>
      )}
      {hint && !error && <p className="mt-1.5 text-xs text-sombre/75">{hint}</p>}
    </div>
  )
}

export default function AdminSettings() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    nom: user?.nom ?? '',
    email: user?.email ?? '',
    motDePasseActuel: '',
    nouveauMotDePasse: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [messages, setMessages] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setMessages([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nom = form.nom.trim()
    const email = form.email.trim()
    // Seul « nouveau mot de passe » déclenche un changement : un champ actuel
    // pré-rempli par le navigateur ne doit rien provoquer.
    const wantsPassword = Boolean(form.nouveauMotDePasse)

    const next = {}
    if (!nom) next.nom = 'Le nom est requis.'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'E-mail invalide.'
    if (wantsPassword) {
      if (!form.motDePasseActuel) next.motDePasseActuel = 'Le mot de passe actuel est requis.'
      if (form.nouveauMotDePasse.length < 6) next.nouveauMotDePasse = 'Au moins 6 caractères.'
    }
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setSaving(true)
    setMessages([])
    const done = []
    try {
      if (nom !== (user?.nom ?? '') || email !== (user?.email ?? '')) {
        const data = await api(`/admin/users/${user.id}`, {
          method: 'PUT',
          auth: true,
          body: { nom, email },
        })
        setSession({ token: getToken(), user: { ...user, ...data.data } })
        done.push({ type: 'succes', text: 'Profil mis à jour.' })
      }
      if (wantsPassword) {
        const data = await api('/admin/profile/password', {
          method: 'PUT',
          auth: true,
          body: {
            motDePasseActuel: form.motDePasseActuel,
            nouveauMotDePasse: form.nouveauMotDePasse,
          },
        })
        done.push({ type: 'succes', text: data?.message || 'Mot de passe mis à jour.' })
        setForm((prev) => ({ ...prev, motDePasseActuel: '', nouveauMotDePasse: '' }))
      }
      if (done.length === 0) done.push({ type: 'succes', text: 'Aucune modification à enregistrer.' })
      setMessages(done)
    } catch (err) {
      setMessages([
        ...done,
        { type: 'erreur', text: err?.message || 'Impossible de mettre à jour le compte.' },
      ])
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <PageHeader
        title="Paramètres"
        subtitle="Votre compte et les accès au back-office."
      />

      <div className="flex flex-wrap items-start gap-4">
        <section className="min-w-0 flex-[1_1_22rem] rounded-2xl border border-[#e3ede6] bg-white p-5 sm:p-6">
          <h2 className="mb-3.5 text-base font-bold">Mon compte</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
            {messages.map((m) => (
              <p
                key={m.text}
                role={m.type === 'erreur' ? 'alert' : 'status'}
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  m.type === 'succes'
                    ? 'border-succes/30 bg-succes/10 text-succes'
                    : 'border-erreur/30 bg-erreur/10 text-erreur'
                }`}
              >
                {m.text}
              </p>
            ))}
            <Field
              label="Nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              error={errors.nom}
              autoComplete="name"
            />
            <Field
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <Field
              label="Mot de passe actuel"
              name="motDePasseActuel"
              type="password"
              value={form.motDePasseActuel}
              onChange={handleChange}
              error={errors.motDePasseActuel}
              placeholder="••••••••"
              autoComplete="off"
            />
            <Field
              label="Nouveau mot de passe"
              name="nouveauMotDePasse"
              type="password"
              value={form.nouveauMotDePasse}
              onChange={handleChange}
              error={errors.nouveauMotDePasse}
              hint="6 caractères minimum. Laissez vide pour le conserver."
              autoComplete="new-password"
            />
            <div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Mettre à jour'}
              </button>
            </div>
          </form>
        </section>

        <UsersManager />
      </div>
    </motion.div>
  )
}
