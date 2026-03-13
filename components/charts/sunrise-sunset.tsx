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
  const CY = 90
  const R = 60

  // Parse times to calculate sun position
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

  // Calculate sun position (0 = sunrise, 1 = sunset)
  const dayLength = sunsetMin - sunriseMin
  const sunProgress = Math.max(0, Math.min(1, (currentMin - sunriseMin) / dayLength))
  const sunAngle = 180 + sunProgress * 180 // 180 = left (sunrise), 360 = right (sunset)
  const sunPos = polarToCartesian(CX, CY, R - 8, sunAngle)

  const isDay = currentMin >= sunriseMin && currentMin <= sunsetMin

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <svg viewBox="0 0 200 100" className="w-full max-w-[220px]" aria-hidden>
        {/* Horizon line */}
        <line
          x1={CX - R - 10}
          y1={CY}
          x2={CX + R + 10}
          y2={CY}
          stroke="var(--border)"
          strokeWidth={1}
        />

        {/* Arc path - daytime arc */}
        <path
          d={arcPath(CX, CY, R, 180, 360)}
          fill="none"
          stroke="var(--warning)"
          strokeWidth={2}
          strokeDasharray="4 2"
          opacity={0.4}
        />

        {/* Progress arc */}
        {isDay && sunProgress > 0 && (
          <path
            d={arcPath(CX, CY, R, 180, sunAngle)}
            fill="none"
            stroke="var(--warning)"
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}

        {/* Sun indicator */}
        {isDay && (
          <g transform={`translate(${sunPos.x}, ${sunPos.y})`}>
            <circle r={8} fill="var(--warning)" />
            <circle r={12} fill="var(--warning)" opacity={0.3} />
          </g>
        )}

        {/* Sunrise marker */}
        <g transform={`translate(${CX - R}, ${CY})`}>
          <circle r={4} fill="var(--chart-1)" />
        </g>

        {/* Sunset marker */}
        <g transform={`translate(${CX + R}, ${CY})`}>
          <circle r={4} fill="var(--chart-5)" />
        </g>
      </svg>

      <div className="flex items-center justify-between w-full max-w-[200px] px-2">
        <div className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-chart-1" />
          <span className="text-xs font-mono text-foreground">{data.sunrise}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-foreground">{data.sunset}</span>
          <Moon className="w-3.5 h-3.5 text-chart-5" />
        </div>
      </div>
    </div>
  )
}
