import type { ConfigLoaderInterface } from '../domain/contracts/ConfigLoaderInterface.js'
import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'
import { BuildOrchestrator } from '../domain/services/BuildOrchestrator.js'
import { TsdownBundler } from '../infrastructure/bundlers/TsdownBundler.js'
import { ViteBundler } from '../infrastructure/bundlers/ViteBundler.js'

export class BuildCommand {
  constructor(
    private readonly loader: ConfigLoaderInterface,
    private readonly orchestrator: BuildOrchestrator,
    private readonly logger: LoggerInterface,
  ) {}

  async execute(): Promise<void> {
    process.env['NODE_ENV'] = 'production'

    const config = await this.loader.load()
    const main = new TsdownBundler(config.main, this.logger)
    const renderer = new ViteBundler(config.renderer, this.logger)

    await this.orchestrator.build(main, renderer)
  }
}
