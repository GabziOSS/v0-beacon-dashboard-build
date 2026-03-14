# Beacon — opencode Prompt 3: Data Table

Prerequisites:
- opencode Prompt 1 complete: `lib/mock-data/` exports INCIDENTS, ZONES
- opencode Prompt 2 complete: chart wiring and data hooks in place
- v0 Sessions 1–3 complete: IncidentTable shell, columns, toolbar,
  filters, pagination, RowDetailPanel, StatusTimeline all exist as markup

Read the full codebase before starting. Understand what the
table components currently render and where data is hardcoded.

---

## Goal

Wire TanStack Table into the incident table shell. Replace all
hardcoded rows with real data from `lib/mock-data/`. Implement
all sorting, filtering, search, pagination, and export logic.

This prompt is logic and wiring only — do not change visual markup
unless a specific behaviour requires a structural adjustment.

---

## Part 1 — Install

```bash
npm install @tanstack/react-table date-fns
```

Verify current @tanstack/react-table API via context7 before
writing any table code. The v8 API differs significantly from v7.

---

## Part 2 — Column Definitions

File: `components/data-table/incident-columns.tsx`

```typescript
import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"
import type { Incident } from "@/lib/mock-data/types"

const col = createColumnHelper<Incident>()

export const columns: ColumnDef<Incident, unknown>[] = [
  // Expand toggle — display column, no data accessor
  // Chevron icon, rotates 90° when row is expanded
  // col.display({ id: "expand", ... })

  // ID — accessorKey: "id"
  // Truncated to 8 chars, font-mono, text-muted-foreground
  // Full ID on hover via title attr

  // Type — accessorKey: "type"
  // IncidentTypeBadge component
  // Filterable via column filter

  // Severity — accessorKey: "severity"
  // SeverityBadge (uses RiskBadge pattern)
  // Filterable

  // Zone — accessorKey: "zoneName"
  // Plain text, sortable

  // Barangay — accessorKey: "barangay"
  // Plain text, hidden by default on mobile

  // Status — accessorKey: "status"
  // StatusBadge with animated dot for open/in_progress

  // Timestamp — accessorKey: "timestamp"
  // Formatted: "MMM d, yyyy HH:mm"
  // Sortable — sort on raw ISO string, display formatted

  // Responders — accessorKey: "respondersAssigned"
  // tabular-nums, right-aligned
  // Hidden by default on mobile

  // Duration — accessorKey: "resolutionMinutes"
  // Format: "42m" or "1h 22m", em dash if undefined
  // Custom cell renderer
]
```

The column `filterFn` for type and severity should use
`"arrIncludes"` from TanStack Table's built-in filter functions
so multi-select filters work correctly.

---

## Part 3 — Table Instance

File: `components/data-table/incident-table.tsx`

```typescript
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ExpandedState,
} from "@tanstack/react-table"
import { useState, useMemo, useCallback, useTransition } from "react"
import { INCIDENTS } from "@/lib/mock-data"
```

### State

```typescript
const [sorting, setSorting] = useState<SortingState>([
  { id: "timestamp", desc: true }  // default: most recent first
])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [globalFilter, setGlobalFilter] = useState("")
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
  id: false,          // hidden by default
  barangay: false,    // hidden by default
  respondersAssigned: false,  // hidden by default
})
const [expanded, setExpanded] = useState<ExpandedState>({})
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 25,
})
const [timeRange, setTimeRange] =
  useState<"24h" | "7d" | "30d" | "90d" | "1y">("30d")
const [isPending, startTransition] = useTransition()
```

### Data filtering

```typescript
const data = useMemo(() => {
  const days = { "24h": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365 }
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days[timeRange])
  return INCIDENTS.filter(
    (i) => new Date(i.timestamp) >= cutoff
  )
}, [timeRange])
```

Time range changes use `useTransition` — they're non-urgent.

### Table config

```typescript
const table = useReactTable({
  data,
  columns,
  state: { sorting, columnFilters, globalFilter,
           columnVisibility, expanded, pagination },
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onGlobalFilterChange: setGlobalFilter,
  onColumnVisibilityChange: setColumnVisibility,
  onExpandedChange: setExpanded,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  globalFilterFn: "includesString",
  manualPagination: false,
})
```

### Global search debounce

