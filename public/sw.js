// Service worker vide (tâches 0.6, 0.7, 0.8, 0.9, 1.0) — PWA hors-ligne, écrit à la main,
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
// Fenêtre réelle (tâche 0.9) : le kill-switch n'est effectif qu'à la
// prochaine navigation de chaque utilisateur, au plus tard ~24 h
// (updateViaCache: 'none' s'applique au sw.js post-0.7, pas au sw.js
// 0.6 déjà enregistré) — pour un incident réel, ça peut être long.
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
// DETTE PARTIELLEMENT RÉSOLUE EN 1.0, COMPLÉTÉE PAR LA GARDE /api/
// (était « dette consciente » en 0.8) : le handler non-navigate
// mettait en cache TOUTE ressource same-origin GET qui retournait
// 200 — aujourd'hui ce ne peut être que des assets hachés et le
// manifest, donc sain, mais dès qu'un endpoint API same-origin
// existerait (même un simple /api/status), il serait silencieusement
// mis en cache et resservi avec le mauvais Origin (combiné à
// ignoreVary: true, problème de correction de données). La garde est
// donc en place AVANT le premier endpoint, en deux couches :
// isCacheableAsset() ci-dessous n'autorise que les extensions de
// l'allowlist (.js, .css, .webmanifest, images, polices, .html,
// .ico) ; .json est EXCLU délibérément (strict — à étendre seulement
// si un besoin réel apparaît) ; tout le reste passe en network-only,
// jamais mis en cache. Les endpoints sans extension et les extensions
// non listées sont protégés par l'allowlist ; la garde
// startsWith('/api/') ferme le cas des endpoints AVEC une extension
// listée (ex. /api/data.js) — maintenir les deux. La personne qui
// écrira le premier /api/status n'aura pas à lire ce commentaire
// pour être protégée, tant que l'endpoint n'utilise pas une extension
// de l'allowlist ; la garde /api/ couvre ce cas. Note : .html est
// dans l'allowlist, donc un futur /admin.html ou /debug.html serait
// caché — à surveiller quand du contenu métier arrive. En attendant,
// la règle « jamais de données du coffre dans le SW » interdit de
// toute façon toute donnée applicative ici.
const CACHE_VERSION = '__SW_VERSION__'
const CACHE_NAME = `knuit-${CACHE_VERSION}`
const PRECACHE_URLS = [
  '/index.html',
  '/manifest.webmanifest',
  '/images/ux/01-salon-accueil.jpg',
  '/images/ux/02-grimoire-pentacle.jpg',
  '/images/ux/03-grimoire-plume.jpg',
  '/images/ux/04-couple-silhouette.jpg',
  '/images/ux/05-lanterne.jpg',
  '/images/ux/06-lys-violet.jpg',
  '/images/ux/07-lune-doree.jpg',
  '/images/ux/08-icones-dorees.jpg',
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
// Une réponse redirigée ou de type non 'basic' est refusée ici
// comme dans le handler fetch (cohérence, tâches 0.8 et 0.9) : fetch
// suit les redirections, donc une réponse redirected: true serait
// sinon stockée sous l'URL demandée ; une réponse opaque ('cors',
// 'opaque') ne doit pas entrer dans le pré-cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    self.caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            fetch(new Request(url, { cache: 'reload' })).then((response) => {
              if (
                !response.ok ||
                response.redirected ||
                response.type !== 'basic'
              ) {
                throw new Error(
                  `Pré-cache impossible pour ${url} : HTTP ${response.status}` +
                    (response.redirected ? ' (redirection)' : '') +
                    (response.type !== 'basic'
                      ? ` (type ${response.type})`
                      : ''),
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

// Fetch handler (audité, tâches 0.7, 0.8 et 0.9) :
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
//   renvoyait 503 pour une raison purement interne au SW). L'échec de
//   put est journalisé (console.warn, tâche 0.9) : un put qui échoue
//   en boucle serait sinon indétectable.
// - un ÉCHEC de caches.open ne fait pas échouer la requête non plus
//   (tâche 0.9) : la réponse fraîche déjà en main est servie, même
//   classe de bug que cache.put, au niveau du open.
// - les lectures en cache sont SCOPÉES à CACHE_NAME (tâche 0.8) : un
//   ancien cache qui survivrait à une purge partielle ne peut plus
//   satisfaire un match.
// - navigations : réseau d'abord (cache: 'reload' pour contourner le
//   cache HTTP), repli sur la page en cache hors-ligne — d'abord la
//   requête elle-même (copie fraîche de '/'), puis '/index.html'.
// Allowlist du runtime caching (tâche 1.0, Haute) : seules les
// ressources statiques dont l'extension est listée ici peuvent être
// mises en cache à la demande. Tout le reste (endpoints API, .json,
// chemins sans extension comme /api/status) passe en network-only :
// jamais lu depuis le cache, jamais écrit dedans. L'extension est
// lue sur le pathname, en minuscules ; un chemin sans extension ou
// dont le point est dans un segment de dossier n'est pas cacheable.
// - autres ressources same-origin : cache d'abord, puis réseau, avec
//   un catch qui retourne une 503 minimale si le fetch échoue et que
//   l'asset n'est pas en cache (première visite hors-ligne) — sauf
//   pour les ressources hors allowlist, qui sont network-only et
//   retournent aussi la 503 en cas d'échec réseau (jamais de cache).
const CACHEABLE_EXTENSIONS = new Set([
  '.js',
  '.css',
  '.webmanifest',
  '.html',
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
])
const isCacheableAsset = (url) => {
  // Garde /api/ (tâche 1.0, revue de Master) : une route API portant
  // une extension listée (ex. /api/data.js) passerait sinon
  // l'allowlist — l'extension seule ne suffit pas à distinguer un
  // asset statique d'un endpoint. Toute route sous /api/ est
  // network-only, quelle que soit son extension.
  if (url.pathname.startsWith('/api/')) return false
  const pathname = url.pathname
  const dot = pathname.lastIndexOf('.')
  if (dot === -1 || dot < pathname.lastIndexOf('/')) {
    return false
  }
  return CACHEABLE_EXTENSIONS.has(pathname.slice(dot).toLowerCase())
}
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
    return cache.put(key, copy).then(
      () => response,
      () => {
        console.warn('cache.put failed for', key.url || key)
        return response
      },
    )
  }
  const matchCache = (key) =>
    self.caches
      .open(CACHE_NAME)
      // ignoreVary: true (tâche 0.9) : le serveur sert les assets
      // avec `Vary: Origin`, mais les requêtes mises en pré-cache
      // n'ont pas d'en-tête Origin alors que les requêtes réelles du
      // navigateur (module JS, CSS avec crossorigin) en ont un. Sans
      // ignoreVary, cache.match() rate sur l'en-tête Origin et
      // l'asset tombe en 503 hors-ligne — alors qu'il est en cache.
      // Le cache ne contient que des assets statiques same-origin,
      // donc Vary est sans objet ici.
      // DETTE (tâche 1.0, M2) : ignoreVary: true devra être réévalué
      // en même temps que l'allowlist d'extensions — les deux sont
      // liés au même scénario d'endpoint API same-origin. Maintenant
      // que l'allowlist existe, le déclencheur de réévaluation est
      // défini : dès qu'un endpoint API same-origin entrera, revoir
      // les deux ensemble.
      // Note : ignoreVary: true s'applique aussi à
      // matchCache('/index.html') — sans effet sur une clé chaîne
      // (pas de Vary à comparer), le paramètre est simplement le même
      // pour toutes les lectures en cache.
      .then((cache) => cache.match(key, { ignoreVary: true }))
  // Navigation : réseau d'abord, repli sur la page en cache hors-ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'reload' })
        .then((response) =>
          self.caches
            .open(CACHE_NAME)
            .then(
              (cache) => cacheResponse(cache, request, response),
              () => response,
            ),
        )
        // Si les deux match échouent, la promesse se résout à null :
        // respondWith(null) → erreur réseau du navigateur, qui affiche
        // sa page hors-ligne. Ne pas remplacer par un 503 : ce serait
        // une régression UX (tâche 0.9).
        // Choix explicite (tâche 1.0, Basse) : chaque matchCache porte
        // son propre .catch(() => null) — un cache supprimé en course
        // pendant le repli ne rejette donc jamais silencieusement, il
        // se résout à null, ce qui est exactement le comportement
        // documenté ci-dessus. On ne loggue pas : ce cas est
        // équivalent au null, pas une erreur à surveiller.
        .catch(() =>
          matchCache(request)
            .catch(() => null)
            .then(
              (cached) =>
                cached || matchCache('/index.html').catch(() => null),
            ),
        ),
    )
    return
  }
  // Autre ressource same-origin (JS, CSS, manifest…) : cache d'abord
  // si elle est dans l'allowlist, network-only sinon (tâche 1.0).
  const offline503 = () =>
    new Response('', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' },
    })
  if (!isCacheableAsset(url)) {
    // Hors allowlist (endpoint API, .json, chemin sans extension) :
    // jamais lu depuis le cache, jamais écrit dedans — la réponse
    // fraîche est servie, et un échec réseau donne la même 503
    // minimale que pour un asset non caché en première visite.
    event.respondWith(fetch(request).catch(() => offline503()))
    return
  }
  event.respondWith(
    matchCache(request)
      .then(
        (cached) =>
          cached ||
          fetch(request).then((response) =>
            self.caches
              .open(CACHE_NAME)
              // Comme dans le chemin navigate (tâche 0.9, revue de Master) :
              // un échec de caches.open ne doit pas faire échouer la
              // requête — la réponse fraîche déjà en main est servie.
              .then(
                (cache) => cacheResponse(cache, request, response),
                () => response,
              ),
          ),
      )
      .catch(() => offline503()),
  )
})
