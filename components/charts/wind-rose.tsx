"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { WindRoseData } from "@/lib/types"

const CX = 140
const CY = 140
const MAX_R = 90
const RINGS = [25, 50, 75, 100]

function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const s1 = polarXY(cx, cy, outerR, startAngle)
  const e1 = polarXY(cx, cy, outerR, endAngle)
  const s2 = polarXY(cx, cy, innerR, endAngle)
  const e2 = polarXY(cx, cy, innerR, startAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ")
}

const BIN_COLORS = [
  "var(--chart-1)",
  "var(--chart-6)",
  "var(--primary)",
]

export function WindRoseChart({ data }: { data: WindRoseData[] }) {
  const [range, setRange] = useState<"Day" | "Week" | "Month">("Week")
  const n = data.length
  const sweepAngle = 360 / n
  const gap = 4

  // Find max total for scaling
  const maxTotal = Math.max(...data.map(d => d.low + d.mid + d.high))

  return (
    <div className="flex flex-col items-center h-full gap-3">
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <svg viewBox="0 0 280 280" className="w-full max-w-[260px]" aria-hidden>
          {/* Reference rings */}
          {RINGS.map(pct => (
            <circle
              key={pct}
              cx={CX}
              cy={CY}
              r={(pct / 100) * MAX_R}
              fill="none"
              stroke="var(--border)"
              strokeWidth={0.5}
              strokeDasharray="2 3"
            />
          ))}

          {/* Direction petals */}
          {data.map((d, i) => {
            const angle = i * sweepAngle
            const bins = [d.low, d.mid, d.high]
            let innerR = 0
            return (
              <g key={d.direction}>
                {bins.map((binVal, bi) => {
                  const total = d.low + d.mid + d.high
                  const outerR = (total / maxTotal) * MAX_R * Math.min(1, (bi + 1) / 3 + (binVal / total) * 0.67)
                  const segOuter = Math.min(
                    MAX_R,
                    ((d.low * (bi === 0 ? 1 : 0) + d.mid * (bi <= 1 ? 1 : 0) + d.high) / maxTotal) * MAX_R
                  )
                  // simpler: stacked outer radius per bin
                  const cumulativeR = ((bins.slice(0, bi + 1).reduce((a, b) => a + b, 0)) / maxTotal) * MAX_R
                  const prevR = bi === 0 ? 2 : ((bins.slice(0, bi).reduce((a, b) => a + b, 0)) / maxTotal) * MAX_R
                  const startA = angle - sweepAngle / 2 + gap / 2
                  const endA = angle + sweepAngle / 2 - gap / 2
                  return (
                    <path
                      key={bi}
                      d={arcPath(CX, CY, prevR, cumulativeR, startA, endA)}
                      fill={BIN_COLORS[bi]}
                      fillOpacity={0.75 - bi * 0.1}
                    />
                  )
                })}
                {/* Cardinal label */}
                {(() => {
                  const labelR = MAX_R + 14
                  const lp = polarXY(CX, CY, labelR, angle)
                  return (
                    <text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--muted-foreground)"
                      fontSize={9}
                      fontFamily="var(--font-mono)"
                      fontWeight={500}
                    >
                      {d.direction}
                    </text>
                  )
                })()}
              </g>
            )
          })}

          {/* Center dot */}
          <circle cx={CX} cy={CY} r={3} fill="var(--primary)" />
        </svg>
      </div>

      {/* Range pills */}
      <div className="flex gap-1.5">
        {(["Day", "Week", "Month"] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "text-[10px] font-mono px-2.5 py-1 rounded-sm border transition-colors",
              range === r
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}
