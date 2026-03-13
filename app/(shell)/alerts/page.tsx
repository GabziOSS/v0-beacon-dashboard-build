'use client'

import { useState, useOptimistic, useTransition } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Flame,
  Droplets,
  Shield,
  AlertTriangle,
  Wrench,
  Thermometer,
  MapPin,
  Check,
  ArrowUp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Severity = 'critical' | 'high' | 'medium' | 'low'
type IncidentType = 'fire' | 'flood' | 'crime' | 'medical' | 'infrastructure' | 'weather'

interface Alert {
  id: string
  severity: Severity
  type: IncidentType
  title: string
  description: string
  zone: string
  barangay: string
  responders: number
  timestamp: Date
}

const TYPE_ICONS: Record<IncidentType, React.ReactNode> = {
  fire: <Flame className="w-4 h-4" />,
  flood: <Droplets className="w-4 h-4" />,
  crime: <Shield className="w-4 h-4" />,
  medical: <AlertTriangle className="w-4 h-4" />,
  infrastructure: <Wrench className="w-4 h-4" />,
  weather: <Thermometer className="w-4 h-4" />,
}

const TYPE_LABELS: Record<IncidentType, string> = {
  fire: 'Fire',
  flood: 'Flood',
  crime: 'Crime',
  medical: 'Medical',
  infrastructure: 'Infrastructure',
  weather: 'Weather',
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'text-destructive',
  high: 'text-warning',
  medium: 'text-accent',
  low: 'text-muted-foreground',
}

