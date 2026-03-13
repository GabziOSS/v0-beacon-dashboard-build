'use client'

export interface MultiTempData {
  outsideTemp: number
  heatIndex: number
  wetBulb: number
  min?: number
  max?: number
}

const LABELS = [
  { key: 'outsideTemp', label: 'Outside\nTemp', color: 'var(--chart-1)' },
  { key: 'heatIndex', label: 'Heat\nIndex', color: 'var(--chart-2)' },
  { key: 'wetBulb', label: 'Wet\nBulb', color: 'var(--chart-3)' },
] as const

export function MultiTempBar({ data }: { data: MultiTempData }) {
  const min = data.min ?? 0
  const max = data.max ?? 50
  const range = max - min

  return (
    <div className="flex flex-col h-full justify-center px-2 py-2">
      {/* Y-axis labels at top */}
      <div className="flex justify-between text-[9px] text-muted-foreground font-mono px-8 mb-1">
        <span>{max} °C</span>
      </div>

      {/* Bars container */}
      <div className="flex-1 flex items-end justify-center gap-3 px-4 pb-6">
        {LABELS.map(({ key, label, color }) => {
          const value = data[key as keyof MultiTempData] as number
          const pct = ((value - min) / range) * 100

          return (
            <div key={key} className="flex flex-col items-center gap-1.5 flex-1 max-w-[50px]">
              {/* Value above bar */}
              <span className="text-xs font-semibold text-foreground font-mono">{value}</span>

              {/* Bar */}
              <div className="relative w-full h-24 bg-muted rounded-sm overflow-hidden">
                <div
                  className="absolute bottom-0 w-full rounded-sm transition-all duration-500"
                  style={{
                    height: `${pct}%`,
                    background: color,
                  }}
                />
              </div>

              {/* Label */}
              <span className="text-[9px] text-muted-foreground text-center whitespace-pre-line leading-tight">
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Y-axis labels at bottom */}
      <div className="flex justify-between text-[9px] text-muted-foreground font-mono px-8">
        <span>{min} °C</span>
      </div>
    </div>
  )
}
