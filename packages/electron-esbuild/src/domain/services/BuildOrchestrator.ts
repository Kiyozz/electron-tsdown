import path from 'node:path'

import type { BundlerInterface } from '../contracts/BundlerInterface.js'
import type { ElectronLauncherInterface } from '../contracts/ElectronLauncherInterface.js'
import type { LoggerInterface } from '../contracts/LoggerInterface.js'
import type { AppConfig } from '../value-objects/AppConfig.js'

/**
 * Coordinates build and dev workflows.
 * Pure domain logic — no infrastructure imports.
 */
export class BuildOrchestrator {
  constructor(private readonly _logger: LoggerInterface) {}

  async build(
    main: BundlerInterface,
    renderer: BundlerInterface,
  ): Promise<void> {
    this._logger.info('Building')
    await Promise.all([main.build(), renderer.build()])
    this._logger.info('Build complete')
  }

  async dev(
    main: BundlerInterface,
    renderer: BundlerInterface,
    launcher: ElectronLauncherInterface,
    config: AppConfig,
    args: string[],
  ): Promise<void> {
    const entryFile = path.join(
      config.main.output.dir,
      config.main.output.filename,
    )

    const start = async () => {
      this._logger.debug('Main changed — restarting electron')
      await launcher.restart(entryFile, args)
    }

    this._logger.debug('Starting renderer dev server')
    await renderer.dev(start)

    this._logger.debug('Starting main watcher')
    await main.dev(start)
  }
}
