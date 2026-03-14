# Beacon — opencode Prompt 1: Mock Data Module

Read the existing codebase before starting. Understand the file
structure, existing type references, and what hooks currently
return hardcoded values.

---

## Goal

Create a proper mock data module at `lib/mock-data/` that generates
all safety and weather data consumed by the dashboard, map, table,
and category views. Replace all hardcoded inline data in chart
components and hooks with imports from this module.

This is pure TypeScript — no UI, no components, no Next.js concerns.

---

## File Structure

```
lib/mock-data/
├── index.ts              ← pre-generates all data, exports constants
├── types.ts              ← all shared TypeScript interfaces
├── seed.ts               ← seeded PRNG (deterministic, reproducible)
└── generators/
    ├── incidents.ts
    ├── zones.ts
    ├── zones-geojson.ts
    ├── metrics.ts
    ├── trends.ts
    ├── districts.ts
    ├── direction.ts
    ├── heatmap.ts
    ├── calendar.ts
    ├── bullet.ts
    ├── weather.ts
    └── users.ts
```

---

## seed.ts

Mulberry32 seeded PRNG. All randomness goes through this.
No bare `Math.random()` calls anywhere except in this file.

```typescript
export function createRng(seed: number) {
  let s = seed
  return function (): number {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Seed: 20250307 (project start date — keeps data stable across runs)
export const rng = createRng(20250307)

export function randInt(min: number, max: number, r = rng): number
export function randFloat(min: number, max: number, r = rng): number
export function randItem<T>(arr: readonly T[], r = rng): T
export function randWeighted<T>(
  items: readonly T[],
  weights: readonly number[],
  r = rng
): T
```

---

## types.ts

```typescript
export type IncidentType =
  | "fire" | "flood" | "crime"
  | "medical" | "infrastructure" | "weather"

export type SeverityLevel = "critical" | "high" | "medium" | "low"
export type IncidentStatus = "open" | "in_progress" | "resolved"
export type RiskLevel = "critical" | "high" | "medium" | "low"

export interface Incident {
  id: string
  type: IncidentType
  severity: SeverityLevel
  status: IncidentStatus
  zoneId: string
  zoneName: string
  barangay: string
  coordinates: [number, number]   // [lng, lat] GeoJSON order
  timestamp: string               // ISO 8601
  reportedBy: string              // Filipino name
  respondersAssigned: number
  resolutionMinutes?: number
  description: string
}

export interface Zone {
  id: string                      // z01–z12
  name: string
  barangay: string
  district: number                // 1–6
  population: number
  area_km2: number
  riskLevel: RiskLevel
  centroid: [number, number]      // [lng, lat]
  incidentCount: number
  lastIncident: string
}

export interface Metric {
  key: string
  label: string
  value: number
  unit: string
  delta: number                   // % change vs previous period
  deltaLabel: string
  sparkData: number[]             // 7 data points
  positiveIsGood: boolean
}

export interface TrendPoint {
  date: string                    // YYYY-MM-DD
  fire: number
  flood: number
  crime: number
  medical: number
  infrastructure: number
  weather: number
  total: number
}

export interface ResponseTrendPoint {
  date: string
  avgMinutes: number
  p90Minutes: number
  deployed: number
}

export interface DistrictRisk {
  district: string
  incidentRate: number
  infrastructure: number
  populationDensity: number
  floodRisk: number
  crimeIndex: number
}

export interface DirectionBin {
  range: string
  value: number
}

export interface DirectionData {
  direction: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
  bins: DirectionBin[]
}

export interface HeatMatrixRow {
  category: IncidentType
  values: Array<{ date: string; count: number }>
}

export interface CalendarDay {
  date: string   // YYYY-MM-DD
  value: number
}

export interface BulletData {
  label: string
  actual: number
  target: number
  ranges: [number, number, number]  // poor / acceptable / good thresholds
  unit: string
}

export interface WeatherData {
  windSpeed: number               // km/h
  windBearing: number             // degrees
  twhIndex: number                // °C
  humidity: number                // %
  barometer: Array<{ time: string; pressure: number }>
  tempTrend: Array<{ time: string; temp: number; humidity: number }>
  tempGrouped: { outside: number; heatIndex: number; wetBulb: number }
  currentRain: { day: number; storm: number; rate: number }
  totalRain: BulletData
  rainCalendar: CalendarDay[]
  sunrise: string                 // HH:mm
  sunset: string                  // HH:mm
  moonPhase: string
  moonIllumination: number
  forecast: { condition: string; temp: number; humidity: number }
}

export interface MockUser {
  id: string
  name: string
  email: string
  role: "admin" | "analyst" | "responder" | "viewer"
  avatar: string                  // initials
  org: string
  zones: string[]
  lastLogin: string
  status: "active" | "inactive"
}
```

---

## generators/zones.ts

12 zones representing barangay clusters around Calbayog City.
All centroids within `[[124.39, 11.92], [124.79, 12.22]]`.

