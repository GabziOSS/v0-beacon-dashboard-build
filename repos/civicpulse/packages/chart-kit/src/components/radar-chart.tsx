'use client'

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from 'recharts'
import type { DistrictRadar } from '@civicpulse/types'

const DIMENSIONS = ['fire', 'flood', 'crime', 'medical', 'infrastructure']
const DISTRICT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]

export function DistrictRadarChart({ data }: { data: DistrictRadar[] }) {
  // Reshape for recharts radar
  const chartData = DIMENSIONS.map(dim => ({
    subject: dim.charAt(0).toUpperCase() + dim.slice(1),
    ...Object.fromEntries(
      data.map(d => [d.district, (d as unknown as Record<string, unknown>)[dim] as number])
    ),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-sans)' }}
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
        />
        {data.map((d, i) => (
          <Radar
            key={d.district}
            name={d.district}
            dataKey={d.district}
            stroke={DISTRICT_COLORS[i % DISTRICT_COLORS.length]}
            fill={DISTRICT_COLORS[i % DISTRICT_COLORS.length]}
            fillOpacity={0.12}
            strokeWidth={1.5}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}
