"use client"

import { useState } from "react"
import { GripVertical, MoreHorizontal, ArrowLeftRight, Maximize2, Trash2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export type ColSpan = 1 | 2 | 3

interface ChartBlockProps {
  id: string
  title: string
  subtitle?: string
  colSpan: ColSpan
  onColSpanChange: (id: string, span: ColSpan) => void
  onRemove: (id: string) => void
  children: React.ReactNode
  isDragging?: boolean
}

export function ChartBlock({
  id,
  title,
  subtitle,
  colSpan,
  onColSpanChange,
  onRemove,
  children,
}: ChartBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${colSpan}`,
  }

  function cycleColSpan() {
    const next: ColSpan = colSpan === 1 ? 2 : colSpan === 2 ? 3 : 1
    onColSpanChange(id, next)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col bg-card border border-border rounded-sm min-h-[220px] transition-all",
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
    </div>
  )
}
