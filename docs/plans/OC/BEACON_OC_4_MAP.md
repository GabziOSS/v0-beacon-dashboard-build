# Beacon — opencode Prompt 4: MapLibre Integration

Prerequisites:
- opencode Prompt 1 complete: ZONES_GEOJSON, INCIDENTS, ZONES exported
- v0 Sessions 1–3 complete: ZoneSheet, LayerDrawer, map page shell exist

Read the full codebase before starting. Understand what the map
page shell currently renders, what props ZoneSheet and LayerDrawer
accept, and what the route search params look like.

---

## Goal

Wire MapLibre GL JS into the map page shell. The UI components
(ZoneSheet, LayerDrawer, MapControls, MapLegend) exist as markup
from v0. This prompt adds all MapLibre logic, GeoJSON sources,
layer paint expressions, click handling, SVG canvas patterns,
URL param deep-linking, and clustering.

Do not change visual markup in UI components unless a prop
shape needs adjusting to support the wiring.

---

## Part 1 — Install

```bash
npm install maplibre-gl react-map-gl
```

Verify current react-map-gl API via context7 before writing any
map code. Confirm whether the installed version uses
`react-map-gl/maplibre` or a different import path.

Add to `.env.local`:
```
VITE_MAP_STYLE_URL=https://demotiles.maplibre.org/style.json
VITE_WL_STATION_ID=your-station-id
```

These are client-accessible env vars validated by `@t3-oss/env-core`
in `lib/env.client.ts`. Reference them via the validated object,
never via `import.meta.env` directly in components:

```ts
// lib/env.client.ts (already exists or create it)
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const clientEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_MAP_STYLE_URL: z.string().url(),
    VITE_WL_STATION_ID: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
})
```

Import MapLibre CSS at the top of the map route:
```typescript
import "maplibre-gl/dist/maplibre-gl.css"
```

---

## Part 2 — Pattern Generator

File: `components/map/pattern-generator.ts`

Generate PNG canvas patterns registered as MapLibre named images.
Called once on map load via `map.addImage()`.
Each pattern: 32×32px canvas, transparent background.

```typescript
export function generateRiskPatterns(map: maplibregl.Map): void {
  addCanvasPattern(map, "pattern-critical", (ctx, size) => {
    // Diagonal red hatching
    // Background fill: rgba(239, 68, 68, 0.12)
    // Lines at 45°: rgba(239, 68, 68, 0.55), lineWidth 1.5, spacing 6px
    // Draw lines from top-right to bottom-left across full canvas
  })

  addCanvasPattern(map, "pattern-high", (ctx, size) => {
    // Dotted amber grid
    // Background fill: rgba(232, 137, 12, 0.08)
    // Dots at 8px intervals: rgba(232, 137, 12, 0.6), radius 1.5px
  })

  addCanvasPattern(map, "pattern-low", (ctx, size) => {
    // Crosshatch green
    // Background fill: rgba(34, 197, 94, 0.05)
    // Horizontal + vertical lines: rgba(34, 197, 94, 0.3), lineWidth 0.75
    // Spacing 8px
  })
  // medium: no pattern, handled by fill-color expression in paint
}

function addCanvasPattern(
  map: maplibregl.Map,
  id: string,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 32
): void {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  draw(ctx, size)
  map.addImage(id, ctx.getImageData(0, 0, size, size))
}
```

---

## Part 3 — Types

```typescript
// components/map/types.ts

interface ActiveZone {
  zoneId: string
  name: string
  barangay: string
  district: number
  riskLevel: "critical" | "high" | "medium" | "low"
  coordinates: [number, number]   // centroid [lng, lat]
  incidentCount: number
  lastIncident: string
}

function buildActiveZone(zone: Zone): ActiveZone {
  return {
    zoneId: zone.id,
    name: zone.name,
    barangay: zone.barangay,
    district: zone.district,
    riskLevel: zone.riskLevel,
    coordinates: zone.centroid,
    incidentCount: zone.incidentCount,
    lastIncident: zone.lastIncident,
  }
}
```

---

## Part 4 — CivicMap Component

File: `components/map/civic-map.tsx`

