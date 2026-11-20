// Gate de validation du contenu de sécurité (Phase 1, tâche de
// fondation, Option 1). Vérifie que chaque src/**/content.json est
// inventorié dans CONTENT-STATUS.md et que son couple (brouillon,
// statut) respecte les six transitions autorisées — un contenu
// publié (brouillon: false) sans entrée « validé » et sans hash
// correspondant fait échouer la gate (exit 1). Branchée dans
// `npm run lint` : un échec ici est un échec du lint.
// Le hash est SÉMANTIQUE (H1) : sha256 du JSON canonique (clés
// triées récursivement, pas d'espaces) — un reformatage ne change
// pas le hash et n'invalide pas une validation. Ne jamais le
// calculer à la main : `node scripts/check-content-status.mjs
// --print-hash <chemin-du-content.json>`.
// Fail-closed : fichier de statut mal formé, entrée manquante ou
// orpheline, champ brouillon absent ou non booléen, combinaison non
// autorisée, hash absent ou différent → échec. Les erreurs nomment
// le fichier et la règle violée.
// Usage : node scripts/check-content-status.mjs [--root <dir>] [--release]
// (--root sert aux tests : la gate lit <dir>/CONTENT-STATUS.md et
// parcourt <dir>/src. --release impose que chaque bloc soit publié
// et validé par un expert. Par défaut, la racine du dépôt.)
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..')

const STATUSES = ['brouillon', 'en revue', 'validé']
const STATUS_KEYS = ['statut', 'rôle', 'date', 'hash']

// Trie les clés d'un objet récursivement (les tableaux gardent leur
// ordre : l'ordre des étapes est sémantique). Le JSON canonique
// obtenu est stable : deux écritures du même contenu donnent le
// même hash, quel que soit le formatage du fichier.
export function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep)
  }
  if (typeof value === 'object' && value !== null) {
    const out = {}
    for (const key of Object.keys(value).sort()) {
      out[key] = sortKeysDeep(value[key])
    }
    return out
  }
  return value
}

export function semanticHashText(jsonText) {
  const parsed = JSON.parse(jsonText)
  return createHash('sha256')
    .update(JSON.stringify(sortKeysDeep(parsed)))
    .digest('hex')
}

export function semanticHashFile(filePath) {
  return semanticHashText(readFileSync(filePath, 'utf8'))
}

function isDate(value) {
  if (typeof value !== 'string' || value.length !== 10) {
    return false
  }
  if (value[4] !== '-' || value[7] !== '-') {
    return false
  }
  for (let i = 0; i < 10; i++) {
    if (i === 4 || i === 7) {
      continue
    }
    if (value[i] < '0' || value[i] > '9') {
      return false
    }
  }
  const month = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))
  return month >= 1 && month <= 12 && day >= 1 && day <= 31
}

function isHash(value) {
  if (typeof value !== 'string' || value.length !== 64) {
    return false
  }
  for (const char of value) {
    const lower = char.toLowerCase()
    const isDigit = lower >= '0' && lower <= '9'
    const isHexLetter = lower >= 'a' && lower <= 'f'
    if (!isDigit && !isHexLetter) {
      return false
    }
  }
  return true
}

