"use client"

import { Cloud, CloudRain, Sun, CloudSun, CloudSnow, CloudLightning, Wind, Droplets } from "lucide-react"

type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rain" | "showers" | "snow" | "thunderstorm" | "windy"

const ICONS: Record<WeatherCondition, typeof Sun> = {
  "sunny": Sun,
  "partly-cloudy": CloudSun,
  "cloudy": Cloud,
  "rain": CloudRain,
  "showers": CloudRain,
  "snow": CloudSnow,
  "thunderstorm": CloudLightning,
  "windy": Wind,
}

export interface ForecastData {
  period: string
  condition: WeatherCondition
  temp: number
  humidity: number
  description: string
}

export function LocalForecast({ data }: { data: ForecastData }) {
  const Icon = ICONS[data.condition] || Cloud

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 py-2">
      <span className="text-sm font-medium text-foreground">{data.period}</span>
      <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-foreground font-mono">{data.temp}</span>
        <span className="text-sm text-muted-foreground">°C</span>
        <span className="text-muted-foreground mx-1">|</span>
        <Droplets className="w-3.5 h-3.5 text-chart-1" />
        <span className="text-sm text-muted-foreground">{data.humidity}%</span>
      </div>
      <span className="text-xs text-muted-foreground">{data.description}</span>
    </div>
  )
}