```typescript
import Map, {
  Source, Layer, type MapRef, type MapMouseEvent,
  type LayerSpecification,
} from "react-map-gl/maplibre"
import { useRef, useState, useCallback, useMemo, useEffect } from "react"
import { ZONES_GEOJSON, INCIDENTS, ZONES } from "@/lib/mock-data"
import { ZoneSheet } from "@/components/ui/zone-sheet"
import { LayerDrawer } from "@/components/ui/layer-drawer"
import { generateRiskPatterns } from "./pattern-generator"
import { MapControls } from "./map-controls"
import { MapLegend } from "./map-legend"
import { clientEnv } from "@/lib/env.client"
import { useSearchParams } from "@/lib/routing"   // ← framework-agnostic alias
import "maplibre-gl/dist/maplibre-gl.css"
```

### Framework routing isolation

Do NOT import `useSearchParams`, `useParams`, `useRouter`, `Link`,
or `redirect` directly from `next/navigation` or any other framework
package anywhere in this file or any map component.

All framework routing primitives must come from `@/lib/routing`:

```typescript
// lib/routing.ts — re-export layer, single file to swap at migration
// If this file does not exist yet, create it now.
export { useSearchParams, useParams, useRouter } from "next/navigation"
export { default as Link } from "next/link"
export { redirect } from "next/navigation"
```

Components import from `@/lib/routing`, never from `next/navigation`
or `next/link` directly. This is the only file that knows what
framework is in use. At migration to TanStack Start or React Router v7,
only this file changes.

### Constants

```typescript
const INITIAL_VIEW_STATE = {
  longitude: 124.5908,
  latitude: 12.0685,
  zoom: 12,
}

const MAX_BOUNDS: [[number, number], [number, number]] = [
  [124.20, 11.75],
  [124.95, 12.40],
]

const MAP_STYLE = clientEnv.VITE_MAP_STYLE_URL
```

### URL param handling

```typescript
// Read ?zone=z01 from route — via framework-agnostic alias
import { useSearchParams } from "@/lib/routing"

const searchParams = useSearchParams()
const zoneParam = searchParams.get("zone")

// On mount and when zoneParam changes:
useEffect(() => {
  if (!zoneParam || !mapLoaded) return
  const zone = ZONES.find(z => z.id === zoneParam)
  if (!zone) return
  setActiveZone(buildActiveZone(zone))
  setZoneSheetOpen(true)
  mapRef.current?.flyTo({
    center: zone.centroid,
    zoom: 14,
    duration: 1200,
  })
}, [zoneParam, mapLoaded])

// mapLoaded: local boolean state set to true in onLoad callback
```

### Incident GeoJSON

```typescript
const incidentGeoJSON = useMemo(
  (): GeoJSON.FeatureCollection => ({
    type: "FeatureCollection",
    features: INCIDENTS.map(inc => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: inc.coordinates,
      },
      properties: {
        id: inc.id,
        type: inc.type,
        severity: inc.severity,
        severityScore: { critical: 4, high: 3, medium: 2, low: 1 }[inc.severity],
        zoneId: inc.zoneId,
        status: inc.status,
      },
    })),
  }),
  []
)
```

### Click handler

```typescript
const handleMapClick = useCallback(
  (e: MapMouseEvent) => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const zoneFeatures = map.queryRenderedFeatures(e.point, {
      layers: ["zones-fill"],
    })

    if (zoneFeatures.length > 0) {
      const props = zoneFeatures[0].properties as { zoneId: string }
      const zone = ZONES.find(z => z.id === props.zoneId)
      if (zone) {
        setActiveZone(buildActiveZone(zone))
        setZoneSheetOpen(true)
        setPendingCoords([e.lngLat.lng, e.lngLat.lat])
      }
      return
    }

    // Click outside any zone — close sheet
    setZoneSheetOpen(false)
  },
  []
)
```

### Cursor management

```typescript
const handleMouseEnter = useCallback(() => {
  mapRef.current?.getCanvas().style.setProperty("cursor", "pointer")
}, [])

const handleMouseLeave = useCallback(() => {
  mapRef.current?.getCanvas().style.setProperty("cursor", "")
}, [])
```

---

## Part 5 — MapLibre Layers

All layer `paint` values use hardcoded color strings (not CSS
variables) because MapLibre resolves paint expressions at the
GPU layer — CSS variables are unavailable there. Use oklch
approximations that match the obsidian-ops theme:

```
ice-blue primary:   hsl(199,98%,58%) → #1cd9ff approx
amber accent:       hsl(32,94%,49%)  → #f07b0a approx
destructive red:    hsl(0,85%,60%)   → #f03b3b approx
success green:      hsl(142,71%,45%) → #2db86d approx
```

