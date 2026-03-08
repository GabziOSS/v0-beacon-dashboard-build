"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StatCardData } from "@/lib/types"

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
  const isResponseTime = data.unit === "min"
  const isBad = isResponseTime ? data.delta > 0 : data.delta < 0
  const isGood = isResponseTime ? data.delta < 0 : data.delta > 0

  const max = Math.max(...data.sparkline)

  return (
    <div
      className={cn(
        "flex flex-col h-full p-3.5 gap-2",
        isBad && "shadow-[var(--glow-destructive)]"
      )}
    >
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
        {data.label}
      </span>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold font-mono tabular-nums text-foreground leading-none">
          {data.unit === "min"
            ? displayed.toFixed(1)
            : Math.round(displayed).toLocaleString()}
        </span>
        {data.unit && (
          <span className="text-sm text-muted-foreground font-mono">{data.unit}</span>
        )}
      </div>

      {/* Delta badge */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[11px] font-medium font-mono px-1.5 py-0.5 rounded-sm",
            isGood
              ? "bg-success-dim text-success"
              : isBad
                ? "bg-destructive-dim text-destructive"
                : "bg-muted text-muted-foreground"
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

      {/* Sparkline */}
      <div className="mt-auto flex items-end gap-1 h-8">
        {data.sparkline.map((v, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-sm transition-all",
              i === data.sparkline.length - 1 ? "bg-primary" : "bg-primary/25"
            )}
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}