```typescript
const handleSearch = useCallback((value: string) => {
  // Debounce 300ms
  clearTimeout(searchTimer.current)
  searchTimer.current = setTimeout(() => {
    setGlobalFilter(value)
  }, 300)
}, [])
```

Use `useRef<ReturnType<typeof setTimeout>>` for the timer.

---

## Part 4 — TableToolbar Wiring

File: `components/data-table/table-toolbar.tsx`

Wire all filter controls to the table instance:

### Type filter
```typescript
// Get current filter value
const typeFilter = table.getColumn("type")?.getFilterValue() as string[] ?? []

// On checkbox toggle:
const next = typeFilter.includes(value)
  ? typeFilter.filter(v => v !== value)
  : [...typeFilter, value]
table.getColumn("type")?.setFilterValue(next.length ? next : undefined)
```

Same pattern for severity and status filters.

### Active filter count badge
```typescript
const activeFilterCount = columnFilters.length
// Show badge on "Filters" button when activeFilterCount > 0
```

### Column visibility popover
```typescript
// List all columns except "expand"
// Toggle switch per column calls:
column.toggleVisibility()
```

### Export functions

```typescript
function exportCSV(): void {
  const rows = table.getFilteredRowModel().rows
  const visibleCols = table
    .getVisibleLeafColumns()
    .filter(c => c.id !== "expand")

  const headers = visibleCols.map(c =>
    typeof c.columnDef.header === "string" ? c.columnDef.header : c.id
  )
  const body = rows.map(row =>
    visibleCols.map(col =>
      JSON.stringify(row.getValue(col.id) ?? "")
    ).join(",")
  )
  const csv = [headers.join(","), ...body].join("\n")
  triggerDownload(csv, "incidents.csv", "text/csv")
}

function exportJSON(): void {
  const rows = table.getFilteredRowModel().rows.map(r => r.original)
  triggerDownload(
    JSON.stringify(rows, null, 2),
    "incidents.json",
    "application/json"
  )
}

function triggerDownload(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  })
  a.click()
  URL.revokeObjectURL(url)
}
```

---

## Part 5 — TableFilters Wiring

File: `components/data-table/table-filters.tsx`

### Date range filter

Add a custom filter function to the table for timestamp range:

```typescript
// In table config:
filterFns: {
  dateRange: (row, columnId, value: [string, string]) => {
    const [from, to] = value
    const ts = row.getValue<string>(columnId)
    if (from && new Date(ts) < new Date(from)) return false
    if (to && new Date(ts) > new Date(to + "T23:59:59")) return false
    return true
  },
}

// Column def for timestamp uses filterFn: "dateRange"
```

Date input changes:
```typescript
table.getColumn("timestamp")?.setFilterValue([fromDate, toDate])
```

Quick preset buttons set both from and to:
```typescript
// "This month": first day of current month to today
const now = new Date()
const from = new Date(now.getFullYear(), now.getMonth(), 1)
  .toISOString().slice(0, 10)
const to = now.toISOString().slice(0, 10)
table.getColumn("timestamp")?.setFilterValue([from, to])
```

### Zone filter

Zone is not a direct column — incidents have `zoneId` but the
column shows `zoneName`. Add a custom filter on `zoneId`:

```typescript
// Additional hidden column with accessorKey: "zoneId"
// filterFn: "arrIncludes"
// Hidden from view (columnVisibility: { zoneId: false })
// Zone filter popover sets filter value on this column
```

### Responders range filter

```typescript
filterFns: {
  numberRange: (row, columnId, value: [number | "", number | ""]) => {
    const [min, max] = value
    const v = row.getValue<number>(columnId)
    if (min !== "" && v < min) return false
    if (max !== "" && v > max) return false
    return true
  },
}
```

### Active filter pills

Show a pill for each active filter. Each pill has label + value + × button.
× button clears that specific filter:

```typescript
// For each entry in columnFilters:
// { id, value } → display as pill
// Remove: table.getColumn(id)?.setFilterValue(undefined)
// Clear all: table.resetColumnFilters()
```

---

## Part 6 — RowDetailPanel Wiring

File: `components/data-table/row-detail-panel.tsx`

The panel already exists as markup. Wire the data:

```typescript
interface RowDetailPanelProps {
  incident: Incident
}
```

