# Coach Perte de Poids — PWA

Application de coaching minceur personnalisé. PWA installable, mobile-first.

> **Tu ne réfléchis pas. Tu suis. Tu progresses.**

> Programme de bien-être et rééquilibrage alimentaire. Consultez un professionnel
> de santé avant tout changement alimentaire important. Aucune promesse médicale,
> aucune perte de poids chiffrée garantie.

## Stack

- **React 18** + **React Router** + **Vite**
- **Tailwind CSS** (design system custom)
- **vite-plugin-pwa** (manifest + service worker, installable hors-ligne)
- État local persisté en `localStorage` (pas encore de backend)

## Démarrer

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de prod dans dist/
npm run preview  # prévisualiser le build
```

> Astuce : ouvrir dans Chrome mobile / DevTools en mode mobile, puis
> « Ajouter à l'écran d'accueil » pour tester l'installation PWA.

## Design system (non négociable)

| Rôle        | Couleur    |
|-------------|------------|
| Fond        | `#0A0A0A`  |
| Cartes      | `#141414`  |
| Accent vert | `#C8F135`  |
| Accent orange | `#FF6B35` |
| Texte       | `#FFFFFF`  |

Largeur app forcée à **390px**, centrée, fond noir partout. Style Nike Training
Club + Duolingo. Zéro beige, zéro blanc, zéro gris clair.

## Écrans implémentés

1. **Splash** — accroche + entrée tunnel
2. **Onboarding** (6 étapes) — prénom, objectif, profil alimentaire, budget, mesures, récap
3. **Génération** — animation de création du programme
4. **Accueil** — streak 🔥, anneau du jour, checklist quotidienne, repas, offre limitée
5. **Programme** — onglets Semaine / Courses (chiffrées) / Batch cooking
6. **Sport** — timer corde à sauter (séries + repos, par semaine)
7. **Suivi** — courbe de poids, saisie pesée, message contextuel, bilan mensuel
8. **Découverte** — pyramide pédagogique, concepts, calories invisibles, recettes, communauté

## Mécaniques produit en place

- **Streak quotidien** avec flamme animée
- **Micro-récompenses** (pop animé à chaque action complétée)
- **Anneaux de progression** (chiffres concrets, pas des %)
- **Verrouillage psychologique** (`LockOverlay`) — contenus floutés + cadenas pour le tier `locked` (PDF 17€)
- **Offres à durée limitée** (`OfferBanner`) avec countdown, rotation hebdo (modèle Higgsfield)

## Structure

```
src/
  data/program.js        # données mockées (profil Européen, budget Équilibré, phase 1)
  context/AppContext.jsx # état global + persistance localStorage
  components/            # BottomNav, ProgressRing, LockOverlay, OfferBanner, Reward…
  screens/               # un fichier par écran
scripts/gen-icons.mjs    # génère les icônes PWA (sans dépendance)
```

## Backend

L'API vit dans [`server/`](./server) — **Express + PostgreSQL + JWT**.
Voir [`server/README.md`](./server/README.md). Elle tourne **sans aucune clé**
(génération de programme déterministe), et bascule automatiquement sur l'**API
Anthropic** et **Stripe** dès que les clés sont fournies.

```bash
cd server && npm install && cp .env.example .env && npm run migrate && npm run dev
```

Le front se connecte via `src/api/client.js` (base configurable avec
`VITE_API_URL`, cf. `.env.example`).

## Prochaines étapes

- Câbler les écrans front sur l'API (remplacer le state mock par les appels réels)
- Génération réelle du programme via Anthropic API (clé à fournir)
- Stripe live (abonnements 39€/mois · 97€/trim · 297€/an) + webhook
- Notifications push (Checker 9h45/15h45, programme du vendredi 18h)
- Écran bilan mensuel (saisie mensurations + photos)
