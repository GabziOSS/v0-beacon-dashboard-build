'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { BarometerPoint } from '@/lib/types'

export function BarometerChart({ data }: { data: BarometerPoint[] }) {
  const chartConfig = {
    value: {
      label: 'Pressure (hPa)',
      color: 'var(--chart-4)',
    },
  }

  // Calculate min/max for YAxis to make it look prominent
  const min = Math.min(...data.map(d => d.pressure))
  const max = Math.max(...data.map(d => d.pressure))
  const padding = (max - min) * 0.5 || 2

  return (
    <div className="flex flex-col h-full w-full justify-center">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            domain={[min - padding, max + padding]} 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <defs>
            <linearGradient id="fillPressure" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="pressure"
            name="Pressure"
            stroke="var(--chart-4)"
            fill="url(#fillPressure)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
