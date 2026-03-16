"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { evacuationData } from "@/lib/risk-data"

const chartConfig = {
  capacity: { label: "Capacity", color: "var(--chart-4)" },
  occupied: { label: "Occupied", color: "var(--chart-2)" },
} satisfies ChartConfig

export function EvacuationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Evacuation Centers</CardTitle>
        <CardDescription>Capacity vs current occupancy</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart data={evacuationData} layout="vertical" barGap={4}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={55} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="capacity" fill="var(--color-capacity)" radius={[0, 3, 3, 0]} opacity={0.5} />
            <Bar dataKey="occupied" fill="var(--color-occupied)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