```tsx
<Map
  ref={mapRef}
  initialViewState={INITIAL_VIEW_STATE}
  mapStyle={MAP_STYLE}
  minZoom={9}
  maxZoom={18}
  maxBounds={MAX_BOUNDS}
  onLoad={handleMapLoad}
  onClick={handleMapClick}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  interactiveLayerIds={["zones-fill", "incident-points"]}
>
  {/* ── Zone polygons ── */}
  <Source id="zones" type="geojson" data={ZONES_GEOJSON}>

    <Layer
      id="zones-fill"
      type="fill"
      paint={{
        "fill-pattern": [
          "match", ["get", "riskLevel"],
          "critical", "pattern-critical",
          "high",     "pattern-high",
          "low",      "pattern-low",
          ""
        ],
        "fill-color": [
          "case",
          ["==", ["get", "riskLevel"], "medium"], "rgba(28,217,255,0.12)",
          "rgba(0,0,0,0)"
        ],
        "fill-opacity": 1,
      }}
    />

    <Layer
      id="zones-outline"
      type="line"
      paint={{
        "line-color": [
          "match", ["get", "riskLevel"],
          "critical", "#f03b3b",
          "high",     "#f07b0a",
          "medium",   "#1cd9ff",
          "low",      "#2db86d",
          "#ffffff"
        ],
        "line-width": 1.5,
        "line-opacity": 0.8,
      }}
    />

    <Layer
      id="zones-labels"
      type="symbol"
      minzoom={11}
      layout={{
        "text-field": ["get", "name"],
        "text-size": 11,
        "text-anchor": "center",
        "text-max-width": 8,
      }}
      paint={{
        "text-color": "rgba(225,232,245,0.9)",
        "text-halo-color": "rgba(8,12,24,0.85)",
        "text-halo-width": 1.5,
      }}
    />

  </Source>

  {/* ── Incident points with clustering ── */}
  {showPoints && (
    <Source
      id="incidents"
      type="geojson"
      data={incidentGeoJSON}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": [
            "step", ["get", "point_count"],
            "#1cd9ff",  10,
            "#f07b0a",  30,
            "#f03b3b"
          ],
          "circle-radius": [
            "step", ["get", "point_count"],
            18, 10, 24, 30, 32
          ],
          "circle-opacity": 0.85,
        }}
      />

      <Layer
        id="cluster-count"
        type="symbol"
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        }}
        paint={{ "text-color": "#ffffff" }}
      />

      <Layer
        id="incident-points"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            10, 3,
            16, 8,
          ],
          "circle-color": [
            "match", ["get", "type"],
            "fire",           "#f03b3b",
            "flood",          "#1cd9ff",
            "crime",          "#f07b0a",
            "medical",        "#2db86d",
            "infrastructure", "#a855f7",
            "weather",        "#22d3ee",
            "#ffffff"
          ],
          "circle-opacity": 0.9,
          "circle-stroke-color": "rgba(8,12,24,0.8)",
          "circle-stroke-width": 1,
        }}
      />
    </Source>
  )}

  {/* ── Heatmap ── */}
  {showHeatmap && (
    <Source id="heatmap-src" type="geojson" data={incidentGeoJSON}>
      <Layer
        id="heatmap-layer"
        type="heatmap"
        maxzoom={15}
        paint={{
          "heatmap-weight": [
            "interpolate", ["linear"], ["get", "severityScore"],
            0, 0, 4, 1
          ],
          "heatmap-intensity": [
            "interpolate", ["linear"], ["zoom"],
            0, 1, 15, 3
          ],
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0,   "rgba(0,0,0,0)",
            0.2, "#1cd9ff",
            0.6, "#f07b0a",
            1.0, "#f03b3b",
          ],
          "heatmap-radius": [
            "interpolate", ["linear"], ["zoom"],
            0, 2, 15, 25
          ],
          "heatmap-opacity": 0.7,
        }}
      />
    </Source>
  )}

  <MapControls mapRef={mapRef} maxBounds={MAX_BOUNDS} />
  <MapLegend />

</Map>
```

---

## Part 6 — ZoneSheet Wiring

```tsx
<ZoneSheet
  open={zoneSheetOpen}
  onOpenChange={setZoneSheetOpen}
  zoneName={activeZone?.name}
  barangay={activeZone?.barangay}
  district={activeZone?.district}
  riskLevel={activeZone?.riskLevel}
  coordinates={pendingCoords ?? activeZone?.coordinates}
  incidentCount={activeZone?.incidentCount}
/>
```

The Log Incident form submit in ZoneSheet — wire with `useOptimistic`:

