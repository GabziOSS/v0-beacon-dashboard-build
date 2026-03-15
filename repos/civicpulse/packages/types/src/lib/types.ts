import type * as React from 'react'

export type IncidentType = 'Fire' | 'Flood' | 'Crime' | 'Medical' | 'Infrastructure' | 'Typhoon'

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type IncidentStatus = 'Active' | 'Responding' | 'Contained' | 'Resolved'

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
  risk: 'Critical' | 'High' | 'Medium' | 'Low'
}

export interface HeatmapCell {
  day: number // 0-29
  category: IncidentType
  count: number
}

export interface CalendarCell {
  date: string
  count: number
}

export interface WindRoseData {
  direction: string
  values: number[] // Speed bin values (e.g. 6 bins as per reference)
}

export interface BulletData {
  actual: number
  target: number
  poor: number
  acceptable: number
  good: number
  max: number
}

// Weather station types
export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'showers'
  | 'snow'
  | 'thunderstorm'
  | 'windy'

export interface ForecastData {
  period: string
  condition: WeatherCondition
  temp: number
  humidity: number
  description: string
}

export interface SunriseSunsetData {
  sunrise: string
  sunset: string
}

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent'

export interface MoonPhaseData {
  phase: MoonPhaseName
  illumination?: number
}

export interface TempHumidityData {
  temperature: number
  humidity: number
  tempMin: number
  tempMax: number
  humMin: number
  humMax: number
}

export interface MultiTempData {
  outsideTemp: number
  heatIndex: number
  wetBulb: number
  min: number
  max: number
}

export interface RainBarData {
  values: Array<{ label: string; value: number }>
  unit: string
  max: number
}

export interface BarometerPoint {
  time: string
  pressure: number
}

// Toast types for hooks
export interface ToastProps {
  id?: string
  variant?: 'default' | 'destructive'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactNode
