// Données mockées du programme — Phase 1 / profil Européen-Junk food / budget Équilibré.
// Tout est local pour l'instant : la génération réelle viendra du backend + Anthropic API.

export const DISCLAIMER =
  "Programme de bien-être et rééquilibrage alimentaire. Consultez un professionnel de santé avant tout changement alimentaire important."

export const PROFILES = [
  { id: 'maghrebin', label: 'Maghrébin', emoji: '🫖', desc: 'Tajines, couscous, thé sucré' },
  { id: 'subsaharien', label: 'Subsaharien', emoji: '🍚', desc: 'Riz gras, attiéké, plantain' },
  { id: 'europeen', label: 'Européen / Junk', emoji: '🍔', desc: 'Pâtes, fast food, snacking' },
  { id: 'mixte', label: 'Mixte', emoji: '🌍', desc: 'Un peu de tout' },
]

export const BUDGETS = [
  { id: 'essentiel', label: 'Essentiel', range: '30–50€', perWeek: 40 },
  { id: 'equilibre', label: 'Équilibré', range: '60–80€', perWeek: 70 },
  { id: 'confort', label: 'Confort', range: '100–150€', perWeek: 125 },
]

export const GOALS = [
  { id: 'perte', label: 'Perdre du poids', emoji: '🔥' },
  { id: 'forme', label: 'Retrouver la forme', emoji: '⚡' },
  { id: 'recomp', label: 'Affiner & tonifier', emoji: '💪' },
]

// La pyramide pédagogique (de la base = plus important, au sommet = moins)
export const PYRAMID = [
  { n: 1, label: 'Calories', note: 'La base de tout' },
  { n: 2, label: 'Activité + NEAT', note: 'Bouger toute la journée' },
  { n: 3, label: 'Timing nutrition', note: 'Quand tu manges' },
  { n: 4, label: 'Métabolisme', note: 'Ton moteur énergétique' },
  { n: 5, label: 'Profil hormonal', note: 'Ce qui régule la faim' },
  { n: 6, label: 'Équilibre', note: 'Assiette complète' },
  { n: 7, label: 'Sensibilité', note: 'Ce qui te convient' },
  { n: 8, label: 'Quantité', note: 'Le moins important' },
]

// Programme de la semaine en cours
export const WEEK = {
  number: 1,
  phase: 'Phase 1 — Reset',
  phaseNote: 'Konjac 80% + légumineuses 20%. On nettoie, on dégonfle.',
  days: [
    {
      day: 'Lundi', sport: 'Corde + HIIT 15 min',
      meals: [
        { slot: 'Petit-déj', name: 'Skyr + flocons + myrtilles', kcal: 280 },
        { slot: 'Déjeuner', name: 'Konjac sauce bolognaise dinde', kcal: 360 },
        { slot: 'Checker 16h', name: 'Le Checker cacao', kcal: 110 },
        { slot: 'Dîner', name: 'Saumon, brocoli, patate douce', kcal: 430 },
      ],
    },
    {
      day: 'Mardi', sport: 'Corde + Élastiques 25 min',
      meals: [
        { slot: 'Petit-déj', name: 'Omelette 3 œufs + épinards', kcal: 300 },
        { slot: 'Déjeuner', name: 'Burger revisité maison', kcal: 420 },
        { slot: 'Checker 16h', name: 'Le Checker cannelle', kcal: 110 },
        { slot: 'Dîner', name: 'Lasagnes allégées', kcal: 410 },
      ],
    },
    {
      day: 'Mercredi', sport: 'Corde + Marche 30 min',
      meals: [
        { slot: 'Petit-déj', name: 'Yaourt grec 0% + baie miracle', kcal: 180 },
        { slot: 'Déjeuner', name: 'Poulet curry + lentilles', kcal: 400 },
        { slot: 'Checker 16h', name: 'Le Checker cacao', kcal: 110 },
        { slot: 'Dîner', name: 'Tortillas légères poulet', kcal: 390 },
      ],
    },
    {
      day: 'Jeudi', sport: 'Corde + HIIT 15 min',
      meals: [
        { slot: 'Petit-déj', name: 'Skyr + chocolat 85%', kcal: 250 },
        { slot: 'Déjeuner', name: 'Konjac poêlée légumes + œufs', kcal: 340 },
        { slot: 'Checker 16h', name: 'Le Checker cannelle', kcal: 110 },
        { slot: 'Dîner', name: 'Cabillaud, courgettes, pois chiches', kcal: 420 },
      ],
    },
    {
      day: 'Vendredi', sport: 'Corde + Élastiques 25 min',
      meals: [
        { slot: 'Petit-déj', name: 'Omelette + avocat', kcal: 320 },
        { slot: 'Déjeuner', name: 'Bolognaise dinde + konjac', kcal: 360 },
        { slot: 'Checker 16h', name: 'Le Checker cacao', kcal: 110 },
        { slot: 'Dîner', name: 'Pizza revisitée base chou-fleur', kcal: 430 },
      ],
    },
    {
      day: 'Samedi', sport: 'Corde + Marche 45 min / vélo',
      meals: [
        { slot: 'Petit-déj', name: 'Pancakes flocons + skyr', kcal: 330 },
        { slot: 'Déjeuner', name: 'Bowl poulet, riz basmati, légumes', kcal: 450 },
        { slot: 'Checker 16h', name: 'Le Checker cannelle', kcal: 110 },
        { slot: 'Dîner', name: 'Soupe + tortilla légère', kcal: 350 },
      ],
    },
    {
      day: 'Dimanche', sport: 'Corde + Batch cooking 2h',
      meals: [
        { slot: 'Petit-déj', name: 'Œufs brouillés + pain complet', kcal: 320 },
        { slot: 'Déjeuner', name: 'Restes batch cooking au choix', kcal: 420 },
        { slot: 'Checker 16h', name: 'Le Checker cacao', kcal: 110 },
        { slot: 'Dîner', name: 'Salade complète + thon', kcal: 380 },
      ],
    },
  ],
}

