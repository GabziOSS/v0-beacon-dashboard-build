// ─── Theme Mode Types ────────────────────────────────────────────────────────
export type ThemeMode = 'auto' | 'dark' | 'soft' | 'light'
export type EffectiveMode = 'dark' | 'soft' | 'light'

// ─── Theme Definitions ───────────────────────────────────────────────────────
export const THEMES = {
  civicpulse: {
    name: 'Civic Pulse',
    description: 'Modern data-forward civic tech',
    font: 'Sora',
    colors: {
      dark: {
        bg: 'oklch(0.12 0.025 260)',
        primary: 'oklch(0.65 0.20 250)',
        accent: 'oklch(0.75 0.18 60)',
      },
      soft: {
        bg: 'oklch(0.18 0.020 258)',
        primary: 'oklch(0.60 0.18 250)',
        accent: 'oklch(0.72 0.16 60)',
      },
      light: {
        bg: 'oklch(0.97 0.010 250)',
        primary: 'oklch(0.52 0.18 250)',
        accent: 'oklch(0.70 0.16 60)',
      },
    },
  },
  'obsidian-ops': {
    name: 'Obsidian Ops',
    description: 'Dark ops tactical precision',
    font: 'Space Grotesk',
    colors: {
      dark: {
        bg: 'oklch(0.118 0.006 264)',
        primary: 'oklch(0.72 0.155 210)',
        accent: 'oklch(0.62 0.18 288)',
      },
      soft: {
        bg: 'oklch(0.18 0.008 262)',
        primary: 'oklch(0.68 0.14 210)',
        accent: 'oklch(0.58 0.16 288)',
      },
      light: {
        bg: 'oklch(0.97 0.006 260)',
        primary: 'oklch(0.50 0.14 210)',
        accent: 'oklch(0.55 0.16 288)',
      },
    },
  },
  'calbayog-gov-plus': {
    name: 'Calbayog Gov+',
    description: 'Official government digital identity',
    font: 'Crimson Pro',
    colors: {
      dark: {
        bg: 'oklch(0.12 0.020 25)',
        primary: 'oklch(0.48 0.20 15)',
        accent: 'oklch(0.75 0.14 75)',
      },
      soft: {
        bg: 'oklch(0.20 0.016 25)',
        primary: 'oklch(0.52 0.18 15)',
        accent: 'oklch(0.72 0.12 75)',
      },
      light: {
        bg: 'oklch(0.97 0.012 60)',
        primary: 'oklch(0.42 0.20 15)',
        accent: 'oklch(0.65 0.14 75)',
      },
    },
  },
  'nwssu-academic': {
    name: 'NwSSU Academic',
    description: 'Institutional gravitas, modernised academia',
    font: 'Outfit',
    colors: {
      dark: {
        bg: 'oklch(0.13 0.022 240)',
        primary: 'oklch(0.50 0.14 235)',
        accent: 'oklch(0.72 0.12 155)',
      },
      soft: {
        bg: 'oklch(0.22 0.018 240)',
        primary: 'oklch(0.55 0.12 235)',
        accent: 'oklch(0.68 0.10 155)',
      },
      light: {
        bg: 'oklch(0.98 0.005 240)',
        primary: 'oklch(0.45 0.14 235)',
        accent: 'oklch(0.55 0.12 155)',
      },
    },
  },
  'civic-fusion': {
    name: 'Civic Fusion',
    description: 'Authority + academia synthesised',
    font: 'Inter',
    colors: {
      dark: {
        bg: 'oklch(0.125 0.012 270)',
        primary: 'oklch(0.58 0.14 245)',
        accent: 'oklch(0.75 0.11 78)',
      },
      soft: {
        bg: 'oklch(0.19 0.010 268)',
        primary: 'oklch(0.55 0.12 245)',
        accent: 'oklch(0.72 0.10 78)',
      },
      light: {
        bg: 'oklch(0.97 0.008 265)',
        primary: 'oklch(0.48 0.14 245)',
        accent: 'oklch(0.65 0.12 78)',
      },
    },
  },
  'terracotta-republic': {
    name: 'Terracotta Republic',
    description: 'Warm civic boldness',
    font: 'DM Sans',
    colors: {
      dark: {
        bg: 'oklch(0.13 0.018 45)',
        primary: 'oklch(0.62 0.18 42)',
        accent: 'oklch(0.80 0.16 82)',
      },
      soft: {
        bg: 'oklch(0.20 0.015 45)',
        primary: 'oklch(0.58 0.16 42)',
        accent: 'oklch(0.76 0.14 82)',
      },
      light: {
        bg: 'oklch(0.97 0.012 50)',
        primary: 'oklch(0.52 0.18 42)',
        accent: 'oklch(0.70 0.16 82)',
      },
    },
  },
  'teal-command': {
    name: 'Teal Command',
    description: 'Calm authority, emergency services',
    font: 'Space Grotesk',
    colors: {
      dark: {
        bg: 'oklch(0.12 0.025 185)',
        primary: 'oklch(0.68 0.14 175)',
        accent: 'oklch(0.72 0.14 25)',
      },
      soft: {
        bg: 'oklch(0.19 0.020 185)',
        primary: 'oklch(0.64 0.12 175)',
        accent: 'oklch(0.68 0.12 25)',
      },
      light: {
        bg: 'oklch(0.97 0.010 180)',
        primary: 'oklch(0.52 0.14 175)',
        accent: 'oklch(0.62 0.14 25)',
      },
    },
  },
  'midnight-mono': {
    name: 'Midnight Mono',
    description: 'High-contrast monochrome',
    font: 'IBM Plex Mono',
    colors: {
      dark: {
        bg: 'oklch(0.08 0 0)',
        primary: 'oklch(0.96 0 0)',
        accent: 'oklch(0.75 0.15 200)',
      },
      soft: {
        bg: 'oklch(0.16 0 0)',
        primary: 'oklch(0.90 0 0)',
        accent: 'oklch(0.70 0.12 200)',
      },
      light: {
        bg: 'oklch(0.98 0 0)',
        primary: 'oklch(0.15 0 0)',
        accent: 'oklch(0.55 0.15 200)',
      },
    },
  },
} as const

