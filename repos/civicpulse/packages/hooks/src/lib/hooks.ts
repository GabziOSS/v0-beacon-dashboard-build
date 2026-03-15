'use client'

// useMemo is no longer used in this file
import type {
  StatCardData,
  TrendPoint,
  CategoryBar,
  DistrictRadar,
  ResponseTimePoint,
  ComposedPoint,
  ScatterZone,
  HeatmapCell,
  CalendarCell,
  WindRoseData,
  BulletData,
  Incident,
  ForecastData,
  SunriseSunsetData,
  MoonPhaseData,
  TempHumidityData,
  MultiTempData,
  RainBarData,
  BarometerPoint,
} from '@civicpulse/types'

// ─── useQuery wrapper — hardcoded stub ─────────────────────────────────────
function useQuery<T>(factory: () => T): { data: T; isLoading: false } {
  // For SSR compatibility, just call the factory directly
  // In a real app, this would use React Query or similar
  const data = factory()
  return { data, isLoading: false }
}

// ─── Stat Cards ─────────────────────────────────────────────────────────────
export function useStatCards() {
  return useQuery<StatCardData[]>(() => [
    {
      label: 'Total Incidents',
      value: 1284,
      delta: 12.4,
      deltaLabel: 'vs last week',
      sparkline: [48, 52, 61, 55, 70, 63, 78],
    },
    {
      label: 'Active Alerts',
      value: 17,
      delta: -8.2,
      deltaLabel: 'vs yesterday',
      sparkline: [22, 19, 25, 18, 21, 17, 17],
    },
    {
      label: 'High-Risk Zones',
      value: 6,
      delta: 20.0,
      deltaLabel: 'vs last month',
      sparkline: [3, 4, 4, 5, 5, 6, 6],
    },
    {
      label: 'Avg Response',
      value: 8.4,
      unit: 'min',
      delta: -5.6,
      deltaLabel: 'vs SLA (10 min)',
      sparkline: [11, 10, 9.5, 9, 8.8, 8.5, 8.4],
    },
  ])
}

// ─── Incident Trend (Line) ───────────────────────────────────────────────────
export function useIncidentTrend() {
  return useQuery<TrendPoint[]>(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const h = String(i).padStart(2, '0')
      return {
        time: `${h}:00`,
        fire: Math.round(2 + Math.random() * 6),
        flood: Math.round(1 + Math.random() * 4),
        crime: Math.round(3 + Math.random() * 8),
        medical: Math.round(4 + Math.random() * 10),
        infrastructure: Math.round(1 + Math.random() * 3),
        typhoon: Math.round(0 + Math.random() * 2),
      }
    })
    return hours
  })
}

// ─── Category Bar ───────────────────────────────────────────────────────────
export function useCategoryBar() {
  return useQuery<CategoryBar[]>(() => [
    { category: 'Medical', count: 412 },
    { category: 'Crime', count: 318 },
    { category: 'Fire', count: 201 },
    { category: 'Flood', count: 174 },
    { category: 'Infrastructure', count: 122 },
    { category: 'Typhoon', count: 57 },
  ])
}

// ─── District Radar ─────────────────────────────────────────────────────────
export function useDistrictRadar() {
  return useQuery<DistrictRadar[]>(() => [
    { district: 'District I', fire: 72, flood: 85, crime: 60, medical: 78, infrastructure: 55 },
    { district: 'District II', fire: 55, flood: 65, crime: 80, medical: 62, infrastructure: 70 },
    { district: 'District III', fire: 40, flood: 45, crime: 50, medical: 55, infrastructure: 40 },
    { district: 'District IV', fire: 65, flood: 70, crime: 45, medical: 80, infrastructure: 60 },
    { district: 'District V', fire: 80, flood: 60, crime: 70, medical: 45, infrastructure: 85 },
    { district: 'District VI', fire: 50, flood: 90, crime: 55, medical: 70, infrastructure: 65 },
  ])
}

// ─── City Risk Score (Gauge) ─────────────────────────────────────────────────
export function useCityRiskScore() {
  return useQuery<{ value: number; label: string }>(() => ({
    value: 67,
    label: 'Elevated',
  }))
}

// ─── Readiness Score (Gauge) ─────────────────────────────────────────────────
export function useReadinessScore() {
  return useQuery<{ value: number; label: string }>(() => ({
    value: 82,
    label: 'Operational',
  }))
}

