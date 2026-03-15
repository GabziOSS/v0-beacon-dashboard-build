"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, ChevronRight, Shield } from "lucide-react"
import { cn } from "@beacon/ui"
import { SidebarTrigger } from "@/components/shell/sidebar"

const BREADCRUMBS: Record<string, string[]> = {
  "/": ["CivicPulse", "Dashboard"],
  "/map": ["CivicPulse", "Map"],
  "/alerts": ["CivicPulse", "Alerts"],
  "/users": ["CivicPulse", "Users"],
  "/settings": ["CivicPulse", "Settings"],
}

export function Topbar() {
  const pathname = usePathname()
  const crumbs = BREADCRUMBS[pathname] ?? ["CivicPulse"]
  // Initialize with null to avoid hydration mismatch, then set on client
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-2 sm:gap-4 sm:px-4">
      {/* Mobile hamburger menu trigger */}
      <SidebarTrigger />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1.5"
      >
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            )}
            <span
              className={cn(
                "max-w-[120px] truncate text-sm font-medium sm:max-w-none",
                i === crumbs.length - 1
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Live clock — center (hidden on mobile) */}
      <div className="hidden flex-1 justify-center md:flex">
        <div className="flex flex-col items-center">
          <span className="font-mono text-sm font-medium tracking-wider text-foreground tabular-nums">
            {time ?? "--:--:--"}
          </span>
          <span className="hidden text-[10px] leading-none font-medium tracking-widest text-muted-foreground uppercase lg:block">
            Calbayog City
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <button
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/20 bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  )
}
