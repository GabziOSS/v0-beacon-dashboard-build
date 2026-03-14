---
name: tailwind-design-system
description: Beacon Dashboard's design system - 8 OKLCH themes × 3 modes (dark/soft/light) with semantic tokens and chart colors
tags: [tailwind, design-system, themes, oklch, tokens]
---

# Beacon Dashboard Design System

## Overview

The Beacon Dashboard uses a sophisticated theming system with **8 themes** across **3 color modes** (dark, soft, light), all powered by OKLCH color space for perceptually uniform colors.

## Theme Architecture

### File Locations

- **Theme definitions**: `lib/theme.ts`
- **CSS variables**: `app/globals.css`
- **Theme provider**: `components/theme-provider.tsx`

### Available Themes

```
Themes (8):
├── default    (blue)    - Primary Calbayog theme
├── emerald    (green)   - Infrastructure
├── amber      (orange)  - Warning/attention
├── rose       (red)     - Alerts/emergency
├── violet     (purple)  - Crime
├── cyan       (cyan)    - Weather
├── slate      (gray)    - Professional
└── ocean      (teal)    - Medical

Modes (3):
├── dark       - Full dark mode
├── soft       - Subtle, low contrast dark
└── light      - Full light mode
```

### Theme Structure

```typescript
// lib/theme.ts
export const themes = {
  default: {
    dark: {
      /* ... */
    },
    soft: {
      /* ... */
    },
    light: {
      /* ... */
    },
  },
  emerald: {
    /* ... */
  },
  // ... all 8 themes
}
```

## CSS Variables

### Core Tokens

```css
/* Background layers */
--background        /* Page background */
--foreground        /* Primary text */
--card             /* Card background */
--card-foreground  /* Card text */

/* Interactive */
--primary          /* Main brand color */
--primary-foreground /* Text on primary */
--secondary        /* Secondary actions */
--muted            /* Subtle backgrounds */
--accent           /* Highlights */

/* Semantic */
--destructive      /* Delete/danger actions */
--success          /* Positive actions */
--warning          /* Caution states */

/* Borders & rings */
--border
--ring
--input
--radius
```

### Sidebar Tokens

```css
--sidebar-background
--sidebar-foreground
--sidebar-primary
--sidebar-primary-foreground
--sidebar-accent
--sidebar-accent-foreground
--sidebar-border
```

### Chart Colors

```css
/* 5-chart palette - use for all Recharts */
--chart-1  /* Primary data */
--chart-2  /* Secondary data */
--chart-3  /* Tertiary data */
--chart-4  /* Quaternary */
--chart-5  /* Quinary */

/* Domain-specific chart colors */
--chart-rain       /* Rainfall data */
--chart-temp       /* Temperature */
--chart-wind       /* Wind speed */
--chart-pressure   /* Barometric pressure */
--chart-humidity   /* Humidity levels */
```

## Usage in Components

### Tailwind Classes

```tsx
// Backgrounds
<div className="bg-background">...</div>
<div className="bg-card">...</div>
<div className="bg-muted">...</div>

// Text
<p className="text-foreground">...</p>
<p className="text-muted-foreground">...</p>

// Interactive
<button className="bg-primary text-primary-foreground">...</button>
<button className="bg-secondary">...</button>
<button className="bg-accent">...</button>

// Borders
<div className="border-border">...</div>
<div className="rounded-[var(--radius)]">...</div>
```

### Recharts Colors

```tsx
// Import theme tokens (run on client)
import { useTheme } from 'next-themes'

function ChartComponent() {
  const { theme } = useTheme()

  const colors = {
    primary: 'hsl(var(--chart-1))',
    secondary: 'hsl(var(--chart-2))',
    // ...
  }

  return (
    <AreaChart data={data}>
      <Area fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" />
    </AreaChart>
  )
}
```

### Direct CSS Variable Usage

