# 00 — Beacon Dashboard: Reprioritized Roadmap

> Last updated: 2026-03-15

## Context
This project is a **UI scaffold**. All data is hardcoded. The priority is to solidify the frontend architecture before wiring data or jumping to a monorepo.

---

## Sprint Order (Revised)

| # | Plan | Focus | Est. Hours | Depends On | Status |
|---|------|-------|-----------|------------|--------|
| **0** | [05.5-nx-workspace-migration](05.5-nx-workspace-migration.md) | NX workspace + package boundaries + Vite lib mode | 6–9 | — | 📋 **Next** |
| **1** | [06-atomic-componentization](06-atomic-componentization.md) | Atom → Molecule → Organism refactor (inside NX libs) | 11–15 | #0 | 📋 Queued |
| **2** | [07-chart-props-surface-area](07-chart-props-surface-area.md) | Unified type-safe props for all charts | 7–11 | #1 | 📋 Queued |
| **3** | [08-weather-route-expansion](08-weather-route-expansion.md) | `/weather` section — faithful WeatherLink recreation, modernized | 16–24 | #1, #2 | 📋 Queued |
| — | — | **UI HANDOFF POINT** | — | — | — |
| **4** | [OC-1: Mock Data](OC/BEACON_OC_1_MOCK_DATA.md) | Seeded PRNG data engine in `libs/mock-data/` | 8–12 | #2 | 📋 Backlog |
| **5** | [OC-2: Wiring](OC/BEACON_OC_2_WIRING.md) | Connect all charts to data via hooks | 10–14 | #4 | 📋 Backlog |
| **6** | [OC-3: Table](OC/BEACON_OC_3_TABLE.md) | TanStack Table wiring | 6–8 | #4, #5 | 📋 Backlog |
| **7** | [OC-4: Map](OC/BEACON_OC_4_MAP.md) | MapLibre GL JS integration | 8–12 | #4 | 📋 Backlog |
| **8** | [OC-5: Weather Live](OC/BEACON_OC_5_WEATHER_LIVE.md) | Live WeatherLink API via Effect + Hono | 12–16 | #5, #3 | 📋 Backlog |

---

## Completed Plans

| Plan | What Was Done |
|------|--------------|
| [01-theme-system-status](01-theme-system-status.md) | ✅ 8 themes × 3 modes (24 CSS variants) |
| [02-weather-station-charts](02-weather-station-charts.md) | ✅ 13 chart types wired to weather_station preset |
| [04-gauge-chart-layout-fixes](04-gauge-chart-layout-fixes.md) | ✅ Replaced custom SVG with Recharts RadialBar |
| [05-layout-responsiveness-fixes](05-layout-responsiveness-fixes.md) | ✅ Topbar + Sidebar responsive (flexbox, overflow-y-auto) |
| [05-responsive-charts-grid-refactor](05-responsive-charts-grid-refactor.md) | ✅ CSS Grid responsive + colSpan clamping + aspect-ratio |

---

## Work Split: AI Agent vs. Human

| Owner | Scope |
|-------|-------|
| **AI Agent** | Plans #1–#3 (UI-only: refactoring, new routes, component structure) |
| **Human** | Plan #4 (monorepo scaffold, NX/Turbo config, CI) |
| **Collaborative** | Plans #5–#9 (data layer, API integration — human sets up infra, AI wires code) |

---

## Worktree-Enabled Workflow (Future)

When git worktrees are enabled:
- **Main worktree**: Stable `main` branch — production build
- **Feature worktrees**: Each plan gets its own worktree (`wt/06-atomic`, `wt/07-props`, etc.)
- **Agent workflow**: AI works in feature worktrees, human reviews PRs
- The agent-kit workflows (`.agent/workflows/`) are fully compatible — each `/plan`, `/enhance`, `/test` command operates within the active worktree context

---

## Agent-Kit Status

The Antigravity Kit is installed with **20 agents**, **36 skills**, and **11 workflows**:
- Workflows are file-based at `.agent/workflows/*.md` and manually invocable
- The `/orchestrate` workflow supports multi-agent coordination for parallel work
- `/ui-ux-pro-max` provides 50 design styles for premium UI generation
- All slash commands are recognized by the environment and ready to use
