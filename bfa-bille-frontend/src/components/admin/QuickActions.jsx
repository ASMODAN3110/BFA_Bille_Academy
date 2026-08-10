import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBagShopping,
  faCalendarPlus,
  faPenToSquare,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { quickActions } from '../../data/mockData'

/* ============================================================
   QuickActions — Raccourcis d'action du back-office (@EF51)
   ------------------------------------------------------------
   - 4 boutons dorés (Ajouter un joueur, Nouvel article, Créer un
     événement, Ajouter un produit) qui pointent vers les futurs
     formulaires.
   ============================================================ */

const ACTION_ICONS = [faUserPlus, faPenToSquare, faCalendarPlus, faBagShopping]

export default function QuickActions() {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-sombre">Actions rapides</h2>
      <p className="mt-0.5 text-sm text-sombre/60">
        Accès rapides aux principales créations.
      </p>

      <div className="mt-4 space-y-3">
        {quickActions.map((action, index) => (
          <Button
            key={action.path}
            to={action.path}
            variant="secondary"
            size="md"
            className="w-full"
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
