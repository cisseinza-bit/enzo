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
const email = `bilan+${Date.now()}@test.fr`

// Inscription (compte réel) + seed d'une mesure M-1 via l'API directement,
// puis on ouvre le bilan dans l'app pour voir la comparaison.
await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await sleep(300)
await page.getByText('Commencer').click(); await sleep(150)
await page.getByPlaceholder('Ton prénom').fill('Inès')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Perdre du poids').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Maghrébin').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Équilibré').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByPlaceholder('80').fill('78'); await page.getByPlaceholder('175').fill('168')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByPlaceholder('toi@email.fr').fill(email)
await page.getByPlaceholder('••••••••').fill('motdepasse1')
await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Générer mon programme').click()
await page.waitForURL(BASE + '/', { timeout: 12000 }).catch(() => {})
await sleep(1500)

// Seed mesure M-1 via fetch authentifié (token dans localStorage)
const token = await page.evaluate(() => localStorage.getItem('cpp-token'))
await page.evaluate(async ({ token, base }) => {
  await fetch(base + '/tracking/measurements', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
    body: JSON.stringify({ waist: 84, hips: 98, thighs: 56, arms: 30, date: '2026-05-05', photos: {} }),
  })
}, { token, base: 'http://localhost:3001/api' })

// Recharge pour que le contexte relise les mesures (M-1) depuis l'API
await page.reload({ waitUntil: 'networkidle' }); await sleep(1500)

// Aller au suivi puis bilan
await page.getByRole('link', { name: 'Suivi' }).click(); await sleep(800)
await page.getByRole('button', { name: /bilan/i }).click(); await sleep(800)
await shot('bil-01-form-empty')

// Remplir les mensurations (déclenche les deltas vs M-1)
const inputs = page.locator('input[type=number]')
await inputs.nth(0).fill('81'); await sleep(150)
await inputs.nth(1).fill('96'); await sleep(150)
await inputs.nth(2).fill('54'); await sleep(150)
await inputs.nth(3).fill('29.5'); await sleep(150)
await sleep(400)
await shot('bil-02-form-deltas')

// Enregistrer → écran de comparaison
await page.getByText('Enregistrer mon bilan').click(); await sleep(900)
await shot('bil-03-comparison')

console.log('CONSOLE ERRORS:', errors.length ? errors : 'aucune')
await b.close()
