// ESLint 9, configuration plate.
// But : interdire en erreur tout vecteur d'injection HTML / JS.
// Le typage reste vérifié par `tsc -b` (script build).
// typescript-eslint n'est pas utilisé : il exige TypeScript < 6.1.0
// (pair >=4.8.4 <6.1.0) et refuse de s'installer avec TypeScript 7.0.2
// (ERESOLVE vérifié le 2026-11-17). Le parseur TypeScript est donc
// @babel/eslint-parser, indépendant de la version du compilateur.
// Ligne Babel 7 (et non 8) : @preact/preset-vite exige @babel/core 7.x,
// incompatible avec Babel 8.
// Limite connue de @babel/eslint-parser : il ne transmet pas l'option jsx
// à l'analyse de portée (eslint-scope, __isJSXEnabled), donc les
// composants utilisés uniquement en JSX sont signalés à tort par
// no-unused-vars. La règle est donc coupée pour les fichiers TS/TSX ;
// le cas est couvert par tsc (noUnusedLocals, tsconfig.app.json).
import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import globals from 'globals'

const forbiddenHtmlVectors = [
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
      'MemberExpression[object.name="document"][property.name="write"], MemberExpression[object.name="document"][property.value="write"]',
    message: 'document.write est interdit : injection HTML directe.',
  },
  {
    selector:
      'MemberExpression[object.name="document"][property.name="writeln"], MemberExpression[object.name="document"][property.value="writeln"]',
    message: 'document.writeln est interdit : même vecteur que document.write.',
  },
  {
    selector:
      'MemberExpression[object.object.name="window"][object.property.name="document"][property.name="write"], MemberExpression[object.object.name="window"][object.property.name="document"][property.value="write"]',
    message: 'window.document.write est interdit : injection HTML directe.',
  },
  {
    selector:
      'MemberExpression[object.name="window"][property.name="eval"], MemberExpression[object.name="globalThis"][property.name="eval"]',
    message: 'eval est interdit, y compris via window.eval ou globalThis.eval.',
  },
  {
    selector:
      'NewExpression[callee.object.name="window"][callee.property.name="Function"], NewExpression[callee.object.name="globalThis"][callee.property.name="Function"]',
    message: 'new Function est interdit, y compris via window.Function ou globalThis.Function.',
  },
  {
    selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
    message: 'dangerouslySetInnerHTML est interdit : injection HTML directe.',
  },
  {
    selector:
      'Property[key.name="innerHTML"], Property[key.name="dangerouslySetInnerHTML"]',
    message:
      'innerHTML et dangerouslySetInnerHTML sont interdits, y compris comme clés d’objet.',
  },
]

const forbiddenRules = {
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-restricted-syntax': ['error', ...forbiddenHtmlVectors],
}

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  {
    // Fichiers JS : parseur par défaut, règles recommandées complètes.
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: forbiddenRules,
  },
  {
    // Fichiers TS/TSX : parseur Babel (TypeScript 7 non supporté par
    // typescript-eslint), no-unused-vars coupé (voir limite ci-dessus).
    files: ['**/*.{ts,mts,cts,tsx,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [
            ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
          ],
        },
        ecmaFeatures: { jsx: true },
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...forbiddenRules,
      'no-unused-vars': 'off',
    },
  },
]
