"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { responseTimeData } from "@/lib/risk-data"

const chartConfig = {
  time: { label: "Response Time (min)", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ResponseTileContent() {
  return (
    <figure aria-label="Emergency response time area chart" className="flex h-full flex-col p-3 pt-1">
      <ChartContainer config={chartConfig} className="min-h-0 flex-1 w-full">
        <AreaChart data={responseTimeData}>
          <defs>
            <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-time)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-time)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis tickLine={false} axisLine={false} className="text-xs" width={28} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="time"
            fill="url(#fillTime)"
            stroke="var(--color-time)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      <figcaption className="sr-only">Average emergency response time in minutes over 24 hours</figcaption>
    </figure>
  )
}
