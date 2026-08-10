/* ============================================================
   BFA Bille Academy — Données mock du site
   (À remplacer plus tard par des appels API / base de données)
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

/* -------------------- Catégories (essais) ------------------- */
export const categories = ['U9', 'U15', 'U17']

export const socialLinks = [
  { name: 'Facebook', icon: 'facebook-f', url: 'https://facebook.com' },
  { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
  { name: 'X (Twitter)', icon: 'x-twitter', url: 'https://x.com' },
  { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' },
]

/* ------------------------- Valeurs ------------------------- */
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

/* --------------------- Chiffres clés ----------------------- */
export const stats = [
  { value: 150, suffix: '+', label: 'Joueurs formés', icon: 'futbol' },
  { value: 12, suffix: '', label: 'Entraîneurs', icon: 'users' },
  { value: 8, suffix: '', label: 'Titres remportés', icon: 'medal' },
  { value: 5, suffix: '', label: "Années d'existence", icon: 'calendar-check' },
]

/* ------------------------ Actualités ----------------------- */
export const news = [
  {
    id: 1,
    title: 'BFA Bille remporte la Coupe Régionale Junior',
    date: '2026-07-28',
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    excerpt:
      "Une victoire historique pour nos U17 qui s'imposent en finale 3-1 face à l'Espoir de Douala devant un public venu en masse.",
    link: '/blog',
  },
  {
    id: 2,
    title: 'Ouverture des inscriptions pour les essais 2026-2027',
    date: '2026-07-15',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    excerpt:
      "Le club organise ses détections annuelles dans les catégories U9, U15 et U17. Les jeunes talents de toute la région sont attendus !",
    link: '/essais',
  },
  {
    id: 3,
    title: "Stage intensif de pré-saison : le programme complet",
    date: '2026-07-02',
    image:
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=800&auto=format&fit=crop',
    excerpt:
      "Du 10 au 24 août, nos jeunes joueurs s'entraîneront deux fois par jour autour du développement technique et de la cohésion d'équipe.",
    link: '/blog',
  },
]

/* ------------------------ Classements ----------------------- */
export const rankings = [
  {
    category: 'U9',
    teams: [
      { position: 1, name: 'BFA Bille U9', points: 42 },
      { position: 2, name: 'Étoile de Bille', points: 38 },
      { position: 3, name: 'AS Mboppi', points: 35 },
    ],
  },
  {
    category: 'U15',
    teams: [
      { position: 1, name: 'BFA Bille U15', points: 55 },
      { position: 2, name: 'Faucons de Bafoussam', points: 49 },
      { position: 3, name: 'Real Kribi', points: 47 },
    ],
  },
  {
    category: 'U17',
    teams: [
      { position: 1, name: 'BFA Bille U17', points: 61 },
      { position: 2, name: 'Olympique Yaoundé', points: 58 },
      { position: 3, name: 'Génération Foot Cam', points: 52 },
    ],
  },
]

/* --------------------- Prochains matchs --------------------- */
export const matches = [
  {
    id: 1,
    date: '2026-08-15',
    time: '15h00',
    category: 'U15',
    type: 'Championnat',
    venue: 'Stade de Bille',
    home: 'BFA Bille U15',
    away: 'Faucons de Bafoussam',
  },
  {
    id: 2,
    date: '2026-08-22',
    time: '17h30',
    category: 'U17',
    type: 'Amical',
    venue: 'Stade Annexe de Douala',
    home: 'BFA Bille U17',
    away: 'Olympique Yaoundé',
  },
  {
    id: 3,
    date: '2026-08-29',
    time: '14h00',
    category: 'U9',
    type: 'Championnat',
    venue: 'Terrain Municipal de Bille',
    home: 'BFA Bille U9',
    away: 'Étoile de Bille',
  },
]

/* ------------------------- Galerie -------------------------- */
export const gallery = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop',
    caption: 'Entraînement des U15 au stade de Bille',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
    caption: 'Victoire en Coupe Régionale Junior',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1200&auto=format&fit=crop',
    caption: 'Stage intensif de pré-saison',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop',
    caption: 'Séance de frappe et de technique',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=1200&auto=format&fit=crop',
    caption: "Préparation physique en salle",
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
    caption: 'Tournoi international des jeunes',
  },
]

/* -------------------- Albums (galerie) ---------------------- */
/* Images : Unsplash (remplacer par les vraies photos locales
   quand elles seront disponibles). Vidéos : MP4 publics de
   démonstration (Google sample bucket). */
export const albums = [
  {
    id: 1,
    titre: 'Session Tactique U17',
    date: '2024-10-12',
    theme: 'Entraînements',
    coverImage:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 1,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 2,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 3,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
    ],
  },
  {
    id: 2,
    titre: 'Highlights : Finale Régionale',
    date: '2024-10-05',
    theme: 'Matchs',
    coverImage:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 4,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 5,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 6,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=1000&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 3,
    titre: 'Masterclass Entraîneurs',
    date: '2024-09-28',
    theme: 'Événements',
    coverImage:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 7,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 8,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      },
    ],
  },
  {
    id: 4,
    titre: 'Portraits U19',
    date: '2024-09-15',
    theme: 'Entraînements',
    coverImage:
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 9,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 10,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 11,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1587330979470-3b1a183b9177?q=80&w=1000&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 5,
    titre: 'Journée Détection 2024',
    date: '2024-09-01',
    theme: 'Événements',
    coverImage:
      'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 12,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 13,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 14,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      },
    ],
  },
  {
    id: 6,
    titre: 'Célébration Coupe d’Été',
    date: '2024-08-20',
    theme: 'Matchs',
    coverImage:
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 15,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 16,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop',
      },
      {
        id: 17,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
    ],
  },
]

/* ------------ Albums (galerie) — données back-office ---------- */
/* Structure spécifique au back-office : description, dateCreation,
   medias avec nomFichier. Images Unsplash (remplacer par les vraies
   photos locales quand elles seront disponibles), vidéos MP4 de
   démonstration (Google sample bucket). */
export const adminAlbums = [
  {
    id: 1,
    titre: 'Session Tactique U17',
    description:
      'Séance d’analyse vidéo et de préparation tactique avec le groupe U17.',
    dateCreation: '2025-06-14',
    theme: 'Entraînements',
    coverImage:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 101,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'tactique-1.jpg',
      },
      {
        id: 102,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'tactique-2.jpg',
      },
      {
        id: 103,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        nomFichier: 'analyse-seance.mp4',
      },
    ],
  },
  {
    id: 2,
    titre: 'Portraits U19',
    description:
      'Photos officielles des joueurs U19 pour la saison en cours.',
    dateCreation: '2025-06-02',
    theme: 'Entraînements',
    coverImage:
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 201,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'portrait-1.jpg',
      },
      {
        id: 202,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'portrait-2.jpg',
      },
      {
        id: 203,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1587330979470-3b1a183b9177?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'portrait-3.jpg',
      },
    ],
  },
  {
    id: 3,
    titre: 'Highlights : Finale Régionale',
    description:
      'Retour en images et en vidéo sur la finale régionale remportée 3–1.',
    dateCreation: '2025-05-24',
    theme: 'Matchs',
    coverImage:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 301,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'finale-1.jpg',
      },
      {
        id: 302,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'finale-2.jpg',
      },
      {
        id: 303,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        nomFichier: 'but-de-la-finale.mp4',
      },
    ],
  },
  {
    id: 4,
    titre: 'Célébration Coupe d’Été',
    description:
      'Les coulisses de la remise de la coupe d’été et la fête des équipes.',
    dateCreation: '2025-05-10',
    theme: 'Matchs',
    coverImage:
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 401,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'celebration-1.jpg',
      },
      {
        id: 402,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'celebration-2.jpg',
      },
      {
        id: 403,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        nomFichier: 'ambiance-coupe.mp4',
      },
    ],
  },
  {
    id: 5,
    titre: 'Masterclass Entraîneurs',
    description:
      'Atelier technique animé par le staff pour les entraîneurs des catégories jeunes.',
    dateCreation: '2025-04-28',
    theme: 'Événements',
    coverImage:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 501,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'masterclass-1.jpg',
      },
      {
        id: 502,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        nomFichier: 'atelier-demo.mp4',
      },
    ],
  },
  {
    id: 6,
    titre: 'Journée Détection 2024',
    description:
      'Bilan en images de la journée de détection ouverte aux jeunes talents.',
    dateCreation: '2025-04-12',
    theme: 'Événements',
    coverImage:
      'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 601,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'detection-1.jpg',
      },
      {
        id: 602,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'detection-2.jpg',
      },
    ],
  },
  {
    id: 7,
    titre: 'Préparation Physique U15',
    description:
      'Exercices de préparation physique et athlétique du groupe U15.',
    dateCreation: '2025-03-30',
    theme: 'Entraînements',
    coverImage:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 701,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'physique-1.jpg',
      },
      {
        id: 702,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'physique-2.jpg',
      },
    ],
  },
  {
    id: 8,
    titre: 'Phase Finale U17',
    description:
      'Temps forts de la phase finale du championnat U17.',
    dateCreation: '2025-03-15',
    theme: 'Matchs',
    coverImage:
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1200&auto=format&fit=crop',
    medias: [
      {
        id: 801,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'phase-finale-1.jpg',
      },
      {
        id: 802,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=1000&auto=format&fit=crop',
        nomFichier: 'phase-finale-2.jpg',
      },
      {
        id: 803,
        type: 'video',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        nomFichier: 'prolongations.mp4',
      },
    ],
  },
]

