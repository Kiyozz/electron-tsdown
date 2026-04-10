import pino from 'pino'
import * as process from 'node:process'

import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'

export class PinoLogger implements LoggerInterface {
  readonly #pino: pino.Logger

  constructor(pinoInstance?: pino.Logger) {
    this.#pino =
      pinoInstance ??
      pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
        level: process.env['LOG_LEVEL'] ?? 'info',
      })
  }

  info(msg: string, data?: Record<string, unknown>): void {
    this.#pino.info(data ?? {}, msg)
  }

  warn(msg: string, data?: Record<string, unknown>): void {
    this.#pino.warn(data ?? {}, msg)
  }

  error(msg: string, data?: Record<string, unknown>): void {
    this.#pino.error(data ?? {}, msg)
  }

  debug(msg: string, data?: Record<string, unknown>): void {
    this.#pino.debug(data ?? {}, msg)
  }

  child(bindings: Record<string, unknown>): LoggerInterface {
    return new PinoLogger(this.#pino.child(bindings))
  }
}
