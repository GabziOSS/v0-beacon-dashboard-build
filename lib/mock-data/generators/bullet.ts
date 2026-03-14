import type { Incident, BulletData } from '../types'

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateBulletData(incidents: Incident[]): BulletData {
  // Last 30 days ending at 2025-03-07
  const endDate = new Date('2025-03-07')
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 30)

  const startISO = startDate.toISOString().slice(0, 10)
  const endISO = endDate.toISOString().slice(0, 10)

  // Filter resolved incidents in the last 30 days with resolutionMinutes
  const resolved = incidents.filter(inc => {
    const d = inc.timestamp.slice(0, 10)
    return (
      d >= startISO && d <= endISO && inc.status === 'resolved' && inc.resolutionMinutes != null
    )
  })

  // Mean response time
  let actual = 8.5 // fallback
  if (resolved.length > 0) {
    const sum = resolved.reduce((acc, inc) => acc + inc.resolutionMinutes!, 0)
    actual = Math.round((sum / resolved.length) * 10) / 10
  }

  return {
    label: 'Response Time vs SLA',
    actual,
    target: 10,
    ranges: [20, 10, 6],
    unit: 'min',
  }
}
