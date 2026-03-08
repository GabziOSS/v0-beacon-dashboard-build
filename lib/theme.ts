export const THEMES = {
  "civicpulse": {
    name: "Civic Pulse",
    description: "Modern data-forward civic tech",
    font: "Sora",
    colors: { bg: "oklch(0.12 0.025 260)", primary: "oklch(0.65 0.20 250)", accent: "oklch(0.75 0.18 60)" },
  },
  "obsidian-ops": {
    name: "Obsidian Ops",
    description: "Dark ops tactical precision",
    font: "Space Grotesk",
    colors: { bg: "oklch(0.118 0.006 264)", primary: "oklch(0.72 0.155 210)", accent: "oklch(0.62 0.18 288)" },
  },
  "calbayog-gov-plus": {
    name: "Calbayog Gov+",
    description: "Official government digital identity",
    font: "Outfit",
    colors: { bg: "oklch(0.13 0.022 245)", primary: "oklch(0.55 0.12 240)", accent: "oklch(0.78 0.12 80)" },
  },
  "nwssu-academic": {
    name: "NwSSU Academic",
    description: "Institutional gravitas, modernised academia",
    font: "Crimson Pro",
    colors: { bg: "oklch(0.12 0.015 50)", primary: "oklch(0.52 0.18 20)", accent: "oklch(0.72 0.12 75)" },
  },
  "civic-fusion": {
    name: "Civic Fusion",
    description: "Authority + academia synthesised",
    font: "Inter",
    colors: { bg: "oklch(0.125 0.012 270)", primary: "oklch(0.58 0.14 245)", accent: "oklch(0.75 0.11 78)" },
  },
  "terracotta-republic": {
    name: "Terracotta Republic",
    description: "Warm civic boldness",
    font: "DM Sans",
    colors: { bg: "oklch(0.13 0.018 45)", primary: "oklch(0.62 0.18 42)", accent: "oklch(0.80 0.16 82)" },
  },
  "teal-command": {
    name: "Teal Command",
    description: "Calm authority, emergency services",
    font: "Space Grotesk",
    colors: { bg: "oklch(0.12 0.025 185)", primary: "oklch(0.68 0.14 175)", accent: "oklch(0.72 0.14 25)" },
  },
  "midnight-mono": {
    name: "Midnight Mono",
    description: "High-contrast monochrome",
    font: "IBM Plex Mono",
    colors: { bg: "oklch(0.08 0 0)", primary: "oklch(0.96 0 0)", accent: "oklch(0.75 0.15 200)" },
  },
} as const

export const ENABLED_THEMES = Object.keys(THEMES) as ThemeId[]
export type ThemeId = keyof typeof THEMES

export function applyTheme(id: ThemeId): void {
  document.documentElement.setAttribute("data-theme", id)
  localStorage.setItem("beacon_theme", id)
}

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "civicpulse"
  const stored = localStorage.getItem("beacon_theme")
  if (stored && stored in THEMES) {
    return stored as ThemeId
  }
  return "civicpulse"
}

export function initTheme(): void {
  if (typeof document !== "undefined") {
    applyTheme(getStoredTheme())
  }
}
