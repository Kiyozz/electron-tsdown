#!/usr/bin/env node

/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import meow from 'meow'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as url from 'node:url'

import { Cli, CliFlags } from './cli.js'
import { commands } from './commands/index.js'

const getVersion = async (): Promise<string> => {
  const dirname = path.resolve(url.fileURLToPath(import.meta.url), '..')
  const pkgPath = path.resolve(dirname, '../package.json')
  const pkg: { version: string } = JSON.parse(
    (await fs.readFile(pkgPath)).toString('utf-8'),
  )

  return pkg.version
}

const _cli = meow<CliFlags>(
  `Usage
  $ electron-esbuild [command]

Commands
  dev
    Runs a development environment
  build
    Builds your application preparing for packaging

Examples
  $ electron-esbuild dev
  $ electron-esbuild build`,
  {
    version: await getVersion(),
    flags: {
      clean: {
        type: 'boolean',
        default: true,
      },
    },
    allowUnknownFlags: true,
    importMeta: import.meta,
  },
)
type Commands = keyof typeof commands

const [_command, ...unknownInputs] = _cli.input
const _availableCommands = ['dev', 'build']

function isValidAction(command?: string): command is Commands {
  if (typeof command === 'undefined' || !_availableCommands.includes(command)) {
    _cli.showHelp(0)
  }

  return true
}

if (isValidAction(_command)) {
  const action: Cli = await commands[_command].create(_cli, unknownInputs)

  await action.init()
  if (_command === 'build') {
    process.exit(0)
  }
}
