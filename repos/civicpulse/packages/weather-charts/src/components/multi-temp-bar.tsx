'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@beacon/ui'

export interface MultiTempData {
  outsideTemp: number
  heatIndex: number
  wetBulb: number
  min?: number
  max?: number
}

const LABELS = [
  { key: 'outsideTemp', label: 'Outside Temp', fill: 'var(--chart-1)' },
  { key: 'heatIndex', label: 'Heat Index', fill: 'var(--chart-2)' },
  { key: 'wetBulb', label: 'Wet Bulb', fill: 'var(--chart-3)' },
]

export function MultiTempBar({ data }: { data: MultiTempData }) {
  const chartData = LABELS.map(({ key, label, fill }) => ({
    label,
    value: data[key as keyof MultiTempData],
    fill
  }))

  const chartConfig = {
    value: { label: "°C" },
    outsidetemp: { label: "Outside Temp", color: "var(--chart-1)" },
    heatindex: { label: "Heat Index", color: "var(--chart-2)" },
    wetbulb: { label: "Wet Bulb", color: "var(--chart-3)" },
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
          <YAxis hide domain={[data.min ?? 0, data.max ?? 50]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="value" radius={4}>
            <LabelList dataKey="value" position="top" className="fill-foreground font-mono" fontSize={13} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
