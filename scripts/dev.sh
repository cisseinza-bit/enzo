#!/usr/bin/env bash
# Démarre toute la stack Coach Perte de Poids en local : backend + frontend.
# Usage : bash scripts/dev.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ Coach Perte de Poids — démarrage local"

# --- Pré-requis ---
command -v node >/dev/null || { echo "✗ Node introuvable (Node 20+ requis)"; exit 1; }

# --- Backend ---
if [ ! -d server/node_modules ]; then
  echo "▶ Installation des dépendances backend…"
  (cd server && npm install)
fi
if [ ! -f server/.env ]; then
  echo "▶ Création de server/.env depuis .env.example"
  cp server/.env.example server/.env
  echo "  ⚠ Pense à renseigner ANTHROPIC_API_KEY / STRIPE_* pour le mode live."
fi

echo "▶ Migration de la base (server/.env → DATABASE_URL)…"
(cd server && npm run migrate) || {
  echo "✗ Migration échouée. PostgreSQL est-il démarré et la base 'coach' créée ?"
  echo "  Exemple : createdb coach   (ou voir server/README.md)"
  exit 1
}

echo "▶ Lancement de l'API (port 3001)…"
(cd server && npm run dev) &
API_PID=$!

# --- Frontend ---
if [ ! -d node_modules ]; then
  echo "▶ Installation des dépendances frontend…"
  npm install
fi

echo "▶ Lancement de la PWA (port 5173)…"
npm run dev &
WEB_PID=$!

trap 'echo; echo "▶ Arrêt…"; kill $API_PID $WEB_PID 2>/dev/null || true' INT TERM EXIT

echo ""
echo "✅ Tout est lancé :"
echo "   • PWA      → http://localhost:5173"
echo "   • API      → http://localhost:3001/api/health"
echo "   (Ctrl+C pour tout arrêter)"
echo ""
wait
