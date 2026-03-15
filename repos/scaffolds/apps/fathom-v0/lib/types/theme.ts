// CivicPulse Theme System Types
// 6 predefined themes with comprehensive color tokens

export type ThemeName = 
  | 'midnight-command'
  | 'slate-ops'
  | 'forest-watch'
  | 'amber-alert'
  | 'arctic-intel'
  | 'crimson-response'

export interface ThemeColors {
  // Base colors
  background: string
  foreground: string
  
  // Card colors
  card: string
  cardForeground: string
  
  // Popover colors
  popover: string
  popoverForeground: string
  
  // Primary brand color
  primary: string
  primaryForeground: string
  
  // Secondary color
  secondary: string
  secondaryForeground: string
  
  // Muted/subtle colors
  muted: string
  mutedForeground: string
  
  // Accent color
  accent: string
  accentForeground: string
  
  // Destructive/error colors
  destructive: string
  destructiveForeground: string
  
  // UI element colors
  border: string
  input: string
  ring: string
  
  // Chart colors (1-5)
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  
  // Sidebar colors
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
  
  // Risk level colors (specific to CivicPulse)
  riskCritical: string
  riskHigh: string
  riskMedium: string
  riskLow: string
  riskMinimal: string
  
  // Status colors
  statusActive: string
  statusInactive: string
  statusPending: string
  statusResolved: string
}

export interface Theme {
  name: ThemeName
  label: string
  description: string
  colors: ThemeColors
}

