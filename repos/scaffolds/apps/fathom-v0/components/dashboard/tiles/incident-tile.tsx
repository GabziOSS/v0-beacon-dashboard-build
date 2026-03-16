"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { monthlyIncidents } from "@/lib/risk-data"
import { LegendGroup } from "@/components/primitives/legend-row"

const chartConfig = {
  flood:     { label: "Flood",       color: "var(--chart-1)" },
  typhoon:   { label: "Typhoon",     color: "var(--chart-2)" },
  landslide: { label: "Landslide",   color: "var(--chart-3)" },
  earthquake:{ label: "Earthquake",  color: "var(--chart-4)" },
  surge:     { label: "Storm Surge", color: "var(--chart-5)" },
} satisfies ChartConfig

const LEGEND_ITEMS = Object.entries(chartConfig).map(([, v]) => ({
  color: v.color,
  label: v.label,
}))

function IncidentBarChart() {
  return (
    <figure aria-label="Monthly incidents bar chart" className="flex h-full flex-col gap-1 p-3 pt-1">
      <ChartContainer config={chartConfig} className="min-h-0 flex-1 w-full">
        <BarChart data={monthlyIncidents} barGap={2}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis tickLine={false} axisLine={false} className="text-xs" width={28} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="flood"      fill="var(--color-flood)"      radius={[2,2,0,0]} />
          <Bar dataKey="typhoon"    fill="var(--color-typhoon)"    radius={[2,2,0,0]} />
          <Bar dataKey="landslide"  fill="var(--color-landslide)"  radius={[2,2,0,0]} />
          <Bar dataKey="earthquake" fill="var(--color-earthquake)" radius={[2,2,0,0]} />
          <Bar dataKey="surge"      fill="var(--color-surge)"      radius={[2,2,0,0]} />
        </BarChart>
      </ChartContainer>
      <LegendGroup items={LEGEND_ITEMS} cols={2} className="px-1 pb-1" />
      <figcaption className="sr-only">Monthly hazard incidents over the last 6 months</figcaption>
    </figure>
  )
}

function IncidentSummaryTable() {
  const totals = monthlyIncidents.reduce(
    (acc, m) => {
      acc.flood      += m.flood
      acc.typhoon    += m.typhoon
      acc.landslide  += m.landslide
      acc.earthquake += m.earthquake
      acc.surge      += m.surge
      return acc
    },
    { flood: 0, typhoon: 0, landslide: 0, earthquake: 0, surge: 0 }
  )
  return (
    <div className="flex flex-col gap-2 p-3 pt-2">
      {(Object.entries(totals) as [string, number][]).map(([key, val]) => {
        const cfg = chartConfig[key as keyof typeof chartConfig]
        return (
          <div key={key} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-sm" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
              <span className="text-muted-foreground">{cfg.label}</span>
            </div>
            <span className="font-mono font-medium tabular-nums text-foreground">{val}</span>
          </div>
        )
      })}
    </div>
  )
}

export const incidentTileTabs = [
  { id: "chart", label: "Chart",   content: <IncidentBarChart /> },
  { id: "table", label: "Summary", content: <IncidentSummaryTable /> },
]
