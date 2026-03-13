'use client'

import React, { useState, useMemo, useTransition } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Edit,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIncidents } from '@/lib/hooks'
import type { Incident, IncidentType, Severity, IncidentStatus } from '@/lib/types'
import { format } from 'date-fns'

const TYPE_COLORS: Record<IncidentType, string> = {
  Fire: 'bg-chart-5/15 text-chart-5 border-chart-5/20',
  Flood: 'bg-chart-6/15 text-chart-6 border-chart-6/20',
  Crime: 'bg-chart-2/15 text-chart-2 border-chart-2/20',
  Medical: 'bg-chart-1/15 text-chart-1 border-chart-1/20',
  Infrastructure: 'bg-chart-4/15 text-chart-4 border-chart-4/20',
  Typhoon: 'bg-chart-7/15 text-chart-7 border-chart-7/20',
}

const SEVERITY_COLORS: Record<Severity, string> = {
  Critical: 'bg-destructive/10 text-destructive border-destructive/20',
  High: 'bg-warning/10 text-warning border-warning/20',
  Medium: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  Low: 'bg-success/10 text-success border-success/20',
}

const STATUS_COLORS: Record<IncidentStatus, string> = {
  Active: 'bg-destructive/10 text-destructive border-destructive/20',
  Responding: 'bg-warning/10 text-warning border-warning/20',
  Contained: 'bg-chart-6/10 text-chart-6 border-chart-6/20',
  Resolved: 'bg-success/10 text-success border-success/20',
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium font-mono border',
        className
      )}
    >
      {label}
    </span>
  )
}

const COLUMNS = [
  { key: 'expand', label: '', visible: true, toggleable: false },
  { key: 'id', label: 'ID', visible: true, toggleable: false },
  { key: 'type', label: 'Type', visible: true, toggleable: true },
  { key: 'severity', label: 'Severity', visible: true, toggleable: true },
  { key: 'zone', label: 'Zone', visible: true, toggleable: true },
  { key: 'barangay', label: 'Barangay', visible: true, toggleable: true },
  { key: 'status', label: 'Status', visible: true, toggleable: true },
  { key: 'timestamp', label: 'Timestamp', visible: true, toggleable: true },
  { key: 'responders', label: 'Resp.', visible: true, toggleable: true },
  { key: 'duration', label: 'Duration', visible: true, toggleable: true },
]

