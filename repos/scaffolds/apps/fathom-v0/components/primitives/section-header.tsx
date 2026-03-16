"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  sourceLabel?: string
  className?: string
  actions?: React.ReactNode
}

export function SectionHeader({
  title,
  subtitle,
  sourceLabel,
  className,
  actions,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start justify-between gap-2 px-3 pt-3",
        className
      )}
    >
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs font-medium text-foreground leading-tight">
          {title}
        </span>
        {sourceLabel && (
          <span className="truncate text-[10px] text-muted-foreground leading-tight">
            {sourceLabel}
          </span>
        )}
        {subtitle && (
          <span className="truncate text-[10px] text-muted-foreground/70 leading-tight mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      )}
    </div>
  )
}
