// ─── Core Enums ──────────────────────────────────────────────────────────────

export type IncidentType = 'fire' | 'flood' | 'crime' | 'medical' | 'infrastructure' | 'weather'

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'in_progress' | 'resolved'
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

// ─── Incident ────────────────────────────────────────────────────────────────

export interface Incident {
  id: string
  type: IncidentType
  severity: SeverityLevel
  status: IncidentStatus
  zoneId: string
  zoneName: string
  barangay: string
  coordinates: [number, number] // [lng, lat] GeoJSON order
  timestamp: string // ISO 8601
  reportedBy: string // Filipino name
  respondersAssigned: number
  resolutionMinutes?: number
  description: string
}

// ─── Zone ────────────────────────────────────────────────────────────────────

export interface Zone {
  id: string // z01–z12
  name: string
  barangay: string
  district: number // 1–6
  population: number
  area_km2: number
  riskLevel: RiskLevel
  centroid: [number, number] // [lng, lat]
  incidentCount: number
  lastIncident: string
}

// ─── Metrics (KPI stat cards) ────────────────────────────────────────────────

export interface Metric {
  key: string
  label: string
  value: number
  unit: string
  delta: number // % change vs previous period
  deltaLabel: string
  sparkData: number[] // 7 data points
  positiveIsGood: boolean
}

// ─── Trends ──────────────────────────────────────────────────────────────────

export interface TrendPoint {
  date: string // YYYY-MM-DD
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

// ─── District Risk (Radar) ───────────────────────────────────────────────────

export interface DistrictRisk {
  district: string
  incidentRate: number
  infrastructure: number
  populationDensity: number
  floodRisk: number
  crimeIndex: number
}

// ─── Direction (Wind Rose / Incident Origin) ─────────────────────────────────

export interface DirectionBin {
  range: string
  value: number
}

export interface DirectionData {
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
  bins: DirectionBin[]
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

export interface HeatMatrixRow {
  category: IncidentType
  values: Array<{ date: string; count: number }>
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export interface CalendarDay {
  date: string // YYYY-MM-DD
  value: number
}

// ─── Bullet Chart ────────────────────────────────────────────────────────────

export interface BulletData {
  label: string
  actual: number
  target: number
  ranges: [number, number, number] // poor / acceptable / good thresholds
  unit: string
}

// ─── Weather ─────────────────────────────────────────────────────────────────

export interface WeatherData {
  windSpeed: number // km/h
  windBearing: number // degrees
  twhIndex: number // °C
  humidity: number // %
  barometer: Array<{ time: string; pressure: number }>
  tempTrend: Array<{ time: string; temp: number; humidity: number }>
  tempGrouped: { outside: number; heatIndex: number; wetBulb: number }
  currentRain: { day: number; storm: number; rate: number }
  totalRain: BulletData
  rainCalendar: CalendarDay[]
  sunrise: string // HH:mm
  sunset: string // HH:mm
  moonPhase: string
  moonIllumination: number
  forecast: { condition: string; temp: number; humidity: number }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'analyst' | 'responder' | 'viewer'
  avatar: string // initials
  org: string
  zones: string[]
  lastLogin: string
  status: 'active' | 'inactive'
}
