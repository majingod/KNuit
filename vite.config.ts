import preact from '@preact/preset-vite'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const ROOT = dirname(fileURLToPath(import.meta.url))

// Politique de sécurité exacte (tâche 0.7) — UNE seule source de vérité
// pour dev et preview (plugin ci-dessous). Le futur serveur de production
// DOIT appliquer exactement les mêmes en-têtes ; aucune divergence
// preview/prod. La CSP ne vit plus dans une <meta> (retirée en 0.7) : la
// <meta> ne couvrait ni frame-ancestors, ni les ressources chargées avant
// elle, et elle était figée dans le HTML au build.
// - frame-ancestors 'none' + X-Frame-Options: DENY (redondance documentée :
//   XFO couvre les navigateurs qui l'exigent encore).
// - report-to / report-uri : rien pour l'instant (aucun endpoint). À ajouter
//   en prod quand un endpoint existera, pour détecter les blocages CSP.
// - worker-src : intentionnellement implicite — retombe sur default-src
//   'self'. Toute exception future passera par une modification explicite.
// - Aucun 'unsafe-inline', aucun 'unsafe-eval', nulle part. Politique
//   nonce/hash : rien d'inline, point.
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"

// En-têtes de sécurité sur le serveur dev ET sur vite preview.
function securityHeaders(): Plugin {
  const setHeaders = (req: IncomingMessage, res: ServerResponse): void => {
    res.setHeader('Content-Security-Policy', CSP)
    res.setHeader('X-Frame-Options', 'DENY')
    // Cache-Control: no-cache (tâche 0.7, complément de scope) sur les
    // QUATRE ressources qui portent ou déclenchent la sécurité : /, /index.html,
    // /manifest.webmanifest et /sw.js. Sans cela, un correctif (nouvelle CSP,
    // nouveau SW) peut rester invisible jusqu'à 24 h derrière le cache HTTP.
    // Le futur serveur de production doit appliquer le même no-cache sur ces
    // quatre réponses. Les assets hashés (/assets/*) n'en ont pas besoin :
    // leur nom change à chaque build.
    const path = req.url?.split('?')[0]
    if (
      path === '/' ||
      path === '/index.html' ||
      path === '/manifest.webmanifest' ||
      path === '/sw.js'
    ) {
      res.setHeader('Cache-Control', 'no-cache')
    }
  }
  return {
    name: 'knuit-security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        setHeaders(req, res)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        setHeaders(req, res)
        next()
      })
    },
  }
}

// Version du service worker liée au hash de build (tâche 0.7, point Haute 2).
// public/sw.js est un gabarit : il contient la chaîne '__SW_VERSION__'.
// Ce plugin la remplace dans dist/sw.js par un hash du contenu servi
// (sw.js, index.html, manifest, package.json, src/** et images UX) — la
// version change dès que le contenu change, sans bump manuel à oublier.
// Sans cela,
// un ancien SW en cache servirait indéfiniment l'ancien index.html (avec
// l'ancienne CSP), et la migration vers les en-têtes HTTP ne l'atteindrait
// jamais. Le hash est déterministe : un build identique donne la même
// version, un contenu modifié donne une autre version.
function swVersion(): Plugin {
  const hash = createHash('sha256')
  const addFile = (relative: string): void => {
    hash.update(readFileSync(join(ROOT, relative)))
  }
  const addDir = (relative: string): void => {
    for (const entry of readdirSync(join(ROOT, relative), {
      withFileTypes: true,
    })) {
      const path = join(relative, entry.name)
      if (entry.isDirectory()) {
        addDir(path)
      } else if (entry.isFile()) {
        addFile(path)
      }
    }
  }
  addFile('public/sw.js')
  addFile('index.html')
  addFile('public/manifest.webmanifest')
  addFile('package.json')
  addDir('src')
  addDir('public/images/ux')
  const version = hash.digest('hex').slice(0, 12)
  return {
    name: 'knuit-sw-version',
    closeBundle() {
      const distSw = join(ROOT, 'dist', 'sw.js')
      const source = readFileSync(distSw, 'utf8')
      const marker = /^[ \t]*\/\/ __PRECACHE_ASSETS__[ \t]*(?:\r?\n|$)/gm
      const markerMatches = source.match(marker)
      if (!source.includes("'__SW_VERSION__'")) {
        throw new Error(
          "knuit-sw-version : le gabarit de version est absent de dist/sw.js — la version du SW ne serait pas liée au build.",
        )
      }
      if (!markerMatches || markerMatches.length !== 1) {
        throw new Error(
          "knuit-sw-version : le marqueur d'injection du précache est absent ou dupliqué dans dist/sw.js — les assets hashés ne seraient pas pré-cachés.",
        )
      }
      // Assets hashés du build (tâche 0.7, complément de scope) : lus dans
      // dist/.vite/manifest.json (build.manifest: true) et injectés dans le
      // précache. Sans cela, les /assets/index-[hash].js/.css ne seraient
      // servis hors-ligne que par le runtime caching de la première visite
      // — comportement implicite, non audité. Ici ils sont explicites.
      const manifest = JSON.parse(
        readFileSync(join(ROOT, 'dist', '.vite', 'manifest.json'), 'utf8'),
      ) as Record<string, unknown>
      const assets = new Set<string>()
      for (const entry of Object.values(manifest)) {
        if (typeof entry !== 'object' || entry === null) {
          continue
        }
        const chunk = entry as { file?: unknown; css?: unknown }
        if (typeof chunk.file === 'string') {
          assets.add(`/${chunk.file}`)
        }
        if (Array.isArray(chunk.css)) {
          for (const css of chunk.css) {
            if (typeof css === 'string') {
              assets.add(`/${css}`)
            }
          }
        }
      }
      const injected = [...assets]
        .sort()
        .map((asset) => `  '${asset}',`)
        .join('\n')
      const newline = source.includes('\r\n') ? '\r\n' : '\n'
      writeFileSync(
        distSw,
        source
          .replace("'__SW_VERSION__'", `'${version}'`)
          .replace(marker, `${injected.replace(/\n/g, newline)}${newline}`),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // build.manifest: true — dist/.vite/manifest.json liste les assets hashés
  // du build ; le plugin ci-dessus l'utilise pour les injecter dans le
  // précache du service worker.
  build: {
    manifest: true,
  },
  plugins: [preact(), securityHeaders(), swVersion()],
})
