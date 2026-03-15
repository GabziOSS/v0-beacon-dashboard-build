'use client'

import { useAtom, useAtomValue } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Table, 
  Map, 
  Users, 
  Settings, 
  Bell,
  Shield,
  Activity,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { sidebarCollapsedAtom } from '@/lib/atoms/ui'
import { currentUserAtom, unreadNotificationCountAtom } from '@/lib/atoms/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Data Table', href: '/dashboard/table', icon: Table },
  { label: 'Map View', href: '/dashboard/map', icon: Map },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Incidents', href: '/dashboard/incidents', icon: Activity },
]

const adminNavItems: NavItem[] = [
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'Security', href: '/dashboard/security', icon: Shield },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)
  const user = useAtomValue(currentUserAtom)
  const unreadCount = useAtomValue(unreadNotificationCountAtom)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex h-14 items-center border-b border-sidebar-border px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">CivicPulse</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {/* Main Nav */}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                collapsed={collapsed}
              />
            ))}

            <Separator className="my-4 bg-sidebar-border" />

            {/* Admin Nav */}
            {!collapsed && (
              <span className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Administration
              </span>
            )}
            {adminNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border p-3">
          {/* Notifications */}
          <NavLink
            item={{ label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: unreadCount }}
            isActive={isActive('/dashboard/notifications')}
            collapsed={collapsed}
          />
          
          {/* Settings */}
          <NavLink
            item={{ label: 'Settings', href: '/dashboard/settings', icon: Settings }}
            isActive={isActive('/dashboard/settings')}
            collapsed={collapsed}
          />

          <Separator className="my-3 bg-sidebar-border" />

          {/* User */}
          <div className={cn(
            'flex items-center gap-3 rounded-lg p-2',
            collapsed ? 'justify-center' : ''
          )}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.name || 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.role || 'viewer'}
                </span>
              </div>
            )}
            {!collapsed && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'mt-2 w-full text-muted-foreground hover:text-sidebar-foreground',
              collapsed ? 'justify-center' : 'justify-start'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

function NavLink({ 
  item, 
  isActive, 
  collapsed 
}: { 
  item: NavItem
  isActive: boolean
  collapsed: boolean
}) {
  const Icon = item.icon
  
  const content = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        collapsed && 'justify-center px-0'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && item.badge > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {item.badge > 9 ? '9+' : item.badge}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">{content}</div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
