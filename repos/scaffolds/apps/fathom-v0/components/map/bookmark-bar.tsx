"use client"

import * as React from "react"
import { useState } from "react"
import { OverlayPanel } from "@/components/primitives/overlay-panel"
import { IconBtn } from "@/components/primitives/icon-btn"
import { Bookmark, Plus, MapPin, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MapBookmark {
  id: string
  label: string
  center: [number, number]
  zoom: number
}

interface BookmarkBarProps {
  bookmarks: MapBookmark[]
  onLoad: (bookmark: MapBookmark) => void
  onSave: () => void
  onDelete: (id: string) => void
  className?: string
}

export function BookmarkBar({
  bookmarks,
  onLoad,
  onSave,
  onDelete,
  className,
}: BookmarkBarProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  return (
    <nav
      aria-label="Saved map views"
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto border-b bg-card/60 px-3 py-1.5 backdrop-blur-sm",
        "scrollbar-none",
        className
      )}
    >
      <Bookmark className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />

      {bookmarks.length === 0 && (
        <span className="text-[11px] text-muted-foreground/60 italic">No saved views</span>
      )}

      {bookmarks.map((bm) => (
        <div
          key={bm.id}
          className="group flex shrink-0 items-center gap-0"
        >
          <button
            type="button"
            onClick={() => onLoad(bm)}
            className={cn(
              "flex items-center gap-1.5 rounded-l-md border border-r-0 border-border/60",
              "bg-muted/30 px-2 py-1 text-[11px] text-foreground",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "motion-safe:transition-colors motion-safe:duration-100"
            )}
            aria-label={`Load view: ${bm.label}`}
          >
            <MapPin className="size-2.5 text-primary" aria-hidden="true" />
            {bm.label}
          </button>
          <IconBtn
            size="xs"
            variant="outline"
            aria-label={`Delete saved view: ${bm.label}`}
            onClick={() => {
              setDeleteTarget(bm.id)
              onDelete(bm.id)
            }}
            className="rounded-l-none rounded-r-md border border-border/60 px-1 hover:text-destructive"
          >
            <Trash2 className="size-2.5" aria-hidden="true" />
          </IconBtn>
        </div>
      ))}

      <IconBtn
        size="xs"
        variant="outline"
        aria-label="Save current view as bookmark"
        onClick={onSave}
        className="ml-1 shrink-0"
      >
        <Plus className="size-3" aria-hidden="true" />
      </IconBtn>

      {/* Live save confirmation */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {deleteTarget ? `Deleted bookmark` : ""}
      </div>
    </nav>
  )
}
