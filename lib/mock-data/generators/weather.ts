import { rng, randFloat, randInt, randNormal } from '../seed'
import type { WeatherData, CalendarDay } from '../types'

export function generateWeather(): WeatherData {
  const windSpeed = randFloat(3, 8)
  const windBearing = randFloat(30, 60)
  const twhIndex = randFloat(28, 31)
  const humidity = randFloat(75, 85)

  // Barometer: 8 readings at 30-min intervals, 2:00 PM – 5:30 PM
  const barometer: WeatherData['barometer'] = []
  let pressure = randFloat(757, 759)
  for (let i = 0; i < 8; i++) {
    const hour = 14 + Math.floor(i / 2)
    const min = (i % 2) * 30
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const h12 = hour > 12 ? hour - 12 : hour
    const time = `${h12}:${min.toString().padStart(2, '0')} ${suffix}`
    barometer.push({ time, pressure: Math.round(pressure * 10) / 10 })
    pressure += randNormal(0, 0.3)
  }

  // Temp trend: 24 hours, sinusoidal temp pattern
  const tempTrend: WeatherData['tempTrend'] = []
  for (let h = 0; h < 24; h++) {
    const suffix = h >= 12 ? 'PM' : 'AM'
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    const time = `${h12}:00 ${suffix}`
    // Sinusoidal: min ~5am (25-27), max ~2pm (30-32)
    const phase = ((h - 5) / 24) * 2 * Math.PI
    const base = 28.5 + 3 * Math.sin(phase - Math.PI / 2)
    const temp = Math.round((base + randNormal(0, 0.3)) * 10) / 10
    const hum = Math.round((75 - 10 * Math.sin(phase - Math.PI / 2) + randNormal(0, 1.5)) * 10) / 10
    tempTrend.push({ time, temp, humidity: Math.max(65, Math.min(85, hum)) })
  }

  const tempGrouped = {
    outside: Math.round(randFloat(28.5, 29.5) * 10) / 10,
    heatIndex: Math.round(randFloat(30.5, 31.5) * 10) / 10,
    wetBulb: Math.round(randFloat(25.5, 26.5) * 10) / 10,
  }

  const currentRain = {
    day: Math.round(randFloat(0, 2) * 10) / 10,
    storm: Math.round(randFloat(0, 1) * 10) / 10,
    rate: Math.round(randFloat(0, 0.5) * 100) / 100,
  }

  const totalRain = {
    label: 'Total Rainfall',
    actual: Math.round(randFloat(5.5, 8) * 10) / 10,
    target: 150,
    ranges: [300, 150, 50] as [number, number, number],
    unit: 'mm',
  }

  // Rain calendar: 365 days from 2024-03-08 to 2025-03-07
  const rainCalendar: CalendarDay[] = []
  const startDate = new Date(2024, 2, 8) // March 8, 2024
  for (let d = 0; d < 365; d++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + d)
    const month = date.getMonth() // 0-indexed

    let value: number
    if (month >= 2 && month <= 4) {
      // Dry season (Mar-May): 0–3 mm, many zeros
      value = rng() < 0.6 ? 0 : randFloat(0, 3)
    } else if (month >= 5 && month <= 10) {
      // Typhoon season (Jun-Nov): frequent rain, 5–40 peaks
      value = rng() < 0.2 ? 0 : randFloat(5, 40)
    } else {
      // Transition (Dec-Feb): moderate
      value = rng() < 0.35 ? 0 : randFloat(2, 15)
    }

    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')
    rainCalendar.push({ date: `${yyyy}-${mm}-${dd}`, value: Math.round(value * 10) / 10 })
  }

  return {
    windSpeed: Math.round(windSpeed * 10) / 10,
    windBearing: Math.round(windBearing),
    twhIndex: Math.round(twhIndex * 10) / 10,
    humidity: Math.round(humidity),
    barometer,
    tempTrend,
    tempGrouped,
    currentRain,
    totalRain,
    rainCalendar,
    sunrise: '05:54',
    sunset: '17:52',
    moonPhase: 'Waxing Gibbous',
    moonIllumination: 78,
    forecast: { condition: 'Partly Cloudy', temp: 29, humidity: 78 },
  }
}
