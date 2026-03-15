# 08 — Weather Route Expansion (/weather)

## Goal
Add a dedicated `/weather` route with subroutes matching the WeatherLink views: **Dashboard** (widget grid), **Chart** (multi-series time chart), and **Data** (tabular raw data). This extends beyond the existing `/dashboard/station` preset into a first-class weather section.

---

## Proposed Route Structure

```
/weather
├── /weather                → Overview: conditions summary + alerts
├── /weather/station        → Widget grid (current NwSSU station dashboard)
├── /weather/chart          → Multi-series time chart (sensor explorer)
├── /weather/data           → Raw data table (15-min intervals)
└── /weather/history        → Historical analysis (rain calendar, trends)
```

---

## Subroute Details

### `/weather` (Overview)
A summary landing page showing:
- Current conditions cards (temp, humidity, wind, barometer)
- Active weather alerts/warnings
- 5-day forecast row
- Quick links to station, chart, data, history

### `/weather/station` (Widget Grid)
This is the existing `weather_station` preset, but now living under its own route rather than `/dashboard/station`. Same `DashboardGrid` + `ChartBlock` system.

**Enhancement**: Support for **multi-station** switching (NwSSU-AWS vs NwSSU_AWS1 vs future stations). Add a station picker in the page header.

### `/weather/chart` (Sensor Explorer)
Inspired by WeatherLink's chart view:
- **Time range selector**: Start date + Span (1 day, 3 days, 1 week, 1 month)
- **Sensor picker sidebar**: Checkboxes for 20+ sensor fields (grouped by station)
- **Multi-axis chart**: Left Y (temp/pressure), Right Y (humidity/rain rate)
- **Recharts `ComposedChart`** with toggleable `<Line>` and `<Area>` series
- **Legend**: Color-coded, toggleable via click

### `/weather/data` (Raw Table)
Inspired by WeatherLink's data export view:
- **TanStack Table** with all sensor columns
- **Date range picker** (start + span)
- **Monthly summary** toggle
- **Export**: CSV, JSON download
- **Column visibility**: toggle individual sensor fields
- Pagination: 50 rows per page

### `/weather/history` (Historical Analysis)
- **Rain calendar heatmap** (annual view)
- **Temperature trend** (30/90/365 day line chart)
- **Wind rose** (monthly aggregate)
- **Extremes table** (record highs/lows with dates)

---

## File Structure

```
app/(shell)/weather/
├── layout.tsx              ← Weather section layout with station picker + sub-nav
├── page.tsx                ← /weather overview
├── station/page.tsx        ← Widget grid (DashboardGrid with weather_station preset)
├── chart/page.tsx          ← Multi-series sensor explorer
├── data/page.tsx           ← Raw data table
└── history/page.tsx        ← Historical analysis
```

New components needed:
```
components/weather/
├── station-picker.tsx       ← Dropdown to select NwSSU-AWS / NwSSU_AWS1
├── sensor-sidebar.tsx       ← Checkbox list of available sensors
├── time-range-picker.tsx    ← Date start + span selector
├── conditions-summary.tsx   ← Current conditions cards row
└── weather-nav.tsx          ← Sub-navigation tabs
```

---

## Data Requirements

| View | Data Source | Notes |
|------|-----------|-------|
| Overview | `WeatherData` from mock/live | Summary cards + alerts |
| Station | Existing chart data registry | Already wired |
| Chart | New `TimeSeriesRecord[]` | 15-min interval sensor readings |
| Data | Same `TimeSeriesRecord[]` | TanStack Table rows |
| History | Aggregated from `TimeSeriesRecord[]` | Calendar/trend/extremes |

New type needed:
```typescript
interface TimeSeriesRecord {
  timestamp: string        // ISO 8601, 15-min intervals
  stationId: string        // 'nwssu-aws' | 'nwssu-aws1'
  // NwSSU-AWS fields
  barometer?: number       // mm Hg
  barTrend?: string
  insideTemp?: number      // °C
  insideHumidity?: number  // %
  // NwSSU_AWS1 fields
  temperature?: number
  humidity?: number
  heatIndex?: number
  thwIndex?: number
  windChill?: number
  dewPoint?: number
  wetBulb?: number
  windSpeed?: number       // km/h
  windGust?: number
  windDirection?: number   // degrees
  rainRate?: number        // mm/h
  rainStorm?: number       // mm
  rainDay?: number
  rainMonth?: number
  rainYear?: number
}
```

---

## Sidebar Navigation Update

Add to `NAV_ITEMS` in `sidebar.tsx`:
```typescript
{ href: '/weather', label: 'Weather', icon: CloudSun, enabled: true }
```

With sub-items (when expanded):
- Station · Chart · Data · History

---

## Phase Estimates

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Route scaffolding (layout + 5 pages, empty shells) | 1–2 |
| 2 | Weather overview page (conditions cards + alerts) | 2–3 |
| 3 | Station page (move/adapt existing preset grid) | 1–2 |
| 4 | Chart page (sensor explorer with ComposedChart) | 4–6 |
| 5 | Data page (TanStack Table with column toggles) | 3–4 |
| 6 | History page (calendar + trends + extremes) | 2–3 |
| 7 | Station picker + sensor sidebar components | 2–3 |
| 8 | Navigation updates (sidebar + weather sub-nav) | 1 |
| **Total** | | **16–24** |
