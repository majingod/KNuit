// Migration « utilisateur existant » 0.6 → 0.8, puis kill-switch
// (tâche 0.8). Profil PERSISTANT (même userDataDir pour les phases) :
//  phase 1 : faux ancien serveur (fixture sw-0.6.js + index.html avec
//            <meta> CSP, aucun en-tête de sécurité) actif ;
//  phase 2 : bascule sur le serveur preview actuel (même port) →
//            visites en ligne jusqu'à ce que le nouveau SW prenne le
//            relais, <meta> absente, réponse cachée avec les en-têtes ;
//  phase 3 : offline → le HTML servi n'a plus de <meta>.
// Le test kill-switch est indépendant : il installe le SW actuel sur
// un profil neuf, publie le sw.js de remplacement documenté dans
// public/sw.js, puis restaure.
import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { chromium, expect, test, type BrowserContext, type Page } from '@playwright/test'
import {
  CSP,
  DIST,
  E2E_DIR,
  closeServer,
  inspectCache,
  readDistFile,
  sleep,
  startStaticServer,
  startVite,
  stopAll,
  stopChild,
  swState,
  waitFor,
  waitForServiceWorkerReady,
} from './helpers'

const APP = 'http://127.0.0.1:4178'
const OLD_META_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"

const KILL_SW = `// Kill-switch : purge les caches puis désenregistre le SW.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => self.caches.delete(key))),
      )
      .then(() => self.registration.unregister()),
  )
})
`

// Attend que plus aucun service worker ne soit enregistré. Le
// rechargement de la page ré-enregistre /sw.js (main.tsx, sur
// l'événement load) tant que le kill-sw est sur le disque : il faut
// donc d'abord attendre le load + un délai (que le register() du load
// ait eu lieu et que le cycle install → unregister du kill-sw ait
// démarré), puis sonder jusqu'à disparition de l'enregistrement. Sans
// le délai, le sondage peut réussir trop tôt — avant que le load ait
// ré-enregistré le kill-sw — et l'assertion suivante voit alors un
// enregistrement tout frais.
async function waitForUnregistered(page: Page): Promise<void> {
  await page.waitForLoadState('load')
  await sleep(2000)
  // Sondage côté Node (page.evaluate attend les promesses) : un
  // prédicat async passé à waitForFunction n'est PAS attendu par
  // Playwright (la promesse retournée est truthy), donc ce sondage
  // revenait immédiatement sans rien attendre.
  const deadline = Date.now() + 15000
  for (;;) {
    const registered = await page.evaluate(
      async () => !!(await navigator.serviceWorker.getRegistration()),
    )
    if (!registered) {
      return
    }
    if (Date.now() > deadline) {
      throw new Error('le SW est toujours enregistré après 15 s')
    }
    await sleep(250)
  }
}

function oldIndexHtml(): string {
  const html = readDistFile('index.html')
  const injected = html.replace(
    '<head>',
    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${OLD_META_CSP}">`,
  )
  expect(injected).not.toBe(html)
  return injected
}

