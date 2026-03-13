# Responsive Charts & Dashboard Grid Refactor Plan

## Overview

This document outlines the implementation plan for enhancing dashboard responsiveness across mobile devices, refactoring charts to use fully responsive Recharts variants, and improving the grid system for fluid layouts.

---

## Current Architecture Summary

### Existing Components

**Sidebar** (`components/shell/sidebar.tsx`)
- Already implements responsive behavior via `useIsMobile()` hook
- Desktop: Collapsible sidebar with toggle (w-60 expanded, w-14 collapsed)
- Mobile: Sheet-based slide-out menu with hamburger trigger
- Status: **Complete** - no changes needed

**Dashboard Grid** (`components/dashboard/dashboard-grid.tsx`)
- Uses CSS Grid with fixed 3-column layout: `gridTemplateColumns: 'repeat(3, 1fr)'`
- Fixed row height: `gridAutoRows: 'minmax(220px, auto)'`
- Supports drag-and-drop reordering via `@dnd-kit`
- Status: **Needs responsiveness refactor**

**Chart Block** (`components/dashboard/chart-block.tsx`)
- Supports `colSpan` (1-3) and `rowSpan` (1-2)
- Has resize handle and size cycling menu
- Status: **Needs mobile-aware span limits**

### Existing Chart Components (18 total)

| Component | File | Responsive | Notes |
|-----------|------|------------|-------|
| Line Chart | `line-chart.tsx` | Yes | Uses `ResponsiveContainer`, legend wraps |
| Bar Chart | `bar-chart.tsx` | Partial | Horizontal/vertical variants, fixed margins |
| Area Chart | `area-chart.tsx` | Yes | Uses `ResponsiveContainer` |
| Radial Chart | `radial-chart.tsx` | Partial | Fixed size (w-36 h-36) |
| Radar Chart | `radar-chart.tsx` | Yes | Uses `ResponsiveContainer` |
| Scatter Chart | `scatter-chart.tsx` | Yes | Uses `ResponsiveContainer` |
| Composed Chart | `composed-chart.tsx` | Yes | Uses `ResponsiveContainer` |
| Wind Rose | `wind-rose.tsx` | Partial | Fixed SVG viewBox |
| Gauge Arc | `gauge-arc.tsx` | Partial | Fixed dimensions, documented issues |
| Compass | `compass.tsx` | Partial | Fixed viewBox |
| Timeline Heatmap | `timeline-heatmap.tsx` | Partial | Fixed cell sizes |
| Calendar Heatmap | `calendar-heatmap.tsx` | Partial | Overflow on mobile |
| Bullet Chart | `bullet-chart.tsx` | Yes | Uses `ResponsiveContainer` |
| Spark Bar | `spark-bar.tsx` | Yes | Uses `ResponsiveContainer` |
| Stat Card | `stat-card.tsx` | Yes | Flex-based |
| Local Forecast | `local-forecast.tsx` | Yes | Flex-based |
| Sunrise/Sunset | `sunrise-sunset.tsx` | Partial | SVG-based |
| Moon Phase | `moon-phase.tsx` | Partial | SVG-based |
| Temp/Humidity Bar | `temp-humidity-bar.tsx` | Yes | Uses `ResponsiveContainer` |
| Multi-Temp Bar | `multi-temp-bar.tsx` | Yes | Uses `ResponsiveContainer` |
| Rain Bar | `rain-bar.tsx` | Yes | Uses `ResponsiveContainer` |

---

## Implementation Plan

### Phase 1: Dashboard Grid Responsiveness

**Goal:** Make the grid adapt to screen size with intelligent column reflow.

**Changes to `dashboard-grid.tsx`:**

```tsx
// Before (static)
style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 'minmax(220px, auto)' }}

// After (responsive with Tailwind classes)
className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
style={{ gridAutoRows: 'minmax(180px, auto)' }} // Shorter min for mobile
```

**Responsive Breakpoints:**
| Screen | Columns | Min Row Height |
|--------|---------|----------------|
| < 640px (mobile) | 1 | 160px |
| 640-1023px (tablet) | 2 | 180px |
| >= 1024px (desktop) | 3 | 220px |

**ColSpan Behavior on Smaller Screens:**
- Mobile (1-col): All blocks become `colSpan: 1` (full width)
- Tablet (2-col): `colSpan: 3` becomes `colSpan: 2` (cap at available cols)
- Desktop (3-col): Normal `colSpan` values

**Implementation:**
1. Add `useIsMobile()` and screen width detection
2. Create `getEffectiveColSpan(colSpan, screenCols)` utility
3. Apply dynamic gridColumn style based on effective span
4. Reduce `gridAutoRows` on mobile for better density

---

### Phase 2: Chart-by-Chart Responsiveness Fixes

#### Priority 1: High-Traffic Charts (Overview preset)

**2.1 Gauge Arc** (`gauge-arc.tsx`)
- Issue: Fixed viewBox causes clipping, needle overlaps value
- Fix: Follow plan in `docs/plans/04-gauge-chart-layout-fixes.md`
- Changes:
  - Increase viewBox height: `0 0 200 150`
  - Move center up: `CY = 85`
  - Shorten needle
  - Add responsive max-width with aspect ratio lock
  - Use `className="w-full max-w-[200px] aspect-[4/3]"`

