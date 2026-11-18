// Contrôle négatif du bandeau brouillon (Phase 1, tâche 1, Voie A) :
// le bandeau d'avertissement est conditionnel sur data.brouillon.
// Seul `true` était testé (bandeau visible) ; ce test prouve le
// chemin `false` (bandeau absent) — sans lui, un contributeur qui
// casserait la condition ({data.brouillon && <p>} → <p>
// inconditionnel) ne serait vu par aucun test.
//
// Contrainte : le JSON est inliné dans le bundle par Vite (Option A),
// pas fetché — on ne peut pas le changer à l'exécution. Ce test
// construit donc une COPIE complète du projet dans /tmp, y écrit la
// variante brouillon:false, la build, et sert ce build sur un port
// dédié. Le content.json réel n'est JAMAIS modifié (pas de
// sauvegarde/restauration à rater), et dist/ n'est jamais reconstruit
// en cours de suite.
// Pourquoi pas `vite build --outDir dist-brouillon-false` dans le
// projet : le plugin knuit-sw-version de vite.config.ts lit en dur
// dist/sw.js et dist/.vite/manifest.json — un build vers un autre
// outDir échoue en closeBundle (PLUGIN_ERROR, vérifié le 2026-11-17).
// La copie /tmp contourne cela proprement : le plugin y lit ses
// propres dist/sw.js et dist/.vite/manifest.json.
// Port dédié 4186 (4185 urgence offline, 4190 interdit).
import { execFile } from 'node:child_process'
import { cp, lstat, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium, expect, test, type Browser } from '@playwright/test'
import { closeServer, REPO_ROOT, startStaticServer, waitFor } from './helpers'

const BASE = 'http://127.0.0.1:4186'
const PORT = 4186
const COPY_DIR = path.join('/tmp', `knuit-brouillon-false-${process.pid}`)

let browser: Browser
let server: Awaited<ReturnType<typeof startStaticServer>>

function run(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(command, args, { cwd, timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        reject(
          new Error(
            `${command} ${args.join(' ')} a échoué : ${stderr || stdout || error.message}`,
          ),
        )
        return
      }
      resolve()
    })
  })
}

test.beforeAll(async () => {
  // Garde : le content.json réel doit être le placeholder attendu —
  // sinon on refuserait de construire la variante sur une base inconnue.
  const realJson = JSON.parse(
    await readFile(path.join(REPO_ROOT, 'src', 'urgence', 'content.json'), 'utf8'),
  ) as { brouillon: boolean; titre: string }
  expect(realJson.brouillon).toBe(true)
  expect(realJson.titre).toBe('Mode Urgence (démonstration)')

  // Copie complète du projet (sans node_modules, dist, test-results),
  // node_modules lié par symlink, variante brouillon:false écrite
  // dans la copie uniquement.
  await cp(REPO_ROOT, COPY_DIR, {
    recursive: true,
    filter: (src) =>
      !['node_modules', 'dist', 'test-results'].includes(path.basename(src)),
  })
  await symlink(
    path.join(REPO_ROOT, 'node_modules'),
    path.join(COPY_DIR, 'node_modules'),
    'dir',
  )
  const variant = { ...realJson, brouillon: false }
  await writeFile(
    path.join(COPY_DIR, 'src', 'urgence', 'content.json'),
    JSON.stringify(variant),
  )

  // Build de la copie (vite seul — tsc n'est pas nécessaire : la
  // variante a la même forme que l'original, les types ne changent pas).
  await run(path.join(COPY_DIR, 'node_modules', '.bin', 'vite'), ['build'], COPY_DIR)
  const distStat = await lstat(path.join(COPY_DIR, 'dist', 'index.html'))
  expect(distStat.isFile()).toBe(true)

  server = await startStaticServer(path.join(COPY_DIR, 'dist'), PORT)
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  if (server) {
    await closeServer(server)
  }
  if (browser) {
    await browser.close()
  }
  await rm(COPY_DIR, { recursive: true, force: true })
})

test('brouillon: false — le bandeau d’avertissement est absent', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/urgence`, { waitUntil: 'domcontentloaded' })
  // La page se rend (titre + introduction visibles) : l'absence du
  // bandeau n'est pas une page blanche.
  await expect(
    page.getByRole('heading', { name: 'Mode Urgence (démonstration)', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Ceci est un test de pipeline, pas un mode urgence.', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.locator('.urgence-avertissement')).toHaveCount(0)
  await context.close()
})
