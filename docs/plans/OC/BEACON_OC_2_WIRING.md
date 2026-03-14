# Beacon — opencode Prompt 2: Chart Wiring + DnD Logic

Prerequisites:
- opencode Prompt 1 complete: `lib/mock-data/` exports all constants
- v0 Sessions 1–3 complete: all chart components and grid exist

Read the full codebase before starting. Understand what hooks
currently return, what data shapes charts expect, and what the
blocks reducer currently does.

---

## Goal

Replace all hardcoded inline data in chart components and hooks
with imports from `lib/mock-data/`. Wire the blocks reducer fully.
Wire preset loading and persistence. Wire the chart color system
so theme switching recolors all charts.

This prompt is logic and wiring only — do not change visual markup.

---

## Part 1 — Data Hook Layer

Create `lib/hooks/use-chart-data.ts`.
Every chart component must get its data through a hook, never
by importing from mock-data directly.

```typescript
// lib/hooks/use-chart-data.ts
import { useMemo } from "react"
import { DATA_REGISTRY } from "@/lib/mock-data"
import type { ChartBlock } from "@/lib/dashboard-blocks"

export function useChartData(block: ChartBlock): unknown {
  return useMemo(
    () => DATA_REGISTRY[block.dataKey] ?? null,
    [block.dataKey]
  )
}
```

For charts that are time-range sensitive (line, area, composed,
calendar-heat), add a `useFilteredChartData` hook that accepts
the active time range and filters accordingly:

```typescript
export function useFilteredChartData(
  block: ChartBlock,
  timeRange: "24h" | "7d" | "30d" | "90d" | "1y"
): unknown
```

Wire `useFilteredChartData` into:
- `LineChart` (incident trend — filters TrendPoint[] by date)
- `AreaChart` (response trend — filters ResponseTrendPoint[])
- `ComposedChart` (incidents vs deployed — same as area)

All other chart types use `useChartData` directly.

### Weather data keys — DATA_REGISTRY only, no live hook

Weather dataKeys (`weather_wind_speed`, `weather_thw_index`,
`weather_wind_dir`, `weather_barometer`, `weather_temp_trend`,
`weather_temp_grouped`, `weather_humidity`, `weather_rain_bullet`,
`weather_rain_calendar`, `weather_current_rain`, `weather_sunrise`,
`weather_moon`, `weather_forecast`, `weather_wind_rose`) must all
resolve in `DATA_REGISTRY` from `lib/mock-data`.

Do NOT create a `useCurrentConditions` hook or any live-fetch
hook for weather data in this session. Weather chart components
should use `useChartData` against the registry exactly like
incident charts do. The live Effect/Hono/WeatherLink integration
will replace these registry reads in a subsequent manual session.

Leave a clearly marked stub comment in each weather chart component:

```typescript
// TODO(live-weather): replace useChartData with useCurrentConditions
// from lib/hooks/use-weather-live.ts once Effect/Hono layer is wired.
// See: lib/weatherlink/ for the live integration.
```

---

## Part 2 — Chart Color System

Create `lib/chart-colors.ts`.

```typescript
// All values reference CSS variables so theme switching recolors
// all charts automatically. Never hardcode oklch or hex here.

export const INCIDENT_COLORS: Record<string, string> = {
  fire:           "oklch(var(--destructive))",
  flood:          "oklch(var(--primary))",
  crime:          "oklch(var(--accent))",
  medical:        "oklch(65% 0.18 145)",   // success-adjacent green
  infrastructure: "oklch(65% 0.18 295)",   // violet
  weather:        "oklch(72% 0.15 212)",   // ice blue
}

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "oklch(var(--destructive))",
  high:     "oklch(var(--accent))",
  medium:   "oklch(var(--primary))",
  low:      "oklch(var(--success))",
}

export const CHART_DEFAULTS = {
  grid: {
    strokeDasharray: "3 3",
    stroke: "oklch(var(--border))",
    opacity: 0.4,
  },
  axis: {
    tick: { fill: "oklch(var(--muted-foreground))", fontSize: 11 },
    axisLine: { stroke: "oklch(var(--border))" },
    tickLine: false,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "oklch(var(--card))",
      border: "1px solid oklch(var(--border))",
      borderRadius: "calc(var(--radius) * 2)",
      color: "oklch(var(--foreground))",
      fontSize: 12,
    },
  },
}
```

