'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  Compass,
  Focus,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import type { RiskLevel } from '@/lib/types/dashboard'

// Calbayog City coordinates
const CALBAYOG_CENTER: [number, number] = [124.5908, 12.0685]
const DEFAULT_ZOOM = 12

// Zone data for Calbayog City
interface Zone {
  id: string
  name: string
  riskLevel: RiskLevel
  center: [number, number]
  incidents: number
  population: number
}

const zones: Zone[] = [
  { id: 'zone-1', name: 'Obrero', riskLevel: 'medium', center: [124.5850, 12.0720], incidents: 15, population: 12500 },
  { id: 'zone-2', name: 'Central Business District', riskLevel: 'high', center: [124.5900, 12.0680], incidents: 28, population: 8200 },
  { id: 'zone-3', name: 'Rawis', riskLevel: 'critical', center: [124.5950, 12.0650], incidents: 42, population: 15800 },
  { id: 'zone-4', name: 'Bagacay', riskLevel: 'low', center: [124.5800, 12.0600], incidents: 8, population: 6300 },
  { id: 'zone-5', name: 'Carayman', riskLevel: 'medium', center: [124.6000, 12.0750], incidents: 18, population: 9100 },
  { id: 'zone-6', name: 'Dagum', riskLevel: 'minimal', center: [124.5750, 12.0800], incidents: 3, population: 4200 },
]

// Incident markers
interface IncidentMarker {
  id: string
  title: string
  category: string
  riskLevel: RiskLevel
  coordinates: [number, number]
  timestamp: string
}

const incidentMarkers: IncidentMarker[] = [
  { id: 'inc-1', title: 'Road flooding', category: 'Infrastructure', riskLevel: 'high', coordinates: [124.5870, 12.0710], timestamp: '2024-03-15T08:30:00Z' },
  { id: 'inc-2', title: 'Power outage', category: 'Infrastructure', riskLevel: 'critical', coordinates: [124.5910, 12.0675], timestamp: '2024-03-15T09:15:00Z' },
  { id: 'inc-3', title: 'Traffic accident', category: 'Traffic', riskLevel: 'high', coordinates: [124.5960, 12.0640], timestamp: '2024-03-15T07:45:00Z' },
  { id: 'inc-4', title: 'Suspicious activity', category: 'Public Safety', riskLevel: 'medium', coordinates: [124.5780, 12.0620], timestamp: '2024-03-14T22:15:00Z' },
  { id: 'inc-5', title: 'Water main leak', category: 'Infrastructure', riskLevel: 'critical', coordinates: [124.5830, 12.0730], timestamp: '2024-03-15T10:00:00Z' },
]

