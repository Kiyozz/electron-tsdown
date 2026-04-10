#!/usr/bin/env node

import { cac } from 'cac'
import * as process from 'node:process'

import { BuildCommand } from './application/BuildCommand.js'
import { DevCommand } from './application/DevCommand.js'
import { buildContainer } from './container.js'
import { BundleError } from './errors/BundleError.js'
import { ConfigError } from './errors/ConfigError.js'
import { LaunchError } from './errors/LaunchError.js'

const cli = cac('electron-tsdown')
const container = buildContainer()

cli.command('build', 'Build for production').action(async () => {
  const command = await container.make(BuildCommand)
  await command.execute()
  process.exit(0)
})

cli
  .command('dev', 'Start development environment')
  .action(async (_, rawArgs: string[]) => {
    const command = await container.make(DevCommand)
    await command.execute(rawArgs ?? [])
  })

cli.help()
cli.version('__VERSION__')

try {
  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
} catch (err) {
  if (
    err instanceof ConfigError ||
    err instanceof BundleError ||
    err instanceof LaunchError
  ) {
    process.stderr.write(err.message + '\n')
    process.exit(1)
  }
  throw err
}
