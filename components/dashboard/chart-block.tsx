"use client"

import { useState } from "react"
import { GripVertical, MoreHorizontal, ArrowLeftRight, Maximize2, Trash2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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
}: ChartBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isResizing ? undefined : transition,
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
  }

  function cycleColSpan() {
    const next: ColSpan = colSpan === 1 ? 2 : colSpan === 2 ? 3 : 1
    onColSpanChange(id, next)
  }

  function handleResizeStart(e: React.PointerEvent<HTMLDivElement>) {
    setIsResizing(true)
    const startX = e.clientX
    const startY = e.clientY
    const startColSpan = colSpan
    const startRowSpan = rowSpan
    const COL_STEP = 80
    const ROW_STEP = 60

    function handleMove(me: PointerEvent) {
      const deltaX = me.clientX - startX
      const deltaY = me.clientY - startY
      const newColSpan = Math.max(1, Math.min(3, startColSpan + Math.round(deltaX / COL_STEP))) as ColSpan
      const newRowSpan = Math.max(1, Math.min(2, startRowSpan + Math.round(deltaY / ROW_STEP))) as RowSpan

      onColSpanChange(id, newColSpan)
      if (onRowSpanChange) onRowSpanChange(id, newRowSpan)
    }

    function handleEnd() {
      setIsResizing(false)
      document.removeEventListener("pointermove", handleMove)
      document.removeEventListener("pointerup", handleEnd)
    }

    document.addEventListener("pointermove", handleMove)
    document.addEventListener("pointerup", handleEnd)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col bg-card border border-border rounded-sm min-h-[220px] transition-all relative group",
        isDragging && "opacity-50 scale-[0.97] shadow-lg ring-1 ring-primary/40"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border shrink-0">
        {/* Drag grip */}
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">{title}</p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono">{subtitle}</p>
          )}
        </div>

        {/* Col cycle */}
        <button
          onClick={cycleColSpan}
          className="w-6 h-6 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title={`Width: ${colSpan} col — click to cycle`}
          aria-label="Cycle column span"
        >
          <ArrowLeftRight className="w-3 h-3" />
        </button>

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
                {[1, 2, 3].map(s => (
                  <button
                    key={s}
                    onClick={() => { onColSpanChange(id, s as ColSpan); setMenuOpen(false) }}
                    className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-secondary flex items-center gap-2"
                  >
                    <Maximize2 className="w-3 h-3" />
                    {s} column{s > 1 ? "s" : ""}
                  </button>
                ))}
                <div className="my-1 border-t border-border" />
                <button
                  className="w-full px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Download className="w-3 h-3" />
                  Export (CSV)
                </button>
                <button
                  onClick={() => { onRemove(id); setMenuOpen(false) }}
                  className="w-full px-3 py-1.5 text-left text-xs text-destructive hover:bg-secondary flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0 p-3">
        {children}
      </div>

      {/* Corner resize handle */}
      <div
        onPointerDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
        style={{ touchAction: "none" }}
      >
        <svg className="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" opacity="0.5" />
          <line x1="6" y1="14" x2="14" y2="6" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
