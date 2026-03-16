"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { alertHistory } from "@/lib/risk-data"
import { AlertTriangle, CloudRain, Mountain, Waves, Siren } from "lucide-react"

function getAlertIcon(type: string) {
  if (type.includes("Typhoon")) return CloudRain
  if (type.includes("Flood")) return Waves
  if (type.includes("Landslide")) return Mountain
  if (type.includes("Storm")) return Waves
  return Siren
}

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "Critical":
      return "destructive"
    case "High":
      return "default"
    default:
      return "secondary"
  }
}

export function AlertFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
        <CardDescription>Latest safety notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {alertHistory.map((alert) => {
            const Icon = getAlertIcon(alert.type)
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{alert.type}</span>
                    <Badge
                      variant={getSeverityVariant(alert.severity)}
                      className="shrink-0 text-[10px] px-1.5 py-0"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{alert.zone}</span>
                    <span className="text-border">|</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
