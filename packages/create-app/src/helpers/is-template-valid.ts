/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { cyan, red, stripColors, yellow } from 'kolorist'

import { Template } from '../enums/template.js'

export const TEMPLATES: string[] = [
  yellow(Template.MainOnlyJavaScript),
  yellow(Template.MainOnlyTypeScript),
  cyan(Template.ReactViteJavaScript),
  cyan(Template.ReactViteTypeScript),
  red(Template.SvelteJavaScript),
  red(Template.SvelteTypeScript),
]

export const isTemplateValid = (template?: string): template is Template => {
  if (template === undefined) {
    return false
  }

  return TEMPLATES.map(stripColors).includes(template)
}
