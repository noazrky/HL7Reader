# Build History and Troubleshooting Guide

This document explains how HL7 Reader was built, how each released version was produced, and what to check when a build or packaged app fails.

For release notes only, see `CHANGELOG.md`. For the version numbering policy, see `VERSIONING.md`.

## Current Project Shape

HL7 Reader has two implementation generations:

- `2.x`: the current Tauri desktop app at the repository root.
- `0.x` and `1.x`: the archived Electron app in `archive/electron-v1`.

The current app uses a Vite and TypeScript frontend with a small Tauri Rust shell. The frontend parses and displays HL7 v2 messages. Tauri provides the desktop window, native menu, About window, zoom controls, and the direct Windows executable.

The archived Electron app is kept so older releases can still be inspected, rebuilt, or compared when troubleshooting regressions.

## Current Tauri Build Pipeline

Run these commands from the repository root:

```powershell
npm test
npm run build
npm run tauri:build
```

What those commands do:

- `npm test` runs the Vitest parser regression suite in `tests/`.
- `npm run build` runs `tsc --noEmit` and then Vite. Vite builds both `index.html` and `about.html` into `dist/`.
- `npm run tauri:build` runs `npm run tauri:compile`, then `scripts/copy-release.ps1`.
- `npm run tauri:compile` runs `tauri build --no-bundle`, producing `src-tauri/target/release/hl7-reader-tauri.exe`.
- `scripts/copy-release.ps1` reads the app version from `package.json`, then copies the compiled EXE to `release/HL7 Reader <version>.exe`.

The Tauri EXE is a direct-launch Windows executable, not an installer. It expects the Microsoft Edge WebView2 Runtime to already exist on the target machine.

## Archived Electron Build Pipeline

Run these commands from `archive/electron-v1`:

```powershell
npm test
npm run build
npm run dist
```

What those commands do:

- `npm test` runs the archived Vitest parser tests in `archive/electron-v1/tests/`.
- `npm run build` runs TypeScript checks and `electron-vite build`.
- `npm run dist` runs the build and then `electron-builder --win portable`.
- Electron Builder produces a Windows portable EXE using the `build` settings in `archive/electron-v1/package.json`.

When rebuilding from the archive folder, Electron Builder writes to `archive/electron-v1/release/`. The versioned EXEs that were kept for normal comparison and troubleshooting live in the root `release/` folder. The Electron EXEs are much larger than the Tauri EXEs because they include the Electron runtime.

## Version Surfaces To Update

For a normal Tauri release, keep these files in sync:

