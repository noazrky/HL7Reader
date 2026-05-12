# Codebase Layout

HL7 Reader keeps the current Tauri implementation at the workspace root and the previous Electron implementation under `archive/electron-v1` for reference.

For build history, release steps, and troubleshooting notes, see `BUILD_HISTORY.md`.

## Version 2 Tauri App

The primary `2.0.0` implementation lives at the workspace root.

- Uses Tauri v2 with a Vite/TypeScript frontend.
- Produces a direct-launch Windows EXE without an installer.
- Depends on the Microsoft Edge WebView2 Runtime being present on the target machine.
- Reuses the HL7 parser, dictionary, icon, release-note, and renderer behavior from the Electron app.

Build and test from the workspace root:

```powershell
npm test
npm run build
npm run tauri:build
```

`npm run tauri:build` compiles the direct Tauri EXE without an installer bundle and copies the versioned EXE into the root `release` folder for easy access. If you only need the raw Tauri compile without publishing to `release`, run `npm run tauri:compile`.

On this machine, run the Tauri release build from the Visual Studio 2019 Build Tools developer environment so Rust can find the MSVC runtime libraries.

## Archived Version 1 Electron App

The Electron app is archived at `archive/electron-v1` for historical reference and archived `1.x` releases.

- Archived `src`, `tests`, `electron.vite.config.ts`, `package.json`, build assets, and output belong to the Electron implementation.
- Versioned EXE artifacts are kept in the root `release` folder.
