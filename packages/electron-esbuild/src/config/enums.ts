/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

export type TypeConfig = 'tsdown' | 'vite'

export const TypeConfig = {
  tsdown: 'tsdown',
  vite: 'vite',
} satisfies Record<TypeConfig, TypeConfig>

export enum Target {
  main,
  renderer,
}
