# BFA Bille Football Academy — Frontend

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

> Le frontend consomme une API backend dont l'URL est configurée via `VITE_API_URL` (défaut : `http://localhost:4000`). Voir le README backend pour le démarrage de l'API.

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
├── config/site.js       # Config du site (navigation, contact, réseaux, devise)
├── contexts/AuthContext.jsx   # Authentification (session JWT)
├── hooks/               # useAuth, useScrollAnimation, useCalendar…
├── layouts/AdminLayout.jsx    # Layout du back-office (sidebar fixe + contenu)
├── pages/               # Pages publiques (Home, Players, Blog…) + AdminX
├── styles/index.css     # Charte @theme + styles globaux (.prose-blog, animations)
└── utils/               # api.js (client HTTP), dateUtils, validators
```

## Pages publiques

| Route | Page |
| --- | --- |
| `/` | Accueil |
| `/equipes` | Annuaire des joueurs (filtres + recherche + fiche détail) |
| `/equipes/technique/:categorie` | Fiches techniques U9 / U15 / U17 (effectif, staff, objectifs, palmarès) |
| `/calendrier` | Calendrier interactif (grille mensuelle, filtres, détails d'événement) |
| `/essais` | Inscription aux essais (formulaire validé, soumission à l'API) |
| `/galerie` | Galerie photos / vidéos (albums, lightbox, lecteur vidéo) |
| `/blog` + `/blog/:id` | Blog d'actualités (filtres par catégorie, pagination, article détaillé) |
| `/resultats` | Résultats & classements (U17 A, U15 Elite) |
| `/boutique` | Boutique de produits dérivés (filtres, demande de devis) |
| `/admin` | Connexion au back-office |

## Back-office

Accessible sur `/admin` puis `/admin/dashboard`. Une route protégée (`ProtectedRoute`) embarque les **9 modules** de gestion, tous en français, avec une **sidebar fixe** (menu mobile coulissant sur mobile/tablettes) et un bouton **Déconnexion**.

L'authentification est **réelle** : le frontend envoie les identifiants à `POST /api/auth/login`, reçoit un token JWT et le stocke dans `localStorage` (`bfa_admin_token`). Les requêtes authentifiées passent par `src/utils/api.js` qui injecte le header `Authorization: Bearer <token>` et purge la session en cas de 401.

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
| `/admin/settings` | Paramètres : profil administrateur, changement de mot de passe |

Composants UI réutilisables du back-office : `ui/Table` (tableaux génériques), `ui/Badge` (statuts), `ui/Modal`, `ui/ConfirmDialog`, `ui/Pagination`, `ui/FileUpload`, `admin/PageHeader`, `admin/StatCard`, `admin/QuickActions`.

## Connexion à l'API

Le client HTTP est centralisé dans [src/utils/api.js](src/utils/api.js) :

- Lit `VITE_API_URL` (défaut `http://localhost:4000`)
- Injecte automatiquement `Authorization: Bearer <token>` pour les routes authentifiées
- Gère les erreurs réseau, les 401 (déconnexion + redirection `/admin`) et les réponses non-JSON
- Masque le token JWT dans les erreurs affichées

## Données

Les modules **Joueurs** et **Calendrier** (public + back-office) sont branchés sur l'API backend. Les autres modules (galerie, blog, boutique, résultats, équipes…) démarrent en **état vide** et seront branchés à leur tour. L'identité du site (navigation, contact, réseaux sociaux, devise du club) est centralisée dans `src/config/site.js`. Les images restent des placeholders à remplacer par les visuels réels du club.

## Notes techniques

- **Composants `.jsx`** : le starter est TypeScript, mais les composants sont en `.jsx` (règle projet). `allowJs: true` est activé dans `tsconfig.app.json` pour que `tsc -b` passe sur le projet mixte.
- **React Compiler** : la mémoïsation est automatique. Piège connu — ne jamais lire la propriété d'un objet possiblement null (`toDelete?.id`, `selectedProduct?.id`…) au premier niveau d'un handler : la lire uniquement à l'intérieur des callbacks `setState`.
- **Tailwind v4** : la configuration passe par le fichier CSS (`@theme` dans `src/styles/index.css`), pas de `tailwind.config.js`.
- **Zones horaires** : les dates sont parsées localement (`src/utils/dateUtils.js`) pour éviter les décalages de fuseau sur les événements du calendrier.
- **Boutons** : le composant partagé `ui/Button` centralise le style (arrondi `rounded-lg`, effet glare). Il rend un `<a>` (React Router `<Link>`) si `to` est fourni, un `<a>` natif si `href` est fourni, sinon un `<button>`.

## À venir

- Branchement des modules restants (galerie, blog, boutique, résultats, fiches techniques) sur l'API backend
- Remplacement des images Unsplash et des vidéos par les médias réels du club
