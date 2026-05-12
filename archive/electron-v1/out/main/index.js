import { nativeImage, app, nativeTheme, BrowserWindow, Menu, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const appIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="HL7 Reader">
  <rect width="64" height="64" rx="16" fill="#151c24"/>
  <path d="M32 9l5.5 13.4L52 23.8 41 33l3.4 14.1L32 39.6 19.6 47.1 23 33 12 23.8l14.5-1.4L32 9z" fill="#5fd0bd"/>
  <path d="M32 18l3.5 8.5 9.2.9-7 5.9 2.2 9-7.9-4.8-7.9 4.8 2.2-9-7-5.9 9.2-.9L32 18z" fill="#ffffff" opacity="0.92"/>
</svg>
`.trim();
const appIconDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(appIconSvg)}`;
const releaseNotes = [
  {
    version: "1.0.0",
    date: "2026-05-11",
    changes: [
      "Upgraded Electron and Electron Builder to resolve release-blocking dependency vulnerabilities.",
      "Added HL7 escape decoding for display while preserving raw parsed message values.",
      "Hardened packaged app defaults and reduced Windows package locales to en-US."
    ]
  },
  {
    version: "0.2.2",
    date: "2026-05-11",
    changes: [
      "Documented the Major.Minor.Change versioning policy and EXE archive expectations.",
      "Added a changelog covering all project versions through the current release.",
      "Changed the About window release history from a running list to per-version dropdowns."
    ]
  },
  {
    version: "0.2.1",
    date: "2026-05-11",
    changes: [
      "Hid the native Electron menu bar by default.",
      "Added Ctrl+Shift+M, F1, and a hamburger button for native menu and About access.",
      "Updated the app icon to a star-only mark and reused it in the header, About dialog, and Windows package."
    ]
  },
  {
    version: "0.2.0",
    date: "2026-05-11",
    changes: [
      "Added a populated Help menu with app version details and release history.",
      "Added a small HL7 Reader icon mark in the app header, Help dialog, and packaged Windows app.",
      "Limited packaged Electron locale files to en-US, en-GB, and es."
    ]
  },
  {
    version: "0.1.1",
    date: "2026-05-11",
    changes: [
      "Expanded HL7 parser labeling for additional ADT, order, observation, procedure, role, and insurance segments.",
      "Added parser coverage for repeated fields, nested components, custom delimiters, malformed input, and blank input."
    ]
  },
  {
    version: "0.1.0",
    date: "2026-05-11",
    changes: ["Initial HL7 v2 message parser and desktop reader."]
  }
];
const __dirname$1 = dirname(fileURLToPath(import.meta.url));
const appDisplayName = "HL7 Reader";
const appIcon = nativeImage.createFromDataURL(appIconDataUrl);
let aboutWindow = null;
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function renderAboutHtml() {
  const currentVersion = app.getVersion();
  const releaseHistory = releaseNotes.map((note, index) => {
    const changes = note.changes.map((change) => `<li>${escapeHtml(change)}</li>`).join("");
    const openAttribute = index === 0 ? " open" : "";
    return `
        <details class="release-note"${openAttribute}>
          <summary>
            <span>Version ${escapeHtml(note.version)}</span>
            <time>${escapeHtml(note.date)}</time>
          </summary>
          <ul>${changes}</ul>
        </details>
      `;
  }).join("");
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
  `;
}
function showAboutWindow(parentWindow) {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.focus();
    return;
  }
  const ownerWindow = getBrowserWindow(parentWindow);
  aboutWindow = new BrowserWindow({
    width: 640,
    height: 620,
    minWidth: 420,
    minHeight: 460,
    title: `About ${appDisplayName}`,
    parent: ownerWindow ?? void 0,
    modal: Boolean(ownerWindow),
    show: false,
    backgroundColor: "#0f141b",
    icon: appIcon.isEmpty() ? void 0 : appIcon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  aboutWindow.removeMenu();
  aboutWindow.once("ready-to-show", () => aboutWindow?.show());
  aboutWindow.once("closed", () => {
    aboutWindow = null;
  });
  void aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderAboutHtml())}`);
}
function getBrowserWindow(window) {
  return window instanceof BrowserWindow ? window : BrowserWindow.getFocusedWindow();
}
function toggleMenuBar(window) {
  const browserWindow = getBrowserWindow(window);
  if (!browserWindow) {
    return null;
  }
  const shouldShowMenuBar = !browserWindow.isMenuBarVisible();
  browserWindow.setAutoHideMenuBar(!shouldShowMenuBar);
  browserWindow.setMenuBarVisibility(shouldShowMenuBar);
  return shouldShowMenuBar;
}
function createIpcHandlers() {
  ipcMain.handle("menu:toggle", (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    return toggleMenuBar(browserWindow ?? void 0);
  });
}
function createMenu() {
  const viewSubmenu = [
    {
      label: "Toggle Menu Bar",
      accelerator: "Ctrl+Shift+M",
      click: (_menuItem, browserWindow) => toggleMenuBar(browserWindow ?? void 0)
    },
    { type: "separator" },
    { role: "resetZoom" },
    { role: "zoomIn" },
    { role: "zoomOut" },
    { type: "separator" },
    { role: "togglefullscreen" }
  ];
  if (!app.isPackaged) {
    viewSubmenu.splice(
      2,
      0,
      { role: "reload" },
      { role: "toggleDevTools" },
      { type: "separator" }
    );
  }
  const template = [
    {
      label: "File",
      submenu: [{ role: "quit" }]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: viewSubmenu
    },
    {
      label: "Help",
      submenu: [
        {
          label: `About ${appDisplayName}`,
          accelerator: "F1",
          click: (_menuItem, browserWindow) => showAboutWindow(browserWindow ?? void 0)
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 820,
    minWidth: 760,
    minHeight: 560,
    title: appDisplayName,
    icon: appIcon.isEmpty() ? void 0 : appIcon,
    autoHideMenuBar: true,
    backgroundColor: "#0f141b",
    webPreferences: {
      preload: join(__dirname$1, "../preload/index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.setMenuBarVisibility(false);
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(__dirname$1, "../renderer/index.html"));
  }
}
void app.whenReady().then(() => {
  nativeTheme.themeSource = "dark";
  createMenu();
  createIpcHandlers();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
