import debounce from 'debounce-fn'
import nodeModule from 'node:module'
import path from 'node:path'
import * as tsdown from 'tsdown'

import type { BundlerInterface } from '../../domain/contracts/BundlerInterface.js'
import type { LoggerInterface } from '../../domain/contracts/LoggerInterface.js'
import type { MainConfig } from '../../domain/value-objects/MainConfig.js'
import { BundleError } from '../../errors/BundleError.js'

const NEVER_BUNDLE = [
  'electron',
  ...nodeModule.builtinModules,
  ...nodeModule.builtinModules.map((m) => `node:${m}`),
]

export class TsdownBundler implements BundlerInterface {
  readonly target = 'main' as const
  private readonly logger: LoggerInterface

  constructor(
    private readonly config: MainConfig,
    logger: LoggerInterface,
  ) {
    this.logger = logger.child({ component: 'TsdownBundler' })
  }

  async build(): Promise<void> {
    this.logger.info('Building main process')
    try {
      await Promise.all(this._resolvedConfigs().map((c) => tsdown.build(c)))
    } catch (err) {
      throw new BundleError('Main process build failed', 'main', err)
    }
    this.logger.info('Main process built')
  }

  /**
   * Starts tsdown in watch mode.
   * Resolves once **all** configs have completed their initial build, then
   * continues watching in the background and calls `onRebuild` (debounced)
   * after each subsequent rebuild cycle.
   */
  async dev(onRebuild: () => Promise<void>): Promise<void> {
    this.logger.info('Watching main process')

    const configs = this._resolvedConfigs()
    const debouncedRebuild = debounce(onRebuild, { wait: 200 })
    const startPlugin: tsdown.Rolldown.Plugin = {
      name: 'electron-esbuild-start',
      writeBundle() {
        debouncedRebuild()
      },
    }

    await Promise.all(
      configs.map((config) =>
        tsdown.build({
          ...config,
          watch: true,
          plugins: [
            ...(Array.isArray(config.plugins)
              ? config.plugins
              : config.plugins != null
                ? [config.plugins]
                : []),
            startPlugin,
          ],
        }),
      ),
    )
  }

  async startDevServer(): Promise<void> {
    // no-op — main process has no dev server
  }

  private _resolvedConfigs(): tsdown.UserConfig[] {
    const outDir = path.resolve(process.cwd(), this.config.output.dir)
    return this.config.configs.map((c) => ({
      ...c,
      outDir,
      config: false,
      deps: {
        ...c.deps,
        neverBundle: NEVER_BUNDLE,
      },
    }))
  }
}
