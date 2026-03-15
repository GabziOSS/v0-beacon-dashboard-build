"use client"

import { useState, useEffect } from "react"
import { useAuth, getLastLogin } from "@/lib/auth"
import {
  THEMES,
  type ThemeId,
  type ThemeMode,
  applyTheme,
  getStoredTheme,
  getStoredMode,
  getEffectiveMode,
  initThemeListener,
} from "@/lib/theme"
import { getStoredPreset, savePreset, type PresetId } from "@/lib/presets"
import { cn } from "@beacon/ui"
import {
  Trash2,
  Download,
  LogOut,
  Check,
  Monitor,
  Moon,
  Sun,
  Cloud,
} from "lucide-react"

const ZONE_NAMES: Record<string, string> = {
  z01: "Poblacion Central",
  z02: "Bagacay District",
  z03: "Calbayog Port Area",
  z04: "Nijaga–San Policarpo",
}

const MODE_OPTIONS: Array<{
  value: ThemeMode
  label: string
  description: string
  icon: typeof Monitor
}> = [
  {
    value: "auto",
    label: "System",
    description: "Follow device preference",
    icon: Monitor,
  },
  { value: "dark", label: "Dark", description: "High contrast", icon: Moon },
  { value: "soft", label: "Soft", description: "Reduced glare", icon: Cloud },
  { value: "light", label: "Light", description: "Daytime mode", icon: Sun },
]

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() =>
    getStoredTheme()
  )
  const [currentMode, setCurrentMode] = useState<ThemeMode>(() =>
    getStoredMode()
  )
  const [effectiveMode, setEffectiveMode] = useState<"dark" | "soft" | "light">(
    () => getEffectiveMode(getStoredMode())
  )
  const [defaultPreset, setDefaultPreset] = useState<PresetId>(() =>
    getStoredPreset()
  )
  const [persistLayout, setPersistLayout] = useState(
    () => localStorage.getItem("beacon_persist_layout") !== "false"
  )
  const [denseMode, setDenseMode] = useState(
    () => localStorage.getItem("beacon_dense_mode") === "true"
  )
  const [alertThreshold, setAlertThreshold] = useState(
    () => localStorage.getItem("beacon_alert_threshold") || "high"
  )
  const [soundAlerts, setSoundAlerts] = useState(
    () => localStorage.getItem("beacon_sound_alerts") !== "false"
  )
  const [desktopNotif, setDesktopNotif] = useState(
    () => localStorage.getItem("beacon_desktop_notif") === "true"
  )
  const [lastLogin, setLastLogin] = useState<string | null>(() =>
    getLastLogin()
  )

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
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("beacon_blocks_")
    )
    keys.forEach((k) => localStorage.removeItem(k))
    alert(`Cleared ${keys.length} saved layout(s)`)
  }

  function handleExportSettings() {
    const data: Record<string, string | null> = {}
    Object.keys(localStorage)
      .filter((k) => k.startsWith("beacon_"))
      .forEach((k) => {
        data[k] = localStorage.getItem(k)
      })
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "beacon-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const formattedLastLogin = lastLogin
    ? new Date(lastLogin).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never"

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-xl font-semibold text-foreground">Settings</h1>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left column — profile */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="rounded-sm border border-border bg-card p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm border border-primary/20 bg-primary/15">
                <span className="font-mono text-xl font-semibold text-primary">
                  {user?.avatar}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
                <p className="mt-0.5 text-xs text-primary capitalize">
                  {user?.role}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {user?.org}
                </p>
              </div>
            </div>
            <button className="h-8 w-full rounded-sm border border-border bg-secondary text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
              Edit Profile
            </button>
          </div>

          {/* Assigned zones */}
          <div className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-3 text-xs font-semibold text-foreground">
              Assigned Zones
            </h3>
            <div className="space-y-1.5">
              {user?.zones.map((z) => (
                <div
                  key={z}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="w-8 font-mono text-foreground">{z}</span>
                  <span>{ZONE_NAMES[z] || z}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Last login: {formattedLastLogin}
          </p>
        </div>

        {/* Right column — settings panels */}
        <div className="space-y-6">
          {/* Appearance */}
          <section className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Appearance
            </h3>

            {/* Mode selector */}
            <div className="mb-6">
              <p className="mb-3 text-xs text-muted-foreground">Display mode</p>
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {MODE_OPTIONS.map(
                  ({ value, label, description, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleModeChange(value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-sm border p-2.5 transition-all",
                        currentMode === value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "bg-card-nested border-border hover:border-primary/30"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium text-foreground">
                        {label}
                      </span>
                      <span className="text-center text-[9px] leading-tight text-muted-foreground">
                        {description}
                      </span>
                      {currentMode === value && (
                        <span className="mt-0.5 font-mono text-[9px] text-primary">
                          {value === "auto" ? `(${effectiveMode})` : "active"}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Theme selector */}
            <p className="mb-3 text-xs text-muted-foreground">Select a theme</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(
                Object.entries(THEMES) as [ThemeId, (typeof THEMES)[ThemeId]][]
              ).map(([id, theme]) => {
                const colors = theme.colors[effectiveMode]
                return (
                  <button
                    key={id}
                    onClick={() => handleThemeChange(id)}
                    className={cn(
                      "relative flex flex-col items-start rounded-sm border p-3 text-left transition-all",
                      currentTheme === id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "bg-card-nested border-border hover:border-primary/30"
                    )}
                  >
                    {currentTheme === id && (
                      <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="mb-2 flex gap-1">
                      <div
                        className="h-4 w-4 rounded-sm"
                        style={{ background: colors.bg }}
                      />
                      <div
                        className="h-4 w-4 rounded-sm"
                        style={{ background: colors.primary }}
                      />
                      <div
                        className="h-4 w-4 rounded-sm"
                        style={{ background: colors.accent }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {theme.name}
                    </span>
                    <span className="text-[10px] leading-tight text-muted-foreground">
                      {theme.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Dashboard */}
          <section className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Dashboard
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Default preset
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Which dashboard view to load on startup
                  </p>
                </div>
                <select
                  value={defaultPreset}
                  onChange={(e) =>
                    handlePresetChange(e.target.value as PresetId)
                  }
                  className="h-8 rounded-sm border border-border bg-input px-2 text-xs text-foreground"
                >
                  <option value="overview">Overview</option>
                  <option value="weather_station">Weather Station</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Persist layout
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Save block positions to localStorage
                  </p>
                </div>
                <Toggle
                  checked={persistLayout}
                  onChange={(v) => {
                    setPersistLayout(v)
                    localStorage.setItem("beacon_persist_layout", String(v))
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Dense mode
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Reduce card padding and text size
                  </p>
                </div>
                <Toggle
                  checked={denseMode}
                  onChange={(v) => {
                    setDenseMode(v)
                    localStorage.setItem("beacon_dense_mode", String(v))
                  }}
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Alert threshold
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Minimum severity for notifications
                  </p>
                </div>
                <select
                  value={alertThreshold}
                  onChange={(e) => {
                    setAlertThreshold(e.target.value)
                    localStorage.setItem(
                      "beacon_alert_threshold",
                      e.target.value
                    )
                  }}
                  className="h-8 rounded-sm border border-border bg-input px-2 text-xs text-foreground"
                >
                  <option value="critical">Critical only</option>
                  <option value="high">High+</option>
                  <option value="medium">Medium+</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Sound alerts
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Play audio for incoming alerts
                  </p>
                </div>
                <Toggle
                  checked={soundAlerts}
                  onChange={(v) => {
                    setSoundAlerts(v)
                    localStorage.setItem("beacon_sound_alerts", String(v))
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Desktop notifications
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Show browser notifications
                  </p>
                </div>
                <Toggle
                  checked={desktopNotif}
                  onChange={(v) => {
                    setDesktopNotif(v)
                    localStorage.setItem("beacon_desktop_notif", String(v))
                  }}
                />
              </div>
            </div>
          </section>

          {/* Data */}
          <section className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Data</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearLayouts}
                className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Trash2 className="h-3 w-3" />
                Clear saved layouts
              </button>
              <button
                onClick={handleExportSettings}
                className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Download className="h-3 w-3" />
                Export settings
              </button>
              <button
                onClick={signOut}
                className="flex h-8 items-center gap-1.5 rounded-sm bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-foreground transition-transform",
          checked && "translate-x-4"
        )}
      />
    </button>
  )
}
