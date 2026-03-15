'use client'

import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { themeColorsAtom, themeNameAtom } from '@/lib/atoms/theme'
import type { ThemeColors } from '@/lib/types/theme'

function toCssVarName(key: string): string {
  // Convert camelCase to kebab-case
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function applyThemeColors(colors: ThemeColors) {
  const root = document.documentElement
  
  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--${toCssVarName(key)}`
    root.style.setProperty(cssVarName, value)
  })
}

export function CivicPulseThemeProvider({ children }: { children: React.ReactNode }) {
  const colors = useAtomValue(themeColorsAtom)
  const themeName = useAtomValue(themeNameAtom)

  useEffect(() => {
    applyThemeColors(colors)
    // Add theme class to body for any theme-specific CSS
    document.body.setAttribute('data-theme', themeName)
  }, [colors, themeName])

  return <>{children}</>
}
