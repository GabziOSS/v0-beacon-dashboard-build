"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OverlayPanelProps {
  children: React.ReactNode
  className?: string
  /** Position on the map */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
  role?: string
  "aria-label"?: string
  "aria-live"?: "polite" | "assertive" | "off"
}

const positionClasses = {
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
}

export function OverlayPanel({
  children,
  className,
  position = "bottom-left",
  role = "complementary",
  "aria-label": ariaLabel,
  "aria-live": ariaLive,
}: OverlayPanelProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      className={cn(
        "absolute z-20 rounded-lg border border-border/60",
        "bg-card/80 backdrop-blur-md shadow-lg",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  )
}
