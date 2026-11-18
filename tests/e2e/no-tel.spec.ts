// Garde-fou tel: (Phase 1, Option 2, décision Master 2026-11-17,
// Haute n°2 ; correctif 1.2a, décision Master 2026-11-18) :
// l'app ne doit jamais composer de numéro de téléphone. Le 911
// (et les autres numéros d'urgence) est du texte, pas un appel —
// l'utilisateur contacte lui-même les services d'urgence avec
// son propre téléphone.
//
// Trois surfaces, trois regexes, chacune calibrée (1.2a ;
// correction Option 1, décision Master 2026-11-18) :
// (1) dist/ (built output) : tel: + \b(?:911|112)\b — 144|117|118
//     RETIRÉS (Option 1 : rares, et rgba/hsl/unitless les font
//     matcher — rgba(255, 144, 0, 1), hsl(144, 50%, 50%), 0.144,
//     144 144 — valeurs CSS légitimes). Le motif des numéros
//     porte un lookbehind (?<!#) : #911 et #112 sont aussi des
//     hex valides — sans lui, le contrôle positif ci-dessous
//     échouerait sur son propre cas.
// (2) content.json source (src/**/content.json, lu en source) :
//     tel: + \b(?:911|112|144|117|118)\b (liste COMPLÈTE —
//     c'est là que le texte de sécurité vit, et rgba/hsl
//     n'existent pas dans un JSON) + \b(?:15|17|18)\b (15 = SAMU,
//     17 = police, 18 = pompiers : le garde-fou tel: couvre le
//     lien, pas le texte écrit en dur).
// (3) sources .tsx/.html/.css : tel: + \b(?:911|112)\b (liste
//     réduite, comme dist/ — 144|117|118 en texte dur dans un
//     .tsx ne sont plus détectés ; tel: les couvre toujours) +
//     15|17|18 uniquement avec un verbe d'appel :
//     \b(?:appel(?:er|ez)|composer|contactez)\s+(?:le|au|les)?\s*(?:15|17|18)\b
//     (drapeau i : « Appelez » en début de phrase). Limites
//     honnêtes, testées le 2026-11-18 : « 15 : appelez » (nombre
//     avant le verbe), « Appelez le 15h » (pas de \b après le 5),
//     « Appelez le SAMU (15) » (nombre entre parenthèses, non
//     adjacent au verbe) ne sont PAS détectés. Le multiligne
//     fonctionne (\s matche \n), la ponctuation après le nombre
//     aussi (« Appelez le 15. », « Appelez le 15, »).
//     Limite assumée (1.2a) : un numéro 15/17/18 nu dans un
//     .tsx sans verbe d'appel n'est PAS détecté ; la règle
//     couvre les formulations d'appel actives, pas les mentions
//     descriptives — <p>Numéro : 15</p>, <p>Le 15 est le SAMU</p>,
//     <p>En cas d'urgence, 15.</p> passent le test.
// Contrôle positif (1.2a) : le fixture tests/fixtures/
// no-tel-positive/ contient les onze occurrences légitimes
// (.col-15, opacity: 0.15, 15%, [1, 15, 20], #144, #911, #112,
// rgba(255, 144, 0, 1), hsl(144, 50%, 50%), 0.144, 144 144) ;
// il est copié dans dist/ avant le scan, et le test doit passer
// malgré elles. Le test « contrôle positif » asserte que le
// fixture contient bien les onze littéraux (sinon le passage
// serait vacuité). Contrôle de complétude : le fixture doit
// contenir tous les cas testés, sinon le test de complétude
// échoue. Ce n'est pas le contrôle de vacuité du scan — celui-ci
// est prouvé par tel:911 dans la spec dist/. (Retirer une
// occurrence (.col-15) laisse le scan vert mais fait échouer
// l'assertion de complétude — signal attendu. Vérifié le
// 2026-11-18, fixture restauré, hash vérifié.)
// Contrôle négatif : injecter un tel:911 dans un composant fait
// échouer ce test (vérifié le 2026-11-17, rejoué le 2026-11-18,
// hash de retour vérifié).
// Limite honnête : une construction dynamique ('tel:' + x)
// échappe à l'ESLint statique et au grep — résidu assumé, pas à
// prétendre résolu. La CSP ne bloque pas tel:.
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { DIST, REPO_ROOT } from './helpers'

const FIXTURE_SRC = path.join(
  REPO_ROOT,
  'tests',
  'fixtures',
  'no-tel-positive',
)
const FIXTURE_DIST = path.join(DIST, '__no-tel-fixture__')
// Les onze occurrences légitimes du contrôle positif — le test
// « contrôle positif » asserte leur présence dans le fixture
// (sinon le passage serait vacuité).
const LEGIT_OCCURRENCES = [
  '.col-15',
  'opacity: 0.15',
  '15%',
  '[1, 15, 20]',
  '#144',
  '#911',
  '#112',
  'rgba(255, 144, 0, 1)',
  'hsl(144, 50%, 50%)',
  '0.144',
  '144 144',
]

