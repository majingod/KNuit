// Workflow de validation du contenu (Phase 1, tâche de fondation,
// Option 1) : la gate statique scripts/check-content-status.mjs +
// le rendu bidirectionnel (H2).
//
// Deux niveaux, complémentaires : la gate (lint) vérifie
// l'inventaire et les transitions sur les fichiers sources ; ce
// spec vérifie la même chose au niveau affiché, dans le navigateur.
// Les six transitions et les règles de pré-commercialisation sont
// testées en boîte noire (fixtures temporaires, gate lancée en
// sous-processus avec --root) — le test ne
// partage aucun code avec la gate, il ne peut donc pas passer pour
// la mauvaise raison si la gate est cassée. Les mutations (a)-(e)
// prouvent ensuite que gate + test sont branchés sur le vrai dépôt.
//
// Rendu bidirectionnel (H2) : pour chaque bloc découvert par glob
// (src/**/content.json, pas de liste hardcodée), brouillon: true →
// bandeau visible ET brouillon: false → bandeau absent. La direction
// false utilise le helper partagé buildContentVariantCopy (copie du
// projet dans le dossier temporaire, variante dans la copie uniquement) — le JSON est
// inliné dans le bundle, pas fetché, on ne peut pas le changer à
// l'exécution. La route suit la convention src/<nom>/content.json →
// /<nom> : si un bloc casse la convention, le test échoue sur 404
// (direction sûre). Le bandeau est identifié par son texte exact
// (champ avertissement du content.json), pas par sa classe CSS :
// la classe est propre à chaque composant, le texte est la donnée.
// Ports dédiés : 4188 (dist réel), 4187 (copie variante) — 4190
// interdit.
import { execFile } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { chromium, expect, test, type Browser } from '@playwright/test'
import {
  buildContentVariantCopy,
  closeServer,
  DIST,
  REPO_ROOT,
  startStaticServer,
  waitFor,
} from './helpers'

const GATE = path.join(REPO_ROOT, 'scripts', 'check-content-status.mjs')
const TRUE_PORT = 4188
const FALSE_PORT = 4187
const TRUE_BASE = `http://127.0.0.1:${TRUE_PORT}`

interface RunResult {
  code: number
  stdout: string
  stderr: string
}

function runNode(args: string[], cwd: string): Promise<RunResult> {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      args,
      { cwd, timeout: 60000 },
      (error, stdout, stderr) => {
        resolve({
          code: error
            ? typeof error.code === 'number'
              ? error.code
              : 1
            : 0,
          stdout: stdout.toString(),
          stderr: stderr.toString(),
        })
      },
    )
  })
}

// Découverte des blocs par parcours de src/ (même règle que la
// gate : pas de liste hardcodée, un nouveau bloc est couvert dès sa
// création).
function discoverBlocks(): Array<{ relative: string; route: string }> {
  const found: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.isFile() && entry.name === 'content.json') {
        found.push(path.relative(REPO_ROOT, full))
      }
    }
  }
  walk(path.join(REPO_ROOT, 'src'))
  return found.sort().map((relative) => ({
    relative,
    route: `/${path.basename(path.dirname(relative))}`,
  }))
}

const BLOCKS = discoverBlocks()

function readContent(relative: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(path.join(REPO_ROOT, relative), 'utf8'),
  ) as Record<string, unknown>
}

test('gate : l’état courant du dépôt passe', async () => {
  const result = await runNode([GATE], REPO_ROOT)
  expect(result.code, result.stderr).toBe(0)
  expect(result.stdout).toContain('OK')
})

