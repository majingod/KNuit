// Accessibilité clavier du footer (1.2c, Basse différée du push
// groupé 2026-11-17) : :focus-visible, ordre de tabulation,
// cible 48px minimum sur toutes les viewports (décision 1.2c :
// 48px intentionnel partout, footer uniforme, pas de breakpoint
// desktop — le nom « mobile » de la v1.2c affirmait un comportement
// inexistant, renommé en 1.3, pratique 1.2a). Tests ONLINE
// UNIQUEMENT, en `vite preview` (build de production) — le footer
// n'est pas critique hors-ligne. Pas de mutation possible pour
// 1.2c : la preuve de non-vacuité est le contrôle négatif — retirer
// la règle :focus-visible fait échouer le test « focus visible »
// (vérifié le 2026-11-18, footer.css restauré, hash vérifié).
// Port dédié 4191 (4181–4189 déjà utilisés, 4190 interdit).
//
// Ce que le test prouve : (1) l'ordre des Tab sur les liens du
// footer est l'ordre DOM = ordre visuel ; (2) chaque lien focusé
// au clavier porte un outline visible (3px solid, offset 2px) ;
// (3) chaque lien mesure ≥ 48px de haut sur toutes les viewports
// — le test tourne en viewport mobile (390px) mais l'assertion
// vaut partout (pas de breakpoint) ; (4) Enter sur un lien du
// footer navigue vers sa cible (1.3).
// Ce que le test ne prouve PAS : le contraste numérique de
// l'outline (currentColor = couleur du texte du lien, lisible par
// construction sur le fond — pas de mesure WCAG ici) ; l'accessibilité
// du reste de l'app (seul le footer est couvert) ; le comportement
// d'un lecteur d'écran (pas testé).
import { chromium, expect, test, type Browser } from '@playwright/test'
import { startVite, stopAll, waitFor } from './helpers'

const BASE = 'http://127.0.0.1:4191'
let browser: Browser

test.beforeAll(async () => {
  startVite('preview', 4191)
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  await browser.close()
  await stopAll()
})

const FOOTER_LINKS = ['Accueil', 'Mode Urgence', 'À propos', 'Mentions légales']

test('clavier : ordre de tabulation du footer = ordre DOM, focus visible', async () => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('contentinfo')).toBeVisible()

  // Tab à travers la page : l'accueil a un lien « Mode Urgence »
  // dans <main> avant le footer — on ne retient que les liens du
  // footer (closest('footer')), dans l'ordre où le focus les atteint.
  const focused: Array<{ text: string; outlineStyle: string; outlineWidth: string; outlineOffset: string }> = []
  for (let i = 0; i < 10 && focused.length < FOOTER_LINKS.length; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el.tagName !== 'A' || !el.closest('footer')) return null
      const style = getComputedStyle(el)
      return {
        text: (el.textContent ?? '').trim(),
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineOffset: style.outlineOffset,
      }
    })
    if (info) focused.push(info)
  }
  expect(focused.map((f) => f.text)).toEqual(FOOTER_LINKS)
  for (const f of focused) {
    // :focus-visible appliqué : outline 3px solid, offset 2px. Sans
    // la règle, le style calculé est 'auto' (défaut navigateur) —
    // observé dans le contrôle négatif du 2026-11-18. L'offset est
    // asserté depuis 1.3 : parseFloat >= 2 (comportement, pas
    // représentation — un futur 0.125rem équivalent à 2px ne doit
    // pas échouer). Sans la règle, l'offset calculé est '1px'
    // (défaut Chromium observé, pas '0px') — contrôle négatif de
    // cette assertion re-vérifié le 2026-11-18 (correction 1.3) :
    // sans la règle, l'offset calculé est '1px' → 1 < 2, exactement
    // 1 échec (test clavier), 2 verts (48px + Enter non affectés).
    expect(f.outlineStyle).toBe('solid')
    expect(f.outlineWidth).toBe('3px')
    expect(parseFloat(f.outlineOffset)).toBeGreaterThanOrEqual(2)
  }
  await context.close()
})

test('cible 48px : chaque lien du footer mesure au moins 48px de haut sur toutes les viewports', async () => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  const footer = page.getByRole('contentinfo')
  await expect(footer).toBeVisible()
  for (const name of FOOTER_LINKS) {
    const link = footer.getByRole('link', { name, exact: true })
    await expect(link).toBeVisible()
    const box = await link.boundingBox()
    expect(box, `boundingBox du lien « ${name} »`).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(48)
  }
  await context.close()
})

test('clavier : Enter sur un lien du footer navigue vers sa cible', async () => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  // Tab jusqu'au lien « À propos » du footer (le premier Tab
  // atteint le lien « Mode Urgence » de <main>, puis les liens du
  // footer dans l'ordre DOM), puis Enter.
  let focusedName: string | null = null
  for (let i = 0; i < 10 && focusedName !== 'À propos'; i++) {
    await page.keyboard.press('Tab')
    focusedName = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el.tagName !== 'A' || !el.closest('footer')) return null
      return (el.textContent ?? '').trim()
    })
  }
  expect(focusedName).toBe('À propos')
  await page.keyboard.press('Enter')
  // Timeout 10 s (1.3) : une navigation locale same-origin se
  // résout en < 5 s — 10 s, c'est déjà 2x le besoin. Le défaut
  // Playwright (120 s) coûtait 126 s au contrôle négatif.
  await page.waitForURL('**/about', { timeout: 10_000 })
  expect(new URL(page.url()).pathname).toBe('/about')
  await context.close()
})
