"use client"

import type { BulletData } from "@/lib/types"

export function BulletChart({ data }: { data: BulletData }) {
  const pctPoor       = (data.poor / data.max) * 100
  const pctAcceptable = (data.acceptable / data.max) * 100
  const pctGood       = (data.good / data.max) * 100
  const pctActual     = (data.actual / data.max) * 100
  const pctTarget     = (data.target / data.max) * 100

  return (
    <div className="flex flex-col justify-center h-full gap-4 px-2">
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
          Response Time vs SLA
        </p>

        {/* Track */}
        <div className="relative h-7 rounded-sm overflow-hidden">
          {/* Background bands */}
          <div className="absolute inset-0 flex">
            {/* Good */}
            <div
              className="h-full"
              style={{ width: `${pctGood}%`, background: "var(--success-dim)" }}
            />
            {/* Acceptable */}
            <div
              className="h-full"
              style={{
                width: `${pctAcceptable - pctGood}%`,
                background: "var(--warning-dim)",
              }}
            />
            {/* Poor */}
            <div
              className="h-full"
              style={{
                width: `${pctPoor - pctAcceptable}%`,
                background: "var(--destructive-dim)",
              }}
            />
            {/* Rest */}
            <div className="flex-1 h-full bg-muted/30" />
          </div>

          {/* Actual value bar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[40%] rounded-sm"
            style={{
              width: `${pctActual}%`,
              background: "var(--foreground)",
              opacity: 0.9,
            }}
          />

          {/* Target marker */}
          <div
            className="absolute top-1 bottom-1 w-px"
            style={{
              left: `${pctTarget}%`,
              background: "var(--primary)",
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
          <span>0</span>
          <span className="text-success">Good ≤{data.good}m</span>
          <span className="text-warning">SLA {data.acceptable}m</span>
          <span className="text-destructive">Poor ≥{data.poor}m</span>
          <span>{data.max}m</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center">
          <p className="text-2xl font-semibold font-mono tabular-nums text-foreground">{data.actual}</p>
          <p className="text-[9px] text-muted-foreground font-mono">actual (min)</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-semibold font-mono tabular-nums text-primary">{data.target}</p>
          <p className="text-[9px] text-muted-foreground font-mono">target (min)</p>
        </div>
      </div>
    </div>
  )
}
