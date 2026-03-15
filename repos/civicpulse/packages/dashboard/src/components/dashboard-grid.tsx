'use client'

import { useState, useEffect, useReducer } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button } from '@beacon/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@beacon/ui'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import {
  ChartBlock,
  type ColSpan,
  type RowSpan,
  type ChartBlock as ChartBlockType,
} from './chart-block'
import { StatCard } from '@beacon/chart-kit'
import { IncidentTrendChart } from '@beacon/chart-kit'
import { GaugeArc } from '@beacon/weather-charts'
import { WindRoseChart } from '@beacon/weather-charts'
import { CategoryBarChart } from '@beacon/chart-kit'
import { DistrictRadarChart } from '@beacon/chart-kit'
import { ResponseTimeChart } from '@beacon/chart-kit'
import { TimelineHeatmap } from '@beacon/weather-charts'
import { ResolutionRadialChart } from '@beacon/chart-kit'
import { IncidentsVsDeployedChart } from '@beacon/chart-kit'
import { CompassChart } from '@beacon/weather-charts'
import { CalendarHeatmap } from '@beacon/weather-charts'
import { DensityScatterChart } from '@beacon/chart-kit'
import { BulletChart } from '@beacon/chart-kit'
import { SparkBarChart } from '@beacon/chart-kit'
// Weather station charts
import { LocalForecast } from '@beacon/weather-charts'
import { SunriseSunset } from '@beacon/weather-charts'
import { MoonPhase } from '@beacon/weather-charts'
import { TempHumidityBar } from '@beacon/weather-charts'
import { MultiTempBar } from '@beacon/weather-charts'
import { RainBar } from '@beacon/weather-charts'
import { BarometerChart } from '@beacon/weather-charts'
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
  // Weather station hooks
  useLocalForecast,
  useSunriseSunset,
  useMoonPhase,
  useInsideTempHum,
  useMultiTemp,
  useTotalRain,
  useCurrentRain,
  useWindSpeed,
  useHumidity,
  useTHWIndex,
  useBarometer,
} from '@civicpulse/hooks'
import { PRESETS, type PresetId, getStoredPreset, savePreset } from '@/lib/presets'
import { cn } from '@beacon/ui'

type BlocksAction =
  | { type: 'SET_BLOCKS'; blocks: ChartBlockType[] }
  | { type: 'REORDER'; oldIndex: number; newIndex: number }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_COL_SPAN'; id: string; span: ColSpan }
  | { type: 'SET_ROW_SPAN'; id: string; span: RowSpan }
  | { type: 'ADD'; block: ChartBlockType }
  | { type: 'ADD_BULK'; blocks: ChartBlockType[] }
  | { type: 'REMOVE_ALL' }

function blocksReducer(blocks: ChartBlockType[], action: BlocksAction): ChartBlockType[] {
  switch (action.type) {
    case 'SET_BLOCKS':
      return action.blocks
    case 'REORDER':
      return arrayMove(blocks, action.oldIndex, action.newIndex)
    case 'REMOVE':
      return blocks.filter(b => b.id !== action.id)
    case 'SET_COL_SPAN':
      return blocks.map(b => (b.id === action.id ? { ...b, colSpan: action.span } : b))
    case 'SET_ROW_SPAN':
      return blocks.map(b => (b.id === action.id ? { ...b, rowSpan: action.span } : b))
    case 'ADD':
      return [...blocks, action.block]
    case 'ADD_BULK':
      return [...blocks, ...action.blocks]
    case 'REMOVE_ALL':
      return []
    default:
      return blocks
  }
}

interface DashboardGridProps {
  initialPreset?: PresetId
}

