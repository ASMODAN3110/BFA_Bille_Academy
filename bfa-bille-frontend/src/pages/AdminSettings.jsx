import { useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import PageHeader from '../components/admin/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import FormInput from '../components/trial/FormInput'
import useAuth from '../hooks/useAuth'
import { fadeUp } from '../hooks/useScrollAnimation'

/* ============================================================
   AdminSettings — Paramètres du back-office (/admin/settings)
   ------------------------------------------------------------
   - Profil administrateur (nom, e-mail, mot de passe)
   - Sauvegarde simulée avec message de confirmation
   ============================================================ */

export default function AdminSettings() {
  const { user } = useAuth()

  const [profile, setProfile] = useState({
    nom: 'Administrateur',
    email: user?.email ?? 'admin@bfa-academy.com',
    motDePasse: '',
  })
  const [saved, setSaved] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
        subtitle="Profil administrateur du back-office."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-5 md:p-6">
          <h2 className="text-lg font-bold text-sombre">Profil administrateur</h2>
          <p className="mt-0.5 text-sm text-sombre/60">
            Informations affichées dans le back-office.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Nom"
              name="nom"
              value={profile.nom}
              onChange={handleProfileChange}
              placeholder="Ex : Administrateur"
            />
            <FormInput
              label="E-mail"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="admin@bfa-academy.com"
            />
            <FormInput
              label="Nouveau mot de passe"
              name="motDePasse"
              type="password"
              value={profile.motDePasse}
              onChange={handleProfileChange}
              placeholder="••••••••"
              className="sm:col-span-2"
            />
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary">
            Enregistrer les modifications
          </Button>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-semibold text-succes"
              role="status"
            >
              <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
              Modifications enregistrées.
            </motion.p>
          )}
        </div>
      </form>
    </motion.div>
  )
}