### Coordinate display
Format `incident.coordinates` as `[lat]° N, [lng]° E`:
```typescript
const [lng, lat] = incident.coordinates
const display = `${Math.abs(lat).toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° E`
```

### Timestamps
```typescript
const reported = new Date(incident.timestamp)
const dispatched = new Date(reported.getTime() + 6 * 60 * 1000)
const resolved = incident.resolutionMinutes
  ? new Date(reported.getTime() + incident.resolutionMinutes * 60 * 1000)
  : null
```

Format each with `format(date, "MMM d, yyyy HH:mm")` from date-fns.
Elapsed time labels: `+${Math.round(elapsed / 60)} min` format.

### Optimistic "Mark Resolved"

```typescript
const [localStatus, setLocalStatus] =
  useOptimistic(incident.status, (_, newStatus: IncidentStatus) => newStatus)

async function handleMarkResolved() {
  startTransition(async () => {
    setLocalStatus("resolved")
    // TODO: wire to mutation when API exists
    await new Promise(r => setTimeout(r, 400))  // simulate network
  })
}
```

### "Open in Map" link

```typescript
import { Link } from "@/lib/routing"   // ← framework-agnostic alias

<Link href={`/map?zone=${incident.zoneId}`}>
  Open in Map →
</Link>
```

---

## Part 7 — StatusTimeline Wiring

File: `components/data-table/status-timeline.tsx`

```typescript
interface Step {
  label: string
  timestamp: Date | null
  elapsed: string | null
  active: boolean
  complete: boolean
}

function buildSteps(incident: Incident): Step[] {
  const reported = new Date(incident.timestamp)
  const dispatched = new Date(reported.getTime() + 6 * 60 * 1000)
  const resolved = incident.resolutionMinutes
    ? new Date(reported.getTime() + incident.resolutionMinutes * 60 * 1000)
    : null

  return [
    {
      label: "Reported",
      timestamp: reported,
      elapsed: null,
      active: true,
      complete: true,
    },
    {
      label: "Dispatched",
      timestamp: dispatched,
      elapsed: "+6 min",
      active: true,
      complete: incident.status !== "open",
    },
    {
      label: incident.status === "resolved" ? "Resolved" : "Pending",
      timestamp: resolved,
      elapsed: incident.resolutionMinutes
        ? `+${incident.resolutionMinutes} min`
        : null,
      active: incident.status === "resolved",
      complete: incident.status === "resolved",
    },
  ]
}
```

The last active (incomplete) step should have `animate-pulse`
on its dot when status is open or in_progress.

---

## Part 8 — TablePagination Wiring

File: `components/data-table/table-pagination.tsx`

```typescript
// Total count
const total = table.getFilteredRowModel().rows.length
const { pageIndex, pageSize } = table.getState().pagination
const from = pageIndex * pageSize + 1
const to = Math.min((pageIndex + 1) * pageSize, total)

// Buttons
table.getCanPreviousPage()  // disable First/Prev when false
table.getCanNextPage()      // disable Next/Last when false
table.firstPage()
table.previousPage()
table.nextPage()
table.lastPage()
table.setPageSize(value)
table.getPageCount()
```

---

## Acceptance Criteria

- `/dashboard/table` renders with all 500 incidents in the default 30d range
- Column header click sorts; shift-click adds secondary sort
- Default sort: timestamp descending
- Global search filters across id, zoneName, barangay, description
  simultaneously (all fields, case insensitive)
- Type / Severity / Status multi-select filters combine correctly
- Date range filter works with both manual input and quick presets
- Zone filter narrows by zone correctly
- Responders range filter works
- Active filter pills appear and each can be individually cleared
- Row expand shows RowDetailPanel with correct zone, coordinates, timestamps
- StatusTimeline shows correct elapsed times for all three statuses
- "Open in Map" navigates to `/map?zone={zoneId}`
- "Mark Resolved" optimistic update renders immediately
- Export CSV downloads valid file with visible columns only
- Export JSON downloads valid array
- Column visibility toggle shows/hides columns
- Pagination: first/prev/next/last all work, rows-per-page works
- Result count shows correctly after filtering
- Time range changes refilter data
- `useTransition` used for time range changes (no blocking)
- TypeScript strict mode passes with no errors
