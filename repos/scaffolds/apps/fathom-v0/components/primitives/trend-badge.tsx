"use client"

import { cn } from "@/lib/utils"

interface TrendBadgeProps {
  value: string | number
  direction?: "up" | "down" | "neutral"
  className?: string
}

export function TrendBadge({ value, direction = "neutral", className }: TrendBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
        direction === "up" && "bg-destructive/15 text-destructive",
        direction === "down" && "bg-chart-4/15 text-chart-4",
        direction === "neutral" && "bg-muted text-muted-foreground",
        className
      )}
      aria-label={`Trend: ${direction === "up" ? "increased" : direction === "down" ? "decreased" : "unchanged"} by ${value}`}
    >
      {direction === "up" && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <path d="M4 1L7 6H1L4 1Z" />
        </svg>
      )}
      {direction === "down" && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <path d="M4 7L7 2H1L4 7Z" />
        </svg>
      )}
      {value}
    </span>
  )
}
