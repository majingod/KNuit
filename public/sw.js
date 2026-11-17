// Service worker vide (tâche 0.6) — PWA hors-ligne, écrit à la main,
// SANS Workbox (retiré pour le squelette v1, à réévaluer si besoin).
// Précache uniquement du contenu public neutre (page, manifest) ;
// jamais de données du coffre — il n'y en a pas encore, et il n'y en
// aura jamais dans le cache du service worker.
// Version du cache : à incrémenter (CACHE_VERSION) à chaque release
// pour invalider les anciens caches. Sans cela, un ancien service
// worker en cache peut servir une ancienne CSP tant que le cache
// n'est pas invalidé (la CSP vit dans index.html, servi depuis le
// cache). skipWaiting + clients.claim : le nouveau service worker
// prend le relais dès son installation, sans attendre la fermeture
// des onglets.
// Les assets JS/CSS buildés ont des noms hachés qui changent à chaque
// build : ils ne sont pas énumérés dans le précache, ils sont mis en
// cache à la première visite (cache-first, même origine uniquement).
// Aucun fetch cross-origin n'est fait par ce service worker ; toute
// ressource cross-origin future exigera une entrée connect-src
// explicite dans la CSP.
const CACHE_VERSION = 'v1'
const CACHE_NAME = `knuit-${CACHE_VERSION}`
const PRECACHE_URLS = ['/', '/index.html', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    self.caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => self.caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  // Hors origine ou non-GET : on laisse passer, jamais mis en cache.
  if (url.origin !== self.location.origin || request.method !== 'GET') {
    return
  }
  // Navigation : réseau d'abord, repli sur la page en cache hors-ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            self.caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy)
            })
          }
          return response
        })
        .catch(() => self.caches.match('/index.html')),
    )
    return
  }
  // Autre ressource same-origin (JS, CSS, manifest…) : cache d'abord.
  event.respondWith(
    self.caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            self.caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy)
            })
          }
          return response
        }),
    ),
  )
})
