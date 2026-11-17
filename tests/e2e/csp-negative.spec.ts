// Batterie négative CSP avec en-têtes HTTP effectifs (tâche 0.8).
// Contrairement à une injection CDP (qui contourne la CSP), le code
// de test tourne dans un vrai <script type="module"> same-origin,
// donc soumis à la CSP des en-têtes — c'est la preuve que la
// politique s'applique réellement. Le code de test est une chaîne
// écrite dans dist/ (jamais du code du fichier de test lui-même) :
// ESLint interdit eval / innerHTML dans le code source, pas dans
// les chaînes de test.
import { unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { DIST, sleep, startVite, stopAll, waitFor } from './helpers'

const BASE = 'http://127.0.0.1:4176'

const HTML = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>test-csp</title>
<script>window.__inlineRan = 1</script>
<style>body { color: rgb(255, 0, 0) }</style>
</head><body><script type="module" src="/test-eval.js"></script></body></html>
`

const JS = `// Code de test exécuté comme un vrai script same-origin (CSP applicable).
window.__results = {}
try { eval('1+1'); window.__results.eval = 'EXECUTE !' }
catch (e) { window.__results.eval = 'BLOQUE : ' + e.message }
try { new Function('return 1')(); window.__results.newFunction = 'EXECUTE !' }
catch (e) { window.__results.newFunction = 'BLOQUE : ' + e.message }
const d1 = document.createElement('div')
d1.innerHTML = '<img src="x" onerror="window.__xss1=1">'
document.body.appendChild(d1)
window.__results.imgOnerror = window.__xss1 === 1 ? 'EXECUTE !' : 'bloqué'
try {
  document.body.setHTMLUnsafe('<img src="x" onerror="window.__xss2=1">')
  window.__results.unsafeHTML = window.__xss2 === 1 ? 'EXECUTE !' : 'bloqué'
} catch (e) { window.__results.setHTMLUnsafe = 'ERREUR : ' + e.message }
const btn = document.createElement('button')
btn.setAttribute('onclick', 'window.__xss3=1')
document.body.appendChild(btn)
btn.click()
window.__results.onclickAttr = window.__xss3 === 1 ? 'EXECUTE !' : 'bloqué'
const d2 = document.createElement('div')
d2.innerHTML = '<script>window.__xss4=1</scr' + 'ipt>'
document.body.appendChild(d2)
window.__results.scriptInnerHTML = window.__xss4 === 1 ? 'EXECUTE !' : 'bloqué'
document.body.setAttribute('style', 'color: rgb(0, 0, 255)')
window.__results.styleAttr = getComputedStyle(document.body).color
document.body.style.backgroundColor = 'rgb(0, 0, 255)'
window.__results.styleProp = getComputedStyle(document.body).backgroundColor
document.title = 'DONE'
`

test.beforeAll(async () => {
  writeFileSync(path.join(DIST, 'test-csp.html'), HTML)
  writeFileSync(path.join(DIST, 'test-eval.js'), JS)
  startVite('preview', 4176)
  await waitFor(`${BASE}/`)
})

test.afterAll(async () => {
  try {
    unlinkSync(path.join(DIST, 'test-csp.html'))
  } catch {
    // Déjà supprimé.
  }
  try {
    unlinkSync(path.join(DIST, 'test-eval.js'))
  } catch {
    // Déjà supprimé.
  }
  await stopAll()
})

test('batterie négative : tout est bloqué sauf el.style.prop', async ({ page }) => {
  const htmlResponse = await fetch(`${BASE}/test-csp.html`)
  expect(htmlResponse.headers.get('content-security-policy')).not.toBeNull()
  const jsResponse = await fetch(`${BASE}/test-eval.js`)
  expect(jsResponse.headers.get('content-security-policy')).not.toBeNull()

  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

  await page.goto(`${BASE}/test-csp.html`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.title === 'DONE', null, {
    timeout: 10000,
  })
  await sleep(1000)

  const results = await page.evaluate(() => {
    const win = window as unknown as {
      __inlineRan?: number
      __results?: Record<string, string>
    }
    return {
      inlineRan: win.__inlineRan === 1 ? 'EXECUTE !' : 'bloqué',
      bodyColor: getComputedStyle(document.body).color,
      results: win.__results ?? null,
    }
  })

  expect(results.inlineRan).toBe('bloqué')
  // <style> inline bloqué : le rouge ne doit pas être appliqué.
  expect(results.bodyColor).not.toBe('rgb(255, 0, 0)')
  expect(results.results).not.toBeNull()
  const r = results.results as Record<string, string>
  expect(r.eval).toMatch(/^BLOQUE/)
  expect(r.newFunction).toMatch(/^BLOQUE/)
  expect(r.imgOnerror).toBe('bloqué')
  expect(r.unsafeHTML).toBe('bloqué')
  expect(r.onclickAttr).toBe('bloqué')
  expect(r.scriptInnerHTML).toBe('bloqué')
  // Attribut style bloqué : le bleu ne doit pas être appliqué.
  expect(r.styleAttr).not.toBe('rgb(0, 0, 255)')
  // el.style.prop est une API DOM, hors CSP : autorisé, attendu.
  expect(r.styleProp).toBe('rgb(0, 0, 255)')
  // Au moins une violation CSP vue en console (la preuve runtime).
  expect(
    errors.filter((error) => error.includes('Content Security Policy')),
  ).not.toHaveLength(0)
})
