// CivicPulse Mock Data Generators
// Realistic safety/risk data for Calbayog City

import type { Incident, Zone, DataPoint, TimeSeries, IncidentCategory, RiskLevel, IncidentStatus } from './types/dashboard'

// Barangays in Calbayog City
export const barangays = [
  'Rawis', 'Dagum', 'Oquendo', 'San Policarpo', 'Tinambacan',
  'Matobato', 'Hamorawon', 'Calbayog Poblacion', 'Nijaga', 'Tarabucan',
  'Bagacay', 'Balud', 'Capoocan', 'Carmen', 'Gadgaran'
]

// Incident categories with weights for realistic distribution
const categoryWeights: Record<IncidentCategory, number> = {
  'natural-disaster': 0.15,
  'infrastructure': 0.20,
  'public-safety': 0.25,
  'health': 0.15,
  'traffic': 0.10,
  'environmental': 0.08,
  'civil-unrest': 0.02,
  'utility': 0.05,
}

// Risk levels distribution
const riskWeights: Record<RiskLevel, number> = {
  'critical': 0.05,
  'high': 0.15,
  'medium': 0.35,
  'low': 0.30,
  'minimal': 0.15,
}

// Status distribution
const statusWeights: Record<IncidentStatus, number> = {
  'active': 0.15,
  'investigating': 0.20,
  'contained': 0.25,
  'resolved': 0.30,
  'monitoring': 0.10,
}

// Helper: weighted random selection
function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let random = Math.random() * total
  
  for (const [key, weight] of entries) {
    random -= weight
    if (random <= 0) return key
  }
  
  return entries[0][0]
}

// Generate random incident
export function generateIncident(id: number, daysAgo: number = 30): Incident {
  const barangay = barangays[Math.floor(Math.random() * barangays.length)]
  const category = weightedRandom(categoryWeights)
  const riskLevel = weightedRandom(riskWeights)
  const status = weightedRandom(statusWeights)
  
  // Calbayog City coordinates with variation
  const lat = 12.0685 + (Math.random() - 0.5) * 0.1
  const lng = 124.5908 + (Math.random() - 0.5) * 0.1
  
  const reportedAt = new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000)
  const updatedAt = new Date(reportedAt.getTime() + Math.random() * 48 * 60 * 60 * 1000)
  
  const categoryTitles: Record<IncidentCategory, string[]> = {
    'natural-disaster': ['Flooding Reported', 'Landslide Risk', 'Storm Damage', 'River Overflow'],
    'infrastructure': ['Road Damage', 'Bridge Inspection', 'Building Collapse Risk', 'Structural Assessment'],
    'public-safety': ['Security Concern', 'Crowd Control Needed', 'Suspicious Activity', 'Emergency Response'],
    'health': ['Medical Emergency', 'Disease Outbreak Alert', 'Hospital Capacity', 'Health Inspection'],
    'traffic': ['Traffic Congestion', 'Road Accident', 'Vehicle Obstruction', 'Signal Malfunction'],
    'environmental': ['Water Contamination', 'Air Quality Alert', 'Waste Management', 'Illegal Dumping'],
    'civil-unrest': ['Public Gathering', 'Protest Activity', 'Community Dispute', 'Labor Action'],
    'utility': ['Power Outage', 'Water Supply Issue', 'Communication Down', 'Gas Leak Report'],
  }
  
  const titles = categoryTitles[category]
  const title = titles[Math.floor(Math.random() * titles.length)]
  
  return {
    id: `INC-${String(id).padStart(5, '0')}`,
    title: `${title} - ${barangay}`,
    description: `Incident reported in Barangay ${barangay}. Assessment and response required.`,
    category,
    status,
    riskLevel,
    location: {
      lat,
      lng,
      barangay,
      zone: `Zone ${Math.floor(Math.random() * 6) + 1}`,
    },
    reportedAt: reportedAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    affectedPopulation: Math.floor(Math.random() * 5000) + 50,
    tags: [category, riskLevel, barangay.toLowerCase()],
  }
}

// Generate incidents batch
export function generateIncidents(count: number = 100): Incident[] {
  return Array.from({ length: count }, (_, i) => generateIncident(i + 1))
}

// Generate time series data for charts
export function generateTimeSeries(
  name: string, 
  days: number = 30, 
  baseValue: number = 50,
  variance: number = 30
): TimeSeries {
  const data: DataPoint[] = []
  let value = baseValue
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    value = Math.max(0, value + (Math.random() - 0.5) * variance)
    
    data.push({
      timestamp: date.toISOString(),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value),
    })
  }
  
  return { id: name, name, data }
}

