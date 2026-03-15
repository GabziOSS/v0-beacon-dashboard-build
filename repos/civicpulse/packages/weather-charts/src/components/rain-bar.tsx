'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@beacon/ui'

export interface RainBarData {
  values: Array<{ label: string; value: number }>
  unit?: string
  max?: number
}

export function RainBar({ data }: { data: RainBarData }) {
  const unit = data.unit ?? 'mm'

  // Prepare data with dynamic fill colors per item
  const chartData = data.values.map((v, i) => ({
    ...v,
    fill: `var(--chart-${(i % 5) + 1})`,
  }))

  const chartConfig = {
    value: {
      label: unit,
    },
    ...chartData.reduce(
      (acc, curr) => {
        acc[curr.label.toLowerCase()] = { label: curr.label, color: curr.fill }
        return acc
      },
      {} as Record<string, any>
    ),
  }

  return (
    <div className="flex flex-col h-full w-full justify-center flex-1">
      <ChartContainer config={chartConfig} className="w-full h-full min-h-0">
        <BarChart
          data={chartData}
          margin={{
            top: 35,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            hide 
            domain={[0, data.max ?? 'auto']} 
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <defs>
            <filter id="rain-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <Bar dataKey="value" radius={4} filter="url(#rain-glow)">
            <LabelList 
              dataKey="value" 
              position="top" 
              className="fill-foreground font-mono" 
              fontSize={12} 
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
