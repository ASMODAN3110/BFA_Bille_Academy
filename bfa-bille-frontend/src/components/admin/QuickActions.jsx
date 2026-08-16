import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBagShopping,
  faCalendarPlus,
  faPenToSquare,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Button from '../ui/Button'

/* ============================================================
   QuickActions — Raccourcis d'action du back-office (@EF51)
   ------------------------------------------------------------
   - 4 boutons dorés (Ajouter un joueur, Nouvel article, Créer un
     événement, Ajouter un produit) qui pointent vers les futurs
     formulaires.
   - Les raccourcis sont des constantes locales (navigation), pas
     des données : ils ne dépendent pas du backend.
   ============================================================ */

const ACTIONS = [
  { label: 'Ajouter un joueur', path: '/admin/players/add' },
  { label: 'Nouvel article', path: '/admin/blog/new' },
  { label: 'Créer un événement', path: '/admin/events/add' },
  { label: 'Ajouter un produit', path: '/admin/products/add' },
]

const ACTION_ICONS = [faUserPlus, faPenToSquare, faCalendarPlus, faBagShopping]

export default function QuickActions() {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-sombre">Actions rapides</h2>
      <p className="mt-0.5 text-sm text-sombre/60">
        Accès rapides aux principales créations.
      </p>

      <div className="mt-4 space-y-4">
        {ACTIONS.map((action, index) => (
          <Button
            key={action.path}
            to={action.path}
            variant="secondary"
            size="md"
            className="w-fit"
          >
            <FontAwesomeIcon
              icon={ACTION_ICONS[index] ?? faBagShopping}
              className="h-4 w-4"
            />
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
