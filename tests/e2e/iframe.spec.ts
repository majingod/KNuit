// Iframe cross-origin refusée (tâche 0.8) : parent servi sur une
// autre origine (localhost:4180 contre 127.0.0.1:4177). Preuve
// attendue : refus EFFECTIF (contentDocument null + erreur console
// « Refused to display »), pas seulement la directive présente.
import type { Server } from 'node:http'
import { expect, test } from '@playwright/test'
import { closeServer, sleep, startStaticServer, startVite, stopAll, waitFor } from './helpers'

const APP = 'http://127.0.0.1:4177'
const PARENT = 'http://localhost:4180'

const PARENT_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>parent</title></head>
<body><h1>parent</h1>
<iframe id="f" src="${APP}/" style="width:400px;height:300px"></iframe>
</body></html>
`

let parentServer: Server | undefined

test.beforeAll(async () => {
  startVite('preview', 4177)
  await waitFor(`${APP}/`)
  parentServer = await startStaticServer('', 4180, {
    overrides: {
      '/': { headers: { 'content-type': 'text/html' }, body: PARENT_HTML },
    },
  })
})

test.afterAll(async () => {
  if (parentServer) {
    await closeServer(parentServer)
  }
  await stopAll()
})

test('tentative d’iframe depuis une autre origine : refus effectif', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  await page.goto(`${PARENT}/`, { waitUntil: 'domcontentloaded' })
  await sleep(4000)
  const info = await page.evaluate(() => {
    const frame = document.getElementById('f') as HTMLIFrameElement | null
    let content = 'inaccessible'
    try {
      content = frame?.contentDocument
        ? frame.contentDocument.title || '(document vide)'
        : '(contentDocument null)'
    } catch {
      content = 'inaccessible (cross-origin bloqué)'
    }
    return { content }
  })
  expect(info.content).toBe('(contentDocument null)')
  // window.frames.length compte l'élément <iframe> lui-même, même
  // bloqué : il vaut 1 ici. La preuve du refus est le contentDocument
  // null + l'erreur console, pas le nombre de frames.
  expect(
    errors.filter((error) =>
      /Refused to display|frame-ancestors|X-Frame-Options/i.test(error),
    ),
  ).not.toHaveLength(0)
})