/* ------------------ Articles (blog) — back-office ------------- */
export const adminBlogPosts = [
  {
    id: 1,
    titre: "L'équipe U18 sélectionnée pour le tournoi régional",
    categorie: 'Matchs',
    auteur: 'J. Dubois',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    extrait:
      "L'équipe U18 de la BFA Bille Academy est officiellement retenue pour le tournoi régional du mois prochain.",
    contenu:
      '<p>Après une saison régulière impressionnante, l’équipe U18 de la BFA Bille Academy s’est officiellement qualifiée pour le tournoi régional. Le groupe a terminé en tête de sa poule avec une seule défaite.</p><p>Le staff technique met en avant la discipline tactique et le collectif, valeurs centrales de l’académie.</p>',
    datePublication: '2024-10-24',
    dateModification: '',
    statut: 'Publié',
    vues: 1200,
    commentaires: 4,
    estPublie: true,
  },
  {
    id: 2,
    titre: 'Guide nutritionnel pour les jeunes athlètes',
    categorie: 'Communiqués',
    auteur: 'M. Laurent',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=800&auto=format&fit=crop',
    extrait:
      'Une alimentation adaptée est essentielle à la performance. Voici nos conseils pour les joueurs et leurs familles.',
    contenu:
      '<p>La nutrition joue un rôle clé dans la récupération et la performance des jeunes footballeurs. Nous partageons ici quelques principes simples à appliquer au quotidien.</p><p>Hydratation régulière, repas équilibrés et collations adaptées à l’effort sont au cœur de notre programme d’accompagnement.</p>',
    datePublication: '',
    dateModification: '2024-10-23',
    statut: 'Brouillon',
    vues: 0,
    commentaires: 0,
    estPublie: false,
  },
  {
    id: 3,
    titre: "Inauguration du nouveau centre d'entraînement",
    categorie: 'Événements',
    auteur: 'Administration',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
    extrait:
      "Le nouveau centre d'entraînement de l'académie a été inauguré en présence des familles et des partenaires.",
    contenu:
      '<p>Le nouveau centre d’entraînement de la BFA Bille Academy a été inauguré lors d’une cérémonie réunissant joueurs, familles et partenaires.</p><p>Doté de terrains homologués et de nouveaux vestiaires, il permettra d’élever encore le niveau d’encadrement des jeunes.</p>',
    datePublication: '2024-10-15',
    dateModification: '2024-10-16',
    statut: 'Publié',
    vues: 3400,
    commentaires: 12,
    estPublie: true,
  },
  {
    id: 4,
    titre: 'Analyse tactique U15 : enseignements clés',
    categorie: 'Portraits',
    auteur: 'P. Dubois',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop',
    extrait:
      'Retour sur les forces et les axes de progression dégagés lors des dernières rencontres de la catégorie U15.',
    contenu:
      '<p>Les dernières sorties de l’équipe U15 ont confirmé une bonne maîtrise du jeu en transition. La projection des latéraux et la première relance sont nos principaux atouts.</p><p>Les prochaines séances porteront sur la finition et la gestion des temps faibles.</p>',
    datePublication: '2024-10-10',
    dateModification: '2024-10-12',
    statut: 'Publié',
    vues: 850,
    commentaires: 3,
    estPublie: true,
  },
  {
    id: 5,
    titre: "Préparation : camp d'été 2025",
    categorie: 'Événements',
    auteur: 'Administration',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop',
    extrait:
      "Le programme du camp d'été 2025 se précise : dates, inscriptions et détails du dispositif d'accueil.",
    contenu:
      '<p>Le camp d’été 2025 de l’académie se déroulera sur deux semaines en juillet. Les inscriptions seront ouvertes à toutes les catégories, du U9 au U17.</p><p>Un programme complet (football, préparation physique, nutrition) sera communiqué prochainement.</p>',
    datePublication: '',
    dateModification: '2024-10-18',
    statut: 'Brouillon',
    vues: 0,
    commentaires: 0,
    estPublie: false,
  },
  {
    id: 6,
    titre: 'Victoire de l’U17 en coupe régionale',
    categorie: 'Matchs',
    auteur: 'T. Nkoulou',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    extrait:
      "L'équipe U17 s'impose en finale de la coupe régionale au terme d'un match plein de maîtrise.",
    contenu:
      '<p>L’équipe U17 a remporté la coupe régionale en s’imposant deux buts à un en finale. Un match maîtrisé de bout en bout, récompensant le travail de toute une saison.</p><p>Les joueurs ont été félicités par l’ensemble de l’académie, dans une ambiance de grande ferveur.</p>',
    datePublication: '2024-10-05',
    dateModification: '',
    statut: 'Publié',
    vues: 2100,
    commentaires: 7,
    estPublie: true,
  },
  {
    id: 7,
    titre: 'Portrait : à la rencontre de notre gardien U15',
    categorie: 'Portraits',
    auteur: 'M. Laurent',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
    extrait:
      'Ambitions, entraînement et vie à l’académie : entretien avec le dernier rempart de la catégorie U15.',
    contenu:
      '<p>Véritable patron de sa surface, notre gardien U15 nous ouvre les portes du quotidien à l’académie : entraînements quotidiens, hygiène de vie et ambitions personnelles.</p><p>Un exemple de sérieux et d’humilité, dans l’esprit même de la BFA Bille Academy.</p>',
    datePublication: '2024-10-01',
    dateModification: '',
    statut: 'Publié',
    vues: 980,
    commentaires: 5,
    estPublie: true,
  },
  {
    id: 8,
    titre: 'Recrutement des encadreurs pour la saison',
    categorie: 'Communiqués',
    auteur: 'Administration',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
    extrait:
      "L'académie recherche des entraîneurs et encadreurs motivés pour accompagner nos équipes la saison prochaine.",
    contenu:
      '<p>Dans le cadre de la préparation de la nouvelle saison, l’académie lance une campagne de recrutement d’entraîneurs et d’encadreurs diplômés.</p><p>Les candidatures sont à adresser par courriel avant la fin du mois. Les profils expérimentés seront prioritaires.</p>',
    datePublication: '2024-09-28',
    dateModification: '',
    statut: 'Publié',
    vues: 640,
    commentaires: 2,
    estPublie: true,
  },
  {
    id: 9,
    titre: 'Journée portes ouvertes : bilan',
    categorie: 'Événements',
    auteur: 'J. Dubois',
    image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=800&auto=format&fit=crop',
    extrait:
      'Près de deux cents familles ont découvert les installations et le projet pédagogique de l’académie.',
    contenu:
      '<p>La journée portes ouvertes de l’académie a rencontré un franc succès. Près de deux cents familles ont visité les installations et échangé avec le staff.</p><p>Les inscriptions pour les tests de détection sont déjà ouvertes pour la saison à venir.</p>',
    datePublication: '2024-09-20',
    dateModification: '',
    statut: 'Publié',
    vues: 1500,
    commentaires: 9,
    estPublie: true,
  },
  {
    id: 10,
    titre: 'Préparation physique : retour sur le stage',
    categorie: 'Communiqués',
    auteur: 'A. Fouda',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    extrait:
      "Bilan du stage de préparation physique : exercices de renforcement et premiers repères athlétiques.",
    contenu:
      '<p>Le stage de préparation physique a permis de poser les bases de la saison : gainage, appuis et prévention des blessures.</p><p>Les tests initiaux serviront de références pour mesurer la progression de chaque joueur tout au long de l’année.</p>',
    datePublication: '2024-09-15',
    dateModification: '',
    statut: 'Publié',
    vues: 320,
    commentaires: 0,
    estPublie: true,
  },
  {
    id: 11,
    titre: 'Interview croisée des capitaines U17',
    categorie: 'Portraits',
    auteur: 'P. Dubois',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    extrait:
      'Les deux capitaines de la catégorie U17 reviennent sur leur rôle et sur l’état d’esprit du groupe.',
    contenu:
      '<p>À tour de rôle, les capitaines de la catégorie U17 reviennent sur leur rôle au sein du vestiaire et sur les valeurs qui guident le groupe.</p><p>Une double interview sans langue de bois, entre exigence et bienveillance.</p>',
    datePublication: '2024-09-10',
    dateModification: '',
    statut: 'Publié',
    vues: 730,
    commentaires: 4,
    estPublie: true,
  },
  {
    id: 12,
    titre: "Programme des entraînements d'octobre",
    categorie: 'Communiqués',
    auteur: 'Administration',
    image: 'https://images.unsplash.com/photo-1587330979470-3b1a183b9177?q=80&w=800&auto=format&fit=crop',
    extrait:
      "Retrouvez le planning des séances d'entraînement du mois d'octobre, par catégorie.",
    contenu:
      '<p>Le programme des entraînements du mois d’octobre est désormais disponible. Les horaires peuvent être ajustés en fonction de la météo.</p><p>Les familles sont invitées à consulter régulièrement cette page pour les éventuelles modifications.</p>',
    datePublication: '',
    dateModification: '2024-09-08',
    statut: 'Brouillon',
    vues: 0,
    commentaires: 0,
    estPublie: false,
  },
]