export function DashboardGrid({ initialPreset = 'overview' }: DashboardGridProps) {
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
        dispatch({ type: 'SET_BLOCKS', blocks: JSON.parse(stored) })
      } catch {
        dispatch({ type: 'SET_BLOCKS', blocks: preset.blocks })
      }
    } else {
      dispatch({ type: 'SET_BLOCKS', blocks: preset.blocks })
    }
  }, [initialPreset])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

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
  // Weather station data
  const { data: forecastData } = useLocalForecast()
  const { data: sunriseSunsetData } = useSunriseSunset()
  const { data: moonPhaseData } = useMoonPhase()
  const { data: insideTempHumData } = useInsideTempHum()
  const { data: multiTempData } = useMultiTemp()
  const { data: totalRainData } = useTotalRain()
  const { data: currentRainData } = useCurrentRain()
  const { data: windSpeedData } = useWindSpeed()
  const { data: humidityData } = useHumidity()
  const { data: thwIndexData } = useTHWIndex()
  const { data: barometerData } = useBarometer()

  function handleDragEnd(event: {
    active: { id: string | number }
    over: { id: string | number } | null
  }) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    const from = blocks.findIndex(b => b.id === active.id)
    const to = blocks.findIndex(b => b.id === over.id)
    dispatch({ type: 'REORDER', oldIndex: from, newIndex: to })
  }

  function handleColSpanChange(id: string, span: ColSpan) {
    dispatch({ type: 'SET_COL_SPAN', id, span })
  }

  function handleRowSpanChange(id: string, span: RowSpan) {
    dispatch({ type: 'SET_ROW_SPAN', id, span })
  }

  function handleRemove(id: string) {
    dispatch({ type: 'REMOVE', id })
  }

  function handleAdd(block: ChartBlockType) {
    dispatch({ type: 'ADD', block })
  }

  function handleAddBulk(newBlocks: ChartBlockType[]) {
    dispatch({ type: 'ADD_BULK', blocks: newBlocks })
  }

  function handleRemoveAll() {
    dispatch({ type: 'REMOVE_ALL' })
  }

  function renderContent(block: any) {
    const { id, type, colSpan } = block
    // Match by ID first for specific blocks
    switch (id) {
      case 'stat-1':
        return <StatCard data={statCards[0]} />
      case 'stat-2':
        return <StatCard data={statCards[1]} />
      case 'stat-3':
        return <StatCard data={statCards[2]} />
      case 'stat-4':
        return <StatCard data={statCards[3]} />
      case 'w-rain':
        return <RainBar data={currentRainData} />
      case 'w-total-rain':
        return <RainBar data={totalRainData} />
      case 'w-sunrise':
        return <SunriseSunset data={sunriseSunsetData} forceLayout={colSpan >= 2 ? 'side' : 'vertical'} />
      case 'w-moon':
        return <MoonPhase data={moonPhaseData} />
      case 'w-forecast':
        return <LocalForecast data={forecastData} />
      case 'trend':
        return <IncidentTrendChart data={trendData} />
      case 'risk':
        return <GaugeArc value={riskScore.value} label={riskScore.label} />
      case 'rose':
        return <WindRoseChart data={windData} />
      case 'w-rose':
        return <WindRoseChart data={windData} />
      case 'w-wind':
        return <GaugeArc value={windSpeedData.value} label={windSpeedData.unit} />
      case 'w-thw':
        return <GaugeArc value={thwIndexData.value} label={thwIndexData.unit} />
      case 'cat':
        return <CategoryBarChart data={catData} />
      case 'radar':
        return <DistrictRadarChart data={radarData} />
      case 'area':
        return <ResponseTimeChart data={responseTime} />
      case 'ready':
        return <GaugeArc value={readiness.value} label={readiness.label} />
      case 'heat':
        return <TimelineHeatmap data={heatmapData} />
      case 'resol':
        return <ResolutionRadialChart value={resolution.value} />
      case 'comp':
        return <IncidentsVsDeployedChart data={composedData} />
      case 'comp2':
        return <CompassChart bearing={riskVector.bearing} label={riskVector.label} />
      case 'w-compass':
        return <CompassChart bearing={135} label="SE" />
      case 'w-baro':
        return <BarometerChart data={barometerData} />
      case 'w-temp-gauge':
        return <TempHumidityBar data={insideTempHumData} />
      case 'w-temp-trend':
        return <MultiTempBar data={multiTempData} />
      case 'w-humidity':
        return <GaugeArc value={humidityData.value} label="%" />
      case 'cal':
        return <CalendarHeatmap data={calData} />
      case 'w-calendar':
        return <CalendarHeatmap data={calData} />
      case 'w-rain-bullet':
        return <BulletChart data={bulletData} />
      case 'scatter':
        return <DensityScatterChart data={scatterData} />
      case 'bullet':
        return <BulletChart data={bulletData} />
      case 'spark':
        return <SparkBarChart data={sparkData} />
    }
    // Fallback by type for category dashboards — use id hash for deterministic values
    const idHash = id.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
    switch (type) {
      case 'stat':
        return <StatCard data={statCards[idHash % 4]} />
      case 'line':
        return <IncidentTrendChart data={trendData} />
      case 'gauge':
        return <GaugeArc value={50 + (idHash % 40)} label="%" />
      case 'windrose':
        return <WindRoseChart data={windData} />
      case 'bar':
        return <CategoryBarChart data={catData} />
      case 'radar':
        return <DistrictRadarChart data={radarData} />
      case 'area':
        return <ResponseTimeChart data={responseTime} />
      case 'heatmap':
        return <TimelineHeatmap data={heatmapData} />
      case 'radial':
        return <ResolutionRadialChart value={resolution.value} />
      case 'composed':
        return <IncidentsVsDeployedChart data={composedData} />
      case 'compass':
        return <CompassChart bearing={riskVector.bearing} label={riskVector.label} />
      case 'calendar':
        return <CalendarHeatmap data={calData} />
      case 'scatter':
        return <DensityScatterChart data={scatterData} />
      case 'bullet':
        return <BulletChart data={bulletData} />
      case 'spark':
        return <SparkBarChart data={sparkData} />
      default:
        return null
    }
  }

  const activeBlock = blocks.find(b => b.id === activeId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground/80">
            {PRESETS[initialPreset]?.label || 'Dashboard'}
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground/60">
            {blocks.length} active monitors
          </p>
        </div>

        <div className="flex items-center gap-2">
          {blocks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAll}
              className="h-8 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary hover:text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider gap-2 px-3 transition-all hover:shadow-glow"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Component
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">
                Toggle Components
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-auto py-1">
                {(() => {
                  const currentPreset = PRESETS[initialPreset]
                  if (!currentPreset) return null

                  return currentPreset.blocks.map(presetBlock => {
                    const isActive = blocks.some(b => b.id === presetBlock.id)
                    return (
                      <DropdownMenuItem
                        key={presetBlock.id}
                        onSelect={(e) => {
                          e.preventDefault()
                          if (isActive) {
                            handleRemove(presetBlock.id)
                          } else {
                            handleAdd(presetBlock)
                          }
                        }}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer focus:bg-primary/10"
                      >
                        <div className={cn(
                          "w-3.5 h-3.5 rounded-sm border border-primary/40 flex items-center justify-center transition-colors",
                          isActive ? "bg-primary border-primary" : "bg-transparent"
                        )}>
                          {isActive && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-bold font-mono text-foreground leading-tight">{presetBlock.title}</span>
                          <span className="text-[9px] font-mono text-muted-foreground leading-tight uppercase tracking-tighter">{presetBlock.subtitle}</span>
                        </div>
                      </DropdownMenuItem>
                    )
                  })
                })()}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={e => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12 auto-rows-fr"
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
                {renderContent(block)}
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
    </div>
  )
}
