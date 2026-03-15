"use client"

import { useState } from "react"

export type RiskLevel = "Critical" | "High" | "Medium" | "Low" | "Minimal"

export interface Zone {
  id: string
  label: string
  shortLabel: string
  district: string
  risk: RiskLevel
  activeIncidents: number
  population: number
  path: string
  centroid: [number, number]
}

// Simplified representative zones for Calbayog City using a 800×600 viewBox.
// Paths are schematic polygons inspired by the actual geographic layout.
export const ZONES: Zone[] = [
  {
    id: "poblacion",
    label: "Poblacion",
    shortLabel: "POB",
    district: "District I",
    risk: "Critical",
    activeIncidents: 5,
    population: 28500,
    path: "M 390 210 L 440 195 L 470 225 L 460 265 L 430 275 L 395 258 Z",
    centroid: [427, 237],
  },
  {
    id: "tinambacan",
    label: "Tinambacan",
    shortLabel: "TIN",
    district: "District I",
    risk: "High",
    activeIncidents: 3,
    population: 18200,
    path: "M 320 175 L 390 170 L 390 210 L 395 258 L 360 268 L 318 250 L 310 215 Z",
    centroid: [355, 216],
  },
  {
    id: "oquendo",
    label: "Oquendo",
    shortLabel: "OQU",
    district: "District II",
    risk: "High",
    activeIncidents: 2,
    population: 15600,
    path: "M 440 195 L 490 180 L 530 200 L 528 240 L 500 260 L 470 265 L 460 265 Z",
    centroid: [490, 225],
  },
  {
    id: "bagacay",
    label: "Bagacay",
    shortLabel: "BAG",
    district: "District II",
    risk: "Critical",
    activeIncidents: 4,
    population: 22100,
    path: "M 390 258 L 430 275 L 460 265 L 500 260 L 495 305 L 450 330 L 400 318 L 375 295 Z",
    centroid: [435, 293],
  },
  {
    id: "mabini",
    label: "Mabini",
    shortLabel: "MAB",
    district: "District III",
    risk: "Medium",
    activeIncidents: 1,
    population: 9800,
    path: "M 318 250 L 360 268 L 375 295 L 350 325 L 308 328 L 288 295 L 295 265 Z",
    centroid: [330, 294],
  },
  {
    id: "san-policarpo",
    label: "San Policarpo",
    shortLabel: "SPC",
    district: "District III",
    risk: "Low",
    activeIncidents: 0,
    population: 7400,
    path: "M 450 330 L 495 305 L 528 330 L 520 370 L 475 380 L 445 365 Z",
    centroid: [486, 348],
  },
  {
    id: "hamorawon",
    label: "Hamorawon",
    shortLabel: "HAM",
    district: "District IV",
    risk: "Low",
    activeIncidents: 0,
    population: 5200,
    path: "M 530 200 L 575 190 L 600 220 L 595 260 L 565 278 L 528 260 L 528 240 Z",
    centroid: [564, 232],
  },
  {
    id: "lonoy",
    label: "Lonoy",
    shortLabel: "LON",
    district: "District IV",
    risk: "Medium",
    activeIncidents: 1,
    population: 11300,
    path: "M 400 318 L 450 330 L 445 365 L 412 385 L 375 370 L 365 340 Z",
    centroid: [408, 352],
  },
  {
    id: "panlayahan",
    label: "Panlayahan",
    shortLabel: "PAN",
    district: "District V",
    risk: "Medium",
    activeIncidents: 1,
    population: 8700,
    path: "M 288 295 L 308 328 L 310 365 L 272 370 L 252 340 L 258 305 Z",
    centroid: [282, 338],
  },
  {
    id: "bayo",
    label: "Bayo",
    shortLabel: "BAY",
    district: "District V",
    risk: "High",
    activeIncidents: 2,
    population: 13400,
    path: "M 310 215 L 318 250 L 295 265 L 258 260 L 242 230 L 262 200 L 300 192 Z",
    centroid: [283, 232],
  },
]

const RISK_FILL: Record<RiskLevel, string> = {
  Critical: "color-mix(in srgb, var(--destructive), transparent 72%)",
  High: "color-mix(in srgb, var(--warning), transparent 78%)",
  Medium: "color-mix(in srgb, var(--chart-2), transparent 82%)",
  Low: "color-mix(in srgb, var(--chart-3), transparent 86%)",
  Minimal: "color-mix(in srgb, var(--muted-foreground), transparent 88%)",
}

const RISK_STROKE: Record<RiskLevel, string> = {
  Critical: "var(--destructive)",
  High: "var(--warning)",
  Medium: "var(--chart-2)",
  Low: "var(--chart-3)",
  Minimal: "var(--muted-foreground)",
}

// Pulsing dot colour
const DOT_COLOR: Record<RiskLevel, string> = {
  Critical: "var(--destructive)",
  High: "var(--warning)",
  Medium: "var(--chart-2)",
  Low: "var(--chart-3)",
  Minimal: "var(--muted-foreground)",
}

interface CityMapProps {
  selectedZone: string | null
  onSelectZone: (id: string | null) => void
  filterRisk: RiskLevel | "All"
}

