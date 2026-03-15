"use client"

import * as React from "react"
import { useEffect, useState, createContext, useContext } from "react"
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
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@beacon/ui"
import { useAuth } from "@/lib/auth"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@beacon/ui"

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    enabled: true,
  },
  { href: "/map", label: "Map", icon: Map, enabled: true },
  { href: "/alerts", label: "Alerts", icon: Bell, enabled: true },
  { href: "/users", label: "Users", icon: Users, enabled: true },
  { href: "/settings", label: "Settings", icon: Settings, enabled: true },
]

// Context for mobile sidebar state
type SidebarContextType = {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("beacon-sidebar-collapsed")
    if (stored !== null) setCollapsed(stored === "true")
  }, [])

  return (
    <SidebarContext.Provider
      value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { setMobileOpen } = useSidebarContext()

  return (
    <button
      onClick={() => setMobileOpen(true)}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden",
        className
      )}
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } =
    useSidebarContext()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("beacon-sidebar-collapsed", String(next))
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  const sidebarContent = (isMobileView: boolean) => (
    <>
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          {(isMobileView || !collapsed) && (
            <span className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">
              CivicPulse
            </span>
          )}
        </div>
      </div>

      {/* Nav - scrollable on short viewports */}
      <nav
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1.5 py-3"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon, enabled }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={<Icon className="h-[18px] w-[18px] shrink-0" />}
              active={active}
              enabled={enabled}
              collapsed={!isMobileView && collapsed}
              onClick={() => isMobileView && setMobileOpen(false)}
            />
          )
        })}
      </nav>

      {/* Bottom: user chip */}
      <div className="shrink-0 space-y-2 border-t border-sidebar-border px-1.5 pt-3 pb-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-sm px-2 py-2",
            !isMobileView && collapsed ? "justify-center" : ""
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/15">
            <span className="font-mono text-[11px] font-semibold text-primary">
              {user?.avatar || "?"}
            </span>
          </div>
          {(isMobileView || !collapsed) && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs leading-tight font-medium text-sidebar-foreground">
                {user?.name || "Guest"}
              </p>
              <p className="truncate font-mono text-[10px] leading-tight text-muted-foreground">
                {user?.org || ""}
              </p>
            </div>
          )}
        </div>
        {/* Sign out */}
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            !isMobileView && collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(isMobileView || !collapsed) && (
            <span className="text-xs font-medium">Sign out</span>
          )}
        </button>
      </div>
    </>
  )

  // Mobile: Sheet-based sidebar
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Main navigation for CivicPulse dashboard
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">{sidebarContent(true)}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Traditional collapsible sidebar
  return (
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 ease-in-out md:flex",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {sidebarContent(false)}

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-[68px] -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar transition-colors hover:bg-secondary"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-muted-foreground" />
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
  onClick,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
  enabled: boolean
  collapsed: boolean
  onClick?: () => void
}) {
  const base = cn(
    "relative flex items-center gap-2.5 rounded-sm px-2 py-2 text-sm transition-colors duration-100",
    collapsed ? "justify-center" : "",
    active
      ? "bg-sidebar-accent text-primary"
      : enabled
        ? "cursor-pointer text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        : "pointer-events-none cursor-not-allowed text-muted-foreground/30"
  )

  return (
    <div className="relative">
      {active && (
        <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      {enabled ? (
        <Link
          href={href}
          className={base}
          aria-current={active ? "page" : undefined}
          onClick={onClick}
        >
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
