# Repository Guidelines

## Project Structure & Module Organization
- `src/main/` hosts the Electron main process, including window, hotkey, tray managers, and IPC wiring.
- `src/preload/` exposes vetted APIs to the renderer via context bridges; keep surface areas minimal.
- `src/renderer/` contains React features; prefer colocated state, shared hooks, and reusable UI primitives.
- Shared contracts live in `src/shared/` and `src/types/`; extend these before copying logic across processes.
- Build artifacts go to `out/`; installers land in `dist/`. Store images and icons under `assets/`.

## Build, Test, and Development Commands
- `npm run dev` spins up electron-vite with live reload—watch the terminal for preload and main logs.
- `npm run build` type-checks with `tsc --noEmit` and creates production bundles in `out/`.
- `npm run lint` runs ESLint across `src`; resolve issues or justify inline disables sparingly.
- `npm run test` executes Jest suites; add flags like `--watch` for focused debugging.
- `npm run dist` packages installers via electron-builder into `dist/`; ensure build succeeds before release.

## Coding Style & Naming Conventions
- Use TypeScript, 2-space indentation, and single quotes; ESLint enforces formatting.
- Components follow PascalCase (`CaptureOverlay.tsx`); utilities and hooks use camelCase (`useHotkey.ts`).
- Keep renderer-only code out of the main process; share utilities through `src/shared/`.
- Favor explicit async handling—see `src/main/services/ErrorService.ts` for patterns.

## Testing Guidelines
- Jest is the default runner; place tests as `*.test.ts(x)` beside source or in `__tests__/` for integrations.
- Mock Electron APIs via lightweight adapters to keep suites deterministic.
- Target >80% coverage on touched modules and exercise hotkey flows, preload bridges, and renderer state transitions.
- Document notable coverage deltas and manual verification steps in PR descriptions.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (e.g., `feat: add capture overlay shortcut`) to keep changelog generation simple.
- Keep commits focused; include lint or type fixes that directly support the change set.
- PRs should include intent, key changes, test commands executed, and screenshots/GIFs for UI deltas; link issues when available.
- Request review from code owners for affected domains (`main`, `renderer`, shared contracts).

## External Resources
- Use the context7 integration to fetch documentation for third-party libraries.
- Use the shadcn MCP interface when importing UI components from the shadcn registry.