export function CityMap({
  selectedZone,
  onSelectZone,
  filterRisk,
}: CityMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="bg-card-nested relative h-full min-h-[400px] w-full overflow-hidden rounded-sm border border-border">
      {/* Subtle grid background */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Calbayog City zone map"
        role="img"
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="color-mix(in srgb, var(--foreground), transparent 97.5%)"
              strokeWidth="0.5"
            />
          </pattern>
          {/* Glow filter for active zones */}
          <filter id="zone-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />

        {/* Water body — Samar Sea (stylized) */}
        <path
          d="M 600 0 Q 720 80 760 200 Q 800 320 780 500 L 800 600 L 600 600 Z"
          fill="color-mix(in srgb, var(--chart-2), transparent 94%)"
          stroke="color-mix(in srgb, var(--chart-2), transparent 88%)"
          strokeWidth="1"
        />
        <text
          x="700"
          y="320"
          textAnchor="middle"
          fontSize="10"
          fill="rgba(88,166,233,0.35)"
          fontFamily="monospace"
        >
          SAMAR SEA
        </text>

        {/* All zone base fills (dimmed when filter active) */}
        {ZONES.map((zone) => {
          const isDimmed = filterRisk !== "All" && zone.risk !== filterRisk
          const isSelected = selectedZone === zone.id
          const isHovered = hovered === zone.id

          return (
            <g key={zone.id}>
              <path
                d={zone.path}
                fill={
                  isDimmed ? "rgba(255,255,255,0.02)" : RISK_FILL[zone.risk]
                }
                stroke={
                  isDimmed ? "rgba(255,255,255,0.06)" : RISK_STROKE[zone.risk]
                }
                strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 1}
                opacity={isDimmed ? 0.4 : 1}
                className="cursor-pointer transition-all duration-150"
                style={{
                  filter: isSelected
                    ? `drop-shadow(0 0 6px ${RISK_STROKE[zone.risk]}99)`
                    : undefined,
                }}
                onClick={() => onSelectZone(isSelected ? null : zone.id)}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                role="button"
                aria-label={`${zone.label} — ${zone.risk} risk`}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && onSelectZone(isSelected ? null : zone.id)
                }
              />

              {/* Zone label */}
              {!isDimmed && (
                <text
                  x={zone.centroid[0]}
                  y={zone.centroid[1] - 6}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="monospace"
                  fill={
                    isSelected || isHovered
                      ? "#f0f4f8"
                      : "rgba(200,210,220,0.7)"
                  }
                  className="pointer-events-none transition-colors duration-150 select-none"
                >
                  {zone.shortLabel}
                </text>
              )}

              {/* Incident count dot */}
              {zone.activeIncidents > 0 && !isDimmed && (
                <g
                  transform={`translate(${zone.centroid[0]}, ${zone.centroid[1] + 6})`}
                  className="pointer-events-none"
                >
                  {/* Pulse ring */}
                  <circle r="7" fill={DOT_COLOR[zone.risk]} opacity="0.2">
                    <animate
                      attributeName="r"
                      values="6;10;6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.05;0.2"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="5" fill={DOT_COLOR[zone.risk]} opacity="0.85" />
                  <text
                    y="3.5"
                    textAnchor="middle"
                    fontSize="6.5"
                    fontWeight="700"
                    fontFamily="monospace"
                    fill="#0d1117"
                  >
                    {zone.activeIncidents}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Compass rose */}
        <g transform="translate(740, 50)">
          <circle
            r="18"
            fill="rgba(13,17,23,0.7)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <text
            y="-8"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="rgba(200,210,220,0.8)"
            fontFamily="monospace"
          >
            N
          </text>
          <text
            y="12"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="rgba(200,210,220,0.4)"
            fontFamily="monospace"
          >
            S
          </text>
          <text
            x="10"
            y="3"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="rgba(200,210,220,0.4)"
            fontFamily="monospace"
          >
            E
          </text>
          <text
            x="-10"
            y="3"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="rgba(200,210,220,0.4)"
            fontFamily="monospace"
          >
            W
          </text>
          <polygon
            points="0,-13 2.5,-4 0,-7 -2.5,-4"
            fill="#58a6e9"
            opacity="0.9"
          />
          <polygon
            points="0,13 2.5,4 0,7 -2.5,4"
            fill="rgba(200,210,220,0.25)"
          />
        </g>

        {/* Scale bar */}
        <g transform="translate(40, 560)">
          <line
            x1="0"
            y1="0"
            x2="60"
            y2="0"
            stroke="rgba(200,210,220,0.3)"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="-4"
            x2="0"
            y2="4"
            stroke="rgba(200,210,220,0.3)"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="-4"
            x2="60"
            y2="4"
            stroke="rgba(200,210,220,0.3)"
            strokeWidth="1"
          />
          <text
            x="30"
            y="-6"
            textAnchor="middle"
            fontSize="7.5"
            fill="rgba(200,210,220,0.4)"
            fontFamily="monospace"
          >
            5 km
          </text>
        </g>

        {/* Tooltip on hover */}
        {hovered &&
          (() => {
            const z = ZONES.find((z) => z.id === hovered)!
            const [cx, cy] = z.centroid
            const tipX = cx + 16
            const tipY = cy - 36
            return (
              <g
                className="pointer-events-none"
                transform={`translate(${tipX}, ${tipY})`}
              >
                <rect
                  x="-4"
                  y="-4"
                  width="118"
                  height="46"
                  rx="3"
                  fill="rgba(13,17,23,0.92)"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="0.8"
                />
                <text
                  x="4"
                  y="9"
                  fontSize="9"
                  fontWeight="700"
                  fill="#f0f4f8"
                  fontFamily="monospace"
                >
                  {z.label}
                </text>
                <text
                  x="4"
                  y="20"
                  fontSize="7.5"
                  fill="rgba(180,195,210,0.7)"
                  fontFamily="monospace"
                >
                  {z.district}
                </text>
                <text
                  x="4"
                  y="30"
                  fontSize="7.5"
                  fill={RISK_STROKE[z.risk]}
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {z.risk} Risk · {z.activeIncidents} active
                </text>
              </g>
            )
          })()}
      </svg>
    </div>
  )
}
