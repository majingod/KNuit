// En-têtes HTTP effectifs (tâche 0.8) : la CSP exacte, X-Frame-Options
// et Cache-Control: no-cache sur les 4 ressources qui portent ou
// déclenchent la sécurité, en dev ET en preview (même politique
// partout, pas de divergence preview/prod), et aucune <meta> CSP dans
// le HTML servi.
import { expect, test } from '@playwright/test'
import { CSP, startVite, stopAll, waitFor } from './helpers'

const PREVIEW = 'http://127.0.0.1:4173'
const DEV = 'http://127.0.0.1:5173'
const RESOURCES = ['/', '/index.html', '/manifest.webmanifest', '/sw.js']

test.beforeAll(async () => {
  startVite('preview', 4173)
  startVite('dev', 5173)
  await waitFor(`${PREVIEW}/`)
  await waitFor(`${DEV}/`)
})

test.afterAll(async () => {
  await stopAll()
})

async function checkFourResources(base: string): Promise<void> {
  for (const resource of RESOURCES) {
    const response = await fetch(`${base}${resource}`)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-security-policy')).toBe(CSP)
    expect(response.headers.get('x-frame-options')).toBe('DENY')
    expect(response.headers.get('cache-control')).toBe('no-cache')
  }
}

test('preview : CSP exacte + XFO DENY + no-cache sur les 4 ressources', async () => {
  await checkFourResources(PREVIEW)
})

test('preview : aucune <meta> CSP dans le HTML servi', async () => {
  const html = await (await fetch(`${PREVIEW}/`)).text()
  expect(html).not.toContain('http-equiv="Content-Security-Policy"')
})

test('dev : mêmes en-têtes sur les 4 ressources', async () => {
  await checkFourResources(DEV)
})