// Theme definitions
export const themes: Record<ThemeName, Theme> = {
  'midnight-command': {
    name: 'midnight-command',
    label: 'Midnight Command',
    description: 'Deep blue tactical theme for night operations',
    colors: {
      background: 'oklch(0.13 0.02 250)',
      foreground: 'oklch(0.95 0.01 250)',
      card: 'oklch(0.16 0.02 250)',
      cardForeground: 'oklch(0.95 0.01 250)',
      popover: 'oklch(0.14 0.02 250)',
      popoverForeground: 'oklch(0.95 0.01 250)',
      primary: 'oklch(0.65 0.18 250)',
      primaryForeground: 'oklch(0.98 0.01 250)',
      secondary: 'oklch(0.25 0.03 250)',
      secondaryForeground: 'oklch(0.95 0.01 250)',
      muted: 'oklch(0.22 0.02 250)',
      mutedForeground: 'oklch(0.65 0.02 250)',
      accent: 'oklch(0.55 0.20 200)',
      accentForeground: 'oklch(0.98 0.01 250)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.01 250)',
      border: 'oklch(0.28 0.03 250)',
      input: 'oklch(0.22 0.02 250)',
      ring: 'oklch(0.65 0.18 250)',
      chart1: 'oklch(0.65 0.18 250)',
      chart2: 'oklch(0.70 0.15 180)',
      chart3: 'oklch(0.75 0.12 140)',
      chart4: 'oklch(0.65 0.20 320)',
      chart5: 'oklch(0.70 0.18 60)',
      sidebar: 'oklch(0.11 0.02 250)',
      sidebarForeground: 'oklch(0.95 0.01 250)',
      sidebarPrimary: 'oklch(0.65 0.18 250)',
      sidebarPrimaryForeground: 'oklch(0.98 0.01 250)',
      sidebarAccent: 'oklch(0.20 0.03 250)',
      sidebarAccentForeground: 'oklch(0.95 0.01 250)',
      sidebarBorder: 'oklch(0.25 0.03 250)',
      sidebarRing: 'oklch(0.65 0.18 250)',
      riskCritical: 'oklch(0.55 0.25 25)',
      riskHigh: 'oklch(0.65 0.22 40)',
      riskMedium: 'oklch(0.75 0.18 85)',
      riskLow: 'oklch(0.70 0.15 180)',
      riskMinimal: 'oklch(0.65 0.12 145)',
      statusActive: 'oklch(0.70 0.18 145)',
      statusInactive: 'oklch(0.50 0.02 250)',
      statusPending: 'oklch(0.75 0.18 85)',
      statusResolved: 'oklch(0.65 0.15 180)',
    },
  },
  'slate-ops': {
    name: 'slate-ops',
    label: 'Slate Ops',
    description: 'Neutral gray tactical theme',
    colors: {
      background: 'oklch(0.14 0.005 260)',
      foreground: 'oklch(0.95 0.005 260)',
      card: 'oklch(0.17 0.005 260)',
      cardForeground: 'oklch(0.95 0.005 260)',
      popover: 'oklch(0.15 0.005 260)',
      popoverForeground: 'oklch(0.95 0.005 260)',
      primary: 'oklch(0.70 0.005 260)',
      primaryForeground: 'oklch(0.12 0.005 260)',
      secondary: 'oklch(0.26 0.005 260)',
      secondaryForeground: 'oklch(0.95 0.005 260)',
      muted: 'oklch(0.23 0.005 260)',
      mutedForeground: 'oklch(0.60 0.005 260)',
      accent: 'oklch(0.55 0.12 200)',
      accentForeground: 'oklch(0.98 0.005 260)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.005 260)',
      border: 'oklch(0.30 0.005 260)',
      input: 'oklch(0.23 0.005 260)',
      ring: 'oklch(0.70 0.005 260)',
      chart1: 'oklch(0.60 0.14 200)',
      chart2: 'oklch(0.65 0.12 160)',
      chart3: 'oklch(0.70 0.10 120)',
      chart4: 'oklch(0.60 0.15 280)',
      chart5: 'oklch(0.65 0.14 40)',
      sidebar: 'oklch(0.12 0.005 260)',
      sidebarForeground: 'oklch(0.95 0.005 260)',
      sidebarPrimary: 'oklch(0.70 0.005 260)',
      sidebarPrimaryForeground: 'oklch(0.12 0.005 260)',
      sidebarAccent: 'oklch(0.21 0.005 260)',
      sidebarAccentForeground: 'oklch(0.95 0.005 260)',
      sidebarBorder: 'oklch(0.26 0.005 260)',
      sidebarRing: 'oklch(0.70 0.005 260)',
      riskCritical: 'oklch(0.55 0.25 25)',
      riskHigh: 'oklch(0.65 0.22 40)',
      riskMedium: 'oklch(0.75 0.18 85)',
      riskLow: 'oklch(0.70 0.15 180)',
      riskMinimal: 'oklch(0.65 0.12 145)',
      statusActive: 'oklch(0.70 0.18 145)',
      statusInactive: 'oklch(0.50 0.005 260)',
      statusPending: 'oklch(0.75 0.18 85)',
      statusResolved: 'oklch(0.65 0.15 180)',
    },
  },
  'forest-watch': {
    name: 'forest-watch',
    label: 'Forest Watch',
    description: 'Natural green environmental monitoring theme',
    colors: {
      background: 'oklch(0.13 0.02 150)',
      foreground: 'oklch(0.95 0.02 150)',
      card: 'oklch(0.16 0.025 150)',
      cardForeground: 'oklch(0.95 0.02 150)',
      popover: 'oklch(0.14 0.02 150)',
      popoverForeground: 'oklch(0.95 0.02 150)',
      primary: 'oklch(0.65 0.18 145)',
      primaryForeground: 'oklch(0.98 0.02 150)',
      secondary: 'oklch(0.25 0.03 150)',
      secondaryForeground: 'oklch(0.95 0.02 150)',
      muted: 'oklch(0.22 0.025 150)',
      mutedForeground: 'oklch(0.60 0.03 150)',
      accent: 'oklch(0.55 0.15 120)',
      accentForeground: 'oklch(0.98 0.02 150)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.02 150)',
      border: 'oklch(0.28 0.03 150)',
      input: 'oklch(0.22 0.025 150)',
      ring: 'oklch(0.65 0.18 145)',
      chart1: 'oklch(0.65 0.18 145)',
      chart2: 'oklch(0.60 0.15 180)',
      chart3: 'oklch(0.70 0.12 100)',
      chart4: 'oklch(0.55 0.10 200)',
      chart5: 'oklch(0.75 0.15 80)',
      sidebar: 'oklch(0.11 0.02 150)',
      sidebarForeground: 'oklch(0.95 0.02 150)',
      sidebarPrimary: 'oklch(0.65 0.18 145)',
      sidebarPrimaryForeground: 'oklch(0.98 0.02 150)',
      sidebarAccent: 'oklch(0.20 0.03 150)',
      sidebarAccentForeground: 'oklch(0.95 0.02 150)',
      sidebarBorder: 'oklch(0.25 0.03 150)',
      sidebarRing: 'oklch(0.65 0.18 145)',
      riskCritical: 'oklch(0.55 0.25 25)',
      riskHigh: 'oklch(0.65 0.22 40)',
      riskMedium: 'oklch(0.75 0.18 85)',
      riskLow: 'oklch(0.70 0.15 180)',
      riskMinimal: 'oklch(0.65 0.18 145)',
      statusActive: 'oklch(0.70 0.18 145)',
      statusInactive: 'oklch(0.50 0.02 150)',
      statusPending: 'oklch(0.75 0.18 85)',
      statusResolved: 'oklch(0.65 0.15 180)',
    },
  },
  'amber-alert': {
    name: 'amber-alert',
    label: 'Amber Alert',
    description: 'Warning-focused amber/orange theme',
    colors: {
      background: 'oklch(0.14 0.02 50)',
      foreground: 'oklch(0.95 0.02 50)',
      card: 'oklch(0.17 0.025 50)',
      cardForeground: 'oklch(0.95 0.02 50)',
      popover: 'oklch(0.15 0.02 50)',
      popoverForeground: 'oklch(0.95 0.02 50)',
      primary: 'oklch(0.75 0.18 75)',
      primaryForeground: 'oklch(0.15 0.02 50)',
      secondary: 'oklch(0.26 0.025 50)',
      secondaryForeground: 'oklch(0.95 0.02 50)',
      muted: 'oklch(0.23 0.02 50)',
      mutedForeground: 'oklch(0.60 0.03 50)',
      accent: 'oklch(0.70 0.20 60)',
      accentForeground: 'oklch(0.15 0.02 50)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.02 50)',
      border: 'oklch(0.30 0.03 50)',
      input: 'oklch(0.23 0.02 50)',
      ring: 'oklch(0.75 0.18 75)',
      chart1: 'oklch(0.75 0.18 75)',
      chart2: 'oklch(0.70 0.20 60)',
      chart3: 'oklch(0.65 0.15 90)',
      chart4: 'oklch(0.60 0.12 40)',
      chart5: 'oklch(0.80 0.15 100)',
      sidebar: 'oklch(0.12 0.02 50)',
      sidebarForeground: 'oklch(0.95 0.02 50)',
      sidebarPrimary: 'oklch(0.75 0.18 75)',
      sidebarPrimaryForeground: 'oklch(0.15 0.02 50)',
      sidebarAccent: 'oklch(0.21 0.025 50)',
      sidebarAccentForeground: 'oklch(0.95 0.02 50)',
      sidebarBorder: 'oklch(0.26 0.03 50)',
      sidebarRing: 'oklch(0.75 0.18 75)',
      riskCritical: 'oklch(0.55 0.25 25)',
      riskHigh: 'oklch(0.70 0.22 50)',
      riskMedium: 'oklch(0.75 0.18 75)',
      riskLow: 'oklch(0.70 0.12 100)',
      riskMinimal: 'oklch(0.65 0.10 120)',
      statusActive: 'oklch(0.70 0.18 145)',
      statusInactive: 'oklch(0.50 0.02 50)',
      statusPending: 'oklch(0.75 0.18 75)',
      statusResolved: 'oklch(0.65 0.15 180)',
    },
  },
  'arctic-intel': {
    name: 'arctic-intel',
    label: 'Arctic Intel',
    description: 'Cool cyan/ice intelligence theme',
    colors: {
      background: 'oklch(0.13 0.015 210)',
      foreground: 'oklch(0.95 0.01 210)',
      card: 'oklch(0.16 0.02 210)',
      cardForeground: 'oklch(0.95 0.01 210)',
      popover: 'oklch(0.14 0.015 210)',
      popoverForeground: 'oklch(0.95 0.01 210)',
      primary: 'oklch(0.70 0.15 200)',
      primaryForeground: 'oklch(0.12 0.015 210)',
      secondary: 'oklch(0.25 0.02 210)',
      secondaryForeground: 'oklch(0.95 0.01 210)',
      muted: 'oklch(0.22 0.015 210)',
      mutedForeground: 'oklch(0.60 0.02 210)',
      accent: 'oklch(0.65 0.18 220)',
      accentForeground: 'oklch(0.98 0.01 210)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.01 210)',
      border: 'oklch(0.28 0.02 210)',
      input: 'oklch(0.22 0.015 210)',
      ring: 'oklch(0.70 0.15 200)',
      chart1: 'oklch(0.70 0.15 200)',
      chart2: 'oklch(0.65 0.18 220)',
      chart3: 'oklch(0.60 0.12 240)',
      chart4: 'oklch(0.75 0.10 180)',
      chart5: 'oklch(0.55 0.15 260)',
      sidebar: 'oklch(0.11 0.015 210)',
      sidebarForeground: 'oklch(0.95 0.01 210)',
      sidebarPrimary: 'oklch(0.70 0.15 200)',
      sidebarPrimaryForeground: 'oklch(0.12 0.015 210)',
      sidebarAccent: 'oklch(0.20 0.02 210)',
      sidebarAccentForeground: 'oklch(0.95 0.01 210)',
      sidebarBorder: 'oklch(0.25 0.02 210)',
      sidebarRing: 'oklch(0.70 0.15 200)',
      riskCritical: 'oklch(0.55 0.25 25)',
      riskHigh: 'oklch(0.65 0.22 40)',
      riskMedium: 'oklch(0.75 0.18 85)',
      riskLow: 'oklch(0.70 0.15 200)',
      riskMinimal: 'oklch(0.65 0.18 220)',
      statusActive: 'oklch(0.70 0.18 145)',
      statusInactive: 'oklch(0.50 0.015 210)',
      statusPending: 'oklch(0.75 0.18 85)',
      statusResolved: 'oklch(0.70 0.15 200)',
    },
  },
  'crimson-response': {
    name: 'crimson-response',
    label: 'Crimson Response',
    description: 'Emergency response red theme',
    colors: {
      background: 'oklch(0.14 0.02 15)',
      foreground: 'oklch(0.95 0.01 15)',
      card: 'oklch(0.17 0.025 15)',
      cardForeground: 'oklch(0.95 0.01 15)',
      popover: 'oklch(0.15 0.02 15)',
      popoverForeground: 'oklch(0.95 0.01 15)',
      primary: 'oklch(0.60 0.22 20)',
      primaryForeground: 'oklch(0.98 0.01 15)',
      secondary: 'oklch(0.26 0.025 15)',
      secondaryForeground: 'oklch(0.95 0.01 15)',
      muted: 'oklch(0.23 0.02 15)',
      mutedForeground: 'oklch(0.60 0.02 15)',
      accent: 'oklch(0.55 0.18 30)',
      accentForeground: 'oklch(0.98 0.01 15)',
      destructive: 'oklch(0.55 0.25 25)',
      destructiveForeground: 'oklch(0.98 0.01 15)',
      border: 'oklch(0.30 0.025 15)',
      input: 'oklch(0.23 0.02 15)',
      ring: 'oklch(0.60 0.22 20)',
      chart1: 'oklch(0.60 0.22 20)',
      chart2: 'oklch(0.55 0.18 40)',
      chart3: 'oklch(0.65 0.15 350)',
      chart4: 'oklch(0.50 0.20 10)',
      chart5: 'oklch(0.70 0.12 60)',
      sidebar: 'oklch(0.12 0.02 15)',
      sidebarForeground: 'oklch(0.95 0.01 15)',
      sidebarPrimary: 'oklch(0.60 0.22 20)',
      sidebarPrimaryForeground: 'oklch(0.98 0.01 15)',
      sidebarAccent: 'oklch(0.21 0.025 15)',
      sidebarAccentForeground: 'oklch(0.95 0.01 15)',
      sidebarBorder: 'oklch(0.26 0.025 15)',
      sidebarRing: 'oklch(0.60 0.22 20)',
      riskCritical: 'oklch(0.55 0.25 20)',
      riskHigh: 'oklch(0.60 0.22 35)',
      riskMedium: 'oklch(0.75 0.18 85)',
      riskLow: 'oklch(0.70 0.15 180)',
      riskMinimal: 'oklch(0.65 0.12 145)',
      statusActive: 'oklch(0.70 0.18 145)',
      statusInactive: 'oklch(0.50 0.02 15)',
      statusPending: 'oklch(0.75 0.18 85)',
      statusResolved: 'oklch(0.65 0.15 180)',
    },
  },
}

export const defaultTheme: ThemeName = 'midnight-command'
