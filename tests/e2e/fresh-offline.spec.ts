// Profil neuf hors-ligne (tâche 0.8) : séquence FIXE install (1re
// visite) → reload → passage hors-ligne → navigation, cache HTTP
// désactivé via CDP (le rendu hors-ligne ne peut venir que du SW),
// inspection des en-têtes de la réponse cachée, manifest et rejets
// d'enregistrement du SW, cas 404 du manifest.
import { cpSync, mkdtempSync, rmSync, unlinkSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { chromium, expect, test, type Browser } from '@playwright/test'
import {
  CSP,
  DIST,
  closeServer,
  inspectCache,
  sleep,
  startStaticServer,
  startVite,
  stopAll,
  swState,
  waitFor,
  waitForServiceWorkerReady,
  type StaticOverride,
} from './helpers'

const BASE = 'http://127.0.0.1:4174'
let browser: Browser

test.beforeAll(async () => {
  startVite('preview', 4174)
  await waitFor(`${BASE}/`)
  browser = await chromium.launch()
})

test.afterAll(async () => {
  await browser.close()
  await stopAll()
})

test('profil neuf : visite en ligne → 1 reload → offline, page rendue avec CSS', async () => {
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

  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)
  await sleep(1500)
  const first = await swState(page)
  expect(first.registered).toBe(true)
  // clients.claim() : la 1re visite est déjà contrôlée.
  expect(first.controller).toBe(true)

  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await sleep(2000)
  const offline = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent ?? '(absent)',
    mainMaxWidth: getComputedStyle(document.querySelector('main')!).maxWidth,
    metaCSP: !!document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]',
    ),
    controller: !!navigator.serviceWorker.controller,
  }))
  expect(offline.h1).toBe('Application')
  expect(offline.mainMaxWidth).toBe('640px')
  expect(offline.metaCSP).toBe(false)
  expect(offline.controller).toBe(true)
  expect(failed).toEqual([])
  expect(errors).toEqual([])
  await context.setOffline(false)
  await context.close()
})

test('la réponse /index.html cachée porte la CSP (inspection Cache Storage)', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)
  await sleep(1500)
  const cache = await inspectCache(page)
  expect(cache.keys).toHaveLength(1)
  expect(cache.keys[0]).toMatch(/^knuit-[0-9a-f]{12}$/)
  const entries = cache.entries[cache.keys[0]]
  expect(entries).toContain('/index.html')
  expect(entries).toContain('/manifest.webmanifest')
  // Les assets hashés sont dans le pré-cache (injection build-time),
  // pas seulement en runtime caching.
  expect(entries.filter((entry) => /^\/assets\/index-[^/]+\.js$/.test(entry))).toHaveLength(1)
  expect(entries.filter((entry) => /^\/assets\/index-[^/]+\.css$/.test(entry))).toHaveLength(1)
  expect(cache.indexHeaders).not.toBeNull()
  expect(cache.indexHeaders?.['content-security-policy']).toBe(CSP)
  expect(cache.indexHeaders?.['x-frame-options']).toBe('DENY')
  expect(cache.indexHeaders?.['cache-control']).toBe('no-cache')
  await context.close()
})

test('manifest 200 sans violation + register(data:) et cross-origin rejetés', async () => {
  const manifest = await fetch(`${BASE}/manifest.webmanifest`)
  expect(manifest.status).toBe(200)
  const manifestBody = await manifest.json()
  expect(manifestBody).toBeDefined()
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await waitForServiceWorkerReady(page)
  const rejected = await page.evaluate(async () => {
    const out: Record<string, string> = {}
    try {
      await navigator.serviceWorker.register('data:text/javascript,')
      out.data = 'ACCEPTÉ'
    } catch (error) {
      out.data = (error as Error).name
    }
    try {
      await navigator.serviceWorker.register('https://example.com/sw.js')
      out.cross = 'ACCEPTÉ'
    } catch (error) {
      out.cross = (error as Error).name
    }
    return out
  })
  expect(rejected.data).toBe('TypeError')
  expect(rejected.cross).toBe('SecurityError')
  expect(errors.filter((error) => error.includes('Content Security Policy'))).toEqual([])
  await context.close()
})

test('404 du manifest : l’installation réussit quand même', async () => {
  const tmpDist = mkdtempSync(path.join(os.tmpdir(), 'knuit-no-manifest-'))
  const headersFor = (pathname: string): Record<string, string> => {
    const noCache = ['/', '/index.html', '/manifest.webmanifest', '/sw.js'].includes(
      pathname,
    )
    return {
      'content-security-policy': CSP,
      'x-frame-options': 'DENY',
      ...(noCache ? { 'cache-control': 'no-cache' } : {}),
    }
  }
  const overrides: Record<string, StaticOverride> = {}
  let server: Awaited<ReturnType<typeof startStaticServer>> | undefined
  try {
    cpSync(DIST, tmpDist, { recursive: true })
    unlinkSync(path.join(tmpDist, 'manifest.webmanifest'))
    server = await startStaticServer(tmpDist, 4175, {
      overrides,
      headers: headersFor,
    })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:4175/', {
      waitUntil: 'domcontentloaded',
    })
    await waitForServiceWorkerReady(page)
    await sleep(1500)
    const cache = await inspectCache(page)
    expect(cache.keys).toHaveLength(1)
    expect(cache.entries[cache.keys[0]]).toContain('/index.html')
    await context.close()
  } finally {
    if (server) {
      await closeServer(server)
    }
    rmSync(tmpDist, { recursive: true, force: true })
  }
})
