# Beacon Scaffold - Claude Instructions

## Project Overview

- **Type**: Next.js 16 Web Application (App Router)
- **Purpose**: Multi-dashboard civic monitoring system for Calbayog City — weather, fire, flood, crime, medical, infrastructure data
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI, Recharts, @dnd-kit, SST (serverless)

## Key Commands

```bash
pnpm run dev          # Development server
pnpm run build        # Production build
pnpm run lint         # ESLint fix
pnpm run typecheck    # TypeScript check
```

## Project Structure

```
app/
├── (auth)/              # Cookie-based login
├── (shell)/             # Sidebar + topbar shell
│   ├── dashboard/
│   │   ├── overview/    # City risk, trends, heatmaps
│   │   ├── weather/     # Weather forecasts
│   │   ├── station/     # NwSSU-AWS weather station (13 charts)
│   │   ├── table/       # Incident data table (TanStack planned)
│   │   ├── fire/ flood/ crime/ medical/ infrastructure/
│   ├── map/             # MapLibre (planned)
│   ├── settings/        # Theme picker
│   └── users/ alerts/
components/
├── charts/              # 26+ chart components (Recharts + custom SVG)
├── dashboard/           # DashboardGrid, toolbar, presets
├── shell/               # Sidebar, Topbar
├── map/                 # Map shell (MapLibre planned)
└── theme-provider.tsx
lib/
├── hooks.ts             # Data hooks (currently hardcoded mock data)
├── types.ts             # Shared interfaces
├── theme.ts             # 8 OKLCH themes × 3 modes (dark/soft/light)
├── presets.ts           # 9 dashboard presets
├── dashboard-blocks.ts  # Block reducer, DnD logic
└── auth.ts              # Auth helpers
docs/plans/              # Implementation plans
└── OC/                  # 5-part opencode series (execute sequentially)
```

## Design System

- **Styling**: Tailwind CSS v4 with OKLCH CSS variables (`app/globals.css`)
- **Components**: Radix UI primitives + custom components
- **Charts**: Recharts (line, bar, area, radar, composed) + custom SVG (gauge, compass, wind rose, heatmaps)
- **Theme**: 8 themes × 3 modes via `next-themes` — defined in `lib/theme.ts`
- **Grid**: CSS Grid with @dnd-kit drag-and-drop reordering

## Data Architecture

All chart data is **hardcoded in hooks** (`lib/hooks.ts`). The OC series migrates this:

1. **OC-1**: `lib/mock-data/` — seeded PRNG generators for all data
2. **OC-2**: Chart wiring — hooks consume mock-data, theme-aware colors
3. **OC-3**: TanStack Table for `/dashboard/table`
4. **OC-4**: MapLibre GL JS for `/map`
5. **OC-5**: (Optional) Live WeatherLink API via Effect v4 + Hono

Plans: `docs/plans/OC/BEACON_OC_*.md`

## Guidelines

1. Always run `pnpm run typecheck` after changes
2. Use existing patterns from `components/charts/` and `components/dashboard/`
3. Follow the route structure in `app/(shell)/`
4. Keep Recharts usage consistent with existing chart components
5. Use Radix UI primitives for new interactive components
6. Read the relevant `docs/plans/OC/` prompt before starting any OC task
7. Do not change visual markup during wiring tasks (OC-2 through OC-5)
