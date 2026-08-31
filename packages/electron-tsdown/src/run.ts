#!/usr/bin/env node

import { cac } from 'cac'
import process from 'node:process'

import { BuildCommand } from './application/BuildCommand.js'
import { DevCommand } from './application/DevCommand.js'
import { buildContainer } from './container.js'
import { BundleError } from './errors/BundleError.js'
import { ConfigError } from './errors/ConfigError.js'
import { LaunchError } from './errors/LaunchError.js'

const _ownFlags = new Set(['-h', '--help', '-v', '--version'])

/**
 * Everything given after the command name that electron-tsdown does not own is
 * forwarded as-is to the electron process, with or without a `--` separator.
 */
function forwardedArgs(argv: string[], command: string): string[] {
  const args = argv.slice(2)
  const index = args.indexOf(command)

  return (index === -1 ? args : args.slice(index + 1)).filter(
    (arg) => arg !== '--' && !_ownFlags.has(arg),
  )
}

const cli = cac('electron-tsdown')
const container = buildContainer()

cli.command('build', 'Build for production').action(async () => {
  const command = await container.make(BuildCommand)
  await command.execute()
  process.exit(0)
})

cli
  .command('dev', 'Start development environment')
  .allowUnknownOptions()
  .action(async () => {
    const command = await container.make(DevCommand)
    await command.execute(forwardedArgs(process.argv, 'dev'))
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