export function IncidentTable() {
  const { data: incidents } = useIncidents()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'All'>('All')
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'All'>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [colVis, setColVis] = useState<Record<string, boolean>>(
    Object.fromEntries(COLUMNS.map(c => [c.key, c.visible]))
  )
  const [colMenuOpen, setColMenuOpen] = useState(false)
  const [, startTransition] = useTransition()

  const filtered = useMemo(() => {
    return incidents.filter(inc => {
      const matchSearch =
        search === '' ||
        inc.id.toLowerCase().includes(search.toLowerCase()) ||
        inc.zone.toLowerCase().includes(search.toLowerCase()) ||
        inc.barangay.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'All' || inc.type === typeFilter
      const matchSev = severityFilter === 'All' || inc.severity === severityFilter
      const matchSt = statusFilter === 'All' || inc.status === statusFilter
      return matchSearch && matchType && matchSev && matchSt
    })
  }, [incidents, search, typeFilter, severityFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)

  function toggleCol(key: string) {
    setColVis(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const visibleCols = COLUMNS.filter(c => colVis[c.key])

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => {
              startTransition(() => {
                setSearch(e.target.value)
                setPage(0)
              })
            }}
            placeholder="Search ID, zone, barangay..."
            className="w-full pl-8 pr-3 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Type filter */}
        <FilterSelect
          value={typeFilter}
          onChange={v => {
            startTransition(() => {
              setTypeFilter(v as IncidentType | 'All')
              setPage(0)
            })
          }}
          options={['All', 'Fire', 'Flood', 'Crime', 'Medical', 'Infrastructure', 'Typhoon']}
          label="Type"
        />
        <FilterSelect
          value={severityFilter}
          onChange={v => {
            startTransition(() => {
              setSeverityFilter(v as Severity | 'All')
              setPage(0)
            })
          }}
          options={['All', 'Critical', 'High', 'Medium', 'Low']}
          label="Severity"
        />
        <FilterSelect
          value={statusFilter}
          onChange={v => {
            startTransition(() => {
              setStatusFilter(v as IncidentStatus | 'All')
              setPage(0)
            })
          }}
          options={['All', 'Active', 'Responding', 'Contained', 'Resolved']}
          label="Status"
        />

        {/* Column visibility */}
        <div className="relative">
          <button
            onClick={() => setColMenuOpen(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary border border-border rounded-sm text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            Columns
          </button>
          {colMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setColMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-50 w-40 bg-popover border border-border rounded-sm shadow-lg py-1">
                {COLUMNS.filter(c => c.toggleable).map(c => (
                  <button
                    key={c.key}
                    onClick={() => toggleCol(c.key)}
                    className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-secondary flex items-center gap-2"
                  >
                    {colVis[c.key] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary border border-border rounded-sm text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card-nested">
                {visibleCols.map(col => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((inc, ri) => (
                <React.Fragment key={inc.id}>
                  <tr
                    onClick={() => setExpandedId(prev => (prev === inc.id ? null : inc.id))}
                    className={cn(
                      'border-b border-border cursor-pointer transition-colors',
                      ri % 2 === 0 ? 'bg-card' : 'bg-card-nested/50',
                      'hover:bg-secondary/50'
                    )}
                  >
                    {visibleCols.map(col => (
                      <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                        {col.key === 'expand' &&
                          (expandedId === inc.id ? (
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          ))}
                        {col.key === 'id' && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {inc.id}
                          </span>
                        )}
                        {col.key === 'type' && (
                          <Badge label={inc.type} className={TYPE_COLORS[inc.type]} />
                        )}
                        {col.key === 'severity' && (
                          <Badge label={inc.severity} className={SEVERITY_COLORS[inc.severity]} />
                        )}
                        {col.key === 'zone' && (
                          <span className="text-xs text-foreground">{inc.zone}</span>
                        )}
                        {col.key === 'barangay' && (
                          <span className="text-xs text-muted-foreground max-w-[160px] truncate block">
                            {inc.barangay}
                          </span>
                        )}
                        {col.key === 'status' && (
                          <Badge label={inc.status} className={STATUS_COLORS[inc.status]} />
                        )}
                        {col.key === 'timestamp' && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {format(new Date(inc.timestamp), 'MM/dd HH:mm')}
                          </span>
                        )}
                        {col.key === 'responders' && (
                          <span className="text-[11px] font-mono text-foreground">
                            {inc.responders}
                          </span>
                        )}
                        {col.key === 'duration' && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {inc.duration}m
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Expanded row */}
                  {expandedId === inc.id && (
                    <tr
                      key={`${inc.id}-detail`}
                      className="bg-card-nested/30 border-b border-border"
                    >
                      <td colSpan={visibleCols.length} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Zone info */}
                          <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                              Location
                            </p>
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-foreground">
                                  {inc.barangay}
                                </p>
                                <p className="text-[10px] font-mono text-muted-foreground">
                                  {inc.coordinates[0].toFixed(4)}, {inc.coordinates[1].toFixed(4)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Status timeline */}
                          <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                              Timeline
                            </p>
                            <div className="space-y-1.5">
                              {[
                                { label: 'Reported', time: inc.timestamp, done: true },
                                {
                                  label: 'Dispatched',
                                  time: new Date(
                                    new Date(inc.timestamp).getTime() + 3 * 60000
                                  ).toISOString(),
                                  done: inc.status !== 'Active',
                                },
                                {
                                  label: 'Resolved',
                                  time: new Date(
                                    new Date(inc.timestamp).getTime() + inc.duration * 60000
                                  ).toISOString(),
                                  done: inc.status === 'Resolved',
                                },
                              ].map(step => (
                                <div key={step.label} className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      'w-1.5 h-1.5 rounded-full shrink-0',
                                      step.done ? 'bg-success' : 'bg-border'
                                    )}
                                  />
                                  <span className="text-[10px] text-foreground">{step.label}</span>
                                  <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                                    {format(new Date(step.time), 'HH:mm')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Description + actions */}
                          <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                              Description
                            </p>
                            <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                              {inc.description}
                            </p>
                            <div className="flex gap-1.5 flex-wrap pt-1">
                              <ActionBtn icon={<Edit className="w-3 h-3" />} label="Edit" />
                              <ActionBtn icon={<UserPlus className="w-3 h-3" />} label="Assign" />
                              <ActionBtn
                                icon={<CheckCircle className="w-3 h-3" />}
                                label="Resolve"
                                accent
                              />
                              <ActionBtn icon={<MapPin className="w-3 h-3" />} label="Map" />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">
          {filtered.length === 0
            ? 'No results'
            : `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filtered.length)} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-1">
          <PaginationBtn onClick={() => setPage(0)} disabled={page === 0} aria-label="First page">
            <ChevronsLeft className="w-3.5 h-3.5" />
          </PaginationBtn>
          <PaginationBtn
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </PaginationBtn>
          <span className="px-2 font-mono text-foreground">
            {page + 1} / {totalPages || 1}
          </span>
          <PaginationBtn
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </PaginationBtn>
          <PaginationBtn
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
            aria-label="Last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </PaginationBtn>

          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
              setPage(0)
            }}
            className="ml-2 bg-input border border-border rounded-sm text-xs font-mono text-foreground px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            {[5, 10, 20].map(n => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  label: string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-2 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      aria-label={`Filter by ${label}`}
    >
      {options.map(o => (
        <option key={o} value={o}>
          {o === 'All' ? `All ${label}s` : o}
        </option>
      ))}
    </select>
  )
}

function PaginationBtn({
  onClick,
  disabled,
  children,
  'aria-label': ariaLabel,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
  'aria-label': string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-6 h-6 flex items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}

function ActionBtn({
  icon,
  label,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  accent?: boolean
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-medium border transition-colors',
        accent
          ? 'border-success/30 text-success bg-success/10 hover:bg-success/20'
          : 'border-border text-muted-foreground bg-card hover:bg-secondary hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </button>
  )
}
