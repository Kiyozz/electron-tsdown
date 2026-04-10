import * as os from 'node:os'
import * as path from 'node:path'
import * as process from 'node:process'
import { x } from 'tinyexec'

import type { ElectronLauncherInterface } from '../domain/contracts/ElectronLauncherInterface.js'
import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'

const _isWindows = os.platform() === 'win32'
const _electronBin = _isWindows ? 'electron.cmd' : 'electron'

export class ElectronLauncher implements ElectronLauncherInterface {
  readonly #logger: LoggerInterface

  #proc: ReturnType<typeof x> | null = null

  constructor(logger: LoggerInterface) {
    this.#logger = logger.child({ component: 'ElectronLauncher' })
    this._registerSignalHandlers()
  }

  async launch(entryFile: string, args: string[]): Promise<void> {
    const bin = path.resolve(`node_modules/.bin/${_electronBin}`)
    this.#logger.info('Starting electron', { entryFile })

    this.#proc = x(bin, [entryFile, ...args], {
      nodeOptions: { stdio: 'inherit' },
      throwOnError: false,
    })

    this.#proc.process?.on('close', (code, signal) => {
      if (code === null) {
        this.#logger.error('Electron exited with signal', { signal })
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
    if (!this.#proc?.process) return

    this.#logger.debug('Killing electron process')

    this.#proc.process.removeAllListeners('close')

    if (_isWindows) {
      const pid = this.#proc.process.pid

      if (pid) {
        x('taskkill', ['/pid', String(pid), '/f', '/t'], {
          nodeOptions: { shell: true },
          throwOnError: false,
        })
      }
    } else {
      this.#proc.kill()
    }

    this.#proc = null
  }

  private _registerSignalHandlers(): void {
    const cleanup = (signal: NodeJS.Signals) => {
      process.on(signal, async () => {
        this.#logger.debug('Received signal, cleaning up', { signal })
        await this.kill()
        process.exit(0)
      })
    }

    cleanup('SIGINT')
    cleanup('SIGTERM')
  }
}
