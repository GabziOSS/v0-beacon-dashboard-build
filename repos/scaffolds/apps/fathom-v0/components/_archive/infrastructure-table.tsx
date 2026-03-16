"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { infrastructureRisk } from "@/lib/risk-data"

function getRiskColor(risk: number) {
  if (risk >= 70) return "bg-destructive"
  if (risk >= 50) return "bg-chart-3"
  return "bg-chart-4"
}

export function InfrastructureTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Infrastructure Risk</CardTitle>
        <CardDescription>Critical infrastructure vulnerability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {infrastructureRisk.map((item) => (
            <div key={item.asset} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <span className="text-sm text-foreground">{item.asset}</span>
              </div>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${getRiskColor(item.risk)} transition-all duration-500`}
                    style={{ width: `${item.risk}%` }}
                  />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="w-8 text-right text-xs font-mono text-muted-foreground tabular-nums">
                  {item.risk}%
                </span>
                <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">
                  ({item.count})
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