const SEVERITY_BG: Record<Severity, string> = {
  critical: 'bg-destructive-dim',
  high: 'bg-warning-dim',
  medium: 'bg-accent-dim',
  low: 'bg-muted',
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a01',
    severity: 'critical',
    type: 'fire',
    title: 'Structure fire reported',
    description: 'Active fire in residential building. Multiple occupants reported inside.',
    zone: 'z02',
    barangay: 'Barangay Bagacay',
    responders: 6,
    timestamp: new Date(Date.now() - 2 * 60000),
  },
  {
    id: 'a02',
    severity: 'critical',
    type: 'flood',
    title: 'Flash flood warning',
    description: 'Water levels rising rapidly at Calbayog River. Evacuation recommended.',
    zone: 'z03',
    barangay: 'Calbayog Port Area',
    responders: 8,
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'a03',
    severity: 'high',
    type: 'crime',
    title: 'Armed robbery in progress',
    description: 'Suspects armed with bladed weapons. Police units en route.',
    zone: 'z01',
    barangay: 'Barangay Poblacion',
    responders: 4,
    timestamp: new Date(Date.now() - 12 * 60000),
  },
  {
    id: 'a04',
    severity: 'high',
    type: 'medical',
    title: 'Mass casualty incident',
    description: 'Vehicle collision with multiple injuries. Ambulances dispatched.',
    zone: 'z04',
    barangay: 'Barangay Nijaga',
    responders: 5,
    timestamp: new Date(Date.now() - 18 * 60000),
  },
  {
    id: 'a05',
    severity: 'high',
    type: 'fire',
    title: 'Grass fire spreading',
    description: 'Fire spreading toward residential area. Wind conditions unfavorable.',
    zone: 'z02',
    barangay: 'Barangay Rawis',
    responders: 4,
    timestamp: new Date(Date.now() - 25 * 60000),
  },
  {
    id: 'a06',
    severity: 'medium',
    type: 'infrastructure',
    title: 'Power line down',
    description: 'Fallen power line blocking road. Area secured by responders.',
    zone: 'z01',
    barangay: 'Barangay Central',
    responders: 2,
    timestamp: new Date(Date.now() - 32 * 60000),
  },
  {
    id: 'a07',
    severity: 'medium',
    type: 'flood',
    title: 'Road flooding reported',
    description: 'Low-lying areas experiencing water accumulation. Traffic advisory issued.',
    zone: 'z03',
    barangay: 'Barangay Obrero',
    responders: 3,
    timestamp: new Date(Date.now() - 45 * 60000),
  },
  {
    id: 'a08',
    severity: 'medium',
    type: 'crime',
    title: 'Theft reported',
    description: 'Breaking and entering at commercial establishment. Investigation underway.',
    zone: 'z01',
    barangay: 'Barangay Trinidad',
    responders: 2,
    timestamp: new Date(Date.now() - 58 * 60000),
  },
  {
    id: 'a09',
    severity: 'medium',
    type: 'weather',
    title: 'Severe weather alert',
    description: 'Thunderstorm warning issued. Possible hail and strong winds.',
    zone: 'z04',
    barangay: 'San Policarpo Area',
    responders: 0,
    timestamp: new Date(Date.now() - 65 * 60000),
  },
  {
    id: 'a10',
    severity: 'low',
    type: 'medical',
    title: 'Minor injury reported',
    description: 'Slip and fall at public market. First aid administered.',
    zone: 'z01',
    barangay: 'Barangay Balud',
    responders: 1,
    timestamp: new Date(Date.now() - 72 * 60000),
  },
  {
    id: 'a11',
    severity: 'low',
    type: 'infrastructure',
    title: 'Water main leak',
    description: 'Minor leak detected. Repair crew dispatched.',
    zone: 'z02',
    barangay: 'Barangay Dagum',
    responders: 2,
    timestamp: new Date(Date.now() - 85 * 60000),
  },
  {
    id: 'a12',
    severity: 'low',
    type: 'fire',
    title: 'Smoke investigation',
    description: 'Smoke reported, no fire found. Likely controlled burning.',
    zone: 'z04',
    barangay: 'Barangay Tinambacan',
    responders: 2,
    timestamp: new Date(Date.now() - 95 * 60000),
  },
  {
    id: 'a13',
    severity: 'low',
    type: 'crime',
    title: 'Noise complaint',
    description: 'Loud music reported. Patrol unit responding.',
    zone: 'z01',
    barangay: 'Barangay Capoocan',
    responders: 1,
    timestamp: new Date(Date.now() - 110 * 60000),
  },
  {
    id: 'a14',
    severity: 'low',
    type: 'flood',
    title: 'Minor drainage issue',
    description: 'Clogged drain causing pooling. Maintenance notified.',
    zone: 'z03',
    barangay: 'Barangay Hamorawon',
    responders: 1,
    timestamp: new Date(Date.now() - 125 * 60000),
  },
  {
    id: 'a15',
    severity: 'low',
    type: 'medical',
    title: 'Wellness check requested',
    description: 'Family member requesting welfare check on elderly resident.',
    zone: 'z02',
    barangay: 'Barangay Matobato',
    responders: 1,
    timestamp: new Date(Date.now() - 140 * 60000),
  },
  {
    id: 'a16',
    severity: 'low',
    type: 'infrastructure',
    title: 'Streetlight out',
    description: 'Multiple streetlights reported non-functional. Work order created.',
    zone: 'z04',
    barangay: 'Barangay Cagmanaba',
    responders: 0,
    timestamp: new Date(Date.now() - 155 * 60000),
  },
]

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AlertsPage() {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<Severity | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showCount, setShowCount] = useState(10)
  const [, startTransition] = useTransition()

  const [optimisticAcknowledged, addOptimisticAck] = useOptimistic(
    acknowledged,
    (state, alertId: string) => new Set([...state, alertId])
  )

  function handleAcknowledge(alertId: string) {
    startTransition(() => {
      addOptimisticAck(alertId)
      setAcknowledged(prev => new Set([...prev, alertId]))
    })
  }

  function handleMarkAllRead() {
    const ids = MOCK_ALERTS.map(a => a.id)
    setAcknowledged(new Set(ids))
  }

  const filtered = MOCK_ALERTS.filter(a => filter === 'all' || a.severity === filter)
    .filter(a => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.barangay.toLowerCase().includes(q) ||
        a.zone.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const aAck = optimisticAcknowledged.has(a.id)
      const bAck = optimisticAcknowledged.has(b.id)
      if (aAck !== bAck) return aAck ? 1 : -1
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

  const paged = filtered.slice(0, showCount)
  const counts = {
    critical: MOCK_ALERTS.filter(
      a => a.severity === 'critical' && !optimisticAcknowledged.has(a.id)
    ).length,
    high: MOCK_ALERTS.filter(a => a.severity === 'high' && !optimisticAcknowledged.has(a.id))
      .length,
    medium: MOCK_ALERTS.filter(a => a.severity === 'medium' && !optimisticAcknowledged.has(a.id))
      .length,
    low: MOCK_ALERTS.filter(a => a.severity === 'low' && !optimisticAcknowledged.has(a.id)).length,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Alerts</h1>

      {/* Severity summary */}
      <div className="flex flex-wrap gap-2">
        {(['critical', 'high', 'medium', 'low'] as Severity[]).map(sev => (
          <button
            key={sev}
            onClick={() => setFilter(filter === sev ? 'all' : sev)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors border',
              filter === sev
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:bg-secondary'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                SEVERITY_BG[sev],
                (sev === 'critical' || sev === 'high') && counts[sev] > 0 && 'animate-pulse'
              )}
            />
            <span className={cn('capitalize', SEVERITY_COLORS[sev])}>
              {counts[sev]} {sev}
            </span>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm bg-input border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="h-9 px-3 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Zone
        </button>
        <button className="h-9 px-3 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Type
        </button>
        <button
          onClick={handleMarkAllRead}
          className="h-9 px-3 text-xs font-medium rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Mark all read
        </button>
      </div>

      {/* Alert feed */}
      <div className="space-y-3">
        {paged.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            acknowledged={optimisticAcknowledged.has(alert.id)}
            onAcknowledge={() => handleAcknowledge(alert.id)}
          />
        ))}
      </div>

      {/* Load more */}
      {showCount < filtered.length && (
        <button
          onClick={() => setShowCount(c => c + 10)}
          className="w-full h-10 text-sm font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors"
        >
          Load more ({filtered.length - showCount} remaining)
        </button>
      )}
    </div>
  )
}

