# Coach Perte de Poids — API

Backend de la PWA : **Express + PostgreSQL + JWT**, génération de programme
**déterministe** par défaut (bascule automatique sur l'**API Anthropic** si une
clé est configurée), abonnements **Stripe** activables par clé.

## Démarrer

```bash
cd server
npm install
cp .env.example .env        # ajuster DATABASE_URL, JWT_SECRET…
npm run migrate             # applique src/db/schema.sql (idempotent)
npm run dev                 # serveur sur http://localhost:3001 (--watch)
```

Pré-requis : une base PostgreSQL accessible. En local :

```bash
createdb coach   # ou via psql : CREATE DATABASE coach OWNER coach;
```

## Configuration (.env)

| Variable | Rôle | Défaut / effet si absent |
|----------|------|--------------------------|
| `DATABASE_URL` | Connexion Postgres | `postgres://coach:coach@127.0.0.1:5432/coach` |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Signature des tokens | secret dev / `30d` |
| `ANTHROPIC_API_KEY` | Génération IA réelle | **absent → générateur déterministe** |
| `ANTHROPIC_MODEL` | Modèle | `claude-sonnet-4-20250514` |
| `STRIPE_SECRET_KEY` + `STRIPE_PRICE_*` | Paiement | **absent → checkout renvoie 503** |
| `STRIPE_WEBHOOK_SECRET` | Vérif webhook | absent → webhook 503 |
| `CORS_ORIGIN` | Origine front autorisée | `http://localhost:5173` |

> Le serveur démarre et fonctionne **sans aucune clé** : génération déterministe,
> paiement remplacé par une route `dev-unlock` (hors production).

## Endpoints

### Auth
- `POST /api/auth/register` — `{ email, password, firstName, profile }` → `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`

### Utilisateur (Bearer token)
- `GET /api/me` — profil complet (user + profile + subscription)
- `PUT /api/me/profile` — met à jour objectif / profil culturel / budget / mesures

### Programmes (Bearer token)
- `GET /api/programs` — liste des semaines générées
- `GET /api/programs/:week` — programme de la semaine (généré + persisté si absent)
- `POST /api/programs/:week/regenerate` — force une nouvelle génération

### Suivi (Bearer token)
- `GET|POST /api/tracking/weigh-ins` — pesées
- `GET|POST /api/tracking/tasks` — tâches quotidiennes cochées
- `GET|POST /api/tracking/measurements` — mensurations + photos mensuelles

### Billing
- `GET /api/billing/plans` — public : tarifs 39 / 97 / 297 €
- `POST /api/billing/checkout` — `{ plan }` → session Stripe (ou 503 si non configuré)
- `POST /api/billing/dev-unlock` — DEV : passe en `premium` sans Stripe
- `POST /api/webhook/stripe` — webhook Stripe (body brut)

### Santé
- `GET /api/health` — `{ ok, anthropic, stripe }`

## Schéma de données

`users`, `profiles`, `programs` (JSONB), `weigh_ins`, `task_logs`,
`measurements`, `subscriptions`. Voir `src/db/schema.sql`.

## Génération de programme

`src/services/programGenerator.js` :
1. clé Anthropic présente → appel via le **SDK officiel** (`@anthropic-ai/sdk`,
   `messages.parse()`) avec :
   - **sorties structurées** (`output_config.format` + JSON Schema) → réponse
     garantie valide, sans parsing de texte ;
   - **prompt caching** sur le system prompt stable (indépendant du profil) →
     coût réduit sur les nombreuses générations hebdomadaires ;
   - le profil culturel (maghrébin / subsaharien / européen / mixte), l'objectif,
     le budget et la phase passent dans le message utilisateur (non caché).
2. sinon (ou en cas d'échec API) → repli **déterministe** sur les banques de
   repas par profil culturel (`programData.js`), rotation stable par semaine/jour.

Modèle par défaut : `claude-sonnet-4-6` (surchargeable via `ANTHROPIC_MODEL`).
Les programmes sont mis en cache en base (`programs.data` JSONB) par
`(user_id, week_number)`.

> Testé en local : avec une clé valide, le SDK appelle l'API et renvoie un
> programme structuré ; sans clé (ou clé invalide), repli déterministe propre
> en ~200 ms, sans interruption de service.

## Sécurité

- Mots de passe hachés via **scrypt** (intégré à Node, sans dépendance native).
- JWT Bearer, vérifié par `requireAuth`.
- Webhook Stripe vérifié par signature (`constructEvent`).
