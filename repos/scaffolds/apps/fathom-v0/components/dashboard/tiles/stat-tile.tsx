"use client"

import { AlertTriangle, Users, Activity, Timer } from "lucide-react"
import { TrendBadge } from "@/components/primitives/trend-badge"

export type StatKey = "alerts" | "population" | "riskIndex" | "response"

const STAT_CONFIGS: Record<StatKey, {
  label: string
  value: string
  trend: string
  trendDir: "up" | "down" | "neutral"
  Icon: React.ElementType
  iconClass: string
  bgClass: string
}> = {
  alerts: {
    label: "Active Alerts",
    value: "7",
    trend: "+2",
    trendDir: "up",
    Icon: AlertTriangle,
    iconClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  population: {
    label: "Population At Risk",
    value: "34.5K",
    trend: "12%",
    trendDir: "neutral",
    Icon: Users,
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  riskIndex: {
    label: "Risk Index",
    value: "76.4",
    trend: "+4.2",
    trendDir: "up",
    Icon: Activity,
    iconClass: "text-chart-3",
    bgClass: "bg-chart-3/10",
  },
  response: {
    label: "Avg Response",
    value: "8.2m",
    trend: "-1.4m",
    trendDir: "down",
    Icon: Timer,
    iconClass: "text-chart-4",
    bgClass: "bg-chart-4/10",
  },
}

interface StatTileContentProps {
  statKey: StatKey
}

export function StatTileContent({ statKey }: StatTileContentProps) {
  const cfg = STAT_CONFIGS[statKey]
  const Icon = cfg.Icon
  return (
    <div className="flex h-full flex-col justify-between gap-2 p-3 pt-2">
      <div className={`flex size-9 items-center justify-center self-start rounded-lg ${cfg.bgClass}`}>
        <Icon className={`size-4 ${cfg.iconClass}`} aria-hidden="true" />
      </div>
      <div>
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          {cfg.value}
        </span>
        <div className="mt-1 flex items-center gap-1.5">
          <TrendBadge value={cfg.trend} direction={cfg.trendDir} />
          <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
        </div>
      </div>
    </div>
  )
}
