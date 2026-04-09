import { Container } from '@adonisjs/fold'

import { BuildCommand } from './application/BuildCommand.js'
import { DevCommand } from './application/DevCommand.js'
import { BuildOrchestrator } from './domain/services/BuildOrchestrator.js'
import { ConfigLoader } from './infrastructure/ConfigLoader.js'
import { ElectronLauncher } from './infrastructure/ElectronLauncher.js'
import { PinoLogger } from './infrastructure/PinoLogger.js'

type KnownBindings = {
  [Tokens.Logger]: PinoLogger
  [Tokens.ConfigLoader]: ConfigLoader
  [Tokens.ElectronLauncher]: ElectronLauncher
}

export const Tokens = {
  Logger: 'Logger',
  ConfigLoader: 'ConfigLoader',
  ElectronLauncher: 'ElectronLauncher',
} as const

export function buildContainer(): Container<KnownBindings> {
  const container = new Container<KnownBindings>()

  container.singleton(Tokens.Logger, () => new PinoLogger())

  container.bind(
    Tokens.ConfigLoader,
    async (resolver) => new ConfigLoader(await resolver.make(Tokens.Logger)),
  )

  container.singleton(
    Tokens.ElectronLauncher,
    async (resolver) =>
      new ElectronLauncher(await resolver.make(Tokens.Logger)),
  )

  container.bind(
    BuildOrchestrator,
    async (resolver) =>
      new BuildOrchestrator(await resolver.make(Tokens.Logger)),
  )

  container.bind(
    BuildCommand,
    async (resolver) =>
      new BuildCommand(
        await resolver.make(Tokens.ConfigLoader),
        await resolver.make(BuildOrchestrator),
        await resolver.make(Tokens.Logger),
      ),
  )

  container.bind(
    DevCommand,
    async (resolver) =>
      new DevCommand(
        await resolver.make(Tokens.ConfigLoader),
        await resolver.make(BuildOrchestrator),
        await resolver.make(Tokens.ElectronLauncher),
        await resolver.make(Tokens.Logger),
      ),
  )

  return container
}
