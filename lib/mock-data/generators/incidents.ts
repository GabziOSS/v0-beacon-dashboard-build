import type { Incident, IncidentType, SeverityLevel, IncidentStatus } from '../types'
import { rng, randInt, randFloat, randItem, randWeighted, randNormal } from '../seed'
import { ZONE_DEFINITIONS } from './zones'

// ─── Constants ───────────────────────────────────────────────────────────────

const INCIDENT_COUNT = 500
const START_DATE = new Date('2024-01-01T00:00:00Z')
const END_DATE = new Date('2025-03-07T23:59:59Z')
const TOTAL_MS = END_DATE.getTime() - START_DATE.getTime()

const TYPES: readonly IncidentType[] = [
  'fire',
  'flood',
  'crime',
  'medical',
  'infrastructure',
  'weather',
]
const SEVERITIES: readonly SeverityLevel[] = ['critical', 'high', 'medium', 'low']
const STATUSES: readonly IncidentStatus[] = ['resolved', 'in_progress', 'open']
const STATUS_WEIGHTS = [85, 10, 5] as const

// ─── Seasonal type weights by month (1-indexed: Jan=1) ──────────────────────

// Each row: [fire, flood, crime, medical, infrastructure, weather]
const MONTHLY_TYPE_WEIGHTS: Record<number, number[]> = {
  1: [10, 5, 25, 20, 10, 5], // Jan: crime elevated
  2: [10, 5, 25, 20, 10, 5], // Feb: crime elevated
  3: [25, 5, 15, 20, 10, 5], // Mar: fire season starts
  4: [30, 5, 15, 20, 10, 5], // Apr: peak dry/fire
  5: [30, 5, 15, 20, 10, 5], // May: peak dry/fire
  6: [10, 25, 15, 22, 12, 20], // Jun: typhoon season begins
  7: [8, 30, 15, 22, 14, 22], // Jul: heavy rains
  8: [8, 30, 15, 22, 16, 22], // Aug: peak floods
  9: [8, 28, 15, 22, 18, 20], // Sep: floods + infra aftermath
  10: [8, 25, 15, 22, 16, 18], // Oct: tail of typhoon season
  11: [10, 12, 15, 20, 12, 15], // Nov: weather winding down
  12: [20, 5, 25, 20, 10, 8], // Dec: holiday fires + crime
}

// ─── Severity weights by type ────────────────────────────────────────────────

const SEVERITY_WEIGHTS: Record<IncidentType, number[]> = {
  fire: [15, 35, 35, 15],
  flood: [20, 40, 30, 10],
  crime: [5, 20, 45, 30],
  medical: [25, 30, 30, 15],
  infrastructure: [5, 15, 50, 30],
  weather: [10, 30, 40, 20],
}

// ─── Resolution time by severity ─────────────────────────────────────────────

const RESOLUTION_PARAMS: Record<SeverityLevel, { mean: number; sd: number }> = {
  critical: { mean: 18, sd: 6 },
  high: { mean: 32, sd: 10 },
  medium: { mean: 55, sd: 15 },
  low: { mean: 90, sd: 25 },
}

// ─── Filipino names (Samar / Visayas region) ─────────────────────────────────

const FILIPINO_NAMES = [
  'Juan dela Cruz',
  'Maria Santos',
  'Pedro Magtanggol',
  'Rosa Villanueva',
  'Eduardo Reyes',
  'Lourdes Abalos',
  'Ricardo Dagohoy',
  'Erlinda Catbalogan',
  'Fernando Tangco',
  'Corazon Leyte',
  'Roberto Samar',
  'Teresita Alonzo',
  'Alfredo Balicuatro',
  'Natividad Calbayog',
  'Danilo Espinosa',
  'Gloria Tacloban',
  'Ernesto Rafales',
  'Josefina Gandara',
  'Ramon Villareal',
  'Estrella Pagsanjan',
  'Arturo Candaraman',
  'Remedios Tinambacan',
  'Vicente Mabini',
  'Felisa Oquendo',
  'Antonio Rawis',
  'Milagros Bagacay',
  'Gregorio Nijaga',
  'Concepcion Lonoy',
  'Wilfredo Hamorawon',
  'Dolores San Joaquin',
  'Rodolfo Poblacion',
  'Angelita Sabong',
  'Marcelino Tarangnan',
  'Imelda Cagmanaba',
  'Nestor Guinsorongan',
  'Perpetua Oras',
] as const

// ─── Description templates ───────────────────────────────────────────────────

