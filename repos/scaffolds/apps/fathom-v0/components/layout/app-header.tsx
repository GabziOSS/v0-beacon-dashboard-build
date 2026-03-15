'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Palette,
  Sun,
  Moon,
  LayoutGrid,
  Table,
  Map,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  sidebarMobileOpenAtom, 
  viewModeAtom, 
  commandPaletteOpenAtom,
  isRefreshingAtom,
  isFullscreenAtom,
} from '@/lib/atoms/ui'
import { 
  unreadNotificationCountAtom, 
  notificationsAtom,
  markAllNotificationsReadAtom,
} from '@/lib/atoms/auth'
import { themeNameAtom, availableThemesAtom } from '@/lib/atoms/theme'
import type { ViewMode } from '@/lib/types/dashboard'
import type { ThemeName } from '@/lib/types/theme'

const viewModeOptions: { value: ViewMode; label: string; icon: React.ElementType }[] = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { value: 'table', label: 'Table', icon: Table },
  { value: 'map', label: 'Map', icon: Map },
]

export function AppHeader() {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useAtom(sidebarMobileOpenAtom)
  const [viewMode, setViewMode] = useAtom(viewModeAtom)
  const [themeName, setThemeName] = useAtom(themeNameAtom)
  const [isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom)
  const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom)
  const setCommandPaletteOpen = useSetAtom(commandPaletteOpenAtom)
  const unreadCount = useAtomValue(unreadNotificationCountAtom)
  const notifications = useAtomValue(notificationsAtom)
  const markAllRead = useSetAtom(markAllNotificationsReadAtom)
  const availableThemes = useAtomValue(availableThemesAtom)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* View mode switcher */}
        <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 md:flex">
          {viewModeOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                variant={viewMode === option.value ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(option.value)}
                className={cn(
                  'gap-2',
                  viewMode === option.value && 'bg-background shadow-sm'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{option.label}</span>
              </Button>
            )
          })}
        </div>

        <Separator orientation="vertical" className="hidden h-6 md:block" />

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search incidents, zones..."
            className="w-64 bg-muted pl-9 lg:w-80"
            onFocus={() => setCommandPaletteOpen(true)}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded bg-background px-1.5 py-0.5 font-mono text-xs text-muted-foreground lg:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Refresh */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
        </Button>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            <DropdownMenuItem>Export as JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Fullscreen */}
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="hidden md:flex">
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Theme Switcher with 3-dot color preview */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => setThemeName(theme.name as ThemeName)}
                className={cn(
                  'flex items-center justify-between gap-3',
                  themeName === theme.name && 'bg-accent'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* 3-dot color preview swatch */}
                  <div className="flex items-center gap-0.5">
                    <span 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <span 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: theme.colors.background }}
                    />
                  </div>
                  <span className="text-sm">{theme.label}</span>
                </div>
                {themeName === theme.name && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto py-1 text-xs"
                  onClick={() => markAllRead()}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3',
                    !notification.read && 'bg-accent/50'
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <Badge
                      variant={
                        notification.type === 'warning' ? 'destructive' :
                        notification.type === 'error' ? 'destructive' :
                        notification.type === 'success' ? 'default' : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notification.message}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
