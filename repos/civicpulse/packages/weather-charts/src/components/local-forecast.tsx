'use client'

import {
  Cloud,
  CloudRain,
  Sun,
  CloudSun,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
} from 'lucide-react'

type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'showers'
  | 'snow'
  | 'thunderstorm'
  | 'windy'

const ICONS: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  showers: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  windy: Wind,
}

export interface ForecastData {
  period: string
  condition: WeatherCondition
  temp: number
  humidity: number
  description: string
}

import { useRef, useState, useEffect } from 'react'
import { cn } from '@beacon/ui'

function ForecastIcon({ condition, className }: { condition: WeatherCondition; className?: string }) {
  const Icon = ICONS[condition] || Cloud
  return <Icon className={className} strokeWidth={1.5} />
}

export interface LocalForecastProps {
  data: ForecastData | ForecastData[]
}

export function LocalForecast({ data }: LocalForecastProps) {
  const items = Array.isArray(data) ? data : [data]
  const containerRef = useRef<HTMLDivElement>(null)
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      setIsWide(width > 450)
    })
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col h-full p-4 lg:p-6">
      <div className={cn(
        "grid flex-1 items-center justify-center gap-4 lg:gap-8",
        items.length > 1 && isWide ? "grid-cols-3" : "grid-cols-1"
      )}>
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex flex-col items-center gap-3 transition-opacity duration-300",
              items.length > 1 && !isWide ? "py-4 border-b border-border/10 last:border-0 w-full" : ""
            )}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                {item.period}
              </span>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150" />
                <ForecastIcon 
                  condition={item.condition} 
                  className={cn(
                    "relative transition-all duration-500 group-hover:scale-110",
                    items.length > 1 && isWide ? "w-10 h-10" : "w-16 h-16",
                    "text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                  )} 
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className={cn(
                  "font-bold text-foreground leading-none tabular-nums tracking-tight",
                  items.length > 1 && isWide ? "text-2xl" : "text-4xl"
                )}>
                  {item.temp}
                </span>
                <span className={cn(
                  "font-medium text-muted-foreground",
                  items.length > 1 && isWide ? "text-sm" : "text-lg"
                )}>°</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 bg-secondary/30 px-2 py-0.5 rounded-full border border-border/40">
                <Droplets className="w-2.5 h-2.5 text-chart-1" />
                <span className="text-[10px] font-mono text-muted-foreground/90">
                  {item.humidity}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Description footer - only show first one if not wide enough to avoid clutter */}
      <div className="mt-4 pt-4 border-t border-border/10 text-center">
        <p className="text-[10px] font-mono font-medium text-muted-foreground/60 uppercase tracking-[0.3em] truncate max-w-full">
          {items[0].description}
        </p>
      </div>
    </div>
  )
}