/* ------------------- Fiches techniques ---------------------- */
export const teamSheets = {
  U9: {
    categorie: 'U9',
    saison: '2024/2025',
    effectif: [
      { nom: 'Lucas Martin', poste: 'Gardien', statut: 'SELECTED' },
      { nom: 'Hugo Leroy', poste: 'Défenseur', statut: 'SELECTED' },
      { nom: 'Elias Diop', poste: 'Milieu', statut: 'MVP' },
      { nom: 'Sophie Durand', poste: 'Attaquant', statut: 'SELECTED' },
      { nom: 'Ahmed Benali', poste: 'Défenseur', statut: 'SELECTED' },
    ],
    staff: [
      {
        nom: 'Marie Lefèvre',
        role: 'Head Coach U9',
        qualification: 'UEFA B License',
      },
      {
        nom: 'Thomas Martin',
        role: 'Assistant Coach',
        qualification: 'Youth Diploma',
      },
    ],
    objectifs: [
      'Développer les fondamentaux techniques (conduite de balle, passes, dribbles).',
      'Apprendre les règles du jeu et les bases du positionnement.',
      "Encourager l'esprit d'équipe et le fair-play.",
      'Préparer la transition vers U15.',
    ],
    palmares: [
      {
        titre: 'Tournoi de la Jeunesse',
        saison: '2023/2024',
        description: 'Vainqueur du tournoi U9.',
      },
    ],
  },
  U15: {
    categorie: 'U15',
    saison: '2024/2025',
    effectif: [
      { nom: 'Jean Dupont', poste: 'Gardien', statut: 'SELECTED' },
      { nom: 'Marc Tremblay', poste: 'Défenseur', statut: 'SELECTED' },
      { nom: 'Lucas Blanc', poste: 'Milieu', statut: 'MVP' },
      { nom: 'Antoine Martin', poste: 'Attaquant', statut: 'SELECTED' },
      { nom: 'Clara Dubois', poste: 'Milieu', statut: 'SELECTED' },
      { nom: 'Thomas Petit', poste: 'Défenseur', statut: 'SELECTED' },
    ],
    staff: [
      {
        nom: 'Pierre Dubois',
        role: 'Head Coach U15',
        qualification: 'UEFA A License',
      },
      {
        nom: 'Alexandre Petit',
        role: 'Fitness Coach',
        qualification: 'Strength & Conditioning',
      },
      {
        nom: 'Nicolas Blanc',
        role: 'Assistant Coach',
        qualification: 'UEFA B License',
      },
    ],
    objectifs: [
      'Développer la compréhension tactique du jeu de position.',
      'Promouvoir au moins 3 joueurs en U17 en fin de saison.',
      'Maintenir le top 3 du championnat régional élite.',
      'Améliorer les indicateurs de condition physique de 15%.',
    ],
    palmares: [
      {
        titre: 'Regional Champions',
        saison: '2023/2024',
        description:
          'Saison invaincue en championnat régional, finale 3-1.',
      },
      {
        titre: 'National Tournament Finalists',
        saison: 'Summer 2023',
        description: 'Finalistes de la coupe nationale U15.',
      },
    ],
  },
  U17: {
    categorie: 'U17',
    saison: '2024/2025',
    effectif: [
      { nom: 'Léo Martin', poste: 'Gardien', statut: 'SELECTED' },
      { nom: 'Arthur Dubois', poste: 'Défenseur', statut: 'SELECTED' },
      { nom: 'Lucas Petit', poste: 'Milieu', statut: 'MVP' },
      { nom: 'Elias Diop', poste: 'Attaquant', statut: 'SELECTED' },
      { nom: 'Sophie Durand', poste: 'Milieu', statut: 'SELECTED' },
      { nom: 'Ahmed Benali', poste: 'Défenseur', statut: 'SELECTED' },
      { nom: 'Hugo Leroy', poste: 'Attaquant', statut: 'SELECTED' },
    ],
    staff: [
      {
        nom: 'Jean-Pierre Martin',
        role: 'Head Coach U17',
        qualification: 'UEFA A License',
      },
      {
        nom: 'Philippe Durand',
        role: 'Assistant Coach',
        qualification: 'UEFA B License',
      },
      {
        nom: 'Marie Lefèvre',
        role: 'Goalkeeper Coach',
        qualification: 'Specialist GK License',
      },
    ],
    objectifs: [
      'Préparer les joueurs pour le football senior (U19 et au-delà).',
      'Développer une identité tactique forte (possession et transition).',
      'Qualifier pour la phase finale du championnat national.',
      "Améliorer l'efficacité offensive et défensive sur coups de pied arrêtés.",
    ],
    palmares: [
      {
        titre: 'Regional Cup Winners',
        saison: '2023/2024',
        description: 'Vainqueur de la coupe régionale U17.',
      },
      {
        titre: 'National Championship Finalists',
        saison: '2022/2023',
        description: 'Finalistes du championnat national U17.',
      },
    ],
  },
}

/* ------------------------ Témoignages ----------------------- */
export const testimonials = [
  {
    id: 1,
    name: 'Jean-Marc Nkou',
    role: "Parent d'un joueur U15",
    image: 'https://i.pravatar.cc/120?img=12',
    text: "Grâce à BFA, mon fils a progressé plus vite que je ne l'aurais imaginé. L'encadrement est sérieux et le suivi scolaire est un vrai plus.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Aline Mbarga',
    role: "Maman de deux académiciens",
    image: 'https://i.pravatar.cc/120?img=47',
    text: "On y inculque bien plus que le football : la discipline, le respect et l'amour du travail bien fait. Une grande famille !",
    rating: 5,
  },
  {
    id: 3,
    name: 'Éric Tchoua',
    role: 'Ancien joueur, actuellement en centre de formation',
    image: 'https://i.pravatar.cc/120?img=68',
    text: "BFA m'a donné les bases qui me servent encore aujourd'hui. Les détections organisées par le club m'ont ouvert des portes incroyables.",
    rating: 5,
  },
]

/* ------------------------ Joueurs -------------------------- */
/* Photos : placeholders (pravatar) — à remplacer par les vraies
   photos des joueurs (dossier public/images/players/). */
