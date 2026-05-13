# HL7 Reader

HL7 Reader is a small Windows desktop application for inspecting HL7 v2 messages. It is intended for developers, analysts, interface engineers, and support staff who need to paste a raw message and quickly see how it breaks down into segments, fields, repetitions, components, subcomponents, and decoded display values.

The app does not send messages to a server. Parsing happens locally in the desktop window.

## What It Does

- Parses pasted HL7 v2 text into an expandable tree.
- Detects the active field, component, repetition, escape, and subcomponent delimiters from the `MSH` segment.
- Labels known segments and fields using the bundled HL7 dictionary data.
- Shows field paths such as `PID-5`, `OBX-3.2`, and repeated-field paths such as `PID-3(2)`.
- Decodes standard HL7 escape tokens for display while keeping raw parsed values intact internally.
- Handles common line endings and ignores blank input lines.
- Warns when a message does not start with a valid `MSH` segment, then continues parsing with default HL7 delimiters.
- Supports optional display of empty fields.

The main workflow is intentionally simple: paste a message into the text area, then expand the parsed structure below it.

## Supported Message Areas

HL7 Reader is not a complete HL7 validation engine. It is a practical reader with dictionary coverage for the message families currently represented in the codebase and tests, including common ADT, observation, order, insurance, pharmacy/treatment, diet, supply, and scheduling segments.

Unknown custom `Z` segments are still displayed deterministically as custom segments. Unknown standard or non-standard fields fall back to path-based labels such as `ZXX-2` so the structure remains inspectable.

## Current Implementation

The current application is version `2.0.1` and is implemented as a Tauri v2 desktop app with a Vite and TypeScript frontend.

The previous Electron implementation is kept under `archive/electron-v1` for historical reference. The workspace root is the active Tauri implementation.

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

Build the full release target through the project alias:

```powershell
npm run dist
```

## Project Layout

- `src/main.ts` - desktop UI and renderer behavior.
- `src/shared/hl7Parser.ts` - HL7 parsing, delimiter detection, path generation, and escape decoding.
- `src/shared/hl7Dictionaries.ts` - segment, field, and component label data.
- `tests/hl7Parser.test.ts` - parser regression coverage.
- `src-tauri/` - Tauri application shell and Windows build configuration.
- `release/` - versioned Windows EXE artifacts.
- `archive/electron-v1/` - archived Electron v1 implementation.
- `CHANGELOG.md` - release history.
- `VERSIONING.md` - versioning and release artifact policy.

## Limitations

HL7 Reader is a message inspection tool, not a conformance validator. It does not verify every message against an official implementation guide, enforce required fields, validate value sets, or guarantee that a message is clinically or operationally correct.

It is best used to understand message shape, inspect values, troubleshoot delimiter/component structure, and orient yourself before deeper interface analysis.
