'use client'

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

export function ResolutionRadialChart({ value }: { value: number }) {
  const data = [{ value, fill: 'var(--success)' }]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className="relative w-36 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="68%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={90 - (value / 100) * 360}
          >
            <RadialBar dataKey="value" background={{ fill: 'var(--muted)' }} cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold font-mono tabular-nums text-foreground leading-none">
            {value}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">%</span>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
        Resolution Rate
      </span>
    </div>
  )
}
