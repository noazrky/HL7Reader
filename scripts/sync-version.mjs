import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const checkOnly = process.argv.includes('--check')
const version = readFileSync(join(rootDir, 'VERSION'), 'utf8').trim()
const versionPattern = /^\d+\.\d+\.\d+$/

if (!versionPattern.test(version)) {
  console.error(`VERSION must use Major.Minor.Change format, received: ${version}`)
  process.exit(1)
}

const mismatches = []

syncJsonVersion('package.json', (json, path) => {
  recordMismatch(path, 'version', json.version, version)
  json.version = version
  return json
})

syncJsonVersion('package-lock.json', (json, path) => {
  if (!json.packages || typeof json.packages !== 'object' || !json.packages['']) {
    throw new Error(`Could not find root package metadata in ${path}`)
  }

  recordMismatch(path, 'version', json.version, version)
  recordMismatch(path, 'packages[""].version', json.packages[''].version, version)

  json.version = version
  json.packages[''].version = version
  return json
})

syncJsonVersion('src-tauri/tauri.conf.json', (json, path) => {
  recordMismatch(path, 'version', json.version, version)
  json.version = version
  return json
})

syncText('src-tauri/Cargo.toml', (text, path) => {
  const packageVersionPattern = /^version = "([^"]+)"/m
  const match = text.match(packageVersionPattern)

  if (!match) {
    throw new Error(`Could not find [package] version in ${path}`)
  }

  recordMismatch(path, '[package].version', match[1], version)
  return text.replace(packageVersionPattern, `version = "${version}"`)
})

syncText('src-tauri/Cargo.lock', (text, path) => {
  const packagePattern = /(\[\[package\]\]\r?\nname = "hl7-reader-tauri"\r?\nversion = ")([^"]+)(")/
  const match = text.match(packagePattern)

  if (!match) {
    throw new Error(`Could not find hl7-reader-tauri package entry in ${path}`)
  }

  recordMismatch(path, 'hl7-reader-tauri.version', match[2], version)
  return text.replace(packagePattern, `$1${version}$3`)
})

if (mismatches.length > 0) {
  console.error(`Version metadata is out of sync with VERSION (${version}):`)
  for (const mismatch of mismatches) {
    console.error(`- ${mismatch}`)
  }

  if (checkOnly) {
    process.exit(1)
  }
}

if (!checkOnly) {
  console.log(`Version metadata synced to ${version}`)
}

function syncJsonVersion(relativePath, update) {
  const path = join(rootDir, relativePath)
  const text = readFileSync(path, 'utf8')
  const json = JSON.parse(text)
  const updatedJson = update(json, relativePath)
  const updated = `${JSON.stringify(updatedJson, null, 2)}\n`

  if (!checkOnly && updated !== text) {
    writeFileSync(path, updated)
  }
}

function syncText(relativePath, update) {
  const path = join(rootDir, relativePath)
  const text = readFileSync(path, 'utf8')
  const updated = update(text, relativePath)

  if (!checkOnly && updated !== text) {
    writeFileSync(path, updated)
  }
}

function recordMismatch(path, key, current, expected) {
  if (current !== expected) {
    mismatches.push(`${path} ${key}: ${current} != ${expected}`)
  }
}
