export const ENABLED_THEMES = ["obsidian-ops"] as const
export type ThemeId = typeof ENABLED_THEMES[number]

export function applyTheme(id: ThemeId): void {
  document.documentElement.setAttribute("data-theme", id)
  localStorage.setItem("beacon_theme", id)
}

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "obsidian-ops"
  const stored = localStorage.getItem("beacon_theme")
  if (stored && ENABLED_THEMES.includes(stored as ThemeId)) {
    return stored as ThemeId
  }
  return "obsidian-ops"
}

export function initTheme(): void {
  if (typeof document !== "undefined") {
    applyTheme(getStoredTheme())
  }
}