function AlertCard({
  alert,
  acknowledged,
  onAcknowledge,
}: {
  alert: Alert
  acknowledged: boolean
  onAcknowledge: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-sm p-4 transition-opacity',
        acknowledged && 'opacity-50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              SEVERITY_BG[alert.severity],
              !acknowledged &&
                (alert.severity === 'critical' || alert.severity === 'high') &&
                'animate-pulse'
            )}
          />
          <span
            className={cn(
              'text-[10px] font-semibold uppercase tracking-wide',
              SEVERITY_COLORS[alert.severity]
            )}
          >
            {alert.severity}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {TYPE_ICONS[alert.type]}
            {TYPE_LABELS[alert.type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(alert.timestamp)}
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-6 h-6 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-7 z-50 w-32 bg-popover border border-border rounded-sm shadow-lg py-1">
                  <button
                    onClick={() => {
                      onAcknowledge()
                      setMenuOpen(false)
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-secondary flex items-center gap-2"
                  >
                    <Check className="w-3 h-3" />
                    Acknowledge
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-secondary flex items-center gap-2">
                    <ArrowUp className="w-3 h-3" />
                    Escalate
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-secondary flex items-center gap-2">
                    <X className="w-3 h-3" />
                    Dismiss
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-sm font-medium text-foreground mb-1">{alert.title}</h3>
      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {alert.barangay}
        </span>
        {alert.responders > 0 && <span>{alert.responders} responders dispatched</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAcknowledge}
          disabled={acknowledged}
          className={cn(
            'h-7 px-3 text-[11px] font-medium rounded-sm transition-colors',
            acknowledged
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {acknowledged ? 'Acknowledged' : 'Acknowledge'}
        </button>
        <button className="h-7 px-3 text-[11px] font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors">
          View on Map
        </button>
        <button className="h-7 px-3 text-[11px] font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors">
          Assign
        </button>
      </div>
    </div>
  )
}
