"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GaugeArcProps {
  value: number
  min?: number
  max?: number
  /** Accent color for the fill arc */
  color?: string
  size?: number
  strokeWidth?: number
  label?: string
  unit?: string
  className?: string
  children?: React.ReactNode
}

export function GaugeArc({
  value,
  min = 0,
  max = 100,
  color = "var(--primary)",
  size = 120,
  strokeWidth = 10,
  label,
  unit = "",
  className,
  children,
}: GaugeArcProps) {
  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2 + size * 0.08 // slightly offset to allow bottom gap

  // Arc spans 220 degrees (from ~-200° to 40° i.e., bottom-left to bottom-right)
  const startAngle = -200
  const endAngle = 40
  const totalDeg = endAngle - startAngle

  const pct = Math.min(Math.max((value - min) / (max - min), 0), 1)

  function polarToCartesian(angleDeg: number) {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  function describeArc(fromDeg: number, toDeg: number) {
    const start = polarToCartesian(fromDeg)
    const end = polarToCartesian(toDeg)
    const large = toDeg - fromDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`
  }

  const fillEnd = startAngle + pct * totalDeg

  return (
    <figure
      role="img"
      aria-label={label ? `${label}: ${value}${unit}` : `Gauge: ${value}${unit}`}
      className={cn("relative inline-flex flex-col items-center", className)}
    >
      <svg
        width={size}
        height={size * 0.75}
        viewBox={`0 0 ${size} ${size}`}
        overflow="visible"
        aria-hidden="true"
      >
        {/* Track arc */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Fill arc */}
        {pct > 0 && (
          <path
            d={describeArc(startAngle, fillEnd)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="motion-safe:transition-all motion-safe:duration-500"
          />
        )}
      </svg>
      {children && (
        <div className="-mt-4 flex flex-col items-center gap-0">{children}</div>
      )}
      <figcaption className="sr-only">
        {label}: {value} {unit}
      </figcaption>
    </figure>
  )
}
