// ESLint 9, configuration plate.
// But : interdire en erreur tout vecteur d'injection HTML / JS
// statiquement identifiable. Ce n'est pas une preuve d'absence
// d'injection : les formes dynamiques (el[k], el['inner' + 'HTML'],
// Reflect.set, Object.assign, alias par déstructuration, code
// obfusqué) restent hors de portée d'un linter syntaxique. Le filet
// à l'exécution est la CSP stricte (tâche 0.5), pas ce fichier.
// Le typage reste vérifié par `tsc -b` (scripts build et lint).
// typescript-eslint n'est pas utilisé : il exige TypeScript < 6.1.0
// (pair >=4.8.4 <6.1.0) et refuse de s'installer avec TypeScript 7.0.2
// (ERESOLVE vérifié le 2026-11-17). Le parseur TypeScript est donc
// @babel/eslint-parser, indépendant de la version du compilateur.
// À réévaluer à la sortie de TypeScript 7.1 / d'un typescript-eslint
// compatible (suivi amont : typescript-eslint #10940).
// Ligne Babel 7 (et non 8) : @preact/preset-vite exige @babel/core 7.x,
// incompatible avec Babel 8.
// Limite connue de @babel/eslint-parser : il ne transmet pas l'option jsx
// à l'analyse de portée (eslint-scope, __isJSXEnabled), donc les
// composants utilisés uniquement en JSX sont signalés à tort par
// no-unused-vars. La règle est donc coupée pour les fichiers TS/TSX ;
// le cas est couvert par tsc (noUnusedLocals + noUnusedParameters,
// tsconfig.app.json et tsconfig.node.json).
// Redondances volontaires (défense en profondeur) : no-eval /
// no-implied-eval / no-new-func se recoupent avec les sélecteurs
// window/globalThis ci-dessous ; elles sont gardées. no-eval couvre
// déjà eval direct et indirect ((0, eval)(...) et const e = eval) :
// aucun sélecteur CallExpression[callee.name="eval"] n'est nécessaire.
// setHTML (API Sanitizer, assaini par conception) reste autorisé :
// whitelist intentionnelle, seul setHTMLUnsafe est interdit.
// Le spread JSX {...props} reste non analysable.
// Les sélecteurs write / writeln généralisés ne s'appliquent qu'à
// src/** pour ne pas gêner process.stdout.write côté Node.
// Les sélecteurs open / close sont restreints aux objets document et
// window.document uniquement : ws.close() et window.open() (légitimes)
// passent le lint. Les fichiers de config (vite.config.*,
// eslint.config.js) ont les globals Node ; src/ n'a que les globals
// navigateur.
import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import globals from 'globals'

