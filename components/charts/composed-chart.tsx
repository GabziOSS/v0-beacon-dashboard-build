'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { ComposedPoint } from '@/lib/types'

export function IncidentsVsDeployedChart({ data }: { data: ComposedPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 4, right: 24, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--foreground)',
          }}
          cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
        />
        <Legend
          wrapperStyle={{
            fontSize: 10,
            fontFamily: 'var(--font-sans)',
            color: 'var(--muted-foreground)',
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="incidents"
          name="Incidents"
          fill="var(--primary-dim)"
          stroke="var(--chart-1)"
          strokeWidth={1}
          radius={[2, 2, 0, 0]}
          maxBarSize={20}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="deployed"
          name="Deployed"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--chart-3)' }}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
