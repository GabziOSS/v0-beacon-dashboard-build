"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { evacuationData } from "@/lib/risk-data"

const chartConfig = {
  capacity: { label: "Capacity", color: "var(--chart-4)" },
  occupied: { label: "Occupied", color: "var(--chart-2)" },
} satisfies ChartConfig

function EvacuationBars() {
  return (
    <figure aria-label="Evacuation center capacity chart" className="flex h-full flex-col p-3 pt-1">
      <ChartContainer config={chartConfig} className="min-h-0 flex-1 w-full">
        <BarChart data={evacuationData} layout="vertical" barGap={4}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={50} className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="capacity" fill="var(--color-capacity)" radius={[0,3,3,0]} opacity={0.4} />
          <Bar dataKey="occupied" fill="var(--color-occupied)" radius={[0,3,3,0]} />
        </BarChart>
      </ChartContainer>
      <figcaption className="sr-only">Evacuation center capacity versus current occupancy</figcaption>
    </figure>
  )
}

function EvacuationTable() {
  return (
    <div className="flex flex-col gap-0 p-3 pt-2">
      <div className="grid grid-cols-4 border-b border-border/50 pb-1 text-[10px] font-medium text-muted-foreground">
        <span>Center</span>
        <span className="text-right">Cap.</span>
        <span className="text-right">Occ.</span>
        <span className="text-right">Fill%</span>
      </div>
      {evacuationData.map((row) => {
        const pct = Math.round((row.occupied / row.capacity) * 100)
        return (
          <div
            key={row.name}
            className="grid grid-cols-4 border-b border-border/20 py-1.5 text-xs last:border-0"
          >
            <span className="font-medium text-foreground">{row.name}</span>
            <span className="text-right font-mono text-muted-foreground tabular-nums">{row.capacity}</span>
            <span className="text-right font-mono tabular-nums" style={{ color: pct > 85 ? "var(--destructive)" : "var(--foreground)" }}>
              {row.occupied}
            </span>
            <span className="text-right font-mono tabular-nums text-foreground">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

export const evacuationTileTabs = [
  { id: "chart", label: "Chart", content: <EvacuationBars /> },
  { id: "table", label: "Table", content: <EvacuationTable /> },
]
