"use client"

import { useEffect, useRef, useState } from "react"

// Adjusted constants for better layout - value text positioned below arc
const CX = 100
const CY = 75      // Moved up to give room for value text below
const R = 65       // Slightly smaller for better proportions
const STROKE_W = 12

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg)
  const e = polarToCartesian(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

export function GaugeArc({
  value,
  label,
  max = 100,
}: {
  value: number
  label: string
  max?: number
}) {
  const [animValue, setAnimValue] = useState(0)
  const frame = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 800
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      // spring-like cubic-bezier(0.34, 1.56, 0.64, 1)
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
      setAnimValue(eased * value)
      if (t < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [value])

  // angle spans 180deg (left to right)
  const pct = animValue / max
  const needleAngle = 180 + pct * 180  // 180 = left, 360 = right

  return (
    <div className="flex flex-col items-center h-full justify-center gap-1 min-h-[130px]">
      <svg viewBox="0 0 200 140" className="w-full max-w-[200px]" aria-hidden>
        {/* Background arc */}
        <path
          d={arcPath(CX, CY, R, 180, 360)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
        />
        {/* Success segment 0-40% */}
        {pct > 0 && (
          <path
            d={arcPath(CX, CY, R, 180, 180 + Math.min(pct, 0.4) * 180)}
            fill="none"
            stroke="var(--success)"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
          />
        )}
        {/* Warning segment 40-70% */}
        {pct > 0.4 && (
          <path
            d={arcPath(CX, CY, R, 180 + 0.4 * 180, 180 + Math.min(pct, 0.7) * 180)}
            fill="none"
            stroke="var(--warning)"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
          />
        )}
        {/* Destructive segment 70-100% */}
        {pct > 0.7 && (
          <path
            d={arcPath(CX, CY, R, 180 + 0.7 * 180, 180 + pct * 180)}
            fill="none"
            stroke="var(--destructive)"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
          />
        )}
        
        {/* Needle - shortened to avoid overlapping value */}
        <g transform={`rotate(${needleAngle - 180}, ${CX}, ${CY})`}>
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - R + 20}
            stroke="var(--foreground)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
        
        {/* Center dot */}
        <circle cx={CX} cy={CY} r={6} fill="var(--foreground)" />

        {/* Value - positioned below arc baseline */}
        <text
          x={CX}
          y={CY + 38}
          textAnchor="middle"
          fill="var(--foreground)"
          fontSize={24}
          fontFamily="var(--font-mono)"
          fontWeight={600}
        >
          {Math.round(animValue)}
        </text>
        
        {/* Label inside SVG for better layout control */}
        <text
          x={CX}
          y={CY + 56}
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize={11}
          fontWeight={500}
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          {label}
        </text>
      </svg>
    </div>
  )
}
