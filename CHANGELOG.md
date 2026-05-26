# Changelog

## [2.0.0] — 2026-05-26

Refonte majeure (`feature/v2-redesign`) : éditeur type CVDesignR, 20 modèles, IA et innovations exclusives.

### Interface

- Shell v2 : barre latérale (Modèles, Informations, Mise en page, Sections, IA), barre supérieure, panneau droit
- Panneau **Mise en page** avancé (couleurs, typographie, marges, timeline, format de dates)
- **Progression intelligente** (complétude, qualité, ATS)
- Vues **Mobile** et **LinkedIn** en live

### Modèles

- 12 nouveaux templates : Nova, Slate, Coral, Obsidian, Sage, Ivory, Prism, Loft, Atlas, Ember, Frost, Dusk (20 au total)

### IA

- Pré-remplir depuis une offre d’emploi (diff + accepter / ignorer)
- Score ATS avec jauge et recommandations
- Conseils inline (ampoule sur les champs)
- Correction grammaticale avec surlignage
- Traduction multi-langues (copie séparée, bascule Original / traduction)
- Assistant conversationnel flottant avec propositions de patch
- API Anthropic optionnelle (`ANTHROPIC_API_KEY`) ou moteurs locaux

### Collaboration

- Partage par lien (lecture seule, 30 jours, stockage serveur en mémoire)
- Page `/share/[token]` et bouton **Créer ma version**

### Technique

- Routes `POST /api/share`, `GET /api/share/[token]`
- Chargement différé de l’éditeur et des modules IA lourds
- `optimizePackageImports` pour `lucide-react`
- README v2, `.env.example` enrichi

## [0.1.0] — Fondations (blocs 1–10)

- Éditeur live, 8 templates, export PDF, Zustand persist, drag & drop
