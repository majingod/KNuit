// Helpers partagés de la suite de non-régression (tâche 0.8).
// Reprend les patterns des tests manuels 0.7 (démarrage de vite par
// son binaire direct, pour que le signal d'arrêt atteigne vite
// lui-même ; inspection du Cache Storage depuis la page).
import { spawn, type ChildProcess } from 'node:child_process'
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import http, { type Server } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'

export const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
export const E2E_DIR = path.dirname(fileURLToPath(import.meta.url))
export const DIST = path.join(REPO_ROOT, 'dist')

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function waitFor(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return
      }
    } catch {
      // Pas encore là.
    }
    await sleep(300)
  }
  throw new Error(`timeout en attendant ${url}`)
}

const children: ChildProcess[] = []

export function startVite(mode: 'dev' | 'preview', port: number): ChildProcess {
  const args =
    mode === 'dev'
      ? ['--port', String(port), '--host', '127.0.0.1']
      : ['preview', '--port', String(port), '--host', '127.0.0.1']
  const child = spawn(path.join(REPO_ROOT, 'node_modules', '.bin', 'vite'), args, {
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout?.on('data', () => {})
  child.stderr?.on('data', () => {})
  children.push(child)
  return child
}

export async function stopAll(): Promise<void> {
  for (const child of children) {
    try {
      child.kill('SIGKILL')
    } catch {
      // Déjà arrêté.
    }
  }
  children.length = 0
  await sleep(800)
}

// Arrête UN SEUL processus vite (sans toucher aux autres serveurs
// partagés du fichier) et le retire de la liste des enfants.
export function stopChild(child: ChildProcess): void {
  try {
    child.kill('SIGKILL')
  } catch {
    // Déjà arrêté.
  }
  const index = children.indexOf(child)
  if (index !== -1) {
    children.splice(index, 1)
  }
}

// VRAI hors-ligne (tâche 0.9) : `context.setOffline(true)` NE BLOQUE
// PAS les fetch() émis depuis le service worker. L'émulation réseau
// CDP s'applique à la cible de la page, pas à celle du worker : la
// page est offline (ses requêtes directes échouent), mais le SW
// atteint encore le serveur — ses fetch() réseau réussissent et
// servent du frais. Les tests « offline » de 0.7/0.8 qui reposaient
// sur setOffline seul étaient donc VACUITES : la page se rendait
// même avec un cache vide. La seule façon fiable de couper le réseau
// pour le SW aussi est d'ARRÊTER le serveur (connection refused
// pour chaque fetch, page comme SW). Les tests offline démarrent
// donc leur propre serveur vite sur un port dédié, puis l'arrêtent
// (stopChild) avant la phase hors-ligne. setOffline(true) est gardé
// en ceinture et bretelles pour les requêtes directes de la page.

// Ferme un serveur HTTP en détruisant les connexions keep-alive :
// sans cela, server.close() attendrait les connexions du navigateur
// et le port ne serait pas libéré pour le serveur suivant.
export async function closeServer(server: Server): Promise<void> {
  server.closeAllConnections?.()
  await new Promise<void>((resolve) => {
    server.close(() => resolve())
  })
}

// Attend qu'un service worker soit enregistré ET actif, par sondage
// côté Node (page.evaluate attend les promesses, contrairement à
// page.waitForFunction dont le prédicat async n'est pas attendu —
// un prédicat `() => navigator.serviceWorker.ready` retourne une
// promesse, donc truthy immédiatement, et n'attend rien).
export async function waitForServiceWorkerReady(
  page: Page,
  timeoutMs = 15000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const ready = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration()
      return !!registration?.active
    })
    if (ready) {
      return
    }
    if (Date.now() > deadline) {
      throw new Error('service worker non prêt après 15 s')
    }
    await sleep(250)
  }
}
// État du service worker vu depuis la page.
export async function swState(page: Page): Promise<{
  registered: boolean
  controller: boolean
  caches: string[]
  metaCSP: boolean
}> {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    return {
      registered: !!registration,
      controller: !!navigator.serviceWorker.controller,
      caches: await caches.keys(),
      metaCSP: !!document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]',
      ),
    }
  })
}