// Surface dist/ : tel: + 911|112 (liste réduite, Option 1 —
// lookbehind anti-hex, voir l'en-tête).
const PATTERNS_DIST: Array<{ name: string; re: RegExp }> = [
  { name: 'tel:', re: /tel:/i },
  {
    name: 'numéro d’urgence',
    re: /(?<!#)\b(?:911|112)\b/,
  },
  { name: 'href="tel:', re: /href=["']tel:/i },
]

// Surface content.json source : tel: + 3 chiffres + 2 chiffres
// (le texte de sécurité vit là).
const PATTERNS_CONTENT_JSON: Array<{ name: string; re: RegExp }> = [
  { name: 'tel:', re: /tel:/i },
  {
    name: 'numéro d’urgence',
    re: /(?<!#)\b(?:911|112|144|117|118)\b/,
  },
  {
    name: 'numéro d’urgence à 2 chiffres',
    re: /(?<!#)\b(?:15|17|18)\b/,
  },
]

// Surface sources : tel: + 911|112 (liste réduite, comme dist/)
// + 2 chiffres avec verbe d'appel (drapeau i : « Appelez » en
// début de phrase).
const PATTERNS_SOURCES: Array<{ name: string; re: RegExp }> = [
  { name: 'tel:', re: /tel:/i },
  {
    name: 'numéro d’urgence',
    re: /(?<!#)\b(?:911|112)\b/,
  },
  {
    name: 'numéro d’urgence appelé',
    re: /\b(?:appel(?:er|ez)|composer|contactez)\s+(?:le|au|les)?\s*(?:15|17|18)\b/i,
  },
]

function walk(dir: string, out: string[], extRe: RegExp): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, out, extRe)
    } else if (extRe.test(entry.name)) {
      out.push(full)
    }
  }
}

function assertNoMatch(
  file: string,
  base: string,
  patterns: Array<{ name: string; re: RegExp }>,
): void {
  const text = readFileSync(file, 'utf8')
  for (const { name, re } of patterns) {
    expect(
      re.test(text),
      `${path.relative(base, file)} contient « ${name} » — lien tel: ou numéro d’urgence interdit`,
    ).toBe(false)
  }
}

test.beforeAll(() => {
  // dist/ doit exister : `npm run test:e2e` build avant la suite.
  // Sans build, le test échoue explicitement au lieu de passer
  // sur du vide (vacuité).
  expect(
    statSync(DIST, { throwIfNoEntry: false })?.isDirectory() ?? false,
    'dist/ absent — lancer npm run build avant la suite',
  ).toBe(true)
  // Contrôle positif : le fixture est copié dans dist/ pour être
  // scanné avec le built output. S'il est absent, le contrôle
  // est vacuité — échec explicite, pas de passage silencieux.
  expect(
    existsSync(FIXTURE_SRC),
    'fixture no-tel-positive absent — tests/fixtures/no-tel-positive/',
  ).toBe(true)
  cpSync(FIXTURE_SRC, FIXTURE_DIST, { recursive: true })
})

test.afterAll(() => {
  // Le fixture ne fait pas partie du built output : il est retiré
  // de dist/ après le scan.
  rmSync(FIXTURE_DIST, { recursive: true, force: true })
})

test('built output (dist/) : aucun tel:, aucun numéro d’urgence', () => {
  const files: string[] = []
  walk(DIST, files, /\.(js|html|css)$/)
  expect(files.length).toBeGreaterThan(0)
  for (const file of files) {
    assertNoMatch(file, DIST, PATTERNS_DIST)
  }
})

test('contrôle positif : occurrences légitimes (.col-15, 0.15, 15%, [1, 15, 20], #144, #911, #112, rgba, hsl, 0.144, 144 144)', () => {
  // Le fixture contient bien les onze occurrences — sinon le
  // passage du test dist/ serait vacuité.
  const fixtureFiles: string[] = []
  walk(FIXTURE_SRC, fixtureFiles, /\.(js|css)$/)
  expect(fixtureFiles.length).toBeGreaterThan(0)
  const fixtureText = fixtureFiles
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
  for (const literal of LEGIT_OCCURRENCES) {
    expect(
      fixtureText.includes(literal),
      `fixture incomplet — il manque « ${literal} »`,
    ).toBe(true)
  }
  // ... et les motifs dist/ ne les détectent pas.
  const copiedFiles: string[] = []
  walk(FIXTURE_DIST, copiedFiles, /\.(js|css)$/)
  expect(copiedFiles.length).toBeGreaterThan(0)
  for (const file of copiedFiles) {
    assertNoMatch(file, DIST, PATTERNS_DIST)
  }
})

test('content.json source : tel: et numéros d’urgence interdits', () => {
  const files: string[] = []
  walk(path.join(REPO_ROOT, 'src'), files, /^content\.json$/)
  // Au moins un content.json doit exister, sinon le test est
  // vacuité.
  expect(files.length).toBeGreaterThan(0)
  for (const file of files) {
    assertNoMatch(file, REPO_ROOT, PATTERNS_CONTENT_JSON)
  }
})

test('sources .tsx/.html/.css : tel: et numéros d’urgence interdits', () => {
  const files: string[] = []
  walk(path.join(REPO_ROOT, 'src'), files, /\.(tsx|css)$/)
  files.push(path.join(REPO_ROOT, 'index.html'))
  expect(files.length).toBeGreaterThan(0)
  for (const file of files) {
    assertNoMatch(file, REPO_ROOT, PATTERNS_SOURCES)
  }
})
