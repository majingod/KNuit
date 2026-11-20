import { chromium, expect, test, type Browser } from '@playwright/test'
import { startVite, stopAll, waitFor } from './helpers'

const BASE = 'http://127.0.0.1:4192'
let browser: Browser

test.beforeAll(async () => {
  startVite('preview', 4192)
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  await browser.close()
  await stopAll()
})

test('accueil : les parcours Phase 1 sont accessibles', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'KNuit' })).toBeVisible()
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Mode Urgence' }),
  ).toHaveAttribute('href', '/urgence')
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Faire le point' }),
  ).toHaveAttribute('href', '/mal-passe')
  await expect(
    page.getByRole('navigation', { name: 'Accès rapide' }).getByRole('link'),
  ).toBeVisible()
  await context.close()
})

test('le parcours « Faire le point » reste interruptible et n’enregistre pas la note', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/mal-passe`, { waitUntil: 'domcontentloaded' })
  await expect(
    page.getByText('BROUILLON DE TEST', { exact: false }),
  ).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Accès rapide' })
    .getByRole('link')
    .click()
  await expect(page).toHaveURL(`${BASE}/urgence`)
  await page.goBack()

  await page
    .getByRole('button', { name: 'Je suis en sécurité pour le moment' })
    .click()
  const note = page.getByRole('textbox', {
    name: 'Note temporaire (facultative)',
  })
  await note.fill('Texte fictif à effacer')
  await expect(note).toHaveValue('Texte fictif à effacer')

  const storedData = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  }))
  expect(storedData).toEqual({ local: [], session: [] })

  await page.getByRole('button', { name: 'Terminer sans enregistrer' }).click()
  await expect(page.getByRole('heading', { name: 'Parcours terminé' })).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Es-tu en sécurité immédiate ?' }),
  ).toBeVisible()
  await context.close()
})

test('ressource canadienne : lien externe visible uniquement dans le parcours', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/mal-passe`, { waitUntil: 'domcontentloaded' })
  await page
    .getByRole('button', { name: 'Je suis en sécurité pour le moment' })
    .click()
  await page.getByRole('button', { name: 'Voir les ressources de soutien' }).click()
  await expect(
    page.getByRole('link', {
      name: /Ressources du Gouvernement du Canada/,
    }),
  ).toHaveAttribute(
    'href',
    'https://www.canada.ca/en/public-health/services/suicide-prevention.html',
  )
  await context.close()
})

test('les parcours restent utilisables sur mobile, tablette et bureau', async () => {
  const viewports = [
    { width: 320, height: 640 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
  ]

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    for (const route of ['/', '/urgence', '/mal-passe']) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(
        dimensions.scrollWidth,
        `débordement horizontal sur ${route} à ${viewport.width}px`,
      ).toBeLessThanOrEqual(dimensions.clientWidth)

      const controls = page.locator('main a, main button')
      for (let index = 0; index < (await controls.count()); index++) {
        const box = await controls.nth(index).boundingBox()
        expect(box?.height, `cible tactile sur ${route}`).toBeGreaterThanOrEqual(48)
      }
    }
    await context.close()
  }
})
