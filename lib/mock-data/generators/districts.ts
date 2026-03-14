import type { Incident, Zone, DistrictRisk } from '../types'
import { randFloat } from '../seed'

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateDistrictRisk(zones: Zone[], incidents: Incident[]): DistrictRisk[] {
  const DISTRICT_NAMES = [
    'District I',
    'District II',
    'District III',
    'District IV',
    'District V',
    'District VI',
  ]

  // Group zones and incidents by district
  const districtZones = new Map<number, Zone[]>()
  const districtIncidents = new Map<number, Incident[]>()

  for (const z of zones) {
    const arr = districtZones.get(z.district)
    if (arr) arr.push(z)
    else districtZones.set(z.district, [z])
  }

  // Map zoneId → district
  const zoneDistrict = new Map<string, number>()
  for (const z of zones) zoneDistrict.set(z.id, z.district)

  for (const inc of incidents) {
    const d = zoneDistrict.get(inc.zoneId)
    if (d === undefined) continue
    const arr = districtIncidents.get(d)
    if (arr) arr.push(inc)
    else districtIncidents.set(d, [inc])
  }

  // Raw values per district
  const raw = {
    incidentRate: [] as number[],
    populationDensity: [] as number[],
    floodRisk: [] as number[],
    crimeIndex: [] as number[],
    infrastructure: [] as number[],
  }

  for (let d = 1; d <= 6; d++) {
    const dZones = districtZones.get(d) ?? []
    const dIncs = districtIncidents.get(d) ?? []

    const totalPop = dZones.reduce((s, z) => s + z.population, 0)
    const totalArea = dZones.reduce((s, z) => s + z.area_km2, 0)

    raw.incidentRate.push(totalPop > 0 ? (dIncs.length / totalPop) * 1000 : 0)
    raw.populationDensity.push(totalArea > 0 ? totalPop / totalArea : 0)
    raw.floodRisk.push(
      dIncs.length > 0 ? (dIncs.filter(i => i.type === 'flood').length / dIncs.length) * 100 : 0
    )
    raw.crimeIndex.push(
      dIncs.length > 0 ? (dIncs.filter(i => i.type === 'crime').length / dIncs.length) * 100 : 0
    )
    raw.infrastructure.push(
      dIncs.length > 0
        ? (dIncs.filter(i => i.type === 'infrastructure').length / dIncs.length) * 100
        : 0
    )
  }

  // Normalize helper: scale array values to 0–100
  function normalize(arr: number[]): number[] {
    const min = Math.min(...arr)
    const max = Math.max(...arr)
    if (max === min) return arr.map(() => 50)
    return arr.map(v => parseFloat((((v - min) / (max - min)) * 100).toFixed(1)))
  }

  const norm = {
    incidentRate: normalize(raw.incidentRate),
    populationDensity: normalize(raw.populationDensity),
    floodRisk: normalize(raw.floodRisk),
    crimeIndex: normalize(raw.crimeIndex),
    infrastructure: normalize(raw.infrastructure),
  }

  return DISTRICT_NAMES.map((name, i) => ({
    district: name,
    incidentRate: norm.incidentRate[i],
    populationDensity: norm.populationDensity[i],
    floodRisk: norm.floodRisk[i],
    crimeIndex: norm.crimeIndex[i],
    infrastructure: norm.infrastructure[i],
  }))
}
