"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
}

interface TileTabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function TileTabBar({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TileTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Tile views"
      className={cn("flex items-center gap-0.5", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              "motion-safe:transition-colors motion-safe:duration-100",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
