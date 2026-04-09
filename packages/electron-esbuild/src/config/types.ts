/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { UserConfig as TsdownUserConfig } from 'tsdown'
import { InlineConfig as ViteInlineConfig } from 'vite'

import { TypeConfig } from './enums.js'

export type ExtractArray<T> = T extends Array<infer U> ? U : T

export type MainPossibleConfiguration = TsdownUserConfig[]

export type RendererPossibleConfiguration = ViteInlineConfig

export type PossibleConfiguration =
  | MainPossibleConfiguration
  | RendererPossibleConfiguration

export interface ConfigMapping {
  [TypeConfig.tsdown]: MainPossibleConfiguration
  [TypeConfig.vite]: RendererPossibleConfiguration
}
