'use client'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { type ThemeName, themes, defaultTheme } from '@/lib/types/theme'

// Persisted theme name
export const themeNameAtom = atomWithStorage<ThemeName>('civicpulse-theme', defaultTheme)

// Derived atom for full theme object
export const themeAtom = atom((get) => {
  const themeName = get(themeNameAtom)
  return themes[themeName]
})

// Derived atom for theme colors
export const themeColorsAtom = atom((get) => {
  const theme = get(themeAtom)
  return theme.colors
})

// Available themes list
export const availableThemesAtom = atom(() => Object.values(themes))

// Action atom to change theme
export const setThemeAtom = atom(
  null,
  (get, set, themeName: ThemeName) => {
    set(themeNameAtom, themeName)
  }
)
