/*
 * Copyright (c) 2024 Kiyozz.
 *
 * All rights reserved.
 */

import { green, blue } from 'kolorist'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { isPathExists } from './is-path-exists.js'

export const ensureFolderEmpty = async (
  fileOrFolder: string,
): Promise<boolean> | never => {
  const validFiles = ['.DS_Store', '.git', 'Thumbs.db']

  if (await isPathExists(fileOrFolder)) {
    const stat = await fs.lstat(fileOrFolder)

    if (!stat.isDirectory()) {
      console.log(`The path ${green(fileOrFolder)} refers to a file.`)
      console.log('Try using a new directory name.')
      process.exit(1)
    }

    const filesInFolder = await fs.readdir(fileOrFolder)
    const notValidFilesInFolder = filesInFolder.filter(
      (fileOrFolder) => !validFiles.includes(fileOrFolder),
    )

    if (notValidFilesInFolder.length > 0) {
      console.log(
        `The directory ${green(
          fileOrFolder,
        )} contains files that could conflict:`,
      )

      for (const file of notValidFilesInFolder) {
        try {
          const stats = await fs.lstat(path.join(fileOrFolder, file))

          if (stats.isDirectory()) {
            console.log(`  ${blue(file)}/`)
          } else {
            console.log(`  ${file}`)
          }
        } catch {
          console.log(`  ${file}`)
        }
      }

      console.log()
      console.log(
        'Either try using a new directory name, or remove the files listed above.',
      )
      process.exit(1)
    }
  }

  return true
}
