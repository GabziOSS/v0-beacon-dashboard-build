"use client"

import { infrastructureRisk } from "@/lib/risk-data"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

function getRiskColor(risk: number) {
  if (risk >= 70) return "var(--destructive)"
  if (risk >= 50) return "var(--chart-3)"
  return "var(--chart-4)"
}

function InfrastructureBars() {
  return (
    <div className="flex flex-col gap-2 p-3 pt-1">
      {infrastructureRisk.map((item) => (
        <div key={item.asset} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-foreground">{item.asset}</span>
          <div
            role="progressbar"
            aria-valuenow={item.risk}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${item.asset} risk: ${item.risk}%`}
            className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full motion-safe:transition-all motion-safe:duration-500"
              style={{ width: `${item.risk}%`, backgroundColor: getRiskColor(item.risk) }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
            {item.risk}%
          </span>
        </div>
      ))}
    </div>
  )
}

const chartConfig = {
  risk: { label: "Risk %", color: "var(--chart-2)" },
} satisfies ChartConfig

function InfrastructureChart() {
  return (
    <figure aria-label="Infrastructure risk bar chart" className="flex h-full flex-col p-3 pt-1">
      <ChartContainer config={chartConfig} className="min-h-0 flex-1 w-full">
        <BarChart data={infrastructureRisk}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="asset" tickLine={false} axisLine={false} className="text-[10px]" />
          <YAxis tickLine={false} axisLine={false} className="text-xs" width={28} domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="risk" fill="var(--color-risk)" radius={[3,3,0,0]} />
        </BarChart>
      </ChartContainer>
      <figcaption className="sr-only">Infrastructure vulnerability risk percentages</figcaption>
    </figure>
  )
}

export const infrastructureTileTabs = [
  { id: "bars",  label: "Bars",  content: <InfrastructureBars /> },
  { id: "chart", label: "Chart", content: <InfrastructureChart /> },
]
