'use client'

import { DataTable } from '@/components/dashboard/data-table'

export default function TablePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Incident Data</h1>
        <p className="text-muted-foreground">
          View and manage all reported incidents across Calbayog City
        </p>
      </div>

      {/* Data Table */}
      <DataTable />
    </div>
  )
}
