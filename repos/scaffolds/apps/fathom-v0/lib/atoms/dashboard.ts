'use client'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { 
  ChartBlock, 
  MergedBlock, 
  DashboardLayout, 
  MetricCard,
  GridPosition 
} from '@/lib/types/dashboard'

// Default dashboard layout
const defaultBlocks: ChartBlock[] = [
  {
    id: 'incidents-timeline',
    title: 'Incidents Over Time',
    chartType: 'area',
    position: { col: 1, row: 1, colSpan: 2, rowSpan: 1 },
    dataKey: 'incidents-timeline',
    config: { showLegend: true, showGrid: true, animate: true },
  },
  {
    id: 'risk-distribution',
    title: 'Risk Distribution',
    chartType: 'donut',
    position: { col: 3, row: 1, colSpan: 1, rowSpan: 1 },
    dataKey: 'risk-distribution',
    config: { showLegend: true, animate: true },
  },
  {
    id: 'category-breakdown',
    title: 'Incidents by Category',
    chartType: 'bar',
    position: { col: 4, row: 1, colSpan: 1, rowSpan: 1 },
    dataKey: 'category-breakdown',
    config: { showGrid: true, animate: true },
  },
  {
    id: 'response-time',
    title: 'Response Time Gauge',
    chartType: 'gauge-arc',
    position: { col: 1, row: 2, colSpan: 1, rowSpan: 1 },
    dataKey: 'response-time',
    config: { animate: true, thresholds: { warning: 15, critical: 30 } },
  },
  {
    id: 'zone-radar',
    title: 'Zone Risk Analysis',
    chartType: 'radar',
    position: { col: 2, row: 2, colSpan: 1, rowSpan: 1 },
    dataKey: 'zone-radar',
    config: { showLegend: true, animate: true },
  },
  {
    id: 'hourly-heatmap',
    title: 'Hourly Incident Heatmap',
    chartType: 'timeline-heatmap',
    position: { col: 3, row: 2, colSpan: 2, rowSpan: 1 },
    dataKey: 'hourly-heatmap',
    config: { showTooltip: true },
  },
]

const defaultLayout: DashboardLayout = {
  blocks: defaultBlocks,
  mergedBlocks: [],
  gridColumns: 4,
  gridRows: 3,
}

// Dashboard layout atom (persisted)
export const dashboardLayoutAtom = atomWithStorage<DashboardLayout>(
  'civicpulse-dashboard-layout',
  defaultLayout
)

// Blocks atom (derived from layout)
export const blocksAtom = atom(
  (get) => get(dashboardLayoutAtom).blocks,
  (get, set, blocks: ChartBlock[]) => {
    const layout = get(dashboardLayoutAtom)
    set(dashboardLayoutAtom, { ...layout, blocks })
  }
)

// Merged blocks atom (derived from layout)
export const mergedBlocksAtom = atom(
  (get) => get(dashboardLayoutAtom).mergedBlocks,
  (get, set, mergedBlocks: MergedBlock[]) => {
    const layout = get(dashboardLayoutAtom)
    set(dashboardLayoutAtom, { ...layout, mergedBlocks })
  }
)

// Active (dragging) block
export const activeBlockIdAtom = atom<string | null>(null)

// Block being resized
export const resizingBlockIdAtom = atom<string | null>(null)

// Edit mode
export const editModeAtom = atom(false)

// Selected blocks for merge
export const selectedBlockIdsAtom = atom<string[]>([])

// Action: Update block position
export const updateBlockPositionAtom = atom(
  null,
  (get, set, { blockId, position }: { blockId: string; position: GridPosition }) => {
    const blocks = get(blocksAtom)
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, position } : block
    )
    set(blocksAtom, updatedBlocks)
  }
)