// Liste de courses (budget équilibré ~70€)
export const SHOPPING = [
  {
    cat: 'Protéines', items: [
      { name: 'Filets de poulet', qty: '1 kg', price: 9.5 },
      { name: 'Dinde hachée 5%', qty: '500 g', price: 5.0 },
      { name: 'Saumon / cabillaud', qty: '600 g', price: 11.0 },
      { name: 'Œufs', qty: 'x12', price: 3.2 },
      { name: 'Skyr / yaourt grec 0%', qty: '1 kg', price: 4.5 },
    ],
  },
  {
    cat: 'Féculents malins', items: [
      { name: 'Konjac (nouilles)', qty: 'x6', price: 9.0 },
      { name: 'Lentilles', qty: '500 g', price: 1.8 },
      { name: 'Patate douce', qty: '1 kg', price: 2.5 },
      { name: 'Pois chiches', qty: '2 boîtes', price: 1.6 },
      { name: 'Riz basmati', qty: '500 g', price: 2.0 },
    ],
  },
  {
    cat: 'Légumes & fruits', items: [
      { name: 'Brocoli / courgettes', qty: '1,5 kg', price: 4.0 },
      { name: 'Épinards', qty: '500 g', price: 2.2 },
      { name: 'Chou-fleur', qty: '1', price: 1.8 },
      { name: 'Myrtilles surgelées', qty: '500 g', price: 3.5 },
      { name: 'Avocat', qty: 'x2', price: 2.4 },
    ],
  },
  {
    cat: 'Épicerie & anti-inflammatoire', items: [
      { name: 'Curcuma + poivre noir', qty: '1 pot', price: 2.5 },
      { name: 'Gingembre frais', qty: '1', price: 1.0 },
      { name: 'Huile d’olive', qty: '500 ml', price: 4.0 },
      { name: 'Chocolat 85%', qty: '1 tablette', price: 2.0 },
      { name: 'Protéine en poudre (Checker)', qty: '1 dose/sem', price: 2.0 },
    ],
  },
]