// Vecteurs interdits partout (tous fichiers JS/TS).
const coreVectors = [
  {
    selector:
      'MemberExpression[property.name="innerHTML"], MemberExpression[property.value="innerHTML"]',
    message:
      'innerHTML est interdit : utilisez textContent, createElement ou Preact, jamais du HTML injecté.',
  },
  {
    selector:
      'MemberExpression[property.name="outerHTML"], MemberExpression[property.value="outerHTML"]',
    message:
      'outerHTML est interdit : même risque d’injection HTML que innerHTML.',
  },
  {
    selector:
      'MemberExpression[property.name="insertAdjacentHTML"], MemberExpression[property.value="insertAdjacentHTML"]',
    message: 'insertAdjacentHTML est interdit : injection HTML directe.',
  },
  {
    selector:
      'MemberExpression[property.name="setHTMLUnsafe"], MemberExpression[property.value="setHTMLUnsafe"]',
    message:
      'setHTMLUnsafe est interdit : insertion de HTML non assaini. setHTML (assaini) reste autorisé.',
  },
  {
    selector:
      'MemberExpression[property.name="srcdoc"], MemberExpression[property.value="srcdoc"]',
    message:
      'srcdoc est interdit : injection de HTML dans une iframe.',
  },
  {
    selector:
      'MemberExpression[property.name="createContextualFragment"], MemberExpression[property.value="createContextualFragment"]',
    message:
      'createContextualFragment est interdit : injection HTML directe.',
  },
  {
    selector:
      'MemberExpression[object.name="window"][property.name="eval"], MemberExpression[object.name="window"][property.value="eval"], MemberExpression[object.name="globalThis"][property.name="eval"], MemberExpression[object.name="globalThis"][property.value="eval"]',
    message:
      'eval est interdit, y compris via window.eval ou globalThis.eval.',
  },
  {
    selector:
      'NewExpression[callee.object.name="window"][callee.property.name="Function"], NewExpression[callee.object.name="window"][callee.property.value="Function"], NewExpression[callee.object.name="globalThis"][callee.property.name="Function"], NewExpression[callee.object.name="globalThis"][callee.property.value="Function"]',
    message:
      'new Function est interdit, y compris via window.Function ou globalThis.Function.',
  },
  {
    selector:
      'CallExpression[callee.name="Function"], CallExpression[callee.object.name="window"][callee.property.name="Function"], CallExpression[callee.object.name="window"][callee.property.value="Function"], CallExpression[callee.object.name="globalThis"][callee.property.name="Function"], CallExpression[callee.object.name="globalThis"][callee.property.value="Function"]',
    message:
      'Function sans new est interdit : même exécution de code que new Function.',
  },
  {
    selector: 'CallExpression[callee.property.name="constructor"]',
    message:
      '.constructor.constructor est interdit : atteint Function sans écrire Function.',
  },
  {
    selector: 'ImportExpression[source.type!="Literal"]',
    message:
      'import() dynamique à source non littérale est interdit : URL calculée ou data:.',
  },
  {
    selector:
      'CallExpression[callee.property.name="setAttribute"][arguments.0.value=/^(on|srcdoc)/i]',
    message:
      'setAttribute avec un gestionnaire on* ou srcdoc est interdit : exécution ou injection HTML.',
  },
  {
    selector:
      'JSXAttribute[name.name=/^(innerHTML|outerHTML|srcDoc|srcdoc|dangerouslySetInnerHTML)$/]',
    message:
      'innerHTML, outerHTML, srcDoc et dangerouslySetInnerHTML sont interdits en props JSX.',
  },
  {
    selector:
      'ObjectExpression > Property[key.name="innerHTML"], ObjectExpression > Property[key.name="dangerouslySetInnerHTML"]',
    message:
      'innerHTML et dangerouslySetInnerHTML sont interdits comme clés d’objet (y compris h() / createElement). La déstructuration const { innerHTML } = el n’est pas visée.',
  },
]

// write / writeln hors src/** : formes contraintes à
// document (et window.document), pour ne pas gêner le code Node.
const constrainedWriteVectors = [
  {
    selector:
      'MemberExpression[object.name="document"][property.name="write"], MemberExpression[object.name="document"][property.value="write"], MemberExpression[object.object.name="window"][object.property.name="document"][property.name="write"], MemberExpression[object.object.name="window"][object.property.name="document"][property.value="write"]',
    message: 'document.write est interdit : injection HTML directe.',
  },
  {
    selector:
      'MemberExpression[object.name="document"][property.name="writeln"], MemberExpression[object.name="document"][property.value="writeln"], MemberExpression[object.object.name="window"][object.property.name="document"][property.name="writeln"], MemberExpression[object.object.name="window"][object.property.name="document"][property.value="writeln"]',
    message: 'document.writeln est interdit : même vecteur que document.write.',
  },
]

