import { useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import FormInput from '../components/trial/FormInput'
import useAuth from '../hooks/useAuth'
import { api, getToken, setSession } from '../utils/api'
import { fadeUp } from '../hooks/useScrollAnimation'
import UsersManager from '../components/admin/users/UsersManager'

/* ============================================================
   AdminSettings — Paramètres du back-office (/admin/settings)
   ------------------------------------------------------------
   1. Profil administrateur (nom, e-mail) → PUT /admin/users/:id
   2. Mot de passe (actuel + nouveau + confirmation)
      → PUT /admin/profile/password
   3. Gestion des utilisateurs (création, reset mot de passe)
   ============================================================ */

/** Classes du message de statut (succès / erreur). */
function statusClass(msg) {
  if (!msg) return ''
  return msg.type === 'succes'
    ? 'border-succes/30 bg-succes/10 text-succes'
    : 'border-erreur/30 bg-erreur/10 text-erreur'
}

export default function AdminSettings() {
  const { user } = useAuth()

  /* --- 1. Profil -------------------------------------------------- */
  const [profile, setProfile] = useState({
    nom: user?.nom ?? '',
    email: user?.email ?? '',
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
    setProfileErrors((prev) => ({ ...prev, [name]: undefined }))
    setProfileMsg(null)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const next = {}
    if (!profile.nom.trim()) next.nom = 'Le nom est requis.'
    if (!/^\S+@\S+\.\S+$/.test(profile.email.trim())) next.email = 'E-mail invalide.'
    if (Object.keys(next).length > 0) { setProfileErrors(next); return }

    setSavingProfile(true)
    setProfileMsg(null)
    try {
      const data = await api(`/admin/users/${user.id}`, {
        method: 'PUT',
        auth: true,
        body: { nom: profile.nom.trim(), email: profile.email.trim() },
      })
      setSession({ token: getToken(), user: { ...user, ...data.data } })
      setProfileMsg({ type: 'succes', text: 'Profil mis à jour.' })
    } catch (err) {
      setProfileMsg({ type: 'erreur', text: err?.message || 'Impossible de mettre à jour le profil.' })
    } finally {
      setSavingProfile(false)
    }
  }

  /* --- 2. Mot de passe -------------------------------------------- */
  const [pwd, setPwd] = useState({ motDePasseActuel: '', nouveauMotDePasse: '', confirmation: '' })
  const [pwdErrors, setPwdErrors] = useState({})
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState(null)

  const handlePwdChange = (e) => {
    const { name, value } = e.target
    setPwd((prev) => ({ ...prev, [name]: value }))
    setPwdErrors((prev) => ({ ...prev, [name]: undefined }))
    setPwdMsg(null)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    const next = {}
    if (!pwd.motDePasseActuel) next.motDePasseActuel = 'Le mot de passe actuel est requis.'
    if (pwd.nouveauMotDePasse.length < 6) next.nouveauMotDePasse = 'Au moins 6 caractères.'
    if (pwd.confirmation !== pwd.nouveauMotDePasse) next.confirmation = 'Les mots de passe ne correspondent pas.'
    if (Object.keys(next).length > 0) { setPwdErrors(next); return }

    setSavingPwd(true)
    setPwdMsg(null)
    try {
      const data = await api('/admin/profile/password', {
        method: 'PUT',
        auth: true,
        body: { motDePasseActuel: pwd.motDePasseActuel, nouveauMotDePasse: pwd.nouveauMotDePasse },
      })
      setPwdMsg({ type: 'succes', text: data?.message || 'Mot de passe mis à jour.' })
      setPwd({ motDePasseActuel: '', nouveauMotDePasse: '', confirmation: '' })
    } catch (err) {
      setPwdMsg({ type: 'erreur', text: err?.message || 'Impossible de modifier le mot de passe.' })
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Paramètres"
        subtitle="Profil, mot de passe et gestion des utilisateurs."
      />

      {/* --- 1. Profil ------------------------------------------------- */}
      <Card className="p-5 md:p-6">
        <h2 className="text-lg font-bold text-sombre">Profil administrateur</h2>
        <p className="mt-0.5 text-sm text-sombre/60">
          Nom et e-mail affichés dans le back-office.
        </p>

        {profileMsg && (
          <p className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${statusClass(profileMsg)}`}>
            {profileMsg.text}
          </p>
        )}

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Nom"
              name="nom"
              value={profile.nom}
              onChange={handleProfileChange}
              error={profileErrors.nom}
              placeholder="Ex : Administrateur"
              required
            />
            <FormInput
              label="E-mail"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
              placeholder="admin@bfa-academy.com"
              required
            />
          </div>
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? 'Enregistrement…' : 'Enregistrer le profil'}
          </Button>
        </form>
      </Card>

      {/* --- 2. Mot de passe ------------------------------------------- */}
      <Card className="p-5 md:p-6">
        <h2 className="text-lg font-bold text-sombre">Mot de passe</h2>
        <p className="mt-0.5 text-sm text-sombre/60">
          Modifiez le mot de passe de votre compte.
        </p>

        {pwdMsg && (
          <p className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${statusClass(pwdMsg)}`}>
            {pwdMsg.text}
          </p>
        )}

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput
              label="Mot de passe actuel"
              name="motDePasseActuel"
              type="password"
              value={pwd.motDePasseActuel}
              onChange={handlePwdChange}
              error={pwdErrors.motDePasseActuel}
              placeholder="••••••••"
              required
            />
            <FormInput
              label="Nouveau mot de passe"
              name="nouveauMotDePasse"
              type="password"
              value={pwd.nouveauMotDePasse}
              onChange={handlePwdChange}
              error={pwdErrors.nouveauMotDePasse}
              placeholder="••••••••"
              required
            />
            <FormInput
              label="Confirmation"
              name="confirmation"
              type="password"
              value={pwd.confirmation}
              onChange={handlePwdChange}
              error={pwdErrors.confirmation}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" disabled={savingPwd}>
            {savingPwd ? 'Modification…' : 'Modifier le mot de passe'}
          </Button>
        </form>
      </Card>

      {/* --- 3. Utilisateurs ------------------------------------------- */}
      <UsersManager />
    </motion.div>
  )
}
