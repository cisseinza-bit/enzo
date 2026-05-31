-- Schéma de la base Coach Perte de Poids
-- Idempotent : peut être rejoué sans casse.

CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name    TEXT NOT NULL DEFAULT '',
  -- 'locked' = accès PDF 17€ verrouillé · 'premium' = abonné
  tier          TEXT NOT NULL DEFAULT 'locked',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id      BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  goal         TEXT NOT NULL DEFAULT 'perte',
  food_profile TEXT NOT NULL DEFAULT 'europeen',
  budget       TEXT NOT NULL DEFAULT 'equilibre',
  start_weight NUMERIC(5,1),
  height       INTEGER,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un programme hebdomadaire généré (contenu complet en JSONB).
CREATE TABLE IF NOT EXISTS programs (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  phase       TEXT NOT NULL,
  source      TEXT NOT NULL DEFAULT 'deterministic', -- 'deterministic' | 'anthropic'
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_number)
);

-- Pesées du suivi corporel.
CREATE TABLE IF NOT EXISTS weigh_ins (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight      NUMERIC(5,1) NOT NULL,
  recorded_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, recorded_on)
);

-- Tâches quotidiennes cochées (corde, checker, eau…).
CREATE TABLE IF NOT EXISTS task_logs (
  id        BIGSERIAL PRIMARY KEY,
  user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day       DATE NOT NULL,
  task_key  TEXT NOT NULL,
  done      BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (user_id, day, task_key)
);

-- Mensurations mensuelles + photos (URLs/refs en JSONB).
CREATE TABLE IF NOT EXISTS measurements (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recorded_on DATE NOT NULL DEFAULT CURRENT_DATE,
  waist       NUMERIC(5,1),
  hips        NUMERIC(5,1),
  thighs      NUMERIC(5,1),
  arms        NUMERIC(5,1),
  photos      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Abonnements Stripe.
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id            BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_sub_id      TEXT,
  status             TEXT NOT NULL DEFAULT 'inactive',
  plan               TEXT,
  current_period_end TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_weigh_ins_user ON weigh_ins(user_id, recorded_on);
CREATE INDEX IF NOT EXISTS idx_task_logs_user_day ON task_logs(user_id, day);
CREATE INDEX IF NOT EXISTS idx_programs_user ON programs(user_id, week_number);
