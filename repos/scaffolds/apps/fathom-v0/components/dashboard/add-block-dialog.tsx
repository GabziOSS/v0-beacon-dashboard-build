'use client'

import { useState } from 'react'
import { useSetAtom } from 'jotai'
import {
  LineChart,
  AreaChart,
  BarChart3,
  PieChart,
  Radar,
  ScatterChart,
  Activity,
  Gauge,
  Wind,
  Compass,
  Grid3X3,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { addBlockAtom } from '@/lib/atoms/dashboard'
import type { ChartType } from '@/lib/types/dashboard'

interface AddBlockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const chartTypes: { type: ChartType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { type: 'area', label: 'Area Chart', icon: AreaChart, description: 'Visualize cumulative data' },
  { type: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
  { type: 'stacked-bar', label: 'Stacked Bar', icon: BarChart3, description: 'Compare parts of a whole' },
  { type: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
  { type: 'donut', label: 'Donut Chart', icon: PieChart, description: 'Proportions with center space' },
  { type: 'radar', label: 'Radar Chart', icon: Radar, description: 'Compare multiple variables' },
  { type: 'scatter', label: 'Scatter Plot', icon: ScatterChart, description: 'Show correlations' },
  { type: 'gauge-arc', label: 'Gauge (Arc)', icon: Gauge, description: 'Show progress or score' },
  { type: 'gauge-radial', label: 'Gauge (Radial)', icon: Activity, description: 'Circular gauge display' },
  { type: 'gauge-linear', label: 'Gauge (Linear)', icon: Activity, description: 'Linear progress gauge' },
  { type: 'wind-rose', label: 'Wind Rose', icon: Wind, description: 'Directional data display' },
  { type: 'compass', label: 'Compass', icon: Compass, description: 'Show direction or heading' },
  { type: 'timeline-heatmap', label: 'Timeline Heatmap', icon: Grid3X3, description: 'Activity patterns over time' },
  { type: 'treemap', label: 'Treemap', icon: Grid3X3, description: 'Hierarchical data' },
  { type: 'funnel', label: 'Funnel', icon: Activity, description: 'Show conversion stages' },
]

export function AddBlockDialog({ open, onOpenChange }: AddBlockDialogProps) {
  const addBlock = useSetAtom(addBlockAtom)
  const [title, setTitle] = useState('')
  const [selectedType, setSelectedType] = useState<ChartType>('line')

  const handleAdd = () => {
    if (!title.trim()) return

    addBlock({
      title: title.trim(),
      chartType: selectedType,
      position: { col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      dataKey: `custom-${Date.now()}`,
      config: { showLegend: true, animate: true },
    })

    setTitle('')
    setSelectedType('line')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Chart Block</DialogTitle>
          <DialogDescription>
            Choose a chart type and give it a title to add to your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chart Title</Label>
            <Input
              id="title"
              placeholder="Enter chart title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Chart Type</Label>
            <ScrollArea className="h-64 rounded-lg border">
              <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-4">
                {chartTypes.map((chart) => {
                  const Icon = chart.icon
                  return (
                    <button
                      key={chart.type}
                      type="button"
                      onClick={() => setSelectedType(chart.type)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors hover:bg-accent',
                        selectedType === chart.type && 'border-primary bg-primary/10'
                      )}
                    >
                      <Icon className={cn(
                        'h-8 w-8',
                        selectedType === chart.type ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <span className="text-xs font-medium">{chart.label}</span>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!title.trim()}>
            Add Chart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
