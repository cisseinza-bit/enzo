import { config } from '../config.js'
import { getAnthropic } from './anthropic.js'
import { MEALS, SPORT, DAYS, CHECKER, phaseFor, SHOPPING_BUDGET } from './programData.js'

// Génère un programme hebdomadaire personnalisé.
// - Si une clé Anthropic est présente : on tente l'appel API.
// - Sinon (ou en cas d'échec) : repli sur le générateur déterministe.
export async function generateProgram({ profile, weekNumber }) {
  if (config.anthropic.enabled) {
    try {
      const data = await generateWithAnthropic({ profile, weekNumber })
      return { source: 'anthropic', data }
    } catch (err) {
      console.warn('[generator] Anthropic indisponible, repli déterministe :', err.message)
    }
  }
  return { source: 'deterministic', data: generateDeterministic({ profile, weekNumber }) }
}

// Rotation stable : décale les banques selon la semaine + le jour pour varier sans aléa.
function pick(arr, week, day) {
  return arr[(week + day) % arr.length]
}

export function generateDeterministic({ profile, weekNumber }) {
  const meals = MEALS[profile.food_profile] || MEALS.europeen
  const phase = phaseFor(weekNumber)

  const days = DAYS.map((day, i) => {
    const breakfast = pick(meals.breakfast, weekNumber, i)
    const lunch = pick(meals.lunch, weekNumber, i + 1)
    const dinner = pick(meals.dinner, weekNumber, i + 2)
    const checker = { slot: 'Checker 16h', name: pick(CHECKER, weekNumber, i), kcal: 110 }
    return {
      day,
      sport: SPORT[i],
      meals: [
        { slot: 'Petit-déj', ...breakfast },
        { slot: 'Déjeuner', ...lunch },
        checker,
        { slot: 'Dîner', ...dinner },
      ],
    }
  })

  return {
    number: weekNumber,
    phase: phase.name,
    phaseNote: phase.note,
    days,
    shoppingBudget: SHOPPING_BUDGET[profile.budget] ?? 70,
    rope: ropeFor(weekNumber),
  }
}

function ropeFor(week) {
  const table = {
    1: { sets: 3, work: 120, rest: 60, label: `Semaine ${week} · 3×2 min` },
    2: { sets: 3, work: 180, rest: 45, label: `Semaine ${week} · 3×3 min` },
    3: { sets: 4, work: 180, rest: 30, label: `Semaine ${week} · 4×3 min` },
    4: { sets: 3, work: 300, rest: 30, label: `Semaine ${week} · 3×5 min` },
  }
  return table[week] || table[4]
}

// Schéma de sortie structurée : l'API garantit un JSON conforme (plus de regex).
const PROGRAM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    number: { type: 'integer' },
    phase: { type: 'string' },
    phaseNote: { type: 'string' },
    days: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          day: { type: 'string' },
          sport: { type: 'string' },
          meals: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                slot: { type: 'string' },
                name: { type: 'string' },
                kcal: { type: 'integer' },
              },
              required: ['slot', 'name', 'kcal'],
            },
          },
        },
        required: ['day', 'sport', 'meals'],
      },
    },
    shoppingBudget: { type: 'integer' },
    rope: {
      type: 'object',
      additionalProperties: false,
      properties: {
        sets: { type: 'integer' },
        work: { type: 'integer' },
        rest: { type: 'integer' },
        label: { type: 'string' },
      },
      required: ['sets', 'work', 'rest', 'label'],
    },
  },
  required: ['number', 'phase', 'phaseNote', 'days', 'shoppingBudget', 'rope'],
}

// Système STABLE (indépendant du profil) → mis en cache pour économiser sur
// les nombreuses générations hebdomadaires (le préfixe ne change pas).
const SYSTEM_PROMPT = [
  'Tu es le moteur de génération du Coach Perte de Poids, un programme de',
  'bien-être et de rééquilibrage alimentaire (jamais de promesse médicale ni',
  'de perte de poids chiffrée garantie).',
  '',
  'Tu produis un programme hebdomadaire complet, personnalisé et appétissant :',
  '- Féculents malins privilégiés : konjac, lentilles, patate douce, pois',
  '  chiches, riz basmati (jamais de pâtes blanches).',
  '- Corde à sauter quotidienne (champ "sport" de chaque jour).',
  '- Le Checker 2x/jour (un repas "Checker 16h" ~110 kcal par jour).',
  '- Anti-inflammatoire intégré (curcuma, gingembre, oméga-3, légumes colorés).',
  '- Plaisir sans privation : toujours une alternative gourmande, jamais une',
  '  simple suppression. Plats revisités (lasagnes allégées, burger maison…).',
  '',
  'Adapte STRICTEMENT les plats au profil culturel demandé :',
  '- maghrebin : tajines, couscous (chou-fleur), thé + baie miracle, semoule complète.',
  '- subsaharien : riz complet, attiéké, sauces allégées, plantain contrôlé.',
  '- europeen : konjac à la place des pâtes, burgers/pizzas revisités, versions maison.',
  '- mixte : combinaison équilibrée des trois.',
  '',
  '7 jours du Lundi au Dimanche, 4 repas/jour (Petit-déj, Déjeuner, Checker 16h, Dîner).',
  'Calories réalistes par repas. Réponds uniquement via la structure demandée.',
].join('\n')

// --- Appel Anthropic via le SDK officiel (activé si une clé est configurée) ---
async function generateWithAnthropic({ profile, weekNumber }) {
  const client = getAnthropic()
  if (!client) throw new Error('Client Anthropic indisponible')

  const phase = phaseFor(weekNumber)
  const budget = SHOPPING_BUDGET[profile.budget] ?? 70

  const userPrompt = [
    `Profil culturel : ${profile.food_profile}.`,
    `Objectif : ${profile.goal}. Budget courses hebdo : ~${budget}€ (${profile.budget}).`,
    `Semaine ${weekNumber} — ${phase.name} : ${phase.note}`,
    `Renseigne "number" = ${weekNumber}, "phase" = "${phase.name}",`,
    `"phaseNote" = "${phase.note}", "shoppingBudget" = ${budget}.`,
    'Génère les 7 jours avec leurs 4 repas et le programme de corde ("rope").',
  ].join('\n')

  // messages.parse() valide la réponse contre le schéma et renvoie parsed_output.
  const message = await client.messages.parse({
    model: config.anthropic.model,
    max_tokens: 4096,
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: userPrompt }],
    output_config: {
      format: { type: 'json_schema', name: 'weekly_program', schema: PROGRAM_SCHEMA },
    },
  })

  const data = message.parsed_output
  if (!data) throw new Error('Sortie structurée vide (refus ou troncature)')
  return data
}