Update every chart component to import from `lib/chart-colors.ts`
instead of using inline color strings.

---

## Part 3 — Recharts Chart Wiring

For each chart component, verify current recharts API via context7
before wiring. Then wire data from hooks.

### LineChart
```typescript
// Data: TrendPoint[] from useFilteredChartData
// One <Line> per incident type key
// Toggle series: local useState<string[]> for hidden series
// X axis: format date as "MMM d" at 7d/30d, "MMM" at 90d/1y
// Tooltip: custom content showing all type values at hovered date
```

### AreaChart
```typescript
// Data: ResponseTrendPoint[] from useFilteredChartData
// Two <Area>: avgMinutes + p90Minutes
// <defs> gradient fill for each area
// <ReferenceLine y={10} strokeDasharray="4 2" label="SLA" />
```

### BarChart
```typescript
// Data: incidents aggregated by type from useChartData
// Orientation: "horizontal" when colSpan === 1, "vertical" when >= 2
// Rounded caps: add <rect> with rx/ry in custom bar shape
// Value labels: <LabelList position="insideEnd" />
```

### ComposedChart
```typescript
// Data: ResponseTrendPoint[] from useFilteredChartData
// Bars (left Y): incident count derived from trend data
// Line (right Y): deployed responders
// Two <YAxis> components with yAxisId="left" and yAxisId="right"
```

### RadarChart
```typescript
// Data: DistrictRisk[] from useChartData
// One <Radar> per district, INCIDENT_COLORS mapped to district index
// <PolarGrid gridType="polygon" />
// Semi-transparent fills: opacity 0.25
```

### PieChart (donut)
```typescript
// Data: incidents grouped by severity from useChartData
// innerRadius="60%" outerRadius="85%"
// Center label via custom label component: total count
// Active segment: outerRadius increases on hover via activeIndex state
```

### RadialBarChart
```typescript
// Data: single value (resolution %) from useChartData
// Background track: <RadialBar data with muted fill>
// Foreground: <RadialBar fill="oklch(var(--success))">
// Center text: percentage + "Resolved" via label
```

### ScatterChart
```typescript
// Data: one point per zone from useChartData
// x: population, y: incidentCount, z: area_km2 (for dot size)
// Dot fill: SEVERITY_COLORS[zone.riskLevel]
// <ReferenceLine> at mean x and mean y
// Custom dot: renders circle with fill from zone.riskLevel
```

### SparkBarChart
```typescript
// Data: incident counts by severity (4 bars) from useChartData
// No axes, no grid, no legend, no tooltip
// <Bar> with SEVERITY_COLORS per bar
// <LabelList position="top" />
```

---

## Part 4 — Custom SVG Chart Wiring

### GaugeArcChart
```typescript
// Data: number from useChartData (0–max)
// Thresholds from block.thresholds
// Needle rotation: (value / thresholds.max) * 180 degrees
// CSS transition on needle: transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)
// Animate to value on mount: start at 0, transition to actual value
// via useEffect + short setTimeout to allow paint

// Arc math:
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 180) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(
  cx: number, cy: number, r: number,
  startDeg: number, endDeg: number
): string {
  const start = polarToCartesian(cx, cy, r, startDeg)
  const end = polarToCartesian(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
}
```

### WindRoseChart
```typescript
// Data: DirectionData[] from useChartData
// Active tab (Day/Week/Month): local useState
// Each petal: stacked arc segments, bins from DirectionData
// Petal math: each direction centered at its bearing angle
// Bin stacking: each bin's inner radius = cumulative previous bins
```

### CompassChart
```typescript
// Data: number (bearing degrees) from useChartData
// Needle rotation: CSS transform rotate(${bearing}deg) on the needle group
// Spring transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)
// Cardinal label derived from bearing: every 22.5° step
```

---

## Part 5 — CSS Grid Chart Wiring

