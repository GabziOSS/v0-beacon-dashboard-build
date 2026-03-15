import type { Zone, RiskLevel } from '../types'
import { rng, randWeighted } from '../seed'

export const ZONE_DEFINITIONS = [
  {
    id: 'z01',
    name: 'Poblacion Central',
    barangay: 'Poblacion 1-2',
    district: 1,
    centroid: [124.5908, 12.0685] as [number, number],
    population: 8200,
    area_km2: 2.1,
  },
  {
    id: 'z02',
    name: 'Bagacay District',
    barangay: 'Bagacay',
    district: 1,
    centroid: [124.598, 12.074] as [number, number],
    population: 5400,
    area_km2: 3.8,
  },
  {
    id: 'z03',
    name: 'Calbayog Port Area',
    barangay: 'Sabong',
    district: 2,
    centroid: [124.582, 12.062] as [number, number],
    population: 6100,
    area_km2: 1.9,
  },
  {
    id: 'z04',
    name: 'Nijaga–San Policarpo',
    barangay: 'Nijaga',
    district: 2,
    centroid: [124.605, 12.055] as [number, number],
    population: 4300,
    area_km2: 5.2,
  },
  {
    id: 'z05',
    name: 'Tinaplacan Valley',
    barangay: 'Tinaplacan',
    district: 3,
    centroid: [124.57, 12.08] as [number, number],
    population: 3800,
    area_km2: 6.7,
  },
  {
    id: 'z06',
    name: 'Rawis Coastal',
    barangay: 'Rawis',
    district: 3,
    centroid: [124.565, 12.05] as [number, number],
    population: 2900,
    area_km2: 4.1,
  },
  {
    id: 'z07',
    name: 'Mabini Heights',
    barangay: 'Mabini',
    district: 4,
    centroid: [124.615, 12.078] as [number, number],
    population: 5700,
    area_km2: 3.3,
  },
  {
    id: 'z08',
    name: 'Rizal East',
    barangay: 'Rizal',
    district: 4,
    centroid: [124.62, 12.06] as [number, number],
    population: 4100,
    area_km2: 2.8,
  },
  {
    id: 'z09',
    name: 'San Joaquin North',
    barangay: 'San Joaquin',
    district: 5,
    centroid: [124.578, 12.095] as [number, number],
    population: 3200,
    area_km2: 7.4,
  },
  {
    id: 'z10',
    name: 'Hamorawon Upland',
    barangay: 'Hamorawon',
    district: 5,
    centroid: [124.555, 12.088] as [number, number],
    population: 2100,
    area_km2: 9.1,
  },
  {
    id: 'z11',
    name: 'Lonoy River Basin',
    barangay: 'Lonoy',
    district: 6,
    centroid: [124.608, 12.042] as [number, number],
    population: 3600,
    area_km2: 5.6,
  },
  {
    id: 'z12',
    name: 'Oquendo Industrial',
    barangay: 'Oquendo',
    district: 6,
    centroid: [124.593, 12.035] as [number, number],
    population: 4800,
    area_km2: 4.4,
  },
] as const

const RISK_LEVELS: readonly RiskLevel[] = ['critical', 'high', 'medium', 'low']

/** Weight profiles: [critical, high, medium, low] */
const CENTRAL_WEIGHTS = [30, 40, 20, 10] as const
const MIDDLE_WEIGHTS = [15, 25, 35, 25] as const
const OUTER_WEIGHTS = [5, 15, 35, 45] as const

function riskWeightsForZone(id: string): readonly number[] {
  const num = parseInt(id.slice(1), 10)
  if (num <= 3) return CENTRAL_WEIGHTS
  if (num >= 9) return OUTER_WEIGHTS
  return MIDDLE_WEIGHTS
}

export function generateZones(incidents: { zoneId: string; timestamp: string }[]): Zone[] {
  // Count incidents and find last incident per zone
  const countMap = new Map<string, number>()
  const lastMap = new Map<string, string>()

  for (const inc of incidents) {
    countMap.set(inc.zoneId, (countMap.get(inc.zoneId) ?? 0) + 1)
    const prev = lastMap.get(inc.zoneId)
    if (!prev || inc.timestamp > prev) {
      lastMap.set(inc.zoneId, inc.timestamp)
    }
  }

  return ZONE_DEFINITIONS.map(def => ({
    id: def.id,
    name: def.name,
    barangay: def.barangay,
    district: def.district,
    population: def.population,
    area_km2: def.area_km2,
    centroid: [def.centroid[0], def.centroid[1]] as [number, number],
    riskLevel: randWeighted([...RISK_LEVELS], [...riskWeightsForZone(def.id)]),
    incidentCount: countMap.get(def.id) ?? 0,
    lastIncident: lastMap.get(def.id) ?? new Date().toISOString(),
  }))
}