export const players = [
  {
    id: 1,
    nom: 'Léo Martin',
    prenom: 'Léo',
    poste: 'Attaquant',
    age: 16,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=11',
    dateArrivee: '2023-09-01',
    stats: { matches: 24, buts: 14, passes: 5 },
  },
  {
    id: 2,
    nom: 'Arthur Dubois',
    prenom: 'Arthur',
    poste: 'Milieu central',
    age: 14,
    categorie: 'U15',
    photo: 'https://i.pravatar.cc/400?img=13',
    dateArrivee: '2024-01-15',
    stats: { matches: 18, buts: 4, passes: 9 },
  },
  {
    id: 3,
    nom: 'Hugo Leroy',
    prenom: 'Hugo',
    poste: 'Défenseur',
    age: 9,
    categorie: 'U9',
    photo: 'https://i.pravatar.cc/400?img=5',
    dateArrivee: '2025-06-01',
    stats: { matches: 10, buts: 1, passes: 2 },
  },
  {
    id: 4,
    nom: 'Lucas Petit',
    prenom: 'Lucas',
    poste: 'Gardien',
    age: 16,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=15',
    dateArrivee: '2024-08-15',
    stats: { matches: 20, buts: 0, passes: 0 },
  },
  {
    id: 5,
    nom: 'Sophie Durand',
    prenom: 'Sophie',
    poste: 'Milieu offensif',
    age: 13,
    categorie: 'U15',
    photo: 'https://i.pravatar.cc/400?img=45',
    dateArrivee: '2024-09-01',
    stats: { matches: 16, buts: 7, passes: 6 },
  },
  {
    id: 6,
    nom: 'Elias Diop',
    prenom: 'Elias',
    poste: 'Attaquant',
    age: 9,
    categorie: 'U9',
    photo: 'https://i.pravatar.cc/400?img=8',
    dateArrivee: '2025-01-20',
    stats: { matches: 8, buts: 6, passes: 1 },
  },
  {
    id: 7,
    nom: 'Nathan Kassi',
    prenom: 'Nathan',
    poste: 'Défenseur central',
    age: 14,
    categorie: 'U15',
    photo: 'https://i.pravatar.cc/400?img=20',
    dateArrivee: '2024-04-10',
    stats: { matches: 15, buts: 2, passes: 1 },
  },
  {
    id: 8,
    nom: 'Inès Mbarga',
    prenom: 'Inès',
    poste: 'Milieu',
    age: 16,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=47',
    dateArrivee: '2023-11-05',
    stats: { matches: 22, buts: 3, passes: 8 },
  },
  {
    id: 9,
    nom: 'Yanis Nkoulou',
    prenom: 'Yanis',
    poste: 'Ailier droit',
    age: 17,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=23',
    dateArrivee: '2023-03-18',
    stats: { matches: 26, buts: 11, passes: 7 },
  },
  {
    id: 10,
    nom: 'Mamadou Sow',
    prenom: 'Mamadou',
    poste: 'Attaquant',
    age: 16,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=33',
    dateArrivee: '2024-02-22',
    stats: { matches: 19, buts: 12, passes: 3 },
  },
  {
    id: 11,
    nom: 'Chloé Etoundi',
    prenom: 'Chloé',
    poste: 'Latérale gauche',
    age: 13,
    categorie: 'U15',
    photo: 'https://i.pravatar.cc/400?img=49',
    dateArrivee: '2025-02-10',
    stats: { matches: 9, buts: 0, passes: 3 },
  },
  {
    id: 12,
    nom: 'Karim Abega',
    prenom: 'Karim',
    poste: 'Milieu défensif',
    age: 14,
    categorie: 'U15',
    photo: 'https://i.pravatar.cc/400?img=52',
    dateArrivee: '2024-06-01',
    stats: { matches: 14, buts: 1, passes: 2 },
  },
  {
    id: 13,
    nom: 'Gabriel Mvondo',
    prenom: 'Gabriel',
    poste: 'Défenseur central',
    age: 17,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=59',
    dateArrivee: '2023-08-20',
    stats: { matches: 25, buts: 2, passes: 1 },
  },
  {
    id: 14,
    nom: 'Lina Fofana',
    prenom: 'Lina',
    poste: 'Milieu offensif',
    age: 8,
    categorie: 'U9',
    photo: 'https://i.pravatar.cc/400?img=44',
    dateArrivee: '2025-09-01',
    stats: { matches: 6, buts: 3, passes: 2 },
  },
  {
    id: 15,
    nom: 'Tanguy Ngassa',
    prenom: 'Tanguy',
    poste: 'Gardien',
    age: 9,
    categorie: 'U9',
    photo: 'https://i.pravatar.cc/400?img=61',
    dateArrivee: '2025-04-15',
    stats: { matches: 7, buts: 0, passes: 0 },
  },
  {
    id: 16,
    nom: 'Steve Kamdem',
    prenom: 'Steve',
    poste: 'Latéral droit',
    age: 16,
    categorie: 'U17',
    photo: 'https://i.pravatar.cc/400?img=68',
    dateArrivee: '2024-10-01',
    stats: { matches: 21, buts: 1, passes: 6 },
  },
]

/* -------------------- Événements (calendrier) --------------- */
export const events = [
  {
    id: 1,
    titre: 'Match régional U9',
    date: '2024-10-08',
    heureDebut: '14:00',
    heureFin: '16:00',
    lieu: 'Stade principal',
    categorie: 'U9',
    type: 'Match',
  },
  {
    id: 2,
    titre: "Entraînement tactique U15",
    date: '2024-10-12',
    heureDebut: '17:30',
    heureFin: '19:30',
    lieu: "Terrain d'entraînement A",
    categorie: 'U15',
    type: 'Entraînement',
  },
  {
    id: 3,
    titre: 'Match amical U17',
    date: '2024-10-15',
    heureDebut: '16:00',
    heureFin: '18:00',
    lieu: 'Stade principal',
    categorie: 'U17',
    type: 'Match',
  },
  {
    id: 4,
    titre: 'Entraînement tactique U9',
    date: '2024-10-18',
    heureDebut: '10:00',
    heureFin: '12:00',
    lieu: "Terrain d'entraînement B",
    categorie: 'U9',
    type: 'Entraînement',
  },
  {
    id: 5,
    titre: 'Match régional U15',
    date: '2024-10-22',
    heureDebut: '15:00',
    heureFin: '17:00',
    lieu: 'Stade annexe',
    categorie: 'U15',
    type: 'Match',
  },
  {
    id: 6,
    titre: "Stage d'entraînement U17",
    date: '2024-10-25',
    heureDebut: '09:00',
    heureFin: '17:00',
    lieu: "Terrain d'entraînement A",
    categorie: 'U17',
    type: 'Entraînement',
  },
  {
    id: 7,
    titre: 'Mini-tournoi U9',
    date: '2024-10-28',
    heureDebut: '09:00',
    heureFin: '16:00',
    lieu: 'Stade annexe',
    categorie: 'U9',
    type: 'Match',
  },
  {
    id: 8,
    titre: "Séance d'entraînement U15",
    date: '2024-11-02',
    heureDebut: '14:00',
    heureFin: '16:00',
    lieu: "Terrain d'entraînement B",
    categorie: 'U15',
    type: 'Entraînement',
  },
  {
    id: 9,
    titre: 'Match régional U17',
    date: '2024-11-09',
    heureDebut: '15:00',
    heureFin: '17:00',
    lieu: 'Stade principal',
    categorie: 'U17',
    type: 'Match',
  },
  {
    id: 10,
    titre: 'Journée détente U9',
    date: '2024-11-16',
    heureDebut: '09:00',
    heureFin: '12:00',
    lieu: "Terrain d'entraînement A",
    categorie: 'U9',
    type: 'Entraînement',
  },
  {
    id: 11,
    titre: 'Match amical U15',
    date: '2024-11-23',
    heureDebut: '16:00',
    heureFin: '18:00',
    lieu: 'Stade annexe',
    categorie: 'U15',
    type: 'Match',
  },
  {
    id: 12,
    titre: 'Gala de fin d’année U17',
    date: '2024-12-14',
    heureDebut: '10:00',
    heureFin: '14:00',
    lieu: 'Stade principal',
    categorie: 'U17',
    type: 'Match',
  },
]

/* ------------------------ Blog d'actualités ------------------ */
/* Articles du blog. `estPublie: false` = brouillon non affiché.
   Images : placeholders Unsplash (à remplacer par les vraies photos
   locales quand elles seront disponibles). */
