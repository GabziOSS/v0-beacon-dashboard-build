'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@beacon/ui'
import type { WindRoseData } from '@civicpulse/types'

const CX = 160
const CY = 160
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
    'Z',
  ].join(' ')
}

const BIN_COLORS = [
  'oklch(0.7 0.12 180 / 0.8)', // Calm - Tealish
  'oklch(0.6 0.16 210 / 0.8)', // Light - Blueish
  'oklch(0.5 0.2 250 / 0.8)',  // Moderate - Indigo
  'oklch(0.45 0.25 280 / 0.8)', // Strong - Violet
  'oklch(0.4 0.3 320 / 0.8)',  // Gale - Magenta
  'oklch(0.35 0.35 0 / 0.8)',  // Storm - Red
]

const WIND_SPEED_BINS = [
  { label: '0-3 km/h', color: BIN_COLORS[0] },
  { label: '3-6 km/h', color: BIN_COLORS[1] },
  { label: '6-10 km/h', color: BIN_COLORS[2] },
  { label: '10-16 km/h', color: BIN_COLORS[3] },
  { label: '16-32 km/h', color: BIN_COLORS[4] },
  { label: '>32 km/h', color: BIN_COLORS[5] },
]

export function WindRoseChart({ data }: { data: WindRoseData[] }) {
  const [range, setRange] = useState<'Day' | 'Week' | 'Month'>('Week')
  const [scale, setScale] = useState(1.0)
  const [isCompact, setIsCompact] = useState(false)
  const [isWide, setIsWide] = useState(false)
  const [isTwoRows, setIsTwoRows] = useState(false)
  const [activeBins, setActiveBins] = useState<number[]>([0, 1, 2, 3, 4, 5])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setIsCompact(width < 350)
        setIsWide(width > height * 1.2 && width > 400)
        setIsTwoRows(height > 400)
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const n = data.length
  const sweepAngle = 360 / n
  const gap = 4

  const maxTotal = Math.max(...data.map(d => d.values.reduce((a, b) => a + b, 0)), 10)
  const currentMaxR = MAX_R * scale

  return (
    <div ref={containerRef} className={cn(
      "flex h-full w-full min-h-0",
      isWide ? "flex-row items-center gap-6 px-4" : "flex-col items-center gap-4"
    )}>
      <div className={cn(
        "flex-1 min-h-0 flex items-center justify-center transition-all shrink-0 relative",
        isWide ? (isTwoRows ? "flex-1" : "flex-[2]") : "max-h-full w-full"
      )}>
        <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-sm max-w-[340px]" aria-hidden>
          <defs>
            {BIN_COLORS.map((color, i) => (
              <radialGradient id={`petalGrad-${i}`} key={i} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
              </radialGradient>
            ))}
            <filter id="rose-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {RINGS.map(pct => {
            const r = (pct / 100) * currentMaxR
            return (
              <g key={pct}>
                <circle
                  cx={CX}
                  cy={CY}
                  r={r}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                  opacity={0.15}
                />
                {!isCompact && (
                  <text
                    x={CX}
                    y={CY - r - 2}
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize={6}
                    className="opacity-20 font-mono tracking-tighter"
                  >
                    {pct}%
                  </text>
                )}
              </g>
            )
          })}

          {data.map((d, i) => {
            const angle = i * sweepAngle
            return (
              <g key={d.direction}>
                {d.values.map((val, bi) => {
                  const cumulativeR =
                    (d.values.slice(0, bi + 1).reduce((a, b) => a + b, 0) / maxTotal) * currentMaxR
                  const prevR =
                    bi === 0 ? 2 : (d.values.slice(0, bi).reduce((a, b) => a + b, 0) / maxTotal) * currentMaxR
                  const startA = angle - sweepAngle / 2 + gap / 2
                  const endA = angle + sweepAngle / 2 - gap / 2
                  return (
                    <path
                      key={bi}
                      d={arcPath(CX, CY, prevR, cumulativeR, startA, endA)}
                      fill={`url(#petalGrad-${bi})`}
                      className={cn(
                        "transition-all duration-300 hover:brightness-125 cursor-help",
                        activeBins.includes(bi) ? "opacity-100" : "opacity-0 pointer-events-none"
                      )}
                      filter="url(#rose-glow)"
                    >
                      <title>{`${WIND_SPEED_BINS[bi]?.label || bi}: ${val} units`}</title>
                    </path>
                  )
                })}
                {(() => {
                  const labelR = currentMaxR + 14
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

          <circle cx={CX} cy={CY} r={3} fill="var(--primary)" />
        </svg>

        {!isCompact && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="w-6 h-6 flex items-center justify-center rounded-sm bg-background/50 border border-border text-muted-foreground hover:text-foreground text-[10px]"
              title="Zoom Out"
            >
              -
            </button>
            <button 
              onClick={() => setScale(s => Math.min(1.5, s + 0.1))}
              className="w-6 h-6 flex items-center justify-center rounded-sm bg-background/50 border border-border text-muted-foreground hover:text-foreground text-[10px]"
              title="Zoom In"
            >
              +
            </button>
          </div>
        )}
      </div>

      {!isCompact && (
        <div className={cn(
          "flex flex-col animate-in fade-in duration-300 min-h-0 min-w-0 pr-2",
          isWide ? "flex-1 border-l border-border/50 pl-6 py-2 max-h-full overflow-y-auto custom-scrollbar" : "items-center gap-4 w-full"
        )}>
          {/* Speed range section */}
          <div className={cn(
            "flex flex-col gap-2 w-full",
            !isWide && "items-center"
          )}>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">
              Speed Range
            </span>
            <div className={cn(
              "grid gap-x-4 gap-y-1.5",
              isWide ? "grid-cols-2" : "grid-cols-3 xs:grid-cols-4 sm:flex sm:flex-wrap justify-center"
            )}>
              {WIND_SPEED_BINS.map((bin, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    setActiveBins(prev => 
                      prev.includes(i) ? prev.filter(b => b !== i) : [...prev, i]
                    )
                  }}
                  className={cn(
                    "flex items-center gap-2 group transition-all active:scale-95",
                    !activeBins.includes(i) && "opacity-40 grayscale-[0.5]"
                  )}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-inset ring-black/5 ring-offset-1 ring-offset-background transition-transform group-hover:scale-125"
                    style={{ background: bin.color, boxShadow: activeBins.includes(i) ? `0 0 8px ${bin.color}` : 'none' }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    {bin.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-border/20 my-3" />

          {/* Time range section */}
          <div className={cn(
            "flex gap-4 w-full items-end justify-between",
            !isWide && "flex-col items-center"
          )}>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Period</span>
              <div className="flex gap-1 flex-wrap">
                {(['Day', 'Week', 'Month'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      'text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px] border transition-all active:scale-95',
                      range === r
                        ? 'border-primary/30 text-primary bg-primary/10'
                        : 'border-border/50 text-muted-foreground/80 hover:text-foreground hover:bg-secondary/60'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className={cn(
              "flex flex-col gap-1 items-end",
              !isWide && "items-center"
            )}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Calm</span>
              <span className="text-[10px] font-bold text-foreground font-mono bg-secondary/50 px-1.5 py-0.5 rounded border border-border/20">
                4.2%
              </span>
            </div>
          </div>
        </div>
      )}

      {isCompact && (
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-1">
          Expand →
        </div>
      )}
    </div>
  )
}
