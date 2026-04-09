/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { UserConfig } from 'tsdown'
import { InlineConfig } from 'vite'

import { Configurator } from './configurators/base.configurator.js'
import { TsdownConfigurator } from './configurators/tsdown.configurator.js'
import { ViteConfigurator } from './configurators/vite.configurator.js'
import { Target, TypeConfig } from './enums.js'
import {
  MainPossibleConfiguration,
  PossibleConfiguration,
  RendererPossibleConfiguration,
} from './types.js'
import { TsdownBuilder } from '../builder/tsdown.builder.js'
import { ViteBuilder } from '../builder/vite.builder.js'
import { Builder } from '../builder.js'
import { unsupportedType } from '../console.js'
import { Configuration } from './validation.js'

export type EnvConfig = MainEnvConfig | NonNullable<Configuration['renderer']>

export type MainEnvConfig = Configuration['main']

export function toConfigurator<E extends EnvConfig>(envConfig: E) {
  switch (envConfig.type) {
    case TypeConfig.tsdown:
      return new TsdownConfigurator(envConfig) as Configurator<TypeConfig, E>
    case TypeConfig.vite:
      return new ViteConfigurator(envConfig) as Configurator<TypeConfig, E>
    default:
      unsupportedType()
  }
}

export class ConfigItem<
  T extends PossibleConfiguration | null = PossibleConfiguration,
  F extends EnvConfig | null = EnvConfig | null,
> {
  readonly config: T
  readonly fileConfig: F
  readonly target: Target
  readonly isVite: boolean
  readonly isTsdown: boolean
  readonly isMain: boolean
  readonly isRenderer: boolean

  constructor({
    config,
    fileConfig,
    target,
  }: {
    config: T
    fileConfig: F
    target: Target
  }) {
    this.config = config
    this.fileConfig = fileConfig
    this.target = target
    this.isVite = this.fileConfig?.type === TypeConfig.vite
    this.isTsdown = this.fileConfig?.type === TypeConfig.tsdown
    this.isMain = this.target === Target.main
    this.isRenderer = this.target === Target.renderer
  }

  async toBuilderAsync(): Promise<Builder | null> {
    if (this.isTsdown) {
      return new TsdownBuilder(this as ConfigItem<UserConfig[]>)
    } else if (this.isVite) {
      return await ViteBuilder.create(this as ConfigItem<InlineConfig>)
    }

    if (this.fileConfig !== null) {
      unsupportedType(this.isMain ? 'main' : 'renderer')
    }

    return null
  }
}

export class Config<
  M extends MainPossibleConfiguration,
  R extends RendererPossibleConfiguration,
> {
  readonly main: ConfigItem<M, MainEnvConfig>
  readonly renderer: ConfigItem<R | null>

  constructor({
    main,
    renderer,
  }: {
    main: ConfigItem<M, MainEnvConfig>
    renderer: ConfigItem<R | null>
  }) {
    this.main = main
    this.renderer = renderer
  }

  async toBuildersAsync(): Promise<readonly [Builder, Builder | null]> {
    return [
      (await this.main.toBuilderAsync()) as Builder,
      await this.renderer.toBuilderAsync(),
    ]
  }
}
