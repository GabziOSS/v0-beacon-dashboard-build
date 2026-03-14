import type { Incident, IncidentType, HeatMatrixRow } from '../types'
import { randInt } from '../seed'

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES: IncidentType[] = [
  'fire',
  'flood',
  'crime',
  'medical',
  'infrastructure',
  'weather',
]

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateHeatMatrix(incidents: Incident[]): HeatMatrixRow[] {
  // Last 30 days ending at 2025-03-07
  const endDate = new Date('2025-03-07')
  const dates: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(endDate)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  const startISO = dates[0]
  const endISO = dates[dates.length - 1]

  // Build lookup: type → date → count
  const lookup: Record<string, Record<string, number>> = {}
  for (const cat of CATEGORIES) {
    lookup[cat] = {}
    for (const d of dates) lookup[cat][d] = 0
  }

  for (const inc of incidents) {
    const d = inc.timestamp.slice(0, 10)
    if (d >= startISO && d <= endISO && lookup[inc.type]?.[d] !== undefined) {
      lookup[inc.type][d]++
    }
  }

  return CATEGORIES.map(category => {
    const values = dates.map(date => {
      // Derive from incidents, add small noise to fill sparse data, cap at ~12
      const base = lookup[category][date]
      const boosted = base + randInt(0, 3)
      return { date, count: Math.min(12, boosted) }
    })
    return { category, values }
  })
}
