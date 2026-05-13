# HL7 Reader

HL7 Reader is a small Windows desktop application for inspecting HL7 v2 messages. It is intended for developers, analysts, interface engineers, and support staff who need to paste a raw message and quickly see how it breaks down into segments, fields, repetitions, components, subcomponents, and decoded display values.

The app does not send messages to a server. Parsing happens locally in the desktop window.

## What It Does

- Parses pasted HL7 v2 text into an expandable tree.
- Keeps the pasted message visible while you scroll through the parsed structure below it.
- Detects the active field, component, repetition, escape, and subcomponent delimiters from the `MSH` segment.
- Labels known segments and fields using the bundled HL7 dictionary data.
- Shows concise field paths and decodes standard HL7 escape tokens for display.
- Handles common line endings, blank input, and optional empty-field display.
- Warns when a message does not start with a valid `MSH` segment, then continues parsing with default HL7 delimiters.

The main workflow is intentionally simple: paste a message into the text area, then expand the parsed structure below it.

## Supported Message Areas

HL7 Reader is not a complete HL7 validation engine. It is a practical reader with dictionary coverage for the message families currently represented in the codebase and tests, including common ADT, observation, order, insurance, pharmacy/treatment, diet, supply, and scheduling segments.

Unknown custom `Z` segments are still displayed deterministically as custom segments. Unknown standard or non-standard fields fall back to path-based labels such as `ZXX-2` so the structure remains inspectable.

## Current Implementation

The current application version is read from the root `VERSION` file. The workspace root is the active Tauri v2 desktop app, built with a Vite and TypeScript frontend.

The previous Electron source archive has been removed from the working tree. Historical release context lives in `BUILD_HISTORY.md`, `CHANGELOG.md`, and any retained versioned EXE artifacts in `release/`.

## Requirements

For development:

- Node.js and npm
- Rust toolchain compatible with Tauri v2
- Tauri build prerequisites for Windows
- Microsoft Edge WebView2 Runtime on target Windows machines

For release builds on this machine, use the Visual Studio Build Tools developer environment so Rust can find the MSVC runtime libraries.

## Development

Install dependencies:

```powershell
npm install
```

Run the frontend dev server:

```powershell
npm run dev
```

Run parser tests:

```powershell
npm test
```

Build the web frontend:

```powershell
npm run build
```

Compile the Tauri app and copy the versioned EXE into the root `release` folder:

```powershell
npm run tauri:build
```

`npm run dist` is the release-build alias:

```powershell
npm run dist
```

For a version change, edit only `VERSION`, then run:

```powershell
npm run version:sync
npm run version:check
npm test
npm run build
npm run tauri:build
```

`npm test`, `npm run build`, and the Tauri compile step all enforce `version:check`, so stale generated package, Cargo, or Tauri metadata fails before a release artifact is copied.

## Project Layout

- `src/main.ts` - desktop UI and renderer behavior.
- `src/shared/hl7Parser.ts` - HL7 parsing, delimiter detection, path generation, and escape decoding.
- `src/shared/hl7Dictionaries.ts` - segment, field, and component label data.
- `src/shared/hl7Deidentifier.ts` - local HL7 de-identification helpers.
- `src/shared/releaseNotes.ts` - About-screen release history.
- `src/styles/` - app and About-screen styling.
- `tests/` - parser, de-identification, and UI layout regression coverage.
- `src-tauri/` - Tauri application shell and Windows build configuration.
- `scripts/` - version sync and release-copy automation.
- `release/` - versioned Windows EXE artifacts.
- `VERSION` - manually edited source of truth for the active app version.
- `CHANGELOG.md` - release history.
- `VERSIONING.md` - versioning and release artifact policy.
- `BUILD_HISTORY.md` - build and release troubleshooting notes.

## Limitations

HL7 Reader is a message inspection tool, not a conformance validator. It does not verify every message against an official implementation guide, enforce required fields, validate value sets, or guarantee that a message is clinically or operationally correct.

It is best used to understand message shape, inspect values, troubleshoot delimiter/component structure, and orient yourself before deeper interface analysis.
