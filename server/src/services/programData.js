// Briques de contenu côté serveur, indexées par profil culturel.
// Sert de base au générateur déterministe et de contexte au prompt Anthropic.

export const PHASES = {
  1: { name: 'Phase 1 — Reset', note: 'Konjac 80% + légumineuses 20%. On nettoie, on dégonfle.' },
  2: { name: 'Phase 1 — Reset', note: 'On consolide les réflexes : konjac, protéines, hydratation.' },
  3: { name: 'Phase 2 — Activation', note: 'Konjac 50% + riz basmati 50%. Marche à jeun, anti-inflammatoire renforcé.' },
  4: { name: 'Phase 2 — Activation', note: 'On installe la combustion : intensité corde + élastiques.' },
}
export const phaseFor = (week) => PHASES[week] || PHASES[4]

// Banques de repas par profil culturel.
export const MEALS = {
  europeen: {
    breakfast: [
      { name: 'Skyr + flocons + myrtilles', kcal: 280 },
      { name: 'Omelette 3 œufs + épinards', kcal: 300 },
      { name: 'Yaourt grec 0% + baie miracle', kcal: 180 },
      { name: 'Pancakes flocons + skyr', kcal: 330 },
    ],
    lunch: [
      { name: 'Konjac sauce bolognaise dinde', kcal: 360 },
      { name: 'Burger revisité maison', kcal: 420 },
      { name: 'Poulet curry + lentilles', kcal: 400 },
      { name: 'Bowl poulet, riz basmati, légumes', kcal: 450 },
    ],
    dinner: [
      { name: 'Saumon, brocoli, patate douce', kcal: 430 },
      { name: 'Lasagnes allégées', kcal: 410 },
      { name: 'Tortillas légères poulet', kcal: 390 },
      { name: 'Pizza revisitée base chou-fleur', kcal: 430 },
    ],
  },
  maghrebin: {
    breakfast: [
      { name: 'Thé nature + baie miracle + œuf', kcal: 220 },
      { name: 'Yaourt grec 0% + amandes', kcal: 240 },
      { name: 'Msemen complet allégé + fromage frais', kcal: 300 },
      { name: 'Omelette aux herbes', kcal: 280 },
    ],
    lunch: [
      { name: 'Tajine poulet citron + couscous chou-fleur', kcal: 420 },
      { name: 'Lentilles à la marocaine', kcal: 380 },
      { name: 'Poisson chermoula + légumes vapeur', kcal: 400 },
      { name: 'Kefta dinde + salade méchouia', kcal: 410 },
    ],
    dinner: [
      { name: 'Soupe harira allégée', kcal: 320 },
      { name: 'Tajine légumes + pois chiches', kcal: 380 },
      { name: 'Brochettes poulet + taboulé chou-fleur', kcal: 400 },
      { name: 'Chakchouka aux œufs', kcal: 350 },
    ],
  },
  subsaharien: {
    breakfast: [
      { name: 'Bouillie de fonio + fruits', kcal: 280 },
      { name: 'Omelette + avocat', kcal: 320 },
      { name: 'Yaourt grec 0% + papaye', kcal: 200 },
      { name: 'Akassa léger + œuf', kcal: 300 },
    ],
    lunch: [
      { name: 'Poulet yassa + riz complet', kcal: 440 },
      { name: 'Sauce gombo allégée + attiéké', kcal: 420 },
      { name: 'Poisson braisé + légumes', kcal: 400 },
      { name: 'Mafé dinde allégé + riz basmati', kcal: 450 },
    ],
    dinner: [
      { name: 'Soupe de légumes + poisson', kcal: 340 },
      { name: 'Attiéké + thon + crudités', kcal: 390 },
      { name: 'Sauce feuilles + igname vapeur', kcal: 410 },
      { name: 'Brochettes + plantain rôti (portion contrôlée)', kcal: 420 },
    ],
  },
}
MEALS.mixte = MEALS.europeen // fallback simple

export const SPORT = [
  'Corde + HIIT 15 min',
  'Corde + Élastiques 25 min',
  'Corde + Marche 30 min',
  'Corde + HIIT 15 min',
  'Corde + Élastiques 25 min',
  'Corde + Marche 45 min / vélo',
  'Corde + Batch cooking 2h',
]

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export const CHECKER = ['Le Checker cacao', 'Le Checker cannelle']

// Listes de courses indicatives par budget (€).
export const SHOPPING_BUDGET = {
  essentiel: 40,
  equilibre: 70,
  confort: 125,
}
