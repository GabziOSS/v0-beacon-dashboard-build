"use client"

import { useState } from "react"
import { TileTabBar } from "@/components/primitives/tile-tab-bar"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"

const TABS = [
  { id: "day",   label: "Day"   },
  { id: "week",  label: "Week"  },
  { id: "month", label: "Month" },
]

const DATA_BY_TAB = {
  day: [
    { dir: "N",  speed: 8 }, { dir: "NE", speed: 14 }, { dir: "E",  speed: 6 },
    { dir: "SE", speed: 22 }, { dir: "S", speed: 18 }, { dir: "SW", speed: 10 },
    { dir: "W",  speed: 4 }, { dir: "NW", speed: 12 },
  ],
  week: [
    { dir: "N",  speed: 12 }, { dir: "NE", speed: 20 }, { dir: "E",  speed: 9 },
    { dir: "SE", speed: 35 }, { dir: "S", speed: 28 }, { dir: "SW", speed: 16 },
    { dir: "W",  speed: 7 }, { dir: "NW", speed: 18 },
  ],
  month: [
    { dir: "N",  speed: 20 }, { dir: "NE", speed: 38 }, { dir: "E",  speed: 15 },
    { dir: "SE", speed: 48 }, { dir: "S", speed: 42 }, { dir: "SW", speed: 25 },
    { dir: "W",  speed: 12 }, { dir: "NW", speed: 30 },
  ],
}

export function WindRoseTileContent() {
  const [tab, setTab] = useState<"day" | "week" | "month">("day")
  const data = DATA_BY_TAB[tab]

  return (
    <div className="flex h-full flex-col gap-1 p-3 pt-1">
      <div className="flex justify-center">
        <TileTabBar tabs={TABS} activeTab={tab} onTabChange={(id) => setTab(id as "day" | "week" | "month")} />
      </div>
      <figure aria-label={`Wind rose chart — ${tab} view`} className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="dir"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <Radar
              dataKey="speed"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
        <figcaption className="sr-only">Wind direction frequency for the selected period</figcaption>
      </figure>
    </div>
  )
}
