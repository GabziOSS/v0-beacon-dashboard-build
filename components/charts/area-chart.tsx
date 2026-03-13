'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import type { ResponseTimePoint } from '@/lib/types'

export function ResponseTimeChart({ data }: { data: ResponseTimePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="p90Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
          unit="m"
        />
        <ReferenceLine
          y={10}
          stroke="var(--destructive)"
          strokeDasharray="4 3"
          strokeWidth={1}
          label={{
            value: 'SLA 10m',
            position: 'right',
            fill: 'var(--destructive)',
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
          }}
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
          cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          formatter={(v: number) => [`${v} min`]}
        />
        <Area
          type="monotone"
          dataKey="p90"
          name="P90"
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          fill="url(#p90Grad)"
        />
        <Area
          type="monotone"
          dataKey="avg"
          name="Avg"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#avgGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
