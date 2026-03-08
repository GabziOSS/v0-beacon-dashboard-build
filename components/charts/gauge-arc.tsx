"use client"

import { useEffect, useRef, useState } from "react"

const CX = 100
const CY = 110
const R = 80
const START_ANGLE = 180
const END_ANGLE = 0

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

  // Arc segments
  const strokeW = 10
  const segColor = (v: number) => {
    const pct = v / max
    if (pct < 0.4) return "var(--success)"
    if (pct < 0.7) return "var(--warning)"
    return "var(--destructive)"
  }

  return (
    <div className="flex flex-col items-center h-full justify-center gap-1">
      <svg viewBox="0 0 200 120" className="w-full max-w-[220px]" aria-hidden>
        {/* Background arc */}
        <path
          d={arcPath(CX, CY, R, 180, 360)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Success segment 0–40% */}
        {pct > 0 && (
          <path
            d={arcPath(CX, CY, R, 180, 180 + Math.min(pct, 0.4) * 180)}
            fill="none"
            stroke="var(--success)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        )}
        {/* Warning segment 40–70% */}
        {pct > 0.4 && (
          <path
            d={arcPath(CX, CY, R, 180 + 0.4 * 180, 180 + Math.min(pct, 0.7) * 180)}
            fill="none"
            stroke="var(--warning)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        )}
        {/* Destructive segment 70–100% */}
        {pct > 0.7 && (
          <path
            d={arcPath(CX, CY, R, 180 + 0.7 * 180, 180 + pct * 180)}
            fill="none"
            stroke="var(--destructive)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        )}
        {/* Needle */}
        <g transform={`rotate(${needleAngle - 180}, ${CX}, ${CY})`}>
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - R + 12}
            stroke="var(--foreground)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
        {/* Center dot */}
        <circle cx={CX} cy={CY} r={5} fill="var(--foreground)" />

        {/* Value */}
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          fill="var(--foreground)"
          fontSize={22}
          fontFamily="var(--font-mono)"
          fontWeight={600}
        >
          {Math.round(animValue)}
        </text>
      </svg>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest -mt-1">
        {label}
      </span>
    </div>
  )
}
