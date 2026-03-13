'use client'

export interface RainBarData {
  values: Array<{ label: string; value: number }>
  unit?: string
  max?: number
}

export function RainBar({ data }: { data: RainBarData }) {
  const unit = data.unit ?? 'mm'
  const maxValue = data.max ?? Math.max(...data.values.map(v => v.value), 1)

  // Color gradient based on value intensity
  const getColor = (value: number, index: number) => {
    const colors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="flex flex-col h-full justify-between px-3 py-2">
      {/* Y-axis max label */}
      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
        <span>
          {maxValue.toLocaleString()} {unit}
        </span>
      </div>

      {/* Bars container */}
      <div className="flex-1 flex items-end justify-center gap-2 py-2">
        {data.values.map((item, i) => {
          const pct = (item.value / maxValue) * 100

          return (
            <div key={item.label} className="flex flex-col items-center gap-1 flex-1 max-w-[60px]">
              {/* Value above bar */}
              <span className="text-[10px] font-medium text-foreground font-mono">
                {item.value.toLocaleString()}
              </span>

              {/* Bar */}
              <div className="relative w-full h-20 bg-muted rounded-sm overflow-hidden">
                <div
                  className="absolute bottom-0 w-full rounded-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(pct, 2)}%`,
                    background: getColor(item.value, i),
                  }}
                />
              </div>

              {/* Label */}
              <span className="text-[9px] text-muted-foreground text-center">{item.label}</span>
            </div>
          )
        })}
      </div>

      {/* Y-axis min label */}
      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
        <span>0.0 {unit}</span>
      </div>
    </div>
  )
}
