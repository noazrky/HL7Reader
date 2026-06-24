# Agent Reference Structure

This file is a compact routing map for Codex and other agents working in this repository. Use it before broad file reads so routine orientation does not require ingesting every source, generated, lock, build, and release file.

Last checked against the repo layout on 2026-06-24. Treat this as navigation help, not a substitute for reading the specific files you are about to change.

## How to Use This Map

- Start here for path selection, then read only the files listed for the task.
- For behavior changes, always read the target implementation file and its matching tests before editing.
- For release or version work, also read `VERSIONING.md`, `BUILD_HISTORY.md`, and the release scripts.
- Update this file when adding, removing, renaming, or materially changing the role of project files.

## Read First by Task

| Task | Read first | Usually also read |
| --- | --- | --- |
| Product behavior or user-facing docs | `README.md`, `CODEBASE.md` | `CHANGELOG.md`, `BUILD_HISTORY.md` |
| Main app UI, parser display, message highlighting, de-id panel | `src/main.ts` | `src/styles/styles.css`, `tests/uiLayout.test.ts` |
| About window or release notes UI | `src/about.ts`, `src/shared/releaseNotes.ts` | `src/styles/about.css`, `src-tauri/src/lib.rs` |
| HL7 parsing, delimiters, escape decoding, parsed tree shape | `src/shared/hl7Parser.ts` | `src/shared/hl7Dictionaries.ts`, `tests/hl7Parser.test.ts` |
| Segment, field, or datatype labels | `src/shared/hl7Dictionaries.ts` | `tests/hl7Parser.test.ts` |
| Synthetic de-identification behavior | `src/shared/hl7Deidentifier.ts` | `tests/hl7Deidentifier.test.ts`, `src/main.ts` |
| Theme startup behavior | `src/shared/systemTheme.ts` | `src/main.ts`, `tests/uiLayout.test.ts` |
| App icon rendering | `src/shared/appIcon.ts` | `src/main.ts`, `src/about.ts` |
| Tauri window shell, menu, zoom, fullscreen, About window, WebView2 startup handling | `src-tauri/src/lib.rs` | `src-tauri/tauri.conf.json`, `src-tauri/capabilities/default.json` |
| Frontend build/test config | `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json` | `package-lock.json` only for dependency changes |
| Version sync or release copy flow | `VERSION`, `VERSIONING.md`, `scripts/sync-version.mjs`, `scripts/copy-release.ps1` | `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `BUILD_HISTORY.md` |
| Documentation-only changes | Target doc file | `README.md`, `CODEBASE.md`, this file if structure changes |

## Root Documentation and Config

| Path | Role | Read when |
| --- | --- | --- |
| `AGENTS.md` | Project-level instructions for Codex and agents. | Every agent session, before choosing tools or workflow. |
| `README.md` | Public product overview, features, requirements, development commands, and high-level layout. | User-facing docs, product behavior, requirements, or onboarding changes. |
| `CODEBASE.md` | Human-oriented codebase overview and release/build notes. | Build/release context or broad architecture orientation. |
| `REFERENCE_STRUCTURE.md` | Agent-oriented file routing map. | Before broad repository scans. |
| `CHANGELOG.md` | Release history. | Version or release-note work. |
| `BUILD_HISTORY.md` | Build history, release steps, and troubleshooting notes. | Release builds, packaging issues, or machine-specific build questions. |
| `VERSIONING.md` | Version policy and release artifact policy. | Version bumps and release preparation. |
| `VERSION` | Manual source of truth for the active app version. | Version changes; edit this first, then sync. |
| `package.json` | npm scripts, package version, frontend/Tauri dependencies. | Any command, dependency, or version work. |
| `package-lock.json` | Locked npm dependency graph. | Dependency updates or install reproducibility only. |
| `tsconfig.json` | TypeScript compiler settings. | TypeScript build behavior. |
| `vite.config.ts` | Vite config, app version define, `@shared` alias, multi-entry build. | Frontend build entry points or version injection. |
| `vitest.config.ts` | Vitest root and test include config. | Test discovery or test runner changes. |
| `index.html` | Main window HTML entry. | Main app bootstrapping. |
| `about.html` | About window HTML entry. | About window bootstrapping. |

## Frontend Source

| Path | Role | Notes |
| --- | --- | --- |
| `src/main.ts` | Main renderer: builds the app DOM, parses messages, renders summaries/tree, handles message highlights, de-identification UI, copy/select actions, and menu bridge calls. | Read before changing the visible app workflow. |
| `src/about.ts` | About window renderer, release-note list, and app metadata display. | Uses `__APP_VERSION__` from Vite. |
| `src/shared/hl7Parser.ts` | Parser types and logic: delimiter detection, segment normalization, field/repetition/component/subcomponent parsing, escape decoding, metadata extraction. | Core behavior for parsed output. |
| `src/shared/hl7Dictionaries.ts` | Segment definitions, field labels, datatype component labels, lookup helpers, and known segment IDs. | Large data file; read targeted sections for label coverage changes. |
| `src/shared/hl7Deidentifier.ts` | Local synthetic value generation and field-level replacement rules for patient, related-person, insured, phone, address, date, and ID data. | No server/network behavior should be introduced here. |
| `src/shared/releaseNotes.ts` | About-screen release history data. | Keep aligned with `CHANGELOG.md` for releases. |
| `src/shared/systemTheme.ts` | Applies Tauri theme at startup with dark fallback. | Touch with theme initialization changes. |
| `src/shared/appIcon.ts` | Inline app icon SVG and data URL. | Touch only for icon rendering changes. |
| `src/styles/styles.css` | Main app layout, theme, parsed tree, message editor, and de-identification styling. | Paired with `tests/uiLayout.test.ts`. |
| `src/styles/about.css` | About window styling. | Paired with `src/about.ts`. |
| `src/vite-env.d.ts` | Vite/TypeScript environment declarations. | Rarely needed except for global defines. |

## Tauri and Rust Source

| Path | Role | Notes |
| --- | --- | --- |
| `src-tauri/src/main.rs` | Thin binary entry that calls `hl7_reader_tauri_lib::run()`. | Usually not the right place for behavior changes. |
| `src-tauri/src/lib.rs` | Tauri app setup, command handlers, menu setup, zoom/fullscreen actions, About window creation, WebView2 startup checks, and Rust tests. | Main Rust/Tauri behavior file. |
| `src-tauri/tauri.conf.json` | Tauri product metadata, app window config, CSP, build commands, disabled bundling, and icon config. | Version and packaging-critical. |
| `src-tauri/Cargo.toml` | Rust package metadata and dependencies. | Version sync and Rust dependency changes. |
| `src-tauri/Cargo.lock` | Locked Rust dependency graph. | Dependency updates or reproducibility only. |
| `src-tauri/capabilities/default.json` | Tauri v2 permissions and window capability config. | References `../gen/schemas/desktop-schema.json`. |
| `src-tauri/gen/schemas/` | Generated Tauri schema files used by capability validation. | Do not ingest for normal app work. Do not delete casually because `default.json` references this tree. |
| `src-tauri/icons/icon.ico` | Windows app icon. | Binary asset; inspect only for icon work. |
| `src-tauri/build.rs` | Tauri build hook. | Rarely needed. |

## Tests

| Path | Coverage |
| --- | --- |
| `tests/hl7Parser.test.ts` | Parser output, delimiter handling, escape decoding, unknown/custom segment labels, dictionary coverage for ADT, observation, order, insurance, pharmacy/treatment, diet, supply, and scheduling messages, plus performance guardrails. |
| `tests/hl7Deidentifier.test.ts` | Synthetic de-identification rules, delimiter preservation, repeat consistency, age preservation/capping, no-op cases, malformed DOB fallback, mixed line endings, and blank input. |
| `tests/uiLayout.test.ts` | Static UI/CSS regression checks for layout, theme contrast, app title/menu row, message wrapping warning, de-id panel, tree renderers, and no runtime network behavior for de-identification. |

## Scripts and Workflows

| Path or command | Purpose |
| --- | --- |
| `scripts/sync-version.mjs` | Syncs or checks `VERSION` across package, Cargo, Tauri config, and release-note/version metadata. Use `npm run version:sync` or `npm run version:check`. |
| `scripts/copy-release.ps1` | Runs the Tauri compile flow, verifies version/package/bundle expectations, then copies the raw EXE to `release/HL7 Reader <version>.exe`. |
| `npm test` | Runs version check and Vitest. Use for parser, de-id, and UI/static behavior changes. |
| `npm run build` | Runs version check, TypeScript no-emit, and Vite build. Use before publishing app-facing changes. |
| `npm run tauri:compile` | Compiles the raw Tauri app without installer bundling. |
| `npm run tauri:build` / `npm run dist` | Release flow that compiles and copies the versioned EXE into `release/`. |

## Heavy, Generated, or Artifact Paths

These paths should not be read during routine orientation:

- `node_modules/` - installed npm dependencies.
- `dist/` - Vite build output.
- `release/` - versioned Windows EXE artifacts and historical binaries.
- `src-tauri/target/` - Rust/Tauri build cache. It is safe to regenerate with the next Rust/Tauri build.
- `package-lock.json` and `src-tauri/Cargo.lock` - read only for dependency or reproducibility questions.
- `src-tauri/gen/schemas/` - generated Tauri schema reference files. Keep them unless intentionally changing Tauri capability/schema behavior.

## Common Change Routing

- Parser shape or path output: update `src/shared/hl7Parser.ts`, then focused cases in `tests/hl7Parser.test.ts`.
- New segment/field/datatype labels: update `src/shared/hl7Dictionaries.ts`, then dictionary expectations in `tests/hl7Parser.test.ts`.
- De-identification field coverage: update `src/shared/hl7Deidentifier.ts`, then `tests/hl7Deidentifier.test.ts`; update `src/main.ts` only if UI presentation changes.
- Main UI behavior or layout: update `src/main.ts` and/or `src/styles/styles.css`, then `tests/uiLayout.test.ts`.
- About-screen release display: update `src/shared/releaseNotes.ts`, `src/about.ts`, and `src/styles/about.css` as needed.
- Version bump: edit `VERSION`, run `npm run version:sync`, then verify with `npm run version:check`.
- Release packaging: read `VERSIONING.md` and `BUILD_HISTORY.md` before running `npm run tauri:build`.
