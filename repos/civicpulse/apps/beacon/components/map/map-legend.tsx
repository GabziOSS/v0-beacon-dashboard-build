"use client"

import { cn } from "@beacon/ui"
import type { RiskLevel } from "./city-map"

const LEVELS: { risk: RiskLevel; color: string; label: string }[] = [
  { risk: "Critical", color: "bg-destructive", label: "Critical" },
  { risk: "High", color: "bg-warning", label: "High" },
  { risk: "Medium", color: "bg-chart-1", label: "Medium" },
  { risk: "Low", color: "bg-success", label: "Low" },
  { risk: "Minimal", color: "bg-muted-foreground", label: "Minimal" },
]

interface MapLegendProps {
  filter: RiskLevel | "All"
  onFilter: (level: RiskLevel | "All") => void
}

export function MapLegend({ filter, onFilter }: MapLegendProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-sm border border-border bg-card p-3">
      <p className="mb-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        Risk Level
      </p>

      <button
        onClick={() => onFilter("All")}
        className={cn(
          "rounded-sm border px-2 py-1 text-left font-mono text-[10px] transition-colors",
          filter === "All"
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        All zones
      </button>

      {LEVELS.map(({ risk, color, label }) => (
        <button
          key={risk}
          onClick={() => onFilter(risk)}
          className={cn(
            "flex items-center gap-2 rounded-sm border px-2 py-1 text-left font-mono text-[10px] transition-colors",
            filter === risk
              ? "border-border bg-secondary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-[2px] opacity-80",
              color
            )}
          />
          {label}
        </button>
      ))}

      <div className="mt-2 space-y-1 border-t border-border pt-2">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          Markers
        </p>
        <div className="flex items-center gap-2 px-2">
          <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Active incidents
          </span>
        </div>
      </div>
    </div>
  )
}