### TimelineHeatmap
```typescript
// Data: HeatMatrixRow[] from useChartData
// 6 rows × 30 columns
// Cell color: linear scale from muted to primary based on count/max

function getCellOpacity(count: number, max: number): number {
  if (count === 0) return 0
  return 0.15 + (count / max) * 0.85
}
// Apply as: style={{ backgroundColor: `oklch(var(--primary) / ${opacity})` }}
// Cannot use Tailwind for dynamic opacity values
```

### CalendarHeatmap
```typescript
// Data: CalendarDay[] from useChartData
// 7 rows × 53 columns
// 5-stop scale: muted → primary shades → accent at peak

const THRESHOLDS = [0, 2, 5, 10, 18]  // count boundaries per stop
const COLORS = [
  "oklch(var(--muted))",
  "oklch(var(--primary) / 0.2)",
  "oklch(var(--primary) / 0.45)",
  "oklch(var(--primary) / 0.7)",
  "oklch(var(--accent))",
]

function getCalendarColor(value: number): string {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (value >= THRESHOLDS[i]) return COLORS[i]
  }
  return COLORS[0]
}
```

### BulletChart
```typescript
// Data: BulletData from useChartData
// Pure div layout — no SVG, no canvas
// Background bands: absolute positioned divs
// Actual bar: width = (actual / ranges[0]) * 100%
// Target line: left = (target / ranges[0]) * 100%
```

---

## Part 6 — StatCard Count-Up Animation

Wire the count-up on mount for StatCardFull:

```typescript
function useCountUp(target: number, duration = 1200): number {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return current
}
```

Apply to StatCardFull's value when it's a number.
Format with `toLocaleString()` for thousand separators.

---

## Part 6b — Weather Chart Stubs

Weather chart components (GaugeArcChart wired to wind speed or
THW index, CompassChart, WindRoseChart, and all WeatherStatCard
variants) should be wired to `useChartData` against mock registry
data exactly like other charts.

Additionally, create the following stub file. Do not implement
anything inside it — the contents will be filled in manually
during the live WeatherLink integration session.

```typescript
// lib/hooks/use-weather-live.ts
// ─────────────────────────────────────────────────────────────
// STUB — do not implement here.
// This hook will be wired to the Effect/Hono/WeatherLink layer
// in a subsequent manual integration session.
//
// Final signature (for reference only):
//
// export type CurrentConditions = { ... }  // derived from Hono AppType
//
// export function useCurrentConditions(stationId: string): UseQueryResult<
//   CurrentConditions,
//   Error
// >
//
// When implemented:
// - placeholderData: transformMockToCurrentConditions(WEATHER)
// - refetchInterval: 60_000
// - staleTime: 55_000
// - queryKey includes stationId and timeRange where relevant
// ─────────────────────────────────────────────────────────────

export {}  // keep as valid module
```

Also create this stub — the transforms file will be needed by
both the mock fallback and the live integration:

```typescript
// lib/weatherlink/transforms.ts
// ─────────────────────────────────────────────────────────────
// STUB — partial implementation expected here.
// Populate transformMockToCurrentConditions() now so the mock
// fallback works. The rest of the transform functions will be
// completed during the live integration session.
// ─────────────────────────────────────────────────────────────

import type { WeatherData } from "@/lib/mock-data/types"

// Placeholder domain type — will be replaced by InferResponseType
// from hono/client once the Hono AppType is defined.
export interface CurrentConditions {
  windSpeed: number
  windBearing: number
  twhIndex: number
  humidity: number
  barometer: Array<{ time: string; pressure: number }>
  tempTrend: Array<{ time: string; temp: number; humidity: number }>
  tempGrouped: { outside: number; heatIndex: number; wetBulb: number }
  currentRain: { day: number; storm: number; rate: number }
  totalRain: { actual: number; target: number; ranges: [number, number, number]; unit: string }
  rainCalendar: Array<{ date: string; value: number }>
  sunrise: string
  sunset: string
  moonPhase: string
  moonIllumination: number
  forecast: { condition: string; temp: number; humidity: number }
}

export function transformMockToCurrentConditions(
  mock: WeatherData
): CurrentConditions {
  return {
    windSpeed:        mock.windSpeed,
    windBearing:      mock.windBearing,
    twhIndex:         mock.twhIndex,
    humidity:         mock.humidity,
    barometer:        mock.barometer,
    tempTrend:        mock.tempTrend,
    tempGrouped:      mock.tempGrouped,
    currentRain:      mock.currentRain,
    totalRain:        mock.totalRain,
    rainCalendar:     mock.rainCalendar,
    sunrise:          mock.sunrise,
    sunset:           mock.sunset,
    moonPhase:        mock.moonPhase,
    moonIllumination: mock.moonIllumination,
    forecast:         mock.forecast,
  }
}

// TODO(live-weather): add transformLiveToCurrentConditions(raw: WLSensorResponse)
// once WeatherLink schema types are defined in lib/weatherlink/schemas.ts
```

