import {
  faBagShopping,
  faCalendarDays,
  faFileLines,
  faGaugeHigh,
  faImages,
  faLayerGroup,
  faNewspaper,
  faTrophy,
  faUserCheck,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   adminNav — Plan de navigation du back-office
   ------------------------------------------------------------
   Source unique pour le menu latéral, la barre d'onglets mobile
   et le fil d'Ariane de l'en-tête. Les modules sont regroupés
   par domaine (Sportif, Recrutement, Contenu & boutique).
   `badge: 'trials'` affiche le nombre de demandes d'essai en attente.
   ============================================================ */

export const NAV_GROUPS = [
  {
    label: null,
    items: [{ to: '/admin/dashboard', label: 'Tableau de bord', icon: faGaugeHigh }],
  },
  {
    label: 'Sportif',
    items: [
      { to: '/admin/players', label: 'Joueurs', icon: faUsers },
      { to: '/admin/categories', label: 'Catégories', icon: faLayerGroup },
      { to: '/admin/calendar', label: 'Calendrier', icon: faCalendarDays },
      { to: '/admin/results', label: 'Résultats', icon: faTrophy },
      { to: '/admin/team-sheets', label: 'Fiches techniques', icon: faFileLines },
    ],
  },
  {
    label: 'Recrutement',
    items: [{ to: '/admin/trials', label: "Demandes d'essai", icon: faUserCheck, badge: 'trials' }],
  },
  {
    label: 'Contenu & boutique',
    items: [
      { to: '/admin/blog', label: 'Blog', icon: faNewspaper },
      { to: '/admin/gallery', label: 'Galerie', icon: faImages },
      { to: '/admin/shop', label: 'Boutique', icon: faBagShopping },
    ],
  },
]

export const SETTINGS_ITEM = { to: '/admin/settings', label: 'Paramètres' }

/** Onglets de la barre mobile (le reste passe par « Plus »). */
export const TAB_ITEMS = [
  { to: '/admin/dashboard', label: 'Accueil', icon: faGaugeHigh },
  { to: '/admin/players', label: 'Joueurs', icon: faUsers },
  { to: '/admin/calendar', label: 'Agenda', icon: faCalendarDays },
  { to: '/admin/trials', label: 'Essais', icon: faUserCheck, badge: 'trials' },
]

/** Retrouve groupe + libellé d'une route admin (fil d'Ariane). */
export function findNavEntry(pathname) {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.to || pathname.startsWith(item.to + '/')) {
        return { group: group.label, label: item.label }
      }
    }
  }
  if (pathname.startsWith('/admin/settings')) return { group: 'Système', label: 'Paramètres' }
  /* Raccourcis « ajouter » rattachés à leur module */
  if (pathname.startsWith('/admin/events')) return { group: 'Sportif', label: 'Calendrier' }
  if (pathname.startsWith('/admin/products')) return { group: 'Contenu & boutique', label: 'Boutique' }
  return { group: null, label: 'Administration' }
}
