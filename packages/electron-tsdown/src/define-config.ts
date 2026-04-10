import type { AppConfigInput } from './domain/value-objects/AppConfig.js'

export function defineConfig<T extends AppConfigInput>(config: T): T {
  return config
}
