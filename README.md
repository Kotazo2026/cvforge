# CVForge

Générateur de CV premium avec éditeur visuel en temps réel, 8 modèles et export PDF. Projet modulaire conçu pour être intégré dans une application Next.js existante.

## Prérequis

- [Node.js](https://nodejs.org/) 20 ou plus récent
- npm (fourni avec Node.js)

## Installation

```bash
git clone https://github.com/Kotazo2026/cvforge.git
cd cvforge
npm install
```

## Lancer l'application

```bash
npm run dev
```

Ouvrez l'URL affichée dans le terminal (souvent [http://localhost:3000/editor](http://localhost:3000/editor)).

La page d'accueil redirige automatiquement vers l'éditeur.

## Utilisation

1. Renseignez vos **informations personnelles** dans le panneau de gauche.
2. Modifiez les **sections** (expériences, formation, compétences…), réordonnez-les par glisser-déposer.
3. Choisissez un **modèle**, une **palette de couleurs** et la **taille du texte** dans la barre d'outils.
4. Consultez l'**aperçu live** à droite (zoom réglable).
5. Cliquez sur **Télécharger PDF** et enregistrez via la fenêtre d'impression du navigateur.

Vos modifications sont **sauvegardées automatiquement** dans le navigateur (`localStorage`). Un rechargement de page conserve votre CV.

Sur un écran de moins de 1024 px de large, utilisez les onglets **Éditer** / **Aperçu** pour basculer entre les panneaux.

## Scripts

| Commande          | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Serveur de développement       |
| `npm run build`   | Build de production            |
| `npm run start`   | Serveur production (après build) |
| `npm run lint`    | Vérification ESLint            |
| `npm run test`    | Tests unitaires (Vitest)       |
| `npm run format`  | Formatage Prettier             |

## Structure du projet

```
src/
├── app/editor/          # Page principale de l'éditeur
├── components/
│   ├── editor/          # Formulaires et sections (drag & drop)
│   ├── preview/         # Aperçu et templates CV (CSS Modules)
│   ├── toolbar/         # Barre d'outils
│   └── ui/              # Composants UI réutilisables
├── store/cv.store.ts    # État global (Zustand + persist)
├── types/               # Types TypeScript
├── schemas/             # Validation Zod
└── utils/               # Helpers et export PDF
```

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS 3
- Zustand · Zod · @dnd-kit · react-to-print · lucide-react

## Licence

Projet open source — voir le dépôt GitHub pour les détails.
