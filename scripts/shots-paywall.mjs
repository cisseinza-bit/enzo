import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await chromium.launch({ executablePath: EXEC })
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error' && !/CERT|favicon/i.test(m.text())) errors.push(m.text()) })
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('✓', n) }

// Onboarding démo express → Home (tier locked en démo ? non : démo = premium).
// Pour voir le paywall on crée un VRAI compte (tier locked).
const email = `pay+${Date.now()}@test.fr`
await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await sleep(300)
await page.getByText('Commencer').click(); await sleep(150)
await page.getByPlaceholder('Ton prénom').fill('Enzo')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Perdre du poids').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Européen / Junk').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Équilibré').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByPlaceholder('80').fill('82'); await page.getByPlaceholder('175').fill('178')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByPlaceholder('toi@email.fr').fill(email)
await page.getByPlaceholder('••••••••').fill('motdepasse1')
await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Générer mon programme').click()
await page.waitForURL(BASE + '/', { timeout: 12000 }).catch(() => {})
await sleep(1500)

// Aller au paywall via le bouton flottant (compte locked)
await page.getByText('Débloquer l’accès complet').click(); await sleep(800)
await shot('pw-01-paywall')

// Sélectionner mensuel pour voir la sélection bouger
await page.getByText('Mensuel sans engagement').click(); await sleep(400)
await shot('pw-02-paywall-monthly')

console.log('EMAIL', email)
console.log('CONSOLE ERRORS:', errors.length ? errors : 'aucune')
await b.close()
