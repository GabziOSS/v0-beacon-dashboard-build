"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizeHandleProps {
  colSpan: number
  onColSpanChange: (span: number) => void
  min?: number
  max?: number
  className?: string
}

const SNAP_COLS = [3, 4, 6, 8, 12]

export function ResizeHandle({
  colSpan,
  onColSpanChange,
  min = 3,
  max = 12,
  className,
}: ResizeHandleProps) {
  const snapToNext = (current: number, dir: 1 | -1) => {
    const idx = SNAP_COLS.indexOf(current)
    const next = SNAP_COLS[Math.max(0, Math.min(SNAP_COLS.length - 1, idx + dir))]
    return Math.max(min, Math.min(max, next ?? current))
  }

  const startXRef = React.useRef<number | null>(null)
  const startColRef = React.useRef<number>(colSpan)

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      startXRef.current = e.clientX
      startColRef.current = colSpan
      const el = e.currentTarget as HTMLElement
      el.setPointerCapture(e.pointerId)
    },
    [colSpan]
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (startXRef.current === null) return
      const delta = e.clientX - startXRef.current
      // ~80px per column step
      const colDelta = Math.round(delta / 80)
      const raw = startColRef.current + colDelta
      const snapped = SNAP_COLS.reduce((prev, cur) =>
        Math.abs(cur - raw) < Math.abs(prev - raw) ? cur : prev
      )
      const clamped = Math.max(min, Math.min(max, snapped))
      if (clamped !== colSpan) onColSpanChange(clamped)
    },
    [colSpan, min, max, onColSpanChange]
  )

  const onPointerUp = React.useCallback(() => {
    startXRef.current = null
  }, [])

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        onColSpanChange(snapToNext(colSpan, 1))
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        onColSpanChange(snapToNext(colSpan, -1))
      }
    },
    [colSpan, onColSpanChange]
  )

  return (
    <div
      role="slider"
      aria-label="Resize tile width"
      aria-orientation="horizontal"
      aria-valuenow={colSpan}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute bottom-0.5 right-0.5 z-10",
        "flex size-4 cursor-se-resize items-center justify-center rounded-sm",
        "text-muted-foreground/40 hover:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "motion-safe:transition-colors motion-safe:duration-100",
        "select-none touch-none",
        className
      )}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 1L1 7M7 5L5 7M7 3L3 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}
