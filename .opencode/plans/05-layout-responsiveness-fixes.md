# Layout Responsiveness Fixes

## Problem Summary

Two main responsiveness issues affecting the application layout:

1. **Topbar timer positioning** - Uses `absolute` positioning that can overlap breadcrumb/actions at narrow widths
2. **Sidebar scroll area** - Navigation can overflow or be inaccessible on shorter viewports

## Current Implementation Analysis

### Topbar (`components/shell/topbar.tsx`)

```tsx
// Current structure
<header className="h-14 flex items-center px-4 ...">
  {/* Breadcrumb - flex-1 */}
  <nav className="flex items-center gap-1.5 min-w-0 flex-1">

  {/* Timer - absolute center */}
  <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">

  {/* Actions - ml-auto */}
  <div className="flex items-center gap-2 ml-auto">
```

**Issues:**
- Absolute positioning ignores content flow
- Timer can overlap breadcrumb on narrow screens
- No responsive breakpoint handling
- City label adds extra height not accounted for

### Sidebar (`components/shell/sidebar.tsx`)

```tsx
// Current structure
<aside className="... w-14/w-60 ...">
  {/* Logo - h-14, shrink-0 */}
  {/* Nav - flex-1, no overflow handling */}
  <nav className="flex-1 py-3 px-1.5 flex flex-col gap-0.5">
  {/* User chip + sign out - at bottom */}
```

**Issues:**
- No `overflow-y-auto` on nav section
- On short screens, bottom user section can push nav items off-screen
- No min-height constraint on scrollable area

## Proposed Fixes

### Topbar Fix

**Option A: Responsive Hide/Show (Recommended)**
- Hide timer on small screens (`hidden md:flex`)
- Show breadcrumb only on mobile
- Use flexbox order instead of absolute positioning

**Option B: Priority-based Layout**
- Use CSS container queries
- Timer shrinks/hides based on available space

```tsx
// Recommended implementation
<header className="h-14 flex items-center px-4 gap-4 ...">
  {/* Breadcrumb - truncate on small */}
  <nav className="flex items-center gap-1.5 min-w-0 flex-1 md:flex-none">
    ...
  </nav>

  {/* Timer - centered with flex, hidden on mobile */}
  <div className="hidden md:flex flex-1 justify-center">
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium ...">
        {time}
      </span>
      <span className="text-[10px] ... hidden lg:block">
        Calbayog City
      </span>
    </div>
  </div>

  {/* Actions - always visible */}
  <div className="flex items-center gap-2">
    ...
  </div>
</header>
```

### Sidebar Fix

```tsx
// Add overflow scroll to nav
<nav className="flex-1 py-3 px-1.5 flex flex-col gap-0.5 overflow-y-auto min-h-0">
  {NAV_ITEMS.map(...)}
</nav>

// Ensure bottom section doesn't grow
<div className="px-1.5 pb-3 border-t border-sidebar-border pt-3 space-y-2 shrink-0">
```

## Implementation Steps

### Topbar
1. [ ] Remove absolute positioning from timer
2. [ ] Use 3-column flex layout: breadcrumb | timer | actions
3. [ ] Add `hidden md:flex` to timer for mobile
4. [ ] Hide city label on smaller screens: `hidden lg:block`
5. [ ] Test breadcrumb truncation

### Sidebar
1. [ ] Add `overflow-y-auto` to nav section
2. [ ] Add `min-h-0` to nav (flex child scroll fix)
3. [ ] Ensure `shrink-0` on logo and user sections
4. [ ] Test with many nav items / short viewport
5. [ ] Ensure scroll works in collapsed state

## Code Changes

### Topbar

```tsx
// components/shell/topbar.tsx
<header className="h-14 flex items-center px-4 gap-4 border-b border-border bg-card shrink-0 z-10">
  {/* Breadcrumb */}
  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
    {crumbs.map((crumb, i) => (...))}
  </nav>

  {/* Live clock — center (hidden on mobile) */}
  <div className="hidden md:flex flex-1 justify-center">
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium text-foreground font-mono tabular-nums tracking-wider">
        {time}
      </span>
      <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase leading-none hidden lg:block">
        Calbayog City
      </span>
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-2 ml-auto md:ml-0">
    ...
  </div>
</header>
```

### Sidebar

```tsx
// components/shell/sidebar.tsx - nav section
<nav className="flex-1 py-3 px-1.5 flex flex-col gap-0.5 overflow-y-auto min-h-0" aria-label="Main navigation">
  {NAV_ITEMS.map(...)}
</nav>
```

## Testing Checklist

### Topbar
- [ ] Timer hidden on mobile (< 768px)
- [ ] Timer visible and centered on tablet+
- [ ] City label hidden on medium, visible on large
- [ ] Breadcrumb truncates without overflow
- [ ] Actions always accessible
- [ ] No horizontal overflow at any width

### Sidebar
- [ ] Nav scrolls when items exceed viewport height
- [ ] User section stays pinned at bottom
- [ ] Scroll works in collapsed state
- [ ] Logo section stays fixed at top
- [ ] Works with browser zoom levels

## Related Files

- `components/shell/topbar.tsx`
- `components/shell/sidebar.tsx`
- `app/(shell)/layout.tsx` - Shell container
- `app/(shell)/dashboard/layout.tsx` - Dashboard nested layout