// Action: Merge selected blocks
export const mergeBlocksAtom = atom(
  null,
  (get, set) => {
    const selectedIds = get(selectedBlockIdsAtom)
    if (selectedIds.length < 2) return

    const blocks = get(blocksAtom)
    const selectedBlocks = blocks.filter((b) => selectedIds.includes(b.id))
    
    // Calculate merged position (bounding box)
    const minCol = Math.min(...selectedBlocks.map((b) => b.position.col))
    const minRow = Math.min(...selectedBlocks.map((b) => b.position.row))
    const maxCol = Math.max(...selectedBlocks.map((b) => b.position.col + b.position.colSpan - 1))
    const maxRow = Math.max(...selectedBlocks.map((b) => b.position.row + b.position.rowSpan - 1))

    const mergedBlock: MergedBlock = {
      id: `merged-${Date.now()}`,
      blockIds: selectedIds,
      position: {
        col: minCol,
        row: minRow,
        colSpan: maxCol - minCol + 1,
        rowSpan: maxRow - minRow + 1,
      },
      activeTabId: selectedIds[0],
    }

    const mergedBlocks = get(mergedBlocksAtom)
    set(mergedBlocksAtom, [...mergedBlocks, mergedBlock])
    set(selectedBlockIdsAtom, [])
  }
)

// Action: Unmerge block
export const unmergeBlockAtom = atom(
  null,
  (get, set, mergedBlockId: string) => {
    const mergedBlocks = get(mergedBlocksAtom)
    set(mergedBlocksAtom, mergedBlocks.filter((b) => b.id !== mergedBlockId))
  }
)

// Action: Add new block
export const addBlockAtom = atom(
  null,
  (get, set, block: Omit<ChartBlock, 'id'>) => {
    const blocks = get(blocksAtom)
    const newBlock: ChartBlock = {
      ...block,
      id: `block-${Date.now()}`,
    }
    set(blocksAtom, [...blocks, newBlock])
  }
)

// Action: Remove block
export const removeBlockAtom = atom(
  null,
  (get, set, blockId: string) => {
    const blocks = get(blocksAtom)
    set(blocksAtom, blocks.filter((b) => b.id !== blockId))
    
    // Also remove from any merged blocks
    const mergedBlocks = get(mergedBlocksAtom)
    const updatedMerged = mergedBlocks
      .map((mb) => ({
        ...mb,
        blockIds: mb.blockIds.filter((id) => id !== blockId),
      }))
      .filter((mb) => mb.blockIds.length > 1)
    set(mergedBlocksAtom, updatedMerged)
  }
)

// Action: Reset to default layout
export const resetLayoutAtom = atom(
  null,
  (get, set) => {
    set(dashboardLayoutAtom, defaultLayout)
    set(selectedBlockIdsAtom, [])
  }
)

// Metric cards
export const metricCardsAtom = atom<MetricCard[]>([
  {
    id: 'total-incidents',
    label: 'Total Incidents',
    value: 1247,
    previousValue: 1189,
    trend: 'up',
    trendValue: 4.9,
    icon: 'AlertTriangle',
  },
  {
    id: 'active-incidents',
    label: 'Active Incidents',
    value: 23,
    previousValue: 31,
    trend: 'down',
    trendValue: 25.8,
    icon: 'Activity',
    riskLevel: 'high',
  },
  {
    id: 'avg-response-time',
    label: 'Avg Response Time',
    value: '12.4',
    unit: 'min',
    previousValue: '14.2',
    trend: 'down',
    trendValue: 12.7,
    icon: 'Clock',
  },
  {
    id: 'resolution-rate',
    label: 'Resolution Rate',
    value: 94.2,
    unit: '%',
    previousValue: 91.8,
    trend: 'up',
    trendValue: 2.6,
    icon: 'CheckCircle',
  },
  {
    id: 'affected-population',
    label: 'Affected Population',
    value: '15.2K',
    previousValue: '18.7K',
    trend: 'down',
    trendValue: 18.7,
    icon: 'Users',
  },
])
