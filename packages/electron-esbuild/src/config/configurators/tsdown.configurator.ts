/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import deepMerge from 'deepmerge'
import nodeModule from 'node:module'
import path from 'node:path'
import * as process from 'node:process'
import { UserConfig } from 'tsdown'

import type { Configurator } from './base.configurator.js'
import type { EnvConfig } from '../config.js'
import { TypeConfig } from '../enums.js'

export class TsdownConfigurator implements Configurator<'tsdown'> {
  public readonly type = TypeConfig.tsdown

  constructor(public readonly config: EnvConfig) {}

  toBuilderConfig(
    partial: Partial<UserConfig>,
    userConfig: UserConfig[],
  ): UserConfig[] {
    const outDir = path.resolve(process.cwd(), this.config.output.dir)

    return userConfig.map((config) =>
      deepMerge(
        deepMerge(config, partial, { clone: false }),
        {
          outDir,
          deps: {
            neverBundle: [
              'electron',
              ...nodeModule.builtinModules,
              ...nodeModule.builtinModules.map((m) => `node:${m}`),
            ] as string[],
          },
        },
        { clone: false },
      ),
    )
  }
}
