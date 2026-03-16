export const riskCategories = [
  { name: "Flood", level: "High", score: 82, trend: "+12%", color: "var(--chart-1)" },
  { name: "Typhoon", level: "Critical", score: 94, trend: "+8%", color: "var(--chart-2)" },
  { name: "Landslide", level: "Moderate", score: 58, trend: "-3%", color: "var(--chart-3)" },
  { name: "Earthquake", level: "Low", score: 24, trend: "-1%", color: "var(--chart-4)" },
  { name: "Storm Surge", level: "High", score: 76, trend: "+5%", color: "var(--chart-5)" },
]

export const monthlyIncidents = [
  { month: "Sep", flood: 12, typhoon: 3, landslide: 5, earthquake: 1, surge: 4 },
  { month: "Oct", flood: 18, typhoon: 5, landslide: 8, earthquake: 0, surge: 6 },
  { month: "Nov", flood: 24, typhoon: 8, landslide: 12, earthquake: 2, surge: 9 },
  { month: "Dec", flood: 30, typhoon: 12, landslide: 15, earthquake: 1, surge: 14 },
  { month: "Jan", flood: 22, typhoon: 7, landslide: 9, earthquake: 0, surge: 8 },
  { month: "Feb", flood: 15, typhoon: 4, landslide: 6, earthquake: 1, surge: 5 },
]

export const evacuationData = [
  { name: "Zone A", capacity: 500, occupied: 320 },
  { name: "Zone B", capacity: 800, occupied: 650 },
  { name: "Zone C", capacity: 350, occupied: 120 },
  { name: "Zone D", capacity: 600, occupied: 580 },
  { name: "Zone E", capacity: 450, occupied: 200 },
]

export const populationExposure = [
  { category: "High Risk", value: 34500, fill: "var(--chart-1)" },
  { category: "Medium Risk", value: 52000, fill: "var(--chart-3)" },
  { category: "Low Risk", value: 87000, fill: "var(--chart-4)" },
  { category: "Minimal Risk", value: 126500, fill: "var(--chart-5)" },
]

export const responseTimeData = [
  { hour: "00:00", time: 14 },
  { hour: "03:00", time: 12 },
  { hour: "06:00", time: 8 },
  { hour: "09:00", time: 10 },
  { hour: "12:00", time: 6 },
  { hour: "15:00", time: 9 },
  { hour: "18:00", time: 11 },
  { hour: "21:00", time: 13 },
]

export const infrastructureRisk = [
  { asset: "Bridges", risk: 72, count: 14 },
  { asset: "Roads", risk: 58, count: 47 },
  { asset: "Schools", risk: 41, count: 32 },
  { asset: "Hospitals", risk: 35, count: 8 },
  { asset: "Power Lines", risk: 67, count: 23 },
  { asset: "Water Supply", risk: 53, count: 11 },
]

export const alertHistory = [
  { id: 1, type: "Typhoon Warning", severity: "Critical", time: "2h ago", zone: "All Zones" },
  { id: 2, type: "Flood Advisory", severity: "High", time: "4h ago", zone: "Zone A, B" },
  { id: 3, type: "Landslide Watch", severity: "Moderate", time: "6h ago", zone: "Zone D" },
  { id: 4, type: "Storm Surge Alert", severity: "High", time: "8h ago", zone: "Zone A" },
  { id: 5, type: "Evacuation Order", severity: "Critical", time: "12h ago", zone: "Zone B" },
]

export const mapOverlayZones = [
  {
    id: "flood-zone-a",
    name: "Flood Zone A - San Roque",
    type: "flood" as const,
    severity: "High",
    coordinates: [124.59, 12.07] as [number, number],
    bounds: [[124.57, 12.05], [124.61, 12.09]] as [[number, number], [number, number]],
    population: 8500,
    risk_score: 82,
    description: "Low-lying area along the Catbalogan river prone to flooding during typhoon season.",
    lastIncident: "Feb 14, 2026",
    evacuationCenter: "San Roque Elementary School",
  },
  {
    id: "landslide-zone-b",
    name: "Landslide Zone B - Mercedes Hill",
    type: "landslide" as const,
    severity: "Moderate",
    coordinates: [124.61, 12.085] as [number, number],
    bounds: [[124.595, 12.075], [124.625, 12.095]] as [[number, number], [number, number]],
    population: 3200,
    risk_score: 58,
    description: "Elevated terrain with loose soil composition. History of small landslides.",
    lastIncident: "Jan 28, 2026",
    evacuationCenter: "Mercedes Barangay Hall",
  },
  {
    id: "surge-zone-c",
    name: "Storm Surge Zone C - Port Area",
    type: "surge" as const,
    severity: "Critical",
    coordinates: [124.585, 12.055] as [number, number],
    bounds: [[124.57, 12.045], [124.60, 12.065]] as [[number, number], [number, number]],
    population: 12000,
    risk_score: 94,
    description: "Coastal port area vulnerable to storm surges during typhoons. Critical infrastructure zone.",
    lastIncident: "Feb 20, 2026",
    evacuationCenter: "Catbalogan City Gymnasium",
  },
  {
    id: "flood-zone-d",
    name: "Flood Zone D - Riverside",
    type: "flood" as const,
    severity: "Moderate",
    coordinates: [124.605, 12.065] as [number, number],
    bounds: [[124.59, 12.055], [124.62, 12.075]] as [[number, number], [number, number]],
    population: 5600,
    risk_score: 61,
    description: "Residential area near the river basin. Moderate flooding risk during monsoon.",
    lastIncident: "Dec 5, 2025",
    evacuationCenter: "Riverside Community Center",
  },
  {
    id: "typhoon-zone-e",
    name: "Typhoon Corridor E - Coastal Belt",
    type: "typhoon" as const,
    severity: "High",
    coordinates: [124.575, 12.075] as [number, number],
    bounds: [[124.56, 12.06], [124.59, 12.09]] as [[number, number], [number, number]],
    population: 18500,
    risk_score: 88,
    description: "Primary typhoon corridor with exposure to strong winds. Includes commercial district.",
    lastIncident: "Feb 22, 2026",
    evacuationCenter: "Catbalogan Convention Center",
  },
]
