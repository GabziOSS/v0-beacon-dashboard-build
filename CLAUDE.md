# Beacon Dashboard - Claude Instructions

## Project Overview

- **Type**: Next.js 16 Web Application (App Router)
- **Purpose**: Multi-dashboard civic/beacon monitoring system
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI, Recharts, SST

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint fix
npm run typecheck    # TypeScript check
```

## Project Structure

```
app/
├── (auth)/          # Auth: login, forgot-password
├── (shell)/         # Main app routes
│   ├── dashboard/   # Dashboard pages (overview, weather, station, table, medical, infrastructure, flood, crime, fire)
│   ├── map/
│   ├── users/
│   ├── settings/
│   └── alerts/
components/
├── charts/          # Recharts components
├── dashboard/
├── map/
└── theme-provider.tsx
```

## Design System

- **Styling**: Tailwind CSS v4 with CSS variables
- **Components**: Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: Dark mode via next-themes

## Guidelines

1. Always run `npm run typecheck` after changes
2. Use existing component patterns from `components/charts/` and `components/dashboard/`
3. Follow the route structure in `app/(shell)/`
4. Keep Recharts usage consistent
