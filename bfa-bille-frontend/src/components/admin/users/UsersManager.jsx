import { useCallback, useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import { normalizeAdmin } from '../../../utils/adminUsersAdapter'
import useAuth from '../../../hooks/useAuth'
import UserFormModal from './UserFormModal'
import ResetPasswordModal from './ResetPasswordModal'

/* ============================================================
   UsersManager — « Utilisateurs du back-office » (Paramètres)
   ------------------------------------------------------------
   - Liste les administrateurs (GET /admin/users) : avatar,
     nom, e-mail, pastille de rôle
   - « + Inviter » : création d'un utilisateur (POST /admin/users)
   - « Réinitialiser le mot de passe » d'un autre admin
     (PUT /admin/users/:id/password) — absent sur sa propre ligne
   ============================================================ */

const initials = (nom) =>
  String(nom ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?'

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
    <section className="min-w-0 flex-[1_1_27rem] rounded-2xl border border-[#e3ede6] bg-white p-5 sm:p-6">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">Utilisateurs du back-office</h2>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="min-h-9 text-[13px] font-semibold text-vert-dark hover:underline"
        >
          + Inviter
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm text-erreur">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-6 text-center text-sm text-sombre/75">Chargement…</p>
      ) : admins.length === 0 ? (
        <p className="py-6 text-center text-sm text-sombre/75">
          Aucun utilisateur. Invitez le premier compte.
        </p>
      ) : (
        <ul>
          {admins.map((a) => {
            const isSelf = a.id === user?.id
            return (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-3 border-t border-[#eef3ef] py-3 text-sm first:border-t-0"
              >
                <span
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full font-bold ${
                    isSelf ? 'bg-menthe text-vert-dark' : 'bg-[#fff3c9] text-dore-dark'
                  }`}
                >
                  {initials(a.nom)}
                </span>
                <div className="min-w-0 flex-1 basis-44">
                  <b className="block truncate font-semibold">
                    {a.nom}
                    {isSelf && <span className="ml-2 text-xs font-normal text-sombre/70">(vous)</span>}
                  </b>
                  <span className="block truncate text-xs text-sombre/75">{a.email}</span>
                  <span className="block text-xs text-sombre/60">
                    Dernière connexion {a.derniereConnexionFr}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    a.role === 'SUPER_ADMIN' || a.role === 'ADMIN'
                      ? 'bg-[#dcefe2] text-vert-dark'
                      : 'bg-[#eceff0] text-[#4a5750]'
                  }`}
                >
                  {a.roleLabel}
                </span>
                {!isSelf && (
                  <button
                    type="button"
                    onClick={() => setTarget(a)}
                    className="min-h-9 basis-full pl-[50px] text-left text-[13px] font-semibold text-vert-dark hover:underline"
                  >
                    Réinitialiser le mot de passe
                  </button>
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
    </section>
  )
}
