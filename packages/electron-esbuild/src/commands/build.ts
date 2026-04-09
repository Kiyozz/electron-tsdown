/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { Cli, CliResult } from '../cli.js'
import { CONFIG_FILE_NAME } from '../config/constants.js'
import { Logger } from '../console.js'
import { Worker } from '../worker.js'

const _logger = new Logger('Commands/Build')

async function clean(): Promise<void> {
  _logger.log('Cleaning')
}

export class Build extends Cli {
  constructor(cli: CliResult) {
    super(cli)
  }

  static async create(cli: CliResult): Promise<Build> {
    return new Build(cli)
  }

  async init(): Promise<void> {
    process.env.NODE_ENV = 'production'
    _logger.debug('Start')

    if (this.cli.flags.clean) {
      await clean()
    }

    _logger.debug('Creating worker')

    const worker = await Worker.fromFileAsync({
      file: CONFIG_FILE_NAME,
      env: 'production',
    })

    _logger.debug('Created worker')

    const config = await worker.toConfigAsync()

    _logger.debug('Parsed config')

    const [main, renderer] = await config.toBuildersAsync()

    _logger.debug('Created builders')
    _logger.log('Creating production build...')

    await Promise.all([
      main.build(),
      renderer?.build() ?? (await Promise.resolve()),
    ])
  }
}