**2.2 Radial Chart** (`radial-chart.tsx`)
- Issue: Fixed dimensions (w-36 h-36)
- Fix: Make container responsive
- Changes:
  ```tsx
  // Before
  <div className="relative w-36 h-36">
  
  // After
  <div className="relative w-full max-w-[144px] aspect-square mx-auto">
  ```

**2.3 Wind Rose** (`wind-rose.tsx`)
- Issue: Fixed SVG dimensions
- Fix: Use viewBox with responsive container
- Ensure legend wraps on narrow containers

**2.4 Timeline Heatmap** (`timeline-heatmap.tsx`)
- Issue: Fixed cell sizes may overflow
- Fix: 
  - Calculate cell size based on container width
  - Add horizontal scroll wrapper for mobile
  - Or reduce day labels to initials on mobile

**2.5 Calendar Heatmap** (`calendar-heatmap.tsx`)
- Issue: 53 weeks × 7 days overflows mobile
- Fix:
  - Add horizontal scroll with momentum
  - Or switch to compact view (3-month rolling) on mobile

#### Priority 2: Category Charts (Fire, Flood, Crime, etc.)

**2.6 Bar Chart** (`bar-chart.tsx`)
- Current: Has horizontal/vertical variants
- Enhancement:
  - Auto-switch to horizontal on narrow containers
  - Reduce label font size on mobile
  - Truncate long category labels with ellipsis

**2.7 Compass** (`compass.tsx`)
- Issue: Fixed viewBox sizing
- Fix: Make responsive like Gauge Arc

#### Priority 3: Weather Station Charts

**2.8 Sunrise/Sunset** (`sunrise-sunset.tsx`)
- Verify SVG scales properly
- Add responsive text sizing

**2.9 Moon Phase** (`moon-phase.tsx`)
- Verify SVG scales properly
- Add responsive text sizing

---

### Phase 3: Archive Existing Charts

**Goal:** Preserve current implementations for reference without breaking existing functionality.

**Approach:** 
1. Create `components/charts/_archive/` directory
2. Copy (not move) current chart files before modifications:
   - `gauge-arc.v1.tsx`
   - `radial-chart.v1.tsx`
   - `wind-rose.v1.tsx`
   - `timeline-heatmap.v1.tsx`
   - `calendar-heatmap.v1.tsx`
3. Add README in archive folder explaining preservation reason

**Archive Index:**
```md
# Archived Chart Components

These are original implementations preserved before the responsive refactor.

| File | Original | Archive Date |
|------|----------|--------------|
| gauge-arc.v1.tsx | gauge-arc.tsx | TBD |
| radial-chart.v1.tsx | radial-chart.tsx | TBD |
| etc. | | |
```

---

### Phase 4: Testing Checklist

**Viewport Testing:**
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1440px+)

**Chart Functionality:**
- [ ] All charts render without overflow
- [ ] Tooltips work on touch devices
- [ ] Legend pills wrap correctly
- [ ] Interactive elements (toggles, hovers) work
- [ ] Drag-and-drop disabled on mobile (or touch-friendly)

**Grid Behavior:**
- [ ] Single column on mobile
- [ ] Two columns on tablet
- [ ] Three columns on desktop
- [ ] ColSpan respects available columns
- [ ] RowSpan works consistently

---

## File Change Summary

| File | Change Type | Priority |
|------|-------------|----------|
| `components/dashboard/dashboard-grid.tsx` | Modify | P1 |
| `components/dashboard/chart-block.tsx` | Modify | P1 |
| `components/charts/gauge-arc.tsx` | Modify | P1 |
| `components/charts/radial-chart.tsx` | Modify | P1 |
| `components/charts/wind-rose.tsx` | Modify | P2 |
| `components/charts/timeline-heatmap.tsx` | Modify | P2 |
| `components/charts/calendar-heatmap.tsx` | Modify | P2 |
| `components/charts/bar-chart.tsx` | Modify | P2 |
| `components/charts/compass.tsx` | Modify | P2 |
| `components/charts/sunrise-sunset.tsx` | Verify | P3 |
| `components/charts/moon-phase.tsx` | Verify | P3 |
| `components/charts/_archive/*` | Create | P3 |

---

## Implementation Order

1. **Dashboard Grid** - Make responsive first (enables testing chart changes)
2. **Chart Block** - Add mobile-aware span limits
3. **Gauge Arc** - High visibility, documented issues
4. **Radial Chart** - Quick fix, similar pattern
5. **Bar Chart** - Auto-orientation enhancement
6. **Timeline Heatmap** - Add scroll wrapper
7. **Calendar Heatmap** - Add scroll wrapper
8. **Wind Rose & Compass** - Similar SVG fixes
9. **Archive creation** - After each major chart is refactored
10. **Testing pass** - Verify all viewports

---

## Notes

- All charts already use `ResponsiveContainer` from Recharts where applicable
- The main issues are with custom SVG charts (gauges, compasses, heatmaps)
- Mobile touch interactions (tooltips, drag) need special attention
- Consider adding `touch-action: pan-y` for charts with horizontal scroll
