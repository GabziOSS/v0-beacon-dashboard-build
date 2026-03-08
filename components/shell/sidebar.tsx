"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  Bell,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, enabled: true },
  { href: "/map", label: "Map", icon: Map, enabled: true },
  { href: "/alerts", label: "Alerts", icon: Bell, enabled: false },
  { href: "/users", label: "Users", icon: Users, enabled: false },
  { href: "/settings", label: "Settings", icon: Settings, enabled: false },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem("beacon-sidebar-collapsed")
    if (stored !== null) setCollapsed(stored === "true")
  }, [])

  function toggle() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("beacon-sidebar-collapsed", String(next))
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-in-out shrink-0",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[15px] tracking-tight text-sidebar-foreground truncate">
              Beacon
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-1.5 flex flex-col gap-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon, enabled }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={<Icon className="w-[18px] h-[18px] shrink-0" />}
              active={active}
              enabled={enabled}
              collapsed={collapsed}
            />
          )
        })}
      </nav>

      {/* Bottom: user chip */}
      <div className="px-1.5 pb-3 border-t border-sidebar-border pt-3">
        <div
          className={cn(
            "flex items-center gap-2.5 px-2 py-2 rounded-sm",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-7 h-7 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-primary font-mono">EC</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate leading-tight">
                E. Coordinador
              </p>
              <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono">
                CDRRMO · Calbayog
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-[68px] w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center hover:bg-secondary transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </aside>
  )
}

function NavItem({
  href,
  label,
  icon,
  active,
  enabled,
  collapsed,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
  enabled: boolean
  collapsed: boolean
}) {
  const base = cn(
    "relative flex items-center gap-2.5 px-2 py-2 rounded-sm text-sm transition-colors duration-100",
    collapsed ? "justify-center" : "",
    active
      ? "bg-sidebar-accent text-primary"
      : enabled
        ? "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer"
        : "text-muted-foreground/30 cursor-not-allowed pointer-events-none"
  )

  return (
    <div className="relative">
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      {enabled ? (
        <Link href={href} className={base} aria-current={active ? "page" : undefined}>
          {icon}
          {!collapsed && <span className="truncate font-medium">{label}</span>}
        </Link>
      ) : (
        <span className={base} aria-disabled="true">
          {icon}
          {!collapsed && <span className="truncate font-medium">{label}</span>}
        </span>
      )}
    </div>
  )
}
