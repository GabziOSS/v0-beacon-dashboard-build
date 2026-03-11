export type IncidentType =
  | "Fire"
  | "Flood"
  | "Crime"
  | "Medical"
  | "Infrastructure"
  | "Typhoon"

export type Severity = "Critical" | "High" | "Medium" | "Low"
export type IncidentStatus = "Active" | "Responding" | "Contained" | "Resolved"

export interface Incident {
  id: string
  type: IncidentType
  severity: Severity
  status: IncidentStatus
  zone: string
  barangay: string
  coordinates: [number, number]
  timestamp: string
  responders: number
  duration: number // minutes
  description: string
  reporter: string
}

export interface StatCardData {
  label: string
  value: number
  unit?: string
  delta: number
  deltaLabel: string
  sparkline: number[]
}

export interface TrendPoint {
  time: string
  fire: number
  flood: number
  crime: number
  medical: number
  infrastructure: number
  typhoon: number
}

export interface CategoryBar {
  category: IncidentType
  count: number
}

export interface DistrictRadar {
  district: string
  fire: number
  flood: number
  crime: number
  medical: number
  infrastructure: number
}

export interface ResponseTimePoint {
  time: string
  avg: number
  p90: number
}

export interface ComposedPoint {
  month: string
  incidents: number
  deployed: number
}

export interface ScatterZone {
  zone: string
  population: number
  incidents: number
  area: number
  risk: "Critical" | "High" | "Medium" | "Low"
}

export interface HeatmapCell {
  day: number  // 0-29
  category: IncidentType
  count: number
}

export interface CalendarCell {
  date: string
  count: number
}

export interface WindRoseData {
  direction: string
  low: number
  mid: number
  high: number
}

export interface BulletData {
  actual: number
  target: number
  poor: number
  acceptable: number
  good: number
  max: number
}
