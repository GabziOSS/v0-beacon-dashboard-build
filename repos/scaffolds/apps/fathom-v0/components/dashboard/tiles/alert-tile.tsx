"use client"

import { alertHistory } from "@/lib/risk-data"
import { Badge } from "@/components/ui/badge"
import { CloudRain, Mountain, Waves, Siren } from "lucide-react"

function getAlertIcon(type: string) {
  if (type.includes("Typhoon")) return CloudRain
  if (type.includes("Flood"))   return Waves
  if (type.includes("Landslide")) return Mountain
  if (type.includes("Storm"))   return Waves
  return Siren
}

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "Critical": return "destructive"
    case "High":     return "default"
    default:         return "secondary"
  }
}

export function AlertTileContent() {
  return (
    <div
      aria-live="polite"
      aria-label="Recent safety alerts"
      className="flex flex-col gap-2 p-3 pt-1"
    >
      {alertHistory.map((alert) => {
        const Icon = getAlertIcon(alert.type)
        return (
          <div
            key={alert.id}
            role="listitem"
            className="flex items-start gap-2.5 rounded-lg border bg-muted/20 p-2.5 motion-safe:transition-colors hover:bg-muted/40"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-xs font-medium text-foreground">{alert.type}</span>
                <Badge variant={getSeverityVariant(alert.severity)} className="shrink-0 px-1 py-0 text-[9px]">
                  {alert.severity}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {alert.zone} &middot; {alert.time}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
