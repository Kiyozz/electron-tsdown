import pino from 'pino'

import type { LoggerInterface } from '../domain/contracts/LoggerInterface.js'

export class PinoLogger implements LoggerInterface {
  private readonly _pino: pino.Logger

  constructor(pinoInstance?: pino.Logger) {
    this._pino =
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
    this._pino.info(data ?? {}, msg)
  }

  warn(msg: string, data?: Record<string, unknown>): void {
    this._pino.warn(data ?? {}, msg)
  }

  error(msg: string, data?: Record<string, unknown>): void {
    this._pino.error(data ?? {}, msg)
  }

  debug(msg: string, data?: Record<string, unknown>): void {
    this._pino.debug(data ?? {}, msg)
  }

  child(bindings: Record<string, unknown>): LoggerInterface {
    return new PinoLogger(this._pino.child(bindings))
  }
}
