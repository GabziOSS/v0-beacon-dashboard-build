"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { HeatmapCell, IncidentType } from "@/lib/types"

const CATEGORIES: IncidentType[] = [
  "Fire","Flood","Crime","Medical","Infrastructure","Typhoon"
]

const TYPE_COLORS: Record<IncidentType, string> = {
  Fire:           "var(--chart-5)",
  Flood:          "var(--chart-6)",
  Crime:          "var(--chart-2)",
  Medical:        "var(--chart-1)",
  Infrastructure: "var(--chart-4)",
  Typhoon:        "var(--chart-7)",
}

const DAYS = Array.from({ length: 30 }, (_, i) => i)

export function TimelineHeatmap({ data }: { data: HeatmapCell[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; count: number; label: string } | null>(null)

  const lookup = new Map(data.map(c => [`${c.category}-${c.day}`, c.count]))
  const maxCount = Math.max(...data.map(c => c.count), 1)

  return (
    <div className="h-full overflow-x-auto">
      <div className="min-w-max">
        {/* Month header */}
        <div className="flex gap-px mb-1 pl-[96px]">
          {["Mar 1", "", "", "", "", "", "Mar 7", "", "", "", "", "", "", "Mar 14", "", "", "", "", "", "", "Mar 21", "", "", "", "", "", "", "Mar 28", "", ""].map((label, i) => (
            <div key={i} className="w-5 text-[8px] text-muted-foreground font-mono shrink-0 truncate">
              {label}
            </div>
          ))}
        </div>

        {CATEGORIES.map(cat => (
          <div key={cat} className="flex items-center gap-px mb-1">
            {/* Label */}
            <div className="w-24 shrink-0 flex items-center gap-1.5 pr-2">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: TYPE_COLORS[cat] }}
              />
              <span className="text-[10px] text-muted-foreground font-mono truncate">{cat}</span>
            </div>

            {/* Cells */}
            {DAYS.map(day => {
              const count = lookup.get(`${cat}-${day}`) ?? 0
              const opacity = count === 0 ? 0.06 : 0.15 + (count / maxCount) * 0.85
              return (
                <div
                  key={day}
                  className="w-5 h-5 rounded-[2px] cursor-pointer transition-transform hover:scale-110 shrink-0"
                  style={{ background: TYPE_COLORS[cat], opacity }}
                  onMouseEnter={e => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({ x: rect.left, y: rect.top, count, label: `${cat} · Day ${day + 1}` })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })}
          </div>
        ))}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-popover border border-border rounded-sm px-2 py-1 text-xs font-mono text-foreground pointer-events-none shadow-lg"
          style={{ left: tooltip.x + 8, top: tooltip.y - 32 }}
        >
          <span className="text-muted-foreground">{tooltip.label}</span>
          {" — "}
          <span className="font-semibold">{tooltip.count}</span>
        </div>
      )}
    </div>
  )
}
