"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mapOverlayZones } from "@/lib/risk-data"
import { AlertTriangle, Layers, ChevronRight } from "lucide-react"
import { useState } from "react"

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "Critical":
      return "destructive"
    case "High":
      return "default"
    case "Moderate":
      return "secondary"
    default:
      return "outline"
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "flood":
      return "Flood"
    case "landslide":
      return "Landslide"
    case "surge":
      return "Storm Surge"
    case "typhoon":
      return "Typhoon"
    default:
      return type
  }
}

interface MapSidebarProps {
  onZoneSelect: (zone: (typeof mapOverlayZones)[number]) => void
}

export function MapSidebar({ onZoneSelect }: MapSidebarProps) {
  const [filter, setFilter] = useState<string>("all")
  const types = ["all", "flood", "landslide", "surge", "typhoon"]

  const filteredZones = filter === "all"
    ? mapOverlayZones
    : mapOverlayZones.filter((z) => z.type === filter)

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto p-3">
      <div className="flex items-center gap-2">
        <Layers className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Risk Zones</span>
        <Badge variant="outline" className="ml-auto text-[10px]">
          {mapOverlayZones.length}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1">
        {types.map((type) => (
          <Button
            key={type}
            variant={filter === type ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs capitalize"
            onClick={() => setFilter(type)}
          >
            {type === "all" ? "All" : getTypeLabel(type)}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filteredZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneSelect(zone)}
            className="flex items-start gap-2.5 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
          >
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <AlertTriangle className="size-3.5 text-muted-foreground" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-xs font-medium text-foreground">
                {zone.name.split(" - ")[1] || zone.name}
              </span>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant={getSeverityVariant(zone.severity)}
                  className="text-[9px] px-1 py-0"
                >
                  {zone.severity}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {getTypeLabel(zone.type)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                Pop: {zone.population.toLocaleString()}
              </span>
            </div>
            <ChevronRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}