test('migration 0.6 → 0.8 : ancien SW actif, bascule, puis offline', async () => {
  const profile = mkdtempSync(path.join(os.tmpdir(), 'knuit-migrate-'))
  const oldSw = readFileSync(
    path.resolve(E2E_DIR, 'fixtures', 'sw-0.6.js'),
    'utf8',
  )
  const oldHtml = oldIndexHtml()
  let context: BrowserContext | undefined
  let oldServer: Awaited<ReturnType<typeof startStaticServer>> | undefined
  try {
    context = await chromium.launchPersistentContext(profile, {
      args: ['--no-sandbox'],
    })
    const page = context.pages()[0] ?? (await context.newPage())

    // Phase 1 : ancien serveur (0.6).
    oldServer = await startStaticServer(DIST, 4178, {
      overrides: {
        '/sw.js': { body: oldSw },
        '/': { body: oldHtml },
        '/index.html': { body: oldHtml },
      },
    })
    await waitFor(`${APP}/`)
    await page.goto(`${APP}/`, { waitUntil: 'domcontentloaded' })
    await waitForServiceWorkerReady(page)
    await sleep(2000)
    const before = await swState(page)
    expect(before.registered).toBe(true)
    expect(before.caches).toContain('knuit-v1')
    expect(before.metaCSP).toBe(true)

    // Phase 2 : bascule sur le serveur actuel (même port).
    await closeServer(oldServer)
    oldServer = undefined
    const preview = startVite('preview', 4178)
    await waitFor(`${APP}/`)
    let navHeaders: Record<string, string> | null = null
    page.on('response', (response) => {
      if (
        response.url() === `${APP}/` &&
        response.request().resourceType() === 'document'
      ) {
        navHeaders = response.headers()
      }
    })
    let visits = 0
    let after = await swState(page)
    for (let i = 0; i < 5; i++) {
      await page.goto(`${APP}/`, { waitUntil: 'domcontentloaded' })
      visits++
      await sleep(2500)
      after = await swState(page)
      const migrated =
        after.caches.some((key) => /^knuit-[0-9a-f]{12}$/.test(key)) &&
        !after.caches.includes('knuit-v1')
      if (migrated) {
        break
      }
    }
    expect(visits).toBeLessThanOrEqual(5)
    expect(after.caches).not.toContain('knuit-v1')
    expect(after.caches.some((key) => /^knuit-[0-9a-f]{12}$/.test(key))).toBe(true)
    expect(after.metaCSP).toBe(false)
    expect(navHeaders).not.toBeNull()
    expect(navHeaders?.['content-security-policy']).toBe(CSP)
    expect(navHeaders?.['x-frame-options']).toBe('DENY')
    expect(navHeaders?.['cache-control']).toBe('no-cache')
    const cached = await inspectCache(page)
    expect(cached.indexHeaders?.['content-security-policy']).toBe(CSP)

    // Phase 3 : offline.
    // VRAI hors-ligne (tâche 0.9) : on arrête le serveur — sinon le
    // SW atteindrait encore le réseau malgré setOffline et le reload
    // servirait du frais (vacuité, voir helpers.ts).
    stopChild(preview)
    const failed: string[] = []
    page.on('requestfailed', (request) => failed.push(request.url()))
    await context.setOffline(true)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await sleep(2000)
    const offline = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent ?? '(absent)',
      mainMaxWidth: getComputedStyle(document.querySelector('main')!).maxWidth,
      metaCSP: !!document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]',
      ),
    }))
    expect(offline.h1).toBe('Application')
    expect(offline.mainMaxWidth).toBe('640px')
    expect(offline.metaCSP).toBe(false)
    expect(failed).toEqual([])
    await context.setOffline(false)
  } finally {
    await context?.close()
    if (oldServer) {
      await closeServer(oldServer)
    }
    await stopAll()
    rmSync(profile, { recursive: true, force: true })
  }
})

test('kill-switch : le SW de remplacement se désenregistre et purge les caches', async () => {
  const profile = mkdtempSync(path.join(os.tmpdir(), 'knuit-kill-'))
  const swPath = path.join(DIST, 'sw.js')
  const blankPath = path.join(DIST, 'test-blank.html')
  const swBackup = readFileSync(swPath, 'utf8')
  let context: BrowserContext | undefined
  try {
    startVite('preview', 4178)
    await waitFor(`${APP}/`)
    context = await chromium.launchPersistentContext(profile, {
      args: ['--no-sandbox'],
    })
    const page = context.pages()[0] ?? (await context.newPage())
    await page.goto(`${APP}/`, { waitUntil: 'domcontentloaded' })
    await waitForServiceWorkerReady(page)
    await sleep(1500)
    const installed = await swState(page)
    expect(installed.registered).toBe(true)
    expect(installed.caches).toHaveLength(1)

    // Page blanche SANS enregistrement de SW : si on naviguait vers
    // l'application, main.tsx ré-enregistrerait /sw.js à chaque
    // chargement tant que le kill-sw est sur le disque, et
    // l'enregistrement oscillerait (install → unregister →
    // ré-enregistrement) — le test serait sensible au timing. La
    // navigation vers la page blanche déclenche quand même la
    // vérification de mise à jour du SW, sans jamais ré-enregistrer :
    // une fois l'enregistrement disparu, il le reste.
    writeFileSync(
      blankPath,
      '<!doctype html><html><head><meta charset="utf-8"><title>blank</title></head><body><h1>blank</h1></body></html>',
    )
    writeFileSync(swPath, KILL_SW)
    await page.goto(`${APP}/test-blank.html`, {
      waitUntil: 'domcontentloaded',
    })
    await waitForUnregistered(page)
    const killed = await page.evaluate(async () => ({
      registered: !!(await navigator.serviceWorker.getRegistration()),
      caches: await caches.keys(),
    }))
    expect(killed.registered).toBe(false)
    expect(killed.caches).toEqual([])

    // Restauration : le SW actuel se ré-enregistre.
    writeFileSync(swPath, swBackup)
    unlinkSync(blankPath)
    await page.goto(`${APP}/`, { waitUntil: 'domcontentloaded' })
    await waitForServiceWorkerReady(page)
    await sleep(1500)
    const restored = await swState(page)
    expect(restored.registered).toBe(true)
    expect(restored.caches).toHaveLength(1)
  } finally {
    writeFileSync(swPath, swBackup)
    try {
      unlinkSync(blankPath)
    } catch {
      // Déjà supprimé.
    }
    await context?.close()
    await stopAll()
    rmSync(profile, { recursive: true, force: true })
  }
})
