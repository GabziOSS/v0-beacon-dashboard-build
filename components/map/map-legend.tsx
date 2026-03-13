'use client'

import { cn } from '@/lib/utils'
import type { RiskLevel } from './city-map'

const LEVELS: { risk: RiskLevel; color: string; label: string }[] = [
  { risk: 'Critical', color: 'bg-destructive', label: 'Critical' },
  { risk: 'High', color: 'bg-warning', label: 'High' },
  { risk: 'Medium', color: 'bg-chart-1', label: 'Medium' },
  { risk: 'Low', color: 'bg-success', label: 'Low' },
  { risk: 'Minimal', color: 'bg-muted-foreground', label: 'Minimal' },
]

interface MapLegendProps {
  filter: RiskLevel | 'All'
  onFilter: (level: RiskLevel | 'All') => void
}

export function MapLegend({ filter, onFilter }: MapLegendProps) {
  return (
    <div className="flex flex-col gap-1.5 p-3 bg-card border border-border rounded-sm">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
        Risk Level
      </p>

      <button
        onClick={() => onFilter('All')}
        className={cn(
          'text-left text-[10px] font-mono px-2 py-1 rounded-sm border transition-colors',
          filter === 'All'
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        )}
      >
        All zones
      </button>

      {LEVELS.map(({ risk, color, label }) => (
        <button
          key={risk}
          onClick={() => onFilter(risk)}
          className={cn(
            'flex items-center gap-2 text-left text-[10px] font-mono px-2 py-1 rounded-sm border transition-colors',
            filter === risk
              ? 'border-border bg-secondary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <span className={cn('w-2.5 h-2.5 rounded-[2px] shrink-0 opacity-80', color)} />
          {label}
        </button>
      ))}

      <div className="mt-2 pt-2 border-t border-border space-y-1">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Markers
        </p>
        <div className="flex items-center gap-2 px-2">
          <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">Active incidents</span>
        </div>
      </div>
    </div>
  )
}