// open / close : restreints aux objets document et window.document
// uniquement, partout (src/** comme hors src/). ws.close() et
// window.open() (légitimes) ne sont pas visés.
const constrainedOpenCloseVectors = [
  {
    selector:
      'MemberExpression[object.name="document"][property.name="open"], MemberExpression[object.name="document"][property.value="open"], MemberExpression[object.object.name="window"][object.property.name="document"][property.name="open"], MemberExpression[object.object.name="window"][object.property.name="document"][property.value="open"]',
    message:
      'document.open est interdit : il réinitialise le document avant document.write.',
  },
  {
    selector:
      'MemberExpression[object.name="document"][property.name="close"], MemberExpression[object.name="document"][property.value="close"], MemberExpression[object.object.name="window"][object.property.name="document"][property.name="close"], MemberExpression[object.object.name="window"][object.property.name="document"][property.value="close"]',
    message: 'document.close est interdit : même vecteur que document.open.',
  },
]

// write / writeln dans src/** : généralisés par nom de propriété,
// sans contrainte d'objet (couvre document, window.document,
// globalThis.document, self/top/parent.document et les alias
// const d = document). open / close ne sont PAS généralisés ici :
// ils restent restreints à document et window.document (voir
// constrainedOpenCloseVectors) pour ne pas signaler ws.close() ou
// window.open().
const generalizedWriteVectors = [
  {
    selector:
      'MemberExpression[property.name="write"], MemberExpression[property.value="write"]',
    message:
      '.write est interdit dans src/ : injection HTML directe (document.write et alias).',
  },
  {
    selector:
      'MemberExpression[property.name="writeln"], MemberExpression[property.value="writeln"]',
    message: '.writeln est interdit dans src/ : même vecteur que .write.',
  },
]

const srcVectors = [
  ...coreVectors,
  ...generalizedWriteVectors,
  ...constrainedOpenCloseVectors,
]
const otherVectors = [
  ...coreVectors,
  ...constrainedWriteVectors,
  ...constrainedOpenCloseVectors,
]

const coreRules = {
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
}

const tsRules = {
  ...coreRules,
  'no-unused-vars': 'off',
  'no-undef': 'off',
}

const tsParserOptions = (isTSX) => ({
  requireConfigFile: false,
  babelOptions: {
    presets: [
      ['@babel/preset-typescript', { isTSX, allExtensions: true }],
    ],
  },
  ecmaFeatures: { jsx: true },
})

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**', 'coverage/**'],
  },
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  {
    // Fichiers JS (module) : parseur par défaut, globals navigateur.
    // eslint.config.js est traité dans son propre bloc (globals Node).
    files: ['**/*.{js,mjs}'],
    ignores: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: coreRules,
  },
  {
    // Fichiers CommonJS : sourceType commonjs, globals Node.
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: coreRules,
  },
  {
    // Fichiers TS sans JSX : isTSX false (les assertions <T>x doivent
    // parser). no-unused-vars et no-undef coupés (voir en-tête) ;
    // le cas est couvert par tsc (noUnusedLocals + noUnusedParameters).
    // Les fichiers *.config.ts sont traités dans leur propre bloc.
    files: ['**/*.{ts,mts,cts}'],
    ignores: ['*.config.ts'],
    languageOptions: {
      parser: babelParser,
      parserOptions: tsParserOptions(false),
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: tsRules,
  },
  {
    // Fichiers TSX : isTSX true.
    files: ['**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: tsParserOptions(true),
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: tsRules,
  },
  {
    // Fichiers JSX purs : parseur par défaut d'ESLint (JSX natif,
    // analyse de portée correcte), règles complètes.
    files: ['**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    rules: coreRules,
  },
  {
    // Fichiers de config TypeScript (vite.config.ts, …) : globals Node.
    files: ['*.config.ts'],
    languageOptions: {
      parser: babelParser,
      parserOptions: tsParserOptions(false),
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: tsRules,
  },
  {
    // Fichier de config ESLint lui-même : parseur par défaut, globals Node.
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: coreRules,
  },
  {
    // Code applicatif : vecteurs généralisés pour write / open / close.
    files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...srcVectors],
    },
  },
  {
    // Hors src/ : vecteurs contraints à document.
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'],
    ignores: ['src/**'],
    rules: {
      'no-restricted-syntax': ['error', ...otherVectors],
    },
  },
]