export const blogPosts = [
  {
    id: 1,
    titre: 'Victoire éclatante de nos U17 face au rival régional',
    categorie: 'Matchs',
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    auteur: 'Pierre Dubois',
    date: '2024-10-20',
    extrait:
      "L'équipe U17 a démontré une maîtrise tactique exceptionnelle ce week-end, s'imposant 3-0 dans un derby très attendu. Les joueurs ont appliqué à la perfection le plan de jeu…",
    contenu: `
      <p>L'équipe U17 a démontré une maîtrise tactique exceptionnelle ce week-end, s'imposant <strong>3-0</strong> dans un derby très attendu. Les joueurs ont appliqué à la perfection le plan de jeu élaboré par le staff, fait de pressing haut et de transitions rapides.</p>
      <p>Dès la première mi-temps, nos jeunes ont pris le contrôle du match. Deux buts avant la pause ont mis l'équipe sur de bons rails avant qu'un troisième but ne scelle définitivement la victoire en seconde période.</p>
      <h3>Les points clés de la rencontre</h3>
      <ul>
        <li>Ouverture du score dès la 12e minute sur une action collective.</li>
        <li>Solidité défensive : aucun but encaissé sur l'ensemble du match.</li>
        <li>Un public venu en masse pour soutenir les jeunes.</li>
      </ul>
      <p>Cette performance confirme la progression du groupe et le travail accompli à l'entraînement. Le staff se montre très satisfait de l'état d'esprit affiché par les joueurs.</p>
    `,
    estPublie: true,
  },
  {
    id: 2,
    titre: 'Rencontre avec Léo Dubois, espoir montant de la défense',
    categorie: 'Portraits',
    image:
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
    auteur: 'Marie Lefèvre',
    date: '2024-10-18',
    extrait:
      "À seulement 16 ans, Léo s'impose comme un pilier de notre défense centrale. Plongée dans le quotidien de ce jeune talent prometteur…",
    contenu: `
      <p>À seulement 16 ans, Léo s'impose comme un pilier de notre défense centrale. Plongée dans le quotidien de ce jeune talent prometteur, qui ne manque jamais une séance et étudie les vidéos de ses adversaires avec une passion rare.</p>
      <p>Arrivé au club à 12 ans, Léo a gravi tous les échelons des catégories jeunes. Sa lecture du jeu, son anticipation et sa sérénité à la relance font déjà de lui un joueur très complet.</p>
      <p><em>« Le foot, c'est d'abord une question de discipline et de travail. Ici, à la BFA, on nous apprend l'exigence dès le plus jeune âge »,</em> confie-t-il avec le sourire.</p>
      <p>Les recruteurs régionaux commencent à s'intéresser de près à son profil. Une belle récompense pour ce jeune homme qui rêve de porter un jour les couleurs de l'équipe nationale.</p>
    `,
    estPublie: true,
  },
  {
    id: 3,
    titre: "Inauguration de notre nouveau centre d'entraînement indoor",
    categorie: 'Communiqués',
    image:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop',
    auteur: 'Jean-Pierre Martin',
    date: '2024-10-15',
    extrait:
      "La BFA Academy franchit un nouveau cap avec l'ouverture de ses installations couvertes ultra-modernes, permettant un entraînement optimal toute l'année…",
    contenu: `
      <p>La BFA Academy franchit un nouveau cap avec l'ouverture de ses installations couvertes ultra-modernes, permettant un entraînement optimal toute l'année, quelles que soient les conditions climatiques.</p>
      <p>Ce nouveau centre comprend un terrain synthétique dernier cri, une salle de musculation entièrement équipée et des vestiaires aux normes professionnelles. Les académiciens pourront ainsi maintenir un niveau d'exigence constant.</p>
      <p><strong>Le centre est d'ores et déjà ouvert</strong> aux séances des catégories U15 et U17, avec une extension prévue pour les plus jeunes dans les prochains mois.</p>
      <p>Ce projet témoigne de l'ambition du club de se doter d'infrastructures à la hauteur de ses jeunes talents, dans l'esprit de sa devise : <em>Former, Discipliner, Révéler</em>.</p>
    `,
    estPublie: true,
  },
  {
    id: 4,
    titre: 'Retour sur la journée portes ouvertes : un succès retentissant',
    categorie: 'Événements',
    image:
      'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=800&auto=format&fit=crop',
    auteur: 'Alexandre Petit',
    date: '2024-10-12',
    extrait:
      "Plus de 500 familles nous ont rendu visite lors de notre événement annuel. Revivez les meilleurs moments de cette journée exceptionnelle…",
    contenu: `
      <p>Plus de <strong>500 familles</strong> nous ont rendu visite lors de notre événement annuel. Revivez les meilleurs moments de cette journée exceptionnelle, placée sous le signe de la convivialité et de la découverte.</p>
      <p>Au programme : démonstrations des différentes catégories, ateliers techniques ouverts aux enfants, rencontre avec le staff et les joueurs, et visite des installations du club.</p>
      <p>Les inscriptions aux essais de la saison ont déjà enregistré un nombre record de candidatures, preuve de l'attractivité grandissante de l'académie sur le territoire.</p>
      <p>Merci à toutes les familles venues nous rencontrer. Rendez-vous l'année prochaine pour une nouvelle édition encore plus grande !</p>
    `,
    estPublie: true,
  },
  {
    id: 5,
    titre: 'Les U15 brillent au tournoi régional',
    categorie: 'Matchs',
    image:
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
    auteur: 'Pierre Dubois',
    date: '2024-10-08',
    extrait:
      'Les U15 ont réalisé un parcours exceptionnel au tournoi régional, atteignant les demi-finales et démontrant un jeu collectif de grande qualité…',
    contenu: `
      <p>Les U15 ont réalisé un parcours exceptionnel au tournoi régional, atteignant les <strong>demi-finales</strong> et démontrant un jeu collectif de grande qualité tout au long de la compétition.</p>
      <p>Victorieux de leurs trois premiers matchs de poule, nos jeunes ont éliminé deux adversaires de haut niveau avant de s'incliner de justesse contre le futur vainqueur du tournoi.</p>
      <p>Au-delà du résultat, ce sont les valeurs affichées qui ont retenu l'attention : solidarité, respect des adversaires et combativité sur chaque ballon.</p>
      <p>Une mention spéciale à notre gardien, élu meilleur joueur de la compétition, pour ses arrêts décisifs tout au long du week-end.</p>
    `,
    estPublie: true,
  },
  {
    id: 6,
    titre: "Portrait de Sophie Durand, la nouvelle étoile du football féminin",
    categorie: 'Portraits',
    image:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop',
    auteur: 'Marie Lefèvre',
    date: '2024-10-05',
    extrait:
      "À 15 ans, Sophie s'impose déjà comme l'une des plus grandes promesses du football féminin régional. Rencontre avec cette athlète exceptionnelle…",
    contenu: `
      <p>À 15 ans, Sophie s'impose déjà comme l'une des plus grandes promesses du football féminin régional. Rencontre avec cette athlète exceptionnelle, qui allie vitesse, technique et intelligence de jeu.</p>
      <p>Milieu offensif de formation, Sophie impressionne par sa vista et sa capacité à délivrer des passes décisives dans les espaces les plus réduits. Elle a inscrit 7 buts et délivré 6 passes décisives cette saison.</p>
      <p><em>« Je veux montrer aux jeunes filles que le football n'est pas un sport réservé aux garçons. À la BFA, nous avons toutes notre place »,</em> affirme-t-elle avec détermination.</p>
      <p>Le staff ne tarit pas d'éloges sur sa progression et son professionnalisme, gages d'un très bel avenir pour cette future star de la discipline.</p>
    `,
    estPublie: true,
  },
  {
    id: 7,
    titre: "Stage intensif de pré-saison : le programme complet",
    categorie: 'Événements',
    image:
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=800&auto=format&fit=crop',
    auteur: 'Jean-Pierre Martin',
    date: '2024-10-01',
    extrait:
      "Du 10 au 24 août, nos jeunes joueurs s'entraîneront deux fois par jour autour du développement technique et de la cohésion d'équipe…",
    contenu: `
      <p>Du 10 au 24 août, nos jeunes joueurs s'entraîneront deux fois par jour autour du développement technique et de la cohésion d'équipe. Un programme complet, pensé pour préparer au mieux la nouvelle saison.</p>
      <p>Au menu de ce stage : travail de la conduite de balle et des passes, ateliers de finition, préparation physique et matchs amicaux contre des clubs de la région. La discipline et l'état d'esprit restent au cœur des priorités.</p>
      <p>Les familles sont invitées à une rencontre d'information la veille du début du stage pour découvrir les objectifs et le planning détaillé.</p>
      <p>Les inscriptions sont encore ouvertes pour les catégories U9, U15 et U17. Ne manquez pas cette occasion unique de progresser dans les meilleures conditions !</p>
    `,
    estPublie: true,
  },
  {
    id: 8,
    titre: 'La BFA signe un partenariat avec une école de football',
    categorie: 'Communiqués',
    image:
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=800&auto=format&fit=crop',
    auteur: 'Pierre Dubois',
    date: '2024-09-27',
    extrait:
      "Un accord de coopération a été conclu pour échanger les meilleures pratiques et offrir de nouvelles opportunités à nos jeunes talents…",
    contenu: `
      <p>Un accord de coopération a été conclu avec une école de football partenaire pour échanger les meilleures pratiques et offrir de nouvelles opportunités à nos jeunes talents.</p>
      <p>Ce partenariat prévoit des échanges réguliers de joueurs en détection, l'organisation de tournois conjoints et la mise en commun des programmes de formation pour les entraîneurs.</p>
      <p>Pour nos académiciens, c'est une chance unique d'élargir leur horizon et de se confronter à d'autres styles de jeu, dans un esprit d'ouverture et de partage.</p>
      <p>Les détails du calendrier des premiers échanges seront communiqués dans les prochaines semaines.</p>
    `,
    estPublie: true,
  },
  {
    id: 9,
    titre: 'Compte rendu : Coupe Régionale Junior (brouillon)',
    categorie: 'Matchs',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    auteur: 'Alexandre Petit',
    date: '2024-09-22',
    extrait:
      'Article en préparation : retour complet sur le parcours de nos équipes en Coupe Régionale Junior…',
    contenu: `
      <p>Article en préparation : retour complet sur le parcours de nos équipes en Coupe Régionale Junior. Les statistiques détaillées et les photos seront ajoutées prochainement.</p>
    `,
    estPublie: false,
  },
  {
    id: 10,
    titre: "Portrait de Yanis Nkoulou, l'ailier express",
    categorie: 'Portraits',
    image:
      'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=800&auto=format&fit=crop',
    auteur: 'Marie Lefèvre',
    date: '2024-09-18',
    extrait:
      "Ailier droit rapide et percutant, Yanis est l'une des révélations de la saison avec 11 buts et 7 passes décisives…",
    contenu: `
      <p>Ailier droit rapide et percutant, Yanis est l'une des révélations de la saison avec <strong>11 buts et 7 passes décisives</strong>. Portrait d'un joueur qui a su transformer sa vitesse naturelle en véritable arme tactique.</p>
      <p>Arrivé à la BFA après un essai concluant, Yanis a immédiatement séduit le staff par sa capacité à éliminer son vis-à-vis et à centrer avec précision.</p>
      <p>Son travail en dehors des terrains impressionne tout autant : rigueur, hygiène de vie et écoute des conseils des entraîneurs. Un exemple pour les plus jeunes.</p>
      <p>Prochain objectif pour Yanis : confirmer sur la durée et aider son équipe à décrocher le titre régional.</p>
    `,
    estPublie: true,
  },
  {
    id: 11,
    titre: 'Retour sur la journée de détection 2024',
    categorie: 'Événements',
    image:
      'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
    auteur: 'Alexandre Petit',
    date: '2024-09-12',
    extrait:
      'Plus de 200 jeunes talents ont répondu présent à notre journée de détection annuelle. Retour sur une journée intense et prometteuse…',
    contenu: `
      <p>Plus de <strong>200 jeunes talents</strong> ont répondu présent à notre journée de détection annuelle. Retour sur une journée intense et prometteuse pour l'avenir de l'académie.</p>
      <p>Toute la journée, les candidats ont enchaîné les exercices techniques, les situations de match et les tests physiques, sous le regard attentif de nos recruteurs.</p>
      <p>Une dizaine de joueurs particulièrement prometteurs ont été retenus pour intégrer les effectifs des catégories U9, U15 et U17 pour la saison à venir.</p>
      <p>Merci à tous les participants et aux familles pour leur confiance. Rendez-vous à la prochaine édition !</p>
    `,
    estPublie: true,
  },
  {
    id: 12,
    titre: 'Ouverture des inscriptions pour les essais 2026-2027',
    categorie: 'Communiqués',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    auteur: 'Jean-Pierre Martin',
    date: '2024-09-05',
    extrait:
      'Les inscriptions pour les essais 2026-2027 sont désormais ouvertes sur notre site. Les jeunes talents de toute la région sont attendus !',
    contenu: `
      <p>Les inscriptions pour les essais 2026-2027 sont désormais ouvertes sur notre site. Les jeunes talents de toute la région sont attendus !</p>
      <p>Le club organise ses détections annuelles dans les catégories U9, U15 et U17. Les candidats pourront s'inscrire directement en ligne, puis passer un jour de test sur le terrain.</p>
      <p>Les dates précises et les modalités seront communiquées prochainement sur cette page. Nous vous invitons à consulter régulièrement le site du club.</p>
    `,
    estPublie: false,
  },
]

