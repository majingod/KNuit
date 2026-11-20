// Contrôle négatif du bandeau brouillon (Phase 1, tâche 1, Voie A) :
// le bandeau d'avertissement est conditionnel sur data.brouillon.
// Seul `true` était testé (bandeau visible) ; ce test prouve le
// chemin `false` (bandeau absent) — sans lui, un contributeur qui
// casserait la condition ({data.brouillon && <p>} → <p>
// inconditionnel) ne serait vu par aucun test.
//
// La variante est construite par le helper partagé
// buildContentVariantCopy (tests/e2e/helpers.ts) : copie complète du
// projet dans le dossier temporaire du système, variante brouillon:false dans la copie
// uniquement, build de la copie, servie sur un port dédié. Le
// content.json réel n'est JAMAIS modifié (pas de
// sauvegarde/restauration à rater), et dist/ n'est jamais reconstruit
// en cours de suite.
// Port dédié 4186 (4185 urgence offline, 4190 interdit).
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium, expect, test, type Browser } from '@playwright/test'
import {
  buildContentVariantCopy,
  REPO_ROOT,
  type ContentVariantCopy,
} from './helpers'

const PORT = 4186

let browser: Browser
let variant: ContentVariantCopy

test.beforeAll(async () => {
  // Garde : le content.json réel doit être le brouillon attendu —
  // sinon on refuserait de construire la variante sur une base inconnue.
  const realJson = JSON.parse(
    await readFile(path.join(REPO_ROOT, 'src', 'urgence', 'content.json'), 'utf8'),
  ) as { brouillon: boolean; titre: string }
  expect(realJson.brouillon).toBe(true)
  expect(realJson.titre).toBe('Mode Urgence')

  variant = await buildContentVariantCopy({
    contentPath: path.join('src', 'urgence', 'content.json'),
    mutate: (content) => ({ ...content, brouillon: false }),
    port: PORT,
  })
  browser = await chromium.launch()
})

test.afterAll(async () => {
  if (variant) {
    await variant.cleanup()
  }
  if (browser) {
    await browser.close()
  }
})

test('brouillon: false — le bandeau d’avertissement est absent', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${variant.base}/urgence`, { waitUntil: 'domcontentloaded' })
  // La page se rend (titre + introduction visibles) : l'absence du
  // bandeau n'est pas une page blanche.
  await expect(
    page.getByRole('heading', { name: 'Mode Urgence', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(
      'Ces repères sont un brouillon destiné à tester l’interface. Ils ne constituent pas un protocole d’intervention.',
      {
      exact: true,
      },
    ),
  ).toBeVisible()
  await expect(page.locator('.urgence-avertissement')).toHaveCount(0)
  await context.close()
})
