# Coach Perte de Poids — Guide de test local

PWA de coaching minceur + API Node/PostgreSQL. Ce guide te fait tourner
l'app sur **ta machine** pour la tester dans ton navigateur.

> Programme de bien-être et de rééquilibrage alimentaire. Aucune promesse
> médicale, aucune perte de poids chiffrée garantie.

## Pré-requis

- **Node 20+** (développé sous Node 22)
- **PostgreSQL 14+** (base `coach`)
- Git

## Démarrage rapide (une commande)

```bash
git clone https://github.com/cisseinza-bit/enzo.git
cd enzo
git checkout claude/sweet-maxwell-dJMHK

# Créer la base (une seule fois)
createdb coach
# ou : psql -c "CREATE ROLE coach LOGIN PASSWORD 'coach';" -c "CREATE DATABASE coach OWNER coach;"

# Tout lancer (installe les deps, migre la base, démarre API + PWA)
bash scripts/dev.sh
```

Puis ouvre **http://localhost:5173** dans ton navigateur (idéalement en mode
mobile dans les DevTools — l'app est en 390px).

> Si `DATABASE_URL` doit pointer ailleurs que `postgres://coach:coach@127.0.0.1:5432/coach`,
> édite `server/.env` avant de lancer.

## Démarrage manuel (si tu préfères 2 terminaux)

```bash
# Terminal 1 — API
cd server
npm install
cp .env.example .env
npm run migrate
npm run dev            # http://localhost:3001

# Terminal 2 — PWA
npm install
npm run dev            # http://localhost:5173
```

## Que tester ?

L'app marche **sans aucune clé** (mode démonstration) :

1. **Onboarding** — « Commencer », choisis prénom / objectif / profil culturel /
   budget / mesures. À l'étape compte, **laisse l'email vide** pour le mode démo,
   ou renseigne email + mot de passe pour créer un vrai compte (sauvegardé en base).
2. **Dashboard** — streak, anneau de progression, checklist du jour, repas.
3. **Programme** — onglets Semaine / Courses (chiffrées) / Batch cooking.
4. **Sport** — timer corde à sauter fonctionnel (Démarrer → séries + repos).
5. **Suivi** — courbe de poids, saisie d'une pesée, **bilan mensuel**
   (mensurations + photos + comparaison M vs M-1).
6. **Découverte** — pyramide pédagogique, concepts, calories invisibles, recettes.
7. **Abonnement** — le bouton « Débloquer » mène au paywall (39/97/297€).
8. **Compte** — bascule démo Premium/Limité pour voir le verrouillage psychologique.

## Activer les fonctions "live" (optionnel)

Dans `server/.env` :

| Variable | Effet une fois renseignée |
|---|---|
| `ANTHROPIC_API_KEY` | Génération réelle des programmes par l'IA (sinon : générateur déterministe). Modèle par défaut `claude-sonnet-4-6`. |
| `STRIPE_SECRET_KEY` + `STRIPE_PRICE_*` + `STRIPE_WEBHOOK_SECRET` | Vrai paiement Stripe (sinon : déverrouillage démo). Crée les 3 prix (39/97/297€) dans ton dashboard Stripe, puis `stripe listen --forward-to localhost:3001/api/webhook/stripe`. |

Le code détecte les clés et bascule automatiquement (voir `GET /api/health`).

## Les vraies photos

Le système de photos est câblé sur `public/img/`. Des placeholders dark/lime
occupent la place. Dépose les vraies images sous les mêmes noms pour les activer :
`hero-rope.png`, `meal-bowl.png`, `meal-burger.png`, `checker-shake.png`
(URLs sources notées dans `src/data/images.js`). Zéro code à toucher.

## Dépannage

- **`migration échouée`** → PostgreSQL n'est pas démarré, ou la base `coach`
  n'existe pas, ou `DATABASE_URL` est faux. Vérifie `server/.env`.
- **PWA OK mais données qui ne se sauvegardent pas** → c'est le mode démo
  (pas de compte). Crée un compte à l'onboarding pour persister en base.
- **Port déjà utilisé** → un autre process tourne sur 3001/5173 ; arrête-le.

## Architecture

- `src/` — PWA React + Vite + Tailwind (design Athletic, Framer Motion, Lucide)
- `server/` — API Express + PostgreSQL + JWT (voir `server/README.md`)
- `scripts/` — outillage (démarrage, captures d'écran Playwright)