/* ------------------- Résultats (page /resultats) -------------- */
export const results = [
  {
    id: 1,
    date: '2024-10-12',
    equipeA: 'BFA',
    equipeB: 'FCR',
    scoreA: 3,
    scoreB: 0,
    categorie: 'U17 A',
    type: 'Championnat',
  },
  {
    id: 2,
    date: '2024-10-12',
    equipeA: 'US Provins',
    equipeB: 'BFA',
    scoreA: 2,
    scoreB: 2,
    categorie: 'U15 Elite',
    type: 'Amical',
  },
  {
    id: 3,
    date: '2024-10-10',
    equipeA: 'BFA',
    equipeB: 'AS Villers',
    scoreA: 4,
    scoreB: 1,
    categorie: 'U17 A',
    type: 'Amical',
  },
  {
    id: 4,
    date: '2024-10-09',
    equipeA: 'BFA',
    equipeB: 'FC Regional',
    scoreA: 3,
    scoreB: 1,
    categorie: 'U15 Elite',
    type: 'Championnat',
  },
  {
    id: 5,
    date: '2024-10-09',
    equipeA: 'BFA',
    equipeB: 'US Provins',
    scoreA: 2,
    scoreB: 0,
    categorie: 'U17 A',
    type: 'Championnat',
  },
  {
    id: 6,
    date: '2024-10-07',
    equipeA: 'FC Regional',
    equipeB: 'BFA',
    scoreA: 1,
    scoreB: 1,
    categorie: 'U15 Elite',
    type: 'Amical',
  },
  {
    id: 7,
    date: '2024-10-05',
    equipeA: 'BFA',
    equipeB: 'Olympique Est',
    scoreA: 3,
    scoreB: 2,
    categorie: 'U17 A',
    type: 'Championnat',
  },
  {
    id: 8,
    date: '2024-10-04',
    equipeA: 'AS Villers',
    equipeB: 'BFA',
    scoreA: 0,
    scoreB: 5,
    categorie: 'U15 Elite',
    type: 'Amical',
  },
]

/* ---------------- Classements (page /resultats) --------------- */
/* NB : exporté sous le nom `classements` (et non `rankings`) car
   `rankings` existe déjà en haut de fichier avec une autre forme
   (utilisé par la section Classements de l'accueil). */