export const ENABLED_THEMES = Object.keys(THEMES) as ThemeId[]
export type ThemeId = keyof typeof THEMES

// ─── System Preference Detection ─────────────────────────────────────────────
function getSystemPreference(): EffectiveMode {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getEffectiveMode(mode: ThemeMode): EffectiveMode {
  if (mode === 'auto') {
    return getSystemPreference()
  }
  return mode
}

// ─── Theme Application ───────────────────────────────────────────────────────
export function applyTheme(themeId: ThemeId, mode: ThemeMode): void {
  const effectiveMode = getEffectiveMode(mode)
  const dataTheme = effectiveMode === 'dark' ? themeId : `${themeId}-${effectiveMode}`
  document.documentElement.setAttribute('data-theme', dataTheme)
  localStorage.setItem('beacon_theme', themeId)
  localStorage.setItem('beacon_mode', mode)

  // Also save user-specific theme preference
  const userJson = localStorage.getItem('beacon_user')
  if (userJson) {
    try {
      const user = JSON.parse(userJson)
      localStorage.setItem(`beacon_theme_${user.id}`, themeId)
      localStorage.setItem(`beacon_mode_${user.id}`, mode)
    } catch {
      // Ignore parse errors
    }
  }
}

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'civicpulse'

  // Check for user-specific theme preference first
  const userJson = localStorage.getItem('beacon_user')
  if (userJson) {
    try {
      const user = JSON.parse(userJson)
      const userThemeKey = `beacon_theme_${user.id}`
      const userTheme = localStorage.getItem(userThemeKey)
      if (userTheme && userTheme in THEMES) {
        return userTheme as ThemeId
      }
    } catch {
      // Ignore parse errors
    }
  }

  const stored = localStorage.getItem('beacon_theme')
  if (stored && stored in THEMES) {
    return stored as ThemeId
  }
  return 'civicpulse'
}

export function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'

  // Check for user-specific mode preference first
  const userJson = localStorage.getItem('beacon_user')
  if (userJson) {
    try {
      const user = JSON.parse(userJson)
      const userModeKey = `beacon_mode_${user.id}`
      const userMode = localStorage.getItem(userModeKey)
      if (userMode && ['auto', 'dark', 'soft', 'light'].includes(userMode)) {
        return userMode as ThemeMode
      }
    } catch {
      // Ignore parse errors
    }
  }

  const stored = localStorage.getItem('beacon_mode')
  if (stored && ['auto', 'dark', 'soft', 'light'].includes(stored)) {
    return stored as ThemeMode
  }
  return 'auto'
}

// ─── Theme Initialization ────────────────────────────────────────────────────
export function initTheme(): void {
  if (typeof document !== 'undefined') {
    const themeId = getStoredTheme()
    const mode = getStoredMode()
    applyTheme(themeId, mode)
  }
}

// ─── System Preference Change Listener ───────────────────────────────────────
export function initThemeListener(callback: () => void): (() => void) | undefined {
  if (typeof window === 'undefined') return undefined
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => callback()
  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}
