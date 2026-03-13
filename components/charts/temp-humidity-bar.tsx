'use client'

export interface TempHumidityData {
  temperature: number // °C
  humidity: number // %
  tempMin?: number
  tempMax?: number
  humMin?: number
  humMax?: number
}

export function TempHumidityBar({ data }: { data: TempHumidityData }) {
  const tempMin = data.tempMin ?? 0
  const tempMax = data.tempMax ?? 50
  const humMin = data.humMin ?? 0
  const humMax = data.humMax ?? 100

  const tempPct = ((data.temperature - tempMin) / (tempMax - tempMin)) * 100
  const humPct = ((data.humidity - humMin) / (humMax - humMin)) * 100

  // Temperature color based on value
  const tempColor =
    data.temperature < 15
      ? 'var(--chart-1)'
      : data.temperature < 30
        ? 'var(--chart-2)'
        : 'var(--destructive)'

  return (
    <div className="flex flex-col h-full justify-center px-4 py-2">
      {/* Y-axis labels */}
      <div className="flex items-end gap-4 h-full">
        {/* Temperature scale */}
        <div className="flex flex-col justify-between h-full text-[10px] text-muted-foreground font-mono">
          <span>{tempMax} °C</span>
          <span>{Math.round((tempMax + tempMin) / 2)} °C</span>
          <span>{tempMin} °C</span>
        </div>

        {/* Bars container */}
        <div className="flex-1 flex items-end justify-center gap-8 h-full pb-6">
          {/* Temperature bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-12 h-32 bg-muted rounded-sm overflow-hidden">
              <div
                className="absolute bottom-0 w-full rounded-sm transition-all duration-500"
                style={{
                  height: `${tempPct}%`,
                  background: tempColor,
                }}
              />
              {/* Value label inside bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground font-mono drop-shadow-sm">
                  {data.temperature}
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Temp</span>
          </div>

          {/* Humidity bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-12 h-32 bg-muted rounded-sm overflow-hidden">
              <div
                className="absolute bottom-0 w-full rounded-sm transition-all duration-500"
                style={{
                  height: `${humPct}%`,
                  background: 'var(--chart-1)',
                }}
              />
              {/* Value label inside bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground font-mono drop-shadow-sm">
                  {data.humidity}
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Hum</span>
          </div>
        </div>

        {/* Humidity scale */}
        <div className="flex flex-col justify-between h-full text-[10px] text-muted-foreground font-mono text-right">
          <span>{humMax}%</span>
          <span>{Math.round((humMax + humMin) / 2)}%</span>
          <span>{humMin}%</span>
        </div>
      </div>
    </div>
  )
}
