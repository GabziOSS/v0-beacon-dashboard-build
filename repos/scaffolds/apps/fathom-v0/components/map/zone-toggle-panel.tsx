"use client"

import * as React from "react"
import { ToggleRow } from "@/components/primitives/toggle-row"
import { cn } from "@/lib/utils"
import { Layers, ChevronDown } from "lucide-react"
import { mapOverlayZones } from "@/lib/risk-data"

export type ZoneVisibility = Record<string, boolean>

interface ZoneTogglePanelProps {
  visibility: ZoneVisibility
  onToggle: (id: string, checked: boolean) => void
  className?: string
}

const TYPE_META: Record<string, { label: string; color: string }> = {
  flood:     { label: "Flood Zones",       color: "rgba(59,130,246,0.8)" },
  landslide: { label: "Landslide Zones",   color: "rgba(245,158,11,0.8)" },
  surge:     { label: "Storm Surge Zones", color: "rgba(239,68,68,0.8)"  },
  typhoon:   { label: "Typhoon Zones",     color: "rgba(139,92,246,0.8)" },
}

// Group zones by type
const GROUPED = mapOverlayZones.reduce<Record<string, (typeof mapOverlayZones)>>((acc, z) => {
  ;(acc[z.type] ??= []).push(z)
  return acc
}, {})

export function ZoneTogglePanel({ visibility, onToggle, className }: ZoneTogglePanelProps) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const toggle = (type: string) =>
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }))

  // Master type toggle: toggle all zones of that type
  const toggleType = (type: string, checked: boolean) => {
    GROUPED[type]?.forEach((z) => onToggle(z.id, checked))
  }

  const isTypeOn = (type: string) =>
    GROUPED[type]?.every((z) => visibility[z.id] !== false) ?? true

  return (
    <div
      className={cn("flex flex-col gap-0 divide-y divide-border/30", className)}
      aria-label="Zone layer toggles"
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <Layers className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs font-medium text-foreground">Zone Layers</span>
      </div>

      {Object.entries(TYPE_META).map(([type, meta]) => (
        <div key={type} className="px-3 py-1">
          {/* Type header row */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-expanded={!!expanded[type]}
              aria-controls={`zone-group-${type}`}
              onClick={() => toggle(type)}
              className="flex flex-1 items-center gap-1 py-0.5 focus-visible:outline-none"
            >
              <ChevronDown
                className={cn(
                  "size-3 shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:duration-150",
                  expanded[type] && "rotate-0",
                  !expanded[type] && "-rotate-90"
                )}
                aria-hidden="true"
              />
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium text-foreground">{meta.label}</span>
            </button>
            <ToggleRow
              id={`type-toggle-${type}`}
              label=""
              checked={isTypeOn(type)}
              onCheckedChange={(c) => toggleType(type, c)}
              className="py-0"
            />
          </div>

          {/* Individual zones */}
          <div
            id={`zone-group-${type}`}
            role="group"
            aria-label={`${meta.label} individual zones`}
            hidden={!expanded[type]}
            className="ml-4 flex flex-col gap-0"
          >
            {GROUPED[type]?.map((z) => (
              <ToggleRow
                key={z.id}
                id={`zone-${z.id}`}
                label={z.name.split(" - ")[1] ?? z.name}
                description={`${z.population.toLocaleString()} pop.`}
                checked={visibility[z.id] !== false}
                onCheckedChange={(c) => onToggle(z.id, c)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
