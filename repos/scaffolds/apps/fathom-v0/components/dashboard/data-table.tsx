'use client'

import { useState, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SlidersHorizontal,
  Download,
  Filter,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RiskLevel } from '@/lib/types/dashboard'

// Incident data type
export interface Incident {
  id: string
  title: string
  category: string
  zone: string
  riskLevel: RiskLevel
  status: 'active' | 'pending' | 'resolved' | 'closed'
  reportedAt: string
  assignedTo: string | null
  responseTime: number | null
}

// Mock data
const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Road flooding at Main St.',
    category: 'Infrastructure',
    zone: 'Zone 1 - Obrero',
    riskLevel: 'high',
    status: 'active',
    reportedAt: '2024-03-15T08:30:00Z',
    assignedTo: 'Juan Dela Cruz',
    responseTime: 12,
  },
  {
    id: 'INC-002',
    title: 'Power outage in commercial area',
    category: 'Infrastructure',
    zone: 'Zone 2 - Central',
    riskLevel: 'critical',
    status: 'active',
    reportedAt: '2024-03-15T09:15:00Z',
    assignedTo: 'Maria Santos',
    responseTime: 8,
  },
  {
    id: 'INC-003',
    title: 'Traffic accident near school',
    category: 'Traffic',
    zone: 'Zone 3 - Rawis',
    riskLevel: 'high',
    status: 'pending',
    reportedAt: '2024-03-15T07:45:00Z',
    assignedTo: null,
    responseTime: null,
  },
  {
    id: 'INC-004',
    title: 'Illegal dumping reported',
    category: 'Environmental',
    zone: 'Zone 4 - Bagacay',
    riskLevel: 'medium',
    status: 'resolved',
    reportedAt: '2024-03-14T14:20:00Z',
    assignedTo: 'Pedro Reyes',
    responseTime: 45,
  },
  {
    id: 'INC-005',
    title: 'Noise complaint from construction',
    category: 'Public Safety',
    zone: 'Zone 2 - Central',
    riskLevel: 'low',
    status: 'closed',
    reportedAt: '2024-03-14T10:00:00Z',
    assignedTo: 'Ana Lopez',
    responseTime: 30,
  },
  {
    id: 'INC-006',
    title: 'Broken street light',
    category: 'Infrastructure',
    zone: 'Zone 5 - Carayman',
    riskLevel: 'low',
    status: 'pending',
    reportedAt: '2024-03-15T06:30:00Z',
    assignedTo: null,
    responseTime: null,
  },
  {
    id: 'INC-007',
    title: 'Water main leak',
    category: 'Infrastructure',
    zone: 'Zone 1 - Obrero',
    riskLevel: 'critical',
    status: 'active',
    reportedAt: '2024-03-15T10:00:00Z',
    assignedTo: 'Juan Dela Cruz',
    responseTime: 5,
  },
  {
    id: 'INC-008',
    title: 'Suspicious activity reported',
    category: 'Public Safety',
    zone: 'Zone 6 - Dagum',
    riskLevel: 'medium',
    status: 'resolved',
    reportedAt: '2024-03-14T22:15:00Z',
    assignedTo: 'Carlos Garcia',
    responseTime: 18,
  },
  {
    id: 'INC-009',
    title: 'Fire alarm - false positive',
    category: 'Public Safety',
    zone: 'Zone 2 - Central',
    riskLevel: 'minimal',
    status: 'closed',
    reportedAt: '2024-03-14T16:45:00Z',
    assignedTo: 'Maria Santos',
    responseTime: 7,
  },
  {
    id: 'INC-010',
    title: 'Pothole on highway',
    category: 'Traffic',
    zone: 'Zone 3 - Rawis',
    riskLevel: 'medium',
    status: 'pending',
    reportedAt: '2024-03-15T11:30:00Z',
    assignedTo: null,
    responseTime: null,
  },
]

const riskLevelColors: Record<RiskLevel, string> = {
  critical: 'bg-risk-critical text-white',
  high: 'bg-risk-high text-white',
  medium: 'bg-risk-medium text-foreground',
  low: 'bg-risk-low text-foreground',
  minimal: 'bg-risk-minimal text-foreground',
}

const statusColors: Record<string, string> = {
  active: 'bg-status-active text-white',
  pending: 'bg-status-pending text-foreground',
  resolved: 'bg-status-resolved text-white',
  closed: 'bg-muted text-muted-foreground',
}

const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('category')}</Badge>
    ),
  },
  {
    accessorKey: 'zone',
    header: 'Zone',
  },
  {
    accessorKey: 'riskLevel',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Risk
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const risk = row.getValue('riskLevel') as RiskLevel
      return (
        <Badge className={cn('capitalize', riskLevelColors[risk])}>
          {risk}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge className={cn('capitalize', statusColors[status])}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'reportedAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Reported
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('reportedAt'))
      return (
        <span className="text-sm">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      const assigned = row.getValue('assignedTo') as string | null
      return assigned ? (
        <span>{assigned}</span>
      ) : (
        <span className="text-muted-foreground">Unassigned</span>
      )
    },
  },
  {
    accessorKey: 'responseTime',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Response
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const time = row.getValue('responseTime') as number | null
      return time !== null ? (
        <span className="font-mono text-sm">{time} min</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
]

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredData = useMemo(() => {
    let data = [...mockIncidents]
    
    if (riskFilter !== 'all') {
      data = data.filter((d) => d.riskLevel === riskFilter)
    }
    
    if (statusFilter !== 'all') {
      data = data.filter((d) => d.status === statusFilter)
    }
    
    return data
  }, [riskFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const clearFilters = () => {
    setGlobalFilter('')
    setRiskFilter('all')
    setStatusFilter('all')
    setColumnFilters([])
  }

  const hasActiveFilters = globalFilter || riskFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((col) => col.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No incidents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
