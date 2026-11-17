// Service worker vide (tâches 0.6, 0.7, 0.8) — PWA hors-ligne, écrit à la main,
// SANS Workbox (retiré pour le squelette v1, à réévaluer si besoin).
// Précache uniquement du contenu public neutre (page, manifest, assets) ;
// jamais de données du coffre — il n'y en a pas encore, et il n'y en
// aura jamais dans le cache du service worker.
// Version du cache (tâche 0.7, point Haute 2) : le gabarit de version
// est remplacé au build par le plugin Vite (vite.config.ts) par un
// hash du contenu servi (sw.js, index.html, manifest, package.json,
// src/**). La version change donc dès que le contenu change, sans bump
// manuel à oublier. Sans cela, un ancien SW en cache servirait
// indéfiniment l'ancien index.html (avec l'ancienne CSP), et la
// migration vers les en-têtes HTTP ne l'atteindrait jamais.
// Conséquence du couplage au hash de build : le hors-ligne fonctionne
// à partir de la première visite en ligne qui suit chaque déploiement
// (la nouvelle version du SW doit d'abord être installée).
// skipWaiting + clients.claim : le nouveau service worker prend le
// relais dès son installation, sans attendre la fermeture des onglets.
// KILL-SWITCH (procédure de désactivation, tâche 0.7, complétée en 0.8) :
// si un SW défectueux est poussé, publier un sw.js contenant :
//   self.addEventListener('install', () => self.skipWaiting())
//   self.addEventListener('activate', (event) => {
//     event.waitUntil(
//       self.caches.keys().then((keys) =>
//         Promise.all(keys.map((key) => self.caches.delete(key))),
//       ).then(() => self.registration.unregister()),
//     )
//   })
// Le mécanisme de version force la mise à jour chez les utilisateurs ;
// le SW de remplacement purge les caches puis se désenregistre.
// Le service worker est HORS CSP page (tâche 0.7) : les en-têtes CSP de
// index.html ne s'appliquent pas aux requêtes faites depuis le SW.
// Toute requête réseau depuis le SW doit être auditée séparément ;
// aujourd'hui il n'en fait aucune hors origine. Si un jour le SW fait
// du cross-origin, ajouter une CSP sur la réponse sw.js elle-même.
// Les assets JS/CSS buildés ont des noms hachés qui changent à chaque
// build : ils sont INJECTÉS dans le précache au build par le plugin
// Vite (qui lit dist/.vite/manifest.json) — voir le marqueur
// d'injection dans PRECACHE_URLS ci-dessous. Le hors-ligne ne dépend
// donc pas du runtime caching pour les assets de l'app. Aucun fetch cross-origin
// n'est fait par ce service worker ; toute ressource cross-origin
// future exigera une entrée connect-src explicite dans la CSP.
// DETTE CONSCIENTE (tâche 0.8, second avis) : le handler non-navigate
// met en cache TOUTE ressource same-origin GET qui retourne 200 —
// aujourd'hui ce ne peut être que des assets hachés et le manifest,
// donc sain. Dès qu'un endpoint API same-origin existera (même un
// simple /api/status), il serait silencieusement mis en cache : il
// faudra alors restreindre le runtime caching à une allowlist
// d'extensions (.js, .css, .webmanifest, images, polices). En
// attendant, la règle « jamais de données du coffre dans le SW »
// interdit de toute façon toute donnée applicative ici.
const CACHE_VERSION = '__SW_VERSION__'
const CACHE_NAME = `knuit-${CACHE_VERSION}`
const PRECACHE_URLS = [
  '/index.html',
  '/manifest.webmanifest',
  // __PRECACHE_ASSETS__
]

