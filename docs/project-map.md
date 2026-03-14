# 🗺️ Beacon Dashboard — Complete Project Map

> **Project name (SST):** `civic-pulse-alpha`  
> **Framework:** Next.js 16.1.6 · App Router  
> **Package manager:** pnpm  
> **Deployed to:** AWS via SST v4 + OpenNext, DNS via Cloudflare  
> **Region:** `ap-southeast-1`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5.7.3 |
| Styling | Tailwind CSS v4 + CSS variables |
| Components | Radix UI primitives (full suite) |
| Charts | Recharts 2.15.0 |
| Forms | React Hook Form + Zod |
| Drag & Drop | @dnd-kit (core, sortable, utilities) |
| Icons | Lucide React |
| Theming | next-themes (dark/light) |
| Analytics | @vercel/analytics |
| Deployment | SST v4 + @opennextjs/aws |
| Auth | Custom localStorage-based |

---

## Route Structure

```
/
├── (auth)/                          # Unauthenticated layout
│   ├── layout.tsx                   # Minimal auth wrapper
│   ├── login/page.tsx               # Login form
│   └── forgot-password/page.tsx    # Password reset
│
└── (shell)/                         # Authenticated layout
    ├── layout.tsx                   # Sidebar + Topbar chrome
    ├── page.tsx                     # Root redirect
    ├── dashboard/
    │   ├── layout.tsx               # Dashboard sub-layout
    │   ├── page.tsx                 # Redirect to /overview
    │   ├── overview/page.tsx        # Multi-incident summary
    │   ├── weather/page.tsx         # Weather monitoring
    │   ├── crime/page.tsx           # Crime incidents
    │   ├── fire/page.tsx            # Fire incidents
    │   ├── flood/page.tsx           # Flood incidents
    │   ├── medical/page.tsx         # Medical incidents
    │   ├── infrastructure/page.tsx  # Infrastructure incidents
    │   ├── station/page.tsx         # Station operations
    │   └── table/page.tsx           # Incident data table
    ├── map/page.tsx                 # Map visualization
    ├── alerts/page.tsx              # Alert management
    ├── users/page.tsx               # User management
    └── settings/page.tsx            # App settings
```

---

## Components

### `components/shell/` — App Chrome
| File | Purpose |
|---|---|
| `sidebar.tsx` | Navigation sidebar with collapsible groups |
| `topbar.tsx` | Top navigation bar, theme toggle, user menu |

### `components/charts/` — Data Visualizations (Recharts)
| File | Purpose |
|---|---|
| `area-chart.tsx` | Area/line area chart |
| `bar-chart.tsx` | Standard bar chart |
| `bullet-chart.tsx` | Bullet gauge (actual vs target) |
| `calendar-heatmap.tsx` | Calendar-style heat map |
| `compass.tsx` | Wind direction compass |
| `composed-chart.tsx` | Bar + line composed chart |
| `gauge-arc.tsx` | Arc-style gauge |
| `line-chart.tsx` | Line chart |
| `local-forecast.tsx` | Local weather forecast display |
| `moon-phase.tsx` | Moon phase visualizer |
| `multi-temp-bar.tsx` | Multi-temperature bar |
| `radar-chart.tsx` | Radar/spider chart |
| `radial-chart.tsx` | Radial/donut chart |
| `rain-bar.tsx` | Rainfall bar chart |
| `scatter-chart.tsx` | Scatter plot |
| `shared.tsx` | Shared chart utilities/types |
| `spark-bar.tsx` | Sparkline bar |
| `stat-card.tsx` | Stat card with sparkline |
| `sunrise-sunset.tsx` | Sunrise/sunset arc display |
| `temp-humidity-bar.tsx` | Temperature + humidity dual bar |
| `timeline-heatmap.tsx` | Timeline-format heat map |
| `wind-rose.tsx` | Wind rose polar chart |

### `components/dashboard/` — Dashboard Layout
| File | Purpose |
|---|---|
| `dashboard-grid.tsx` | Drag-and-drop grid layout (dnd-kit) |
| `dashboard-tabs.tsx` | Tab switching for dashboard sections |
| `chart-block.tsx` | Chart wrapper with title/controls |
| `incident-table.tsx` | Full incident data table with filters |

### `components/map/` — Map View
> Map visualization components (geographic incident display)

### `components/ui/` — Radix UI Component Library
> Full shadcn/ui-style component library built on Radix primitives.  
> Includes: Accordion, Alert, Avatar, Badge, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, DataTable, DatePicker, Dialog, Drawer, Dropdown, Form, HoverCard, Input, Label, Menubar, NavigationMenu, OTP, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip

### `components/theme-provider.tsx`
> Wraps `next-themes` ThemeProvider for dark/light mode support.

---

## `lib/` — Core Logic

| File | Purpose |
|---|---|
| `types.ts` | Shared TypeScript types (Incident, Weather, Chart data) |
| `auth.tsx` | Auth context + localStorage session management |
| `hooks.ts` | Data hooks — returns typed mock/preset data per dashboard |
| `presets.ts` | Static preset data for all dashboards |
| `theme.ts` | Theme configuration and CSS variable tokens |
| `utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `data/` | (reserved for real data layer) |
| `mock-data/index.ts` | Mock incident data generator |
| `mock-data/seed.ts` | Seeded random data for consistency |
| `mock-data/types.ts` | Mock-data-specific types |
| `mock-data/generators/` | Per-incident-type data generators |

### Key Domain Types (`lib/types.ts`)
```ts
IncidentType   = 'Fire' | 'Flood' | 'Crime' | 'Medical' | 'Infrastructure' | 'Typhoon'
Severity       = 'Critical' | 'High' | 'Medium' | 'Low'
IncidentStatus = 'Active' | 'Responding' | 'Contained' | 'Resolved'

Incident { id, type, severity, status, zone, barangay, coordinates, timestamp, responders, duration, description, reporter }
```

---

## `hooks/` — React Hooks

| File | Purpose |
|---|---|
| `use-mobile.ts` | Mobile breakpoint detection |
| `use-toast.ts` | Toast notification state management |

---

## App Shell Files

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout — ThemeProvider, Analytics |
| `app/globals.css` | Global Tailwind CSS v4 styles + CSS variables |
| `next.config.mjs` | Next.js configuration |
| `tsconfig.json` | TypeScript config |
| `.eslintrc.json` | ESLint config |
| `.prettierrc` | Prettier config |
| `components.json` | shadcn/ui component registry config |

---

## Deployment (`sst.config.ts`)

```
SST App:  civic-pulse-alpha
Provider: AWS (ap-southeast-1) + Cloudflare DNS
Resource: sst.aws.Nextjs ("CivicPulseAlpha")
Build:    pnpm run build:opennext  (OpenNext adapter)

Stages:
  production → civicpulse.montz.qzz.io         (resources retained on removal)
  <stage>    → civicpulse-<stage>.montz.qzz.io

Image optimization: 1024 MB (prod) / 512 MB (dev)
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_STAGE` | Current deployment stage |
| `NEXT_PUBLIC_APP_NAME` | App display name |
| `NEXT_PUBLIC_APP_URL` | Public URL for the stage |
| `DATABASE_URL` | DB connection string (env-specific) |
| `AWS_S3_BUCKET_NAME` | S3 bucket for assets (prod) |
| `NEXT_PUBLIC_CDN_URL` | CDN base URL (prod) |
| `LOG_LEVEL` | Logging verbosity (`debug`/`info`/`warn`) |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Rate limit per stage |
| `NEXT_PUBLIC_ENABLE_BETA_FEATURES` | Feature flag |

---

## Dev Commands

```bash
pnpm dev              # Local Next.js dev server
pnpm build            # Next.js production build
pnpm build:opennext   # OpenNext build (for SST deployment)
pnpm start            # Start production server
pnpm lint             # ESLint with auto-fix
pnpm lint:check       # ESLint check only
pnpm format           # Prettier format
pnpm format:check     # Prettier check
pnpm typecheck        # tsc --noEmit
pnpm s:dev            # SST dev mode
pnpm s:deploy         # SST deploy (current stage)
pnpm s:deploy:prod    # SST deploy to production stage
pnpm s:remove         # SST remove stack
```

---

## Data Flow

```
lib/presets.ts  ──────────┐                    ┌──► Dashboard Pages
                           ├──► lib/hooks.ts ───┤
lib/mock-data/  ──────────┘                    ├──► components/charts/
                                                └──► components/dashboard/

lib/auth.tsx    ──────────► app/(shell)/layout.tsx  ► Route protection
```

> **Current state:** All data is **client-side static/mock**. No real API calls yet.  
> `DATABASE_URL` in SST env vars signals that a real backend/data layer is planned.

---

## Agent Config (`.agent/`)

> `.agent/config.json` — agent-specific configuration.  
> Linked skills: `@nextjs`, `@advanced-typescript`, `@tailwind-design-system`, `@tailwind-patterns`, `@tailwindv4`