// Batch cooking dominical
export const BATCH = {
  duration: '≈ 2h',
  steps: [
    { n: 1, title: 'Lancer les cuissons longues', detail: 'Patate douce au four + lentilles à l’eau (35 min).', time: '0–10 min' },
    { n: 2, title: 'Préparer les protéines', detail: 'Cuire poulet et dinde hachée, assaisonner curcuma/poivre.', time: '10–35 min' },
    { n: 3, title: 'Sauces & bases', detail: 'Bolognaise dinde + base chou-fleur mixée pour pizza.', time: '35–60 min' },
    { n: 4, title: 'Légumes rôtis', detail: 'Brocoli, courgettes au four, filet d’huile d’olive.', time: '60–85 min' },
    { n: 5, title: 'Portionner', detail: 'Boîtes individuelles. Frigo = 3 jours, congélo = le reste.', time: '85–120 min' },
  ],
  storage: {
    frigo: ['Poulet cuit', 'Bolognaise', 'Légumes rôtis', 'Lentilles'],
    congelo: ['Portions lasagnes', 'Sauce en trop', 'Base pizza chou-fleur'],
  },
}

// Programme corde à sauter par semaine
export const ROPE = {
  1: { sets: 3, work: 120, rest: 60, label: 'Semaine 1 · 3×2 min' },
  2: { sets: 3, work: 180, rest: 45, label: 'Semaine 2 · 3×3 min' },
  3: { sets: 4, work: 180, rest: 30, label: 'Semaine 3 · 4×3 min' },
  4: { sets: 3, work: 300, rest: 30, label: 'Semaine 4 · 3×5 min' },
}

// Calories invisibles — format Avant / Après
export const INVISIBLE = [
  { before: 'Pâtes blanches 100g', after: 'Konjac', save: 340 },
  { before: 'Soda 33cl', after: 'Eau pétillante + citron', save: 140 },
  { before: 'Huile à la louche', after: 'Spray huileur', save: 270 },
  { before: 'Crème dessert', after: 'Skyr + baie miracle', save: 160 },
]

// Concepts scientifiques (1 par mois)
export const CONCEPTS = [
  { m: 1, title: 'Résistance à l’insuline', text: 'Trop de sucre rapide fatigue le système qui range l’énergie. On privilégie l’IG bas pour garder la machine fluide.' },
  { m: 2, title: 'Dette de sommeil', text: 'Mal dormir, c’est ~300 kcal de plus avalées le lendemain sans s’en rendre compte. Le sommeil fait partie du programme.' },
  { m: 3, title: 'Effet thermique des protéines', text: 'Ton corps brûle 20–30% des calories des protéines rien que pour les digérer. D’où le Checker.' },
  { m: 4, title: 'Protein leverage', text: 'Tant que tu manques de protéines, ton cerveau te pousse à manger plus. On vise la satiété, pas la privation.' },
]

// Recettes bonus (variable reward)
export const RECIPES = [
  { name: 'Brownie skyr-cacao', kcal: 150, tag: 'Dessert', locked: false },
  { name: 'Pizza base chou-fleur', kcal: 430, tag: 'Plat', locked: false },
  { name: 'Glace protéinée minute', kcal: 120, tag: 'Dessert', locked: true },
  { name: 'Wrap croustillant léger', kcal: 310, tag: 'Plat', locked: true },
]

// Feed communauté (comparaison sociale positive)
export const FEED = [
  { who: 'Sarah M.', text: 'J1 de corde validé 🔥 jambes en feu mais fière !', when: 'il y a 12 min', cheers: 14 },
  { who: 'Karim', text: 'Le Checker cacao m’a sauvé du distributeur à 16h 😅', when: 'il y a 40 min', cheers: 23 },
  { who: 'Léa', text: 'Batch cooking fait en 1h50. Frigo plein, tête tranquille.', when: 'il y a 2 h', cheers: 31 },
]

// Offres à durée limitée (rotation Higgsfield)
export const OFFERS = [
  { week: 1, label: '-30% sur ton 1er mois', sub: 'Offre de bienvenue' },
  { week: 2, label: '7 jours gratuits', sub: 'Teste tout, sans risque' },
  { week: 3, label: 'Bundle 3 mois -25%', sub: '97€ au lieu de 117€' },
  { week: 4, label: 'Contenu exclusif débloqué', sub: 'Recettes & concepts bonus' },
]
