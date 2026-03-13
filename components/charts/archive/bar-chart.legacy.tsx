'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts'
import type { CategoryBar } from '@/lib/types'

const COLORS: Record<string, string> = {
  Medical: 'var(--chart-1)',
  Crime: 'var(--chart-2)',
  Fire: 'var(--chart-5)',
  Flood: 'var(--chart-6)',
  Infrastructure: 'var(--chart-4)',
  Typhoon: 'var(--chart-7)',
}

export function CategoryBarChart({
  data,
  horizontal = true,
}: {
  data: CategoryBar[]
  horizontal?: boolean
}) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-sans)' }}
            tickLine={false}
            axisLine={false}
            width={90}
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
            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
          />
          <Bar dataKey="count" radius={[0, 2, 2, 0]} maxBarSize={18}>
            {data.map(d => (
              <Cell key={d.category} fill={COLORS[d.category] ?? 'var(--chart-1)'} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{
                fill: 'var(--muted-foreground)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 4 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontFamily: 'var(--font-sans)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
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
          cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={32}>
          {data.map(d => (
            <Cell key={d.category} fill={COLORS[d.category] ?? 'var(--chart-1)'} />
          ))}
          <LabelList
            dataKey="count"
            position="top"
            style={{
              fill: 'var(--muted-foreground)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
