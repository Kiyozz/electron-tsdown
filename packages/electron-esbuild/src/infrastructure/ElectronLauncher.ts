import os from 'node:os'
import path from 'node:path'
import { x } from 'tinyexec'

import type { ElectronLauncherInterface } from '../domain/contracts/ElectronLauncherInterface.js'
import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'

const _isWindows = os.platform() === 'win32'
const _electronBin = _isWindows ? 'electron.cmd' : 'electron'

export class ElectronLauncher implements ElectronLauncherInterface {
  private _proc: ReturnType<typeof x> | null = null
  private readonly _logger: LoggerInterface

  constructor(logger: LoggerInterface) {
    this._logger = logger.child({ component: 'ElectronLauncher' })
    this._registerSignalHandlers()
  }

  async launch(entryFile: string, args: string[]): Promise<void> {
    const bin = path.resolve(`node_modules/.bin/${_electronBin}`)
    this._logger.info('Starting electron', { entryFile })

    this._proc = x(bin, [entryFile, ...args], {
      nodeOptions: { stdio: 'inherit' },
      throwOnError: false,
    })

    this._proc.process?.on('close', (code, signal) => {
      if (code === null) {
        this._logger.error('Electron exited with signal', { signal })
        process.exit(1)
      }

      process.exit(code)
    })
  }

  async restart(entryFile: string, args: string[]): Promise<void> {
    await this.kill()
    await this.launch(entryFile, args)
  }

  async kill(): Promise<void> {
    if (!this._proc?.process) return

    this._logger.debug('Killing electron process')

    this._proc.process.removeAllListeners('close')

    if (_isWindows) {
      const pid = this._proc.process.pid

      if (pid) {
        x('taskkill', ['/pid', String(pid), '/f', '/t'], {
          nodeOptions: { shell: true },
          throwOnError: false,
        })
      }
    } else {
      this._proc.kill()
    }

    this._proc = null
  }

  private _registerSignalHandlers(): void {
    const cleanup = (signal: NodeJS.Signals) => {
      process.on(signal, async () => {
        this._logger.debug('Received signal, cleaning up', { signal })
        await this.kill()
        process.exit(0)
      })
    }

    cleanup('SIGINT')
    cleanup('SIGTERM')
  }
}
