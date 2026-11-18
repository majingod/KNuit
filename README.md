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
des en-têtes de la réponse cachée, kill-switch, en-têtes HTTP,
manifest, workflow de validation du contenu. Séquence de test fixée pour le hors-ligne (à conserver dans
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

## Phase 1 — Conventions (décisions écrites avant le premier composant)

### Props déstructurées et noUnusedParameters (décision 1)

`noUnusedParameters` reste à `true` dans `tsconfig.app.json` : tsc est
le filet de sécurité depuis 0.4, on ne l'affaiblit pas.

- Convention : ne déstructurer que les props utilisées ; le reste passe
  par `...rest`. Ne jamais déstructurer une prop qu'on n'utilise pas.
- Échappatoire pour une prop qui doit être exclue du spread DOM sans
  que sa valeur soit lue : la renommer avec le préfixe `_` dans la
  déstructuration (`{ variant: _variant, size: _size }`). TypeScript
  exempte par construction les paramètres commençant par `_` de
  `noUnusedParameters` (et de `noUnusedLocals`) : pas de directive de
  suppression, pas de changement de config, pas d'implication de Babel.
  Vérifié par tsc le 2026-11-17 (erreur TS6133 sans le préfixe, propre
  avec ; le contrôle négatif prouve que le test n'est pas vacuité).
- `// @ts-expect-error` n'est PAS autorisé pour les props inutilisées
  (placement fragile dans les signatures multi-lignes) ; si un cas rend
  le renommage impossible, il passe en revue, pas en directive
  silencieuse.
- `noInlineConfig: true` interdit déjà
  `// eslint-disable-next-line` : il n'y a pas d'échappatoire par
  commentaire ESLint.

### Styles en JSX (décision 2)

- Phase 1 utilise exclusivement des classes CSS dans des fichiers
  `.css` importés, jamais `style={{...}}` en JSX.
- Justification honnête (vérifiée dans le `preact.mjs` installé) :
  en Preact, les props `style` sont appliquées via CSSOM (`el.style` /
  `cssText`), pas par `setAttribute('style', ...)` — la CSP ne les
  bloque donc pas. La règle n'est pas une exigence CSP : c'est une
  convention délibérée. Tout le style reste auditable dans des
  fichiers `.css` versionnés, l'histoire CSP reste triviale
  (`style-src 'self'` + `.css` uniquement), et aucun style ne dépend
  des internes d'un framework qui pourraient changer (un rendu
  serveur ou un autre moteur réintroduirait le blocage).
- Ce qui est réellement bloqué par la CSP : les éléments `<style>`
  en JSX et les attributs `style="..."` dans le HTML statique — ne
  jamais les utiliser.
- Seule exception autorisée : `el.style.*` posé impérativement via
  `ref` (API DOM, non soumise à la CSP), uniquement pour les valeurs
  véritablement dynamiques qu'aucune classe ne peut exprimer.
- Jamais de `<style>` en JSX, jamais `dangerouslySetInnerHTML`
  (déjà interdit par ESLint).

### Frontière contenu / donnée

- Contenu = HTML/JSX/CSS/JSON statique versionné dans le dépôt.
  Donnée = tout ce qui est saisi par l'utilisateur ou lu depuis le
  coffre. Le service worker ne cache que du contenu. Toute PR qui
  cache de la donnée est refusée.
- Checklist de PR (application manuelle, à cette échelle) : « la PR
  cache-t-elle uniquement du contenu versionné ? Si la moindre donnée
  utilisateur/coffre transite, refus. » À revisiter quand une deuxième
  personne rejoindra le dépôt.

### Validation du contenu de sécurité (Option 1, tâche de fondation)

Aucun contenu de sécurité (Mode Urgence, « Ça s'est mal passé »,
etc.) n'est publié sans validation humaine par un expert. Le
mécanisme qui l'empêche est dans le dépôt, pas dans la discipline :

- Chaque bloc de contenu (`src/**/content.json`) est inventorié
  dans `CONTENT-STATUS.md` (racine du dépôt, jamais servi) avec :
  statut (`brouillon` / `en revue` / `validé`), rôle du validateur
  (jamais un nom), date, hash SHA-256 du contenu validé.
- La gate `scripts/check-content-status.mjs`, branchée dans
  `npm run lint`, parcourt tous les `src/**/content.json` (pas de
  liste hardcodée) et applique les six transitions — toute autre
  combinaison fait échouer le lint :

  | `brouillon` | statut | Résultat |
  |---|---|---|
  | `true` | `brouillon` | OK |
  | `true` | `en revue` | OK |
  | `true` | `validé` | ÉCHEC (incohérent : si validé, publier, sinon dé-valider) |
  | `false` | `validé` + hash correct | OK |
  | `false` | `en revue` ou `brouillon` | ÉCHEC |
  | toute autre combinaison | | ÉCHEC |

  Un `content.json` sans entrée dans `CONTENT-STATUS.md` fait
  échouer la gate, quelle que soit la valeur de `brouillon` : tout
  bloc doit être inventorié, un bloc non listé est un angle mort.
  Un `content.json` sans champ `brouillon` (ou non booléen) échoue
  aussi. Une entrée sans `content.json` correspondant échoue
  également (orpheline).
- Le hash est **sémantique** : `sha256` du JSON canonique (clés
  triées récursivement, pas d'espaces). Un reformatage (indentation,
  ordre des clés, saut de ligne final) ne change pas le hash et
  n'invalide pas une validation. Ne jamais le calculer à la main :
  `node scripts/check-content-status.mjs --print-hash
  <chemin-du-content.json>`.
- **Ajouter un bloc** : créer le `content.json` avec
  `brouillon: true`, ajouter son entrée dans `CONTENT-STATUS.md`
  (`statut: brouillon`, `rôle: -`, `date: -`, `hash: -`).
- **Enregistrer une validation** : faire valider le contenu par
  l'expert, calculer le hash avec `--print-hash`, remplir l'entrée
  (`statut: validé`, rôle, date, hash), mettre `brouillon: false`
  dans le `content.json`, et mettre à jour le registre externe
  `03-registre-validation.md` (hors dépôt) avec les mêmes
  informations. Un contenu validé modifié doit être re-validé :
  le hash change, la gate échoue tant que l'entrée n'est pas mise
  à jour.
- Le test `tests/e2e/content-status.spec.ts` vérifie l'invariant
  au niveau affiché (brouillon: true → bandeau visible,
  brouillon: false → bandeau absent, pour chaque bloc) et les six
  transitions en boîte noire. Gate + test sont prouvés par
  mutations (voir l'historique des tâches).

**Trois nuances à ne pas oublier (la gate ne les vérifie pas) :**

1. `CONTENT-STATUS.md` est la seule source de vérité pour la
   gate. Le registre externe est la trace humaine de la validation,
   non vérifiable automatiquement. Une validation sans entrée
   correspondante dans le registre externe est un incident de
   gouvernance, pas un bug technique — la gate ne peut pas le
   détecter.
2. Le champ rôle contient un rôle (« expert premiers secours »,
   « sexologue », « association X »), pas un nom. Une revue humaine
   est nécessaire ; la gate ne peut pas le vérifier.
3. Le contenu JSON est du texte, pas du HTML : les valeurs du JSON
   sont du texte rendu via `{}` en JSX ; Preact échappe
   automatiquement. Ne jamais utiliser `dangerouslySetInnerHTML`
   pour rendre ce contenu.
