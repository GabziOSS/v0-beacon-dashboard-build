'use client'

import { useState } from 'react'
import { CityMap, ZONES } from '@/components/map/city-map'
import { MapLegend } from '@/components/map/map-legend'
import { ZoneSheet } from '@/components/map/zone-sheet'
import type { RiskLevel } from '@/components/map/city-map'
import { AlertTriangle, MapPin, Activity, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const RISK_TEXT: Record<RiskLevel, string> = {
  Critical: 'text-destructive',
  High: 'text-warning',
  Medium: 'text-chart-1',
  Low: 'text-success',
  Minimal: 'text-muted-foreground',
}

const RISK_BADGE: Record<RiskLevel, string> = {
  Critical: 'bg-destructive/10 text-destructive border-destructive/20',
  High: 'bg-warning/10 text-warning border-warning/20',
  Medium: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  Low: 'bg-success/10 text-success border-success/20',
  Minimal: 'bg-muted text-muted-foreground border-border',
}

export default function MapPage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'All'>('All')

  const selectedZone = ZONES.find(z => z.id === selectedZoneId) ?? null

  const totalActive = ZONES.reduce((s, z) => s + z.activeIncidents, 0)
  const criticalCount = ZONES.filter(z => z.risk === 'Critical').length
  const highCount = ZONES.filter(z => z.risk === 'High').length

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Page header with summary chips */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-sm font-semibold text-foreground">City Zone Map</h1>
          <p className="text-[11px] text-muted-foreground font-mono">
            Calbayog City · {ZONES.length} zones monitored
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip
            icon={<Activity className="w-3 h-3" />}
            label={`${totalActive} active incidents`}
            className="text-destructive bg-destructive/10 border-destructive/20"
          />
          <Chip
            icon={<AlertTriangle className="w-3 h-3" />}
            label={`${criticalCount} critical zones`}
            className="text-warning bg-warning/10 border-warning/20"
          />
          <Chip
            icon={<MapPin className="w-3 h-3" />}
            label={`${highCount} high-risk zones`}
            className="text-chart-1 bg-chart-1/10 border-chart-1/20"
          />
        </div>
      </div>

      {/* Main layout: map + legend */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Left: zone list panel */}
        <div className="w-52 shrink-0 flex flex-col gap-2 overflow-y-auto">
          <MapLegend filter={filterRisk} onFilter={setFilterRisk} />

          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Zones
              </p>
            </div>
            <div className="divide-y divide-border">
              {ZONES.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(prev => (prev === zone.id ? null : zone.id))}
                  className={cn(
                    'w-full px-3 py-2.5 text-left transition-colors hover:bg-secondary/60',
                    selectedZoneId === zone.id && 'bg-secondary'
                  )}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="text-xs font-medium text-foreground truncate leading-tight">
                      {zone.label}
                    </span>
                    {zone.activeIncidents > 0 && (
                      <span className="text-[9px] font-mono bg-destructive/15 text-destructive px-1 py-0.5 rounded-sm shrink-0">
                        {zone.activeIncidents}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      {zone.district}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-mono font-semibold shrink-0',
                        RISK_TEXT[zone.risk]
                      )}
                    >
                      {zone.risk}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: map */}
        <div className="flex-1 min-w-0">
          <CityMap
            selectedZone={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            filterRisk={filterRisk}
          />
        </div>
      </div>

      {/* Zone detail sheet */}
      {selectedZone && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[1px]"
            onClick={() => setSelectedZoneId(null)}
          />
          <ZoneSheet zone={selectedZone} onClose={() => setSelectedZoneId(null)} />
        </>
      )}
    </div>
  )
}

function Chip({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] font-mono',
        className
      )}
    >
      {icon}
      {label}
    </div>
  )
}
