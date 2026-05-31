// Test full-stack : onboarding réel via l'UI -> backend -> Postgres -> Home.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const email = `enzo+${Date.now()}@test.fr`

const browser = await chromium.launch({ executablePath: EXEC })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('✓', n) }

await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await sleep(300)
await page.getByText('Commencer').click(); await sleep(150)
await page.getByPlaceholder('Ton prénom').fill('Enzo')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Perdre du poids').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Subsaharien').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Équilibré').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByPlaceholder('80').fill('82'); await page.getByPlaceholder('175').fill('178')
await page.getByText('Continuer').click(); await sleep(120)
// Étape compte
await page.getByPlaceholder('toi@email.fr').fill(email)
await page.getByPlaceholder('••••••••').fill('motdepasse1')
await shot('25-onboarding-compte')
await page.getByText('Continuer').click(); await sleep(150)
await shot('26-onboarding-recap')
await page.getByText('Générer mon programme').click()

// Attendre la home (après génération + appels API)
await page.waitForURL(BASE + '/', { timeout: 15000 }).catch(() => {})
await sleep(1500)
await shot('27-home-fullstack')

// Vérifier le profil subsaharien dans le programme
await page.getByRole('link', { name: 'Programme' }).click(); await sleep(600)
await page.locator('text=Lundi').first().click(); await sleep(400)
await shot('28-programme-subsaharien')

// Compte : doit afficher "Connecté"
await page.getByRole('link', { name: 'Accueil' }).click(); await sleep(400)
await page.getByRole('link', { name: 'Mon compte' }).click(); await sleep(500)
await shot('29-compte-connecte')

console.log('EMAIL', email)
console.log('CONSOLE ERRORS:', errors.length ? errors : 'aucune')
await browser.close()