// Generate category breakdown data
export function generateCategoryBreakdown(): DataPoint[] {
  return [
    { label: 'Public Safety', value: 45 },
    { label: 'Infrastructure', value: 32 },
    { label: 'Natural Disaster', value: 28 },
    { label: 'Health', value: 22 },
    { label: 'Traffic', value: 18 },
    { label: 'Environmental', value: 12 },
    { label: 'Utility', value: 8 },
    { label: 'Civil Unrest', value: 3 },
  ]
}

// Generate risk distribution data
export function generateRiskDistribution(): DataPoint[] {
  return [
    { label: 'Critical', value: 5, color: 'var(--risk-critical)' },
    { label: 'High', value: 15, color: 'var(--risk-high)' },
    { label: 'Medium', value: 35, color: 'var(--risk-medium)' },
    { label: 'Low', value: 30, color: 'var(--risk-low)' },
    { label: 'Minimal', value: 15, color: 'var(--risk-minimal)' },
  ]
}

// Generate zone radar data
export function generateZoneRadarData() {
  return barangays.slice(0, 6).map(name => ({
    zone: name,
    riskScore: Math.floor(Math.random() * 60) + 20,
    incidents: Math.floor(Math.random() * 50) + 5,
    population: Math.floor(Math.random() * 10000) + 2000,
    responseTime: Math.floor(Math.random() * 20) + 5,
    resources: Math.floor(Math.random() * 80) + 20,
  }))
}

// Generate hourly heatmap data
export function generateHourlyHeatmap() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const data: { day: string; hour: number; value: number }[] = []
  
  days.forEach(day => {
    hours.forEach(hour => {
      // Higher values during typical incident hours
      const baseValue = hour >= 8 && hour <= 20 ? 15 : 5
      const dayBonus = ['Fri', 'Sat'].includes(day) ? 5 : 0
      
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 20) + baseValue + dayBonus,
      })
    })
  })
  
  return data
}

// Generate gauge data
export function generateGaugeData(type: 'response-time' | 'risk-score' | 'readiness') {
  const configs = {
    'response-time': { value: 12.4, min: 0, max: 60, unit: 'min', target: 15 },
    'risk-score': { value: 42, min: 0, max: 100, unit: '', target: 30 },
    'readiness': { value: 87, min: 0, max: 100, unit: '%', target: 90 },
  }
  return configs[type]
}

// Generate wind rose / directional data
export function generateDirectionalData() {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const
  
  return directions.map(direction => ({
    direction,
    low: Math.floor(Math.random() * 10) + 2,
    medium: Math.floor(Math.random() * 15) + 5,
    high: Math.floor(Math.random() * 8) + 1,
    critical: Math.floor(Math.random() * 3),
  }))
}

// Generate compass bearing
export function generateCompassBearing() {
  return {
    bearing: Math.floor(Math.random() * 360),
    label: 'Primary Risk Vector',
  }
}

// Generate scatter data
export function generateScatterData() {
  return barangays.slice(0, 10).map(name => ({
    name,
    population: Math.floor(Math.random() * 15000) + 1000,
    incidentDensity: Math.random() * 5 + 0.5,
    riskScore: Math.floor(Math.random() * 100),
  }))
}

// Generate bullet chart data
export function generateBulletData() {
  return {
    actual: 12.4,
    target: 10,
    ranges: [20, 15, 10], // poor, satisfactory, good
    unit: 'min',
    label: 'Response Time vs SLA',
  }
}

// Generate calendar heatmap data (365 days)
export function generateCalendarHeatmap() {
  const data: { date: string; value: number }[] = []
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    // Simulate seasonal patterns
    const month = date.getMonth()
    const baseValue = [6, 8, 10, 12, 14, 20, 25, 22, 18, 14, 10, 8][month]
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * baseValue) + Math.floor(baseValue / 2),
    })
  }
  
  return data
}

// Generate all chart data
export function generateAllChartData() {
  return {
    incidentsTimeline: generateTimeSeries('Incidents', 30, 15, 8),
    responseTimeTrend: generateTimeSeries('Response Time', 30, 12, 4),
    riskScoreTrend: generateTimeSeries('Risk Score', 30, 45, 15),
    categoryBreakdown: generateCategoryBreakdown(),
    riskDistribution: generateRiskDistribution(),
    zoneRadar: generateZoneRadarData(),
    hourlyHeatmap: generateHourlyHeatmap(),
    responseTimeGauge: generateGaugeData('response-time'),
    riskScoreGauge: generateGaugeData('risk-score'),
    readinessGauge: generateGaugeData('readiness'),
    directionalData: generateDirectionalData(),
    compassBearing: generateCompassBearing(),
    scatterData: generateScatterData(),
    bulletData: generateBulletData(),
    calendarHeatmap: generateCalendarHeatmap(),
  }
}
