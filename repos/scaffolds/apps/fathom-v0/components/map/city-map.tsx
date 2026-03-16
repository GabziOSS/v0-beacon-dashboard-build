"use client"

import { useEffect, useRef, useCallback } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { mapOverlayZones } from "@/lib/risk-data"

type Zone = (typeof mapOverlayZones)[number]

function getZoneColor(type: string, severity: string): string {
  if (severity === "Critical") return "rgba(239, 68, 68, 0.35)"
  switch (type) {
    case "flood":
      return "rgba(59, 130, 246, 0.30)"
    case "landslide":
      return "rgba(245, 158, 11, 0.30)"
    case "surge":
      return "rgba(239, 68, 68, 0.30)"
    case "typhoon":
      return "rgba(139, 92, 246, 0.25)"
    default:
      return "rgba(250, 204, 21, 0.25)"
  }
}

function getZoneBorderColor(type: string, severity: string): string {
  if (severity === "Critical") return "rgba(239, 68, 68, 0.8)"
  switch (type) {
    case "flood":
      return "rgba(59, 130, 246, 0.7)"
    case "landslide":
      return "rgba(245, 158, 11, 0.7)"
    case "surge":
      return "rgba(239, 68, 68, 0.7)"
    case "typhoon":
      return "rgba(139, 92, 246, 0.6)"
    default:
      return "rgba(250, 204, 21, 0.6)"
  }
}

interface CityMapProps {
  onZoneClick?: (zone: Zone) => void
}

export function CityMap({ onZoneClick }: CityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  const handleZoneClick = useCallback(
    (zone: Zone) => {
      onZoneClick?.(zone)
    },
    [onZoneClick]
  )

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: "Dark Base",
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19,
            paint: {
              "raster-saturation": -0.8,
              "raster-brightness-max": 0.4,
              "raster-brightness-min": 0.05,
              "raster-contrast": 0.2,
            },
          },
        ],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: [124.6, 12.067],
      zoom: 13,
      maxBounds: [
        [124.45, 11.95],
        [124.75, 12.2],
      ],
    })

    map.addControl(new maplibregl.NavigationControl(), "top-right")
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 200 }),
      "bottom-left"
    )

    map.on("load", () => {
      mapOverlayZones.forEach((zone) => {
        const bounds = zone.bounds
        const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
          type: "Feature",
          properties: {
            id: zone.id,
            name: zone.name,
            type: zone.type,
            severity: zone.severity,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [bounds[0][0], bounds[0][1]],
                [bounds[1][0], bounds[0][1]],
                [bounds[1][0], bounds[1][1]],
                [bounds[0][0], bounds[1][1]],
                [bounds[0][0], bounds[0][1]],
              ],
            ],
          },
        }

        map.addSource(zone.id, {
          type: "geojson",
          data: polygon,
        })

        map.addLayer({
          id: `${zone.id}-fill`,
          type: "fill",
          source: zone.id,
          paint: {
            "fill-color": getZoneColor(zone.type, zone.severity),
            "fill-opacity": 0.6,
          },
        })

        map.addLayer({
          id: `${zone.id}-border`,
          type: "line",
          source: zone.id,
          paint: {
            "line-color": getZoneBorderColor(zone.type, zone.severity),
            "line-width": 2,
            "line-dasharray": [3, 2],
          },
        })

        map.addLayer({
          id: `${zone.id}-label`,
          type: "symbol",
          source: zone.id,
          layout: {
            "text-field": zone.name.split(" - ")[1] || zone.name,
            "text-size": 11,
            "text-anchor": "center",
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "rgba(0,0,0,0.7)",
            "text-halo-width": 1.5,
          },
        })

        map.on("click", `${zone.id}-fill`, () => {
          handleZoneClick(zone)
        })

        map.on("mouseenter", `${zone.id}-fill`, () => {
          map.getCanvas().style.cursor = "pointer"
          map.setPaintProperty(`${zone.id}-fill`, "fill-opacity", 0.85)
        })

        map.on("mouseleave", `${zone.id}-fill`, () => {
          map.getCanvas().style.cursor = ""
          map.setPaintProperty(`${zone.id}-fill`, "fill-opacity", 0.6)
        })
      })

      mapOverlayZones.forEach((zone) => {
        const el = document.createElement("div")
        el.className = "zone-marker"
        el.style.cssText = `
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${getZoneBorderColor(zone.type, zone.severity)};
          border: 2px solid rgba(255,255,255,0.8);
          cursor: pointer;
          box-shadow: 0 0 8px ${getZoneBorderColor(zone.type, zone.severity)};
          transition: transform 0.15s ease;
        `
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.4)"
        })
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)"
        })
        el.addEventListener("click", () => {
          handleZoneClick(zone)
        })

        new maplibregl.Marker({ element: el })
          .setLngLat(zone.coordinates)
          .addTo(map)
      })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [handleZoneClick])

  return <div ref={mapContainer} className="size-full" />
}
