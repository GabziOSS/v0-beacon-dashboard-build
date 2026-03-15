import type { Incident, IncidentType, TrendPoint, ResponseTrendPoint } from '../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000
const INCIDENT_TYPES: IncidentType[] = [
  'fire',
  'flood',
  'crime',
  'medical',
  'infrastructure',
  'weather',
]

function toDateKey(ts: string): string {
  return ts.slice(0, 10) // YYYY-MM-DD
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateTrends(incidents: Incident[]): {
  trends: TrendPoint[]
  responseTrends: ResponseTrendPoint[]
} {
  const now = new Date('2025-03-07T23:59:59Z')

  // ── Index incidents by date ──────────────────────────────────────────────

  const byDate = new Map<string, Incident[]>()
  for (const inc of incidents) {
    const key = toDateKey(inc.timestamp)
    const arr = byDate.get(key)
    if (arr) arr.push(inc)
    else byDate.set(key, [inc])
  }

  // ── Daily incident counts by type, last 365 days → TrendPoint[] ────────

  const trends: TrendPoint[] = []
  for (let d = 364; d >= 0; d--) {
    const date = formatDate(new Date(now.getTime() - d * DAY_MS))
    const dayIncs = byDate.get(date) ?? []

    const counts: Record<IncidentType, number> = {
      fire: 0,
      flood: 0,
      crime: 0,
      medical: 0,
      infrastructure: 0,
      weather: 0,
    }
    for (const inc of dayIncs) {
      counts[inc.type]++
    }

    trends.push({
      date,
      fire: counts.fire,
      flood: counts.flood,
      crime: counts.crime,
      medical: counts.medical,
      infrastructure: counts.infrastructure,
      weather: counts.weather,
      total: dayIncs.length,
    })
  }

  // ── Response trends, last 90 days → ResponseTrendPoint[] ───────────────

  const responseTrends: ResponseTrendPoint[] = []
  for (let d = 89; d >= 0; d--) {
    const date = formatDate(new Date(now.getTime() - d * DAY_MS))
    const dayIncs = byDate.get(date) ?? []

    const resolved = dayIncs.filter(i => i.resolutionMinutes !== undefined)
    const times = resolved.map(i => i.resolutionMinutes!).sort((a, b) => a - b)

    const avgMinutes =
      times.length > 0
        ? parseFloat((times.reduce((s, v) => s + v, 0) / times.length).toFixed(1))
        : 0

    const p90Minutes =
      times.length > 0 ? (times[Math.floor(times.length * 0.9)] ?? times[times.length - 1]) : 0

    const deployed = dayIncs.reduce((s, i) => s + i.respondersAssigned, 0)

    responseTrends.push({ date, avgMinutes, p90Minutes, deployed })
  }

  return { trends, responseTrends }
}
