'use client'

import { useAtomValue } from 'jotai'
import { 
  AlertTriangle, 
  Activity, 
  Clock, 
  CheckCircle, 
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { metricCardsAtom } from '@/lib/atoms/dashboard'
import type { MetricCard, RiskLevel } from '@/lib/types/dashboard'

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle,
  Users,
}

const riskColorMap: Record<RiskLevel, string> = {
  critical: 'text-risk-critical',
  high: 'text-risk-high',
  medium: 'text-risk-medium',
  low: 'text-risk-low',
  minimal: 'text-risk-minimal',
}

const riskBgMap: Record<RiskLevel, string> = {
  critical: 'bg-risk-critical/10',
  high: 'bg-risk-high/10',
  medium: 'bg-risk-medium/10',
  low: 'bg-risk-low/10',
  minimal: 'bg-risk-minimal/10',
}

export function MetricCards() {
  const metrics = useAtomValue(metricCardsAtom)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => (
        <MetricCardItem key={metric.id} metric={metric} />
      ))}
    </div>
  )
}

function MetricCardItem({ metric }: { metric: MetricCard }) {
  const Icon = metric.icon ? iconMap[metric.icon] || Activity : Activity
  const TrendIcon = metric.trend === 'up' 
    ? TrendingUp 
    : metric.trend === 'down' 
      ? TrendingDown 
      : Minus

  const trendColor = metric.trend === 'up' 
    ? metric.id.includes('response') || metric.id.includes('resolution')
      ? 'text-status-resolved' // Good trends for response/resolution
      : 'text-risk-high' // Bad trend for incidents
    : metric.trend === 'down'
      ? metric.id.includes('response') || metric.id.includes('affected')
        ? 'text-status-resolved' // Good - lower response time or affected
        : 'text-risk-medium' // Neutral/warning
      : 'text-muted-foreground'

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-md',
      metric.riskLevel && riskBgMap[metric.riskLevel]
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={cn(
            'rounded-lg p-2',
            metric.riskLevel ? riskBgMap[metric.riskLevel] : 'bg-primary/10'
          )}>
            <Icon className={cn(
              'h-5 w-5',
              metric.riskLevel ? riskColorMap[metric.riskLevel] : 'text-primary'
            )} />
          </div>
          {metric.trend && metric.trendValue !== undefined && (
            <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
              <TrendIcon className="h-3 w-3" />
              <span>{metric.trendValue}%</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">
            {metric.value}
            {metric.unit && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {metric.unit}
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
