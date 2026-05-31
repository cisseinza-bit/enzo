// Registre des photos de l'app.
// `local` : fichier servi depuis /public/img (placeholder pour l'instant).
// `source` : URL de la vraie photo générée (à déposer sous le même nom local).
//
// Les vraies photos (dark, rim-light lime) ont été générées mais le CDN qui les
// héberge est hors allowlist réseau du conteneur : impossible de les tirer ici.
// Dépose simplement les PNG sous public/img/<nom>.png et tout se met à jour.

export const IMAGES = {
  heroRope: {
    local: '/img/hero-rope.png',
    source: 'https://d8j0ntlcm91z4.cloudfront.net/user_38mrNAKCt6MSStNr9TviBQdlePO/hf_20260531_221737_2b9c330f-9fc7-496b-b401-b75bf03d8216.png',
    alt: 'Corde à sauter en salle, ambiance sombre',
  },
  mealBowl: {
    local: '/img/meal-bowl.png',
    source: 'https://d8j0ntlcm91z4.cloudfront.net/user_38mrNAKCt6MSStNr9TviBQdlePO/hf_20260531_221738_264abb2e-aa6c-4838-b15b-d19a0b85cbc3.png',
    alt: 'Bowl poulet, riz basmati et légumes rôtis',
  },
  mealBurger: {
    local: '/img/meal-burger.png',
    source: 'https://d8j0ntlcm91z4.cloudfront.net/user_38mrNAKCt6MSStNr9TviBQdlePO/hf_20260531_221741_2ceb971c-fdd3-445b-be51-d0cd282dbf03.png',
    alt: 'Burger revisité à la dinde',
  },
  checkerShake: {
    local: '/img/checker-shake.png',
    source: 'https://d8j0ntlcm91z4.cloudfront.net/user_38mrNAKCt6MSStNr9TviBQdlePO/hf_20260531_221742_349fd27a-11c1-44c6-b2fb-011b964bbfdb.png',
    alt: 'Shake protéiné cacao, Le Checker',
  },
}

// Associe un nom de repas (mots-clés) à une photo. Heuristique simple côté front.
export function photoForMeal(name = '') {
  const n = name.toLowerCase()
  if (n.includes('checker')) return IMAGES.checkerShake
  if (n.includes('burger')) return IMAGES.mealBurger
  if (n.includes('bowl') || n.includes('riz') || n.includes('poulet')) return IMAGES.mealBowl
  return IMAGES.mealBowl
}
