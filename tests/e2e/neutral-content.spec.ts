// Contenu neutre (Phase 1, Option 2, décision Master 2026-11-17) :
// pages À propos et Mentions légales en JSX pur, footer sur toutes
// les pages. Tests ONLINE UNIQUEMENT : ce contenu n'est pas critique
// hors-ligne. Pas de test offline dédié, pas de mutation — décision
// Master explicite pour cette tâche : rien à protéger, donc rien à
// tester par mutation. Port dédié 4189 (4181–4188 déjà utilisés,
// 4190 interdit).
import { chromium, expect, test, type Browser } from '@playwright/test'
import { startVite, stopAll, waitFor } from './helpers'

const BASE = 'http://127.0.0.1:4189'
let browser: Browser

test.beforeAll(async () => {
  startVite('preview', 4189)
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  await browser.close()
  await stopAll()
})

test('online : /about s’affiche', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/about`, { waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('heading', { name: 'À propos', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('100 % locale', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Version privée', { exact: true }),
  ).toBeVisible()
  await context.close()
})

test('online : /legal s’affiche', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/legal`, { waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('heading', { name: 'Mentions légales', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('ne collecte aucune donnée personnelle', {
      exact: false,
    }),
  ).toBeVisible()
  await expect(
    page.getByText('ni cookies ni traceurs', { exact: false }),
  ).toBeVisible()
  await context.close()
})

test('online : footer visible sur accueil, /about et /legal, ABSENT sur /urgence', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  for (const route of ['/', '/about', '/legal']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    await expect(
      footer.getByRole('link', { name: 'Accueil', exact: true }),
    ).toHaveAttribute('href', '/')
    await expect(
      footer.getByRole('link', { name: 'Mode Urgence', exact: true }),
    ).toHaveAttribute('href', '/urgence')
    await expect(
      footer.getByRole('link', { name: 'À propos', exact: true }),
    ).toHaveAttribute('href', '/about')
    await expect(
      footer.getByRole('link', { name: 'Mentions légales', exact: true }),
    ).toHaveAttribute('href', '/legal')
  }
  // Test négatif (Haute n°1, décision Master 2026-11-17) : sur
  // /urgence, zéro distraction — le footer n'est pas rendu du tout,
  // ni les liens qui quittent le protocole. Si un futur contributeur
  // ré-affiche le footer sur /urgence, ce test tombe. TROIS
  // marqueurs (décision Master) : sinon un contributeur pourrait
  // ajouter une sidebar avec ces liens et le test ne le verrait
  // pas — le même trou que H2 a fermé sur brouillon.
  await page.goto(`${BASE}/urgence`, { waitUntil: 'domcontentloaded' })
  // (a) l'élément <footer> lui-même
  await expect(page.getByRole('contentinfo')).toHaveCount(0)
  // (b) les liens /about et /legal, par href (quel que soit leur libellé)
  await expect(page.locator('a[href="/about"]')).toHaveCount(0)
  await expect(page.locator('a[href="/legal"]')).toHaveCount(0)
  // (c) les textes « À propos » et « Mentions légales », où qu'ils soient
  await expect(page.getByText('À propos', { exact: true })).toHaveCount(0)
  await expect(
    page.getByText('Mentions légales', { exact: true }),
  ).toHaveCount(0)
  await context.close()
})

test('online : clic réel sur les liens du footer vers /about et /legal', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  const footer = page.getByRole('contentinfo')
  await footer.getByRole('link', { name: 'À propos', exact: true }).click()
  await expect(page).toHaveURL(`${BASE}/about`)
  await expect(
    page.getByRole('heading', { name: 'À propos', exact: true }),
  ).toBeVisible()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await footer.getByRole('link', { name: 'Mentions légales', exact: true }).click()
  await expect(page).toHaveURL(`${BASE}/legal`)
  await expect(
    page.getByRole('heading', { name: 'Mentions légales', exact: true }),
  ).toBeVisible()
  await context.close()
})
