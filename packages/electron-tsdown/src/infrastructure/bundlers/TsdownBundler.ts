import debounce from 'debounce-fn'
import * as tsdown from 'tsdown'

import type { BundlerInterface } from '../../domain/contracts/BundlerInterface.js'
import type { LoggerInterface } from '../../domain/contracts/LoggerInterface.js'
import type { MainConfig } from '../../domain/value-objects/MainConfig.js'
import { BundleError } from '../../errors/BundleError.js'

export class TsdownBundler implements BundlerInterface {
  readonly target = 'main' as const
  readonly #logger: LoggerInterface
  readonly #config: MainConfig

  constructor(config: MainConfig, logger: LoggerInterface) {
    this.#config = config
    this.#logger = logger.child({ component: 'TsdownBundler' })
  }

  async build(): Promise<void> {
    this.#logger.info('Building main process')
    try {
      await tsdown.build(this.#toInlineConfig())
    } catch (err) {
      throw new BundleError('Main process build failed', 'main', err)
    }
    this.#logger.info('Main process built')
  }

  /**
   * Starts tsdown in watch mode.
   * Resolves once **all** configs have completed their initial build, then
   * continues watching in the background and calls `onRebuild` (debounced)
   * after each subsequent rebuild cycle.
   */
  async dev(onRebuild: () => Promise<void>): Promise<void> {
    this.#logger.info('Watching main process')

    const config = this.#toInlineConfig()
    const debouncedRebuild = debounce(onRebuild, { wait: 200 })

    await tsdown.build({
      ...config,
      watch: true,
      hooks: {
        'build:done': () => {
          debouncedRebuild()
        },
      },
      logLevel: 'warn',
    })
  }

  #toInlineConfig(): tsdown.InlineConfig {
    return {
      config: this.#config.path,
      outExtensions: () => {
        return { js: '.js' }
      },
      deps: {
        neverBundle: [/^node:/i, /^electron$/i],
      },
      // tsdown enables `dts` on its own when the package or the tsconfig looks
      // like a library. The main process is never one, and the extra
      // declaration pass only slows the build down.
      dts: false,
      logLevel: 'warn',
    }
  }
}
