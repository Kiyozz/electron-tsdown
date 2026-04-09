/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { z } from 'zod'

import { TypeConfig } from './enums.js'
import { ValidationError } from '../errors/ValidationError.js'

export const ConfigurationSchema = z.object({
  main: z.object({
    type: z.enum([TypeConfig.tsdown]),
    path: z.string(),
    src: z.string(),
    output: z.object({
      dir: z.string(),
      filename: z.string(),
    }),
  }),
  renderer: z
    .object({
      type: z.enum([TypeConfig.vite]),
      path: z.string(),
      src: z.string(),
      output: z.object({
        dir: z.string(),
        filename: z.undefined().optional(),
      }),
    })
    .optional()
    .nullable(),
})

export type Configuration = z.infer<typeof ConfigurationSchema>

export class Validator {
  validate(object: unknown) {
    const violations = ConfigurationSchema.safeParse(object)

    if (!violations.success) {
      throw new ValidationError(
        'electron-tsdown config is invalid. ' +
          z.treeifyError(violations.error),
      )
    }

    return violations.data
  }
}
