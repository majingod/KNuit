// En-têtes HTTP contre un serveur statique RÉEL (tâche 1.0,
// Moyenne) : la migration 0.7 n'était prouvée que sur vite preview,
// qui n'est pas ce qui servira en production. Ce test démarre un
// serveur statique minimal (Node http, via startStaticServer) qui
// sert dist/ en posant manuellement les mêmes en-têtes que le plugin
// Vite (CSP exacte, X-Frame-Options DENY, Cache-Control: no-cache
// sur les 4 ressources), puis rejoue la même batterie que
// headers.spec.ts contre lui. Si ce test est vert, les en-têtes sont
// prouvés indépendamment de vite.
import { expect, test } from '@playwright/test'
import { closeServer, CSP, DIST, startStaticServer, waitFor } from './helpers'

// Politique attendue, recopiée LITTÉRALEMENT depuis vite.config.ts
// (source de vérité) — pas importée de helpers.ts. Le serveur de
// test pose ses en-têtes à partir de CSP (helpers.ts, comme le ferait
// un opérateur qui configure le serveur de prod d'après la politique
// documentée), mais l'assertion compare contre CE littéral : si la
// politique documentée dérive, ce test échoue et force la mise à jour
// des trois endroits (vite.config.ts, helpers.ts, ici). Sans ce
// littéral, le test comparerait la politique à elle-même et passerait
// même avec une politique fausse — le piège exact de 0.9.
const EXPECTED_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"

const BASE = 'http://127.0.0.1:4183'
const RESOURCES = ['/', '/index.html', '/manifest.webmanifest', '/sw.js']

let server: Awaited<ReturnType<typeof startStaticServer>>

function securityHeaders(pathname: string): Record<string, string> {
  const headers: Record<string, string> = {
    'content-security-policy': CSP,
    'x-frame-options': 'DENY',
  }
  if (
    pathname === '/' ||
    pathname === '/index.html' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js'
  ) {
    headers['cache-control'] = 'no-cache'
  }
  return headers
}

test.beforeAll(async () => {
  server = await startStaticServer(DIST, 4183, { headers: securityHeaders })
  await waitFor(`${BASE}/`)
})

test.afterAll(async () => {
  await closeServer(server)
})

async function checkFourResources(base: string): Promise<void> {
  for (const resource of RESOURCES) {
    const response = await fetch(`${base}${resource}`)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-security-policy')).toBe(
      EXPECTED_CSP,
    )
    expect(response.headers.get('x-frame-options')).toBe('DENY')
    expect(response.headers.get('cache-control')).toBe('no-cache')
  }
}

test('serveur statique réel : CSP exacte + XFO DENY + no-cache sur les 4 ressources', async () => {
  await checkFourResources(BASE)
})

test('serveur statique réel : aucune <meta> CSP dans le HTML servi', async () => {
  const html = await (await fetch(`${BASE}/`)).text()
  expect(html).not.toContain('http-equiv="Content-Security-Policy"')
})

// Fallback SPA (Phase 1, tâche 1, Voie A) : en production, /urgence
// doit être servi par l'hébergeur comme /index.html (try_files $uri
// /index.html). prod-headers teste les en-têtes, pas ce fallback : si
// l'hébergeur ne le fait pas, /urgence → 404 en prod alors que le test
// passe en preview (Vite fait le fallback). Ce test prouve l'exigence
// et que le serveur DE TEST l'implémente — même nuance que
// prod-headers (vérificateur, pas prod) : la config de l'hébergeur
// réel sera validée au premier déploiement (tâche 1.1, curl -I).
test('serveur statique réel : fallback SPA — GET /urgence retourne 200 avec le HTML de index.html', async () => {
  const indexHtml = await (await fetch(`${BASE}/`)).text()
  const response = await fetch(`${BASE}/urgence`)
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toContain('text/html')
  const html = await response.text()
  expect(html).toBe(indexHtml)
  expect(html).toContain('<div id="app">')
})

// Contrôle négatif du fallback : un asset manquant reste un 404 —
// le fallback ne doit pas avaler les assets (le test « 404 du
// manifest » de fresh-offline.spec.ts en dépend aussi).
test('serveur statique réel : fallback SPA — un asset manquant reste un 404', async () => {
  const response = await fetch(`${BASE}/assets/inexistant.js`)
  expect(response.status).toBe(404)
})
