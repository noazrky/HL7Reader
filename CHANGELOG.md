# Changelog

All project changes are tracked using the `Major.Minor.Change` version format described in `VERSIONING.md`.

## Unreleased

- Added a root `VERSION` file as the source of truth for the active Tauri app version.
- Added version sync/check tooling so package, Cargo, Tauri, release artifact, and About-screen version metadata derive from `VERSION` or fail the build when stale.
- Updated versioning and build documentation to describe the new source-of-truth flow.
- Disabled Tauri installer bundling in the default config and guarded the release copy step so the documented no-installer EXE remains the normal release artifact.

## 2.1.0 - 2026-05-13 00:05:00

- Refreshed the main HL7 Reader window with a cleaner light interface, tighter parser rows, and clearer message/parse status summaries.
- Kept the pasted message panel sticky while the parsed structure scrolls underneath.
- Added UI layout regression coverage for the sticky message panel.

## 2.0.4 - 2026-05-13 00:00:00

- Added a Windows startup safeguard that checks for the Microsoft Edge WebView2 Runtime before opening the Tauri app.
- Shows a clear native error message with the WebView2 download link if the direct EXE cannot start because the runtime is missing.
- Added Rust regression coverage for WebView2 startup error detection and fallback message copy.

## 2.0.3 - 2026-05-12 16:43:44

- Hid the native File/Edit/View/Help menu bar from the Help window while leaving the main window menu toggle unchanged.
- Verified the parser tests, frontend build, Rust check, and Tauri release build for the Help-window menu change.

## 2.0.2 - 2026-05-12 16:00:45

- Added broader datatype component labels for common composite values such as message type, processing ID, version, organization, quantity, driver license, financial class, job code, and generic CM fields.
- Added parser regression coverage for the newly labeled datatype components.

## 2.0.1 - 2026-05-12 15:29:23

- Expanded the HL7 v2.4 library specs with full Chapter 4 order entry, diet, supply, pharmacy/treatment, and Chapter 10 scheduling segment field definitions.
- Added parser regression coverage for the newly covered Chapter 4 segment families and terminal fields.

## 2.0.0 - 2026-05-11 12:24:57

- Added a Tauri-based desktop codebase under `tauri-spike` as the primary v2 implementation.
- Published a no-installer Windows EXE that launches directly and relies on the installed Microsoft Edge WebView2 Runtime instead of bundling Electron.
- Preserved the parser, HL7 dictionaries, About release history, menu toggle, and paste-and-inspect workflow from the Electron app while sharply reducing release artifact size.

## 1.0.0 - 2026-05-11 11:05:33

- Upgraded Electron and Electron Builder to resolve release-blocking dependency vulnerabilities.
- Added HL7 escape decoding for standard delimiter tokens, line breaks, custom delimiters, and preserved unknown/hex escapes.
- Hardened Electron window defaults, removed packaged reload/devtools menu entries, and enabled stricter unused-code checks.
- Reduced Windows package locales to en-US and enabled maximum package compression.

## 0.2.2 - 2026-05-11 10:25:00

- Documented the versioning policy and EXE archive expectations.
- Added this changelog to capture all project changes made up to now.
- Reworked the About window so each version's release notes appear in a separate dropdown.

## 0.2.1 - 2026-05-11 10:10:57

- Hid the native Electron menu bar by default.
- Added Ctrl+Shift+M, F1, and a hamburger button for native menu and About access.
- Updated the app icon to a star-only mark and reused it in the header, About dialog, and Windows package.

## 0.2.0 - 2026-05-11 09:49:59

- Added a populated Help menu with app version details and release history.
- Added a small HL7 Reader icon mark in the app header, Help dialog, and packaged Windows app.
- Limited packaged Electron locale files to en-US, en-GB, and es.

## 0.1.1 - 2026-05-11 09:46:53

- Expanded HL7 parser labeling for additional ADT, order, observation, procedure, role, and insurance segments.
- Added parser coverage for repeated fields, nested components, custom delimiters, malformed input, and blank input.

## 0.1.0 - 2026-05-11 09:39:41

- Created the initial HL7 v2 desktop reader.
- Added message parsing for segments, fields, components, subcomponents, metadata, and warnings.
- Added the main paste-and-inspect interface for HL7 message review.