// Pré-cache manuel (tâche 0.7, point Haute 2 du complément) : cache.addAll
// respecte le cache HTTP et échoue toute l'installation sur un seul 404.
// On boucle donc en fetch individuels avec cache: 'reload' (contourne le
// cache HTTP : le pré-cache capture toujours le contenu frais), et on
// traite chaque URL en Promise.allSettled : '/index.html' seul est
// critique (son échec fait échouer l'installation) ; les autres
// n'émettent qu'un avertissement et seront récupérées à la demande.
// '/' n'est plus pré-caché (tâche 0.8) : le handler de navigation met
// déjà '/' en cache à chaque visite en ligne, et le repli hors-ligne
// essaie d'abord la requête elle-même avant '/index.html' — pré-cacher
// les deux ne faisait que dupliquer le même HTML.
// Une réponse redirigée est refusée ici comme dans le handler fetch
// (cohérence, tâche 0.8) : fetch suit les redirections, donc une
// réponse redirected: true serait sinon stockée sous l'URL demandée.
self.addEventListener('install', (event) => {
  event.waitUntil(
    self.caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            fetch(new Request(url, { cache: 'reload' })).then((response) => {
              if (!response.ok || response.redirected) {
                throw new Error(
                  `Pré-cache impossible pour ${url} : HTTP ${response.status}` +
                    (response.redirected ? ' (redirection)' : ''),
                )
              }
              return cache.put(url, response)
            }),
          ),
        ),
      )
      .then((results) => {
        const failed = PRECACHE_URLS.filter(
          (_url, index) => results[index].status === 'rejected',
        )
        const critical = failed.filter((url) => url === '/index.html')
        if (failed.length > 0) {
          console.warn(
            'Pré-cache partiel, URLs manquantes :',
            failed.join(', '),
          )
        }
        if (critical.length > 0) {
          throw new Error(
            `Pré-cache critique manquant : ${critical.join(', ')}`,
          )
        }
      })
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
            // On ne purge que les caches de cette application (préfixe
            // knuit-) : si l'origine héberge un jour autre chose, ses
            // caches ne doivent pas être supprimés sans ménagement.
            .filter((key) => key.startsWith('knuit-') && key !== CACHE_NAME)
            .map((key) => self.caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

// Fetch handler (audité, tâches 0.7 et 0.8) :
// - hors origine ou non-GET : on laisse passer, jamais mis en cache.
// - on ne met en cache qu'une réponse 200 ('ok'), de type 'basic'
//   (même origine) et non redirigée : jamais de 404, de redirection,
//   ni de réponse opaque d'un tiers (cache poisoning). Note : response.ok
//   accepte aussi les 206 (contenu partiel) — à surveiller si Range est
//   un jour utilisé ; aucune requête Range n'est émise ici.
// - les écritures en cache sont CHAÎNÉES dans la promesse retournée à
//   respondWith (jamais de cache.put fire-and-forget : le SW pourrait
//   être terminé avant l'écriture), et un ÉCHEC de cache.put ne fait
//   pas échouer la requête : la réponse déjà en main est servie
//   (tâche 0.8 — sinon une navigation servait du stale et un asset
//   renvoyait 503 pour une raison purement interne au SW).
// - les lectures en cache sont SCOPÉES à CACHE_NAME (tâche 0.8) : un
//   ancien cache qui survivrait à une purge partielle ne peut plus
//   satisfaire un match.
// - navigations : réseau d'abord (cache: 'reload' pour contourner le
//   cache HTTP), repli sur la page en cache hors-ligne — d'abord la
//   requête elle-même (copie fraîche de '/'), puis '/index.html'.
// - autres ressources same-origin : cache d'abord, puis réseau, avec
//   un catch qui retourne une 503 minimale si le fetch échoue et que
//   l'asset n'est pas en cache (première visite hors-ligne).
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  // Hors origine ou non-GET : on laisse passer, jamais mis en cache.
  if (url.origin !== self.location.origin || request.method !== 'GET') {
    return
  }
  const cacheable = (response) =>
    response.ok && response.type === 'basic' && !response.redirected
  const cacheResponse = (cache, key, response) => {
    if (!cacheable(response)) {
      return response
    }
    const copy = response.clone()
    return cache
      .put(key, copy)
      .then(
        () => response,
        () => response,
      )
  }
  const matchCache = (key) =>
    self.caches.open(CACHE_NAME).then((cache) => cache.match(key))
  // Navigation : réseau d'abord, repli sur la page en cache hors-ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'reload' })
        .then((response) =>
          self.caches
            .open(CACHE_NAME)
            .then((cache) => cacheResponse(cache, request, response)),
        )
        .catch(() =>
          matchCache(request).then(
            (cached) => cached || matchCache('/index.html'),
          ),
        ),
    )
    return
  }
  // Autre ressource same-origin (JS, CSS, manifest…) : cache d'abord.
  event.respondWith(
    matchCache(request)
      .then(
        (cached) =>
          cached ||
          fetch(request).then((response) =>
            self.caches
              .open(CACHE_NAME)
              .then((cache) => cacheResponse(cache, request, response)),
          ),
      )
      .catch(
        () =>
          new Response('', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          }),
      ),
  )
})