const riskColors: Record<RiskLevel, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  minimal: '#06b6d4',
}

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])
  
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<IncidentMarker | null>(null)
  const [showZones, setShowZones] = useState(true)
  const [showIncidents, setShowIncidents] = useState(true)
  const [filterRisk, setFilterRisk] = useState<Record<RiskLevel, boolean>>({
    critical: true,
    high: true,
    medium: true,
    low: true,
    minimal: true,
  })

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: CALBAYOG_CENTER,
      zoom: DEFAULT_ZOOM,
    })

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right')

    return () => {
      markers.current.forEach((m) => m.remove())
      map.current?.remove()
    }
  }, [])

  // Update markers when filters change
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach((m) => m.remove())
    markers.current = []

    // Add zone markers
    if (showZones) {
      zones.forEach((zone) => {
        if (!filterRisk[zone.riskLevel]) return

        const el = document.createElement('div')
        el.className = 'zone-marker'
        el.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${riskColors[zone.riskLevel]}40;
          border: 3px solid ${riskColors[zone.riskLevel]};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          color: ${riskColors[zone.riskLevel]};
        `
        el.textContent = zone.incidents.toString()
        el.addEventListener('click', () => setSelectedZone(zone))

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(zone.center)
          .addTo(map.current!)
        
        markers.current.push(marker)
      })
    }

    // Add incident markers
    if (showIncidents) {
      incidentMarkers.forEach((incident) => {
        if (!filterRisk[incident.riskLevel]) return

        const el = document.createElement('div')
        el.className = 'incident-marker'
        el.style.cssText = `
          width: 24px;
          height: 24px;
          background-color: ${riskColors[incident.riskLevel]};
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `
        el.addEventListener('click', () => setSelectedIncident(incident))

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(incident.coordinates)
          .addTo(map.current!)
        
        markers.current.push(marker)
      })
    }
  }, [showZones, showIncidents, filterRisk])

  const handleZoomIn = () => map.current?.zoomIn()
  const handleZoomOut = () => map.current?.zoomOut()
  const handleResetView = () => {
    map.current?.flyTo({
      center: CALBAYOG_CENTER,
      zoom: DEFAULT_ZOOM,
    })
  }

  const handleFocusZone = (zone: Zone) => {
    map.current?.flyTo({
      center: zone.center,
      zoom: 14,
    })
    setSelectedZone(zone)
  }

  return (
    <div className="relative h-[calc(100vh-16rem)] min-h-[500px] w-full overflow-hidden rounded-lg border">
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Map controls overlay */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        {/* Layer controls */}
        <Card className="w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layers className="mr-2 h-4 w-4" />
                  Layers
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showZones}
                  onCheckedChange={setShowZones}
                >
                  Zone Areas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showIncidents}
                  onCheckedChange={setShowIncidents}
                >
                  Incident Markers
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Risk Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Risk Levels</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(filterRisk) as RiskLevel[]).map((risk) => (
                  <DropdownMenuCheckboxItem
                    key={risk}
                    checked={filterRisk[risk]}
                    onCheckedChange={(checked) =>
                      setFilterRisk((prev) => ({ ...prev, [risk]: checked }))
                    }
                  >
                    <span
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: riskColors[risk] }}
                    />
                    <span className="capitalize">{risk}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Zone quick access */}
        <Card className="max-h-[300px] w-64 overflow-hidden">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm">Zones</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[240px] overflow-y-auto p-2 pt-0">
            <div className="space-y-1">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleFocusZone(zone)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                    selectedZone?.id === zone.id && 'bg-accent'
                  )}
                >
                  <span className="truncate">{zone.name}</span>
                  <Badge
                    variant="outline"
                    className="ml-2"
                    style={{
                      borderColor: riskColors[zone.riskLevel],
                      color: riskColors[zone.riskLevel],
                    }}
                  >
                    {zone.incidents}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-1">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleResetView}>
          <Focus className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 w-auto">
        <CardContent className="flex items-center gap-4 p-3">
          <span className="text-xs font-medium text-muted-foreground">Risk Level:</span>
          {(['critical', 'high', 'medium', 'low', 'minimal'] as RiskLevel[]).map((risk) => (
            <div key={risk} className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: riskColors[risk] }}
              />
              <span className="text-xs capitalize">{risk}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Zone detail sheet */}
      <Sheet open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedZone?.name}
            </SheetTitle>
            <SheetDescription>Zone details and statistics</SheetDescription>
          </SheetHeader>
          {selectedZone && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2">
                <Badge
                  className="capitalize"
                  style={{
                    backgroundColor: riskColors[selectedZone.riskLevel],
                    color: 'white',
                  }}
                >
                  {selectedZone.riskLevel} Risk
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{selectedZone.incidents}</div>
                    <div className="text-sm text-muted-foreground">Active Incidents</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{selectedZone.population.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Population</div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Coordinates</h4>
                <code className="text-xs text-muted-foreground">
                  {selectedZone.center[1].toFixed(4)}°N, {selectedZone.center[0].toFixed(4)}°E
                </code>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Incident detail sheet */}
      <Sheet open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {selectedIncident?.title}
            </SheetTitle>
            <SheetDescription>Incident details</SheetDescription>
          </SheetHeader>
          {selectedIncident && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className="capitalize"
                  style={{
                    backgroundColor: riskColors[selectedIncident.riskLevel],
                    color: 'white',
                  }}
                >
                  {selectedIncident.riskLevel} Risk
                </Badge>
                <Badge variant="outline">{selectedIncident.category}</Badge>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium">Reported</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedIncident.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium">Location</h4>
                <code className="text-xs text-muted-foreground">
                  {selectedIncident.coordinates[1].toFixed(4)}°N, {selectedIncident.coordinates[0].toFixed(4)}°E
                </code>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