- `package.json`
- `package-lock.json`, root package version entries near the top
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`, the `hl7-reader-tauri` package entry
- `src/about.ts`
- `src/shared/releaseNotes.ts`
- `CHANGELOG.md`
- `VERSIONING.md`

For archived Electron work, use the same idea inside `archive/electron-v1`, especially `archive/electron-v1/package.json` and `archive/electron-v1/src/shared/releaseNotes.ts`.

## Version Build History

### 0.1.0

Generation: Electron.

What changed:

- Created the initial HL7 v2 desktop reader.
- Added message parsing for segments, fields, components, subcomponents, metadata, and warnings.
- Added the first paste-and-inspect interface.

Build steps used:

```powershell
cd archive\electron-v1
npm test
npm run build
npm run dist
```

Archived artifact:

```text
release/HL7 Reader 0.1.0.exe
```

Troubleshooting notes:

- If parsing output differs from later versions, compare against `archive/electron-v1/src/shared/hl7Parser.ts` and the release notes for `0.1.1`.
- This version predates the broader parser regression coverage added later.

### 0.1.1

Generation: Electron.

What changed:

- Expanded parser labels for additional ADT, order, observation, procedure, role, and insurance segments.
- Added tests for repeated fields, nested components, custom delimiters, malformed input, and blank input.

Build steps used:

```powershell
cd archive\electron-v1
npm test
npm run build
npm run dist
```

Archived artifact:

```text
release/HL7 Reader 0.1.1.exe
```

Troubleshooting notes:

- If a repeated field or nested component renders incorrectly, start by running the archived parser tests.
- Check delimiter handling before changing UI rendering code.

### 0.2.0

Generation: Electron.

What changed:

- Added the Help menu, app version details, and release history.
- Added the HL7 Reader icon mark to the app header, Help dialog, and packaged Windows app.
- Limited packaged Electron locale files to en-US, en-GB, and es.

Build steps used:

```powershell
cd archive\electron-v1
npm test
npm run build
npm run dist
```

Archived artifact:

```text
release/HL7 Reader 0.2.0.exe
```

Troubleshooting notes:

- If the icon is missing from the packaged app, check `archive/electron-v1/build/icon.ico` and the `build.win.icon` setting in `archive/electron-v1/package.json`.
- If the Help menu is missing, inspect the Electron main-process menu setup.

### 0.2.1

Generation: Electron.

What changed:

- Hid the native Electron menu bar by default.
- Added Ctrl+Shift+M, F1, and a hamburger button for menu/About access.
- Updated the app icon to a star-only mark and reused it in the header, About dialog, and Windows package.

Build steps used:

```powershell
cd archive\electron-v1
npm test
npm run build
npm run dist
```

Archived artifact:

```text
release/HL7 Reader 0.2.1.exe
```

Troubleshooting notes:

- If the menu cannot be restored, test Ctrl+Shift+M and the hamburger button separately.
- If F1 does not open About, inspect both the renderer key handler and native menu command.

### 0.2.2

Generation: Electron.

What changed:

- Documented the `Major.Minor.Change` versioning policy and EXE archive expectations.
- Added `CHANGELOG.md`.
- Reworked About release history so each version appears in a separate dropdown.

Build steps used:

```powershell
cd archive\electron-v1
npm test
npm run build
npm run dist
```

Archived artifact:

```text
release/HL7 Reader 0.2.2.exe
```

Troubleshooting notes:

- If release notes are wrong in the app, compare `CHANGELOG.md` with `archive/electron-v1/src/shared/releaseNotes.ts`.
- About-window issues usually come from release-note data shape mismatches or renderer markup changes.

### 1.0.0

Generation: Electron.

What changed:

- Upgraded Electron and Electron Builder to resolve release-blocking dependency vulnerabilities.
- Added HL7 escape decoding for standard delimiter tokens, line breaks, custom delimiters, and preserved unknown/hex escapes.
- Hardened Electron window defaults, removed packaged reload/devtools menu entries, and enabled stricter unused-code checks.
- Reduced packaged Windows locales to en-US and enabled maximum package compression.

Build steps used:

```powershell
cd archive\electron-v1
npm test
npm run build
npm run dist
```

Archived artifact:

```text
release/HL7 Reader 1.0.0.exe
```

Troubleshooting notes:

- If HL7 escape text displays incorrectly, test `decodeHl7Escapes` before changing the UI.
- If the EXE grows unexpectedly, check Electron Builder locale, compression, and packaged file settings in `archive/electron-v1/package.json`.
- If packaged devtools or reload shortcuts appear, inspect the Electron window and menu hardening.

### 2.0.0

Generation: Tauri.

What changed:

- Moved the primary desktop implementation from Electron to Tauri at the repository root.
- Published a no-installer Windows EXE that relies on Microsoft Edge WebView2 Runtime instead of bundling Electron.
- Preserved the parser, HL7 dictionaries, About release history, menu toggle, and paste-and-inspect workflow.
- Reduced the release artifact from an Electron-sized portable EXE to a small direct-launch Tauri EXE.

Build steps used:

```powershell
npm test
npm run build
npm run tauri:build
```

Expected artifact:

```text
release/HL7 Reader 2.0.0.exe
```

Troubleshooting notes:

- If the app launches to a blank window, verify `npm run build` created `dist/` and that `src-tauri/tauri.conf.json` points `frontendDist` to `../dist`.
- If the EXE works on the build machine but not another Windows machine, check whether WebView2 Runtime is installed there.
- If menu commands fail, inspect the Tauri commands and menu handlers in `src-tauri/src/lib.rs`.

### 2.0.1

Generation: Tauri.

What changed:

- Expanded the HL7 v2.4 library specs with full Chapter 4 order entry, diet, supply, pharmacy/treatment, and Chapter 10 scheduling segment field definitions.
- Added parser regression coverage for those segment families and terminal fields.

Build steps used:

```powershell
npm test
npm run build
npm run tauri:build
```

Expected artifact:

```text
release/HL7 Reader 2.0.1.exe
```

Troubleshooting notes:

- If order or scheduling fields are mislabeled, start in `src/shared/hl7Dictionaries.ts`.
- Add or adjust focused parser tests in `tests/hl7Parser.test.ts` before changing dictionary behavior.

### 2.0.2

Generation: Tauri.

What changed:

- Added broader datatype component labels for common composite values such as message type, processing ID, version, organization, quantity, driver license, financial class, job code, and generic CM fields.
- Added parser regression coverage for the newly labeled datatype components.

Build steps used:

```powershell
npm test
npm run build
npm run tauri:build
```

Expected artifact:

```text
release/HL7 Reader 2.0.2.exe
```

Troubleshooting notes:

- If component labels look generic, check datatype mappings before segment-specific field names.
- Use tests that cover both the raw path, such as `MSH-9.1`, and the human-readable component label.

### 2.0.3

Generation: Tauri.

What changed:

- Hid the native File/Edit/View/Help menu bar from the Help window.
- Left the main window startup menu hiding and hamburger/Ctrl+Shift+M menu toggle behavior unchanged.

Build steps used:

```powershell
npm test
npm run build
npm run tauri:build
```

Expected artifact:

```text
release/HL7 Reader 2.0.3.exe
```

Troubleshooting notes:

- If the Help window shows the native menu again, inspect `open_about_window` in `src-tauri/src/lib.rs`.
- If the main menu toggle stops working, check the separate `toggle_menu` command and main window menu handlers before changing the Help window code.

## Common Troubleshooting Checklist

### `npm test` fails

- Read the first failing assertion and identify whether it is parser structure, dictionary labeling, delimiter handling, or release-note data.
- For parser changes, add a small HL7 sample that proves the expected segment, field, component, or subcomponent path.
- For release-note changes, compare `CHANGELOG.md` with `src/shared/releaseNotes.ts`.

### `npm run build` fails

- TypeScript failures usually mean a shared parser or release-note type changed without updating all consumers.
- Vite failures often point to path aliases. The root app maps `@shared` to `src/shared` in `vite.config.ts`.
- The About page is a separate Vite entry. If only About fails, check `about.html`, `src/about.ts`, and `src/styles/about.css`.

### `npm run tauri:build` fails during Rust or MSVC compilation

First try the normal command:

```powershell
npm run tauri:build
```

On this machine, native Tauri builds may fail when the default shell sees Visual Studio 2022 but cannot find the required SDK/MSVC include such as `excpt.h`. If that happens, run the known working Visual Studio 2019 Build Tools wrapper:

```powershell
& "C:\Users\admin\.codex\skills\hl7-reader-release\scripts\build-tauri-release.ps1"
```

Then confirm the versioned artifact exists:

```powershell
Get-Item -LiteralPath "release\HL7 Reader <version>.exe"
```

### Release EXE is missing or has the wrong version

- Confirm `package.json` has the intended version.
- Confirm `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json` match it.
- Run `npm run tauri:compile` before `npm run release:copy`, or just run `npm run tauri:build`.
- Check `scripts/copy-release.ps1`; it names the output from `package.json` and `tauri.conf.json`.

### App version in About is wrong

- Update `src/about.ts`.
- Update the top entry in `src/shared/releaseNotes.ts`.
- Update `CHANGELOG.md`.
- Rebuild with `npm run build` so the About page is regenerated.

### App works in development but packaged EXE is blank

- Run `npm run build` and confirm `dist/` exists.
- Check `src-tauri/tauri.conf.json` `frontendDist`.
- Confirm both Vite entry points are present in `vite.config.ts`: `index.html` and `about.html`.
- Avoid relying on dev-only URLs or files outside the built frontend.

### Tauri app fails on another Windows machine

- Confirm Microsoft Edge WebView2 Runtime is installed on the target machine.
- Use the versioned EXE from `release/`.
- If the failure is specific to one old EXE, compare against the nearest earlier and later EXEs in `release/`.

## Release Sanity Check

Before calling a release complete:

```powershell
npm test
npm run build
npm run tauri:build
Get-Item -LiteralPath "release\HL7 Reader <version>.exe"
```

Also check:

- The version appears correctly in About.
- The newest release note appears first.
- A sample HL7 message parses into segments, fields, components, and values.
- Ctrl+Shift+M toggles the menu bar.
- F1 opens About.