// ─── Response Time Area ──────────────────────────────────────────────────────
export function useResponseTime() {
  return useQuery<ResponseTimePoint[]>(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const base = 8 + Math.sin(i * 0.4) * 1.5
      return {
        time: `Day ${i + 1}`,
        avg: parseFloat((base + Math.random() * 0.8).toFixed(1)),
        p90: parseFloat((base + 3 + Math.random() * 1.5).toFixed(1)),
      }
    })
  })
}

// ─── Resolution Rate (Radial) ────────────────────────────────────────────────
export function useResolutionRate() {
  return useQuery<{ value: number }>(() => ({ value: 87 }))
}

// ─── Composed — Incidents vs Deployed ────────────────────────────────────────
export function useComposedData() {
  return useQuery<ComposedPoint[]>(() => [
    { month: 'Jan', incidents: 98, deployed: 42 },
    { month: 'Feb', incidents: 112, deployed: 48 },
    { month: 'Mar', incidents: 87, deployed: 38 },
    { month: 'Apr', incidents: 134, deployed: 56 },
    { month: 'May', incidents: 145, deployed: 60 },
    { month: 'Jun', incidents: 168, deployed: 68 },
    { month: 'Jul', incidents: 192, deployed: 74 },
    { month: 'Aug', incidents: 215, deployed: 80 },
    { month: 'Sep', incidents: 178, deployed: 72 },
    { month: 'Oct', incidents: 144, deployed: 58 },
    { month: 'Nov', incidents: 122, deployed: 50 },
    { month: 'Dec', incidents: 108, deployed: 44 },
  ])
}

// ─── Scatter — Density vs Population ─────────────────────────────────────────
export function useScatterData() {
  return useQuery<ScatterZone[]>(() => [
    { zone: 'Poblacion', population: 28500, incidents: 312, area: 8, risk: 'Critical' },
    { zone: 'Tinambacan', population: 18200, incidents: 198, area: 12, risk: 'High' },
    { zone: 'Oquendo', population: 15600, incidents: 145, area: 15, risk: 'High' },
    { zone: 'Bagacay', population: 22100, incidents: 224, area: 10, risk: 'Critical' },
    { zone: 'Mabini', population: 9800, incidents: 87, area: 20, risk: 'Medium' },
    { zone: 'San Policarpo', population: 7400, incidents: 54, area: 25, risk: 'Low' },
    { zone: 'Hamorawon', population: 5200, incidents: 38, area: 30, risk: 'Low' },
    { zone: 'Lonoy', population: 11300, incidents: 110, area: 18, risk: 'Medium' },
    { zone: 'Panlayahan', population: 8700, incidents: 92, area: 22, risk: 'Medium' },
    { zone: 'Bayo', population: 13400, incidents: 134, area: 14, risk: 'High' },
  ])
}

// ─── Timeline Heatmap ────────────────────────────────────────────────────────
export function useTimelineHeatmap() {
  return useQuery<HeatmapCell[]>(() => {
    const categories = ['Fire', 'Flood', 'Crime', 'Medical', 'Infrastructure', 'Typhoon'] as const
    const cells: HeatmapCell[] = []
    for (const category of categories) {
      for (let day = 0; day < 30; day++) {
        cells.push({ day, category, count: Math.round(Math.random() * 12) })
      }
    }
    return cells
  })
}

// ─── Calendar Heatmap ────────────────────────────────────────────────────────
// Pre-computed stable data to avoid SSR/client hydration mismatch
const CALENDAR_DATA: CalendarCell[] = (() => {
  // Deterministic pseudo-random using index as seed
  function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const cells: CalendarCell[] = []
  // Start from Monday Jan 6, 2025
  const startYear = 2025
  const startMonth = 0 // January
  const startDay = 6

  for (let i = 0; i < 52 * 7; i++) {
    const dayOffset = i
    const totalDays = startDay + dayOffset
    const date = new Date(Date.UTC(startYear, startMonth, totalDays))
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    const rand = seededRandom(i + 1)
    cells.push({
      date: dateStr,
      count: rand < 0.3 ? 0 : Math.round(rand * rand * 18),
    })
  }
  return cells
})()

export function useCalendarHeatmap() {
  return useQuery<CalendarCell[]>(() => CALENDAR_DATA)
}

