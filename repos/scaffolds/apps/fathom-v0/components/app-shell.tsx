"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Map,
  Shield,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Map View", icon: Map },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-card/80 backdrop-blur-md">
        <div className="flex w-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="size-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                SafeCity
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "text-secondary-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                3
              </span>
            </Button>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                A
              </div>
              <div className="hidden flex-col md:flex">
                <span className="text-xs font-medium text-foreground leading-tight">Admin</span>
                <span className="text-[11px] text-muted-foreground leading-tight">admin@safecity.ph</span>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" size="icon-sm" aria-label="Sign out">
                <LogOut className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-background/95 backdrop-blur-sm lg:hidden">
          <nav className="flex flex-col gap-1 p-4" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="size-5" />
                    {item.label}
                    {isActive && <Badge variant="secondary" className="ml-auto text-[10px]">Active</Badge>}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      <main className="flex-1">{children}</main>
    </div>
  )
}
