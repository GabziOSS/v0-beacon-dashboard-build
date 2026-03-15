// CivicPulse Dashboard Types
// Grid layout, chart blocks, and data structures

export type ChartType = 
  | 'line'
  | 'area'
  | 'bar'
  | 'stacked-bar'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'scatter'
  | 'treemap'
  | 'funnel'
  | 'gauge-arc'
  | 'gauge-radial'
  | 'gauge-linear'
  | 'wind-rose'
  | 'compass'
  | 'timeline-heatmap'
  | 'sankey'
  | 'bullet'

export type ViewMode = 'dashboard' | 'table' | 'map'

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal'

export type IncidentStatus = 'active' | 'investigating' | 'contained' | 'resolved' | 'monitoring'

export type IncidentCategory = 
  | 'natural-disaster'
  | 'infrastructure'
  | 'public-safety'
  | 'health'
  | 'traffic'
  | 'environmental'
  | 'civil-unrest'
  | 'utility'

// Grid position for chart blocks
export interface GridPosition {
  col: number    // Column start (1-based)
  row: number    // Row start (1-based)
  colSpan: number // Number of columns to span
  rowSpan: number // Number of rows to span
}

// Individual chart block
export interface ChartBlock {
  id: string
  title: string
  chartType: ChartType
  position: GridPosition
  dataKey: string // Key to look up data
  config?: ChartConfig
  isMinimized?: boolean
}

// Chart configuration options
export interface ChartConfig {
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  animate?: boolean
  colors?: string[] // Override theme chart colors
  xAxisLabel?: string
  yAxisLabel?: string
  unit?: string
  thresholds?: {
    warning?: number
    critical?: number
  }
}

// Merged block (multiple charts in tabs)
export interface MergedBlock {
  id: string
  blockIds: string[]
  position: GridPosition
  activeTabId: string
}

// Dashboard layout state
export interface DashboardLayout {
  blocks: ChartBlock[]
  mergedBlocks: MergedBlock[]
  gridColumns: number
  gridRows: number
}

// Metric card data
export interface MetricCard {
  id: string
  label: string
  value: number | string
  previousValue?: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  icon?: string
  riskLevel?: RiskLevel
}

// Incident data structure
export interface Incident {
  id: string
  title: string
  description: string
  category: IncidentCategory
  status: IncidentStatus
  riskLevel: RiskLevel
  location: {
    lat: number
    lng: number
    address?: string
    barangay?: string
    zone?: string
  }
  reportedAt: string
  updatedAt: string
  assignedTo?: string[]
  affectedPopulation?: number
  tags?: string[]
}

// Zone data for map
export interface Zone {
  id: string
  name: string
  type: 'barangay' | 'district' | 'sector' | 'custom'
  riskLevel: RiskLevel
  population?: number
  incidents?: number
  geometry: GeoJSONGeometry
}

export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon'
  coordinates: number[][][] | number[][][][]
}

// Data point for charts
export interface DataPoint {
  timestamp?: string
  label?: string
  value: number
  [key: string]: string | number | undefined
}

// Time series data
export interface TimeSeries {
  id: string
  name: string
  data: DataPoint[]
}

// Filter state
export interface FilterState {
  dateRange: {
    start: string
    end: string
  }
  categories: IncidentCategory[]
  riskLevels: RiskLevel[]
  statuses: IncidentStatus[]
  zones: string[]
  searchQuery: string
}

// Sort state
export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

// Pagination state
export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

// User role
export type UserRole = 'admin' | 'analyst' | 'operator' | 'viewer'

// User data
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  department?: string
  lastLogin?: string
  createdAt: string
}

// Auth state
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Notification
export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

// Export format options
export type ExportFormat = 'pdf' | 'csv' | 'xlsx' | 'json' | 'png'
