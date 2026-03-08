"use client"

import { useState, useEffect, useReducer } from "react"
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
import { ChartBlock, type ColSpan, type RowSpan, type ChartBlock as ChartBlockType } from "./chart-block"
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
import { PRESETS, type PresetId, getStoredPreset, savePreset } from "@/lib/presets"

type BlocksAction =
  | { type: "SET_BLOCKS"; blocks: ChartBlockType[] }
  | { type: "REORDER"; oldIndex: number; newIndex: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_COL_SPAN"; id: string; span: ColSpan }
  | { type: "SET_ROW_SPAN"; id: string; span: RowSpan }

function blocksReducer(blocks: ChartBlockType[], action: BlocksAction): ChartBlockType[] {
  switch (action.type) {
    case "SET_BLOCKS":
      return action.blocks
    case "REORDER":
      return arrayMove(blocks, action.oldIndex, action.newIndex)
    case "REMOVE":
      return blocks.filter((b) => b.id !== action.id)
    case "SET_COL_SPAN":
      return blocks.map((b) => (b.id === action.id ? { ...b, colSpan: action.span } : b))
    case "SET_ROW_SPAN":
      return blocks.map((b) => (b.id === action.id ? { ...b, rowSpan: action.span } : b))
    default:
      return blocks
  }
}

interface DashboardGridProps {
  initialPreset?: PresetId
}

export function DashboardGrid({ initialPreset = "overview" }: DashboardGridProps) {
  const [blocks, dispatch] = useReducer(blocksReducer, [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const preset = PRESETS[initialPreset] || PRESETS.overview
    const storageKey = `beacon_blocks_${preset.id}`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        dispatch({ type: "SET_BLOCKS", blocks: JSON.parse(stored) })
      } catch {
        dispatch({ type: "SET_BLOCKS", blocks: preset.blocks })
      }
    } else {
      dispatch({ type: "SET_BLOCKS", blocks: preset.blocks })
    }
  }, [initialPreset])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    if (!mounted) return
    const preset = PRESETS[initialPreset]
    const storageKey = `beacon_blocks_${preset.id}`
    localStorage.setItem(storageKey, JSON.stringify(blocks))
  }, [blocks, initialPreset, mounted])

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
    const from = blocks.findIndex(b => b.id === active.id)
    const to = blocks.findIndex(b => b.id === over.id)
    dispatch({ type: "REORDER", oldIndex: from, newIndex: to })
  }

  function handleColSpanChange(id: string, span: ColSpan) {
    dispatch({ type: "SET_COL_SPAN", id, span })
  }

  function handleRowSpanChange(id: string, span: RowSpan) {
    dispatch({ type: "SET_ROW_SPAN", id, span })
  }

  function handleRemove(id: string) {
    dispatch({ type: "REMOVE", id })
  }

  function renderContent(id: string, type?: string) {
    // Match by ID first for specific blocks
    switch (id) {
      case "stat-1": return <StatCard data={statCards[0]} />
      case "stat-2": return <StatCard data={statCards[1]} />
      case "stat-3": return <StatCard data={statCards[2]} />
      case "stat-4": return <StatCard data={statCards[3]} />
      case "w-rain": return <StatCard data={statCards[0]} />
      case "w-sunrise": return <StatCard data={statCards[1]} />
      case "w-moon": return <StatCard data={statCards[2]} />
      case "w-forecast": return <StatCard data={statCards[3]} />
      case "trend":  return <IncidentTrendChart data={trendData} />
      case "risk":   return <GaugeArc value={riskScore.value} label={riskScore.label} />
      case "rose":   return <WindRoseChart data={windData} />
      case "w-rose": return <WindRoseChart data={windData} />
      case "w-wind": return <GaugeArc value={riskScore.value} label="km/h" />
      case "w-thw":  return <GaugeArc value={65} label="°C" />
      case "cat":    return <CategoryBarChart data={catData} />
      case "radar":  return <DistrictRadarChart data={radarData} />
      case "area":   return <ResponseTimeChart data={responseTime} />
      case "ready":  return <GaugeArc value={readiness.value} label={readiness.label} />
      case "heat":   return <TimelineHeatmap data={heatmapData} />
      case "resol":  return <ResolutionRadialChart value={resolution.value} />
      case "comp":   return <IncidentsVsDeployedChart data={composedData} />
      case "comp2":  return <CompassChart bearing={riskVector.bearing} label={riskVector.label} />
      case "w-compass": return <CompassChart bearing={135} label="SE" />
      case "w-baro": return <IncidentTrendChart data={trendData} />
      case "w-temp-gauge": return <CategoryBarChart data={catData} />
      case "w-temp-trend": return <ResponseTimeChart data={responseTime} />
      case "w-humidity": return <GaugeArc value={88} label="%" />
      case "cal":    return <CalendarHeatmap data={calData} />
      case "w-calendar": return <CalendarHeatmap data={calData} />
      case "w-rain-bullet": return <BulletChart data={bulletData} />
      case "scatter":return <DensityScatterChart data={scatterData} />
      case "bullet": return <BulletChart data={bulletData} />
      case "spark":  return <SparkBarChart data={sparkData} />
    }
    // Fallback by type for category dashboards
    switch (type) {
      case "stat":     return <StatCard data={statCards[Math.floor(Math.random() * 4)]} />
      case "line":     return <IncidentTrendChart data={trendData} />
      case "gauge":    return <GaugeArc value={Math.floor(Math.random() * 40) + 50} label="%" />
      case "windrose": return <WindRoseChart data={windData} />
      case "bar":      return <CategoryBarChart data={catData} />
      case "radar":    return <DistrictRadarChart data={radarData} />
      case "area":     return <ResponseTimeChart data={responseTime} />
      case "heatmap":  return <TimelineHeatmap data={heatmapData} />
      case "radial":   return <ResolutionRadialChart value={resolution.value} />
      case "composed": return <IncidentsVsDeployedChart data={composedData} />
      case "compass":  return <CompassChart bearing={riskVector.bearing} label={riskVector.label} />
      case "calendar": return <CalendarHeatmap data={calData} />
      case "scatter":  return <DensityScatterChart data={scatterData} />
      case "bullet":   return <BulletChart data={bulletData} />
      case "spark":    return <SparkBarChart data={sparkData} />
      default:         return null
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
              rowSpan={block.rowSpan}
              onColSpanChange={handleColSpanChange}
              onRowSpanChange={handleRowSpanChange}
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
