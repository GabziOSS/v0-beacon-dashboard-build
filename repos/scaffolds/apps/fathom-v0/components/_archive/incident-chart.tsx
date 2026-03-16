"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { monthlyIncidents } from "@/lib/risk-data"

const chartConfig = {
  flood: { label: "Flood", color: "var(--chart-1)" },
  typhoon: { label: "Typhoon", color: "var(--chart-2)" },
  landslide: { label: "Landslide", color: "var(--chart-3)" },
  earthquake: { label: "Earthquake", color: "var(--chart-4)" },
  surge: { label: "Storm Surge", color: "var(--chart-5)" },
} satisfies ChartConfig

export function IncidentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Monthly Incidents</CardTitle>
        <CardDescription>Safety incidents by category over 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart data={monthlyIncidents} barGap={2}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" width={30} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="flood" fill="var(--color-flood)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="typhoon" fill="var(--color-typhoon)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="landslide" fill="var(--color-landslide)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="earthquake" fill="var(--color-earthquake)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="surge" fill="var(--color-surge)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
