"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { responseTimeData } from "@/lib/risk-data"

const chartConfig = {
  time: { label: "Response Time (min)", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ResponseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Response Time</CardTitle>
        <CardDescription>Average emergency response time (minutes)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={responseTimeData}>
            <defs>
              <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-time)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-time)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" width={30} />
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
      </CardContent>
    </Card>
  )
}
