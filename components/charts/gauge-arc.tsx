'use client'

import { useMemo } from 'react'
import { RadialBarChart, RadialBar, PolarAngleAxis, PolarRadiusAxis, Label } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'

export function GaugeArc({
  value,
  label,
  max = 100,
}: {
  value: number
  label: string
  max?: number
}) {
  // Determine semantic color based on value thresholds
  const pct = value / max
  const colorVar =
    pct > 0.7 ? 'var(--destructive)' : pct > 0.4 ? 'var(--warning)' : 'var(--success)'

  const chartData = useMemo(
    () => [{ name: label, value: value, fill: colorVar }],
    [value, label, colorVar]
  )

  const chartConfig = {
    value: {
      label: label,
      color: colorVar,
    },
  }

  return (
    <div className="flex flex-col items-center h-full justify-center w-full min-h-0">
      <ChartContainer
        config={chartConfig}
        className="w-full h-full flex-1"
      >
        <RadialBarChart
          data={chartData}
          startAngle={180}
          endAngle={0}
          innerRadius="75%"
          outerRadius="110%"
          cx="50%"
          cy="65%"
          barSize={40}
        >
          {/* Background track (adapts to themes/soft mode via fill-muted) */}
          <PolarAngleAxis
            type="number"
            domain={[0, max]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            background={{ fill: 'var(--muted)' }}
            cornerRadius={10}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground font-mono font-bold text-3xl"
                      >
                        {Math.round(value)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground text-[11px] font-medium tracking-widest uppercase"
                      >
                        {label}
                      </tspan>
                    </text>
                  )
                }
                return null
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}