```typescript
// In ZoneSheet component:
const [optimisticStatus, addOptimistic] = useOptimistic(
  "idle" as "idle" | "submitting" | "success",
  (_, next: "submitting" | "success") => next
)

async function handleSubmit(formData: IncidentFormData) {
  startTransition(async () => {
    addOptimistic("submitting")
    await new Promise(r => setTimeout(r, 600))   // simulate network
    addOptimistic("success")
    // TODO: wire to real mutation
  })
}
```

After success: switch the sheet to the "Timeline" tab and show
a toast notification.

---

## Part 7 — LayerDrawer Wiring

```typescript
// Local state for layer toggles and opacity
const [showPoints, setShowPoints] = useState(true)
const [showHeatmap, setShowHeatmap] = useState(false)
const [activeLayers, setActiveLayers] = useState<string[]>([])
const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({})

function toggleLayer(id: string) {
  setActiveLayers(prev =>
    prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
  )
}

// Layer definitions passed to LayerDrawer
const layers = [
  {
    id: "incidents_total",
    label: "Total Incidents",
    active: activeLayers.includes("incidents_total"),
    opacity: layerOpacity["incidents_total"] ?? 80,
    onToggle: () => toggleLayer("incidents_total"),
    onOpacityChange: (v: number) =>
      setLayerOpacity(p => ({ ...p, incidents_total: v })),
  },
  // repeat for: incidents_by_type, district_risk, incident_heatmap
]
```

Note: the actual opacity sliders in LayerDrawer currently control
UI state only. Wiring opacity values to MapLibre layer paint
properties is deferred (requires calling `map.setPaintProperty()`
imperatively, which conflicts with the declarative JSX layer approach).
Add a `// TODO: wire opacity to map.setPaintProperty()` comment.

---

## Part 8 — MapControls Wiring

File: `components/map/map-controls.tsx`

```typescript
interface MapControlsProps {
  mapRef: React.RefObject<MapRef>
  maxBounds: [[number, number], [number, number]]
}

// Zoom In
mapRef.current?.zoomIn({ duration: 300 })

// Zoom Out
mapRef.current?.zoomOut({ duration: 300 })

// Reset North
mapRef.current?.resetNorth({ duration: 500 })

// Fit to Calbayog bounds
mapRef.current?.fitBounds(maxBounds, { padding: 40, duration: 800 })
```

---

## Part 9 — Atom Stubs

Create atom stub files for future state management wiring.
Do NOT import these in any component — they're placeholders only.

```typescript
// lib/atoms/map.atoms.ts
// TODO: implement with jotai when global state is added

export const activeZoneAtom = null
  // will be: atom<ActiveZone | null>(null)

export const zoneSheetOpenAtom = null
  // will be: atom<boolean>(false)

export const showHeatmapAtom = null
  // will be: atom<boolean>(false)

export const showPointsAtom = null
  // will be: atom<boolean>(true)

export const activeMapLayersAtom = null
  // will be: atomWithStorage<string[]>("beacon_map_layers", [])

export const layerOpacityAtom = null
  // will be: atomWithStorage<Record<string,number>>("beacon_layer_opacity", {})
```

---

## Acceptance Criteria

- Map renders centered at 12.0685° N, 124.5908° E, zoom 12
- All 12 zone polygons visible with correct risk-level fill patterns
  (critical: diagonal hatching, high: dotted, low: crosshatch, medium: tint)
- Zone outline colors match risk level
- Zone labels appear at zoom ≥ 11
- Clicking a zone opens ZoneSheet from the right
- ZoneSheet shows correct zone name, risk badge, incident count
- Click coordinate pre-fills the Log Incident form location field
- Log Incident form submit shows optimistic "submitting" state
- After submit: switches to Timeline tab, shows success notification
- Incident points render with type-appropriate colors
- Clusters visible at zoom < 14, expand to individual points at zoom ≥ 14
- Cluster color steps by count: blue → amber → red
- Heatmap layer toggles on/off from LayerDrawer
- Incident points toggle on/off from LayerDrawer
- LayerDrawer open by default
- `?zone=z01` URL param opens ZoneSheet and flies to zone centroid
- URL param handling waits for map load before flying
- Zoom in/out/reset north/fit bounds controls all function correctly
- MapLegend shows all 4 risk levels with correct swatches
- MapLegend collapses via chevron
- No unstyled map artifacts (MapLibre CSS imported correctly)
- No `@radix-ui/*` imports in any map component
- TypeScript strict mode passes with no errors
