import { config } from '../config.js'
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

// --- Appel Anthropic (activé seulement si une clé est configurée) ---
async function generateWithAnthropic({ profile, weekNumber }) {
  const phase = phaseFor(weekNumber)
  const system = [
    'Tu es le moteur de génération du Coach Perte de Poids.',
    'Tu produis un programme hebdomadaire de rééquilibrage alimentaire et sportif.',
    'Contraintes : féculents malins (konjac, lentilles, patate douce, pois chiches, riz basmati),',
    'corde à sauter quotidienne, Checker 2x/jour, anti-inflammatoire intégré, plaisir sans privation.',
    "Positionnement : bien-être, jamais de promesse médicale ni de perte chiffrée garantie.",
    'Réponds STRICTEMENT en JSON valide correspondant au schéma demandé, sans texte autour.',
  ].join(' ')

  const schema = `{
  "number": number, "phase": string, "phaseNote": string,
  "days": [{ "day": string, "sport": string,
    "meals": [{ "slot": string, "name": string, "kcal": number }] }],
  "shoppingBudget": number,
  "rope": { "sets": number, "work": number, "rest": number, "label": string }
}`

  const user = [
    `Profil culturel: ${profile.food_profile}. Objectif: ${profile.goal}. Budget: ${profile.budget}.`,
    `Semaine ${weekNumber} (${phase.name} — ${phase.note}).`,
    'Génère 7 jours (Lundi→Dimanche), 4 repas/jour dont un "Checker 16h" ~110 kcal.',
    `Réponds avec un objet JSON respectant ce schéma : ${schema}`,
  ].join('\n')

  const resp = await fetch(`${config.anthropic.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': config.anthropic.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.anthropic.model,
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const json = await resp.json()
  const text = json?.content?.[0]?.text || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Réponse non JSON')
  return JSON.parse(match[0])
}
