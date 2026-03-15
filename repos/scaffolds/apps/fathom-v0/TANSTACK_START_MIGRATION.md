# TanStack Start Migration Guide

This document provides instructions for migrating CivicPulse from Next.js App Router to TanStack Start (Vite + TanStack Router).

## Overview

The current implementation uses Next.js App Router but was designed with TanStack Start compatibility in mind. The core business logic (Jotai atoms, components, charts, mock data) is framework-agnostic and will transfer directly.

## What Transfers Directly (No Changes Needed)

### 1. Jotai Atoms (`lib/atoms/`)
All atom files work identically in TanStack Start:
- `theme.ts` - Theme state with `atomWithStorage`
- `ui.ts` - UI state (sidebar, view mode) with `atomWithStorage`
- `dashboard.ts` - Chart blocks, grid configuration
- `auth.ts` - Authentication state

### 2. Components (`components/`)
All React components transfer directly:
- `components/dashboard/*` - Chart grid, blocks, metric cards
- `components/layout/*` - Sidebar, header
- `components/ui/*` - shadcn/ui components (already framework-agnostic)

### 3. Types (`lib/types/`)
TypeScript types are framework-agnostic.

### 4. Mock Data (`lib/mock-data.ts`)
Data generators work in any framework.

---

## Migration Steps

### Step 1: Initialize TanStack Start Project

```bash
# Create new project
pnpm create @tanstack/start my-app --template file-router
cd my-app

# Install dependencies
pnpm add jotai recharts maplibre-gl react-map-gl @dnd-kit/core @dnd-kit/sortable @tanstack/react-table
pnpm add -D tailwindcss @tailwindcss/vite
```

### Step 2: Copy Framework-Agnostic Files

```bash
# Copy these directories/files directly:
cp -r old-project/lib/atoms/ new-project/src/lib/atoms/
cp -r old-project/lib/types/ new-project/src/lib/types/
cp -r old-project/lib/mock-data.ts new-project/src/lib/
cp -r old-project/components/dashboard/ new-project/src/components/dashboard/
cp -r old-project/components/layout/ new-project/src/components/layout/
cp -r old-project/components/ui/ new-project/src/components/ui/
```

### Step 3: Update Import Paths

Replace `@/` alias with your TanStack Start alias (typically `~/` or configure in vite.config.ts):

```typescript
// Before (Next.js)
import { Button } from '@/components/ui/button'

// After (TanStack Start)
import { Button } from '~/components/ui/button'
```

### Step 4: Convert Route Files

#### Next.js App Router → TanStack Router

**Before (`app/dashboard/page.tsx`):**
```tsx
export default function DashboardPage() {
  return <Dashboard />
}
```

**After (`routes/dashboard.tsx`):**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <Dashboard />
}
```

### Step 5: Convert Layout Files

**Before (`app/dashboard/layout.tsx`):**
```tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
```

**After (`routes/dashboard.tsx` with outlet):**
```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

### Step 6: Convert Auth Guard to TanStack Router beforeLoad

**Before (Next.js AuthGuard component):**
```tsx
// components/auth/auth-guard.tsx
export function AuthGuard({ children }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  if (!isAuthenticated) redirect('/login')
  return children
}
```

**After (TanStack Router beforeLoad):**
```tsx
// routes/__root.tsx
import { createRootRouteWithContext } from '@tanstack/react-router'

interface RouterContext {
  auth: {
    isAuthenticated: boolean
  }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context, location }) => {
    const publicRoutes = ['/login']
    if (!context.auth.isAuthenticated && !publicRoutes.includes(location.pathname)) {
      throw redirect({ to: '/login' })
    }
  },
  component: RootComponent,
})
```

### Step 7: Setup Jotai Provider

**`src/main.tsx`:**
```tsx
import { Provider as JotaiProvider } from 'jotai'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

function App() {
  return (
    <JotaiProvider>
      <RouterProvider router={router} />
    </JotaiProvider>
  )
}
```

### Step 8: Update Navigation

**Before (Next.js Link):**
```tsx
import Link from 'next/link'
<Link href="/dashboard">Dashboard</Link>
```

**After (TanStack Router Link):**
```tsx
import { Link } from '@tanstack/react-router'
<Link to="/dashboard">Dashboard</Link>
```

### Step 9: Update `useRouter` calls

**Before (Next.js):**
```tsx
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard')
```

**After (TanStack Router):**
```tsx
import { useNavigate } from '@tanstack/react-router'
const navigate = useNavigate()
navigate({ to: '/dashboard' })
```

---

## Route Structure Mapping

| Next.js App Router | TanStack Router File |
|-------------------|---------------------|
| `app/page.tsx` | `routes/index.tsx` |
| `app/dashboard/page.tsx` | `routes/dashboard/index.tsx` |
| `app/dashboard/layout.tsx` | `routes/dashboard.tsx` (parent route) |
| `app/dashboard/table/page.tsx` | `routes/dashboard/table.tsx` |
| `app/dashboard/map/page.tsx` | `routes/dashboard/map.tsx` |
| `app/dashboard/users/page.tsx` | `routes/dashboard/users.tsx` |
| `app/login/page.tsx` | `routes/login.tsx` |

---

## Component Changes Required

### Remove 'use client' Directives
TanStack Start doesn't use RSC by default, so remove all `'use client'` directives.

### Update Image Components
Replace Next.js `<Image>` with standard `<img>` or a Vite-compatible image component.

### Update Font Loading
Replace `next/font/google` with direct Google Fonts link in `index.html` or use `@fontsource/*` packages.

---

## NX Monorepo Setup (Optional)

If setting up as an NX monorepo per the original spec:

```bash
npx create-nx-workspace@latest civicpulse --preset=ts
cd civicpulse

# Add apps
nx g @nx/vite:app web
nx g @nx/react:lib ui
nx g @nx/js:lib data-mock

# Structure:
# apps/web/          - TanStack Start app
# libs/ui/           - Shared components
# libs/data-mock/    - Mock data generators
```

---

## Environment Variables

Rename environment variables:
- `NEXT_PUBLIC_*` → `VITE_*`

Example:
```bash
# Before
NEXT_PUBLIC_SKIP_AUTH=true

# After
VITE_SKIP_AUTH=true
```

Access in code:
```typescript
// Before
process.env.NEXT_PUBLIC_SKIP_AUTH

// After
import.meta.env.VITE_SKIP_AUTH
```

---

## Testing the Migration

1. Run the TanStack Start dev server: `pnpm dev`
2. Verify theme switching persists across refresh
3. Verify sidebar collapse persists across refresh
4. Test all chart types render correctly
5. Test drag/drop in the chart grid
6. Test data table filtering and sorting
7. Test map view with markers

---

## Known Differences

| Feature | Next.js | TanStack Start |
|---------|---------|----------------|
| SSR | Built-in | Optional (vinxi) |
| File routing | `app/` directory | `routes/` directory |
| Layouts | `layout.tsx` | Parent routes + `<Outlet />` |
| Metadata | `export const metadata` | `<Head>` component or helmet |
| API routes | `app/api/*/route.ts` | Server functions or separate API |
| Image optimization | `next/image` | Manual or plugins |

---

## Resources

- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [Jotai Docs](https://jotai.org)
- [Vite Docs](https://vite.dev)
