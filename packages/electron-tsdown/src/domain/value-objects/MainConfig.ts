import { z } from 'zod'

import { ConfigError } from '../../errors/ConfigError.js'

export const MainConfigSchema = z.object({
  tsdown: z.object({
    path: z.string(),
    outDir: z.string(),
    outFile: z.string(),
  }),
})

export type MainConfigInput = z.input<typeof MainConfigSchema>

export class MainConfig {
  readonly path: string
  readonly outDir: string
  readonly outFile: string

  constructor(raw: unknown) {
    const result = MainConfigSchema.safeParse(raw)

    if (!result.success) {
      throw new ConfigError('Invalid main config', result.error)
    }

    this.path = result.data.tsdown.path
    this.outDir = result.data.tsdown.outDir
    this.outFile = result.data.tsdown.outFile

    Object.freeze(this)
  }
}
