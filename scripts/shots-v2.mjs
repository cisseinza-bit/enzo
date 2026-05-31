// Captures ciblées des nouveautés : génération enrichie, compte, verrouillage psy.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch({ executablePath: EXEC })
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
})
const page = await ctx.newPage()
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('✓', n) }
const nav = (name) => page.getByRole('link', { name })

// Onboarding express jusqu'à la génération
await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await sleep(300)
await page.getByText('Commencer').click(); await sleep(200)
await page.getByPlaceholder('Ton prénom').fill('Enzo')
await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Perdre du poids').click(); await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Européen / Junk').click(); await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Équilibré').click(); await page.getByText('Continuer').click(); await sleep(150)
await page.getByPlaceholder('80').fill('82'); await page.getByPlaceholder('175').fill('178')
await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Générer mon programme').click()

// Génération enrichie (mi-parcours)
await sleep(1500); await shot('18-generation-enrichie')
// Fin de génération
await sleep(3500); await shot('19-generation-finie')

// Home
await page.waitForURL(BASE + '/', { timeout: 8000 }).catch(() => {})
await sleep(800)

// Compte (via avatar)
await nav('Mon compte').click(); await sleep(500)
await shot('20-compte')

// Bascule en mode verrouillé (démo)
await page.getByRole('button', { name: 'Limité (démo)' }).click(); await sleep(400)
await shot('21-compte-locked')

// Découverte en mode verrouillé : contenus floutés + bouton flottant
await nav('Plus').click(); await sleep(500)
await shot('22-decouverte-locked')

// Recettes verrouillées
await page.getByRole('button', { name: 'Recettes' }).click(); await sleep(400)
await shot('23-recettes-locked')

// Déblocage via le bouton flottant
await page.getByText('Débloquer l’accès complet').click(); await sleep(700)
await shot('24-unlock-reward')

await browser.close()
console.log('Done.')
