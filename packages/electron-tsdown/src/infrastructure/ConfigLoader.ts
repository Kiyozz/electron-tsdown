import * as process from 'node:process'
import { loadConfig } from 'unconfig'

import type { ConfigLoaderInterface } from '../domain/contracts/ConfigLoaderInterface.js'
import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'
import { AppConfig } from '../domain/value-objects/AppConfig.js'
import { ConfigError } from '../errors/ConfigError.js'

const CONFIG_FILE = 'electron-tsdown.config'

export class ConfigLoader implements ConfigLoaderInterface {
  readonly #logger: LoggerInterface

  constructor(logger: LoggerInterface) {
    this.#logger = logger.child({ component: 'ConfigLoader' })
  }

  async load(): Promise<AppConfig> {
    this.#logger.debug('Loading config', { file: CONFIG_FILE })

    const { config: raw, sources } = await loadConfig<unknown>({
      sources: [{ files: CONFIG_FILE }],
      cwd: process.cwd(),
    })

    if (!raw) {
      throw new ConfigError(
        `Config file '${CONFIG_FILE}' not found. Create one with defineConfig().`,
      )
    }

    this.#logger.debug('Config loaded', { source: sources[0] })

    return new AppConfig(raw)
  }
}
