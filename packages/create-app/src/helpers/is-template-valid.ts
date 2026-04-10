/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { cyan, stripColors } from 'kolorist'

import { Template } from '../enums/template.js'

export const TEMPLATES: string[] = [
  cyan(Template.ReactViteJavaScript),
  cyan(Template.ReactViteTypeScript),
]

export const isTemplateValid = (template?: string): template is Template => {
  if (template === undefined) {
    return false
  }

  return TEMPLATES.map(stripColors).includes(template)
}
