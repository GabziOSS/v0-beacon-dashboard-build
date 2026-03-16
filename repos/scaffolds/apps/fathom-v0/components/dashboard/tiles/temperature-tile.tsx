"use client"

import { GaugeArc } from "@/components/primitives/gauge-arc"

interface TemperatureTileProps {
  outside?: number
  heatIndex?: number
  dewPoint?: number
  wetBulb?: number
}

const ROWS = [
  { key: "outside",   label: "Outside Temp",  unit: "°C" },
  { key: "heatIndex", label: "Heat Index",     unit: "°C" },
  { key: "dewPoint",  label: "Dew Point",      unit: "°C" },
  { key: "wetBulb",   label: "Wet Bulb",       unit: "°C" },
] as const

export function TemperatureTileContent({
  outside  = 30,
  heatIndex = 36,
  dewPoint  = 24,
  wetBulb   = 26,
}: TemperatureTileProps) {
  const vals: Record<string, number> = { outside, heatIndex, dewPoint, wetBulb }

  return (
    <div className="flex h-full flex-col items-center gap-2 p-3 pt-1">
      <GaugeArc
        value={outside}
        min={10}
        max={50}
        color="var(--chart-3)"
        size={100}
        strokeWidth={9}
        label="Outside Temperature"
        unit="°C"
      >
        <span className="text-xl font-semibold tabular-nums text-foreground">{outside}</span>
        <span className="text-[10px] text-muted-foreground">°C</span>
      </GaugeArc>

      <div className="w-full border-t border-border/40 pt-2">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-0.5 text-[10px]">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-mono tabular-nums text-foreground">
              {vals[row.key]}{row.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
