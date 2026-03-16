"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TileGrid, type TileConfig, TILE_COL_SPANS } from "@/components/dashboard/tile-grid"
import { TilePicker, type TileDefinition } from "@/components/dashboard/tile-picker"
import { type TileTab } from "@/components/dashboard/tile-wrapper"
import { incidentTileTabs }       from "@/components/dashboard/tiles/incident-tile"
import { riskGaugeTileTabs }      from "@/components/dashboard/tiles/risk-gauge-tile"
import { evacuationTileTabs }     from "@/components/dashboard/tiles/evacuation-tile"
import { infrastructureTileTabs } from "@/components/dashboard/tiles/infrastructure-tile"
import { PopulationTileContent }  from "@/components/dashboard/tiles/population-tile"
import { ResponseTileContent }    from "@/components/dashboard/tiles/response-tile"
import { AlertTileContent }       from "@/components/dashboard/tiles/alert-tile"
import { WindSpeedTileContent }   from "@/components/dashboard/tiles/wind-speed-tile"
import { WindRoseTileContent }    from "@/components/dashboard/tiles/wind-rose-tile"
import { BarometerTileContent }   from "@/components/dashboard/tiles/barometer-tile"
import { SunriseTileContent }     from "@/components/dashboard/tiles/sunrise-tile"
import { TemperatureTileContent } from "@/components/dashboard/tiles/temperature-tile"
import { ZoneStatTileContent }    from "@/components/dashboard/tiles/zone-stat-tile"
import { StatTileContent, type StatKey } from "@/components/dashboard/tiles/stat-tile"
import { Shield, RefreshCw, Share2 } from "lucide-react"
import { IconBtn } from "@/components/primitives/icon-btn"
import { Badge } from "@/components/ui/badge"

// ---------------------------------------------------------------------------
// Initial layouts
// ---------------------------------------------------------------------------
const OVERVIEW_TILES: TileConfig[] = [
  { id: "stat-alerts",     type: "stat-alerts",     title: "Active Alerts",      defaultSize: "xs", colSpan: 3, minCols: 3 },
  { id: "stat-population", type: "stat-population", title: "Population at Risk", defaultSize: "xs", colSpan: 3, minCols: 3 },
  { id: "stat-risk",       type: "stat-risk",       title: "Risk Index",         defaultSize: "xs", colSpan: 3, minCols: 3 },
  { id: "stat-response",   type: "stat-response",   title: "Avg Response",       defaultSize: "xs", colSpan: 3, minCols: 3 },
  { id: "incidents",       type: "incidents",       title: "Monthly Incidents",  sourceLabel: "NwSSU_AWS1", defaultSize: "md", colSpan: 6, supportsMapHover: true },
  { id: "risk-gauge",      type: "risk-gauge",      title: "Risk Assessment",    sourceLabel: "NwSSU_AWS1", defaultSize: "sm", colSpan: 4, supportsMapHover: true },
  { id: "alerts",          type: "alerts",          title: "Recent Alerts",      defaultSize: "sm", colSpan: 2 },
  { id: "wind-speed",      type: "wind-speed",      title: "Wind Speed",         sourceLabel: "NwSSU_AWS1", defaultSize: "xs", colSpan: 3 },
  { id: "wind-rose",       type: "wind-rose",       title: "Wind Rose",          sourceLabel: "NwSSU_AWS1", defaultSize: "sm", colSpan: 3 },
  { id: "barometer",       type: "barometer",       title: "Barometer",          sourceLabel: "NwSSU-AWS", defaultSize: "md", colSpan: 6 },
]

const RISK_TILES: TileConfig[] = [
  { id: "risk-gauge-r",   type: "risk-gauge",     title: "Risk Assessment",     defaultSize: "md", colSpan: 6, supportsMapHover: true },
  { id: "evacuation",     type: "evacuation",     title: "Evacuation Centers",  defaultSize: "md", colSpan: 6, supportsMapHover: true },
  { id: "population",     type: "population",     title: "Population Exposure", defaultSize: "sm", colSpan: 4, supportsMapHover: true },
  { id: "infrastructure", type: "infrastructure", title: "Infrastructure Risk", defaultSize: "md", colSpan: 5, supportsMapHover: true },
  { id: "zone-stat",      type: "zone-stat",      title: "Zone Statistics",     defaultSize: "sm", colSpan: 3, supportsMapHover: true },
  { id: "response",       type: "response",       title: "Response Time",       defaultSize: "md", colSpan: 6 },
  { id: "temperature",    type: "temperature",    title: "Temperature",         sourceLabel: "NwSSU_AWS1", defaultSize: "xs", colSpan: 3 },
  { id: "sunrise",        type: "sunrise",        title: "Sunrise / Sunset",    sourceLabel: "NwSSU-AWS",  defaultSize: "xs", colSpan: 3 },
]

