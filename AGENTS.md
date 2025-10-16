# Repository Guidelines

This guide keeps contributions focused and consistent with the Markdown Capture project’s Electron + React architecture.

## Project Structure & Module Organization
- `src/main/`: Electron main process, window/hotkey/tray managers, and IPC wiring.
- `src/preload/`: Context bridge scripts exposing safe APIs to the renderer.
- `src/renderer/`: React UI, organized by feature-driven directories; reuse shared hooks/components.
- `src/shared/` & `src/types/`: Cross-process utilities and TypeScript contracts—extend these before duplicating logic.
- `assets/`: Static icons and branding; `out/` is the compiled build, while `dist/` holds packaged installers.

## Build, Test, and Development Commands
- `npm run dev`: Launches electron-vite in watch mode; keep console open for preload/main logs.
- `npm run build`: Runs `tsc --noEmit` then produces production bundles in `out/`.
- `npm run lint`: Executes ESLint across `src`; fix issues or justify disables inline.
- `npm run test`: Invokes Jest (configure per feature as tests are added).
- `npm run dist`: Builds and packages via electron-builder; installers land in `dist/`.

## Coding Style & Naming Conventions
- Use TypeScript with 2-space indentation and single quotes (ESLint will flag deviations).
- Name files by responsibility (`WindowManager.ts`, `CaptureOverlay.tsx`) and prefer PascalCase for React components, camelCase for utilities.
- Keep cross-process contracts in `src/shared` to avoid drift; update related type definitions in lockstep.
- Favor explicit async error handling—see `ErrorService` patterns in `src/main/services`.

## Testing Guidelines
- Jest is the default runner; colocate specs as `*.test.ts` / `*.test.tsx` near the code or under a `__tests__` folder when grouping integration flows.
- Mock Electron APIs via lightweight adapters to keep tests deterministic.
- Cover new public APIs, hotkey flows, and renderer state transitions; aim for stable >80% coverage on touched modules.
- Run `npm run test` and share notable coverage deltas in the PR description.

## Commit & Pull Request Guidelines
- With no formal history yet, follow Conventional Commits (`feat: add capture overlay shortcut`) to keep future changelog generation simple.
- Keep commits focused; include TypeScript and ESLint fixes alongside the feature that required them.
- Pull requests should describe intent, list key changes, note test commands run, and attach screenshots/GIFs for UI updates.
- Link issues when available and request review from owners of affected areas (`main`, `renderer`, or shared contracts).
