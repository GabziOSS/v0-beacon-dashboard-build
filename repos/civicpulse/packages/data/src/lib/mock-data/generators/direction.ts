import type { Incident, DirectionData, DirectionBin } from '../types'
import { randInt } from '../seed'

// ─── Constants ───────────────────────────────────────────────────────────────

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const
const CITY_CENTER: [number, number] = [124.59, 12.07] // [lng, lat]

const BIN_LABELS = ['0–5', '5–10', '10+'] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Compute bearing (0–360°) from city center to a point. 0°=N, 90°=E */
function bearing(lng: number, lat: number): number {
  const dLng = ((lng - CITY_CENTER[0]) * Math.PI) / 180
  const lat1 = (CITY_CENTER[1] * Math.PI) / 180
  const lat2 = (lat * Math.PI) / 180

  const x = Math.sin(dLng) * Math.cos(lat2)
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  const deg = ((Math.atan2(x, y) * 180) / Math.PI + 360) % 360
  return deg
}

/** Map a bearing to one of 8 compass directions */
function toDirection(deg: number): (typeof DIRECTIONS)[number] {
  // Each sector is 45°, centered on the cardinal/ordinal direction
  const idx = Math.round(deg / 45) % 8
  return DIRECTIONS[idx]
}

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateDirectionData(incidents: Incident[]): DirectionData[] {
  // Count incidents per direction
  const counts: Record<string, number> = {}
  for (const d of DIRECTIONS) counts[d] = 0

  for (const inc of incidents) {
    const [lng, lat] = inc.coordinates
    const dir = toDirection(bearing(lng, lat))
    counts[dir]++
  }

  // Bias: boost NE (typhoon corridor) and S (coastal)
  counts['NE'] = Math.round(counts['NE'] * 1.4)
  counts['S'] = Math.round(counts['S'] * 1.3)

  return DIRECTIONS.map(direction => {
    const total = counts[direction]
    // Split into 3 bins: low (0-5km), mid (5-10km), high (10+km)
    const lowShare = 0.5
    const midShare = 0.3
    const highShare = 0.2

    const bins: DirectionBin[] = [
      { range: BIN_LABELS[0], value: Math.max(1, Math.round(total * lowShare) + randInt(-2, 2)) },
      { range: BIN_LABELS[1], value: Math.max(0, Math.round(total * midShare) + randInt(-1, 1)) },
      { range: BIN_LABELS[2], value: Math.max(0, Math.round(total * highShare) + randInt(-1, 1)) },
    ]

    return { direction, bins }
  })
}
