# Beacon Dashboard - Agent Instructions

## Project Overview

- **Type**: Next.js 16 Web Application (App Router)
- **Purpose**: Multi-dashboard civic/beacon monitoring system displaying weather, infrastructure, medical, fire, flood, crime, and incident data
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI, Recharts, SST (serverless)

## Key Commands

```bash
npm run dev          # Development server
npm run build       # Production build
npm run lint        # ESLint fix
npm run typecheck   # TypeScript check
```

## Project Structure

```
app/
├── (auth)/          # Auth routes: login, forgot-password
│   └── login/page.tsx
├── (shell)/         # Main app routes
│   ├── page.tsx           # Root redirect
│   ├── layout.tsx         # App shell with sidebar
│   ├── dashboard/         # Dashboard pages
│   │   ├── overview/
│   │   ├── weather/
│   │   ├── station/
│   │   ├── table/
│   │   ├── medical/
│   │   ├── infrastructure/
│   │   ├── flood/
│   │   ├── crime/
│   │   └── fire/
│   ├── map/
│   ├── users/
│   ├── settings/
│   └── alerts/
components/
├── charts/         # Recharts components (line-chart, gauge-arc, wind-rose, etc.)
├── dashboard/      # Dashboard-specific components
├── map/            # Map components
└── theme-provider.tsx
```

## Design System

- **Styling**: Tailwind CSS v4 with CSS variables
- **Components**: Radix UI primitives + custom components
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: Dark mode via next-themes

## Available Skills (linked in .agent/skills/)

- `@nextjs` - Next.js patterns
- `@advanced-typescript` - TypeScript best practices
- `@tailwind-design-system` - Tailwind design system
- `@tailwind-patterns` - Tailwind patterns
- `@tailwindv4` - Tailwind v4

## Agent Guidelines

1. Always run `npm run typecheck` after making changes
2. Use existing component patterns from `components/charts/` and `components/dashboard/`
3. Follow the route structure in `app/(shell)/`
4. Keep Recharts usage consistent with existing chart components
5. Use Radix UI primitives for new interactive components
