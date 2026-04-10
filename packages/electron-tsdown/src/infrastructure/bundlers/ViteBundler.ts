import * as path from 'node:path'
import * as process from 'node:process'
import * as vite from 'vite'

import type { BundlerInterface } from '../../domain/contracts/BundlerInterface.js'
import type { LoggerInterface } from '../../domain/contracts/LoggerInterface.js'
import type { RendererConfig } from '../../domain/value-objects/RendererConfig.js'
import { BundleError } from '../../errors/BundleError.js'

export class ViteBundler implements BundlerInterface {
  readonly target = 'renderer' as const
  readonly #logger: LoggerInterface
  readonly #config: RendererConfig

  constructor(config: RendererConfig, logger: LoggerInterface) {
    this.#config = config
    this.#logger = logger.child({ component: 'ViteBundler' })
  }

  async build(): Promise<void> {
    this.#logger.info('Building renderer')
    try {
      await vite.build(this.#toInlineConfig())
    } catch (err) {
      throw new BundleError('Renderer build failed', 'renderer', err)
    }
    this.#logger.info('Renderer built')
  }

  async dev(): Promise<void> {
    this.#logger.info('Starting vite dev server')
    const server = await vite.createServer(this.#toInlineConfig())
    await server.listen()
    server.printUrls()

    process.on('exit', async () => {
      await server.close()
    })
  }

  #toInlineConfig(): vite.InlineConfig {
    const cwd = process.cwd()

    return {
      configFile: path.resolve(cwd, this.#config.path),
      root: path.resolve(cwd, this.#config.root),
      base: '',
      build: {
        outDir: path.resolve(cwd, this.#config.outDir),
        emptyOutDir: true,
      },
    }
  }
}
