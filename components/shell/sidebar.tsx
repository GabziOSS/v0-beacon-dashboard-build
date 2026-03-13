'use client'

import * as React from 'react'
import { useEffect, useState, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { href: '/map', label: 'Map', icon: Map, enabled: true },
  { href: '/alerts', label: 'Alerts', icon: Bell, enabled: true },
  { href: '/users', label: 'Users', icon: Users, enabled: true },
  { href: '/settings', label: 'Settings', icon: Settings, enabled: true },
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
    throw new Error('useSidebarContext must be used within SidebarProvider')
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('beacon-sidebar-collapsed')
    if (stored !== null) setCollapsed(stored === 'true')
  }, [])

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}>
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
        'w-9 h-9 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden',
        className
      )}
      aria-label="Open navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}

export function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebarContext()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('beacon-sidebar-collapsed', String(next))
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  const sidebarContent = (isMobileView: boolean) => (
    <>
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          {(isMobileView || !collapsed) && (
            <span className="font-semibold text-[15px] tracking-tight text-sidebar-foreground truncate">
              CivicPulse
            </span>
          )}
        </div>
      </div>

      {/* Nav - scrollable on short viewports */}
      <nav
        className="flex-1 py-3 px-1.5 flex flex-col gap-0.5 overflow-y-auto min-h-0"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon, enabled }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={<Icon className="w-[18px] h-[18px] shrink-0" />}
              active={active}
              enabled={enabled}
              collapsed={!isMobileView && collapsed}
              onClick={() => isMobileView && setMobileOpen(false)}
            />
          )
        })}
      </nav>

      {/* Bottom: user chip */}
      <div className="px-1.5 pb-3 border-t border-sidebar-border pt-3 space-y-2 shrink-0">
        <div
          className={cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-sm',
            !isMobileView && collapsed ? 'justify-center' : ''
          )}
        >
          <div className="w-7 h-7 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-primary font-mono">
              {user?.avatar || '?'}
            </span>
          </div>
          {(isMobileView || !collapsed) && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-foreground truncate leading-tight">
                {user?.name || 'Guest'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono">
                {user?.org || ''}
              </p>
            </div>
          )}
        </div>
        {/* Sign out */}
        <button
          onClick={signOut}
          className={cn(
            'flex items-center gap-2.5 w-full px-2 py-2 rounded-sm text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
            !isMobileView && collapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(isMobileView || !collapsed) && <span className="text-xs font-medium">Sign out</span>}
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
          className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation for CivicPulse dashboard</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full">{sidebarContent(true)}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Traditional collapsible sidebar
  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-in-out shrink-0',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      {sidebarContent(false)}

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
    'relative flex items-center gap-2.5 px-2 py-2 rounded-sm text-sm transition-colors duration-100',
    collapsed ? 'justify-center' : '',
    active
      ? 'bg-sidebar-accent text-primary'
      : enabled
        ? 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer'
        : 'text-muted-foreground/30 cursor-not-allowed pointer-events-none'
  )

  return (
    <div className="relative">
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      {enabled ? (
        <Link
          href={href}
          className={base}
          aria-current={active ? 'page' : undefined}
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
