import type { ChartBlock } from "@/components/dashboard/chart-block"

export type PresetId = "overview" | "weather_station" | "fire" | "flood" | "crime" | "medical" | "infrastructure" | "weather"

export interface Preset {
  id: PresetId
  label: string
  description: string
  icon?: string
  color?: string
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
    description: "NwSSU-AWS weather monitoring",
    blocks: [
      // Row 1: Barometer, Wind Speed, Wind Direction, Total Rain, Current Rain, Temperature
      { id: "w-baro", title: "Barometer", subtitle: "NwSSU-AWS", colSpan: 1, rowSpan: 1, type: "line" },
      { id: "w-wind", title: "Wind Speed", subtitle: "NwSSU_AWS1", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "w-compass", title: "Wind Direction", subtitle: "NwSSU-AWS", colSpan: 1, rowSpan: 1, type: "compass" },
      // Row 2: Forecast, Inside Temp/Hum, Wind Rose, Sunrise/Sunset
      { id: "w-forecast", title: "Local Forecast", subtitle: "NwSSU-AWS", colSpan: 1, rowSpan: 1, type: "forecast" },
      { id: "w-temp-gauge", title: "Inside Temp/Hum", subtitle: "NwSSU-AWS1", colSpan: 1, rowSpan: 1, type: "temp-hum" },
      { id: "w-rose", title: "Wind Rose", subtitle: "NwSSU-AWS1", colSpan: 1, rowSpan: 1, type: "windrose" },
      // Row 3: Moon Phase, Humidity, THW Index
      { id: "w-moon", title: "Moon Phase", subtitle: "NwSSU-AWS", colSpan: 1, rowSpan: 1, type: "moon" },
      { id: "w-humidity", title: "Humidity", subtitle: "NwSSU_AWS1", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "w-thw", title: "THW Index", subtitle: "NwSSU_AWS1", colSpan: 1, rowSpan: 1, type: "gauge" },
      // Row 4: Total Rain, Current Rain, Sunrise/Sunset
      { id: "w-total-rain", title: "Total Rain", subtitle: "NwSSU_AWS1", colSpan: 1, rowSpan: 1, type: "rain" },
      { id: "w-rain", title: "Current Rain", subtitle: "NwSSU_AWS1", colSpan: 1, rowSpan: 1, type: "rain" },
      { id: "w-sunrise", title: "Sunrise/Sunset", subtitle: "NwSSU-AWS1", colSpan: 1, rowSpan: 1, type: "sun" },
      // Row 5: Multi-temperature
      { id: "w-temp-multi", title: "Temperature", subtitle: "NwSSU_AWS1", colSpan: 1, rowSpan: 1, type: "multi-temp" },
      { id: "w-calendar", title: "Annual Rainfall", subtitle: "Daily volume", colSpan: 2, rowSpan: 1, type: "calendar" },
    ],
  },

  fire: {
    id: "fire",
    label: "Fire Response",
    description: "Fire incident monitoring",
    icon: "flame",
    color: "destructive",
    blocks: [
      { id: "f-active", title: "Active Fires", subtitle: "Right now", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "f-units", title: "Units Deployed", subtitle: "Fire trucks + crew", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "f-response", title: "Avg Response", subtitle: "Time to arrival", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "f-contained", title: "Containment Rate", subtitle: "Last 30d", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "f-trend", title: "Fire Incidents", subtitle: "30-day trend", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "f-risk", title: "Fire Risk Index", subtitle: "Weather-based", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "f-type", title: "By Fire Type", subtitle: "Structure / Vegetation / Vehicle", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "f-zone", title: "Fires by Zone", subtitle: "District distribution", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "f-heat", title: "Fire Activity Heat", subtitle: "Day × Hour", colSpan: 2, rowSpan: 1, type: "heatmap" },
      { id: "f-compass", title: "Spread Direction", subtitle: "Wind-driven", colSpan: 1, rowSpan: 1, type: "compass" },
      { id: "f-calendar", title: "Annual Fire Log", subtitle: "2025 daily counts", colSpan: 3, rowSpan: 1, type: "calendar" },
    ],
  },
  flood: {
    id: "flood",
    label: "Flood Monitor",
    description: "Flood and water level tracking",
    icon: "droplets",
    color: "primary",
    blocks: [
      { id: "fl-alerts", title: "Active Warnings", subtitle: "Flood advisories", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "fl-level", title: "River Level", subtitle: "Calbayog River", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "fl-rain", title: "24h Rainfall", subtitle: "Accumulated mm", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "fl-evac", title: "Evacuees", subtitle: "Persons displaced", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "fl-trend", title: "Water Level Trend", subtitle: "72-hour", colSpan: 2, rowSpan: 1, type: "line" },
      { id: "fl-risk", title: "Flood Risk", subtitle: "Composite index", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "fl-zones", title: "Risk by Zone", subtitle: "Vulnerability scores", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "fl-forecast", title: "Rain Forecast", subtitle: "Next 5 days", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "fl-history", title: "Flood Events", subtitle: "Historical comparison", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "fl-calendar", title: "Annual Flood Log", subtitle: "Events by day", colSpan: 3, rowSpan: 1, type: "calendar" },
    ],
  },
  crime: {
    id: "crime",
    label: "Crime Intel",
    description: "Crime statistics and patterns",
    icon: "shield",
    color: "accent",
    blocks: [
      { id: "c-total", title: "Total Crimes", subtitle: "This month", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "c-cleared", title: "Clearance Rate", subtitle: "Cases solved", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "c-response", title: "Avg Response", subtitle: "Police dispatch", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "c-patrols", title: "Active Patrols", subtitle: "Units deployed", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "c-trend", title: "Crime Trend", subtitle: "30-day rolling", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "c-type", title: "By Crime Type", subtitle: "Classification", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "c-time", title: "Time of Day", subtitle: "Incident distribution", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "c-zones", title: "By Zone", subtitle: "Hotspot analysis", colSpan: 1, rowSpan: 1, type: "radar" },
      { id: "c-heat", title: "Crime Heat Map", subtitle: "Day × Hour", colSpan: 2, rowSpan: 1, type: "heatmap" },
      { id: "c-calendar", title: "Annual Crime Log", subtitle: "Daily incidents", colSpan: 3, rowSpan: 1, type: "calendar" },
    ],
  },
  medical: {
    id: "medical",
    label: "Medical EMS",
    description: "Emergency medical services",
    icon: "heart-pulse",
    color: "destructive",
    blocks: [
      { id: "m-calls", title: "Active Calls", subtitle: "EMS dispatch", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "m-units", title: "Units Available", subtitle: "Ambulances", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "m-response", title: "Response Time", subtitle: "Avg minutes", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "m-transport", title: "Transports Today", subtitle: "Hospital runs", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "m-trend", title: "Call Volume", subtitle: "30-day trend", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "m-type", title: "By Emergency Type", subtitle: "Classification", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "m-severity", title: "Severity Distribution", subtitle: "Triage levels", colSpan: 1, rowSpan: 1, type: "radial" },
      { id: "m-dest", title: "Hospital Load", subtitle: "Destination distribution", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "m-heat", title: "EMS Activity", subtitle: "Day × Hour", colSpan: 2, rowSpan: 1, type: "heatmap" },
      { id: "m-calendar", title: "Annual EMS Log", subtitle: "Daily calls", colSpan: 3, rowSpan: 1, type: "calendar" },
    ],
  },
  infrastructure: {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Utilities and public works",
    icon: "wrench",
    color: "warning",
    blocks: [
      { id: "i-issues", title: "Open Issues", subtitle: "Unresolved", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "i-power", title: "Power Outages", subtitle: "Active", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "i-water", title: "Water Issues", subtitle: "Leaks/breaks", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "i-roads", title: "Road Closures", subtitle: "Active", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "i-trend", title: "Issue Trend", subtitle: "30-day rolling", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "i-type", title: "By Type", subtitle: "Issue classification", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "i-resolve", title: "Resolution Time", subtitle: "Avg hours", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "i-zones", title: "By Zone", subtitle: "Distribution", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "i-priority", title: "Priority Queue", subtitle: "Urgency levels", colSpan: 1, rowSpan: 1, type: "radial" },
      { id: "i-bullet", title: "SLA Compliance", subtitle: "vs Target", colSpan: 2, rowSpan: 1, type: "bullet" },
      { id: "i-calendar", title: "Annual Infrastructure Log", subtitle: "Daily issues", colSpan: 3, rowSpan: 1, type: "calendar" },
    ],
  },
  weather: {
    id: "weather",
    label: "Weather Alert",
    description: "Weather monitoring and alerts",
    icon: "cloud-lightning",
    color: "primary",
    blocks: [
      { id: "wx-alert", title: "Active Alerts", subtitle: "Weather warnings", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "wx-temp", title: "Temperature", subtitle: "Current °C", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "wx-wind", title: "Wind Speed", subtitle: "km/h", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "wx-rain", title: "Rainfall", subtitle: "24h mm", colSpan: 1, rowSpan: 1, type: "stat" },
      { id: "wx-trend", title: "Temperature Trend", subtitle: "72-hour", colSpan: 2, rowSpan: 1, type: "line" },
      { id: "wx-compass", title: "Wind Direction", subtitle: "Current bearing", colSpan: 1, rowSpan: 1, type: "compass" },
      { id: "wx-rose", title: "Wind Rose", subtitle: "Distribution", colSpan: 1, rowSpan: 1, type: "windrose" },
      { id: "wx-humidity", title: "Humidity", subtitle: "Relative %", colSpan: 1, rowSpan: 1, type: "gauge" },
      { id: "wx-pressure", title: "Barometer", subtitle: "Pressure trend", colSpan: 2, rowSpan: 1, type: "area" },
      { id: "wx-forecast", title: "5-Day Forecast", subtitle: "Outlook", colSpan: 1, rowSpan: 1, type: "bar" },
      { id: "wx-calendar", title: "Annual Weather Log", subtitle: "Daily conditions", colSpan: 3, rowSpan: 1, type: "calendar" },
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
