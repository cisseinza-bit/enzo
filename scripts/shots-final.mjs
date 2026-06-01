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
const nav = (name) => page.getByRole('link', { name })

await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await sleep(300)
await page.getByText('Commencer').click(); await sleep(150)
await page.getByPlaceholder('Ton prénom').fill('Enzo')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Perdre du poids').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Européen / Junk').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Équilibré').click(); await page.getByText('Continuer').click(); await sleep(120)
await page.getByPlaceholder('80').fill('82'); await page.getByPlaceholder('175').fill('178')
await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Continuer').click(); await sleep(120)
await page.getByText('Générer mon programme').click()
await page.waitForURL(BASE + '/', { timeout: 12000 }).catch(() => {})
await sleep(1500)
await page.evaluate(() => window.scrollTo({ top: 480, behavior: 'instant' })); await sleep(500)
await shot('fin-01-home')

await nav('Sport').click(); await sleep(800)
await shot('fin-02-sport')

await nav('Programme').click(); await sleep(700)
await page.locator('text=Lundi').first().click(); await sleep(500)
await shot('fin-03-programme')

await nav('Plus').click(); await sleep(500)
await page.getByRole('button', { name: 'Recettes' }).click(); await sleep(500)
await shot('fin-04-recettes')

console.log('CONSOLE ERRORS:', errors.length ? errors : 'aucune')
await b.close()
