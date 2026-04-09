/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import debounce from 'debounce-fn'
import * as tsdown from 'tsdown'

import { BaseBuilder } from './base.builder.js'
import type { ConfigItem } from '../config/config.js'
import { Logger } from '../console.js'

const _logger = new Logger('Builder/Tsdown')

export class TsdownBuilder extends BaseBuilder<tsdown.UserConfig[]> {
  readonly hasInitialBuild = true

  constructor(protected readonly _config: ConfigItem<tsdown.UserConfig[]>) {
    super(_config)
  }

  async build(): Promise<void> {
    _logger.log('Building', this.env.toLowerCase())
    await Promise.all(
      this._config.config.map((config) =>
        tsdown.build({
          ...config,
          logLevel: 'error',
          config: false,
        }),
      ),
    )
    _logger.log(this.env, 'built')
  }

  async dev(start: () => void): Promise<void> {
    if (this._config.fileConfig === null) {
      return
    }

    if (this._config.isMain) {
      //region isMain
      const debouncedStart = debounce(start, { wait: 200 })
      const startPlugin: tsdown.Rolldown.Plugin = {
        name: 'electron-esbuild-start',
        writeBundle() {
          debouncedStart()
        },
      }

      await Promise.all(
        this._config.config.map((config) =>
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
      //endregion
    } else if (this._config.isRenderer) {
      //region isRenderer
      _logger.end(
        'esbuild has been removed for the renderer, use `vite` instead. Check out the documentation for more information about vite in the renderer.',
      )
      //endregion
    }
  }
}