```tsx
// Using CSS variables directly
<div style={{
  backgroundColor: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))'
}}>
  Content
</div>

// With opacity
<div style={{
  backgroundColor: 'hsl(var(--primary) / 0.1)'
}}>
  Subtle primary
</div>
```

## OKLCH Color System

### Why OKLCH?

- **Perceptually uniform** - Equal changes in values = equal perceived changes
- **Gamut** - Can express more vibrant colors than sRGB
- **HDR-ready** - Works with modern displays
- **Interpolation** - Smooth color transitions

### Converting Colors

```css
/* CSS native (modern browsers) */
--color-primary: oklch(70% 0.15 250);

/* Or use color() function */
--color-primary: color(display-p3 0.5 0.5 0.8);
```

### Tailwind Configuration

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ...
    }
  }
}
```

## Dark/Soft/Light Modes

### Dark Mode

- Full contrast dark background
- Light text on dark
- Saturated accent colors
- High contrast borders

### Soft Mode

- Reduced contrast dark background
- Muted colors
- Easier on eyes for extended use
- Subtle borders

### Light Mode

- White/light gray backgrounds
- Dark text
- Standard contrast
- Traditional appearance

## Theme Switching

### Implementation

```tsx
// Using next-themes
import { ThemeProvider } from 'components/theme-provider'

;<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  themes={['default', 'emerald', 'amber', 'rose', 'violet', 'cyan', 'slate', 'ocean']}
>
  {children}
</ThemeProvider>
```

### Per-Theme Styling

```tsx
// Theme-aware component
function ThemedComponent() {
  const { theme } = useTheme() // 'default' | 'emerald' | ...
  const { themeMode } = useTheme() // 'dark' | 'soft' | 'light'

  return (
    <div data-theme={theme} data-theme-mode={themeMode}>
      {/* Content adapts automatically via CSS variables */}
    </div>
  )
}
```

## Chart Color Usage

### Theme-Aware Charts

```tsx
// lib/theme-chart-colors.ts
export function getChartColors(theme: string) {
  const themeConfig = themes[theme as keyof typeof themes]

  return {
    temperature: themeConfig.colors.chart.temp,
    rainfall: themeConfig.colors.chart.rain,
    humidity: themeConfig.colors.chart.humidity,
    wind: themeConfig.colors.chart.wind,
    pressure: themeConfig.colors.chart.pressure,
  }
}

// Usage in chart component
function WeatherChart() {
  const { theme } = useTheme()
  const colors = getChartColors(theme)

  return (
    <LineChart>
      <Line type="monotone" dataKey="temp" stroke={colors.temperature} />
    </LineChart>
  )
}
```

## Design Tokens

### Spacing Scale

```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
```

### Typography

```css
--font-sans: system-ui, sans-serif;
--font-mono: ui-monospace, monospace;

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

### Border Radius

```css
--radius-sm: 0.125rem;
--radius-base: 0.25rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
--radius-2xl: 1rem;
```

## Best Practices

1. **Always use CSS variables** - Never hardcode colors
2. **Use semantic tokens** - Prefer `bg-primary` over specific colors
3. **Chart colors** - Use `--chart-*` variables for data visualization
4. **Test all themes** - Verify readability across all 24 combinations
5. **Consider contrast** - Ensure WCAG compliance in all modes
6. **Soft mode** - Default to soft for dashboards (easier on eyes)

## Gotchas

1. **OKLCH browser support** - Use fallback for older browsers
2. **Opacity** - Use `/` syntax: `hsl(var(--primary) / 0.5)`
3. **Shadows** - May need theme-specific shadows
4. **Images** - Check contrast with overlays
5. **Gradients** - Test in all themes

---

## Adherence Checklist

- [ ] All colors use CSS variables
- [ ] Charts use --chart-\* variables
- [ ] Tested in all 24 theme/mode combinations
- [ ] WCAG contrast compliance
- [ ] Soft mode is default for dashboards
- [ ] No hardcoded theme colors
