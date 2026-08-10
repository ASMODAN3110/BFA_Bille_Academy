import Card from '../ui/Card'
import { systemStatus } from '../../data/mockData'

/* ============================================================
   SystemStatus — Indicateurs de statut du système
   ------------------------------------------------------------
   - Base de données, sauvegardes et serveur mail
   - Point coloré (vert = OK, rouge = problème) + libellé + état
   ============================================================ */

const isOnline = (status) => /en ligne|à jour/i.test(status)

export default function SystemStatus() {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-sombre">Statut du système</h2>
      <p className="mt-0.5 text-sm text-sombre/60">
        État des services du back-office.
      </p>

      <ul className="mt-5 space-y-4">
        {Object.values(systemStatus).map((item) => {
          const online = isOnline(item.status)
          return (
            <li
              key={item.label}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-sombre">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    online ? 'bg-succes' : 'bg-erreur'
                  } ${online ? 'animate-pulse' : ''}`}
                />
                {item.label}
              </span>
              <span
                className={`text-sm font-semibold ${
                  online ? 'text-succes' : 'text-erreur'
                }`}
              >
                {item.status}
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
