import { z } from 'zod'

import { ConfigError } from '../../errors/ConfigError.js'

export const RendererConfigSchema = z.object({
  /**
   * Path to the vite config file (relative to cwd).
   * @example 'src/renderer/vite.config.ts'
   */
  vite: z.object({
    path: z.string(),
    root: z.string(),
    outDir: z.string(),
  }),
})

export type RendererConfigInput = z.input<typeof RendererConfigSchema>

export class RendererConfig {
  readonly path: string
  readonly root: string
  readonly outDir: string

  constructor(raw: unknown) {
    const result = RendererConfigSchema.safeParse(raw)

    if (!result.success) {
      throw new ConfigError('Invalid renderer config', result.error)
    }

    this.path = result.data.vite.path
    this.root = result.data.vite.root
    this.outDir = result.data.vite.outDir

    Object.freeze(this)
  }
}
