// Mode Urgence hors-ligne (Phase 1, tâche 1) : le contenu est importé
// (Option A — import .json inliné dans le bundle par Vite), donc
// pré-caché avec les assets hashés ; la page doit fonctionner
// hors-ligne à la première visite (critère de sortie Phase 1).
// Le contenu est un brouillon générique non opérationnel, sans numéro
// d’urgence. Les assertions vérifient son intégrité hors ligne.
// VRAI hors-ligne : le test offline démarre son propre serveur vite
// sur un port dédié puis l'ARRÊTE avant la phase hors-ligne —
// `context.setOffline` seul ne bloque pas les fetch() émis depuis le
// service worker (voir helpers.ts). Port dédié 4185 (4181–4184 déjà
// utilisés, 4190 interdit).
import { chromium, expect, test, type Browser } from '@playwright/test'
import {
  sleep,
  startVite,
  stopAll,
  stopChild,
  waitFor,
  waitForServiceWorkerReady,
} from './helpers'

const BASE = 'http://127.0.0.1:4174'
let browser: Browser

const TITRE = 'Mode Urgence'
const AVERTISSEMENT =
  'BROUILLON DE TEST — contenu non validé par un expert. Il ne remplace pas les services d’urgence, médicaux ou psychosociaux. En cas de danger immédiat, contacte les services d’urgence locaux depuis ton propre téléphone.'
const INTRODUCTION =
  'Ces repères sont un brouillon destiné à tester l’interface. Ils ne constituent pas un protocole d’intervention.'

test.beforeAll(async () => {
  startVite('preview', 4174)
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  await browser.close()
  await stopAll()
})

test('online : la page d’accueil lie vers Mode Urgence', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  // Scopé à <main> : le footer (Option 2) contient un second lien
  // « Mode Urgence » vers la même destination. Ce test porte sur le
  // lien d'accès rapide du contenu principal (viewport), pas sur
  // celui du pied de page.
  const link = page
    .getByRole('main')
    .getByRole('link', { name: 'Mode Urgence' })
  await expect(link).toHaveAttribute('href', '/urgence')
  // Accès rapide en urgence : le lien doit être visible sans scroller.
  await expect(link).toBeInViewport()
  await link.click()
  await expect(page).toHaveURL(`${BASE}/urgence`)
  await expect(
    page.getByRole('heading', { name: TITRE, exact: true }),
  ).toBeVisible()
  await context.close()
})

test('online : accès direct à /urgence', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/urgence`, { waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('heading', { name: TITRE, exact: true }),
  ).toBeVisible()
  await expect(page.getByText(AVERTISSEMENT, { exact: true })).toBeVisible()
  const returnLink = page
    .getByRole('main')
    .getByRole('link', { name: 'Retour à l’accueil' })
  await expect(returnLink).toBeVisible()
  await expect(returnLink).toHaveAttribute('href', '/')
  await returnLink.click()
  await expect(page).toHaveURL(`${BASE}/`)
  await context.close()
})

test('offline : première visite en ligne → navigation vers /urgence → Mode Urgence affiché', async () => {
  const server = startVite('preview', 4185)
  const base = 'http://127.0.0.1:4185'
  await waitFor(`${base}/`)
  const context = await browser.newContext()
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  const errors: string[] = []
  const failed: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('requestfailed', (request) => failed.push(request.url()))

  // Visite en ligne : installation du SW et pré-cache du bundle
  // (contenu .json inliné, CSS Urgence, JS Urgence).
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)
  await sleep(1500)

  // VRAI hors-ligne : on arrête le serveur, puis setOffline en
  // ceinture et bretelles. Sans l'arrêt, le SW atteindrait encore le
  // serveur et servirait du frais — test vacuité.
  stopChild(server)
  await context.setOffline(true)
  await page.goto(`${base}/urgence`, { waitUntil: 'domcontentloaded' })
  await sleep(2000)
  const offline = await page.evaluate(() => {
    const avertissementEl = document.querySelector('.urgence-avertissement')
    return {
      url: location.pathname,
      h1: document.querySelector('h1')?.textContent ?? '(absent)',
      avertissement: avertissementEl?.textContent ?? '(absent)',
      // Le CSS est bundlé et pré-caché : le bandeau doit être stylé
      // même hors-ligne (font-weight 700 dans urgence.css).
      avertissementFontWeight: avertissementEl
        ? getComputedStyle(avertissementEl).fontWeight
        : '(absent)',
      mainText: document.querySelector('main')?.textContent ?? '(absent)',
      etapes: document.querySelectorAll('.urgence-etapes li').length,
      numeroPresent: !!document.querySelector('.urgence-numero'),
      controller: !!navigator.serviceWorker.controller,
    }
  })
  // Le shell est servi POUR la route demandée (pas de redirection) et
  // le composant Urgence se rend depuis le bundle pré-caché — avec le
  // placeholder EXACT, pas un contenu partiel.
  expect(offline.url).toBe('/urgence')
  expect(offline.h1).toBe(TITRE)
  expect(offline.avertissement).toBe(AVERTISSEMENT)
  expect(offline.mainText).toContain(INTRODUCTION)
  expect(offline.etapes).toBe(5)
  expect(offline.numeroPresent).toBe(false)
  expect(offline.avertissementFontWeight).toBe('700')
  expect(offline.controller).toBe(true)
  await page.getByRole('link', { name: 'Retour à l’accueil' }).click()
  await expect(page).toHaveURL(`${base}/`)
  await expect(
    page.getByRole('heading', { name: 'Bienvenue sur Kink de Nuit' }),
  ).toBeVisible()
  expect(failed).toEqual([])
  expect(errors).toEqual([])
  await context.setOffline(false)
  await context.close()
})
