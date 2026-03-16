"use client"

import { useState, useCallback } from "react"
import { CityMap } from "@/components/map/city-map"
import { MapSidebar } from "@/components/map/map-sidebar"
import { ZoneModal } from "@/components/map/zone-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mapOverlayZones } from "@/lib/risk-data"
import { PanelLeftClose, PanelLeft } from "lucide-react"

type Zone = (typeof mapOverlayZones)[number]

export default function MapPage() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleZoneSelect = useCallback((zone: Zone) => {
    setSelectedZone(zone)
    setModalOpen(true)
  }, [])

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b bg-card/50 px-4 py-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            className="hidden md:flex"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeft className="size-4" />
            )}
          </Button>
          <div>
            <h1 className="text-sm font-medium text-foreground">Risk Map</h1>
            <p className="text-xs text-muted-foreground">
              {"Catbalogan City \u2014 12\u00B004\u2032N 124\u00B036\u2032E"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {mapOverlayZones.length} Zones
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            MapLibre GL
          </Badge>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="hidden w-72 shrink-0 overflow-auto border-r bg-card/50 md:block">
            <MapSidebar onZoneSelect={handleZoneSelect} />
          </aside>
        )}
        <div className="flex-1">
          <CityMap onZoneClick={handleZoneSelect} />
        </div>
      </div>

      <ZoneModal
        zone={selectedZone}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