// ─── Wind Rose (Incident Origin Direction) ───────────────────────────────────
export function useWindRose() {
  return useQuery<WindRoseData[]>(() => [
    { direction: 'N', values: [12, 18, 8, 5, 3, 2] },
    { direction: 'NE', values: [20, 32, 14, 10, 6, 4] },
    { direction: 'E', values: [15, 22, 9, 7, 4, 3] },
    { direction: 'SE', values: [28, 40, 18, 12, 8, 5] },
    { direction: 'S', values: [22, 35, 16, 11, 7, 4] },
    { direction: 'SW', values: [10, 14, 6, 4, 2, 1] },
    { direction: 'W', values: [8, 12, 5, 3, 2, 1] },
    { direction: 'NW', values: [16, 24, 11, 8, 5, 3] },
  ])
}

// ─── Risk Vector (Compass) ───────────────────────────────────────────────────
export function useRiskVector() {
  return useQuery<{ bearing: number; label: string }>(() => ({
    bearing: 148,
    label: 'SE — Coastal Sector',
  }))
}

// ─── Bullet Chart (Response vs SLA) ─────────────────────────────────────────
export function useBulletData() {
  return useQuery<BulletData>(() => ({
    actual: 8.4,
    target: 10,
    poor: 15,
    acceptable: 10,
    good: 7,
    max: 20,
  }))
}

// ─── Spark Bar ────────────────────────────────────────────────────────────────
export function useSparkBar() {
  return useQuery<Array<{ label: string; value: number; color: string }>>(() => [
    { label: 'Critical', value: 17, color: 'var(--destructive)' },
    { label: 'High', value: 48, color: 'var(--warning)' },
    { label: 'Medium', value: 112, color: 'var(--chart-1)' },
    { label: 'Low', value: 203, color: 'var(--success)' },
  ])
}

