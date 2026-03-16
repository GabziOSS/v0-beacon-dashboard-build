"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "xs" | "sm" | "md"
  className?: string
  label?: string
}

const sizeMap = { xs: "size-3", sm: "size-4", md: "size-5" }

export function Spinner({ size = "sm", className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground",
          "motion-safe:animate-spin",
          sizeMap[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