test('build frais : dist/index.html plus récent que chaque content.json', async () => {
  // `npm run test:e2e` rebuild avant la suite ; ce test échoue si
  // quelqu'un lance `playwright test` directement contre un dist/
  // obsolète — le rendu testé ci-dessous ne correspondrait plus au
  // source. Résidu connu (voir task-1.2-scope.md) : un `touch` du
  // content.json après le build donne un faux échec — direction
  // sûre : rebuild (npm run build).
  expect(BLOCKS.length).toBeGreaterThan(0)
  const indexStat = statSync(path.join(DIST, 'index.html'))
  for (const block of BLOCKS) {
    const contentStat = statSync(path.join(REPO_ROOT, block.relative))
    expect(
      indexStat.mtimeMs,
      `${block.relative} plus récent que dist/index.html — rebuild (npm run build)`,
    ).toBeGreaterThanOrEqual(contentStat.mtimeMs)
  }
})

test('gate : transitions et pré-commercialisation (fixtures, boîte noire)', async () => {
  // Chaque cas construit un mini-dépôt temporaire (CONTENT-STATUS.md
  // + src/urgence/content.json) et lance la vraie gate en
  // sous-processus avec --root. Le hash « correct » est obtenu par
  // --print-hash (boîte noire aussi) ; le hash « erroné » est un
  // 64-hex valide mais différent du contenu.
  const cases: Array<{
    name: string
    brouillon: boolean
    statut: string
    hash: 'correct' | 'wrong' | 'none'
    entry: boolean
    release?: boolean
    expectCode: 0 | 1
  }> = [
    { name: 'brouillon:true + brouillon', brouillon: true, statut: 'brouillon', hash: 'none', entry: true, expectCode: 0 },
    { name: 'brouillon:true + en revue', brouillon: true, statut: 'en revue', hash: 'none', entry: true, expectCode: 0 },
    { name: 'brouillon:true + validé', brouillon: true, statut: 'validé', hash: 'correct', entry: true, expectCode: 1 },
    { name: 'brouillon:false + validé + hash correct', brouillon: false, statut: 'validé', hash: 'correct', entry: true, expectCode: 0 },
    { name: 'pré-commercialisation + brouillon', brouillon: true, statut: 'brouillon', hash: 'none', entry: true, release: true, expectCode: 1 },
    { name: 'pré-commercialisation + validé + hash correct', brouillon: false, statut: 'validé', hash: 'correct', entry: true, release: true, expectCode: 0 },
    { name: 'brouillon:false + en revue', brouillon: false, statut: 'en revue', hash: 'none', entry: true, expectCode: 1 },
    { name: 'brouillon:false + brouillon', brouillon: false, statut: 'brouillon', hash: 'none', entry: true, expectCode: 1 },
    { name: 'brouillon:false + validé + hash erroné', brouillon: false, statut: 'validé', hash: 'wrong', entry: true, expectCode: 1 },
    { name: 'brouillon:false sans entrée', brouillon: false, statut: 'brouillon', hash: 'none', entry: false, expectCode: 1 },
    { name: 'brouillon:true sans entrée', brouillon: true, statut: 'brouillon', hash: 'none', entry: false, expectCode: 1 },
  ]
  for (const c of cases) {
    const dir = await mkdtemp(path.join(tmpdir(), 'knuit-gate-fixture-'))
    try {
      const contentPath = path.join(dir, 'src', 'urgence', 'content.json')
      await mkdir(path.dirname(contentPath), { recursive: true })
      await writeFile(
        contentPath,
        JSON.stringify({ brouillon: c.brouillon, titre: 'Fixture' }),
      )
      let hash = '-'
      if (c.hash === 'correct') {
        const printed = await runNode(
          [GATE, '--print-hash', contentPath],
          REPO_ROOT,
        )
        expect(printed.code, printed.stderr).toBe(0)
        hash = printed.stdout.trim()
        expect(hash).toHaveLength(64)
      } else if (c.hash === 'wrong') {
        hash = '0'.repeat(64)
      }
      const lines = ['# Fixture', '']
      if (c.entry) {
        lines.push(
          '## src/urgence/content.json',
          '',
          `statut: ${c.statut}`,
          `rôle: ${c.statut === 'validé' ? 'expert premiers secours' : '-'}`,
          `date: ${c.statut === 'validé' ? '2026-11-17' : '-'}`,
          `hash: ${hash}`,
          '',
        )
      }
      await writeFile(
        path.join(dir, 'CONTENT-STATUS.md'),
        lines.join('\n'),
      )
      const result = await runNode(
        [GATE, '--root', dir, ...(c.release ? ['--release'] : [])],
        REPO_ROOT,
      )
      expect(
        result.code,
        `${c.name} : attendu ${c.expectCode}, reçu ${result.code} — ${result.stdout} ${result.stderr}`,
      ).toBe(c.expectCode)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  }
})

test.describe('rendu bidirectionnel (H2)', () => {
  let browser: Browser
  let server: Awaited<ReturnType<typeof startStaticServer>>

  test.beforeAll(async () => {
    server = await startStaticServer(DIST, TRUE_PORT)
    await waitFor(`${TRUE_BASE}/`)
    browser = await chromium.launch()
  })

  test.afterAll(async () => {
    if (server) {
      await closeServer(server)
    }
    if (browser) {
      await browser.close()
    }
  })

  for (const block of BLOCKS) {
    test(`${block.relative} — brouillon: true → bandeau visible`, async () => {
      const content = readContent(block.relative)
      // Skip conditionnel EXPLICITE (test.skip avec raison), pas un
      // test qui passe silencieusement : quand brouillon est false,
      // le bloc est publié et n'a pas de bandeau à montrer — la
      // direction true ne s'applique pas, et la direction false
      // (ci-dessous) couvre ce cas (bandeau absent). Le skip ne peut
      // pas masquer une régression : brouillon:false sans entrée
      // validée fait échouer le test gate statique, et un bandeau
      // cassé sur un bloc brouillon:true fait échouer ce test-ci
      // (qui tourne). Si la condition de skip devenait vraie pour
      // une mauvaise raison, la gate tomberait d'abord.
      test.skip(
        content.brouillon !== true,
        'bloc publié (brouillon: false) — la direction true ne s’applique pas',
      )
      if (
        typeof content.titre !== 'string' ||
        typeof content.avertissement !== 'string' ||
        typeof content.introduction !== 'string'
      ) {
        throw new Error(
          `${block.relative} : titre, avertissement ou introduction manquant`,
        )
      }
      const context = await browser.newContext()
      const page = await context.newPage()
      try {
        await page.goto(`${TRUE_BASE}${block.route}`, {
          waitUntil: 'domcontentloaded',
        })
        await expect(
          page.getByRole('heading', {
            name: content.titre,
            exact: true,
          }),
        ).toBeVisible()
        await expect(
          page.getByText(content.introduction, { exact: true }),
        ).toBeVisible()
        await expect(
          page.getByText(content.avertissement, { exact: true }),
        ).toHaveCount(1)
      } finally {
        await context.close()
      }
    })

    test(`${block.relative} — brouillon: false → bandeau absent`, async () => {
      const content = readContent(block.relative)
      if (
        typeof content.titre !== 'string' ||
        typeof content.avertissement !== 'string' ||
        typeof content.introduction !== 'string'
      ) {
        throw new Error(
          `${block.relative} : titre, avertissement ou introduction manquant`,
        )
      }
      const variant = await buildContentVariantCopy({
        contentPath: block.relative,
        mutate: (candidate) => ({ ...candidate, brouillon: false }),
        port: FALSE_PORT,
      })
      try {
        const context = await browser.newContext()
        const page = await context.newPage()
        try {
          await page.goto(`${variant.base}${block.route}`, {
            waitUntil: 'domcontentloaded',
          })
          // La page se rend (titre + introduction visibles) :
          // l'absence du bandeau n'est pas une page blanche.
          await expect(
            page.getByRole('heading', {
              name: content.titre,
              exact: true,
            }),
          ).toBeVisible()
          await expect(
            page.getByText(content.introduction, { exact: true }),
          ).toBeVisible()
          await expect(
            page.getByText(content.avertissement, { exact: true }),
          ).toHaveCount(0)
        } finally {
          await context.close()
        }
      } finally {
        await variant.cleanup()
      }
    })
  }
})