// Parse CONTENT-STATUS.md. Format strict, sans regex : découpage de
// lignes simple. Toute anomalie lève une Error nommant la ligne.
// Règles : le texte libre précède la première entrée ; après, une
// entrée commence par `## <chemin du content.json>` et ne contient
// que des lignes `clé: valeur` ou vides. Clés autorisées : statut,
// rôle, date, hash. Pour « validé », rôle/date/hash sont
// obligatoires ; pour « brouillon » et « en revue », les trois
// valent `-`.
export function parseStatusFile(text) {
  const entries = new Map()
  let current = null
  let currentId = null
  let lineNo = 0
  for (const rawLine of text.split('\n')) {
    lineNo += 1
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine
    if (line.startsWith('## ')) {
      const id = line.slice(3).trim()
      if (id === '') {
        throw new Error(
          `CONTENT-STATUS.md:${lineNo} : entrée sans identifiant`,
        )
      }
      if (!id.endsWith('content.json')) {
        throw new Error(
          `CONTENT-STATUS.md:${lineNo} : l'identifiant « ${id} » n'est pas un content.json`,
        )
      }
      if (entries.has(id)) {
        throw new Error(
          `CONTENT-STATUS.md:${lineNo} : entrée en double pour « ${id} »`,
        )
      }
      current = { statut: null, rôle: null, date: null, hash: null }
      currentId = id
      entries.set(id, current)
      continue
    }
    if (current === null) {
      // Texte libre avant la première entrée : ignoré.
      continue
    }
    if (line.trim() === '') {
      continue
    }
    const colon = line.indexOf(':')
    if (colon === -1) {
      throw new Error(
        `CONTENT-STATUS.md:${lineNo} : la ligne « ${line.trim()} » n'est pas une ligne « clé: valeur »`,
      )
    }
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    if (!STATUS_KEYS.includes(key)) {
      throw new Error(
        `CONTENT-STATUS.md:${lineNo} : clé inconnue « ${key} » (clés autorisées : ${STATUS_KEYS.join(', ')})`,
      )
    }
    if (current[key] !== null) {
      throw new Error(
        `CONTENT-STATUS.md:${lineNo} : clé « ${key} » en double dans l'entrée « ${currentId} »`,
      )
    }
    current[key] = value
  }
  for (const [id, entry] of entries) {
    if (entry.statut === null) {
      throw new Error(
        `CONTENT-STATUS.md : l'entrée « ${id} » n'a pas de statut`,
      )
    }
    if (!STATUSES.includes(entry.statut)) {
      throw new Error(
        `CONTENT-STATUS.md : l'entrée « ${id} » a un statut inconnu « ${entry.statut} »`,
      )
    }
    if (entry.statut === 'validé') {
      if (entry.rôle === null || entry.rôle === '-') {
        throw new Error(
          `CONTENT-STATUS.md : l'entrée « ${id} » est « validé » sans rôle`,
        )
      }
      if (!isDate(entry.date)) {
        throw new Error(
          `CONTENT-STATUS.md : l'entrée « ${id} » est « validé » sans date AAAA-MM-JJ`,
        )
      }
      if (!isHash(entry.hash)) {
        throw new Error(
          `CONTENT-STATUS.md : l'entrée « ${id} » est « validé » sans hash (64 caractères hex)`,
        )
      }
    } else {
      for (const key of ['rôle', 'date', 'hash']) {
        if (entry[key] !== null && entry[key] !== '-') {
          throw new Error(
            `CONTENT-STATUS.md : l'entrée « ${id} » (${entry.statut}) a un champ « ${key} » renseigné — il doit valoir « - » tant que le contenu n'est pas validé`,
          )
        }
      }
    }
  }
  return entries
}

// Découvre les content.json par parcours de src/ (pas de liste
// hardcodée : un nouveau bloc est couvert dès sa création).
export function discoverContentFiles(root) {
  const found = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.isFile() && entry.name === 'content.json') {
        found.push(path.relative(root, full).split(path.sep).join('/'))
      }
    }
  }
  walk(path.join(root, 'src'))
  return found.sort()
}

// Évalue un bloc : { brouillon: boolean, entry: {...} | null,
// actualHash: string }. Retourne { ok, reason } — reason nomme la
// règle violée (ou la combinaison acceptée). Les six transitions
// autorisées (M1) : brouillon:true + brouillon → OK ; brouillon:true
// + en revue → OK ; brouillon:true + validé → ÉCHEC ;
// brouillon:false + validé + hash correct → OK ; brouillon:false +
// en revue ou brouillon → ÉCHEC ; toute autre combinaison → ÉCHEC.
// Une entrée manquante (entry null) fait échouer la gate, quelle
// que soit la valeur de brouillon : tout content.json doit être
// inventorié.
export function evaluateBlock({ brouillon, entry, actualHash, release = false }) {
  if (entry === null || entry === undefined) {
    return {
      ok: false,
      reason:
        'aucune entrée dans CONTENT-STATUS.md (tout content.json doit être inventorié)',
    }
  }
  if (release && brouillon !== false) {
    return {
      ok: false,
      reason:
        'pré-commercialisation : chaque contenu doit être non brouillon et validé par un expert',
    }
  }
  if (brouillon === true && entry.statut === 'brouillon') {
    return { ok: true, reason: 'brouillon + brouillon' }
  }
  if (brouillon === true && entry.statut === 'en revue') {
    return { ok: true, reason: 'brouillon + en revue' }
  }
  if (brouillon === true && entry.statut === 'validé') {
    return {
      ok: false,
      reason:
        'brouillon: true + statut validé — incohérent : si le contenu est validé, il doit être publié (brouillon: false), sinon dé-valider',
    }
  }
  if (brouillon === false && entry.statut === 'validé') {
    if (entry.hash === actualHash) {
      return { ok: true, reason: 'brouillon: false + validé + hash correct' }
    }
    return {
      ok: false,
      reason:
        'brouillon: false + validé mais hash différent du hash enregistré — le contenu a changé depuis la validation, re-validation requise',
    }
  }
  if (brouillon === false) {
    return {
      ok: false,
      reason: `brouillon: false + statut ${entry.statut} — un contenu publié exige une entrée « validé » avec le hash du contenu`,
    }
  }
  return { ok: false, reason: 'combinaison non autorisée' }
}

