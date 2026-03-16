"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { populationExposure } from "@/lib/risk-data"

const chartConfig = {
  "High Risk": { label: "High Risk", color: "var(--chart-1)" },
  "Medium Risk": { label: "Medium Risk", color: "var(--chart-3)" },
  "Low Risk": { label: "Low Risk", color: "var(--chart-4)" },
  "Minimal Risk": { label: "Minimal Risk", color: "var(--chart-5)" },
} satisfies ChartConfig

export function PopulationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Population Exposure</CardTitle>
        <CardDescription>Population segmented by risk level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[220px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
            <Pie
              data={populationExposure}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {populationExposure.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {populationExposure.map((entry) => (
            <div key={entry.category} className="flex items-center gap-1.5">
              <div className="size-2 rounded-full" style={{ backgroundColor: entry.fill }} />
              <span className="text-[11px] text-muted-foreground">{entry.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
