"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LegendRowProps {
  color: string
  label: string
  value?: string | number
  className?: string
}

export function LegendRow({ color, label, value, className }: LegendRowProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="size-2.5 shrink-0 rounded-sm"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
        {label}
      </span>
      {value !== undefined && (
        <span className="shrink-0 font-mono text-[11px] text-foreground tabular-nums">
          {value}
        </span>
      )}
    </div>
  )
}

interface LegendGroupProps {
  items: Array<{ color: string; label: string; value?: string | number }>
  className?: string
  cols?: 1 | 2 | 3
}

export function LegendGroup({ items, className, cols = 1 }: LegendGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        cols === 2 && "grid grid-cols-2",
        cols === 3 && "grid grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <LegendRow key={item.label} {...item} />
      ))}
    </div>
  )
}
