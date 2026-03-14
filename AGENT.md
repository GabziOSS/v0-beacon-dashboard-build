# Beacon Scaffold - Agent Instructions

## Project Overview

- **Type**: Next.js 16 Web Application (App Router)
- **Purpose**: Multi-dashboard civic/beacon monitoring system for Calbayog City — weather, infrastructure, medical, fire, flood, crime, and incident data
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI, Recharts, @dnd-kit, SST (serverless)

## Key Commands

```bash
pnpm run dev          # Development server
pnpm run build       # Production build
pnpm run lint        # ESLint fix
pnpm run typecheck   # TypeScript check
```

## Project Structure

```
app/
├── (auth)/              # Auth routes: login, forgot-password
│   └── login/page.tsx
├── (shell)/             # Main app routes (sidebar + topbar shell)
│   ├── page.tsx               # Root redirect → /dashboard/overview
│   ├── layout.tsx             # App shell with sidebar
│   ├── dashboard/
│   │   ├── overview/          # City risk, trends, heatmaps
│   │   ├── weather/           # Weather forecasts
│   │   ├── station/           # NwSSU-AWS weather station (13 charts)
│   │   ├── table/             # Incident data table (TanStack planned)
│   │   ├── medical/
│   │   ├── infrastructure/
│   │   ├── flood/
│   │   ├── crime/
│   │   └── fire/
│   ├── map/                   # MapLibre integration (planned)
│   ├── users/
│   ├── settings/              # Theme picker, preferences
│   └── alerts/
components/
├── charts/              # 26+ chart components (Recharts + custom SVG)
├── dashboard/           # DashboardGrid, DashboardToolbar, preset loading
├── map/                 # Map shell components (MapLibre planned)
├── shell/               # Sidebar, Topbar
└── theme-provider.tsx
lib/
├── hooks.ts             # Data hooks (currently hardcoded mock data)
├── types.ts             # Shared TypeScript interfaces
├── theme.ts             # 8 OKLCH themes × 3 modes
├── presets.ts           # 9 dashboard presets (block layouts per route)
├── dashboard-blocks.ts  # Block reducer, DnD logic
└── auth.ts              # Cookie-based auth helpers
docs/plans/              # Implementation plans and roadmap
├── 01–05               # Theme, weather, gauge fixes, responsiveness
└── OC/                  # 5-part sequential opencode series (see below)
```

## Design System

- **Styling**: Tailwind CSS v4 with OKLCH CSS variables
- **Components**: Radix UI primitives + custom components
- **Icons**: Lucide React
- **Charts**: Recharts (line, bar, area, radar, composed) + custom SVG (gauge, compass, wind rose, heatmaps)
- **Theme**: 8 themes × 3 modes (dark/soft/light) via `next-themes` — see `lib/theme.ts` and `app/globals.css`
- **Grid**: CSS Grid with @dnd-kit drag-and-drop reordering

## Data Architecture (Current State)

All chart data is currently **hardcoded in hooks** (`lib/hooks.ts`). The OC series plans to migrate this:

1. **OC-1**: `lib/mock-data/` module with seeded PRNG generators
2. **OC-2**: Chart wiring — hooks consume mock-data, theme-aware colors
3. **OC-3**: TanStack Table wiring for `/dashboard/table`
4. **OC-4**: MapLibre GL JS integration for `/map`
5. **OC-5**: (Optional) Live WeatherLink API via Effect v4 + Hono

Plans are in `docs/plans/OC/BEACON_OC_*.md` — execute sequentially.

<!-- ## Available Skills (linked in .agent/skills/)

- `@nextjs` - Next.js patterns
- `@advanced-typescript` - TypeScript best practices
- `@tailwind-design-system` - Tailwind design system
- `@tailwind-patterns` - Tailwind patterns
- `@tailwindv4` - Tailwind v4 -->

## Agent Guidelines

1. Always run `pnpm run typecheck` after making changes
2. Use existing component patterns from `components/charts/` and `components/dashboard/`
3. Follow the route structure in `app/(shell)/`
4. Keep Recharts usage consistent with existing chart components
5. Use Radix UI primitives for new interactive components
6. Read the relevant `docs/plans/OC/` prompt before starting any OC task
7. Do not change visual markup during wiring tasks (OC-2 through OC-5)