export function runGate(root, { release = false } = {}) {
  const errors = []
  let statusText
  try {
    statusText = readFileSync(path.join(root, 'CONTENT-STATUS.md'), 'utf8')
  } catch {
    return {
      ok: false,
      errors: ['CONTENT-STATUS.md introuvable à la racine du dépôt'],
    }
  }
  let entries
  try {
    entries = parseStatusFile(statusText)
  } catch (error) {
    return { ok: false, errors: [error.message] }
  }
  let files
  try {
    files = discoverContentFiles(root)
  } catch {
    return { ok: false, errors: ['src/ introuvable — aucun content.json découvert'] }
  }
  if (release && files.length === 0) {
    errors.push(
      'pré-commercialisation : aucun content.json découvert — validation des contenus impossible',
    )
  }
  // Entrées orphelines : inventoriées mais sans fichier.
  for (const id of entries.keys()) {
    if (!files.includes(id)) {
      errors.push(
        `${id} : entrée dans CONTENT-STATUS.md sans content.json correspondant`,
      )
    }
  }
  for (const relative of files) {
    const absolute = path.join(root, relative)
    let content
    try {
      content = JSON.parse(readFileSync(absolute, 'utf8'))
    } catch {
      errors.push(`${relative} : JSON invalide`)
      continue
    }
    if (typeof content.brouillon !== 'boolean') {
      errors.push(`${relative} : champ « brouillon » absent ou non booléen`)
      continue
    }
    let actualHash
    try {
      actualHash = semanticHashFile(absolute)
    } catch {
      errors.push(`${relative} : hash sémantique incalculable`)
      continue
    }
    const entry = entries.get(relative) ?? null
    const verdict = evaluateBlock({
      brouillon: content.brouillon,
      entry,
      actualHash,
      release,
    })
    if (!verdict.ok) {
      errors.push(`${relative} : ${verdict.reason}`)
    }
  }
  return { ok: errors.length === 0, errors, checked: files.length }
}

function main(argv) {
  const args = argv.slice(2)
  if (args[0] === '--print-hash') {
    const target = args[1]
    if (!target) {
      console.error(
        'Usage : node scripts/check-content-status.mjs --print-hash <chemin-du-content.json>',
      )
      process.exitCode = 2
      return
    }
    const absolute = path.resolve(target)
    try {
      console.log(semanticHashFile(absolute))
    } catch {
      console.error(
        `--print-hash : impossible de lire ou de parser ${target}`,
      )
      process.exitCode = 1
    }
    return
  }
  let root = DEFAULT_ROOT
  const rootIndex = args.indexOf('--root')
  if (rootIndex !== -1) {
    if (!args[rootIndex + 1]) {
      console.error(
        'Usage : node scripts/check-content-status.mjs [--root <dir>]',
      )
      process.exitCode = 2
      return
    }
    root = path.resolve(args[rootIndex + 1])
  }
  const { ok, errors, checked } = runGate(root, {
    release: args.includes('--release'),
  })
  if (ok) {
    console.log(
      args.includes('--release')
        ? `check-content-status : OK — ${checked} bloc(s) vérifié(s), tous validés pour pré-commercialisation.`
        : `check-content-status : OK — ${checked} bloc(s) vérifié(s), inventaire et transitions cohérents.`,
    )
    return
  }
  for (const error of errors) {
    console.error(`check-content-status : ÉCHEC — ${error}`)
  }
  process.exitCode = 1
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv)
}
