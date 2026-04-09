/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import fs from 'node:fs'
import path from 'node:path'
import { loadConfig } from 'unconfig'

import {
  Config,
  ConfigItem,
  EnvConfig,
  MainEnvConfig,
  toConfigurator,
} from './config/config.js'
import { Configurator } from './config/configurators/base.configurator.js'
import { Target, TypeConfig } from './config/enums.js'
import {
  ExtractArray,
  MainPossibleConfiguration,
  RendererPossibleConfiguration,
} from './config/types.js'
import { configByEnv } from './config/utils.js'
import { Configuration, Validator } from './config/validation.js'
import { Logger } from './console.js'
import { Env } from './env.js'

const _logger = new Logger('Config')
const _cwd = process.cwd()

const _resolve = (...paths: string[]): string => path.resolve(_cwd, ...paths)

/**
 * @param configPath
 */
const _loadUserConfig = async <C>(configPath: string): Promise<C> => {
  const { config } = await loadConfig<C>({
    sources: [
      {
        files: configPath,
      },
    ],
  })

  try {
    return config
  } catch (e) {
    _logger.error('electron-esbuild could not load file', configPath)
    _logger.error('below stack:')
    _logger.end(e)
    process.exit(1)
  }
}

class _WorkerConfigurator {
  readonly main: Configurator<TypeConfig, MainEnvConfig>
  readonly renderer: Configurator<TypeConfig> | null

  constructor({
    main,
    renderer,
  }: {
    main: Configurator<TypeConfig, MainEnvConfig>
    renderer: Configurator<TypeConfig> | null
  }) {
    this.main = main
    this.renderer = renderer
  }

  static fromConfig(config: Configuration): _WorkerConfigurator {
    const main = toConfigurator(config.main)
    const renderer = config.renderer ? toConfigurator(config.renderer) : null

    return new this({ main, renderer })
  }
}

export class Worker<
  M extends MainPossibleConfiguration,
  R extends RendererPossibleConfiguration,
> {
  private readonly _file: string
  private readonly _main: Partial<ExtractArray<M>>
  private readonly _renderer: Partial<ExtractArray<R>>

  readonly env: Env
  readonly configurator: _WorkerConfigurator

  constructor({
    file,
    env,
    main,
    renderer,
    configurator,
  }: {
    file: string
    env: Env
    configurator: _WorkerConfigurator
    main: Partial<ExtractArray<M>>
    renderer: Partial<ExtractArray<R>>
  }) {
    this._file = file
    this.env = env
    this._main = main
    this._renderer = renderer
    this.configurator = configurator
  }

  static async fromFileAsync<
    M extends MainPossibleConfiguration,
    R extends RendererPossibleConfiguration,
  >({ file, env }: { file: string; env: Env }): Promise<Worker<M, R>> {
    // const yaml = _loadYaml(file)
    const rawUserConfig = await _loadUserConfig(file)
    const validator = new Validator()
    const userConfig = validator.validate(rawUserConfig)
    const configurator = _WorkerConfigurator.fromConfig(userConfig)
    const main = configByEnv({
      dev: env === 'development',
      type: configurator.main.type,
    }) as Partial<ExtractArray<M>>
    const renderer = configByEnv({
      dev: env === 'development',
      type: configurator.renderer?.type ?? null,
    }) as Partial<ExtractArray<R>>

    return new this({
      file,
      env,
      configurator,
      main,
      renderer,
    })
  }

  async toConfigAsync(): Promise<Config<M, R>> {
    const mainConfig = this.configurator.main.config
    const rendererConfig = this.configurator.renderer?.config ?? null

    if (!fs.existsSync(mainConfig.path)) {
      _logger.end(
        `Main config file '${mainConfig.path}' not found. Check your ${this._file} file`,
      )
    }

    if (rendererConfig !== null && !fs.existsSync(rendererConfig.path)) {
      _logger.end(
        `Renderer config file '${rendererConfig.path}' not found. Check your ${this._file} file`,
      )
    }

    process.env.NODE_ENV = this.env
    const mainConfigPath = _resolve(mainConfig.path)
    const rendererConfigPath =
      rendererConfig !== null ? _resolve(rendererConfig.path) : null

    const userMainConfig = await _loadUserConfig<M>(mainConfigPath)

    const userRendererConfig = rendererConfigPath
      ? await _loadUserConfig<R>(rendererConfigPath)
      : null

    const mainConfigFinal = this.configurator.main.toBuilderConfig(
      this._main,
      userMainConfig,
      Target.main,
    ) as M

    const rendererConfigFinal =
      userRendererConfig !== null
        ? this.configurator.renderer
          ? (this.configurator.renderer.toBuilderConfig(
              this._renderer,
              userRendererConfig,
              Target.renderer,
            ) as R | null)
          : null
        : null

    return new Config<M, R>({
      main: new ConfigItem<M, MainEnvConfig>({
        config: mainConfigFinal,
        fileConfig: mainConfig,
        target: Target.main,
      }),
      renderer: new ConfigItem<R | null>({
        config: rendererConfigFinal,
        fileConfig: rendererConfig,
        target: Target.renderer,
      }),
    })
  }
}
