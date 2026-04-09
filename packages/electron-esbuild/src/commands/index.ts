/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { Build } from './build.js'
import { Dev } from './dev.js'

export const commands: { readonly build: typeof Build; readonly dev: typeof Dev } = {
  build: Build,
  dev: Dev,
}
