"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, AlertTriangle, Calendar, Building2 } from "lucide-react"
import type { mapOverlayZones } from "@/lib/risk-data"

type Zone = (typeof mapOverlayZones)[number]

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

function getTypeColor(type: string) {
  switch (type) {
    case "flood":
      return "bg-blue-500/15 text-blue-400"
    case "landslide":
      return "bg-amber-500/15 text-amber-400"
    case "surge":
      return "bg-red-500/15 text-red-400"
    case "typhoon":
      return "bg-violet-500/15 text-violet-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

interface ZoneModalProps {
  zone: Zone | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ZoneModal({ zone, open, onOpenChange }: ZoneModalProps) {
  if (!zone) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className={`flex size-8 items-center justify-center rounded-md ${getTypeColor(zone.type)}`}>
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base">{zone.name}</DialogTitle>
              <DialogDescription className="text-xs">
                {zone.coordinates[1].toFixed(3)}{"\u00B0"}N, {zone.coordinates[0].toFixed(3)}{"\u00B0"}E
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant={getSeverityVariant(zone.severity)}>
              {zone.severity} Risk
            </Badge>
            <Badge variant="outline" className="font-mono">
              Score: {zone.risk_score}/100
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {zone.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <Users className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Population</span>
                <span className="text-sm font-medium text-foreground">
                  {zone.population.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Last Incident</span>
                <span className="text-sm font-medium text-foreground">{zone.lastIncident}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
            <Building2 className="mt-0.5 size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Evacuation Center</span>
              <span className="text-sm font-medium text-foreground">{zone.evacuationCenter}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              <MapPin className="size-4" />
              View on Map
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              Full Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
