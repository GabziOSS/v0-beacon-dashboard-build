"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const DASHBOARD_ROUTES = [
  { href: "/dashboard/overview", label: "Overview", key: "overview" },
  { href: "/dashboard/station", label: "Station", key: "station" },
  { href: "/dashboard/table", label: "Table", key: "table" },
]

export function DashboardTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-0 px-4 overflow-x-auto">
        {DASHBOARD_ROUTES.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              pathname === route.href
                ? "text-foreground border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