---

## Part 7 — Blocks Reducer Completion

Read the current `lib/dashboard-blocks.ts` reducer. Complete
any unimplemented cases and verify correctness:

**ADD**: generate a new `id` with `crypto.randomUUID()`, append block.

**REMOVE**: filter out by id. If a merged block is removed,
restore its children as separate blocks.

**RESIZE**: update colSpan and/or rowSpan by id.

**MERGE**: combine two blocks into one.
The merged block takes the first block's id and position.
`mergedMeta` stores both original block definitions for split recovery.
`type` becomes the first block's type, `merged: true`.

**SPLIT**: restore `mergedMeta` blocks as two separate blocks
inserted at the merged block's position.

**REORDER**: implement arrayMove from `@dnd-kit/sortable`.

**LOAD_PRESET**: replace entire blocks array with preset blocks,
each assigned a new `crypto.randomUUID()` id.

**SET_TAB**: update `activeTabIndex` on a merged block by id.

**RESET**: return DEFAULT_BLOCKS with fresh UUIDs.

---

## Part 8 — Preset Persistence

Wire preset state to localStorage:

```typescript
// On DashboardGrid mount:
// 1. Read localStorage key "beacon_preset" to get active preset id
// 2. Read localStorage key "beacon_blocks_${presetId}" for saved layout
// 3. If saved layout exists, use it; otherwise use preset defaults

// On every blocks state change:
// Debounce 500ms, then write to "beacon_blocks_${presetId}"

// On preset switch:
// Write current blocks to current preset key before switching
// Load new preset (from saved layout or defaults)
// Update "beacon_preset" key
```

Use `useTransition` for preset switches — they're non-urgent
and shouldn't block the UI.

---

## Part 9 — Category View Data Filtering

Category views load a fixed block layout with data pre-filtered
to one incident type. Add filtering support to `DATA_REGISTRY`:

```typescript
// lib/mock-data/index.ts — add filtered registry entries

// For each incident type, add dataKey variants:
// "incidents_trend_fire", "incidents_trend_flood", etc.
// "incident_heatmap_fire", "incident_heatmap_flood", etc.
// These mirror the base dataKeys but filtered to one type

// The category view blocks use these filtered dataKeys
```

---

## Acceptance Criteria

- All chart components render with real data from `lib/mock-data/`
- No hardcoded inline arrays remain in any chart component
- Weather chart components use `useChartData` against DATA_REGISTRY
- Every weather chart component has a `// TODO(live-weather):` stub comment
- `lib/hooks/use-weather-live.ts` exists as a stub module (exports `{}`)
- `lib/weatherlink/transforms.ts` exists with `transformMockToCurrentConditions`
  implemented and `transformLiveToCurrentConditions` stubbed with a TODO
- GaugeArcChart needle animates from 0 to value on mount
- StatCardFull count-up animation works on mount
- Theme switching recolors all charts (verify by switching themes)
- Line/Area/Composed charts respond to time range changes
- Blocks reducer handles all 8 action types correctly
- MERGE + SPLIT roundtrip restores original two blocks
- Preset switching works and persists to localStorage
- Layout saves to localStorage on changes (debounced)
- Layout restores from localStorage on remount
- TypeScript strict mode passes with no errors
- No `useCurrentConditions` call exists anywhere in the codebase
