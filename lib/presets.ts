import type { ChartBlock } from "@/components/dashboard/chart-block"

export type PresetId = "overview" | "weather_station"

export interface Preset {
  id: PresetId
  label: string
  description: string
  blocks: ChartBlock[]
}

export const PRESETS: Record<PresetId, Preset> = {
  overview: {
    id: "overview",
    label: "Overview",
    description: "Full incident dashboard",
    blocks: [
      { id: "stat-1", title: "Total Incidents", subtitle: "All zones · 30d", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "stat-2", title: "Active Alerts", subtitle: "Right now", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "stat-3", title: "High-Risk Zones", subtitle: "Risk level ≥ 70", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "stat-4", title: "Avg Response", subtitle: "All responders", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "trend", title: "Incident Trend", subtitle: "By type · 24h", colSpan: 2, rowSpan: 1, type: "line" },
      { id: "risk", title: "City Risk Score", subtitle: "Composite index", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "rose", title: "Incident Origin", subtitle: "8-direction grid", colSpan: 1, rowSpan: 1, type: "windrose" },
      { id: "cat", title: "By Category", subtitle: "Last 30 days", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "radar", title: "District Risk", subtitle: "5 dimensions", colSpan: 1, rowSpan: 1, type: "radar" },
      { id: "area", title: "Response Time", subtitle: "Avg & P90 · 14d", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "ready", title: "Readiness", subtitle: "Operational score", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "heat", title: "Heat Matrix", subtitle: "Incidents by type × day", colSpan: 2, rowSpan: 1, type: "heatmap" },
      { id: "resol", title: "Resolution Rate", subtitle: "Last 30 days", colSpan: 1, rowSpan: 1, type: "radial" },
      { id: "comp", title: "Incidents vs Deployed", subtitle: "Monthly 2025", colSpan: 2, rowSpan: 1, type: "composed" },
      { id: "comp2", title: "Risk Vector", subtitle: "Primary threat bearing", colSpan: 1, rowSpan: 1, type: "compass" },
      { id: "cal", title: "Annual Volume", subtitle: "2025 · calendar view", colSpan: 3, rowSpan: 1, type: "calendar" },
      { id: "scatter", title: "Density vs Population", subtitle: "Per zone", colSpan: 1, rowSpan: 1, type: "scatter" },
      { id: "bullet", title: "Response vs SLA", subtitle: "10-min target", colSpan: 1, rowSpan: 1, type: "bullet" },
      { id: "spark", title: "Severity Snapshot", subtitle: "Current distribution", colSpan: 1, rowSpan: 1, type: "spark" },
    ],
  },
  weather_station: {
    id: "weather_station",
    label: "Weather Station",
    description: "Weather monitoring preset",
    blocks: [
      // Row 1: Stat cards
      { id: "w-rain", title: "Current Rain", subtitle: "Day · Storm", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "w-sunrise", title: "Sunrise/Sunset", subtitle: "Solar cycle", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "w-moon", title: "Moon Phase", subtitle: "Illumination", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "w-forecast", title: "Local Forecast", subtitle: "Evening", colSpan: 1, rowSpan: 1, type: "stat" },
      // Row 2: Wind gauges and rose
      { id: "w-wind", title: "Wind Speed", subtitle: "Current", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "w-rose", title: "Wind Rose", subtitle: "Distribution", colSpan: 1, rowSpan: 1, type: "windrose" },
      { id: "w-thw", title: "THW Index", subtitle: "Heat risk", colSpan: 1, rowSpan: 1, type: "gauge" },
      // Row 3: Compass and barometer
      { id: "w-compass", title: "Wind Direction", subtitle: "Bearing", colSpan: 1, rowSpan: 1, type: "compass" },
      { id: "w-baro", title: "Barometer Trend", subtitle: "Pressure", colSpan: 2, rowSpan: 1, type: "line" },
      // Row 4: Temperature and trend
      { id: "w-temp-gauge", title: "Temperature/Humidity", subtitle: "Multi-metric", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "w-temp-trend", title: "Temperature Trend", subtitle: "24h", colSpan: 2, rowSpan: 1, type: "area" },
      // Row 5: Humidity and rain bullet
      { id: "w-humidity", title: "Humidity", subtitle: "Current %", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "w-rain-bullet", title: "Total Rain vs Annual", subtitle: "Volume", colSpan: 2, rowSpan: 1, type: "bullet" },
      // Row 6: Calendar heatmap
      { id: "w-calendar", title: "Annual Rainfall", subtitle: "Daily volume", colSpan: 3, rowSpan: 1, type: "calendar" },
    ],
  },
}

export function getPreset(id: PresetId): Preset {
  return PRESETS[id]
}

export function getStoredPreset(): PresetId {
  if (typeof window === "undefined") return "overview"
  const stored = localStorage.getItem("beacon_preset")
  if (stored === "overview" || stored === "weather_station") return stored
  return "overview"
}

export function savePreset(id: PresetId): void {
  localStorage.setItem("beacon_preset", id)
}
