"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Users, Activity, Timer } from "lucide-react"

const stats = [
  {
    label: "Active Alerts",
    value: "7",
    change: "+2 from yesterday",
    icon: AlertTriangle,
    iconColor: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    label: "Population At Risk",
    value: "34.5K",
    change: "12% of total",
    icon: Users,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Risk Index",
    value: "76.4",
    change: "+4.2 this week",
    icon: Activity,
    iconColor: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    label: "Avg Response",
    value: "8.2m",
    change: "-1.4m improved",
    icon: Timer,
    iconColor: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="gap-0 py-4">
            <CardContent className="flex items-start gap-3 px-4">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <Icon className={`size-4 ${stat.iconColor}`} />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-xl font-semibold tracking-tight text-foreground">{stat.value}</span>
                <span className="truncate text-[11px] text-muted-foreground">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
