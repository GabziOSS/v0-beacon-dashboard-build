import { ZONE_DEFINITIONS } from './zones'
import { rng, randFloat } from '../seed'
import type { RiskLevel } from '../types'

interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: [number, number][][]
}

interface GeoJSONFeature {
  type: 'Feature'
  properties: Record<string, unknown>
  geometry: GeoJSONPolygon
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

/** Map area_km2 to approximate degree radius (small ~0.012°, large ~0.025°) */
function areaToRadius(area_km2: number): number {
  const minArea = 1.9
  const maxArea = 9.1
  const minRadius = 0.012
  const maxRadius = 0.025
  const t = (area_km2 - minArea) / (maxArea - minArea)
  return minRadius + t * (maxRadius - minRadius)
}

/** Generate an irregular hexagon around a centroid */
function makeHexagon(centroid: readonly [number, number], radius: number): [number, number][] {
  const coords: [number, number][] = []

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6 // start at -30° for flat-top hex
    const r = radius * randFloat(0.85, 1.15)
    const lng = centroid[0] + r * Math.cos(angle)
    const lat = centroid[1] + r * Math.sin(angle)
    coords.push([lng, lat])
  }

  // Close the ring
  coords.push([coords[0][0], coords[0][1]])
  return coords
}

export function generateZonesGeoJSON(
  zones: { id: string; riskLevel: RiskLevel }[]
): GeoJSONFeatureCollection {
  const riskMap = new Map(zones.map(z => [z.id, z.riskLevel]))

  const features: GeoJSONFeature[] = ZONE_DEFINITIONS.map(def => {
    const radius = areaToRadius(def.area_km2)
    const coordinates = makeHexagon(def.centroid, radius)

    return {
      type: 'Feature' as const,
      properties: {
        zoneId: def.id,
        name: def.name,
        barangay: def.barangay,
        district: def.district,
        riskLevel: riskMap.get(def.id) ?? 'medium',
        population: def.population,
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates],
      },
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}