export const classements = {
  'U17 A': [
    {
      position: 1,
      equipe: 'BFA Academy',
      matchsJoues: 6,
      victoires: 5,
      nuls: 1,
      defaites: 0,
      points: 16,
    },
    {
      position: 2,
      equipe: 'FC Regional',
      matchsJoues: 6,
      victoires: 4,
      nuls: 1,
      defaites: 1,
      points: 13,
    },
    {
      position: 3,
      equipe: 'Olympique Est',
      matchsJoues: 6,
      victoires: 4,
      nuls: 0,
      defaites: 2,
      points: 12,
    },
    {
      position: 4,
      equipe: 'US Provins',
      matchsJoues: 6,
      victoires: 2,
      nuls: 2,
      defaites: 2,
      points: 8,
    },
    {
      position: 5,
      equipe: 'AS Villers',
      matchsJoues: 6,
      victoires: 1,
      nuls: 1,
      defaites: 4,
      points: 4,
    },
  ],
  'U15 Elite': [
    {
      position: 1,
      equipe: 'BFA Academy',
      matchsJoues: 5,
      victoires: 4,
      nuls: 1,
      defaites: 0,
      points: 13,
    },
    {
      position: 2,
      equipe: 'US Provins',
      matchsJoues: 5,
      victoires: 3,
      nuls: 1,
      defaites: 1,
      points: 10,
    },
    {
      position: 3,
      equipe: 'FC Regional',
      matchsJoues: 5,
      victoires: 2,
      nuls: 2,
      defaites: 1,
      points: 8,
    },
    {
      position: 4,
      equipe: 'AS Villers',
      matchsJoues: 5,
      victoires: 1,
      nuls: 0,
      defaites: 4,
      points: 3,
    },
    {
      position: 5,
      equipe: 'Olympique Est',
      matchsJoues: 5,
      victoires: 0,
      nuls: 2,
      defaites: 3,
      points: 2,
    },
  ],
}

/* ---------------------- Produits (boutique) ------------------- */
/* Catalogue de produits dérivés. Images : placeholders Unsplash
   (à remplacer par les vraies photos produits). Pas de paiement
   en ligne : chaque produit propose une demande de devis. */
