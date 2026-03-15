'use client'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { ViewMode, FilterState, SortState, PaginationState } from '@/lib/types/dashboard'

// Sidebar state
export const sidebarCollapsedAtom = atomWithStorage('civicpulse-sidebar-collapsed', false)
export const sidebarMobileOpenAtom = atom(false)

// Current view mode
export const viewModeAtom = atomWithStorage<ViewMode>('civicpulse-view-mode', 'dashboard')

// Command palette open state
export const commandPaletteOpenAtom = atom(false)

// Settings panel open state
export const settingsPanelOpenAtom = atom(false)

// Notification panel open state
export const notificationPanelOpenAtom = atom(false)

// Filter state
const defaultFilterState: FilterState = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  categories: [],
  riskLevels: [],
  statuses: [],
  zones: [],
  searchQuery: '',
}

export const filterStateAtom = atom<FilterState>(defaultFilterState)

// Sort state
export const sortStateAtom = atom<SortState>({
  field: 'reportedAt',
  direction: 'desc',
})

// Pagination state
export const paginationStateAtom = atom<PaginationState>({
  page: 1,
  pageSize: 25,
  total: 0,
})

// Reset filters action
export const resetFiltersAtom = atom(
  null,
  (get, set) => {
    set(filterStateAtom, defaultFilterState)
    set(sortStateAtom, { field: 'reportedAt', direction: 'desc' })
    set(paginationStateAtom, { page: 1, pageSize: 25, total: 0 })
  }
)

// Loading states
export const isLoadingAtom = atom(false)
export const isRefreshingAtom = atom(false)

// Selected items (for bulk actions)
export const selectedItemsAtom = atom<string[]>([])

// Modal states
export const activeModalAtom = atom<string | null>(null)
export const modalDataAtom = atom<unknown>(null)

// Map state
export const mapCenterAtom = atomWithStorage('civicpulse-map-center', {
  lat: 12.0685,
  lng: 124.5908,
})
export const mapZoomAtom = atomWithStorage('civicpulse-map-zoom', 12)
export const mapStyleAtom = atomWithStorage('civicpulse-map-style', 'dark')

// Selected zone/incident on map
export const selectedZoneIdAtom = atom<string | null>(null)
export const selectedIncidentIdAtom = atom<string | null>(null)

// Fullscreen mode
export const isFullscreenAtom = atom(false)
