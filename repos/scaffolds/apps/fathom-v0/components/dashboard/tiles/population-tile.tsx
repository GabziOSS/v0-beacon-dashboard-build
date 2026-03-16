"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Cell, Pie, PieChart } from "recharts"
import { populationExposure } from "@/lib/risk-data"
import { LegendGroup } from "@/components/primitives/legend-row"

const chartConfig = {
  "High Risk":    { label: "High Risk",    color: "var(--chart-1)" },
  "Medium Risk":  { label: "Medium Risk",  color: "var(--chart-3)" },
  "Low Risk":     { label: "Low Risk",     color: "var(--chart-4)" },
  "Minimal Risk": { label: "Minimal Risk", color: "var(--chart-5)" },
} satisfies ChartConfig

const LEGEND_ITEMS = populationExposure.map((d) => ({
  color: d.fill,
  label: d.category,
  value: `${(d.value / 1000).toFixed(1)}K`,
}))

export function PopulationTileContent() {
  return (
    <figure aria-label="Population exposure by risk level donut chart" className="flex h-full flex-col items-center gap-2 p-3 pt-1">
      <ChartContainer config={chartConfig} className="mx-auto h-[180px] w-full max-w-[200px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
          <Pie
            data={populationExposure}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={44}
            outerRadius={72}
            strokeWidth={2}
            stroke="var(--card)"
          >
            {populationExposure.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <LegendGroup items={LEGEND_ITEMS} cols={2} className="w-full px-2" />
      <figcaption className="sr-only">Population exposure distribution by risk category</figcaption>
    </figure>
  )
}
