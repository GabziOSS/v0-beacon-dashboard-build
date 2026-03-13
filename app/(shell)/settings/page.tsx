'use client'

import { useState, useEffect } from 'react'
import { useAuth, getLastLogin } from '@/lib/auth'
import {
  THEMES,
  type ThemeId,
  type ThemeMode,
  applyTheme,
  getStoredTheme,
  getStoredMode,
  getEffectiveMode,
  initThemeListener,
} from '@/lib/theme'
import { getStoredPreset, savePreset, type PresetId } from '@/lib/presets'
import { cn } from '@/lib/utils'
import { Trash2, Download, LogOut, Check, Monitor, Moon, Sun, Cloud } from 'lucide-react'

const ZONE_NAMES: Record<string, string> = {
  z01: 'Poblacion Central',
  z02: 'Bagacay District',
  z03: 'Calbayog Port Area',
  z04: 'Nijaga–San Policarpo',
}

const MODE_OPTIONS: Array<{
  value: ThemeMode
  label: string
  description: string
  icon: typeof Monitor
}> = [
  { value: 'auto', label: 'System', description: 'Follow device preference', icon: Monitor },
  { value: 'dark', label: 'Dark', description: 'High contrast', icon: Moon },
  { value: 'soft', label: 'Soft', description: 'Reduced glare', icon: Cloud },
  { value: 'light', label: 'Light', description: 'Daytime mode', icon: Sun },
]

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => getStoredTheme())
  const [currentMode, setCurrentMode] = useState<ThemeMode>(() => getStoredMode())
  const [effectiveMode, setEffectiveMode] = useState<'dark' | 'soft' | 'light'>(() =>
    getEffectiveMode(getStoredMode())
  )
  const [defaultPreset, setDefaultPreset] = useState<PresetId>(() => getStoredPreset())
  const [persistLayout, setPersistLayout] = useState(
    () => localStorage.getItem('beacon_persist_layout') !== 'false'
  )
  const [denseMode, setDenseMode] = useState(
    () => localStorage.getItem('beacon_dense_mode') === 'true'
  )
  const [alertThreshold, setAlertThreshold] = useState(
    () => localStorage.getItem('beacon_alert_threshold') || 'high'
  )
  const [soundAlerts, setSoundAlerts] = useState(
    () => localStorage.getItem('beacon_sound_alerts') !== 'false'
  )
  const [desktopNotif, setDesktopNotif] = useState(
    () => localStorage.getItem('beacon_desktop_notif') === 'true'
  )
  const [lastLogin, setLastLogin] = useState<string | null>(() => getLastLogin())

  function handleThemeChange(id: ThemeId) {
    setCurrentTheme(id)
    applyTheme(id, currentMode)
  }

  function handleModeChange(mode: ThemeMode) {
    setCurrentMode(mode)
    applyTheme(currentTheme, mode)
    setEffectiveMode(getEffectiveMode(mode))
  }

  function handlePresetChange(id: PresetId) {
    setDefaultPreset(id)
    savePreset(id)
  }

  function handleClearLayouts() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('beacon_blocks_'))
    keys.forEach(k => localStorage.removeItem(k))
    alert(`Cleared ${keys.length} saved layout(s)`)
  }

  function handleExportSettings() {
    const data: Record<string, string | null> = {}
    Object.keys(localStorage)
      .filter(k => k.startsWith('beacon_'))
      .forEach(k => {
        data[k] = localStorage.getItem(k)
      })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'beacon-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const formattedLastLogin = lastLogin
    ? new Date(lastLogin).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Never'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-xl font-semibold text-foreground">Settings</h1>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Left column — profile */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="bg-card border border-border rounded-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary font-mono">{user?.avatar}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <p className="text-xs text-primary capitalize mt-0.5">{user?.role}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user?.org}</p>
              </div>
            </div>
            <button className="w-full h-8 text-xs font-medium rounded-sm border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Assigned zones */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Assigned Zones</h3>
            <div className="space-y-1.5">
              {user?.zones.map(z => (
                <div key={z} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-8 font-mono text-foreground">{z}</span>
                  <span>{ZONE_NAMES[z] || z}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">Last login: {formattedLastLogin}</p>
        </div>

        {/* Right column — settings panels */}
        <div className="space-y-6">
          {/* Appearance */}
          <section className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Appearance</h3>

            {/* Mode selector */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-3">Display mode</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {MODE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleModeChange(value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-2.5 rounded-sm border transition-all',
                      currentMode === value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-card-nested hover:border-primary/30'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium text-foreground">{label}</span>
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">
                      {description}
                    </span>
                    {currentMode === value && (
                      <span className="text-[9px] text-primary font-mono mt-0.5">
                        {value === 'auto' ? `(${effectiveMode})` : 'active'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme selector */}
            <p className="text-xs text-muted-foreground mb-3">Select a theme</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.entries(THEMES) as [ThemeId, (typeof THEMES)[ThemeId]][]).map(
                ([id, theme]) => {
                  const colors = theme.colors[effectiveMode]
                  return (
                    <button
                      key={id}
                      onClick={() => handleThemeChange(id)}
                      className={cn(
                        'relative flex flex-col items-start p-3 rounded-sm border transition-all text-left',
                        currentTheme === id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-border bg-card-nested hover:border-primary/30'
                      )}
                    >
                      {currentTheme === id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        </div>
                      )}
                      <div className="flex gap-1 mb-2">
                        <div className="w-4 h-4 rounded-sm" style={{ background: colors.bg }} />
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ background: colors.primary }}
                        />
                        <div className="w-4 h-4 rounded-sm" style={{ background: colors.accent }} />
                      </div>
                      <span className="text-xs font-medium text-foreground">{theme.name}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        {theme.description}
                      </span>
                    </button>
                  )
                }
              )}
            </div>
          </section>

          {/* Dashboard */}
          <section className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Dashboard</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">Default preset</p>
                  <p className="text-[10px] text-muted-foreground">
                    Which dashboard view to load on startup
                  </p>
                </div>
                <select
                  value={defaultPreset}
                  onChange={e => handlePresetChange(e.target.value as PresetId)}
                  className="h-8 px-2 text-xs bg-input border border-border rounded-sm text-foreground"
                >
                  <option value="overview">Overview</option>
                  <option value="weather_station">Weather Station</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">Persist layout</p>
                  <p className="text-[10px] text-muted-foreground">
                    Save block positions to localStorage
                  </p>
                </div>
                <Toggle
                  checked={persistLayout}
                  onChange={v => {
                    setPersistLayout(v)
                    localStorage.setItem('beacon_persist_layout', String(v))
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">Dense mode</p>
                  <p className="text-[10px] text-muted-foreground">
                    Reduce card padding and text size
                  </p>
                </div>
                <Toggle
                  checked={denseMode}
                  onChange={v => {
                    setDenseMode(v)
                    localStorage.setItem('beacon_dense_mode', String(v))
                  }}
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">Alert threshold</p>
                  <p className="text-[10px] text-muted-foreground">
                    Minimum severity for notifications
                  </p>
                </div>
                <select
                  value={alertThreshold}
                  onChange={e => {
                    setAlertThreshold(e.target.value)
                    localStorage.setItem('beacon_alert_threshold', e.target.value)
                  }}
                  className="h-8 px-2 text-xs bg-input border border-border rounded-sm text-foreground"
                >
                  <option value="critical">Critical only</option>
                  <option value="high">High+</option>
                  <option value="medium">Medium+</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">Sound alerts</p>
                  <p className="text-[10px] text-muted-foreground">
                    Play audio for incoming alerts
                  </p>
                </div>
                <Toggle
                  checked={soundAlerts}
                  onChange={v => {
                    setSoundAlerts(v)
                    localStorage.setItem('beacon_sound_alerts', String(v))
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">Desktop notifications</p>
                  <p className="text-[10px] text-muted-foreground">Show browser notifications</p>
                </div>
                <Toggle
                  checked={desktopNotif}
                  onChange={v => {
                    setDesktopNotif(v)
                    localStorage.setItem('beacon_desktop_notif', String(v))
                  }}
                />
              </div>
            </div>
          </section>

          {/* Data */}
          <section className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Data</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearLayouts}
                className="h-8 px-3 text-xs font-medium rounded-sm border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" />
                Clear saved layouts
              </button>
              <button
                onClick={handleExportSettings}
                className="h-8 px-3 text-xs font-medium rounded-sm border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3 h-3" />
                Export settings
              </button>
              <button
                onClick={signOut}
                className="h-8 px-3 text-xs font-medium rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3 h-3" />
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-transform',
          checked && 'translate-x-4'
        )}
      />
    </button>
  )
}
