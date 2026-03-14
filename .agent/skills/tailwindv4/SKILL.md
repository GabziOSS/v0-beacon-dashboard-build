---
name: tailwindv4
description: Tailwind CSS v4 - Modern features including CSS-first configuration, dynamic values, advanced selectors, and container queries
tags: [tailwind, css, v4, tailwindcss]
---

# Tailwind CSS v4

## Key Differences from v3

- **CSS-first configuration** - No `tailwind.config.js` by default
- **Dynamic values** - Use arbitrary values without arbitrary modifiers
- **Native CSS** - More power directly in CSS
- **Performance** - Faster builds with Rust-based engine

## CSS-First Configuration

### Basic Setup

```css
/* app/globals.css */
@theme {
  /* Colors */
  --color-primary: oklch(70% 0.15 250);
  --color-secondary: oklch(60% 0.15 280);

  /* Typography */
  --font-sans: system-ui, sans-serif;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Border radius */
  --radius-lg: 1rem;

  /* Animations */
  --animate-bounce: bounce 1s infinite;
}

/* Base styles */
@layer base {
  body {
    @apply bg-background text-foreground;
  }
}

/* Component styles */
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground px-4 py-2;
  }
}

/* Utility extensions */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Defining Custom Properties

```css
@theme {
  /* Semantic colors */
  --color-background: oklch(98% 0.02 240);
  --color-foreground: oklch(20% 0.02 265);

  /* Custom breakpoints */
  --breakpoint-3xl: 90rem;

  /* Container queries */
  --container-2xl: 40rem;
}
```

## Dynamic Values

### Arbitrary Values Without Arbitrary Modifier

```html
<!-- v3: Required arbitrary modifier -->
<div class="w-[123px]">...</div>
<div class="top-[calc(100%-1rem)]">...</div>

<!-- v4: Direct values work -->
<div class="w-123">...</div>
/* If defined in theme */
<div class="top-auto">...</div>
/* Native CSS values */
```

### CSS Variables as Values

```html
<div class="w-[--my-width]">...</div>
<div class="bg-[--theme-color]">...</div>
<div class="delay-[var(--delay)]">...</div>
```

### Dynamic Theme References

```html
<!-- Reference theme values dynamically -->
<div class="text-[color:var(--primary)]">...</div>
<div class="grid-cols-[repeat(3,minmax(0,1fr))]">...</div>
```

## Advanced Selectors

### Pseudo-class Variants

```css
/* @variant - custom pseudo variants */
@variant dark (&:where(.dark, .dark *));
@variant unsafe-class (&:where(.unsafe, .unsafe *));

/* Use in HTML */
<div class="dark:bg-red-500">...</div>
```

###has() Variant

```html
<!-- Style based on child content -->
<div class="has-[img]:rounded-lg">...</div>
<div class="has-[a]:text-blue-500">...</div>
<div class="has-[input:checked]:bg-primary">...</div>
```

### where() Selector

```css
/* Base styles that never override */
@layer base {
  h1 {
    @apply text-4xl font-bold;
  }

  /* Use :where() for defaults */
  h1:where(.prose) {
    @apply text-5xl;
  }
}
```

## Container Queries

### Setup

```css
@theme {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
}
```

### Usage

```html
<!-- @container for container queries -->
<div class="@container">
  <div class="@lg:text-2xl @xl:text-3xl">Responsive to parent container</div>
</div>

<!-- Named containers -->
<div class="@container/sidebar">
  <div class="@sidebar/expanded:text-sm @sidebar/collapsed:text-xs">Sidebar content</div>
</div>
```

## Color System

### OKLCH Colors

```css
@theme {
  /* OKLCH for perceptual uniformity */
  --color-vibrant: oklch(70% 0.15 250);
  --color-muted: oklch(70% 0.1 250 / 0.5);

  /* With opacity */
  --color-overlay: oklch(0% 0 0 / 0.5);
}
```

### Color Mixing

```css
/* Use color() function directly */
.bg-blend {
  background-color: color-mix(in oklch, var(--primary) 80%, white);
}

/* Opacity in colors */
.opacity-example {
  background-color: oklch(70% 0.15 250 / 0.5);
}
```

### Gradient Improvements

```css
.bg-gradient {
  background: linear-gradient(in oklch, oklch(80% 0.1 250), oklch(60% 0.15 280));
}
```

## Typography

### Text Wrap Utilities

```html
<!-- New in v4 -->
<p class="text-wrap">...</p>
/* Default */
<p class="text-nowrap">...</p>
/* No wrap */
<p class="text-balance">...</p>
/* Balance text */
<p class="text-pretty">...</p>
/* Pretty print */
```

### Leading and Tracking

```css
@theme {
  /* Custom line heights */
  --leading-loose: 2;
  --leading-12: 3;

  /* Custom letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-widest: 0.25em;
}
```

## Layout

### Size Utilities

```css
@theme {
  /* Custom sizes */
  --size-18: 4.5rem;
  --size-88: 22rem;
  --size-128: 32rem;
}
```

### Aspect Ratio

```css
@theme {
  --aspect-video: 16 / 9;
}

.video-container {
  aspect-ratio: var(--aspect-video);
}
```

## Performance

### Content Detection

```css
/* Explicit content paths */
@source "./app/**/*.{js,ts,jsx,tsx}";
@source "./components/**/*.{js,ts,jsx,tsx}";

/* Exclude paths */
@source "../node_modules/**/*" {
  none: true;
}
```

### Layer Organization

```css
/* Organize by layer */
@layer base { ... }
@layer components { ... }
@layer utilities { ... }
@layer shortcuts { ... }

/* Shortcuts for common patterns */
@layer shortcuts {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium;
  }
}
```

## Migration from v3

### Config to CSS

```javascript
// tailwind.config.js (v3)
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '...',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
}
```

```css
/* globals.css (v4) */
@theme {
  --color-primary: ...;
  --spacing-128: 32rem;
}
```

### Plugin Migration

```css
/* v3 plugin */
module.exports = function({ addUtilities }) {
  addUtilities({
    '.glass': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    }
  })
}
```

```css
/* v4 - direct in CSS */
@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
}
```

## Best Practices

1. **Use CSS variables** - Define theme in `@theme` block
2. **Leverage native CSS** - Use `color-mix()`, `oklch()` directly
3. **Container queries** - For component-level responsiveness
4. **has() variant** - Style based on children
5. **text-wrap** - Use `balance` and `pretty` for typography

## Gotchas

1. **Browser support** - OKLCH needs modern browsers
2. **Config migration** - Requires moving to CSS-first
3. **Plugin compatibility** - Some v3 plugins need updates
4. **Arbitrary values** - Syntax may differ from v3
5. **Content detection** - May need explicit `@source` directives

---

## Adherence Checklist

- [ ] Theme defined in CSS, not JS config
- [ ] Use @theme block for custom values
- [ ] Leverage OKLCH for colors
- [ ] Use container queries for components
- [ ] Leverage has() for child-based styling
- [ ] Use text-wrap utilities for typography
