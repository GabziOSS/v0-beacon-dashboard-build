'use client'

import { JotaiProvider } from './jotai-provider'
import { CivicPulseThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <CivicPulseThemeProvider>
        {children}
        <Toaster position="top-right" />
      </CivicPulseThemeProvider>
    </JotaiProvider>
  )
}
