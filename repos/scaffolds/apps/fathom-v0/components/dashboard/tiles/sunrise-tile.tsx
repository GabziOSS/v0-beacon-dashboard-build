"use client"

import * as React from "react"

interface SunriseTileProps {
  rise?: string
  set?: string
  /** 0–1 fraction of day elapsed */
  progress?: number
}

export function SunriseTileContent({
  rise = "5:59 AM",
  set = "5:51 PM",
  progress = 0.45,
}: SunriseTileProps) {
  const SIZE = 100
  const cx = SIZE / 2
  const cy = SIZE * 0.72
  const r = 36
  const startAngle = 200
  const endAngle = 340

  function pt(deg: number) {
    const rad = (deg - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const start = pt(startAngle)
  const end = pt(endAngle)
  const sunAngle = startAngle + progress * (endAngle - startAngle)
  const sunPos = pt(sunAngle)

  return (
    <div className="flex h-full flex-col items-center justify-between gap-1 p-3">
      <figure aria-label={`Sunrise at ${rise}, sunset at ${set}`} className="flex flex-col items-center">
        <svg
          width={SIZE}
          height={SIZE * 0.7}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          className="overflow-visible"
        >
          {/* Horizon line */}
          <line
            x1={start.x - 6}
            y1={cy}
            x2={end.x + 6}
            y2={cy}
            stroke="var(--border)"
            strokeWidth={1}
          />
          {/* Arc track */}
          <path
            d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={1.5}
            strokeDasharray="3 2"
          />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180
            return (
              <line
                key={a}
                x1={sunPos.x + 7 * Math.cos(rad)}
                y1={sunPos.y + 7 * Math.sin(rad)}
                x2={sunPos.x + 11 * Math.cos(rad)}
                y2={sunPos.y + 11 * Math.sin(rad)}
                stroke="var(--primary)"
                strokeWidth={1.2}
                strokeLinecap="round"
                className="motion-safe:transition-all motion-safe:duration-700"
              />
            )
          })}
          {/* Sun disc */}
          <circle
            cx={sunPos.x}
            cy={sunPos.y}
            r={6}
            fill="var(--primary)"
            className="motion-safe:transition-all motion-safe:duration-700"
          />
        </svg>
        <figcaption className="sr-only">Sun arc from {rise} to {set}</figcaption>
      </figure>
      <div className="flex w-full justify-between text-[11px]">
        <div className="flex flex-col items-start gap-0.5">
          <span className="font-semibold text-foreground tabular-nums">{rise}</span>
          <span className="text-muted-foreground">Sunrise</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-semibold text-foreground tabular-nums">{set}</span>
          <span className="text-muted-foreground">Sunset</span>
        </div>
      </div>
    </div>
  )
}
