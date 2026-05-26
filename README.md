# CVForge 2.0

Générateur de CV premium avec éditeur visuel en temps réel, **20 modèles**, fonctionnalités **IA**, vues multi-format et **partage par lien**. Projet modulaire conçu pour être intégré dans une application Next.js existante (sans base de données propre pour l’instant).

## Prérequis

- [Node.js](https://nodejs.org/) 20 ou plus récent
- npm (fourni avec Node.js)

## Installation

```bash
git clone https://github.com/Kotazo2026/cvforge.git
cd cvforge
npm install
cp .env.example .env.local
```

## Lancer l’application

```bash
npm run dev
```

Ou, pour repartir sur un port propre et un cache `.next` vidé :

```bash
npm run dev:fresh
```

Ouvrez [http://localhost:3000/editor](http://localhost:3000/editor). La page d’accueil redirige vers l’éditeur.

## Fonctionnalités v2

### Éditeur

| Zone | Contenu |
|------|---------|
| **Barre latérale** | Modèles (recherche), Informations, Mise en page avancée, Sections (drag & drop), panneau IA |
| **Barre supérieure** | Titre du CV, langue, Fonctionnalités IA, Partager, export PDF |
| **Centre** | Aperçu A4, zoom, onglets **Vue CV / Mobile / LinkedIn** |
| **Panneau droit** | Progression intelligente (complétude, qualité, ATS) |

Les modifications sont **persistées dans le navigateur** (`localStorage` via Zustand).

### Modèles (20)

Classic, Modern, Minimal, Creative, Executive, Elegant, Tech, Academic, Nova, Slate, Coral, Obsidian, Sage, Ivory, Prism, Loft, Atlas, Ember, Frost, Dusk.

Chaque modèle respecte le format A4 (794×1123 px), les variables CSS du thème et l’impression PDF.

### IA (optionnelle)

Sans clé API, les fonctionnalités utilisent des **moteurs locaux** (analyse heuristique).

Avec une clé Anthropic (`ANTHROPIC_API_KEY` dans `.env.local`, **côté serveur uniquement**) :

- **Pré-remplir** — adapter titre, accroche et expériences à une offre
- **Score ATS** — score /100, mots-clés, recommandations
- **Conseils** — tips + reformulations (icône ampoule sur les champs)
- **Correction** — grammaire / orthographe avec surlignage
- **Traduction** — copie dans EN, ES, DE, IT, AR, PT, ZH sans écraser l’original
- **Assistant chat** — bouton flottant, contexte CV, patches applicables

### Partage

1. **Partager** dans la barre supérieure → générer un lien
2. Le lien ouvre `/share/[token]` en **lecture seule** (vue recruteur)
3. **Créer ma version** duplique le CV dans l’éditeur

Les liens expirent au bout de **30 jours**. Le stockage est **en mémoire serveur** (adapté à la démo ; en production, brancher une base ou un KV).

## Variables d’environnement

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Clé API Anthropic (serveur). Si absente, fallback local pour l’IA. |

Ne jamais exposer la clé via `NEXT_PUBLIC_*`.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run dev:fresh` | Port 3000 libre + cache `.next` supprimé |
| `npm run build` | Build de production |
| `npm run start` | Serveur production (après `build`) |
| `npm run lint` | ESLint (0 warning) |
| `npm run test` | Tests Vitest |
| `npm run format` | Prettier |

## Structure du projet

```
src/
├── app/
│   ├── editor/              # Éditeur principal
│   ├── share/[token]/       # Vue partagée lecture seule
│   └── api/
│       ├── ai/              # Pré-remplir, ATS, conseils, grammaire, traduction, chat
│       └── share/           # Création / lecture des liens
├── components/
│   ├── shell/               # Layout v2 (TopBar, sidebars, aperçu)
│   ├── ai/                  # Modale IA, chat, panneaux
│   ├── share/               # Partage et vue recruteur
│   ├── editor/              # Formulaires, drag & drop
│   ├── preview/             # Aperçu A4, mobile, LinkedIn, templates
│   ├── toolbar/             # Export PDF, miniatures
│   └── ui/
├── config/cv-templates.ts   # Catalogue des 20 modèles
├── lib/ai/                  # Moteurs locaux + services Anthropic
├── lib/share/               # Stockage partage (mémoire)
├── store/                   # Zustand (CV, UI, chat)
├── types/                   # TypeScript
├── schemas/                 # Zod
└── utils/                   # Helpers, export, progression
```

## Stack

- **Next.js 15** (App Router) · **React 19** · TypeScript strict · **Tailwind CSS 3**
- Zustand (persist + immer) · Zod · @dnd-kit · react-to-print · lucide-react

## Branches

- `main` — fondations (blocs 1–10)
- `feature/v2-redesign` — refonte v2 (blocs 11–20)

## Licence

Projet open source — voir le dépôt [GitHub](https://github.com/Kotazo2026/cvforge).
