# v0-beacon-dashboard-build

## Project Responsibility

A Next.js 16 App Router application providing a multi-dashboard civic monitoring platform with authentication, theming, and data visualization. Built with v0 and includes SST for deployment.

## System Entry Points

| File                     | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `app/layout.tsx`         | Root layout with ThemeProvider, Analytics, global components |
| `app/(shell)/layout.tsx` | Authenticated shell with Sidebar and Topbar                  |
| `app/(auth)/layout.tsx`  | Auth routes layout (login, forgot-password)                  |
| `package.json`           | Dependencies and scripts (pnpm)                              |
| `next.config.mjs`        | Next.js configuration                                        |
| `sst.config.ts`          | SST deployment configuration                                 |

## Directory Map

| Directory                | Responsibility Summary                                                                 | Detailed Map                                   |
| ------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `lib/`                   | Core utilities, types, theme, presets, auth                                            | [View Map](lib/codemap.md)                     |
| `hooks/`                 | Custom React hooks (useMobile, useToast)                                               | [View Map](hooks/codemap.md)                   |
| `components/ui/`         | Reusable Radix UI component library                                                    | [View Map](components/ui/codemap.md)           |
| `components/shell/`      | App chrome: Sidebar, Topbar                                                            | [View Map](components/shell/codemap.md)        |
| `components/dashboard/`  | Dashboard widgets, grids, tables                                                       | [View Map](components/dashboard/codemap.md)    |
| `components/charts/`     | Recharts-based chart components                                                        | [View Map](components/charts/codemap.md)       |
| `components/map/`        | Map visualization components                                                           | [View Map](components/map/codemap.md)          |
| `app/(shell)/`           | Authenticated routes with shared shell                                                 | [View Map](<app/(shell)/codemap.md>)           |
| `app/(auth)/`            | Authentication pages                                                                   | [View Map](<app/(auth)/codemap.md>)            |
| `app/(shell)/dashboard/` | Dashboard pages (weather, crime, fire, flood, medical, infrastructure, station, table) | [View Map](<app/(shell)/dashboard/codemap.md>) |

## Route Structure

```
/
├── (auth)/
│   ├── login/
│   └── forgot-password/
├── (shell)/              # Authenticated shell
│   ├── dashboard/
│   │   ├── overview/
│   │   ├── weather/
│   │   ├── crime/
│   │   ├── fire/
│   │   ├── flood/
│   │   ├── medical/
│   │   ├── infrastructure/
│   │   ├── station/
│   │   └── table/
│   ├── map/
│   ├── alerts/
│   ├── users/
│   └── settings/
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: Radix UI primitives, Tailwind CSS 4
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Auth**: Custom (localStorage-based)
- **Deployment**: SST (AWS)
- **Package Manager**: pnpm

## Integration Points

- **Vercel Analytics**: Integrated via `@vercel/analytics`
- **Theme System**: next-themes with dark/light mode
- **State**: React hooks + Context (ThemeProvider)
- **Data**: Client-side fetching with static presets

## Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier formatting
pnpm typecheck    # TypeScript checking
pnpm sst:dev     # SST dev mode
pnpm sst:deploy  # SST deployment
```
