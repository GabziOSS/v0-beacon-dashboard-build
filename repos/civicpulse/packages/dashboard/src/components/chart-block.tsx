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
  Maximize,
  ArrowUpRight,
  Trash2,
  Download,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@beacon/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@beacon/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createPortal } from 'react-dom'
import { cn } from '@beacon/ui'

export type ColSpan = 1 | 2 | 3 | 4
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



/** A single resize direction handle */
type ResizeEdge = 'bottom-right' | 'bottom' | 'right'

interface ResizePreview {
  col: ColSpan
  row: RowSpan
  rect: DOMRect
}

function GridcellSelector({
  currentCol,
  currentRow,
  onChange,
}: {
  currentCol: number
  currentRow: number
  onChange: (col: ColSpan, row: RowSpan) => void
}) {
  const [hover, setHover] = useState<{ col: number; row: number } | null>(null)

  return (
    <div className="p-1">
      <div 
        className="grid grid-cols-4 gap-1.5"
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const r = Math.floor(i / 4) + 1
          const c = (i % 4) + 1
          const isActive = c === currentCol && r === currentRow
          const isSelected = c <= currentCol && r <= currentRow
          const isHovered = hover && c <= hover.col && r <= hover.row
          
          return (
            <button
              key={i}
              onMouseEnter={() => setHover({ col: c, row: r })}
              onClick={() => onChange(c as ColSpan, r as RowSpan)}
              className={cn(
                "w-7 h-7 border transition-all rounded-[3px] relative overflow-hidden group/cell",
                isHovered 
                  ? "bg-primary/40 border-primary ring-1 ring-primary/20" 
                  : isSelected 
                    ? "bg-primary/20 border-primary/40" 
                    : "bg-secondary/20 border-border hover:border-muted-foreground/30",
                isActive && "ring-2 ring-primary ring-offset-1 ring-offset-popover"
              )}
            >
              {isActive && !hover && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between px-1">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Dimensions</span>
        <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
          {hover ? `${hover.col} × ${hover.row}` : `${currentCol} × ${currentRow}`}
        </span>
      </div>
    </div>
  )
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
    // Enforce fixed dimensions to prevent misalignments in the grid
    height: rowSpan === 1 ? '240px' : '496px', // 240*2 + 16 (gap-4) = 496px
    width: '100%',
  }

  const mergedRef = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node)
    ;(blockRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }, [setNodeRef])


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
        id={id}
        style={style}
        className={cn(
          'flex flex-col bg-card/60 backdrop-blur-md border border-border rounded-sm transition-all relative group overflow-hidden',
          'hover:shadow-glow hover:border-primary/20',
          isDragging && 'opacity-40 scale-[0.97] shadow-2xl ring-1 ring-primary/40',
          resizePreview && 'ring-1 ring-primary/60',
        )}
      >
        {/* ── Technical Corner Accent ── */}
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-[-16px] right-[-16px] w-8 h-8 bg-primary/20 rotate-45" />
        </div>
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

          <div className="flex-1 min-w-0 mr-2">
            <p className="text-xs font-semibold text-foreground truncate leading-tight" title={title}>{title}</p>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono" title={subtitle}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Fullscreen Toggle via shadcn Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-sm text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
                  title="Fullscreen view"
                  aria-label="View fullscreen"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col p-1 gap-0 overflow-hidden bg-card border-border">
                <DialogHeader className="p-4 border-b border-border space-y-0.5">
                  <DialogTitle className="text-sm font-bold">{title}</DialogTitle>
                  {subtitle && <p className="text-[11px] text-muted-foreground font-mono">{subtitle}</p>}
                </DialogHeader>
                <div className="flex-1 min-h-0 w-full p-6 overflow-auto">
                  {children}
                </div>
              </DialogContent>
            </Dialog>

            {/* Word-style Gridcell Selector in Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-7 px-2 flex items-center gap-1.5 rounded-sm border border-border bg-background/50 text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-muted-foreground/30 transition-all active:scale-95"
                  title="Resize block"
                  aria-label="Set block size"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  {!(colSpan === 1 && rowSpan === 1) && (
                    <span className="hidden xs:inline">{colSpan} × {rowSpan}</span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] p-2">
                <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground py-1.5 px-2">Select Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-1">
                  <GridcellSelector 
                    currentCol={colSpan}
                    currentRow={rowSpan}
                    onChange={(c, r) => {
                      onColSpanChange(id, c)
                      if (onRowSpanChange) onRowSpanChange(id, r)
                      setDropdownOpen(false)
                    }}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                      className="w-full px-3 py-1.5 text-left text-xs text-destructive hover:bg-secondary flex items-center gap-2 text-red-500 hover:text-red-600"
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
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">{children}</div>

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
