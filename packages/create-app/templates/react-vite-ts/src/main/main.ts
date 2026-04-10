import * as path from 'node:path'
import * as url from 'node:url'
import { app, BrowserWindow } from 'electron'
import { isDev } from 'electron-util/main'
import { is } from 'electron-util'

let win: BrowserWindow | null = null

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 820,
    minHeight: 600,
    minWidth: 650,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(dirname, 'preload.js'),
    },
    show: false,
  })

  if (isDev) {
    // this is the default port vite is using in the boilerplate
    win.loadURL('http://localhost:9080')
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('devtools-opened', () => {
    win!.focus()
  })

  win.on('ready-to-show', () => {
    win!.show()
    win!.focus()
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null && app.isReady()) {
    createWindow()
  }
})
