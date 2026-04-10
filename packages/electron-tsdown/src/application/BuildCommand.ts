import process from 'node:process'

import type { ConfigLoaderInterface } from '../domain/contracts/ConfigLoaderInterface.js'
import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'
import { BuildOrchestrator } from '../domain/services/BuildOrchestrator.js'
import { TsdownBundler } from '../infrastructure/bundlers/TsdownBundler.js'
import { ViteBundler } from '../infrastructure/bundlers/ViteBundler.js'

export class BuildCommand {
  readonly #loader: ConfigLoaderInterface
  readonly #orchestrator: BuildOrchestrator
  readonly #logger: LoggerInterface

  constructor(
    loader: ConfigLoaderInterface,
    orchestrator: BuildOrchestrator,
    logger: LoggerInterface,
  ) {
    this.#logger = logger
    this.#orchestrator = orchestrator
    this.#loader = loader
  }

  async execute(): Promise<void> {
    process.env['NODE_ENV'] = 'production'

    const config = await this.#loader.load()
    const main = new TsdownBundler(config.main, this.#logger)
    const renderer = new ViteBundler(config.renderer, this.#logger)

    await this.#orchestrator.build(main, renderer)
  }
}
