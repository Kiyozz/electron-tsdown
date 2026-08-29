/**
 * Point every template at the `electron-tsdown` version that is about to be
 * published.
 *
 * Templates are shipped verbatim inside the `@electron-tsdown/create-app`
 * tarball, so their `electron-tsdown` dependency is a plain string that nothing
 * resolves at install time in this repo — changesets cannot bump it, and a
 * hand-written range can easily name a version that never gets published.
 *
 * Run right after `changeset version`: `electron-tsdown`'s package.json then
 * already holds the version `changeset publish` is about to release.
 */

import { readFile, readdir, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import * as url from 'node:url'

const root = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '..',
)
const templatesDir = path.join(root, 'packages/create-app/templates')
const DEP = 'electron-tsdown'

// Matches the dependency line without reformatting the rest of the file.
const depLine = new RegExp(`("${DEP}"\\s*:\\s*")([^"]+)(")`)

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function main() {
  const { version } = await readJson(
    path.join(root, 'packages/electron-tsdown/package.json'),
  )

  if (!version) {
    throw new Error('electron-tsdown has no version')
  }

  const range = `^${version}`
  const templates = await readdir(templatesDir, { withFileTypes: true })
  let changed = 0

  for (const entry of templates) {
    if (!entry.isDirectory()) {
      continue
    }

    const file = path.join(templatesDir, entry.name, 'package.json')
    const source = await readFile(file, 'utf8')

    if (!depLine.test(source)) {
      throw new Error(`${entry.name}: no "${DEP}" dependency to sync`)
    }

    const next = source.replace(depLine, `$1${range}$3`)

    if (next === source) {
      console.log(`${entry.name}: already on ${range}`)
      continue
    }

    await writeFile(file, next)
    console.log(`${entry.name}: ${DEP} -> ${range}`)
    changed++
  }

  if (changed === 0) {
    console.log('Templates already in sync')
  }
}

await main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
