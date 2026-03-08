"use client"

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts"
import type { ScatterZone } from "@/lib/types"

const RISK_COLORS: Record<string, string> = {
  Critical: "var(--destructive)",
  High:     "var(--warning)",
  Medium:   "var(--chart-1)",
  Low:      "var(--success)",
}

const CustomDot = (props: { cx?: number; cy?: number; payload?: ScatterZone }) => {
  const { cx = 0, cy = 0, payload } = props
  if (!payload) return null
  const r = Math.sqrt(payload.area) * 1.4
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={RISK_COLORS[payload.risk]}
      fillOpacity={0.55}
      stroke={RISK_COLORS[payload.risk]}
      strokeWidth={1}
    />
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScatterZone }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-card border border-border rounded-sm p-2 text-xs font-mono text-foreground space-y-0.5">
      <p className="font-semibold">{d.zone}</p>
      <p className="text-muted-foreground">Pop: {d.population.toLocaleString()}</p>
      <p className="text-muted-foreground">Incidents: {d.incidents}</p>
      <p style={{ color: RISK_COLORS[d.risk] }}>Risk: {d.risk}</p>
    </div>
  )
}

const avgPop = 14020
const avgInc = 139

export function DensityScatterChart({ data }: { data: ScatterZone[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" />
        <XAxis
          type="number"
          dataKey="population"
          name="Population"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="number"
          dataKey="incidents"
          name="Incidents"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
          tickLine={false}
          axisLine={false}
        />
        <ReferenceLine x={avgPop} stroke="var(--border)" strokeDasharray="3 3" />
        <ReferenceLine y={avgInc} stroke="var(--border)" strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "2 2", stroke: "var(--border)" }} />
        <Scatter
          data={data}
          shape={<CustomDot />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
