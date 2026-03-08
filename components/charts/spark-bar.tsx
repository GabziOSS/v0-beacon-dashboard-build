"use client"

export function SparkBarChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>
}) {
  const max = Math.max(...data.map(d => d.value))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col justify-center h-full gap-4 px-1">
      <div className="flex items-end gap-2 h-20">
        {data.map(d => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <span
              className="text-[10px] font-semibold font-mono tabular-nums"
              style={{ color: d.color }}
            >
              {d.value}
            </span>
            <div className="w-full rounded-sm" style={{ height: `${(d.value / max) * 56}px`, background: d.color, opacity: 0.8 }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-1 text-[9px] text-muted-foreground font-mono">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
            {d.label}
            <span className="text-foreground font-medium">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
