import type { UserConfig as TsdownUserConfig } from 'tsdown'
import { z } from 'zod'

import { ConfigError } from '../../errors/ConfigError.js'

export const MainConfigSchema = z.object({
  configs: z.array(z.custom<TsdownUserConfig>()),
  output: z.object({
    dir: z.string(),
    filename: z.string(),
  }),
})

export type MainConfigInput = z.input<typeof MainConfigSchema>

export class MainConfig {
  readonly configs: TsdownUserConfig[]
  readonly output: { dir: string; filename: string }

  constructor(raw: unknown) {
    const result = MainConfigSchema.safeParse(raw)
    if (!result.success) {
      throw new ConfigError('Invalid main config', result.error)
    }
    this.configs = result.data.configs as TsdownUserConfig[]
    this.output = result.data.output
    Object.freeze(this)
  }
}
