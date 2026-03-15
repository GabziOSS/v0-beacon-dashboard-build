"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"

export function ResolutionRadialChart({ value }: { value: number }) {
  const data = [{ value, fill: "var(--success)" }]

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="relative h-36 w-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="68%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={90 - (value / 100) * 360}
          >
            <RadialBar
              dataKey="value"
              background={{ fill: "var(--muted)" }}
              cornerRadius={4}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl leading-none font-semibold text-foreground tabular-nums">
            {value}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">%</span>
        </div>
      </div>
      <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
        Resolution Rate
      </span>
    </div>
  )
}
