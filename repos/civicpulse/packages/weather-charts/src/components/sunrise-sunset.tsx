'use client'

import { useState, useEffect, useRef } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@beacon/ui'

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

export function SunriseSunset({ 
  data,
  forceLayout,
  showMoonEasterEgg = true
}: { 
  data: SunriseSunsetData
  forceLayout?: 'vertical' | 'side'
  showMoonEasterEgg?: boolean
}) {
  const [isWide, setIsWide] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setIsWide(width > height * 1.5 && width > 400)
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const CX = 100
  const CY = 100
  const R = 80
  const MOON_R = 70 // Slightly closer orbit

  // Helper to parse "H:MM AM/PM"
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ')
    const [h, m] = time.split(':').map(Number)
    let hours = h
    if (period === 'PM' && h !== 12) hours += 12
    if (period === 'AM' && h === 12) hours = 0
    return hours * 60 + m
  }

  const sunriseMin = parseTime(data.sunrise)
  const sunsetMin = parseTime(data.sunset)
  const now = data.currentTime || new Date()
  const currentMin = now.getHours() * 60 + now.getMinutes()

  // Angles: 0 deg is top (12 PM), 180 deg is bottom (12 AM)
  // We'll map 24h to 360 deg, where 6 AM is 270 deg (left), 6 PM is 90 deg (right)
  const timeToAngle = (min: number) => {
    // 12 PM = 0 deg. 1 min = 360 / (24*60) = 0.25 deg
    // 12 PM is 720 mins. Angle = (min - 720) * 0.25
    return (min - 720) * 0.25
  }

  const sunriseAngle = timeToAngle(sunriseMin)
  const sunsetAngle = timeToAngle(sunsetMin)
  const currentAngle = timeToAngle(currentMin)

  const indicatorPos = polarToCartesian(CX, CY, R, currentAngle)
  const moonPos = polarToCartesian(CX, CY, MOON_R, currentAngle + 180) // Opposite side

  const isDay = currentMin >= sunriseMin && currentMin <= sunsetMin
  const effectiveIsWide = forceLayout === 'side' || (forceLayout !== 'vertical' && isWide)

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex h-full w-full min-h-0 min-w-0 p-4 gap-6",
        effectiveIsWide ? "flex-row items-center" : "flex-col items-center justify-center"
      )}
    >
      <div className={cn(
        "relative shrink-0 flex items-center justify-center bg-background/20 rounded-full",
        effectiveIsWide ? "flex-[1.5] h-full" : "w-full aspect-square max-h-[350px]"
      )}>
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full max-h-[500px] object-contain drop-shadow-xl"
        >
          <defs>
            <linearGradient id="sun-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.7" /> {/* Dawn red */}
              <stop offset="15%" stopColor="#fb923c" stopOpacity="0.9" /> {/* Early orange */}
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />   {/* Noon yellow */}
              <stop offset="85%" stopColor="#fb923c" stopOpacity="0.9" /> {/* Late orange */}
              <stop offset="100%" stopColor="#f87171" stopOpacity="0.7" /> {/* Dusk red */}
            </linearGradient>
            
            <linearGradient id="dawn-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" /> {/* Blue undertone */}
              <stop offset="50%" stopColor="#fde047" stopOpacity="0" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <radialGradient id="night-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Night Arc (Dotted) */}
          <path
            d={arcPath(CX, CY, R, sunsetAngle, sunriseAngle + 360)}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="3"
            strokeDasharray="1 6"
            strokeLinecap="round"
            opacity={0.3}
          />

          {/* Horizon Line */}
          <line 
            x1={CX - R - 15} 
            y1={CY} 
            x2={CX + R + 15} 
            y2={CY} 
            stroke="var(--muted-foreground)" 
            strokeWidth="0.5" 
            strokeDasharray="2 4"
            opacity={0.2}
          />

          {!isDay && (
            <circle cx={CX} cy={CY} r={R} fill="url(#night-glow)" opacity={0.1} />
          )}

          {/* Day Arc (Solid with gradient) */}
          <path
            d={arcPath(CX, CY, R, sunriseAngle, sunsetAngle)}
            fill="none"
            stroke="url(#sun-arc-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Dotted section highlights for dawn/dusk overlap */}
          <path
            d={arcPath(CX, CY, R, sunriseAngle - 15, sunriseAngle)}
            fill="none"
            stroke="url(#dawn-glow)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity={0.5}
          />
          <path
            d={arcPath(CX, CY, R, sunsetAngle, sunsetAngle + 15)}
            fill="none"
            stroke="url(#dawn-glow)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity={0.5}
          />

          {/* Center Info */}
          <text x={CX} y={CY - 10} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase tracking-widest font-medium">Daylight</text>
          <text x={CX} y={CY + 15} textAnchor="middle" className="fill-foreground text-xl font-bold tracking-tight">
            {Math.floor((sunsetMin - sunriseMin) / 60)}h {(sunsetMin - sunriseMin) % 60}m
          </text>

          {/* Current Position Indicator */}
          <g transform={`translate(${indicatorPos.x}, ${indicatorPos.y})`}>
            {isDay ? (
              <>
                <circle r={8} fill="#fbbf24" filter="url(#glow)" className="animate-pulse" />
                <circle r={3} fill="#fff" />
                <g transform="translate(-8.5, -8.5)">
                  <Sun size={17} className="text-amber-600 drop-shadow-sm" />
                </g>
                
                {/* Easter egg tiny moon - opposite side */}
                {showMoonEasterEgg && (
                  <g 
                    transform={`translate(${moonPos.x - indicatorPos.x}, ${moonPos.y - indicatorPos.y})`}
                    className="group/moon transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      const el = document.getElementById('moon-phase-chart')
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' })
                        el.classList.add('animate-highlight')
                        setTimeout(() => el.classList.remove('animate-highlight'), 2000)
                      }
                    }}
                  >
                    {/* Visual moon */}
                    <path 
                      d="M -2 -2 A 4 4 0 0 1 2 2 A 3 3 0 0 0 -2 -2" 
                      fill="var(--chart-5)" 
                      opacity={0.6}
                      stroke="var(--chart-5)"
                      strokeWidth={0.5}
                      className="transition-transform group-hover/moon:scale-150"
                    />
                    {/* Invisible hit area to prevent stutter */}
                    <circle r={8} fill="transparent" className="cursor-pointer" />
                  </g>
                )}
              </>
            ) : (
              <>
                <circle r={10} fill="var(--muted-foreground)" opacity={0.2} />
                <g transform="translate(-10, -10)">
                  <Moon className="w-5 h-5 text-indigo-400 drop-shadow-glow" />
                </g>
              </>
            )}
          </g>
        </svg>
      </div>

      <div className={cn(
        "flex flex-col gap-4 min-w-0 flex-1",
        effectiveIsWide ? "items-start border-l border-border/50 pl-6 py-2" : "items-center w-full"
      )}>
        <div className="flex gap-8 w-full justify-around lg:justify-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
              Sunrise
            </span>
            <span className="text-base font-bold text-foreground">{data.sunrise}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
              Sunset
            </span>
            <span className="text-base font-bold text-foreground">{data.sunset}</span>
          </div>
        </div>
        
        {!effectiveIsWide && <div className="h-px w-2/3 bg-border/40 my-1" />}
        
        <div className={cn(
          "flex flex-col gap-1 min-w-0 w-full",
          effectiveIsWide ? "items-start" : "items-center"
        )}>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Current Time</span>
          <span className="text-sm font-medium text-foreground tabular-nums">
            {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}
