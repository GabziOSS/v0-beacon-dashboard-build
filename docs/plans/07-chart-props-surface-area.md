# 07 — Chart Props Surface Area & Type-Safe Dataset Injection

## Goal
Design a unified, generic props interface for all chart components that enables type-safe dataset injection without coupling charts to specific data sources.

---

## Current Props Audit

| Chart | Current Props | Problems |
|-------|--------------|----------|
| `GaugeArc` | `{ value: number, label: string, max?: number }` | No thresholds array, no unit, no color override |
| `WindRoseChart` | `{ data: WindRoseData[] }` | Hardcoded `BIN_COLORS`, no bin config |
| `BarometerChart` | `{ data: BarometerPoint[] }` | Hardcoded gradient IDs, no time range |
| `StatCard` | `{ data: StatCardData }` | `positiveIsGood` inferred from unit string |
| `CompassChart` | Inline `useWindBearing()` | Data fetching inside component |
| `SunriseSunset` | Inline `useSunriseSunset()` | Data fetching inside component |
| `MoonPhase` | Inline `useMoonPhase()` | Data fetching inside component |
| `LocalForecast` | Inline `useLocalForecast()` | Data fetching inside component |
| `TempHumidityBar` | Inline `useInsideTempHum()` | Data fetching inside component |
| `MultiTempBar` | Inline `useMultiTemp()` | Data fetching inside component |
| `RainBar` | Inline `useCurrentRain()` / `useTotalRain()` | Data fetching inside component |
| `LineChart` | Inline hardcoded data | No external data prop at all |

---

## Proposed Generic Props Pattern

```typescript
// lib/chart-types.ts

/** Base props every chart molecule accepts */
interface ChartBaseProps<TData> {
  /** The dataset to render — fully external, no internal fetching */
  data: TData
  /** Optional CSS class for the root container */
  className?: string
  /** Whether the chart is in a compact (1×1) layout */
  compact?: boolean
}

/** Gauge-family charts (wind speed, humidity, THW, risk score) */
interface GaugeProps extends ChartBaseProps<number> {
  label: string
  unit?: string
  max?: number
  thresholds?: {
    good: number      // below this = success color
    warning: number   // below this = warning color
    // above warning = destructive color
  }
  colorOverride?: string  // force a specific CSS variable
}

/** Compass/bearing charts */
interface CompassProps extends ChartBaseProps<number> {
  /** Bearing in degrees (0–360) */
  data: number
  cardinalLabel?: string  // e.g. "NE"
  showDegrees?: boolean
}

/** Wind Rose (polar stacked chart) */
interface WindRoseProps extends ChartBaseProps<WindRoseData[]> {
  bins?: Array<{ label: string; color: string }>
  timeRange?: 'Day' | 'Week' | 'Month'
  onTimeRangeChange?: (range: 'Day' | 'Week' | 'Month') => void
}

/** Time-series charts (barometer, trends, response time) */
interface TimeSeriesProps<TPoint> extends ChartBaseProps<TPoint[]> {
  xKey: keyof TPoint & string
  yKeys: Array<{
    key: keyof TPoint & string
    label: string
    color: string
    type?: 'line' | 'area' | 'bar'
  }>
  yDomain?: [number, number]  // auto if omitted
  xFormat?: (value: string) => string
  referenceLines?: Array<{ y: number; label: string; color?: string }>
}

/** Stat/KPI card */
interface StatProps extends ChartBaseProps<{
  value: number
  delta: number
  deltaLabel: string
  sparkData: number[]
}> {
  label: string
  unit?: string
  positiveIsGood?: boolean  // explicit instead of inferring from unit
  formatValue?: (v: number) => string
}

/** Celestial (sunrise/sunset) */
interface CelestialProps extends ChartBaseProps<{
  sunrise: string  // HH:mm
  sunset: string   // HH:mm
}> {
  currentTime?: Date  // defaults to now
}

/** Moon phase */
interface MoonProps extends ChartBaseProps<{
  phase: MoonPhaseName
  illumination: number  // 0–1
}> {}

/** Forecast card */
interface ForecastProps extends ChartBaseProps<{
  period: string
  condition: WeatherCondition
  temp: number
  humidity: number
  description: string
}> {}

/** Bar chart (category, temperature, rain) */
interface BarProps<TPoint> extends ChartBaseProps<TPoint[]> {
  categoryKey: keyof TPoint & string
  valueKeys: Array<{
    key: keyof TPoint & string
    label: string
    color: string
  }>
  orientation?: 'horizontal' | 'vertical'
  unit?: string
}

/** Heatmap (timeline, calendar) */
interface HeatmapProps<TCell> extends ChartBaseProps<TCell[]> {
  xKey: keyof TCell & string
  yKey: keyof TCell & string
  valueKey: keyof TCell & string
  colorScale?: string[]  // array of CSS color values, low → high
}
```

---

## WeatherLink NwSSU Reference — Full Dataset Shape

Based on the reference screenshots (NwSSU-AWS + NwSSU_AWS1):

### Station: NwSSU-AWS (Indoor)
| Field | Type | Unit | Notes |
|-------|------|------|-------|
| Barometer | `number` | mm Hg | Current + Daily High/Low with timestamps |
| Bar Trend | `string` | — | "Steady", "Rising", "Falling" |
| Inside Temp | `number` | °C | With daily high/low |
| Inside Humidity | `number` | % | With daily high/low |

### Station: NwSSU_AWS1 (Outdoor)
| Field | Type | Unit | Notes |
|-------|------|------|-------|
| Temperature | `number` | °C | Current + High/Low + timestamps |
| Humidity | `number` | % | Current + High/Low |
| Heat Index | `number` | °C | Derived |
| THW Index | `number` | °C | Temp-Humidity-Wind |
| Wind Chill | `number` | °C | — |
| Dew Point | `number` | °C | High/Low |
| Wet Bulb | `number` | °C | — |
| Wind Speed | `number` | km/h | 2-min avg + 10-min avg |
| Wind Gust | `number` | km/h | 2-min + 10-min |
| Wind Direction | `number` | ° | 0–360 |
| Rain Rate | `number` | mm/h | Current rate |
| Rain (Storm) | `number` | mm | Accumulated |
| Rain (Day) | `number` | mm | Daily total |
| Rain (Month) | `number` | mm | Monthly total |
| Rain (Year) | `number` | mm | Annual total |
| Sunrise | `string` | HH:mm | — |
| Sunset | `string` | HH:mm | — |
| Moon Phase | `string` | — | Phase name |
| Moon Illumination | `number` | % | 0–100 |
| Forecast | `string` | — | Condition + description |

### Chart View (multi-series time chart)
- Selectable sensors: Inside Hum, High/Low Inside Hum, Inside Temp, High/Low Inside Temp, etc.
- X-axis: 24h time series at 15-min intervals
- Y-axis: dual (left = temperature/pressure, right = humidity/rain)
- Toggle individual series on/off via sidebar checkboxes

### Data View (tabular)
- Raw 15-min interval records
- All fields from both stations in columns
- Pagination + date range selector

---

## Implementation Estimate

| Task | Hours |
|------|-------|
| Create `lib/chart-types.ts` with all generic interfaces | 1–2 |
| Update each molecule to accept generic props | 4–6 |
| Update organisms to compose molecules with data | 2–3 |
| **Total** | **7–11** |
