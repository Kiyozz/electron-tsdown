#!/usr/bin/env node

/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import enquirer from 'enquirer'
import { cyan, stripColors, bgLightYellow, black, bgLightGreen } from 'kolorist'
import minimist from 'minimist'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { createApp } from './create-app.js'
import { Template } from './enums/template.js'
import { ensureFolderEmpty } from './helpers/ensure-folder-empty.js'
import { dirname } from './helpers/filename.js'
import { emptyDir, isDirEmpty } from './helpers/fs.js'
import { isTemplateValid, TEMPLATES } from './helpers/is-template-valid.js'
import { warn } from './helpers/log.js'

const getVersion = async (): Promise<string> => {
  const pkgPath = path.resolve(dirname(import.meta), '../package.json')
  const pkg: { version: string } = JSON.parse(
    (await fs.readFile(pkgPath)).toString('utf-8'),
  )

  return pkg.version
}

const _argv = minimist(process.argv.slice(2))

if (_argv.help) {
  console.log(
    `
create-app <app-name> [options]

${bgLightGreen(black(' ARGS '))}
${cyan('app-name')}               name of your app

${bgLightYellow(black(' OPTIONS '))}
${cyan('-t, --template')}         use this template
${cyan('-p, --package-manager')}  use this package manager [npm, pnpm, yarn]
${cyan('-o, --override')}         remove existing output folder
${cyan('--version')}              prints version
${cyan('--help')}                 show this help
  `.trim(),
  )

  process.exit(0)
}

if (_argv.version) {
  const _version = await getVersion()

  console.log(_version)

  process.exit(0)
}

let [projectName] = _argv._ ?? []

try {
  if (projectName === undefined) {
    const { name } = await enquirer.prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: 'Project name:',
      initial: 'electron-tsdown-project',
    })

    projectName = name
  }

  const out = path.resolve(process.cwd(), projectName)
  const override = (_argv.o || _argv.override) ?? false

  if (override) {
    if (!isDirEmpty(out)) {
      console.warn(warn(), `removing existing folder ${out}`)
      await emptyDir(out)
    }
  } else {
    await ensureFolderEmpty(out)
  }

  let packageManager = _argv.p || _argv['package-manager']

  if (packageManager && !['pnpm', 'npm', 'yarn'].includes(packageManager)) {
    console.warn(warn(), `${packageManager} is not a known package manager.`)
  }

  let template: Template | undefined = _argv.t || _argv.template
  let templateMessage = 'Select a template:'

  if (template !== undefined) {
    if (!isTemplateValid(template)) {
      templateMessage = `${template} isn't a valid template. Please choose from below:`
      template = undefined
    }
  }

  if (template === undefined) {
    const { t } = await enquirer.prompt<{ t: Template }>({
      type: 'select',
      name: 't',
      message: templateMessage,
      choices: TEMPLATES,
    })

    template = stripColors(t) as Template
  }

  packageManager =
    packageManager ||
    (/yarn/.test(process.env.npm_execpath ?? '') ? 'yarn' : 'npm')

  await createApp({ name: projectName, packageManager, template, out })
} catch (err) {
  console.error(err)
}
