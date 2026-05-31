import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch({ executablePath: EXEC })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error' && !/CERT|favicon/i.test(m.text())) errors.push(m.text()) })
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('✓', n) }

await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await sleep(500)
await shot('rd-01-splash')

// onboarding rapide en démo (sans compte)
await page.getByText('Commencer').click(); await sleep(300)
await page.getByPlaceholder('Ton prénom').fill('Enzo')
await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Perdre du poids').click(); await page.getByText('Continuer').click(); await sleep(150)
await shot('rd-02-profil')
await page.getByText('Européen / Junk').click(); await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Équilibré').click(); await page.getByText('Continuer').click(); await sleep(150)
await page.getByPlaceholder('80').fill('82'); await page.getByPlaceholder('175').fill('178')
await page.getByText('Continuer').click(); await sleep(150)
// étape compte : on laisse vide → démo
await page.getByText('Continuer').click(); await sleep(150)
await page.getByText('Générer mon programme').click()
await page.waitForURL(BASE + '/', { timeout: 12000 }).catch(() => {})
await sleep(1500)
await shot('rd-03-home')

await page.getByRole('link', { name: 'Programme' }).click(); await sleep(800)
await shot('rd-04-programme')

await page.getByRole('link', { name: 'Sport' }).click(); await sleep(700)
await shot('rd-05-sport')

await page.getByRole('link', { name: 'Suivi' }).click(); await sleep(800)
await shot('rd-06-suivi')

await page.getByRole('link', { name: 'Plus' }).click(); await sleep(700)
await shot('rd-07-decouverte')

console.log('CONSOLE ERRORS:', errors.length ? errors : 'aucune')
await browser.close()
