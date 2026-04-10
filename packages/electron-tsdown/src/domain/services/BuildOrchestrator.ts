import * as path from 'node:path'

import type { BundlerInterface } from '../contracts/BundlerInterface.js'
import type { ElectronLauncherInterface } from '../contracts/ElectronLauncherInterface.js'
import type { LoggerInterface } from '../contracts/LoggerInterface.js'
import type { AppConfig } from '../value-objects/AppConfig.js'

/**
 * Coordinates build and dev workflows.
 * Pure domain logic — no infrastructure imports.
 */
export class BuildOrchestrator {
  readonly #logger: LoggerInterface

  constructor(logger: LoggerInterface) {
    this.#logger = logger
  }

  async build(
    main: BundlerInterface,
    renderer: BundlerInterface,
  ): Promise<void> {
    this.#logger.info('Building')
    await Promise.all([main.build(), renderer.build()])
    this.#logger.info('Build complete')
  }

  async dev(
    main: BundlerInterface,
    renderer: BundlerInterface,
    launcher: ElectronLauncherInterface,
    config: AppConfig,
    args: string[],
  ): Promise<void> {
    const entryFile = path.join(config.main.outDir, config.main.outFile)

    const start = async () => {
      this.#logger.debug('Main changed — restarting electron')
      await launcher.restart(entryFile, args)
    }

    this.#logger.debug('Starting renderer dev server')
    await renderer.dev(start)

    this.#logger.debug('Starting main watcher')
    await main.dev(start)
  }
}
