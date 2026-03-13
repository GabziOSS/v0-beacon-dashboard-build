'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StatCardData } from '@/lib/types'

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const frame = useRef<number>(0)
  useEffect(() => {
    const start = performance.now()
    function step(now: number) {
      const elapsed = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setValue(parseFloat((eased * target).toFixed(1)))
      if (elapsed < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])
  return value
}

export function StatCard({ data }: { data: StatCardData }) {
  const displayed = useCountUp(data.value)
  const isNegativeTrend = data.delta < 0
  // For response time, lower is better — flip color logic
  const isResponseTime = data.unit === 'min'
  const isBad = isResponseTime ? data.delta > 0 : data.delta < 0
  const isGood = isResponseTime ? data.delta < 0 : data.delta > 0

  const max = Math.max(...data.sparkline)

  return (
    <div
      className={cn(
        'flex flex-col h-full p-3.5 gap-2 relative',
        isBad && 'shadow-[var(--glow-destructive)]'
      )}
    >
      {/* Header label */}
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide leading-tight">
        {data.label}
      </span>

      {/* Dominant number section */}
      <div className="flex-1 flex flex-col justify-center py-2">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-semibold font-mono tabular-nums text-foreground leading-none tracking-tight">
            {data.unit === 'min' ? displayed.toFixed(1) : Math.round(displayed).toLocaleString()}
          </span>
          {data.unit && (
            <span className="text-xs text-muted-foreground font-mono self-baseline">
              {data.unit}
            </span>
          )}
        </div>
      </div>

      {/* Delta badge */}
      <div className="flex items-center gap-1">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-medium font-mono px-1 py-0.5 rounded-sm shrink-0',
            isGood
              ? 'bg-success-dim text-success'
              : isBad
                ? 'bg-destructive-dim text-destructive'
                : 'bg-muted text-muted-foreground'
          )}
        >
          {isGood ? (
            <TrendingUp className="w-2.5 h-2.5" />
          ) : (
            <TrendingDown className="w-2.5 h-2.5" />
          )}
          {Math.abs(data.delta)}%
        </span>
        <span className="text-[10px] text-muted-foreground">{data.deltaLabel}</span>
      </div>

      {/* Sparkline — full width at bottom */}
      <div className="flex items-end gap-0.5 h-7 -mx-3.5 px-3.5 pb-0">
        {data.sparkline.map((v, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 transition-all',
              i === data.sparkline.length - 1 ? 'bg-primary' : 'bg-primary/35'
            )}
            style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  )
}
