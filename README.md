# KNuit

Squelette d'application web progressive (PWA) — Vite + Preact + TypeScript,
100 % locale, sans compte ni synchronisation. Aucune donnée applicative
pour l'instant : la page est vide, en attente des fondations.

## Développement

```sh
npm ci
npm run dev      # serveur de développement (port 5173)
npm run build    # build de production (dossier dist/)
npm run preview  # sert le build (port 4173)
npm run lint     # tsc -b --force && eslint . --max-warnings 0
```

## Tests de non-régression

```sh
npm run test:e2e  # build + suite Playwright (tests/e2e/)
```

La suite rejoue, en une commande et sans étape manuelle, les scénarios
validés jusqu'ici : profil neuf hors-ligne, migration d'un ancien
service worker, batterie négative CSP, iframe cross-origin, inspection
des en-têtes de la réponse cachée, kill-switch, en-têtes HTTP et
manifest. Séquence de test fixée pour le hors-ligne (à conserver dans
toute version future de la suite) : installation du service worker
(1re visite) → reload → passage hors-ligne → navigation, avec le cache
HTTP désactivé. Le « 0 requête échouée » n'est significatif que si le
profil est vierge et la séquence reproductible.

## Sécurité

- Content Security Policy livrée par **en-têtes HTTP uniquement**
  (plugin Vite `securityHeaders()` dans `vite.config.ts`, pour dev et
  preview, même politique partout). La `<meta>` CSP est retirée :
  deux sources de vérité divergeraient. Politique exacte :
  `Content-Security-Policy: default-src 'self'; script-src 'self';
  style-src 'self'; img-src 'self'; font-src 'self'; connect-src
  'self'; object-src 'none'; base-uri 'none'; form-action 'self';
  frame-ancestors 'none'` + `X-Frame-Options: DENY` +
  `Cache-Control: no-cache` sur `/`, `/index.html`,
  `/manifest.webmanifest` et `/sw.js`. Le futur serveur de production
  doit appliquer exactement les mêmes en-têtes. Aucun
  `'unsafe-inline'`, aucun `'unsafe-eval'`.
- Le service worker (`public/sw.js`) est **hors CSP page** : les
  en-têtes CSP ne s'appliquent pas aux requêtes faites depuis le
  service worker. Toute requête réseau depuis le service worker doit
  être auditée séparément ; aujourd'hui il n'en fait aucune hors
  origine. Il ne met en cache que du contenu public neutre, jamais
  de données applicatives.
- Fenêtre de transition 0.6 → 0.7 : pour les utilisateurs qui avaient
  déjà le service worker 0.6 (enregistré sans `updateViaCache:
  'none'`), la première vérification de mise à jour suit le
  comportement par défaut du navigateur et la bascule vers le
  service worker 0.7 peut prendre jusqu'à **24 h**. C'est la
  dernière migration lente : les versions suivantes bénéficient de
  `updateViaCache: 'none'` et de `Cache-Control: no-cache` sur
  `/sw.js`, donc la mise à jour a lieu dès la première visite.
- Kill-switch : si un service worker défectueux est poussé, publier
  un `sw.js` contenant `install → skipWaiting` et `activate →
  purge des caches + registration.unregister()` (procédure complète
  commentée en tête de `public/sw.js`).