// ─── Incidents Table ─────────────────────────────────────────────────────────
export function useIncidents() {
  return useQuery<Incident[]>(() => [
    {
      id: 'INC-2025-0841',
      type: 'Fire',
      severity: 'Critical',
      status: 'Active',
      zone: 'Poblacion',
      barangay: 'Barangay 1 - Aguit-itan',
      coordinates: [12.073, 124.007],
      timestamp: '2025-03-08T06:32:00',
      responders: 12,
      duration: 47,
      description:
        'Commercial structure fire at Maharlika Highway, spreading to adjacent buildings.',
      reporter: 'Rosario Mendoza',
    },
    {
      id: 'INC-2025-0840',
      type: 'Medical',
      severity: 'High',
      status: 'Responding',
      zone: 'Tinambacan',
      barangay: 'Barangay Tinambacan Norte',
      coordinates: [12.065, 124.012],
      timestamp: '2025-03-08T06:18:00',
      responders: 4,
      duration: 62,
      description: 'Mass casualty event — vehicular collision involving passenger jeepney.',
      reporter: 'Eduardo Santos',
    },
    {
      id: 'INC-2025-0839',
      type: 'Flood',
      severity: 'High',
      status: 'Active',
      zone: 'Bagacay',
      barangay: 'Barangay Bagacay',
      coordinates: [12.054, 124.02],
      timestamp: '2025-03-08T05:45:00',
      responders: 8,
      duration: 115,
      description: 'Rising floodwaters in low-lying residential areas, evacuation in progress.',
      reporter: 'Ligaya Reyes',
    },
    {
      id: 'INC-2025-0838',
      type: 'Crime',
      severity: 'Medium',
      status: 'Responding',
      zone: 'Oquendo',
      barangay: 'Barangay Oquendo',
      coordinates: [12.081, 124.005],
      timestamp: '2025-03-08T04:12:00',
      responders: 3,
      duration: 148,
      description: 'Armed robbery incident at local market. Suspects last seen heading north.',
      reporter: 'Bernardo Cruz',
    },
    {
      id: 'INC-2025-0837',
      type: 'Infrastructure',
      severity: 'Medium',
      status: 'Contained',
      zone: 'Mabini',
      barangay: 'Barangay Mabini',
      coordinates: [12.069, 124.03],
      timestamp: '2025-03-08T03:30:00',
      responders: 6,
      duration: 225,
      description:
        'Power line down across main road. Traffic rerouted, LEYTE SAMAR AREA power advised.',
      reporter: 'Amelita Torres',
    },
    {
      id: 'INC-2025-0836',
      type: 'Typhoon',
      severity: 'Critical',
      status: 'Active',
      zone: 'Poblacion',
      barangay: 'Barangay 2 - Bagong Lipunan',
      coordinates: [12.074, 124.006],
      timestamp: '2025-03-08T02:00:00',
      responders: 20,
      duration: 360,
      description:
        'Typhoon Rosita making landfall. Category 4. Storm surge warning levels 1–4 active.',
      reporter: 'System — PAGASA Feed',
    },
    {
      id: 'INC-2025-0835',
      type: 'Medical',
      severity: 'Low',
      status: 'Resolved',
      zone: 'San Policarpo',
      barangay: 'Barangay San Policarpo',
      coordinates: [12.058, 124.018],
      timestamp: '2025-03-07T23:55:00',
      responders: 2,
      duration: 28,
      description: 'Cardiac event. Patient transported to CSRMH. Stable condition on arrival.',
      reporter: 'Perla Villanueva',
    },
    {
      id: 'INC-2025-0834',
      type: 'Fire',
      severity: 'High',
      status: 'Resolved',
      zone: 'Lonoy',
      barangay: 'Barangay Lonoy',
      coordinates: [12.062, 124.026],
      timestamp: '2025-03-07T21:10:00',
      responders: 9,
      duration: 84,
      description:
        'Residential fire contained after approximately 90 minutes. Two structures damaged.',
      reporter: 'Danilo Castillo',
    },
  ])
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEATHER STATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Barometer (Pressure over time) ───────────────────────────────────────────
export function useBarometer() {
  return useQuery<BarometerPoint[]>(() => {
    const base = 760 // mm Hg
    return Array.from({ length: 8 }, (_, i) => ({
      time: `${3 + i}PM`,
      pressure: parseFloat((base + Math.sin(i * 0.8) * 5 - i * 0.3).toFixed(1)),
    }))
  })
}

// ─── Wind Speed Gauge ─────────────────────────────────────────────────────────
export function useWindSpeed() {
  return useQuery<{ value: number; unit: string }>(() => ({
    value: 7,
    unit: 'km/h',
  }))
}

// ─── Humidity Gauge ───────────────────────────────────────────────────────────
export function useHumidity() {
  return useQuery<{ value: number }>(() => ({
    value: 88,
  }))
}

// ─── THW Index Gauge ──────────────────────────────────────────────────────────
export function useTHWIndex() {
  return useQuery<{ value: number; unit: string }>(() => ({
    value: 28,
    unit: '°C',
  }))
}

// ─── Local Forecast ───────────────────────────────────────────────────────────
export function useLocalForecast() {
  return useQuery<ForecastData[]>(() => [
    {
      period: 'Afternoon',
      condition: 'sunny',
      temp: 31,
      humidity: 15,
      description: 'Sunny',
    },
    {
      period: 'Evening',
      condition: 'showers',
      temp: 26,
      humidity: 21,
      description: 'Passing Showers',
    },
    {
      period: 'Night',
      condition: 'cloudy',
      temp: 24,
      humidity: 45,
      description: 'Partly Cloudy',
    },
  ])
}

// ─── Sunrise/Sunset ───────────────────────────────────────────────────────────
export function useSunriseSunset() {
  return useQuery<SunriseSunsetData>(() => ({
    sunrise: '5:54 AM',
    sunset: '5:52 PM',
  }))
}

// ─── Moon Phase ───────────────────────────────────────────────────────────────
export function useMoonPhase() {
  return useQuery<MoonPhaseData>(() => ({
    phase: 'Waning Gibbous',
    illumination: 78,
  }))
}

// ─── Inside Temp/Humidity ─────────────────────────────────────────────────────
export function useInsideTempHum() {
  return useQuery<TempHumidityData>(() => ({
    temperature: 28,
    humidity: 66,
    tempMin: 0,
    tempMax: 30,
    humMin: 0,
    humMax: 100,
  }))
}

// ─── Multi-Temperature (Outside, Heat Index, Wet Bulb) ────────────────────────
export function useMultiTemp() {
  return useQuery<MultiTempData>(() => ({
    outsideTemp: 26,
    heatIndex: 26,
    wetBulb: 28,
    min: 0,
    max: 50,
  }))
}

// ─── Total Rain ───────────────────────────────────────────────────────────────
export function useTotalRain() {
  return useQuery<RainBarData>(() => ({
    values: [
      { label: 'Month', value: 6.8 },
      { label: 'Year', value: 2471.6 },
    ],
    unit: 'mm',
    max: 4000,
  }))
}

// ─── Current Rain (Storm Rate) ────────────────────────────────────────────────
export function useCurrentRain() {
  return useQuery<RainBarData>(() => ({
    values: [
      { label: 'day', value: 1.6 },
      { label: 'Storm Rate', value: 1.6 },
    ],
    unit: 'mm',
    max: 4,
  }))
}
