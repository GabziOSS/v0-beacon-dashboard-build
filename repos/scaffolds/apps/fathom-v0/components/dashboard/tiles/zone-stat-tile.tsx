"use client"

import { useState } from "react"
import { mapOverlayZones } from "@/lib/risk-data"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle, Calendar, Building2 } from "lucide-react"

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "Critical": return "destructive"
    case "High":     return "default"
    case "Moderate": return "secondary"
    default:         return "outline"
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "flood":     return "bg-blue-500/20 text-blue-400"
    case "landslide": return "bg-amber-500/20 text-amber-400"
    case "surge":     return "bg-red-500/20 text-red-400"
    case "typhoon":   return "bg-violet-500/20 text-violet-400"
    default:          return "bg-muted text-muted-foreground"
  }
}

export function ZoneStatTileContent() {
  const [selectedId, setSelectedId] = useState(mapOverlayZones[0].id)
  const zone = mapOverlayZones.find((z) => z.id === selectedId) ?? mapOverlayZones[0]

  return (
    <div className="flex h-full flex-col gap-3 p-3 pt-1">
      {/* Zone selector */}
      <select
        aria-label="Select zone"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {mapOverlayZones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name.split(" - ")[1] || z.name}
          </option>
        ))}
      </select>

      {/* Type + Severity */}
      <div className="flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${getTypeColor(zone.type)}`}>
          {zone.type}
        </span>
        <Badge variant={getSeverityVariant(zone.severity)} className="px-1.5 py-0 text-[10px]">
          {zone.severity}
        </Badge>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">
          {zone.risk_score}/100
        </span>
      </div>

      {/* Risk bar */}
      <div
        role="progressbar"
        aria-valuenow={zone.risk_score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Risk score: ${zone.risk_score}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full motion-safe:transition-all motion-safe:duration-500"
          style={{ width: `${zone.risk_score}%`, backgroundColor: `var(--chart-${zone.severity === "Critical" ? "1" : zone.severity === "High" ? "2" : "3"})` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { Icon: Users,     label: "Population",    value: zone.population.toLocaleString() },
          { Icon: Calendar,  label: "Last Incident",  value: zone.lastIncident },
          { Icon: Building2, label: "Evacuation Ctr", value: zone.evacuationCenter, full: true },
          { Icon: AlertTriangle, label: "Coordinates", value: `${zone.coordinates[1].toFixed(3)}N` },
        ].map(({ Icon, label, value, full }) => (
          <div
            key={label}
            className={`flex items-start gap-2 rounded-md border bg-muted/20 p-2 ${full ? "col-span-2" : ""}`}
          >
            <Icon className="mt-0.5 size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex min-w-0 flex-col gap-0">
              <span className="text-[9px] text-muted-foreground">{label}</span>
              <span className="truncate text-[11px] font-medium text-foreground">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
