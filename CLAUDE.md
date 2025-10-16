# Repository Guidelines

## Project Structure & Module Organization
- `src/main/` captures the Electron main process plus window, tray, and hotkey managers; keep IPC channels centralized here.
- `src/preload/` exposes tightly scoped bridges to the renderer; audit new APIs for security impact.
- `src/renderer/` houses React features; encourage shared hooks/components to avoid duplication.
- `src/shared/` and `src/types/` store cross-process utilities and contracts—extend these instead of forking logic.
- Place static assets in `assets/`; build outputs live in `out/`, and packaged installers in `dist/`.

## Build, Test, and Development Commands
- `npm run dev` launches electron-vite with live reload; monitor the console for preload/main logs.
- `npm run build` type-checks via `tsc --noEmit` and emits production bundles into `out/`.
- `npm run lint` executes ESLint across `src`; fix violations or justify inline disables sparingly.
- `npm run test` runs Jest suites; pair with `--watch` when iterating on a feature.
- `npm run dist` builds installers through electron-builder; confirm the build before shipping artifacts.

## Coding Style & Naming Conventions
- Stick to TypeScript with 2-space indentation and single quotes—ESLint enforces formatting.
- Use PascalCase for React components (`CaptureOverlay.tsx`) and camelCase for utilities/hooks (`useHotkey.ts`).
- Keep renderer-only dependencies out of the main process; expose shared helpers through `src/shared/`.
- Handle async workflows explicitly; follow patterns in `src/main/services/ErrorService.ts`.

## Testing Guidelines
- Jest is the primary framework; colocate `*.test.ts(x)` beside source files or in `__tests__/` for integrations.
- Mock Electron APIs with lightweight adapters to maintain deterministic tests.
- Aim for >80% coverage on touched modules and cover hotkeys, preload bridges, and renderer state transitions.
- Note coverage deltas and manual verification steps in PR descriptions.

## Commit & Pull Request Guidelines
- Adopt Conventional Commits (e.g., `feat: add capture overlay shortcut`) to streamline future changelogs.
- Keep commits focused, bundling related lint or type fixes with the feature they support.
- PRs should outline intent, list key changes, document executed test commands, and attach screenshots/GIFs for UI updates; link issues when relevant.
- Request reviews from maintainers owning impacted areas (`main`, `renderer`, shared contracts).

## External Resources
- Fetch third-party library documentation through the context7 integration.
- Import shadcn components via the shadcn MCP interface to stay aligned with project tooling.
