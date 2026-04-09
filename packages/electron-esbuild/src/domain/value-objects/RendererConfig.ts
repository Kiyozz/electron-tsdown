import { z } from 'zod'

import { ConfigError } from '../../errors/ConfigError.js'

export const RendererConfigSchema = z.object({
  /**
   * Path to the vite config file (relative to cwd).
   * @example 'src/renderer/vite.config.ts'
   */
  configFile: z.string(),
  root: z.string(),
  output: z.object({
    dir: z.string(),
  }),
})

export type RendererConfigInput = z.input<typeof RendererConfigSchema>

export class RendererConfig {
  readonly configFile: string
  readonly root: string
  readonly output: { dir: string }

  constructor(raw: unknown) {
    const result = RendererConfigSchema.safeParse(raw)
    if (!result.success) {
      throw new ConfigError('Invalid renderer config', result.error)
    }
    this.configFile = result.data.configFile
    this.root = result.data.root
    this.output = result.data.output
    Object.freeze(this)
  }
}
