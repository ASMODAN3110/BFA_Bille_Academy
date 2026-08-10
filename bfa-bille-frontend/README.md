# BFA Bille Football Academy — Site web

Site web de la **BFA Bille Football Academy** (académie de football amateur au Cameroun) : vitrine publique + back-office de gestion complet. L'interface est entièrement en français et respecte la charte graphique du club.

## Charte graphique

| Nom | Code | Usage |
| --- | --- | --- |
| `vert` | `#006400` | Couleur principale, liens, boutons |
| `dore` | `#D4AF37` | Accents, mises en avant, boutons secondaires |
| `clair` | `#F5F5F5` | Fonds de section, bordures |
| `sombre` | `#333333` | Textes |
| `blanc` | `#FFFFFF` | Fonds de cartes, sidebar admin |
| `erreur` | `#e53935` | Erreurs de formulaire |
| `succes` | `#4caf50` | Validations, succès |

Les couleurs sont définies via `@theme` dans [src/styles/index.css](src/styles/index.css) (Tailwind CSS v4).

## Stack technique

- **React 19** (starter Vite + TypeScript, mais tous les composants en **`.jsx`** — `allowJs: true`)
- **Vite 8** (build : `tsc -b && vite build`)
- **Tailwind CSS v4** (plugin `@tailwindcss/vite`, tokens de charte dans `@theme`)
- **React Compiler** activé (`babel-plugin-react-compiler`)
- **React Router v7** (`react-router-dom`)
- **Framer Motion** — animations au scroll (`src/hooks/useScrollAnimation.js`) et transitions
- **Font Awesome 7** (`@fortawesome/react-fontawesome`)

## Démarrage rapide

```bash
npm install        # installation des dépendances
npm run dev        # serveur de développement (HMR)
npm run build      # vérification TypeScript + build de production (dist/)
npm run preview    # prévisualisation du build
npm run lint       # ESLint
```

## Structure du projet

```
src/
├── assets/              # Images (logo, ballon…)
├── components/
│   ├── layout/          # Navbar, Footer, Breadcrumb
│   ├── ui/              # Composants réutilisables : Button, Card, Table, Badge,
│   │                    # Modal, ConfirmDialog, Pagination, Editor, FileUpload…
│   ├── auth/            # LoginCard, LoginForm
│   ├── admin/           # Composants back-office (par module)
│   ├── blog/ gallery/ players/ results/ team/ trial/ shop/ calendar/ home/
│   └── trial/           # FormInput, FormSelect, FormTextarea, FormStatus
├── contexts/AuthContext.jsx   # Authentification simulée (localStorage)
├── data/mockData.js     # Toutes les données de démonstration
├── hooks/               # useAuth, useScrollAnimation, useCalendar…
├── layouts/AdminLayout.jsx    # Layout du back-office (sidebar fixe + contenu)
├── pages/               # Pages publiques (Home, Players, Blog…) + AdminX
├── styles/index.css     # Charte @theme + styles globaux (.prose-blog, animations)
└── utils/               # dateUtils, validators
```

## Pages publiques

| Route | Page |
| --- | --- |
| `/` | Accueil |
| `/equipes` | Annuaire des joueurs (16 joueurs, filtres + recherche + fiche détail) |
| `/equipes/technique/:categorie` | Fiches techniques U9 / U15 / U17 (effectif, staff, objectifs, palmarès) |
| `/calendrier` | Calendrier interactif (grille mensuelle, filtres, détails d'événement) |
| `/essais` | Inscription aux essais (formulaire validé, soumission simulée) |
| `/galerie` | Galerie photos / vidéos (albums, lightbox, lecteur vidéo) |
| `/blog` + `/blog/:id` | Blog d'actualités (filtres par catégorie, pagination, article détaillé) |
| `/resultats` | Résultats & classements (U17 A, U15 Elite) |
| `/boutique` | Boutique de produits dérivés (filtres, demande de devis) |
| `/admin` | Connexion au back-office |

## Back-office

Accessible sur `/admin` puis `/admin/dashboard`. Une seule route protégée (`ProtectedRoute`) embarque les **9 modules** de gestion, tous en français, avec une **sidebar fixe** (menu mobile coulissant sur mobile/tablette) et un bouton **Déconnexion**.

> **Identifiants de démonstration :** `admin@bfa-academy.com` / `Admin123!` (session simulée stockée dans `localStorage` sous `bfa_admin_token`).

| Route | Module |
| --- | --- |
| `/admin/dashboard` | Tableau de bord (stats, demandes récentes, actions rapides, état du système) |
| `/admin/players` (+ `/admin/players/add`) | Équipes : liste, recherche, export CSV, création / modification / suppression |
| `/admin/calendar` (+ `/admin/events/add`) | Calendrier : grille mensuelle + tableau des événements, création / édition |
| `/admin/trials` | Essais : statistiques, filtres, validation / refus (motif obligatoire), export CSV |
| `/admin/gallery` | Galerie : albums, médias, upload (drag & drop, JPG/PNG/MP4/WEBM ≤ 10 Mo) |
| `/admin/blog` (+ `/admin/blog/new`) | Blog : stats, filtres Publiés/Brouillons, recherche, éditeur WYSIWYG |
| `/admin/results` | Résultats & classements : bilan, filtre par type, tableau des résultats |
| `/admin/shop` (+ `/admin/products/add`) | Boutique : inventaire, filtres catégorie + stock, badges de stock, demandes de devis (réponse par e-mail) |
| `/admin/settings` | Paramètres : profil administrateur, sauvegarde simulée |

Composants UI réutilisables du back-office : `ui/Table` (tableaux génériques), `ui/Badge` (statuts), `ui/Modal`, `ui/ConfirmDialog`, `ui/Pagination`, `ui/FileUpload`, `admin/PageHeader`, `admin/StatCard`.

## Données de démonstration

Toutes les données mock sont centralisées dans [src/data/mockData.js](src/data/mockData.js) : joueurs, événements, essais, albums, articles de blog, résultats/classements, produits, demandes de devis, statistiques du dashboard, etc. Les images sont des placeholders **Unsplash** — à remplacer par les visuels réels du club. Les soumissions de formulaires (essais, devis, sauvegarde admin) sont simulées ; les essais sont persistés dans `localStorage`.

## Notes techniques

- **Composants `.jsx`** : le starter est TypeScript, mais les composants sont en `.jsx` (règle projet). `allowJs: true` est activé dans `tsconfig.app.json` pour que `tsc -b` passe sur le projet mixte.
- **React Compiler** : la mémoïsation est automatique. Piège connu — ne jamais lire la propriété d'un objet possiblement null (`toDelete?.id`, `selectedProduct?.id`…) au premier niveau d'un handler : la lire uniquement à l'intérieur des callbacks `setState`.
- **Tailwind v4** : la configuration passe par le fichier CSS (`@theme` dans `src/styles/index.css`), pas de `tailwind.config.js`.
- **Zones horaires** : les dates sont parsées localement (`src/utils/dateUtils.js`) pour éviter les décalages de fuseau sur les événements du calendrier.

## À venir

- Remplacement des images Unsplash et des vidéos par les médias réels du club
- Branchement d'une véritable API (authentification, CRUD, upload) à la place des données simulées
