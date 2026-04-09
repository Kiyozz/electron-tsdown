import { ElectronTsdownError } from './ElectronTsdownError.js'

export class BundleError extends ElectronTsdownError {
  constructor(
    message: string,
    public readonly target: 'main' | 'renderer',
    cause?: unknown,
  ) {
    super(message)
    this.cause = cause
  }
}
