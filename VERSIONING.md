# Versioning Policy

Project versions use the format `Major.Minor.Change`.

- `Major`: first number, used for major version releases.
- `Minor`: second number, used for minor version releases.
- `Change`: third number, used for smaller change releases.

## Source Of Truth

`VERSION` is the only manually edited source of truth for the active Tauri app version.

The following files keep version fields only because npm, Cargo, and Tauri require their own metadata:

- `package.json`
- `package-lock.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`

Those fields are derived from `VERSION` by `scripts/sync-version.mjs`. Do not edit them by hand during a release bump.

To bump the active Tauri app version:

1. Edit only `VERSION`.
2. Run `npm run version:sync`.
3. Run `npm run version:check`.

The About screen reads the same version at build time through Vite's `__APP_VERSION__` define. Release-history entries in `src/shared/releaseNotes.ts` and `CHANGELOG.md` remain curated historical notes, not source-of-truth current-version metadata.

Version sync is enforced before `npm test`, `npm run build`, and `npm run tauri:compile`. `scripts/copy-release.ps1` also reads `VERSION` and rejects stale package, Cargo, or Tauri metadata before copying the release EXE.

For build history, release steps, and troubleshooting notes for each released version, see `BUILD_HISTORY.md`.

## Codebase Layout

- Workspace root: the primary v2 Tauri implementation used for the small no-installer Windows EXE.
- `release`: versioned EXE artifacts for easy access.

Version `2.0.0` switches the release artifact from the Electron portable EXE to a direct-launch Tauri EXE. The Tauri EXE is portable in the no-installer sense, but it expects the Microsoft Edge WebView2 Runtime to already be installed on the target Windows machine. The default Tauri config intentionally keeps bundling inactive so releases do not produce an NSIS installer or WebView2 bootstrapper.

## EXE Archives

When a major or minor version is made, keep an entirely separate versioned EXE artifact so older releases can be opened, inspected, and referenced independently from newer releases.

Examples:

- `1.0.0` to `1.0.1`: change version only; keep the normal versioned EXE.
- `1.0.0` to `1.1.0`: minor version; preserve a separate EXE for the new minor release.
- `1.0.0` to `2.0.0`: major version; preserve a separate EXE for the new major release.

Release artifacts should continue using versioned EXE names such as `HL7 Reader 0.2.1.exe` so old EXEs remain separate from current output. Run `npm run tauri:build` after EXE changes so the direct compiled Tauri EXE is copied into the root `release` folder using the version from `VERSION`.
