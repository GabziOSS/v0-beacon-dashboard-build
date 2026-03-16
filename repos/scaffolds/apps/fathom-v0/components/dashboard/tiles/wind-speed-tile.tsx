"use client"

import { GaugeArc } from "@/components/primitives/gauge-arc"

interface WindSpeedTileProps {
  speed?: number
  avg?: number
  gust?: number
  unit?: string
}

export function WindSpeedTileContent({
  speed = 18,
  avg = 14,
  gust = 32,
  unit = "km/h",
}: WindSpeedTileProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-3">
      <GaugeArc
        value={speed}
        min={0}
        max={120}
        color="var(--primary)"
        size={110}
        strokeWidth={10}
        label="Wind Speed"
        unit={unit}
      >
        <span className="text-2xl font-semibold tabular-nums text-foreground leading-none">
          {speed === 0 ? "--" : speed}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </GaugeArc>
      <div className="mt-1 flex w-full justify-around text-[10px] text-muted-foreground">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono tabular-nums text-foreground">{avg}</span>
          <span>Avg</span>
        </div>
        <div className="h-6 w-px bg-border" aria-hidden="true" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono tabular-nums text-foreground">{gust}</span>
          <span>Gust</span>
        </div>
      </div>
    </div>
  )
}
