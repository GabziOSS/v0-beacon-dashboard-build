"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"

const barometerData = [
  { time: "4 AM",  hPa: 755.8 },
  { time: "5 AM",  hPa: 756.0 },
  { time: "6 AM",  hPa: 756.3 },
  { time: "7 AM",  hPa: 756.8 },
  { time: "8 AM",  hPa: 757.0 },
  { time: "9 AM",  hPa: 757.3 },
  { time: "10 AM", hPa: 757.5 },
  { time: "11 AM", hPa: 757.3 },
  { time: "12 PM", hPa: 757.1 },
]

const chartConfig = {
  hPa: { label: "Pressure (mm Hg)", color: "var(--chart-5)" },
} satisfies ChartConfig

export function BarometerTileContent() {
  const latest = barometerData.at(-1)?.hPa ?? 0
  return (
    <figure aria-label="Barometric pressure area chart" className="flex h-full flex-col p-3 pt-1">
      <div className="mb-1 flex items-baseline gap-1 px-1">
        <span className="text-xl font-semibold tabular-nums text-foreground">{latest.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">mm Hg</span>
      </div>
      <ChartContainer config={chartConfig} className="min-h-0 flex-1 w-full">
        <AreaChart data={barometerData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fillPressure" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-hPa)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-hPa)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="time" tickLine={false} axisLine={false} className="text-[10px]" />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-[10px]"
            width={44}
            domain={[755.5, 758]}
            tickFormatter={(v) => `${v}`}
          />
          <ReferenceLine y={760} stroke="var(--border)" strokeDasharray="3 3" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="hPa"
            fill="url(#fillPressure)"
            stroke="var(--color-hPa)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      <figcaption className="sr-only">Atmospheric pressure in mm Hg over time</figcaption>
    </figure>
  )
}
