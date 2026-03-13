# NX Monorepo Routing Guide

> **Agent Navigation Map** — This codemap helps OpenCode, v0, and other agents quickly locate relevant code blocks when this Next.js dashboard app is imported into a larger NX monorepo.

---

## Quick Lookup Table

| Need to find...       | File(s)                              | NX Path Hint                   |
| --------------------- | ------------------------------------ | ------------------------------ |
| **Page routes**       | `app/*/page.tsx`, `app/*/layout.tsx` | `@v0-beacon/dashboard:routes`  |
| **UI components**     | `components/ui/*.tsx`                | `@v0-beacon/ui:components`     |
| **Chart components**  | `components/charts/*.tsx`            | `@v0-beacon/dashboard:charts`  |
| **Dashboard widgets** | `components/dashboard/*.tsx`         | `@v0-beacon/dashboard:widgets` |
| **Map components**    | `components/map/*.tsx`               | `@v0-beacon/dashboard:map`     |
| **Shell/Layout**      | `components/shell/*.tsx`             | `@v0-beacon/shell:components`  |
| **Auth logic**        | `lib/auth.tsx`                       | `@v0-beacon/shared:auth`       |
| **Theme system**      | `lib/theme.ts`                       | `@v0-beacon/shared:theme`      |
| **Data types**        | `lib/types.ts`                       | `@v0-beacon/shared:types`      |
| **Data hooks**        | `lib/hooks.ts`                       | `@v0-beacon/dashboard:data`    |
| **Presets**           | `lib/presets.ts`                     | `@v0-beacon/dashboard:presets` |
| **Utils**             | `lib/utils.ts`                       | `@v0-beacon/shared:utils`      |
| **Toast hook**        | `hooks/use-toast.ts`                 | `@v0-beacon/shared:toast`      |
| **Mobile hook**       | `hooks/use-mobile.ts`                | `@v0-beacon/shared:responsive` |

---

## Suggested NX Project Structure

When importing into a monorepo, consider organizing as:

```
apps/
  └── v0-beacon-dashboard/          # This Next.js app

libs/
  ├── ui/                          # components/ui → @v0-beacon/ui
  ├── shared/
  │   ├── auth/                    # lib/auth.tsx → @v0-beacon/auth
  │   ├── theme/                   # lib/theme.ts → @v0-beacon/theme
  │   ├── types/                   # lib/types.ts → @v0-beacon/types
  │   ├── utils/                   # lib/utils.ts → @v0-beacon/utils
  │   ├── toast/                   # hooks/use-toast.ts → @v0-beacon/toast
  │   └── responsive/              # hooks/use-mobile.ts → @v0-beacon/responsive
  └── dashboard/
      ├── components/
      │   ├── charts/             # components/charts → @v0-beacon/dashboard-charts
      │   ├── map/                 # components/map → @v0-beacon/dashboard-map
      │   └── widgets/             # components/dashboard → @v0-beacon/dashboard-widgets
      ├── data/                    # lib/hooks.ts → @v0-beacon/dashboard-data
      └── presets/                 # lib/presets.ts → @v0-beacon/dashboard-presets
```

---

## Common Agent Tasks

### Adding a new dashboard page

1. **Create route**: `app/(shell)/dashboard/{name}/page.tsx`
2. **Find widgets**: Use `components/dashboard/` for grid/layout
3. **Find charts**: Use `components/charts/` for visualizations
4. **Get data**: Use hooks from `lib/hooks.ts`

### Adding a new UI component

1. **Base components**: `components/ui/` — extend Radix primitives
2. **Styling**: Uses Tailwind via `lib/utils.ts` (cn function)
3. **Theming**: Import from `lib/theme.ts`

### Modifying auth flow

- **Entry point**: `lib/auth.tsx` — `AuthProvider`, `useAuth`
- **Usage**: Wrap app in `app/layout.tsx`

### Modifying theme

- **Theme definitions**: `lib/theme.ts` — `THEME`, `ENABLED_THEMES`
- **Apply logic**: `applyTheme()`, `initTheme()`
- **CSS variables**: `app/globals.css`

---

## Import Patterns (Current → Suggested NX)

```typescript
// CURRENT (relative imports)
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { THEME } from '@/lib/theme'

// SUGGESTED NX (package imports)
import { cn } from '@v0-beacon/shared/utils'
import { useAuth } from '@v0-beacon/shared/auth'
import { THEME } from '@v0-beacon/shared/theme'
```

---

## Key Files for Agent Context

| Agent Need                  | Read First                         |
| --------------------------- | ---------------------------------- |
| Understanding app structure | `codemap.md` (root)                |
| Working on pages            | `app/(shell)/dashboard/codemap.md` |
| Working on UI library       | `components/ui/codemap.md`         |
| Working on charts           | `components/charts/codemap.md`     |
| Data/hooks reference        | `lib/codemap.md`                   |
| Custom hooks reference      | `hooks/codemap.md`                 |

---

## Tech Stack Markers

These files contain version/dependency hints for agents:

- `package.json` — Dependencies, scripts
- `next.config.mjs` — Next.js config
- `sst.config.ts` — SST deployment config
- `app/globals.css` — Tailwind + CSS variables
- `lib/theme.ts` — Theme mode definitions
