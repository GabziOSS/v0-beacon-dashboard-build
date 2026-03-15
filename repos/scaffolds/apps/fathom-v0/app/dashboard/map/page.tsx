'use client'

import { MapView } from '@/components/dashboard/map-view'

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground">
          Geographic visualization of incidents and risk zones across Calbayog City
        </p>
      </div>

      {/* Map */}
      <MapView />
    </div>
  )
}
