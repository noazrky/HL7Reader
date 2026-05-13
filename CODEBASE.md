# Codebase Layout

HL7 Reader keeps the current Tauri implementation at the workspace root. The previous Electron implementation has been removed from the working tree now that the Tauri app is stable.

For build history, release steps, and troubleshooting notes, see `BUILD_HISTORY.md`.

For version policy and the canonical app version source, see `VERSIONING.md`. The active Tauri app version is sourced from the root `VERSION` file; package, Cargo, Tauri, and About-screen version values are generated or checked from that file.

## Version 2 Tauri App

The primary `2.0.0` implementation lives at the workspace root.

- Uses Tauri v2 with a Vite/TypeScript frontend.
- Produces a direct-launch Windows EXE without an installer.
- Depends on the Microsoft Edge WebView2 Runtime being present on the target machine.
- Preserves the HL7 parser, dictionary, icon, release-note, and renderer behavior from the earlier Electron app.

Build and test from the workspace root:

```powershell
npm test
npm run build
npm run tauri:build
```

`npm run tauri:build` compiles the direct Tauri EXE without an installer bundle and copies the versioned EXE into the root `release` folder for easy access. `src-tauri/tauri.conf.json` keeps Tauri bundling inactive so the checked-in default cannot produce an NSIS or WebView2 bootstrapper installer. If you only need the raw Tauri compile without publishing to `release`, run `npm run tauri:compile`.
When application behavior, build requirements, supported HL7 coverage, or release packaging changes, update `README.md` as part of the same build/release work so the public project documentation stays accurate.

Before versioned builds, edit only `VERSION`, then run `npm run version:sync` and `npm run version:check`. The normal test, build, and Tauri compile scripts already run the version check so stale generated metadata fails early.

On this machine, run the Tauri release build from the Visual Studio 2019 Build Tools developer environment so Rust can find the MSVC runtime libraries.

## Legacy Electron Releases

Versioned Electron EXE artifacts remain in the root `release` folder for historical comparison. The Electron source archive is no longer part of this repository; use the release history and old EXE artifacts for legacy context.
