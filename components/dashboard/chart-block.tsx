'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

/** Returns the current inner-window width, updated on resize. */
function useWindowWidth() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )
  useEffect(() => {
    function handle() { setWidth(window.innerWidth) }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}
import {
  GripVertical,
  MoreHorizontal,
  Expand,
  Maximize2,
  Trash2,
  Download,
} from 'lucide-react'
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

/** A single resize direction handle */
type ResizeEdge = 'bottom-right' | 'bottom' | 'right'

interface ResizePreview {
  col: ColSpan
  row: RowSpan
  rect: DOMRect
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
  const [resizePreview, setResizePreview] = useState<ResizePreview | null>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const pendingResizeRef = useRef<{ col: ColSpan; row: RowSpan } | null>(null)
  const [mounted, setMounted] = useState(false)
  const windowWidth = useWindowWidth()

  // Clamp colSpan to what the responsive grid can actually show:
  // mobile (<640px) → 1, sm tablet (<1024px) → max 2, lg+ → stored value
  const effectiveColSpan: ColSpan =
    windowWidth < 640 ? 1
    : windowWidth < 1024 ? (Math.min(colSpan, 2) as ColSpan)
    : colSpan

  useEffect(() => { setMounted(true) }, [])

  // Apply pending resize after render
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
    gridColumn: `span ${effectiveColSpan}`,
    gridRow: `span ${rowSpan}`,
    zIndex: isDragging ? 10 : undefined,
  }

  const mergedRef = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node)
    ;(blockRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }, [setNodeRef])

  function cycleSize() {
    const next = findNextSize(colSpan, rowSpan)
    onColSpanChange(id, next.col)
    if (onRowSpanChange) onRowSpanChange(id, next.row)
  }

  function startResize(e: React.PointerEvent<HTMLDivElement>, edge: ResizeEdge) {
    if (!blockRef.current) return
    e.stopPropagation()
    const rect = blockRef.current.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startCol = colSpan
    const startRow = rowSpan
    const COL_STEP = rect.width / colSpan
    const ROW_STEP = rect.height / rowSpan
    let currentRect = { ...rect.toJSON(), width: rect.width, height: rect.height } as DOMRect

    setResizePreview({ col: colSpan, row: rowSpan, rect })

    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

    function onMove(me: PointerEvent) {
      const dx = me.clientX - startX
      const dy = me.clientY - startY

      const newCol = (edge === 'bottom'
        ? startCol
        : Math.max(1, Math.min(3, startCol + Math.round(dx / COL_STEP)))) as ColSpan

      const newRow = (edge === 'right'
        ? startRow
        : Math.max(1, Math.min(2, startRow + Math.round(dy / ROW_STEP)))) as RowSpan

      const newWidth = rect.width + (newCol - startCol) * COL_STEP
      const newHeight = rect.height + (newRow - startRow) * ROW_STEP

      currentRect = {
        x: rect.x, y: rect.y, left: rect.left, top: rect.top,
        right: rect.right, bottom: rect.bottom,
        width: newWidth, height: newHeight,
        toJSON: () => ({ x: rect.x, y: rect.y, width: newWidth, height: newHeight }),
      } as DOMRect

      setResizePreview({ col: newCol, row: newRow, rect: currentRect })
    }

    function onUp() {
      setResizePreview(prev => {
        if (prev) pendingResizeRef.current = { col: prev.col, row: prev.row }
        return null
      })
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  return (
    <>
      <div
        ref={mergedRef}
        style={style}
        className={cn(
          'flex flex-col bg-card border border-border rounded-sm min-h-[280px] transition-all relative group',
          isDragging && 'opacity-40 scale-[0.97] shadow-2xl ring-1 ring-primary/40',
          resizePreview && 'ring-1 ring-primary/60',
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border shrink-0">
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

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate leading-tight">{title}</p>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono">
                {subtitle}
              </p>
            )}
          </div>

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
                            : 'text-foreground',
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
                      onClick={() => { onRemove(id); setMenuOpen(false) }}
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

        {/* ── Chart area ── */}
        <div className="flex-1 min-h-0 p-3">{children}</div>

        {/* ── Resize handles ── */}
        {!readOnly && (
          <>
            {/* Bottom edge */}
            <div
              className="absolute bottom-0 inset-x-4 h-2 opacity-0 group-hover:opacity-100 cursor-s-resize transition-opacity"
              style={{ touchAction: 'none' }}
              onPointerDown={e => startResize(e, 'bottom')}
            />
            {/* Right edge */}
            <div
              className="absolute right-0 inset-y-4 w-2 opacity-0 group-hover:opacity-100 cursor-e-resize transition-opacity"
              style={{ touchAction: 'none' }}
              onPointerDown={e => startResize(e, 'right')}
            />
            {/* Corner (diagonal) */}
            <div
              className="absolute bottom-0 right-0 w-5 h-5 opacity-0 group-hover:opacity-100 cursor-nwse-resize transition-opacity"
              style={{ touchAction: 'none' }}
              onPointerDown={e => startResize(e, 'bottom-right')}
            >
              <svg className="w-full h-full" viewBox="0 0 20 20" fill="none">
                <line x1="4" y1="16" x2="16" y2="4" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" opacity="0.4" />
                <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" opacity="0.4" />
                <line x1="12" y1="16" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" opacity="0.4" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* ── Resize ghost overlay ── */}
      {mounted && resizePreview &&
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
          document.body,
        )}
    </>
  )
}