export const products = [
  {
    id: 1,
    nom: 'T-Shirt Héritage',
    description:
      "T-shirt en coton bio avec logo brodé, coupe moderne et finitions soignées. Confortable et durable pour un usage quotidien.",
    prix: 35.0,
    image:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    estNouveau: true,
  },
  {
    id: 2,
    nom: 'Casquette Premium',
    description:
      "Casquette structurée 6 panneaux, fermeture réglable et finitions haut de gamme. Idéale pour un style sportif et élégant.",
    prix: 25.0,
    image:
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=800&auto=format&fit=crop',
    tailles: ['Unique'],
    categorie: 'Accessoires',
    estNouveau: true,
  },
  {
    id: 3,
    nom: 'Mug Isotherme',
    description:
      "Gardez vos boissons chaudes ou froides pendant des heures. Acier inoxydable, double paroi, design épuré aux couleurs du club.",
    prix: 28.0,
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    tailles: ['500ml'],
    categorie: 'Accessoires',
    estNouveau: false,
  },
  {
    id: 4,
    nom: 'Carnet Exécutif',
    description:
      "Carnet de notes A5 couverture rigide soft-touch, papier ivoire ligné. Parfait pour prendre des notes lors des réunions ou des formations.",
    prix: 18.0,
    image:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop',
    tailles: ['A5, 192 pages'],
    categorie: 'Accessoires',
    estNouveau: false,
  },
  {
    id: 5,
    nom: 'Survêtement Academy',
    description:
      "Survêtement technique en polyester respirant, avec zip intégral et poches zippées. Design aux couleurs de la BFA Academy.",
    prix: 65.0,
    image:
      'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=800&auto=format&fit=crop',
    tailles: ['XS', 'S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    estNouveau: true,
  },
  {
    id: 6,
    nom: 'Ballon Signature',
    description:
      "Ballon de football officiel de la BFA Academy. Cuir synthétique haute performance, taille 5, design exclusif.",
    prix: 45.0,
    image:
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
    tailles: ['Taille 5'],
    categorie: 'Accessoires',
    estNouveau: false,
  },
  {
    id: 7,
    nom: 'Polo Club',
    description:
      "Polo en piqué de coton, avec col et boutons, broderie du logo sur la poitrine. Élégance et confort au quotidien.",
    prix: 42.0,
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    estNouveau: false,
  },
  {
    id: 8,
    nom: 'Sac Sport',
    description:
      "Sac de sport spacieux avec compartiment pour chaussures. Poids plume et matériaux résistants pour un usage intensif.",
    prix: 38.0,
    image:
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=800&auto=format&fit=crop',
    tailles: ['Unique'],
    categorie: 'Accessoires',
    estNouveau: false,
  },
]

/* ------------------ Back-office (connexion) ----------------- */
export const adminCredentials = {
  email: 'admin@bfa-academy.com',
  motDePasse: 'Admin123!',
}

/* ------------------- Tableau de bord (admin) ---------------- */
export const dashboardStats = {
  players: { count: 142, change: '+12 ce mois-ci' },
  articles: { count: 38, change: '+4 cette semaine' },
  requests: { count: 24, change: '+2 la semaine dernière' },
  events: { count: 8, change: 'À venir ce mois-ci' },
  products: { count: 156, change: 'En stock' },
}

export const recentRequests = [
  {
    id: 1,
    name: 'Marcus Johnson',
    ageGroup: 'U15',
    dateApplied: '2024-10-24',
    status: 'Confirmé',
  },
  {
    id: 2,
    name: 'David Smith',
    ageGroup: 'U13',
    dateApplied: '2024-10-23',
    status: 'En attente',
  },
  {
    id: 3,
    name: 'Lucas Silva',
    ageGroup: 'U17',
    dateApplied: '2024-10-21',
    status: 'Refusé',
  },
  {
    id: 4,
    name: 'Ethan Williams',
    ageGroup: 'U15',
    dateApplied: '2024-10-20',
    status: 'Confirmé',
  },
]

export const quickActions = [
  { label: 'Ajouter un joueur', path: '/admin/players/add' },
  { label: 'Nouvel article', path: '/admin/blog/new' },
  { label: 'Créer un événement', path: '/admin/events/add' },
  { label: 'Ajouter un produit', path: '/admin/products/add' },
]

export const systemStatus = {
  database: { label: 'Base de données', status: 'En ligne' },
  backups: { label: 'Sauvegardes', status: 'À jour' },
  mailServer: { label: 'Serveur mail', status: 'En ligne' },
}

/* ------------------ Statuts joueurs (admin) ------------------ */
/* Statut d'effectif par joueur : Actif / MVP / Blessé. Les
   joueurs sans statut sont considérés « Actif ». */
export const playerStatuses = {
  1: 'Actif',
  2: 'Actif',
  3: 'Actif',
  4: 'MVP',
  5: 'Actif',
  6: 'Actif',
  7: 'Blessé',
  8: 'Actif',
  9: 'MVP',
  10: 'Actif',
  11: 'Actif',
  12: 'Blessé',
  13: 'Actif',
  14: 'Actif',
  15: 'Actif',
  16: 'MVP',
}

/* ------------ Demandes d'essai (admin) — liste détaillée ---------- */
/* Candidatures d'essai avec informations complètes (email, poste,
   motif de refus…). Servent à la page /admin/trials (export CSV,
   modale de détails). Le formulaire public écrit aussi ses
   enregistrements dans le localStorage (fusionnés par AdminTrials). */
export const trialRequests = [
  {
    id: 1,
    nom: 'Lucas Dupont',
    prenom: 'Lucas',
    email: 'lucas.d@email.com',
    telephone: '+33 6 12 34 56 78',
    age: 16,
    categorie: 'U17',
    poste: 'Milieu de terrain',
    dateEssai: '2024-10-15',
    dateSoumission: '2024-10-01',
    statut: 'En attente',
    message: "J'ai 5 ans d'expérience en club.",
  },
  {
    id: 2,
    nom: 'Maxime Leroy',
    prenom: 'Maxime',
    email: 'm.leroy99@email.com',
    telephone: '+33 6 98 76 54 32',
    age: 18,
    categorie: 'U17',
    poste: 'Attaquant',
    dateEssai: '2024-10-12',
    dateSoumission: '2024-09-28',
    statut: 'Confirmé',
    message: 'Joueur de niveau régional.',
  },
  {
    id: 3,
    nom: 'Thomas Martin',
    prenom: 'Thomas',
    email: 'thomas.m@email.com',
    telephone: '+33 6 45 67 89 01',
    age: 14,
    categorie: 'U15',
    poste: 'Défenseur',
    dateEssai: '2024-10-10',
    dateSoumission: '2024-09-25',
    statut: 'Refusé',
    motifRefus: 'Effectif déjà complet au poste de défenseur.',
    message: 'Disponible tous les mercredis.',
  },
  {
    id: 4,
    nom: 'Sophie Durand',
    prenom: 'Sophie',
    email: 'sophie.d@email.com',
    telephone: '+33 6 23 45 67 89',
    age: 15,
    categorie: 'U15',
    poste: 'Milieu offensif',
    dateEssai: '2024-10-18',
    dateSoumission: '2024-10-02',
    statut: 'En attente',
    message: '',
  },
  {
    id: 5,
    nom: 'Elias Diop',
    prenom: 'Elias',
    email: 'elias.d@email.com',
    telephone: '+33 6 78 90 12 34',
    age: 11,
    categorie: 'U9',
    poste: 'Attaquant',
    dateEssai: '2024-10-22',
    dateSoumission: '2024-10-05',
    statut: 'En attente',
    message: 'Très motivé !',
  },
  {
    id: 6,
    nom: 'Hugo Leroy',
    prenom: 'Hugo',
    email: 'hugo.l@email.com',
    telephone: '+33 6 56 78 90 12',
    age: 10,
    categorie: 'U9',
    poste: 'Défenseur',
    dateEssai: '2024-10-08',
    dateSoumission: '2024-09-30',
    statut: 'Confirmé',
    message: 'Déjà 2 ans de football.',
  },
  {
    id: 7,
    nom: 'Clara Dubois',
    prenom: 'Clara',
    email: 'clara.d@email.com',
    telephone: '+33 6 34 56 78 90',
    age: 17,
    categorie: 'U17',
    poste: 'Gardienne',
    dateEssai: '2024-10-25',
    dateSoumission: '2024-10-06',
    statut: 'En attente',
    message: '',
  },
  {
    id: 8,
    nom: 'Camille Roux',
    prenom: 'Camille',
    email: 'camille.roux@email.com',
    telephone: '+33 6 12 98 76 54',
    age: 13,
    categorie: 'U15',
    poste: 'Milieu central',
    dateEssai: '2024-10-28',
    dateSoumission: '2024-10-08',
    statut: 'Confirmé',
    message: 'Milieu relayeuse, très à l’aise techniquement.',
  },
  {
    id: 9,
    nom: 'Nathan Petit',
    prenom: 'Nathan',
    email: 'nathan.p@email.com',
    telephone: '+33 6 87 65 43 21',
    age: 16,
    categorie: 'U17',
    poste: 'Défenseur central',
    dateEssai: '2024-10-30',
    dateSoumission: '2024-10-10',
    statut: 'En attente',
    message: 'Postule pour intégrer le groupe U17.',
  },
  {
    id: 10,
    nom: 'Léa Morel',
    prenom: 'Léa',
    email: 'lea.morel@email.com',
    telephone: '+33 6 32 21 09 87',
    age: 9,
    categorie: 'U9',
    poste: 'Ailier',
    dateEssai: '2024-10-20',
    dateSoumission: '2024-10-03',
    statut: 'Refusé',
    motifRefus: 'Effectif complet pour cette catégorie.',
    message: 'Très rapide, adore le football.',
  },
]

/* ------------------- Stock produits (admin) ------------------ */
/* Quantité en stock par produit (indicateur boutique admin).
   Les produits sans stock sont considérés « Rupture ». */
export const productStock = {
  1: 12,
  2: 0,
  3: 25,
  4: 18,
  5: 3,
  6: 40,
  7: 0,
  8: 15,
}

/* ------------- Produits & devis (boutique back-office) -------- */
export const adminProducts = [
  {
    id: 1,
    nom: 'Maillot Officiel BFA',
    description: 'Maillot domicile officiel de la BFA Academy. Coupe standard, respirant.',
    prix: 45,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    stock: 45,
    estNouveau: false,
  },
  {
    id: 2,
    nom: "Ballon d'entraînement",
    description: 'Ballon de football taille 4, idéal pour les entraînements quotidiens.',
    prix: 25,
    image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=800&auto=format&fit=crop',
    tailles: ['Taille 4'],
    categorie: 'Équipement',
    stock: 12,
    estNouveau: false,
  },
  {
    id: 3,
    nom: 'Chaussettes Pro',
    description: 'Chaussettes de football professionnelles, renforcées au talon et à la pointe.',
    prix: 12,
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
    tailles: ['S', 'M', 'L'],
    categorie: 'Vêtements',
    stock: 0,
    estNouveau: false,
  },
  {
    id: 4,
    nom: 'Survêtement Academy',
    description: 'Survêtement technique avec fermeture éclair et poches zippées.',
    prix: 65,
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=800&auto=format&fit=crop',
    tailles: ['XS', 'S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    stock: 8,
    estNouveau: true,
  },
  {
    id: 5,
    nom: 'Sac Sport BFA',
    description: 'Sac de sport spacieux avec compartiment pour chaussures.',
    prix: 38,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    tailles: ['Unique'],
    categorie: 'Accessoires',
    stock: 15,
    estNouveau: false,
  },
  {
    id: 6,
    nom: 'Shorts de match',
    description: 'Short de match léger et résistant, coupe athlétique.',
    prix: 22,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    stock: 0,
    estNouveau: false,
  },
  {
    id: 7,
    nom: 'Ballon Match Officiel',
    description: 'Ballon homologué pour les rencontres officielles, taille 5.',
    prix: 32,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop',
    tailles: ['Taille 5'],
    categorie: 'Équipement',
    stock: 4,
    estNouveau: false,
  },
  {
    id: 8,
    nom: 'Casquette BFA',
    description: 'Casquette brodée au logo de l’académie, réglable à l’arrière.',
    prix: 15,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=800&auto=format&fit=crop',
    tailles: ['Unique'],
    categorie: 'Accessoires',
    stock: 0,
    estNouveau: false,
  },
  {
    id: 9,
    nom: 'Gants de gardien',
    description: 'Gants de gardien à coupe négative, excellente adhérence même sous la pluie.',
    prix: 28,
    image: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=800&auto=format&fit=crop',
    tailles: ['Taille 8', 'Taille 9', 'Taille 10'],
    categorie: 'Équipement',
    stock: 20,
    estNouveau: true,
  },
  {
    id: 10,
    nom: "T-shirt Entraînement",
    description: "T-shirt d'entraînement en tissu technique, respirant et léger.",
    prix: 18,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=800&auto=format&fit=crop',
    tailles: ['S', 'M', 'L', 'XL'],
    categorie: 'Vêtements',
    stock: 35,
    estNouveau: false,
  },
  {
    id: 11,
    nom: 'Brassard de capitaine',
    description: 'Brassard de capitaine ajustable, aux couleurs de la BFA.',
    prix: 9,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=800&auto=format&fit=crop',
    tailles: ['Unique'],
    categorie: 'Accessoires',
    stock: 60,
    estNouveau: false,
  },
  {
    id: 12,
    nom: 'Gourde BFA',
    description: 'Gourde isotherme 750 ml avec le logo de l’académie.',
    prix: 11,
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=800&auto=format&fit=crop',
    tailles: ['Unique'],
    categorie: 'Accessoires',
    stock: 6,
    estNouveau: false,
  },
]

export const adminQuotes = [
  {
    id: 1,
    nomComplet: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
    produit: 'Pack Complet U15',
    quantite: 20,
    taille: 'L',
    message: 'Bonjour, nous souhaiterions un devis pour 20 maillots et shorts pour notre équipe U15. Livraison à Lyon.',
    dateDemande: '2024-10-24T10:30:00',
    estTraite: false,
  },
  {
    id: 2,
    nomComplet: 'Marie Claire',
    email: 'marie.claire@email.com',
    telephone: '+33 6 98 76 54 32',
    produit: 'Ballons Club',
    quantite: 50,
    taille: 'Taille 4',
    message: "Demande de prix de gros pour 50 ballons d'entraînement taille 4. Pouvez-vous me faire un tarif ?",
    dateDemande: '2024-10-23T15:45:00',
    estTraite: false,
  },
  {
    id: 3,
    nomComplet: 'Thomas Martin',
    email: 'thomas.m@email.com',
    telephone: '+33 6 45 67 89 01',
    produit: 'Maillot Officiel BFA',
    quantite: 5,
    taille: 'M',
    message: 'Bonjour, je souhaiterais commander 5 maillots pour mon équipe. Merci.',
    dateDemande: '2024-10-22T09:15:00',
    estTraite: true,
  },
]