// ---------------------------------------------------------------------------
// Content resolver — pure switch, no state
// ---------------------------------------------------------------------------
function resolveTile(tile: TileConfig): { tabs?: TileTab[]; children?: React.ReactNode } {
  switch (tile.type) {
    case "incidents":       return { tabs: incidentTileTabs }
    case "risk-gauge":      return { tabs: riskGaugeTileTabs }
    case "evacuation":      return { tabs: evacuationTileTabs }
    case "infrastructure":  return { tabs: infrastructureTileTabs }
    case "population":      return { children: <PopulationTileContent /> }
    case "response":        return { children: <ResponseTileContent /> }
    case "alerts":          return { children: <AlertTileContent /> }
    case "wind-speed":      return { children: <WindSpeedTileContent /> }
    case "wind-rose":       return { children: <WindRoseTileContent /> }
    case "barometer":       return { children: <BarometerTileContent /> }
    case "sunrise":         return { children: <SunriseTileContent /> }
    case "temperature":     return { children: <TemperatureTileContent /> }
    case "zone-stat":       return { children: <ZoneStatTileContent /> }
    case "stat-alerts":     return { children: <StatTileContent statKey={"alerts" as StatKey} /> }
    case "stat-population": return { children: <StatTileContent statKey={"population" as StatKey} /> }
    case "stat-risk":       return { children: <StatTileContent statKey={"riskIndex" as StatKey} /> }
    case "stat-response":   return { children: <StatTileContent statKey={"response" as StatKey} /> }
    default:                return { children: <div className="p-4 text-xs text-muted-foreground">No content</div> }
  }
}

// ---------------------------------------------------------------------------
// Per-tab tile layout hook
// ---------------------------------------------------------------------------
function useTileLayout(initial: TileConfig[]) {
  const [tiles, setTiles] = useState(initial)

  const handleColSpanChange = useCallback((id: string, span: number) => {
    setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, colSpan: span } : t)))
  }, [])

  const handleRemove = useCallback((id: string) => {
    setTiles((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleAdd = useCallback((def: TileDefinition) => {
    setTiles((prev) => [
      ...prev,
      {
        id: `${def.type}-${Date.now()}`,
        type: def.type,
        title: def.label,
        defaultSize: def.defaultSize,
        colSpan: TILE_COL_SPANS[def.defaultSize],
        supportsMapHover: def.supportsMapHover,
      },
    ])
  }, [])

  return { tiles, handleColSpanChange, handleRemove, handleAdd }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const overview = useTileLayout(OVERVIEW_TILES)
  const risk     = useTileLayout(RISK_TILES)

  const [pickerOpen,   setPickerOpen]   = useState(false)
  const [pickerTarget, setPickerTarget] = useState<"overview" | "risk">("overview")
  const [hoveredMapTile, setHoveredMapTile] = useState<string | null>(null)

  const openPicker = (tab: "overview" | "risk") => {
    setPickerTarget(tab)
    setPickerOpen(true)
  }

  const handleTileAdd = (def: TileDefinition) => {
    if (pickerTarget === "overview") overview.handleAdd(def)
    else risk.handleAdd(def)
  }

  const handleHoverOnMap = useCallback((id: string, active: boolean) => {
    setHoveredMapTile(active ? id : null)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Station header */}
      <div className="sticky top-14 z-30 flex items-center justify-between border-b bg-card/80 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">NwSSU-AWS</span>
          </div>
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <span className="text-xs text-muted-foreground">Device Tier:</span>
          <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-semibold">Pro</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <IconBtn aria-label="Refresh data" size="sm">
            <RefreshCw className="size-3.5" aria-hidden="true" />
          </IconBtn>
          <IconBtn aria-label="Share dashboard" size="sm">
            <Share2 className="size-3.5" aria-hidden="true" />
          </IconBtn>
          <div className="ml-1 flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2 py-1">
            <span className="size-1.5 rounded-full bg-chart-4" aria-hidden="true" />
            <span className="text-[11px] font-medium text-foreground">NwSSU-AWS</span>
          </div>
        </div>
      </div>

      {/* Last updated */}
      <p className="px-4 py-1.5 text-[11px] text-muted-foreground">
        Last updated: February 27, 2026 / 9:51 AM
      </p>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-9 gap-0 rounded-none bg-transparent p-0">
            {(["overview", "risk"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs capitalize
                           data-[state=active]:border-primary data-[state=active]:bg-transparent
                           data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab === "overview" ? "Overview" : "Risk Analytics"}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0 p-4">
          <TileGrid
            tiles={overview.tiles}
            onColSpanChange={overview.handleColSpanChange}
            onRemoveTile={overview.handleRemove}
            onAddTile={() => openPicker("overview")}
            onHoverOnMap={handleHoverOnMap}
            hoveredMapTileId={hoveredMapTile}
            renderTile={resolveTile}
          />
        </TabsContent>

        <TabsContent value="risk" className="mt-0 p-4">
          <TileGrid
            tiles={risk.tiles}
            onColSpanChange={risk.handleColSpanChange}
            onRemoveTile={risk.handleRemove}
            onAddTile={() => openPicker("risk")}
            onHoverOnMap={handleHoverOnMap}
            hoveredMapTileId={hoveredMapTile}
            renderTile={resolveTile}
          />
        </TabsContent>
      </Tabs>

      <TilePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleTileAdd}
      />
    </div>
  )
}
