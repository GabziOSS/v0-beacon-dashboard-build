"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { ChartBlock } from "./chart-block"
import type { ColSpan } from "./chart-block"
import { StatCard } from "@/components/charts/stat-card"
import { IncidentTrendChart } from "@/components/charts/line-chart"
import { GaugeArc } from "@/components/charts/gauge-arc"
import { WindRoseChart } from "@/components/charts/wind-rose"
import { CategoryBarChart } from "@/components/charts/bar-chart"
import { DistrictRadarChart } from "@/components/charts/radar-chart"
import { ResponseTimeChart } from "@/components/charts/area-chart"
import { TimelineHeatmap } from "@/components/charts/timeline-heatmap"
import { ResolutionRadialChart } from "@/components/charts/radial-chart"
import { IncidentsVsDeployedChart } from "@/components/charts/composed-chart"
import { CompassChart } from "@/components/charts/compass"
import { CalendarHeatmap } from "@/components/charts/calendar-heatmap"
import { DensityScatterChart } from "@/components/charts/scatter-chart"
import { BulletChart } from "@/components/charts/bullet-chart"
import { SparkBarChart } from "@/components/charts/spark-bar"
import {
  useStatCards,
  useIncidentTrend,
  useCategoryBar,
  useDistrictRadar,
  useCityRiskScore,
  useReadinessScore,
  useResponseTime,
  useResolutionRate,
  useComposedData,
  useScatterData,
  useTimelineHeatmap,
  useCalendarHeatmap,
  useWindRose,
  useRiskVector,
  useBulletData,
  useSparkBar,
} from "@/lib/hooks"

interface BlockDef {
  id: string
  title: string
  subtitle?: string
  colSpan: ColSpan
}

const INITIAL_BLOCKS: BlockDef[] = [
  { id: "stat-1", title: "Total Incidents",  subtitle: "All zones · 30d",  colSpan: 1 },
  { id: "stat-2", title: "Active Alerts",    subtitle: "Right now",        colSpan: 1 },
  { id: "stat-3", title: "High-Risk Zones",  subtitle: "Risk level ≥ 70",  colSpan: 1 },
  { id: "stat-4", title: "Avg Response",     subtitle: "All responders",   colSpan: 1 },
  { id: "trend",  title: "Incident Trend",   subtitle: "By type · 24h",    colSpan: 2 },
  { id: "risk",   title: "City Risk Score",  subtitle: "Composite index",  colSpan: 1 },
  { id: "rose",   title: "Incident Origin",  subtitle: "8-direction grid", colSpan: 1 },
  { id: "cat",    title: "By Category",      subtitle: "Last 30 days",     colSpan: 1 },
  { id: "radar",  title: "District Risk",    subtitle: "5 dimensions",     colSpan: 1 },
  { id: "area",   title: "Response Time",    subtitle: "Avg & P90 · 14d",  colSpan: 2 },
  { id: "ready",  title: "Readiness",        subtitle: "Operational score", colSpan: 1 },
  { id: "heat",   title: "Heat Matrix",      subtitle: "Incidents by type × day", colSpan: 2 },
  { id: "resol",  title: "Resolution Rate",  subtitle: "Last 30 days",     colSpan: 1 },
  { id: "comp",   title: "Incidents vs Deployed", subtitle: "Monthly 2025", colSpan: 2 },
  { id: "comp2",  title: "Risk Vector",      subtitle: "Primary threat bearing", colSpan: 1 },
  { id: "cal",    title: "Annual Volume",    subtitle: "2025 · calendar view", colSpan: 3 },
  { id: "scatter",title: "Density vs Population", subtitle: "Per zone",    colSpan: 1 },
  { id: "bullet", title: "Response vs SLA",  subtitle: "10-min target",    colSpan: 1 },
  { id: "spark",  title: "Severity Snapshot",subtitle: "Current distribution", colSpan: 1 },
]

export function DashboardGrid() {
  const [blocks, setBlocks] = useState<BlockDef[]>(INITIAL_BLOCKS)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const { data: statCards } = useStatCards()
  const { data: trendData } = useIncidentTrend()
  const { data: catData } = useCategoryBar()
  const { data: radarData } = useDistrictRadar()
  const { data: riskScore } = useCityRiskScore()
  const { data: readiness } = useReadinessScore()
  const { data: responseTime } = useResponseTime()
  const { data: resolution } = useResolutionRate()
  const { data: composedData } = useComposedData()
  const { data: scatterData } = useScatterData()
  const { data: heatmapData } = useTimelineHeatmap()
  const { data: calData } = useCalendarHeatmap()
  const { data: windData } = useWindRose()
  const { data: riskVector } = useRiskVector()
  const { data: bulletData } = useBulletData()
  const { data: sparkData } = useSparkBar()

  function handleDragEnd(event: { active: { id: string | number }; over: { id: string | number } | null }) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    setBlocks(prev => {
      const from = prev.findIndex(b => b.id === active.id)
      const to = prev.findIndex(b => b.id === over.id)
      return arrayMove(prev, from, to)
    })
  }

  function handleColSpanChange(id: string, span: ColSpan) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, colSpan: span } : b))
  }

  function handleRemove(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  function renderContent(id: string) {
    switch (id) {
      case "stat-1": return <StatCard data={statCards[0]} />
      case "stat-2": return <StatCard data={statCards[1]} />
      case "stat-3": return <StatCard data={statCards[2]} />
      case "stat-4": return <StatCard data={statCards[3]} />
      case "trend":  return <IncidentTrendChart data={trendData} />
      case "risk":   return <GaugeArc value={riskScore.value} label={riskScore.label} />
      case "rose":   return <WindRoseChart data={windData} />
      case "cat":    return <CategoryBarChart data={catData} />
      case "radar":  return <DistrictRadarChart data={radarData} />
      case "area":   return <ResponseTimeChart data={responseTime} />
      case "ready":  return <GaugeArc value={readiness.value} label={readiness.label} />
      case "heat":   return <TimelineHeatmap data={heatmapData} />
      case "resol":  return <ResolutionRadialChart value={resolution.value} />
      case "comp":   return <IncidentsVsDeployedChart data={composedData} />
      case "comp2":  return <CompassChart bearing={riskVector.bearing} label={riskVector.label} />
      case "cal":    return <CalendarHeatmap data={calData} />
      case "scatter":return <DensityScatterChart data={scatterData} />
      case "bullet": return <BulletChart data={bulletData} />
      case "spark":  return <SparkBarChart data={sparkData} />
      default:       return null
    }
  }

  const activeBlock = blocks.find(b => b.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={e => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "minmax(220px, auto)" }}
        >
          {blocks.map(block => (
            <ChartBlock
              key={block.id}
              id={block.id}
              title={block.title}
              subtitle={block.subtitle}
              colSpan={block.colSpan}
              onColSpanChange={handleColSpanChange}
              onRemove={handleRemove}
            >
              {renderContent(block.id)}
            </ChartBlock>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeBlock ? (
          <div
            className="bg-card border border-primary/40 rounded-sm shadow-xl ring-1 ring-primary/30 opacity-90"
            style={{ gridColumn: `span ${activeBlock.colSpan}`, minHeight: 220 }}
          >
            <div className="p-3 border-b border-border">
              <p className="text-xs font-semibold text-foreground">{activeBlock.title}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
