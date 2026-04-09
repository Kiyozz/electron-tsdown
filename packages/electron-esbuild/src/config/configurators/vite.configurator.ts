/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import deepMerge from 'deepmerge'
import nodeModule from 'node:module'
import { InlineConfig } from 'vite'

import type { Configurator } from './base.configurator.js'
import type { EnvConfig } from '../config.js'
import { TypeConfig } from '../enums.js'

export class ViteConfigurator implements Configurator<'vite'> {
  public readonly type = TypeConfig.vite

  constructor(public readonly config: EnvConfig) {}

  toBuilderConfig(
    partial: Partial<InlineConfig>,
    userConfig: InlineConfig,
  ): InlineConfig {
    let external = partial?.build?.rolldownOptions?.external

    if (!Array.isArray(external)) {
      external = [external as string]
    }

    return deepMerge(
      userConfig,
      {
        build: {
          emptyOutDir: true,
          rollupOptions: {
            external: [
              ...(external ?? []),
              'electron',
              ...nodeModule.builtinModules,
            ],
          },
        },
        server: {
          fs: {
            allow: ['../..'],
          },
        },
      },
      { clone: false },
    )
  }
}
