import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faPlus,
  faUserPlus,
  faUserShield,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'
import { api } from '../../../utils/api'
import { normalizeAdmin } from '../../../utils/adminUsersAdapter'
import useAuth from '../../../hooks/useAuth'
import UserFormModal from './UserFormModal'
import ResetPasswordModal from './ResetPasswordModal'

/* ============================================================
   UsersManager — Gestion des utilisateurs (Paramètres)
   ------------------------------------------------------------
   - Liste les administrateurs (GET /admin/users)
   - Création d'un utilisateur (POST /admin/users)
   - Réinitialisation du mot de passe d'un autre admin
     (PUT /admin/users/:id/password) — masquée sur sa propre ligne
   ============================================================ */

export default function UsersManager() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [target, setTarget] = useState(null) // admin dont on réinitialise le mdp

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/admin/users', { auth: true })
      setAdmins((data?.data ?? []).map(normalizeAdmin))
    } catch (err) {
      setError(err?.message || 'Impossible de charger les utilisateurs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = useCallback(async (body) => {
    await api('/admin/users', { method: 'POST', auth: true, body })
    await load()
  }, [load])

  const handleReset = useCallback(async (nouveauMotDePasse) => {
    await api(`/admin/users/${target.id}/password`, {
      method: 'PUT',
      auth: true,
      body: { nouveauMotDePasse },
    })
    await load()
  }, [target, load])

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-sombre">
            <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-vert" />
            Utilisateurs
          </h2>
          <p className="mt-0.5 text-sm text-sombre/60">
            Comptes autorisés à accéder au back-office.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          Nouvel utilisateur
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm text-erreur">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-5 text-center text-sm text-sombre/50">Chargement…</p>
      ) : admins.length === 0 ? (
        <p className="mt-5 py-8 text-center text-sm text-sombre/50">
          <FontAwesomeIcon icon={faUserPlus} className="mx-auto mb-2 block h-8 w-8 text-sombre/20" />
          Aucun utilisateur. Créez le premier compte.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-clair">
          {admins.map((a) => {
            const isSelf = a.id === user?.id
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate font-semibold text-sombre">
                    {a.nom}
                    {isSelf && (
                      <Badge variant="success">Vous</Badge>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-sombre/60">{a.email}</p>
                  <p className="text-xs text-sombre/50">
                    {a.roleLabel} · Créé le {a.dateCreationFr} · Dernière connexion {a.derniereConnexionFr}
                  </p>
                </div>
                {!isSelf && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTarget(a)}
                  >
                    <FontAwesomeIcon icon={faKey} className="h-3.5 w-3.5" />
                    Réinitialiser le mot de passe
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <UserFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
      />
      <ResetPasswordModal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        admin={target}
        onReset={handleReset}
      />
    </Card>
  )
}
