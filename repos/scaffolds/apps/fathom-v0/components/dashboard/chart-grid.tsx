'use client'

import { useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, LayoutGrid, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blocksAtom, editModeAtom, activeBlockIdAtom, selectedBlockIdsAtom, mergeBlocksAtom } from '@/lib/atoms/dashboard'
import { ChartBlock } from './chart-block'
import { SortableChartBlock } from './sortable-chart-block'
import { AddBlockDialog } from './add-block-dialog'
import type { ChartBlock as ChartBlockType } from '@/lib/types/dashboard'

export function ChartGrid() {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [editMode, setEditMode] = useAtom(editModeAtom)
  const [activeId, setActiveId] = useAtom(activeBlockIdAtom)
  const selectedIds = useAtomValue(selectedBlockIdsAtom)
  const mergeBlocks = useSetAtom(mergeBlocksAtom)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = [...blocks]
        const [removed] = newBlocks.splice(oldIndex, 1)
        newBlocks.splice(newIndex, 0, removed)
        setBlocks(newBlocks)
      }
    }
  }

  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : null

  return (
    <div className="space-y-4">
      {/* Grid toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="gap-2"
          >
            {editMode ? (
              <>
                <Unlock className="h-4 w-4" />
                Editing
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Locked
              </>
            )}
          </Button>
          {editMode && selectedIds.length >= 2 && (
            <Button variant="outline" size="sm" onClick={() => mergeBlocks()} className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Merge Selected ({selectedIds.length})
            </Button>
          )}
        </div>
        {editMode && (
          <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Chart
          </Button>
        )}
      </div>

      {/* Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={rectSortingStrategy}>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: 'minmax(280px, auto)',
            }}
          >
            {blocks.map((block) => (
              <SortableChartBlock
                key={block.id}
                block={block}
                editMode={editMode}
                isSelected={selectedIds.includes(block.id)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeBlock && <ChartBlock block={activeBlock} isDragging />}
        </DragOverlay>
      </DndContext>

      <AddBlockDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