```typescript
export const ZONE_DEFINITIONS = [
  { id: "z01", name: "Poblacion Central",    barangay: "Poblacion 1-2",  district: 1, centroid: [124.5908, 12.0685] as [number,number], population: 8200,  area_km2: 2.1 },
  { id: "z02", name: "Bagacay District",     barangay: "Bagacay",        district: 1, centroid: [124.5980, 12.0740] as [number,number], population: 5400,  area_km2: 3.8 },
  { id: "z03", name: "Calbayog Port Area",   barangay: "Sabong",         district: 2, centroid: [124.5820, 12.0620] as [number,number], population: 6100,  area_km2: 1.9 },
  { id: "z04", name: "Nijaga–San Policarpo", barangay: "Nijaga",         district: 2, centroid: [124.6050, 12.0550] as [number,number], population: 4300,  area_km2: 5.2 },
  { id: "z05", name: "Tinaplacan Valley",    barangay: "Tinaplacan",     district: 3, centroid: [124.5700, 12.0800] as [number,number], population: 3800,  area_km2: 6.7 },
  { id: "z06", name: "Rawis Coastal",        barangay: "Rawis",          district: 3, centroid: [124.5650, 12.0500] as [number,number], population: 2900,  area_km2: 4.1 },
  { id: "z07", name: "Mabini Heights",       barangay: "Mabini",         district: 4, centroid: [124.6150, 12.0780] as [number,number], population: 5700,  area_km2: 3.3 },
  { id: "z08", name: "Rizal East",           barangay: "Rizal",          district: 4, centroid: [124.6200, 12.0600] as [number,number], population: 4100,  area_km2: 2.8 },
  { id: "z09", name: "San Joaquin North",    barangay: "San Joaquin",    district: 5, centroid: [124.5780, 12.0950] as [number,number], population: 3200,  area_km2: 7.4 },
  { id: "z10", name: "Hamorawon Upland",     barangay: "Hamorawon",      district: 5, centroid: [124.5550, 12.0880] as [number,number], population: 2100,  area_km2: 9.1 },
  { id: "z11", name: "Lonoy River Basin",    barangay: "Lonoy",          district: 6, centroid: [124.6080, 12.0420] as [number,number], population: 3600,  area_km2: 5.6 },
  { id: "z12", name: "Oquendo Industrial",   barangay: "Oquendo",        district: 6, centroid: [124.5930, 12.0350] as [number,number], population: 4800,  area_km2: 4.4 },
] as const
```

Risk level: high-density central zones lean critical/high,
outer low-density zones lean low/medium. Use seeded random
for variance within those tendencies.

---

## generators/zones-geojson.ts

Closed GeoJSON Polygon for each zone.
Shape: irregular hexagon around centroid.
Radius: proportional to `area_km2` (small ~0.012°, large ~0.025°).
Vary side lengths slightly via rng for organic feel.
First coordinate must equal last (closed ring).

```typescript
import type { FeatureCollection, Feature, Polygon } from "geojson"
export const ZONES_GEOJSON: FeatureCollection<Polygon>
```

Each feature's `properties` must include:
`{ zoneId, name, barangay, district, riskLevel, population }`

---

## generators/incidents.ts

Generate 500 incidents from 2024-01-01 to 2025-03-07.

Seasonal patterns for Philippines / Calbayog context:
- Floods: peak June–October (typhoon season)
- Fire: peak March–May (dry season) + December (holiday cooking)
- Crime: elevated December–February
- Medical: steady year-round, small spike during flood events
- Infrastructure: peaks 1–2 weeks after flood events
- Weather: June–November

Severity weights by type:
```
fire:           critical 15% / high 35% / medium 35% / low 15%
flood:          critical 20% / high 40% / medium 30% / low 10%
crime:          critical  5% / high 20% / medium 45% / low 30%
medical:        critical 25% / high 30% / medium 30% / low 15%
infrastructure: critical  5% / high 15% / medium 50% / low 30%
weather:        critical 10% / high 30% / medium 40% / low 20%
```

Resolution time (minutes), approximate normal via Box-Muller:
```
critical: mean 18  sd 6
high:     mean 32  sd 10
medium:   mean 55  sd 15
low:      mean 90  sd 25
```

Status: 85% resolved / 10% in_progress / 5% open
Use Filipino names for `reportedBy`.
Use zone-appropriate barangay descriptions.

---

## generators/weather.ts

Calbayog City, early March context (dry season beginning):
- Wind: light, 3–8 km/h, predominantly from NE
- Temp: 27–31°C, humidity 75–85%
- Barometer: stable, 757–759 mm Hg
- Recent rainfall: low (dry season), but annual total realistic

Generate realistic values for all `WeatherData` fields.
Barometer trend: last 8 hours, 30-min intervals.
Temp trend: last 24 hours, 1-hour intervals.
Rain calendar: 365 days with typhoon-season peaks.