const DESCRIPTIONS: Record<IncidentType, string[]> = {
  fire: [
    'Residential structure fire reported in {barangay}. Multiple households affected.',
    'Kitchen fire spread to adjacent dwelling in {zone}. Evacuations underway.',
    'Grass fire near {barangay} threatening residential area. Firebreak being established.',
    'Electrical fire at commercial establishment in {zone}. Power cut to block.',
    'Fire from unattended cooking reported in {barangay}. One structure fully involved.',
    'Warehouse fire in {zone} industrial section. Hazmat team requested.',
  ],
  flood: [
    'Flash flooding in {barangay} due to heavy rainfall. Road impassable.',
    'River overflow affecting low-lying areas of {zone}. Evacuations initiated.',
    'Storm surge flooding in coastal sections of {barangay}. Boats deployed.',
    'Drainage overflow causing street-level flooding in {zone} proper.',
    'Landslide and flooding reported in {barangay} upland area. Access road blocked.',
    'Flood waters rising in {zone}. Barangay hall serving as evacuation center.',
  ],
  crime: [
    'Theft reported at residence in {barangay}. Suspect description obtained.',
    'Disturbance at public market in {zone}. Responding officers en route.',
    'Vandalism to public property in {barangay}. CCTV footage being reviewed.',
    'Robbery incident near {zone} commercial area. Victim unharmed.',
    'Illegal gambling operation reported in {barangay}. Coordination with PNP ongoing.',
    'Domestic dispute escalated in {zone}. Mediation team dispatched.',
  ],
  medical: [
    'Medical emergency in {barangay}. Patient experiencing chest pains.',
    'Vehicular accident with injuries reported near {zone}. Ambulance dispatched.',
    'Drowning incident at {barangay} waterway. Rescue swimmers deployed.',
    'Heat stroke case reported in {zone}. Patient being transported to RHU.',
    'Elderly patient with breathing difficulty in {barangay}. EMT responding.',
    'Multiple casualties from food poisoning in {zone}. Health team mobilized.',
  ],
  infrastructure: [
    'Power line down in {barangay} after recent weather. SAMELCO notified.',
    'Road collapse on main thoroughfare in {zone}. Traffic rerouted.',
    'Water main break in {barangay}. Service disrupted to 200+ households.',
    'Bridge structural damage reported in {zone}. Load limit imposed.',
    'Cell tower damage in {barangay} causing communications blackout.',
    'Sinkhole forming on road in {zone}. Area cordoned off.',
  ],
  weather: [
    'Typhoon signal raised for {barangay} area. Pre-emptive evacuations started.',
    'Severe thunderstorm warning for {zone}. All outdoor activities suspended.',
    'Heavy rainfall advisory for {barangay}. Flood watch in effect.',
    'Strong winds damaging rooftops in {zone}. Emergency shelters opened.',
    'Storm surge warning for coastal {barangay}. Fishing boats recalled.',
    'Tropical depression approaching {zone}. DRRMO on full alert.',
  ],
}

// ─── Seasonal date weighting ─────────────────────────────────────────────────

// Higher weight = more incidents in that month
const MONTHLY_VOLUME: Record<number, number> = {
  1: 8,
  2: 7,
  3: 9,
  4: 9,
  5: 9,
  6: 14,
  7: 16,
  8: 16,
  9: 15,
  10: 13,
  11: 10,
  12: 10,
}

function pickWeightedDate(): Date {
  // Pick month first (weighted), then random day/time within that month
  const months = Array.from({ length: 15 }, (_, i) => i) // 0..14 covering Jan 2024 to Mar 2025
  const weights = months.map(i => {
    const m = (i % 12) + 1
    // For months 12-14 (Jan–Mar 2025), use base weight; scale down Mar 2025 since partial
    if (i === 14) return MONTHLY_VOLUME[3]! * 0.23 // ~7 days of March
    return MONTHLY_VOLUME[m]!
  })

  const idx = randWeighted(months, weights)
  const year = idx < 12 ? 2024 : 2025
  const month = idx % 12 // 0-indexed

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const maxDay = year === 2025 && month === 2 ? 7 : daysInMonth // cap Mar 2025 at 7th
  const day = randInt(1, maxDay)
  const hour = randInt(0, 23)
  const minute = randInt(0, 59)
  const second = randInt(0, 59)

  return new Date(Date.UTC(year, month, day, hour, minute, second))
}

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateIncidents(): Incident[] {
  const incidents: Incident[] = []

  for (let i = 0; i < INCIDENT_COUNT; i++) {
    const ts = pickWeightedDate()
    const month = ts.getUTCMonth() + 1 // 1-indexed

    // Pick type based on monthly weights
    const typeWeights = MONTHLY_TYPE_WEIGHTS[month]!
    const type = randWeighted<IncidentType>([...TYPES], typeWeights)

    // Severity based on type
    const severity = randWeighted<SeverityLevel>([...SEVERITIES], SEVERITY_WEIGHTS[type])

    // Status
    const status = randWeighted<IncidentStatus>([...STATUSES], [...STATUS_WEIGHTS])

    // Zone
    const zone = randItem(ZONE_DEFINITIONS)

    // Coordinates scattered around centroid
    const lng = zone.centroid[0] + randFloat(-0.005, 0.005)
    const lat = zone.centroid[1] + randFloat(-0.005, 0.005)

    // Resolution time (only for resolved)
    const { mean, sd } = RESOLUTION_PARAMS[severity]
    const resolutionMinutes =
      status === 'resolved' ? Math.max(3, Math.round(randNormal(mean, sd))) : undefined

    // Responders: based on severity
    const responderRanges: Record<SeverityLevel, [number, number]> = {
      critical: [6, 15],
      high: [4, 10],
      medium: [2, 6],
      low: [1, 3],
    }
    const [rMin, rMax] = responderRanges[severity]
    const respondersAssigned = randInt(rMin, rMax)

    // Reporter
    const reportedBy = randItem(FILIPINO_NAMES)

    // Description
    const template = randItem(DESCRIPTIONS[type])
    const description = template.replace('{barangay}', zone.barangay).replace('{zone}', zone.name)

    // ID
    const year = ts.getUTCFullYear()
    const seq = String(i + 1).padStart(4, '0')
    const id = `INC-${year}-${seq}`

    incidents.push({
      id,
      type,
      severity,
      status,
      zoneId: zone.id,
      zoneName: zone.name,
      barangay: zone.barangay,
      coordinates: [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))],
      timestamp: ts.toISOString(),
      reportedBy,
      respondersAssigned,
      ...(resolutionMinutes !== undefined && { resolutionMinutes }),
      description,
    })
  }

  // Sort by timestamp descending
  incidents.sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return incidents
}
