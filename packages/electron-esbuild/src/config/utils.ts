/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { UserConfig } from 'tsdown'

import { TypeConfig } from './enums.js'
import { ExtractArray, PossibleConfiguration } from './types.js'

export function configByEnv({
  dev,
  type,
}: {
  dev: boolean
  type: TypeConfig | null
}): Partial<ExtractArray<PossibleConfiguration>> {
  if (type === null) {
    return {}
  }

  if (dev) {
    switch (type) {
      case TypeConfig.tsdown:
        return {
          sourcemap: 'inline',
          define: {
            'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
          },
        } satisfies Partial<UserConfig>
      case TypeConfig.vite:
        return {}
    }
  }

  switch (type) {
    case TypeConfig.tsdown:
      return {
        sourcemap: true,
        define: {
          'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
        },
      } satisfies Partial<UserConfig>
    case TypeConfig.vite:
      return {}
  }
}
