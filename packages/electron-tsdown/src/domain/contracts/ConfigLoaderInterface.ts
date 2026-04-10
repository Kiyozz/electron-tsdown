import type { AppConfig } from '../value-objects/AppConfig.js'

export interface ConfigLoaderInterface {
  load(): Promise<AppConfig>
}
