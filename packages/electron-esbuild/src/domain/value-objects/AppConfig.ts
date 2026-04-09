import { z } from 'zod'

import { MainConfig, MainConfigSchema } from './MainConfig.js'
import { RendererConfig, RendererConfigSchema } from './RendererConfig.js'
import { ConfigError } from '../../errors/ConfigError.js'

export const AppConfigSchema = z.object({
  main: MainConfigSchema,
  renderer: RendererConfigSchema,
})

export type AppConfigInput = z.input<typeof AppConfigSchema>

export class AppConfig {
  readonly main: MainConfig
  readonly renderer: RendererConfig

  constructor(raw: unknown) {
    const result = AppConfigSchema.safeParse(raw)
    if (!result.success) {
      throw new ConfigError('Invalid electron-esbuild config', result.error)
    }
    this.main = new MainConfig(result.data.main)
    this.renderer = new RendererConfig(result.data.renderer)
    Object.freeze(this)
  }
}
