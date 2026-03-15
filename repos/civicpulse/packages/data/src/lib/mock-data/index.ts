/**
 * Mock Data Module — Pre-generated data for Beacon Dashboard
 *
 * This module generates all safety and weather data consumed by the dashboard,
 * map, table, and category views. All data is deterministic (seeded RNG) and
 * stable across runs.
 *
 * No React/Next.js imports. No side effects. Safe to import from any context.
 */

import type {
  Incident,
  Zone,
  Metric,
  TrendPoint,
  ResponseTrendPoint,
  DistrictRisk,
  DirectionData,
  HeatMatrixRow,
  CalendarDay,
  BulletData,
  WeatherData,
  MockUser,
} from './types'

import { generateIncidents } from './generators/incidents'
import { generateZones } from './generators/zones'
import { generateZonesGeoJSON } from './generators/zones-geojson'
import { generateMetrics } from './generators/metrics'
import { generateTrends } from './generators/trends'
import { generateDistrictRisk } from './generators/districts'
import { generateDirectionData } from './generators/direction'
import { generateHeatMatrix } from './generators/heatmap'
import { generateCalendarData } from './generators/calendar'
import { generateBulletData } from './generators/bullet'
import { generateWeather } from './generators/weather'
import { generateUsers } from './generators/users'

// ─── Pre-generate all data at module load ────────────────────────────────────

/** All incidents (500 total, 2024-01-01 to 2025-03-07) */
export const INCIDENTS: Incident[] = generateIncidents()

/** All zones (12 total, around Calbayog City) */
export const ZONES: Zone[] = generateZones(INCIDENTS)

/** GeoJSON FeatureCollection of zone polygons */
export const ZONES_GEOJSON = generateZonesGeoJSON(ZONES)

/** KPI metrics (4 stat cards) */
export const METRICS: Metric[] = generateMetrics(INCIDENTS, ZONES)

/** Daily incident counts by type (365 days) */
export const TREND: TrendPoint[] = generateTrends(INCIDENTS).trends

/** Daily response time + deployed (90 days) */
export const RESPONSE_TREND: ResponseTrendPoint[] = generateTrends(INCIDENTS).responseTrends

/** District risk profiles (6 districts × 5 dimensions) */
export const DISTRICT_RISK: DistrictRisk[] = generateDistrictRisk(ZONES, INCIDENTS)

/** Incident origin direction data (8 compass points) */
export const DIRECTION_DATA: DirectionData[] = generateDirectionData(INCIDENTS)

/** Heat matrix (6 categories × 30 days) */
export const HEAT_MATRIX: HeatMatrixRow[] = generateHeatMatrix(INCIDENTS)

/** Calendar data (365 days) */
export const CALENDAR_DATA: CalendarDay[] = generateCalendarData(INCIDENTS)

/** Response time vs SLA bullet chart */
export const BULLET_DATA: BulletData = generateBulletData(INCIDENTS)

/** Weather data (wind, temp, rain, barometer, etc.) */
export const WEATHER: WeatherData = generateWeather()

/** Mock users (12 total) */
export const USERS: MockUser[] = generateUsers()

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/**
 * Get a zone by ID
 */
export function getZoneById(id: string): Zone | undefined {
  return ZONES.find(z => z.id === id)
}

/**
 * Get all incidents in a zone
 */
export function getIncidentsByZone(zoneId: string): Incident[] {
  return INCIDENTS.filter(i => i.zoneId === zoneId)
}

/**
 * Get all incidents of a specific type
 */
export function getIncidentsByType(type: string): Incident[] {
  return INCIDENTS.filter(i => i.type === type)
}

/**
 * Get recent incidents (last N days, default 7)
 */
export function getRecentIncidents(days = 7): Incident[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  return INCIDENTS.filter(i => i.timestamp >= cutoffStr)
}

/**
 * Get incidents within a date range (inclusive)
 */
export function getIncidentsByDateRange(start: string, end: string): Incident[] {
  return INCIDENTS.filter(i => i.timestamp >= start && i.timestamp <= end)
}

// ─── DATA_REGISTRY ───────────────────────────────────────────────────────────

/**
 * DATA_REGISTRY maps dataKey strings (used in ChartBlock.dataKey)
 * to their resolved data. Must cover every dataKey in PRESETS.
 *
 * This is the single source of truth for all chart data.
 */
export const DATA_REGISTRY: Record<string, unknown> = {
  // Metrics (stat cards)
  'metrics.incidents_total': METRICS.find(m => m.key === 'incidents_total'),
  'metrics.alerts_active': METRICS.find(m => m.key === 'alerts_active'),
  'metrics.zones_high_risk': METRICS.find(m => m.key === 'zones_high_risk'),
  'metrics.response_time_avg': METRICS.find(m => m.key === 'response_time_avg'),

  // Trends
  'trend.incidents': TREND,
  'trend.response': RESPONSE_TREND,

  // Districts
  'district.risk': DISTRICT_RISK,

  // Direction
  'direction.incidents': DIRECTION_DATA,

  // Heatmaps
  'heatmap.timeline': HEAT_MATRIX,
  'heatmap.calendar': CALENDAR_DATA,

  // Bullet
  'bullet.response_sla': BULLET_DATA,

  // Weather
  'weather.wind_speed': WEATHER.windSpeed,
  'weather.wind_bearing': WEATHER.windBearing,
  'weather.thw_index': WEATHER.twhIndex,
  'weather.humidity': WEATHER.humidity,
  'weather.barometer': WEATHER.barometer,
  'weather.temp_trend': WEATHER.tempTrend,
  'weather.temp_grouped': WEATHER.tempGrouped,
  'weather.current_rain': WEATHER.currentRain,
  'weather.total_rain': WEATHER.totalRain,
  'weather.rain_calendar': WEATHER.rainCalendar,
  'weather.sunrise': WEATHER.sunrise,
  'weather.sunset': WEATHER.sunset,
  'weather.moon_phase': WEATHER.moonPhase,
  'weather.moon_illumination': WEATHER.moonIllumination,
  'weather.forecast': WEATHER.forecast,

  // Zones
  'zones.all': ZONES,
  'zones.geojson': ZONES_GEOJSON,

  // Incidents
  'incidents.all': INCIDENTS,

  // Users
  'users.all': USERS,
}

// ─── Type exports ────────────────────────────────────────────────────────────

export type {
  Incident,
  Zone,
  Metric,
  TrendPoint,
  ResponseTrendPoint,
  DistrictRisk,
  DirectionData,
  HeatMatrixRow,
  CalendarDay,
  BulletData,
  WeatherData,
  MockUser,
} from './types'
