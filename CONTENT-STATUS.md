# État de validation des contenus de sécurité

Inventaire des blocs de contenu de sécurité — un bloc = un
`src/**/content.json`. C'est la source de vérité de la gate
`scripts/check-content-status.mjs`, branchée dans `npm run lint` :
un contenu `brouillon: false` sans entrée « validé » correspondante
fait échouer le lint, et un contenu modifié après validation (hash
différent) aussi. Un bloc non inventorié fait échouer la gate,
quelle que soit la valeur de `brouillon` : l'inventaire est la
source de vérité, un bloc non listé est un angle mort.

**Le hash est sémantique, pas un hash de fichier.** Le hash porte
sur le contenu JSON, pas sur les octets du fichier :
`sha256(JSON.stringify(sortKeysDeep(JSON.parse(contenu))))`. Un
reformatage (indentation, ordre des clés, saut de ligne final) ne
change donc pas le hash et n'invalide pas une validation. Ne jamais
calculer le hash à la main : `node scripts/check-content-status.mjs
--print-hash <chemin-du-content.json>`.

**Règles de lecture (format strict, fail-closed).** Le texte libre
(cette introduction) doit précéder la première entrée. Après la
première ligne `## `, seules les lignes `clé: valeur` et les lignes
vides sont autorisées : toute autre ligne fait échouer la gate.
Une entrée par bloc : `## <chemin relatif du content.json>`.
Clés autorisées : `statut`, `rôle`, `date`, `hash`. Toute autre clé
fait échouer la gate. Une entrée sans `statut` fait échouer la gate.
`statut` vaut `brouillon`, `en revue` ou `validé`. Pour `validé` :
`rôle`, `date` (AAAA-MM-JJ) et `hash` (64 caractères hex) sont
obligatoires. Pour `brouillon` et `en revue`, les trois valent `-` :
ce sont les champs de la validation, sans objet tant qu'elle n'a
pas eu lieu. Le champ `rôle` contient un rôle (« expert premiers
secours », « sexologue », « association X »), jamais un nom — la
gate ne peut pas le vérifier, une revue humaine est nécessaire.
Le registre externe `03-registre-validation.md` (hors dépôt) reste
la trace humaine de la validation ; il n'est pas vérifiable
automatiquement par la gate.

## src/urgence/content.json

statut: brouillon
rôle: -
date: -
hash: -
