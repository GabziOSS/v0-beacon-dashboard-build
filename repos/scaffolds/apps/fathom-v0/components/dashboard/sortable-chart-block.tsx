'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAtom } from 'jotai'
import { selectedBlockIdsAtom } from '@/lib/atoms/dashboard'
import { ChartBlock } from './chart-block'
import type { ChartBlock as ChartBlockType } from '@/lib/types/dashboard'

interface SortableChartBlockProps {
  block: ChartBlockType
  editMode: boolean
  isSelected: boolean
}

export function SortableChartBlock({ block, editMode, isSelected }: SortableChartBlockProps) {
  const [selectedIds, setSelectedIds] = useAtom(selectedBlockIdsAtom)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: !editMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${block.position.colSpan}`,
    gridRow: `span ${block.position.rowSpan}`,
  }

  const handleSelect = (e: React.MouseEvent) => {
    if (!editMode) return
    
    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      if (selectedIds.includes(block.id)) {
        setSelectedIds(selectedIds.filter((id) => id !== block.id))
      } else {
        setSelectedIds([...selectedIds, block.id])
      }
    } else {
      // Single select
      setSelectedIds([block.id])
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
      {...(editMode ? { ...attributes, ...listeners } : {})}
    >
      <ChartBlock
        block={block}
        editMode={editMode}
        isSelected={isSelected}
        isDragging={isDragging}
      />
    </div>
  )
}