// Contenu du Cache Storage vu depuis la page : clés, entrées par
// cache, et en-têtes de la réponse /index.html cachée (équivalent
// programmatique de DevTools > Application > Cache Storage > Headers).
export async function inspectCache(page: Page): Promise<{
  keys: string[]
  entries: Record<string, string[]>
  indexHeaders: Record<string, string> | null
}> {
  return page.evaluate(async () => {
    const keys = await caches.keys()
    const out: {
      keys: string[]
      entries: Record<string, string[]>
      indexHeaders: Record<string, string> | null
    } = { keys, entries: {}, indexHeaders: null }
    for (const key of keys) {
      const cache = await caches.open(key)
      out.entries[key] = (await cache.keys()).map(
        (request) => new URL(request.url).pathname,
      )
      if (!out.indexHeaders) {
        const response = await cache.match('/index.html')
        if (response) {
          out.indexHeaders = Object.fromEntries(response.headers.entries())
        }
      }
    }
    return out
  })
}

export interface StaticOverride {
  status?: number
  headers?: Record<string, string>
  // Corps fixe, ou fonction appelée à chaque requête (tâche 1.0 :
  // l'endpoint /api/status de test renvoie un compteur qui
  // s'incrémente à chaque appel — deux réponses successives
  // différentes prouvent que les deux requêtes ont touché le réseau
  // et qu'aucune n'a été servie depuis le cache du SW).
  body?: string | Buffer | (() => string | Buffer)
}

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webmanifest': 'application/manifest+json',
}

// Petit serveur statique de test : sert les fichiers de `root`, avec
// des surcharges par chemin (statut, en-têtes, corps) et des en-têtes
// par défaut calculés par chemin. Sert pour le cas 404 du manifest
// et pour simuler un ancien serveur (0.6) dans le test de migration.
export async function startStaticServer(
  root: string,
  port: number,
  options: {
    overrides?: Record<string, StaticOverride>
    headers?: (pathname: string) => Record<string, string>
  } = {},
): Promise<Server> {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(
      (request.url ?? '/').split('?')[0],
    )
    const override = options.overrides?.[pathname]
    const headers: Record<string, string> = {
      ...(options.headers ? options.headers(pathname) : {}),
      ...(override?.headers ?? {}),
    }
    if (override?.body !== undefined) {
      const extension = pathname === '/' ? '.html' : path.extname(pathname)
      const body =
        typeof override.body === 'function' ? override.body() : override.body
      response.writeHead(override.status ?? 200, {
        'content-type': MIME[extension] ?? 'application/octet-stream',
        ...headers,
      })
      response.end(body)
      return
    }
    const file = path.join(root, pathname === '/' ? 'index.html' : pathname)
    if (!existsSync(file) || statSync(file).isDirectory()) {
      // Fallback SPA (Phase 1, tâche 1, Voie A) : un chemin sans
      // extension (route applicative comme /urgence) est servi avec
      // index.html — c'est le comportement attendu d'un hébergeur SPA
      // (try_files $uri /index.html). Un chemin AVEC extension (asset
      // manquant, ex. /manifest.webmanifest absent) reste un 404 : un
      // asset n'est jamais une route. Un statut explicite dans
      // l'override est respecté tel quel (pas de fallback).
      // Portée honnête : ce serveur de test prouve l'exigence et
      // qu'il l'implémente ; la config de l'hébergeur réel sera
      // validée au premier déploiement (tâche 1.1, curl -I) — même
      // nuance que prod-headers (vérificateur, pas prod).
      const indexFile = path.join(root, 'index.html')
      if (
        override?.status === undefined &&
        path.extname(pathname) === '' &&
        existsSync(indexFile)
      ) {
        response.writeHead(200, {
          ...headers,
          'content-type': 'text/html',
        })
        createReadStream(indexFile).pipe(response)
        return
      }
      response.writeHead(override?.status ?? 404, headers)
      response.end('not found')
      return
    }
    response.writeHead(override?.status ?? 200, {
      ...headers,
      'content-type':
        MIME[path.extname(file)] ?? 'application/octet-stream',
    })
    createReadStream(file).pipe(response)
  })
  await new Promise<void>((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve())
  })
  return server
}

export function readDistFile(relative: string): string {
  return readFileSync(path.join(DIST, relative), 'utf8')
}
