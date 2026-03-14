'use client'

import { Sun, Moon } from 'lucide-react'

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

export interface SunriseSunsetData {
  sunrise: string // "5:54 AM"
  sunset: string // "5:52 PM"
  currentTime?: Date
}

export function SunriseSunset({ data }: { data: SunriseSunsetData }) {
  const CX = 100
  const CY = 60
  const R = 45

  // Parse times to minutes since midnight
  function parseTime(timeStr: string): number {
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let h = hours
    if (period === 'PM' && hours !== 12) h += 12
    if (period === 'AM' && hours === 12) h = 0
    return h * 60 + minutes
  }

  const sunriseMin = parseTime(data.sunrise)
  const sunsetMin = parseTime(data.sunset)
  const now = data.currentTime || new Date()
  const currentMin = now.getHours() * 60 + now.getMinutes()

  // Day vs Night logic
  const isDay = currentMin >= sunriseMin && currentMin < sunsetMin
  
  let progress = 0
  let angle = 0
  
  if (isDay) {
    const dayLength = sunsetMin - sunriseMin
    progress = (currentMin - sunriseMin) / dayLength
    // Sunrise = 270 (Left), Sunset = 90 (Right, mapped to 450 for continuous arc)
    angle = 270 + progress * 180
  } else {
    // Night logic: Sunset to Sunrise
    const totalMinutes = 24 * 60
    const nightLength = (totalMinutes - sunsetMin) + sunriseMin
    const currentNightMin = currentMin >= sunsetMin 
      ? currentMin - sunsetMin 
      : (totalMinutes - sunsetMin) + currentMin
    
    progress = currentNightMin / nightLength
    // Sunset = 90 (Right), Sunrise = 270 (Left)
    angle = 90 + progress * 180
  }

  const indicatorPos = polarToCartesian(CX, CY, R - 8, angle)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 p-1 w-full overflow-hidden">
      <div className="relative w-full flex-1 aspect-[2/1] flex items-center justify-center min-h-0">
        <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-sm max-w-[400px]" aria-hidden>
          {/* Horizon line */}
          <line
            x1={CX - R - 15}
            y1={CY}
            x2={CX + R + 15}
            y2={CY}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />

          {/* Daytime arc (Upper) */}
          <path
            d={arcPath(CX, CY, R, 270, 450)}
            fill="none"
            stroke="var(--warning)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={isDay ? 0.3 : 0.1}
          />

          {/* Nighttime arc (Lower) */}
          <path
            d={arcPath(CX, CY, R, 90, 270)}
            fill="none"
            stroke="var(--chart-5)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={!isDay ? 0.3 : 0.1}
          />

          {/* Progress arcs */}
          {isDay ? (
            <path
              d={arcPath(CX, CY, R, 270, angle)}
              fill="none"
              stroke="var(--warning)"
              strokeWidth={3}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(var(--warning-rgb),0.5)]"
            />
          ) : (
            <path
              d={arcPath(CX, CY, R, 90, angle)}
              fill="none"
              stroke="var(--chart-5)"
              strokeWidth={3}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(var(--chart-5-rgb),0.5)]"
            />
          )}

          {/* Sun/Moon indicator */}
          <g transform={`translate(${indicatorPos.x}, ${indicatorPos.y})`} className="transition-all duration-500">
            {isDay ? (
              <>
                <circle r={7} fill="var(--warning)" />
                <circle r={11} fill="var(--warning)" opacity={0.2} className="animate-pulse" />
              </>
            ) : (
              <>
                <circle r={6} fill="var(--chart-5)" />
                <path 
                  d="M -3 -3 A 6 6 0 0 1 3 3 A 4 4 0 0 0 -3 -3" 
                  fill="var(--card)" 
                  opacity={0.8}
                />
                <circle r={10} fill="var(--chart-5)" opacity={0.15} className="animate-pulse" />
              </>
            )}
          </g>

          {/* Sunrise marker */}
          <g transform={`translate(${CX - R}, ${CY})`}>
            <circle r={3} fill="var(--chart-1)" />
            <circle r={6} fill="var(--chart-1)" opacity={0.2} />
          </g>

          {/* Sunset marker */}
          <g transform={`translate(${CX + R}, ${CY})`}>
            <circle r={3} fill="var(--chart-5)" />
            <circle r={6} fill="var(--chart-5)" opacity={0.2} />
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-between w-full px-6 text-muted-foreground mt-auto pb-1">
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1.5">
            <Sun className="w-3 h-3 text-chart-1" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Rise</span>
          </div>
          <span className="text-xs font-mono font-bold text-foreground">{data.sunrise}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Set</span>
            <Moon className="w-3 h-3 text-chart-5" />
          </div>
          <span className="text-xs font-mono font-bold text-foreground">{data.sunset}</span>
        </div>
      </div>
    </div>
  )
}
