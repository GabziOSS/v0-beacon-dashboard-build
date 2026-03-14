import type { Incident, CalendarDay } from '../types'
import { randInt } from '../seed'

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateCalendarData(incidents: Incident[]): CalendarDay[] {
  const startDate = new Date('2024-03-08')
  const endDate = new Date('2025-03-07')

  // Build incident count lookup by date
  const incidentCounts: Record<string, number> = {}
  for (const inc of incidents) {
    const d = inc.timestamp.slice(0, 10)
    incidentCounts[d] = (incidentCounts[d] || 0) + 1
  }

  const days: CalendarDay[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    const dateStr = current.toISOString().slice(0, 10)
    const month = current.getMonth() // 0-indexed
    const dayOfWeek = current.getDay() // 0=Sun, 6=Sat
    const dayOfMonth = current.getDate()

    // Base: actual incident count or small random baseline
    let value = incidentCounts[dateStr] || randInt(0, 2)

    // Apply seasonal multipliers
    let multiplier = 1.0

    // Typhoon season: Jun(5)–Nov(10) → +40%
    if (month >= 5 && month <= 10) multiplier += 0.4

    // February(1) → −20%
    if (month === 1) multiplier -= 0.2

    // Christmas week: Dec 20–26
    if (month === 11 && dayOfMonth >= 20 && dayOfMonth <= 26) multiplier += 0.25

    // Weekends → +15%
    if (dayOfWeek === 0 || dayOfWeek === 6) multiplier += 0.15

    value = Math.max(0, Math.round(value * multiplier))

    // Ensure non-zero for most days with a small baseline
    if (value === 0) value = randInt(0, 1)

    days.push({ date: dateStr, value })

    current.setDate(current.getDate() + 1)
  }

  return days
}
