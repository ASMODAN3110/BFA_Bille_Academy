/* ============================================================
   BFA Bille Academy — Configuration du site
   ------------------------------------------------------------
   Données structurelles / identité du site (navigation, contact,
   réseaux sociaux, devise du club). Ce ne sont pas des « données
   mock » mais la config de base de l'application — elle pourra
   être servie plus tard par un endpoint de configuration.
   ============================================================ */

export const club = {
  name: 'BFA Bille Academy',
  tagline: 'Former, Discipliner, Révéler',
  city: 'Bille, Cameroun',
  email: 'contact@bfabilleacademy.com',
  phone: '+237 690 00 00 00',
  address: 'Douala — Cameroun',
  description:
    "Académie de football amateur située au Cameroun. Nous formons l'élite de demain grâce à un encadrement professionnel exigeant, dans le respect des valeurs du football.",
}

export const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Équipes', to: '/equipes' },
  { label: 'Calendrier', to: '/calendrier' },
  { label: 'Essais', to: '/essais' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Blog', to: '/blog' },
  { label: 'Résultats', to: '/resultats' },
  { label: 'Boutique', to: '/boutique' },
]

export const socialLinks = [
  { name: 'Facebook', icon: 'facebook-f', url: 'https://facebook.com' },
  { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
  { name: 'X (Twitter)', icon: 'x-twitter', url: 'https://x.com' },
  { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' },
]

/* Devise du club — contenus développés dans la section Valeurs de l'accueil. */
export const values = [
  {
    id: 'former',
    icon: 'graduation-cap',
    title: 'Former',
    description:
      "Acquérir les fondamentaux techniques et tactiques grâce à un encadrement professionnel exigeant.",
  },
  {
    id: 'discipliner',
    icon: 'shield-halved',
    title: 'Discipliner',
    description:
      "Forger un mental d'acier, le respect des règles et l'esprit d'équipe indispensables au haut niveau.",
  },
  {
    id: 'reveler',
    icon: 'trophy',
    title: 'Révéler',
    description:
      "Donner l'opportunité d'exprimer son potentiel lors de détections et tournois prestigieux.",
  },
]
