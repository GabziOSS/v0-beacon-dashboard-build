"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  BarChart2,
  Activity,
  Users,
  Building2,
  Bell,
  Wind,
  Gauge,
  Sun,
  Thermometer,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
} from "lucide-react"

export interface TileDefinition {
  type: string
  label: string
  description: string
  icon: React.ElementType
  defaultSize: "xs" | "sm" | "md" | "lg" | "xl"
  supportsMapHover?: boolean
}

export const TILE_DEFINITIONS: TileDefinition[] = [
  {
    type: "incidents",
    label: "Monthly Incidents",
    description: "Incidents by hazard category",
    icon: BarChart2,
    defaultSize: "md",
    supportsMapHover: true,
  },
  {
    type: "risk-gauge",
    label: "Risk Assessment",
    description: "Risk levels by category",
    icon: Activity,
    defaultSize: "sm",
    supportsMapHover: true,
  },
  {
    type: "evacuation",
    label: "Evacuation Centers",
    description: "Capacity vs occupancy",
    icon: Building2,
    defaultSize: "md",
    supportsMapHover: true,
  },
  {
    type: "population",
    label: "Population Exposure",
    description: "Population by risk level",
    icon: Users,
    defaultSize: "sm",
    supportsMapHover: true,
  },
  {
    type: "response",
    label: "Response Time",
    description: "Emergency response time trend",
    icon: Clock,
    defaultSize: "md",
  },
  {
    type: "infrastructure",
    label: "Infrastructure Risk",
    description: "Critical asset vulnerability",
    icon: Building2,
    defaultSize: "md",
    supportsMapHover: true,
  },
  {
    type: "alerts",
    label: "Recent Alerts",
    description: "Live alert notifications",
    icon: Bell,
    defaultSize: "sm",
  },
  {
    type: "wind-speed",
    label: "Wind Speed",
    description: "Current wind gauge",
    icon: Wind,
    defaultSize: "xs",
  },
  {
    type: "wind-rose",
    label: "Wind Rose",
    description: "Wind direction distribution",
    icon: Layers,
    defaultSize: "sm",
  },
  {
    type: "barometer",
    label: "Barometer",
    description: "Atmospheric pressure trend",
    icon: Gauge,
    defaultSize: "md",
  },
  {
    type: "sunrise",
    label: "Sunrise / Sunset",
    description: "Daily sun arc",
    icon: Sun,
    defaultSize: "xs",
  },
  {
    type: "temperature",
    label: "Temperature",
    description: "Outside + heat index",
    icon: Thermometer,
    defaultSize: "xs",
  },
  {
    type: "zone-stat",
    label: "Zone Statistics",
    description: "Data linked to a map zone",
    icon: MapPin,
    defaultSize: "sm",
    supportsMapHover: true,
  },
]

interface TilePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (def: TileDefinition) => void
}

export function TilePicker({ open, onOpenChange, onSelect }: TilePickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto sm:max-w-2xl"
        aria-describedby="tile-picker-desc"
      >
        <DialogHeader>
          <DialogTitle>Add Tile</DialogTitle>
          <DialogDescription id="tile-picker-desc">
            Choose a data tile to add to the dashboard.
          </DialogDescription>
        </DialogHeader>

        <div
          role="listbox"
          aria-label="Available tile types"
          className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {TILE_DEFINITIONS.map((def) => {
            const Icon = def.icon
            return (
              <button
                key={def.type}
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect(def)
                  onOpenChange(false)
                }}
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-border p-3 text-left",
                  "hover:border-primary/50 hover:bg-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "motion-safe:transition-colors motion-safe:duration-100"
                )}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">{def.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {def.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
