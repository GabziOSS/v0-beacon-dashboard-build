import type { Incident, Zone, Metric } from '../types'
import { randFloat } from '../seed'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000

function daysAgo(n: number, anchor: Date): Date {
  return new Date(anchor.getTime() - n * DAY_MS)
}

function inRange(ts: string, from: Date, to: Date): boolean {
  const t = new Date(ts).getTime()
  return t >= from.getTime() && t <= to.getTime()
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return parseFloat((((current - previous) / previous) * 100).toFixed(1))
}

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateMetrics(incidents: Incident[], zones: Zone[]): Metric[] {
  const now = new Date('2025-03-07T23:59:59Z')
  const d30 = daysAgo(30, now)
  const d60 = daysAgo(60, now)
  const d1 = daysAgo(1, now)
  const d2 = daysAgo(2, now)

  const last30 = incidents.filter(i => inRange(i.timestamp, d30, now))
  const prior30 = incidents.filter(i => inRange(i.timestamp, d60, d30))
  const yesterday = incidents.filter(i => inRange(i.timestamp, d1, now))
  const dayBefore = incidents.filter(i => inRange(i.timestamp, d2, d1))

  // ── incidents_total ──────────────────────────────────────────────────────

  // Spark data: daily totals for last 7 days
  const spark: number[] = []
  for (let d = 6; d >= 0; d--) {
    const dayStart = daysAgo(d + 1, now)
    const dayEnd = daysAgo(d, now)
    spark.push(incidents.filter(i => inRange(i.timestamp, dayStart, dayEnd)).length)
  }

  const incidentsTotal: Metric = {
    key: 'incidents_total',
    label: 'Total Incidents',
    value: last30.length,
    unit: '',
    delta: pctChange(last30.length, prior30.length),
    deltaLabel: 'vs prior 30d',
    sparkData: spark,
    positiveIsGood: false,
  }

  // ── alerts_active ────────────────────────────────────────────────────────

  const activeNow = yesterday.filter(i => i.status !== 'resolved').length
  const activePrev = dayBefore.filter(i => i.status !== 'resolved').length

  const alertsActive: Metric = {
    key: 'alerts_active',
    label: 'Active Alerts',
    value: incidents.filter(i => i.status !== 'resolved').length,
    unit: '',
    delta: pctChange(activeNow, activePrev),
    deltaLabel: 'vs yesterday',
    sparkData: spark.map(v => Math.max(0, Math.round(v * randFloat(0.05, 0.2)))),
    positiveIsGood: false,
  }

  // ── zones_high_risk ──────────────────────────────────────────────────────

  const highRiskCount = zones.filter(
    z => z.riskLevel === 'critical' || z.riskLevel === 'high'
  ).length
  // Synthetic prior month delta
  const priorHighRisk = Math.max(1, highRiskCount + Math.round(randFloat(-2, 2)))

  const zonesHighRisk: Metric = {
    key: 'zones_high_risk',
    label: 'High-Risk Zones',
    value: highRiskCount,
    unit: '',
    delta: pctChange(highRiskCount, priorHighRisk),
    deltaLabel: 'vs last month',
    sparkData: Array.from({ length: 7 }, () =>
      Math.max(0, highRiskCount + Math.round(randFloat(-1, 1)))
    ),
    positiveIsGood: false,
  }

  // ── response_time_avg ────────────────────────────────────────────────────

  const resolved30 = last30.filter(i => i.resolutionMinutes !== undefined)
  const resolvedPrior = prior30.filter(i => i.resolutionMinutes !== undefined)

  const avgRes =
    resolved30.length > 0
      ? parseFloat(
          (resolved30.reduce((s, i) => s + i.resolutionMinutes!, 0) / resolved30.length).toFixed(1)
        )
      : 0

  const avgResPrior =
    resolvedPrior.length > 0
      ? resolvedPrior.reduce((s, i) => s + i.resolutionMinutes!, 0) / resolvedPrior.length
      : 0

  const responseTimeAvg: Metric = {
    key: 'response_time_avg',
    label: 'Avg Response Time',
    value: avgRes,
    unit: 'min',
    delta: pctChange(avgRes, avgResPrior),
    deltaLabel: 'vs prior 30d',
    sparkData: (() => {
      const out: number[] = []
      for (let d = 6; d >= 0; d--) {
        const dayStart = daysAgo(d + 1, now)
        const dayEnd = daysAgo(d, now)
        const dayResolved = incidents.filter(
          i => inRange(i.timestamp, dayStart, dayEnd) && i.resolutionMinutes !== undefined
        )
        if (dayResolved.length > 0) {
          out.push(
            parseFloat(
              (
                dayResolved.reduce((s, i) => s + i.resolutionMinutes!, 0) / dayResolved.length
              ).toFixed(1)
            )
          )
        } else {
          out.push(0)
        }
      }
      return out
    })(),
    positiveIsGood: false,
  }

  return [incidentsTotal, alertsActive, zonesHighRisk, responseTimeAvg]
}
