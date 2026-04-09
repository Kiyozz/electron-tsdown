/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { ChildProcess, spawn } from 'child_process'
import path from 'node:path'

import { Builder } from '../builder.js'
import { Cli, CliResult } from '../cli.js'
import { Config } from '../config/config.js'
import { CONFIG_FILE_NAME } from '../config/constants.js'
import {
  MainPossibleConfiguration,
  RendererPossibleConfiguration,
} from '../config/types.js'
import { Logger } from '../console.js'
import { Worker } from '../worker.js'

const _isWindows = process.platform === 'win32'
const _electronBin = _isWindows ? 'electron.cmd' : 'electron'
const _logger = new Logger('Commands/Dev')

class _ApplicationStarter {
  private _electronProcess: ChildProcess | undefined
  private readonly _args: readonly string[]

  constructor(unknownInputs: string[]) {
    this._cleanupProcess()
    this._args = [...unknownInputs]
  }

  async start(outputEntryFile: string): Promise<void> {
    if (this._electronProcess) {
      try {
        this._kill()
      } catch (e) {
        _logger.end('Error occurred while killing latest main', e)
      }

      this._electronProcess = undefined
    }

    _logger.log('Start application')

    this._electronProcess = spawn(
      path.resolve(`node_modules/.bin/${_electronBin}`),
      [outputEntryFile, ...this._args],
      {
        stdio: 'inherit',
        shell: true,
      },
    )

    this._cleanupElectronProcess()
  }

  private _kill(): void {
    if (this._electronProcess) {
      this._electronProcess.removeAllListeners('close')

      if (_isWindows) {
        _logger.debug('kill electron process on windows')

        spawn(
          'taskkill',
          ['/pid', `${this._electronProcess.pid}`, '/f', '/t'],
          { shell: true },
        )
      } else {
        _logger.debug('kill electron process on macOS/linux')
        const pid = this._electronProcess.pid
        const killed = this._electronProcess.killed
        this._electronProcess = undefined

        if (pid !== undefined && !killed) {
          process.kill(pid)
        }
      }
    }
  }

  private _cleanupElectronProcess() {
    this._electronProcess?.on('close', (code, signal) => {
      if (code === null) {
        _logger.error('Main Process exited with signal', signal)
        process.exit(1)
      }

      process.exit(code)
    })
  }

  private _cleanupProcess() {
    // eslint-disable-next-line no-undef
    const clean = (signal: NodeJS.Signals) => {
      process.on(signal, () => {
        _logger.log('Cleanup before exit...')
        _logger.debug('Signal', signal)

        if (!(this._electronProcess?.killed ?? false)) {
          this._kill()
        }

        process.exit(0)
      })
    }

    clean('SIGINT')
    clean('SIGTERM')
  }
}

export class Dev extends Cli {
  private readonly _mainBuilder: Builder
  private readonly _rendererBuilder: Builder | null
  private readonly _applicationStarter: _ApplicationStarter
  private readonly _config: Config<
    MainPossibleConfiguration,
    RendererPossibleConfiguration
  >

  static async create(cli: CliResult, unknownInputs: string[]): Promise<Dev> {
    process.env.NODE_ENV = 'development'

    _logger.debug('Creating worker')

    const worker = await Worker.fromFileAsync({
      file: CONFIG_FILE_NAME,
      env: 'development',
    })

    _logger.debug('Created worker')

    const config = await worker.toConfigAsync()

    _logger.debug('Parsed config')

    const [mainBuilder, rendererBuilder] = await config.toBuildersAsync()

    _logger.debug('Created builders')

    return new Dev(cli, {
      mainBuilder,
      rendererBuilder,
      unknownInputs,
      config,
    })
  }

  constructor(
    cli: CliResult,
    {
      mainBuilder,
      rendererBuilder,
      unknownInputs,
      config,
    }: {
      mainBuilder: Builder
      rendererBuilder: Builder | null
      unknownInputs: string[]
      config: Config<MainPossibleConfiguration, RendererPossibleConfiguration>
    },
  ) {
    super(cli)

    this._applicationStarter = new _ApplicationStarter(unknownInputs)
    this._mainBuilder = mainBuilder
    this._rendererBuilder = rendererBuilder
    this._config = config
  }

  async init(): Promise<void> {
    _logger.debug('Start')

    const start = () =>
      this._applicationStarter.start(
        path.join(
          this._config.main.fileConfig.output.dir,
          this._config.main.fileConfig.output.filename,
        ),
      )

    _logger.debug('Starting dev builders')
    await this._mainBuilder.dev(start)
    this._rendererBuilder?.dev(start)
    _logger.debug('Started dev builders')
    _logger.debug('Starting initial builds')

    await Promise.all([
      this._mainBuilder.hasInitialBuild
        ? this._mainBuilder.build()
        : Promise.resolve(),
      this._rendererBuilder?.hasInitialBuild
        ? this._rendererBuilder.build()
        : Promise.resolve(),
    ])

    _logger.debug('Initial builds finished')

    await start()
  }
}
