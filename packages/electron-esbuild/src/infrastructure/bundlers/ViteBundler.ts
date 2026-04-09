import path from 'node:path'
import { createServer, build, type InlineConfig } from 'vite'

import type { BundlerInterface } from '../../domain/contracts/BundlerInterface.js'
import type { LoggerInterface } from '../../domain/contracts/LoggerInterface.js'
import type { RendererConfig } from '../../domain/value-objects/RendererConfig.js'
import { BundleError } from '../../errors/BundleError.js'

export class ViteBundler implements BundlerInterface {
  readonly target = 'renderer' as const
  private readonly _logger: LoggerInterface

  constructor(
    private readonly config: RendererConfig,
    logger: LoggerInterface,
  ) {
    this._logger = logger.child({ component: 'ViteBundler' })
  }

  async build(): Promise<void> {
    this._logger.info('Building renderer')
    try {
      await build(this._inlineConfig())
    } catch (err) {
      throw new BundleError('Renderer build failed', 'renderer', err)
    }
    this._logger.info('Renderer built')
  }

  async dev(): Promise<void> {
    this._logger.info('Starting vite dev server')
    const server = await createServer(this._inlineConfig())
    await server.listen()
    server.printUrls()

    process.on('exit', async () => {
      await server.close()
    })
  }

  private _inlineConfig(): InlineConfig {
    return {
      configFile: path.resolve(process.cwd(), this.config.configFile),
      root: path.resolve(process.cwd(), this.config.root),
      base: '',
      build: {
        outDir: path.resolve(process.cwd(), this.config.output.dir),
        emptyOutDir: true,
      },
    }
  }
}