---

## generators/metrics.ts

4 KPI metrics derived from incident data:

```typescript
// incidents_total: count of all incidents last 30d
//   delta: % change vs prior 30d
//   sparkData: daily totals last 7 days
//   positiveIsGood: false (more incidents = bad)

// alerts_active: count where status !== "resolved"
//   delta: % change vs yesterday
//   positiveIsGood: false

// zones_high_risk: count of zones with riskLevel critical|high
//   delta: % change vs last month
//   positiveIsGood: false

// response_time_avg: mean resolutionMinutes last 30d
//   delta: % change vs prior 30d
//   unit: "min"
//   positiveIsGood: false (higher time = bad)
```

---

## generators/trends.ts

Two series:

1. Daily incident counts by type, last 365 days → `TrendPoint[]`
   Derive from INCIDENTS. Fill zero for days with no incidents.

2. Daily avg response + p90 + deployed, last 90 days → `ResponseTrendPoint[]`
   Derive from INCIDENTS. `deployed` = respondersAssigned sum per day.

---

## generators/districts.ts

6 districts × 5 risk dimensions (0–100 normalised).
Districts: Poblacion / Port & Commerce / Coastal West /
Eastern Heights / Northern Uplands / Southern Basin.
Derive from zone and incident data where possible,
fill remainder with seeded values.

---

## generators/direction.ts

8-directional incident origin data.
3 bins per direction (low/mid/high frequency).
Bias: more incidents from NE (typhoon corridor) and S (coastal).

---

## generators/heatmap.ts

6 categories × last 30 days.
Max cell value ~12. Derive from INCIDENTS.

---

## generators/calendar.ts

365 days of daily totals.
Seasonal variance: weekends +15%, typhoon season +40%,
Christmas week +25%, February −20%.

---

## generators/bullet.ts

Response vs SLA:
actual = mean response time last 30d
target = 10 min
ranges = [20, 10, 6] (poor / acceptable / good)

---

## generators/users.ts

12 users with Filipino names from Calbayog/Samar region.
Distribution: 2 admin / 3 analyst / 5 responder / 2 viewer.
Responders each assigned 2–4 zones.

---

## index.ts

Pre-generate all data at module load. Export as named constants.

```typescript
export const INCIDENTS: Incident[]
export const ZONES: Zone[]
export const ZONES_GEOJSON: FeatureCollection
export const METRICS: Metric[]
export const TREND: TrendPoint[]
export const RESPONSE_TREND: ResponseTrendPoint[]
export const DISTRICT_RISK: DistrictRisk[]
export const DIRECTION_DATA: DirectionData[]
export const HEAT_MATRIX: HeatMatrixRow[]
export const CALENDAR_DATA: CalendarDay[]
export const BULLET_DATA: BulletData
export const WEATHER: WeatherData
export const USERS: MockUser[]

// Lookup helpers
export function getZoneById(id: string): Zone | undefined
export function getIncidentsByZone(zoneId: string): Incident[]
export function getIncidentsByType(type: IncidentType): Incident[]
export function getRecentIncidents(days?: number): Incident[]
export function getIncidentsByDateRange(start: string, end: string): Incident[]

// DATA_REGISTRY: maps dataKey strings (used in ChartBlock.dataKey)
// to their resolved data. Must cover every dataKey in PRESETS.
export const DATA_REGISTRY: Record<string, unknown>
```

---

## Cross-module Dependencies

`lib/mock-data/types.ts` is imported by modules outside `lib/mock-data/`.
The following types must remain public exports and must not be made
internal, renamed, or inlined:

- `WeatherData` — imported by `lib/weatherlink/transforms.ts` for the
  mock fallback in `transformMockToCurrentConditions()`. This is the
  bridge between the mock data layer and the live WeatherLink integration.
  The field names on `WeatherData` are load-bearing — they map 1:1 to
  `CurrentConditions` in the transforms file.

- `Incident`, `Zone`, `IncidentType`, `SeverityLevel`, `RiskLevel` —
  imported by table column definitions, map components, and category views.

Do not add any imports from `lib/weatherlink/` into this module —
the dependency only flows one way (weatherlink imports mock-data, never
the reverse).

---

## Acceptance Criteria

- TypeScript strict mode passes with no errors (`tsc --noEmit`)
- `INCIDENTS.length === 500`
- `ZONES.length === 12`
- All zone centroids within `[[124.39, 11.92], [124.79, 12.22]]`
- All GeoJSON polygon rings are closed (first coord === last)
- All date strings are valid ISO 8601
- No bare `Math.random()` calls outside `seed.ts`
- Every `dataKey` used in `PRESETS` resolves in `DATA_REGISTRY`
- No Next.js or React imports anywhere in this module
- Module is importable from any component without side effects
- `WeatherData` is a named export from `lib/mock-data/types.ts`
- No imports from `lib/weatherlink/` anywhere in this module
