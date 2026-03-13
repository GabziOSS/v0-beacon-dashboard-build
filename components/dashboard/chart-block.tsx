'use client'

import { useState, useRef, useEffect } from 'react'
import { GripVertical, MoreHorizontal, Expand, Maximize2, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createPortal } from 'react-dom'

export type ColSpan = 1 | 2 | 3
export type RowSpan = 1 | 2

export interface ChartBlock {
  id: string
  title: string
  subtitle?: string
  colSpan: ColSpan
  rowSpan?: RowSpan
  type: string
}

interface ChartBlockProps {
  id: string
  title: string
  subtitle?: string
  colSpan: ColSpan
  rowSpan?: RowSpan
  onColSpanChange: (id: string, span: ColSpan) => void
  onRowSpanChange?: (id: string, span: RowSpan) => void
  onRemove: (id: string) => void
  children: React.ReactNode
  isDragging?: boolean
  readOnly?: boolean
}

type SizeState = { col: ColSpan; row: RowSpan }
const SIZE_CYCLE: SizeState[] = [
  { col: 1, row: 1 },
  { col: 2, row: 1 },
  { col: 3, row: 1 },
  { col: 2, row: 2 },
  { col: 3, row: 2 },
]

function findNextSize(col: ColSpan, row: RowSpan): SizeState {
  const idx = SIZE_CYCLE.findIndex(s => s.col === col && s.row === row)
  return SIZE_CYCLE[(idx + 1) % SIZE_CYCLE.length]
}

export function ChartBlock({
  id,
  title,
  subtitle,
  colSpan,
  rowSpan = 1,
  onColSpanChange,
  onRowSpanChange,
  onRemove,
  children,
  readOnly = false,
}: ChartBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [resizePreview, setResizePreview] = useState<{
    col: ColSpan
    row: RowSpan
    rect: DOMRect
  } | null>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const pendingResizeRef = useRef<{ col: ColSpan; row: RowSpan } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle pending resize updates after render cycle completes
  useEffect(() => {
    if (pendingResizeRef.current) {
      const { col, row } = pendingResizeRef.current
      pendingResizeRef.current = null
      onColSpanChange(id, col)
      if (onRowSpanChange) onRowSpanChange(id, row)
    }
  })

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: readOnly,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: resizePreview ? undefined : transition,
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
  }

  function cycleSize() {
    const next = findNextSize(colSpan, rowSpan)
    onColSpanChange(id, next.col)
    if (onRowSpanChange) onRowSpanChange(id, next.row)
  }

  function handleResizeStart(e: React.PointerEvent<HTMLDivElement>) {
    if (!blockRef.current) return
    const rect = blockRef.current.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startColSpan = colSpan
    const startRowSpan = rowSpan
    const COL_STEP = rect.width / colSpan
    const ROW_STEP = rect.height / rowSpan

    setResizePreview({ col: colSpan, row: rowSpan, rect })

    function handleMove(me: PointerEvent) {
      const deltaX = me.clientX - startX
      const deltaY = me.clientY - startY
      const newColSpan = Math.max(
        1,
        Math.min(3, startColSpan + Math.round(deltaX / COL_STEP))
      ) as ColSpan
      const newRowSpan = Math.max(
        1,
        Math.min(2, startRowSpan + Math.round(deltaY / ROW_STEP))
      ) as RowSpan

      setResizePreview(prev =>
        prev
          ? {
              ...prev,
              col: newColSpan,
              row: newRowSpan,
              rect: {
                ...prev.rect,
                width: rect.width + (newColSpan - startColSpan) * COL_STEP,
                height: rect.height + (newRowSpan - startRowSpan) * ROW_STEP,
              } as DOMRect,
            }
          : null
      )
    }

    function handleEnd() {
      // Capture the current preview state and store in ref for useEffect to handle
      setResizePreview(prev => {
        if (prev) {
          pendingResizeRef.current = { col: prev.col, row: prev.row }
        }
        return null
      })
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleEnd)
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleEnd)
  }

  const mergedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node)
    ;(blockRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }

  return (
    <>
      <div
        ref={mergedRef}
        style={style}
        className={cn(
          'flex flex-col bg-card border border-border rounded-sm min-h-[220px] transition-all relative group',
          isDragging && 'opacity-50 scale-[0.97] shadow-lg ring-1 ring-primary/40',
          resizePreview && 'ring-1 ring-primary/60'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border shrink-0">
          {/* Drag grip */}
          {!readOnly && (
            <button
              {...attributes}
              {...listeners}
              className="text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate leading-tight">{title}</p>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono">
                {subtitle}
              </p>
            )}
          </div>

          {/* Expand cycle (both axes) */}
          {!readOnly && (
            <button
              onClick={cycleSize}
              className="w-6 h-6 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title={`Size: ${colSpan}×${rowSpan} — click to cycle`}
              aria-label="Cycle block size"
            >
              <Expand className="w-3 h-3" />
            </button>
          )}

          {/* Kebab menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-6 h-6 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Block options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-7 z-50 w-36 bg-popover border border-border rounded-sm shadow-lg py-1">
                  {!readOnly &&
                    SIZE_CYCLE.map(s => (
                      <button
                        key={`${s.col}-${s.row}`}
                        onClick={() => {
                          onColSpanChange(id, s.col)
                          if (onRowSpanChange) onRowSpanChange(id, s.row)
                          setMenuOpen(false)
                        }}
                        className={cn(
                          'w-full px-3 py-1.5 text-left text-xs hover:bg-secondary flex items-center gap-2',
                          s.col === colSpan && s.row === rowSpan
                            ? 'text-primary'
                            : 'text-foreground'
                        )}
                      >
                        <Maximize2 className="w-3 h-3" />
                        {s.col}×{s.row}
                      </button>
                    ))}
                  {!readOnly && <div className="my-1 border-t border-border" />}
                  <button
                    className="w-full px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Download className="w-3 h-3" />
                    Export (CSV)
                  </button>
                  {!readOnly && (
                    <button
                      onClick={() => {
                        onRemove(id)
                        setMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-destructive hover:bg-secondary flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 min-h-0 p-3">{children}</div>

        {/* Corner resize handle */}
        {!readOnly && (
          <div
            onPointerDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
            style={{ touchAction: 'none' }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="4"
                y1="16"
                x2="16"
                y2="4"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
                opacity="0.4"
              />
              <line
                x1="8"
                y1="16"
                x2="16"
                y2="8"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
                opacity="0.4"
              />
              <line
                x1="12"
                y1="16"
                x2="16"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
                opacity="0.4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Resize preview ghost — rendered via portal */}
      {mounted &&
        resizePreview &&
        createPortal(
          <div
            className="fixed pointer-events-none z-50 border-2 border-dashed border-primary/60 rounded-sm bg-primary/10 backdrop-blur-sm"
            style={{
              left: resizePreview.rect.left,
              top: resizePreview.rect.top,
              width: resizePreview.rect.width,
              height: resizePreview.rect.height,
              transition: 'width 80ms ease-out, height 80ms ease-out',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-primary bg-card/80 px-2 py-1 rounded-sm border border-primary/30">
                {resizePreview.col}×{resizePreview.row}
              </span>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
