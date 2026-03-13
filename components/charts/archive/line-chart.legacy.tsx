'use client'

import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { TrendPoint } from '@/lib/types'

const SERIES: Array<{ key: keyof Omit<TrendPoint, 'time'>; label: string; color: string }> = [
  { key: 'medical', label: 'Medical', color: 'var(--chart-1)' },
  { key: 'crime', label: 'Crime', color: 'var(--chart-2)' },
  { key: 'fire', label: 'Fire', color: 'var(--chart-5)' },
  { key: 'flood', label: 'Flood', color: 'var(--chart-6)' },
  { key: 'infrastructure', label: 'Infrastructure', color: 'var(--chart-4)' },
  { key: 'typhoon', label: 'Typhoon', color: 'var(--chart-7)' },
]

export function IncidentTrendChart({ data }: { data: TrendPoint[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{
                fill: 'var(--muted-foreground)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
              }}
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis
              tick={{
                fill: 'var(--muted-foreground)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
              }}
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
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            {SERIES.filter(s => !hidden.has(s.key)).map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: s.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend pills */}
      <div className="flex flex-wrap gap-1.5 px-1">
        {SERIES.map(s => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-medium font-mono px-2 py-0.5 rounded-sm border transition-opacity',
              hidden.has(s.key) ? 'opacity-30' : 'opacity-100'
            )}
            style={{ borderColor: s.color, color: s.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
