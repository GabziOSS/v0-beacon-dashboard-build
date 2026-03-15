# 06 — Atomic Design Componentization

## Goal
Restructure `components/` using the **Atom → Molecule → Organism** paradigm to prepare for the monorepo jump. Atoms = shadcn primitives (already exist). Everything above gets organized into granular, composable layers.

> [!IMPORTANT]
> This must happen **before** `OC-1 (Mock Data)` so that the monorepo packages can import clean, self-contained UI modules rather than a tangled component tree.

---

## Current State (Problems)

| Issue | Example |
|-------|---------|
| Flat chart directory | All 27 charts in `components/charts/` — no hierarchy |
| Mixed concerns | `WindRoseChart` owns SVG math, layout, legend, AND tab state |
| Inconsistent props | `GaugeArc` takes `{value, label, max}`, `StatCard` takes `{data: StatCardData}`, `BarometerChart` takes `{data: BarometerPoint[]}` |
| No shared primitives | Each chart re-implements its own skeleton, empty state, header |
| Dashboard coupling | `ChartBlock` is both container + interaction (drag, resize, menu) |

---

## Proposed Structure

```
components/
├── atoms/           ← Shadcn re-exports + tiny custom primitives
│   ├── index.ts
│   ├── badge.tsx          (re-export from ui/)
│   ├── chart-value.tsx    (formatted number with unit + animation)
│   ├── delta-badge.tsx    (trend arrow + percentage)
│   ├── sparkline.tsx      (minimal bar sparkline)
│   ├── svg-arc.tsx        (reusable arc path generator)
│   ├── svg-needle.tsx     (gauge/compass needle)
│   └── chart-skeleton.tsx (loading shimmer)
│
├── molecules/       ← Composed from atoms, single responsibility
│   ├── gauge/
│   │   ├── gauge-arc.tsx       (radial bar gauge — value + label + thresholds)
│   │   └── gauge-arc.types.ts
│   ├── compass/
│   │   ├── compass-dial.tsx    (bearing indicator)
│   │   └── compass-dial.types.ts
│   ├── wind-rose/
│   │   ├── wind-rose-petals.tsx (SVG petals only — no legend, no tabs)
│   │   └── wind-rose.types.ts
│   ├── stat-display/
│   │   ├── stat-display.tsx    (number + delta + sparkline)
│   │   └── stat-display.types.ts
│   ├── sun-arc/
│   │   ├── sun-arc.tsx         (sunrise/sunset arc — no data fetching)
│   │   └── sun-arc.types.ts
│   ├── moon-display/
│   │   ├── moon-display.tsx    (phase SVG + label)
│   │   └── moon-display.types.ts
│   ├── forecast-card/
│   │   ├── forecast-card.tsx   (condition icon + temp + description)
│   │   └── forecast-card.types.ts
│   └── chart-wrappers/
│       ├── line-chart-base.tsx    (Recharts LineChart with standard config)
│       ├── bar-chart-base.tsx
│       ├── area-chart-base.tsx
│       └── chart-base.types.ts
│
├── organisms/       ← Full chart compositions with legends, tabs, tooltips
│   ├── weather/
│   │   ├── barometer-panel.tsx
│   │   ├── wind-rose-panel.tsx   (petals + legend + day/week/month tabs)
│   │   ├── temperature-panel.tsx (multi-temp bars)
│   │   ├── rain-panel.tsx        (current rain + total rain)
│   │   └── celestial-panel.tsx   (sunrise/sunset + moon combined)
│   ├── incidents/
│   │   ├── trend-panel.tsx       (line chart + time range selector)
│   │   ├── category-bar-panel.tsx
│   │   ├── response-area-panel.tsx
│   │   ├── heatmap-panel.tsx
│   │   └── calendar-panel.tsx
│   └── overview/
│       ├── stat-card-panel.tsx   (stat-display + contextual glow)
│       ├── risk-gauge-panel.tsx
│       └── district-radar-panel.tsx
│
├── dashboard/       ← Grid infrastructure (stays here)
│   ├── chart-block.tsx
│   ├── dashboard-grid.tsx
│   └── block-manager.tsx  (extracted add/remove/bulk logic)
│
└── shell/           ← Layout infrastructure (stays here)
    ├── sidebar.tsx
    └── topbar.tsx
```

---

## Phases & Estimates

### Phase 1: Extract Atoms (Est: 2–3 hours)
- [ ] Create `components/atoms/` with: `chart-value`, `delta-badge`, `sparkline`, `svg-arc`, `svg-needle`, `chart-skeleton`
- [ ] Move `ChartSkeleton` and `ChartEmpty` from `charts/shared.tsx` → `atoms/`
- [ ] Each atom: pure render, zero state, typed props

### Phase 2: Extract Molecules (Est: 4–6 hours)
- [ ] `gauge/gauge-arc.tsx` — extract from current `gauge-arc.tsx`, use `atoms/chart-value`
- [ ] `compass/compass-dial.tsx` — extract from `compass.tsx`
- [ ] `wind-rose/wind-rose-petals.tsx` — SVG-only, no tabs/legend
- [ ] `stat-display/stat-display.tsx` — extract from `stat-card.tsx`, use atoms
- [ ] `sun-arc/sun-arc.tsx` — extract from `sunrise-sunset.tsx`
- [ ] `moon-display/moon-display.tsx` — extract from `moon-phase.tsx`
- [ ] `forecast-card/forecast-card.tsx` — extract from `local-forecast.tsx`
- [ ] `chart-wrappers/` — standardized Recharts base components

### Phase 3: Compose Organisms (Est: 3–4 hours)
- [ ] Weather organisms: compose molecules + add legends/tabs/tooltips
- [ ] Incident organisms: standardize data injection
- [ ] Overview organisms: stat cards + gauges + radar

### Phase 4: Rewire Dashboard Grid (Est: 2 hours)
- [ ] Update `renderContent()` to import organisms instead of flat charts
- [ ] Extract block management logic into `block-manager.tsx`
- [ ] Verify all presets still render correctly

**Total estimate: 11–15 hours of focused work**

---

## Migration Strategy

1. **Co-exist**: New atomic components live alongside old ones during migration
2. **Swap**: Replace imports in `dashboard-grid.tsx` one chart at a time
3. **Archive**: Move old flat chart files to `components/charts/archive/`
4. **Delete**: Remove archive after verification

---

## Monorepo Alignment

After componentization, the structure maps cleanly to packages:

| Atomic Layer | Future Package |
|---|---|
| `atoms/` | `@beacon/ui-primitives` |
| `molecules/` | `@beacon/chart-molecules` |
| `organisms/` | `@beacon/chart-panels` |
| `dashboard/` | `@beacon/dashboard-core` |
| `shell/` | `@beacon/shell` |

This enables multi-agent workflows where each agent can own a package boundary.
