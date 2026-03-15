'use client'

import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { 
  MoreHorizontal, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Trash2,
  Copy,
  GripVertical,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { removeBlockAtom } from '@/lib/atoms/dashboard'
import type { ChartBlock as ChartBlockType } from '@/lib/types/dashboard'
import { DemoChart } from './demo-chart'

interface ChartBlockProps {
  block: ChartBlockType
  editMode?: boolean
  isSelected?: boolean
  isDragging?: boolean
}

export function ChartBlock({ block, editMode = false, isSelected = false, isDragging = false }: ChartBlockProps) {
  const [isMinimized, setIsMinimized] = useState(block.isMinimized ?? false)
  const removeBlock = useSetAtom(removeBlockAtom)

  return (
    <Card 
      className={cn(
        'flex h-full flex-col overflow-hidden transition-all',
        isMinimized && 'h-auto',
        editMode && 'cursor-grab',
        isDragging && 'opacity-50 shadow-2xl ring-2 ring-primary',
        isSelected && 'ring-2 ring-primary',
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {editMode && (
            <div className="flex items-center">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {isSelected && (
                <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          )}
          <CardTitle className="text-sm font-medium">{block.title}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(!isMinimized)
            }}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => removeBlock(block.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="flex-1 pb-4">
          <DemoChart chartType={block.chartType} dataKey={block.dataKey} />
        </CardContent>
      )}
    </Card>
  )
}
