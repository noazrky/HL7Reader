import { app, BrowserWindow, ipcMain, Menu, nativeImage, nativeTheme, type BaseWindow, type MenuItemConstructorOptions } from 'electron'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { appIconDataUrl } from '../shared/appIcon'
import { releaseNotes } from '../shared/releaseNotes'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appDisplayName = 'HL7 Reader'

const appIcon = nativeImage.createFromDataURL(appIconDataUrl)
let aboutWindow: BrowserWindow | null = null

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderAboutHtml(): string {
  const currentVersion = app.getVersion()
  const releaseHistory = releaseNotes
    .map((note, index) => {
      const changes = note.changes.map((change) => `<li>${escapeHtml(change)}</li>`).join('')
      const openAttribute = index === 0 ? ' open' : ''

      return `
        <details class="release-note"${openAttribute}>
          <summary>
            <span>Version ${escapeHtml(note.version)}</span>
            <time>${escapeHtml(note.date)}</time>
          </summary>
          <ul>${changes}</ul>
        </details>
      `
    })
    .join('')

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline';"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>About ${escapeHtml(appDisplayName)}</title>
        <style>
          :root {
            color: #f2f5f8;
            background: #0f141b;
            color-scheme: dark;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            font-size: 15px;
            line-height: 1.45;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-width: 360px;
            background: #0f141b;
            color: #f2f5f8;
          }

          main {
            padding: 24px;
          }

          header {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 18px;
            border-bottom: 1px solid #29333e;
          }

          img {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            box-shadow: 0 1px 2px rgb(0 0 0 / 24%);
          }

          h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: 650;
            letter-spacing: 0;
          }

          .current-version {
            margin: 2px 0 0;
            color: #b8c2cc;
          }

          h2 {
            margin: 22px 0 10px;
            color: #f2f5f8;
            font-size: 16px;
            font-weight: 650;
            letter-spacing: 0;
          }

          .release-list {
            display: grid;
            gap: 8px;
          }

          .release-note {
            border: 1px solid #33404d;
            border-radius: 8px;
            background: #151c24;
            overflow: hidden;
          }

          summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            min-height: 42px;
            padding: 10px 14px;
            cursor: pointer;
            list-style: none;
            color: #eef3f7;
            font-weight: 620;
          }

          summary::before {
            content: ">";
            width: 14px;
            color: #9ba8b5;
            transition: transform 120ms ease;
          }

          details[open] summary::before {
            transform: rotate(90deg);
          }

          summary::-webkit-details-marker {
            display: none;
          }

          summary span {
            flex: 1;
          }

          time {
            color: #9edbd2;
            font-family: "Cascadia Mono", "SFMono-Regular", Consolas, monospace;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
          }

          ul {
            display: grid;
            gap: 8px;
            margin: 0;
            padding: 12px 18px 16px 42px;
            border-top: 1px solid #29333e;
            background: #10171f;
            color: #d4dde5;
          }

          button {
            display: block;
            min-width: 84px;
            margin: 18px 0 0 auto;
            padding: 8px 14px;
            border: 1px solid #3b4653;
            border-radius: 8px;
            background: #151c24;
            color: #dce4eb;
            font: inherit;
            cursor: pointer;
          }

          button:hover {
            border-color: #5fd0bd;
            background: #1b2630;
          }

          summary:focus-visible,
          button:focus-visible {
            outline: 3px solid rgb(95 208 189 / 72%);
            outline-offset: 2px;
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <img src="${appIconDataUrl}" alt="" />
            <div>
              <h1>${escapeHtml(appDisplayName)}</h1>
              <p class="current-version">Current version ${escapeHtml(currentVersion)}</p>
            </div>
          </header>

          <h2>Version History</h2>
          <section class="release-list" aria-label="Version history">
            ${releaseHistory}
          </section>

          <button type="button" onclick="window.close()">Close</button>
        </main>
      </body>
    </html>
  `
}

function showAboutWindow(parentWindow?: BaseWindow): void {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.focus()
    return
  }

  const ownerWindow = getBrowserWindow(parentWindow)

  aboutWindow = new BrowserWindow({
    width: 640,
    height: 620,
    minWidth: 420,
    minHeight: 460,
    title: `About ${appDisplayName}`,
    parent: ownerWindow ?? undefined,
    modal: Boolean(ownerWindow),
    show: false,
    backgroundColor: '#0f141b',
    icon: appIcon.isEmpty() ? undefined : appIcon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  aboutWindow.removeMenu()
  aboutWindow.once('ready-to-show', () => aboutWindow?.show())
  aboutWindow.once('closed', () => {
    aboutWindow = null
  })

  void aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderAboutHtml())}`)
}

function getBrowserWindow(window?: BaseWindow): BrowserWindow | null {
  return window instanceof BrowserWindow ? window : BrowserWindow.getFocusedWindow()
}

function toggleMenuBar(window?: BaseWindow): boolean | null {
  const browserWindow = getBrowserWindow(window)

  if (!browserWindow) {
    return null
  }

  const shouldShowMenuBar = !browserWindow.isMenuBarVisible()
  browserWindow.setAutoHideMenuBar(!shouldShowMenuBar)
  browserWindow.setMenuBarVisibility(shouldShowMenuBar)
  return shouldShowMenuBar
}

function createIpcHandlers(): void {
  ipcMain.handle('menu:toggle', (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender)
    return toggleMenuBar(browserWindow ?? undefined)
  })
}

function createMenu(): void {
  const viewSubmenu: MenuItemConstructorOptions[] = [
    {
      label: 'Toggle Menu Bar',
      accelerator: 'Ctrl+Shift+M',
      click: (_menuItem, browserWindow) => toggleMenuBar(browserWindow ?? undefined)
    },
    { type: 'separator' },
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]

  if (!app.isPackaged) {
    viewSubmenu.splice(
      2,
      0,
      { role: 'reload' },
      { role: 'toggleDevTools' },
      { type: 'separator' }
    )
  }

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: viewSubmenu
    },
    {
      label: 'Help',
      submenu: [
        {
          label: `About ${appDisplayName}`,
          accelerator: 'F1',
          click: (_menuItem, browserWindow) => showAboutWindow(browserWindow ?? undefined)
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 820,
    minWidth: 760,
    minHeight: 560,
    title: appDisplayName,
    icon: appIcon.isEmpty() ? undefined : appIcon,
    autoHideMenuBar: true,
    backgroundColor: '#0f141b',
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })
  mainWindow.setMenuBarVisibility(false)

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

void app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark'
  createMenu()
  createIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
