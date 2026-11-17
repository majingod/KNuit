// Fixture de test : le service worker 0.6, contenu exact du commit
// 59c233d3, servi par le faux « ancien serveur » du test de migration
// (migration.spec.ts). Il installe le cache knuit-v1, pré-cache avec
// cache.addAll (sans cache: 'reload'), et sert l'ancien index.html
// avec sa <meta> CSP. Il n'est jamais servi en production : c'est
// uniquement la simulation d'un utilisateur existant de 0.6.
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
