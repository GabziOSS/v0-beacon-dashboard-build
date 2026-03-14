'use client'

import { useEffect, useRef, useState } from 'react'

const CX = 80
const CY = 80
const RING_R = 70

function bearingToCardinal(deg: number) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function CompassChart({ bearing, label }: { bearing: number; label: string }) {
  const [animBearing, setAnimBearing] = useState(0)
  const frame = useRef<number>(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const from = prevRef.current
    const duration = 700
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const v = from + (bearing - from) * eased
      setAnimBearing(v)
      if (t < 1) frame.current = requestAnimationFrame(step)
      else prevRef.current = bearing
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [bearing])

  const MAJOR_TICKS = Array.from({ length: 8 }, (_, i) => i * 45)
  const MINOR_TICKS = Array.from({ length: 16 }, (_, i) => i * 22.5).filter(
    v => !MAJOR_TICKS.includes(v)
  )
  const CARDINALS = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 w-full">
      <div className="relative w-full flex-1 min-h-[160px] aspect-square flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-sm max-w-[320px]" aria-hidden>
        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={RING_R} fill="none" stroke="var(--border)" strokeWidth={1} />
        <circle
          cx={CX}
          cy={CY}
          r={RING_R - 10}
          fill="none"
          stroke="var(--border)"
          strokeWidth={0.5}
          strokeDasharray="1 3"
        />

        {/* Major ticks */}
        {MAJOR_TICKS.map(angle => {
          const outer = polarXY(CX, CY, RING_R, angle)
          const inner = polarXY(CX, CY, RING_R - 8, angle)
          return (
            <line
              key={angle}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
            />
          )
        })}

        {/* Minor ticks */}
        {MINOR_TICKS.map(angle => {
          const outer = polarXY(CX, CY, RING_R, angle)
          const inner = polarXY(CX, CY, RING_R - 5, angle)
          return (
            <line
              key={angle}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="var(--border)"
              strokeWidth={0.75}
            />
          )
        })}

        {/* Cardinal labels */}
        {CARDINALS.map(c => {
          const p = polarXY(CX, CY, RING_R + 9, c.angle)
          return (
            <text
              key={c.label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={c.label === 'N' ? 'var(--primary)' : 'var(--muted-foreground)'}
              fontSize={9}
              fontFamily="var(--font-mono)"
              fontWeight={c.label === 'N' ? 700 : 400}
            >
              {c.label}
            </text>
          )
        })}

        {/* Needle group — rotates to bearing */}
        <g transform={`rotate(${animBearing}, ${CX}, ${CY})`}>
          {/* North needle — accent colored */}
          <polygon
            points={`${CX},${CY - RING_R + 14} ${CX - 5},${CY + 10} ${CX + 5},${CY + 10}`}
            fill="var(--primary)"
            opacity={0.9}
          />
          {/* South needle — muted */}
          <polygon
            points={`${CX},${CY + RING_R - 14} ${CX - 5},${CY - 10} ${CX + 5},${CY - 10}`}
            fill="var(--muted-foreground)"
            opacity={0.5}
          />
        </g>

        {/* Center */}
        <circle
          cx={CX}
          cy={CY}
          r={4}
          fill="var(--card-nested)"
          stroke="var(--primary)"
          strokeWidth={1.5}
        />
      </svg>
      </div>

      <div className="text-center">
        <p className="text-xl font-semibold font-mono tabular-nums text-foreground leading-none">
          {Math.round(animBearing)}°
        </p>
        <p className="text-[10px] text-primary font-mono font-medium mt-0.5">
          {bearingToCardinal(bearing)}
        </p>
        <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug max-w-[120px] text-center">
          {label}
        </p>
      </div>
    </div>
  )
}
