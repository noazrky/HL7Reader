# Versioning Policy

Project versions use the format `Major.Minor.Change`.

- `Major`: first number, used for major version releases.
- `Minor`: second number, used for minor version releases.
- `Change`: third number, used for smaller change releases.

Current version: `2.0.0`.

## Codebase Layout

- Workspace root: the primary v2 Tauri implementation used for the small no-installer Windows EXE.
- `archive/electron-v1`: the legacy v1 Electron implementation kept for reference and archived builds.
- `release`: versioned EXE artifacts for easy access.

Version `2.0.0` switches the release artifact from the Electron portable EXE to a direct-launch Tauri EXE. The Tauri EXE is portable in the no-installer sense, but it expects the Microsoft Edge WebView2 Runtime to already be installed on the target Windows machine.

## EXE Archives

When a major or minor version is made, keep an entirely separate versioned EXE artifact so older releases can be opened, inspected, and referenced independently from newer releases.

Examples:

- `1.0.0` to `1.0.1`: change version only; keep the normal versioned EXE.
- `1.0.0` to `1.1.0`: minor version; preserve a separate EXE for the new minor release.
- `1.0.0` to `2.0.0`: major version; preserve a separate EXE for the new major release.

Release artifacts should continue using versioned EXE names such as `HL7 Reader 0.2.1.exe` so old EXEs remain separate from current output. Run `npm run tauri:build` after EXE changes so the direct compiled Tauri EXE is copied into the root `release` folder.
