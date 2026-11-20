// Allowlist du runtime caching (tâche 1.0, Haute) : /api/status ne
// doit JAMAIS être mis en cache, toujours toucher le réseau.
// Le serveur de test renvoie un compteur qui s'incrémente à chaque
// appel : deux réponses successives différentes prouvent que les deux
// requêtes ont touché le réseau (si le SW servait du cache, la 2e
// réponse porterait le même compteur que la 1re). VRAI hors-ligne
// (tâche 0.9) : on ARRÊTE le serveur avant la phase offline —
// setOffline seul ne bloque pas les fetch() du SW.
import type { Server } from 'node:http'
import { chromium, expect, test, type Browser } from '@playwright/test'
import {
  closeServer,
  DIST,
  startStaticServer,
  waitFor,
  waitForServiceWorkerReady,
} from './helpers'

const BASE = 'http://127.0.0.1:4184'
let browser: Browser
let server: Server
let apiCount = 0
let apiDataCount = 0

test.beforeAll(async () => {
  server = await startStaticServer(DIST, 4184, {
    overrides: {
      '/api/status': {
        headers: { 'content-type': 'application/json' },
        body: () => {
          apiCount += 1
          return JSON.stringify({ status: 'ok', count: apiCount })
        },
      },
      // Route API portant une extension LISTÉE (.js) : l'allowlist par
      // extension seule la laisserait passer — c'est la garde
      // startsWith('/api/') qui la protège (tâche 1.0, revue Master).
      '/api/data.js': {
        body: () => {
          apiDataCount += 1
          return `/* api-data ${apiDataCount} */`
        },
      },
    },
  })
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  await browser.close()
  await closeServer(server)
})

// Deux fetch() successifs de /api/status, en ligne : les compteurs
// doivent différer (les deux requêtes ont touché le serveur), et
// aucune entrée /api/status ne doit exister dans le Cache Storage.
test('en ligne : /api/status touche le réseau à chaque requête, jamais le cache', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)

  const first = await page.evaluate(async () => {
    const response = await fetch('/api/status')
    return (await response.json()) as { status: string; count: number }
  })
  const second = await page.evaluate(async () => {
    const response = await fetch('/api/status')
    return (await response.json()) as { status: string; count: number }
  })
  expect(first.status).toBe('ok')
  expect(second.status).toBe('ok')
  // Si le SW servait la 1re réponse depuis le cache, les compteurs
  // seraient identiques : c'est la preuve que rien n'a été caché.
  expect(second.count).toBe(first.count + 1)

  const cachedPaths = await page.evaluate(async () => {
    const out: string[] = []
    for (const key of await caches.keys()) {
      const cache = await caches.open(key)
      for (const request of await cache.keys()) {
        out.push(new URL(request.url).pathname)
      }
    }
    return out
  })
  expect(cachedPaths).not.toContain('/api/status')
  await context.close()
})

// /api/data.js : une route API avec une extension LISTÉE (.js) doit
// elle aussi toucher le réseau à chaque requête et ne jamais être
// mise en cache — c'est la garde startsWith('/api/') qui la protège,
// pas l'allowlist par extension (tâche 1.0, revue Master).
test('en ligne : /api/data.js (extension listée sur une route API) touche le réseau à chaque requête, jamais le cache', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)

  const parseCount = (text: string) => {
    const match = text.match(/api-data (\d+)/)
    if (!match) throw new Error(`compteur introuvable dans : ${text}`)
    return Number(match[1])
  }
  const first = parseCount(
    await page.evaluate(async () => (await fetch('/api/data.js')).text()),
  )
  const second = parseCount(
    await page.evaluate(async () => (await fetch('/api/data.js')).text()),
  )
  // Si le SW servait la 1re réponse depuis le cache, les compteurs
  // seraient identiques : c'est la preuve que rien n'a été caché.
  expect(second).toBe(first + 1)

  const cachedPaths = await page.evaluate(async () => {
    const out: string[] = []
    for (const key of await caches.keys()) {
      const cache = await caches.open(key)
      for (const request of await cache.keys()) {
        out.push(new URL(request.url).pathname)
      }
    }
    return out
  })
  expect(cachedPaths).not.toContain('/api/data.js')
  await context.close()
})

// Après l'arrêt du serveur (vrai offline), un fetch de /api/status
// doit échouer côté réseau (503 minimale du SW), jamais être servi
// depuis le cache — alors que la page elle-même se recharge depuis
// le cache (les assets de l'allowlist restent cachés).
test('hors-ligne : /api/status échoue, pas de réponse servie depuis le cache', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)
  const online = await page.evaluate(async () => {
    const response = await fetch('/api/status')
    return response.status
  })
  expect(online).toBe(200)

  // VRAI hors-ligne : on arrête le serveur, puis setOffline en
  // ceinture et bretelles.
  await closeServer(server)
  await context.setOffline(true)

  const offlineStatus = await page.evaluate(async () => {
    const response = await fetch('/api/status')
    return response.status
  })
  // 503 minimale du SW (échec réseau), pas un 200 servi depuis le
  // cache : si /api/status avait été mis en cache en ligne, ce
  // fetch retournerait 200 avec le JSON compté.
  expect(offlineStatus).toBe(503)

  // La page elle-même se recharge depuis le cache : l'allowlist n'a
  // pas cassé le caching des assets statiques.
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('h1')).toHaveText('Bienvenue sur Kink de Nuit')
  await context.close()
})
