// Garde-fou tel: (Phase 1, Option 2, décision Master 2026-11-17,
// Haute n°2) : l'app ne doit jamais composer de numéro de
// téléphone. Le 911 (et les autres numéros d'urgence) est du texte,
// pas un appel — l'utilisateur contacte lui-même les services
// d'urgence avec son propre téléphone.
//
// Trois couches : (1) ESLint interdit href="tel:" en JSX
// (no-restricted-syntax, coreVectors, eslint.config.js) ; (2) ce
// test vérifie le built output (dist/**/*.js, *.html, *.css) après
// build : aucune occurrence de tel:, ni des numéros d'urgence
// \b(911|112|15|17|18|144|117|118)\b, ni href="tel: / href='tel: ;
// (3) la règle est écrite dans le README comme exigence, pas
// convention. Motifs vérifiés ZÉRO faux positif sur le dist/ du
// 2026-11-17 (vérifié par grep avant d'écrire ce test : tel: 0,
// 911/112/144/117/118 0, 15/17/18 en mot entier 0, href tel: 0).
// Risque connu : un littéral numérique 15/17/18 légitime dans le
// code futur déclencherait le test (fail-closed par conception —
// le message nomme le fichier et le motif, le contributeur juge).
// Limite honnête : une construction dynamique ('tel:' + x) échappe
// à l'ESLint statique et au grep (voir task-1.2-scope.md). La CSP
// ne bloque pas tel: — résidu assumé, pas à prétendre résolu.
// Contrôle négatif : injecter un tel:911 dans un composant fait
// échouer ce test (vérifié le 2026-11-17, hash de retour vérifié).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { DIST } from './helpers'

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: 'tel:', re: /tel:/i },
  { name: 'numéro d’urgence', re: /\b(911|112|15|17|18|144|117|118)\b/ },
  { name: 'href="tel:', re: /href=["']tel:/i },
]

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, out)
    } else if (/\.(js|html|css)$/.test(entry.name)) {
      out.push(full)
    }
  }
}

test('built output : aucun tel:, aucun numéro d’urgence', async () => {
  // dist/ doit exister : `npm run test:e2e` build avant la suite.
  // Sans build, le test échoue explicitement au lieu de passer
  // sur du vide (vacuité).
  expect(
    statSync(DIST, { throwIfNoEntry: false })?.isDirectory() ?? false,
    'dist/ absent — lancer npm run build avant la suite',
  ).toBe(true)
  const files: string[] = []
  walk(DIST, files)
  expect(files.length).toBeGreaterThan(0)
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const { name, re } of PATTERNS) {
      expect(
        re.test(text),
        `${path.relative(DIST, file)} contient « ${name} » — lien tel: ou numéro d’urgence interdit dans le built output`,
      ).toBe(false)
    }
  }
})
