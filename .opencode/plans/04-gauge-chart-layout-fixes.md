# Gauge Chart Layout Fixes

## Problem Summary

The City Risk Score gauge chart and derived gauges (Wind Speed, Humidity, THW Index) have visual issues:

1. **Needle overlaps value text** - The needle rotates through the center where the value is displayed
2. **Numbers appearing out of bounds** - SVG viewBox constraints causing clipping
3. **Poor responsiveness** - Fixed dimensions don't adapt well to container sizes

## Current Implementation Analysis

**File:** `components/charts/gauge-arc.tsx`

```tsx
// Current constants
const CX = 100      // Center X
const CY = 110      // Center Y - offset down
const R = 80        // Radius
// viewBox="0 0 200 120" - tight vertical bounds
```

### Issues Identified:

1. **ViewBox too tight:** `viewBox="0 0 200 120"` only allows 10px below center (CY=110), but value text at `y={CY + 14}` = 124px is outside bounds
2. **Needle overlaps text:** Needle extends to `CY - R + 12` = 42px, then rotates 180 degrees through center where text sits
3. **No padding for labels:** The external label span relies on flex gap but SVG has no internal margin

## Proposed Fix

### Solution A: Adjust ViewBox and Layout (Recommended)

```tsx
// New constants
const CX = 100
const CY = 90       // Move center up
const R = 70        // Slightly smaller radius
// viewBox="0 0 200 140" - more vertical space

// Move value text below the arc
<text x={CX} y={CY + 40} ... />

// Shorten needle to not reach center
<line x1={CX} y1={CY} x2={CX} y2={CY - R + 20} ... />
```

### Solution B: Split Value Display (Alternative)

- Move value outside SVG into a separate div
- Use absolute positioning for overlay

## Implementation Steps

1. [ ] Increase viewBox height: `0 0 200 150`
2. [ ] Move center point up: `CY = 85`
3. [ ] Adjust radius: `R = 70`
4. [ ] Reposition value text: `y = CY + 45` (below arc baseline)
5. [ ] Shorten needle: ends at `CY - R + 18`
6. [ ] Add min-height to container: `min-h-[140px]`
7. [ ] Test at various container sizes (1x1, 2x1, dashboard blocks)

## Code Changes

```tsx
// gauge-arc.tsx - Updated constants
const CX = 100
const CY = 85
const R = 70
const STROKE_W = 12

// Updated viewBox
<svg viewBox="0 0 200 150" className="w-full max-w-[220px]" ...>

// Updated needle (shorter, doesn't overlap text area)
<line
  x1={CX}
  y1={CY}
  x2={CX}
  y2={CY - R + 18}  // Shorter needle
  ...
/>

// Updated value position (below arc)
<text
  x={CX}
  y={CY + 45}
  textAnchor="middle"
  ...
>

// Updated container
<div className="flex flex-col items-center h-full justify-center gap-2 min-h-[140px]">
```

## Testing Checklist

- [ ] City Risk Score gauge renders value without clipping
- [ ] Needle doesn't overlap value text at any angle (0-100%)
- [ ] Wind Speed gauge (small values like 7 km/h) displays correctly
- [ ] Humidity gauge (high values like 88%) displays correctly
- [ ] THW Index gauge displays correctly
- [ ] Responsive at mobile widths
- [ ] Responsive in collapsed sidebar state
- [ ] Works in weather_station preset blocks

## Related Files

- `components/charts/gauge-arc.tsx` - Main component
- `components/dashboard/dashboard-grid.tsx` - Usage in grid
- `lib/presets.ts` - Block definitions
