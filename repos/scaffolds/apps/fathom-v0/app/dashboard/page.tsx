'use client'

import { useAtomValue } from 'jotai'
import { MetricCards } from '@/components/dashboard/metric-cards'
import { ChartGrid } from '@/components/dashboard/chart-grid'
import { DataTable } from '@/components/dashboard/data-table'
import { MapView } from '@/components/dashboard/map-view'
import { viewModeAtom } from '@/lib/atoms/ui'

export default function DashboardPage() {
  const viewMode = useAtomValue(viewModeAtom)

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">City Safety Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and risk assessment for Calbayog City
        </p>
      </div>

      {/* Metrics overview */}
      <MetricCards />

      {/* Chart grid */}
      {viewMode === 'dashboard' && <ChartGrid />}
      
      {/* Table view */}
      {viewMode === 'table' && <DataTable />}
      
      {/* Map view */}
      {viewMode === 'map' && <MapView />}
    </div>
  )
}
