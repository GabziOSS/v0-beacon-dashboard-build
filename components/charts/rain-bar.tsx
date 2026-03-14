'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

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
    <div className="flex flex-col h-full w-full justify-center">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart
          data={chartData}
          margin={{
            top: 25,
            right: 0,
            left: 0,
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
          <Bar dataKey="value" radius={4}>
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
