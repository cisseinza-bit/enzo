// Capture les écrans de la PWA en se connectant au serveur de preview.
// Utilise le Chromium pré-installé dans /opt/pw-browsers (réseau CDN bloqué).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch({ executablePath: EXEC })
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const page = await ctx.newPage()

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`✓ ${name}.png`)
}

async function goHome() {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await sleep(300)
}

// 1. Splash
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await sleep(500)
await shot('01-splash')

// 2. Onboarding — on remplit les 6 étapes
await page.getByText('Commencer').click()
await sleep(400)
await shot('02-onboarding-prenom')
await page.getByPlaceholder('Ton prénom').fill('Enzo')
await page.getByText('Continuer').click(); await sleep(300)        // objectif
await page.getByText('Perdre du poids').click()
await page.getByText('Continuer').click(); await sleep(300)        // profil
await shot('03-onboarding-profil')
await page.getByText('Européen / Junk').click()
await page.getByText('Continuer').click(); await sleep(300)        // budget
await page.getByText('Équilibré').click()
await page.getByText('Continuer').click(); await sleep(300)        // mesures
await page.getByPlaceholder('80').fill('82')
await page.getByPlaceholder('175').fill('178')
await shot('04-onboarding-mesures')
await page.getByText('Continuer').click(); await sleep(300)        // récap
await shot('05-onboarding-recap')

// 3. Génération
await page.getByText('Générer mon programme').click()
await sleep(600)
await shot('06-generation')

// Attendre l'arrivée sur Home
await page.waitForURL(BASE + '/', { timeout: 8000 }).catch(() => {})
await sleep(800)
await shot('07-home')

// Cocher quelques tâches pour montrer la progression + récompense
await page.getByText('Corde à sauter').click(); await sleep(200)
await page.getByText('2L d’eau').click(); await sleep(300)
await shot('08-home-progress')

const nav = (name) => page.getByRole('link', { name })

// 4. Programme — Semaine
await nav('Programme').click(); await sleep(400)
await page.locator('text=Lundi').first().click(); await sleep(300)
await shot('09-programme-semaine')

// Courses
await page.getByRole('button', { name: 'Courses' }).click(); await sleep(300)
await shot('10-programme-courses')

// Batch
await page.getByRole('button', { name: 'Batch' }).click(); await sleep(300)
await shot('11-programme-batch')

// 5. Sport — timer corde
await nav('Sport').click(); await sleep(400)
await shot('12-sport-idle')
await page.getByText('Démarrer').click(); await sleep(1200)
await shot('13-sport-running')

// 6. Suivi
await nav('Suivi').click(); await sleep(500)
await shot('14-suivi')

// 7. Découverte
await nav('Plus').click(); await sleep(400)
await shot('15-decouverte-concepts')
await page.getByRole('button', { name: 'Calories' }).click(); await sleep(300)
await shot('16-decouverte-calories')
await page.getByRole('button', { name: 'Commu' }).click(); await sleep(300)
await shot('17-decouverte-commu')

await browser.close()
console.log('Done.')
