"use client"

import { Badge } from "@/components/ui/badge"
import { riskCategories } from "@/lib/risk-data"
import { TrendBadge } from "@/components/primitives/trend-badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

function getSeverityVariant(level: string) {
  switch (level) {
    case "Critical": return "destructive"
    case "High":     return "default"
    case "Moderate": return "secondary"
    default:         return "outline"
  }
}

function getTrendDir(trend: string): "up" | "down" | "neutral" {
  if (trend.startsWith("+")) return "up"
  if (trend.startsWith("-")) return "down"
  return "neutral"
}

function RiskBarsView() {
  return (
    <div className="flex flex-col gap-3 p-3 pt-1">
      {riskCategories.map((cat) => (
        <div key={cat.name} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground">{cat.name}</span>
            <div className="flex items-center gap-1.5">
              <TrendBadge value={cat.trend} direction={getTrendDir(cat.trend)} />
              <Badge variant={getSeverityVariant(cat.level)} className="px-1.5 py-0 text-[10px]">
                {cat.level}
              </Badge>
              <span className="w-10 text-right font-mono text-[10px] text-muted-foreground tabular-nums">
                {cat.score}/100
              </span>
            </div>
          </div>
          <div
            role="progressbar"
            aria-valuenow={cat.score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${cat.name} risk: ${cat.score} out of 100`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full motion-safe:transition-all motion-safe:duration-500"
              style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// mock trend data for the tab
const trendData = riskCategories.map((c, i) => ({
  name: c.name,
  score: c.score,
  prev: Math.max(10, c.score - 5 + i * 3),
}))
const trendConfig = {
  score: { label: "Current", color: "var(--primary)" },
  prev:  { label: "Previous", color: "var(--muted-foreground)" },
} satisfies ChartConfig

function RiskTrendView() {
  return (
    <figure aria-label="Risk score trend chart" className="flex h-full flex-col p-3 pt-1">
      <ChartContainer config={trendConfig} className="min-h-0 flex-1 w-full">
        <LineChart data={trendData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[10px]" />
          <YAxis tickLine={false} axisLine={false} className="text-xs" width={28} domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={{ r: 3 }} />
          <Line dataKey="prev"  stroke="var(--color-prev)"  strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ChartContainer>
      <figcaption className="sr-only">Risk scores compared to previous period</figcaption>
    </figure>
  )
}

export const riskGaugeTileTabs = [
  { id: "bars",  label: "Levels", content: <RiskBarsView /> },
  { id: "trend", label: "Trend",  content: <RiskTrendView /> },
]
