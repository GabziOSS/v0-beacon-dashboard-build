"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, MapPin, GripVertical } from "lucide-react"
import { IconBtn } from "@/components/primitives/icon-btn"
import { ResizeHandle } from "@/components/primitives/resize-handle"
import { TileTabBar } from "@/components/primitives/tile-tab-bar"
import { SectionHeader } from "@/components/primitives/section-header"

export interface TileTab {
  id: string
  label: string
  content: React.ReactNode
}

export interface TileWrapperProps {
  id: string
  title: string
  sourceLabel?: string
  colSpan: number
  onColSpanChange: (id: string, span: number) => void
  onRemove: (id: string) => void
  onHoverOnMap?: (id: string, active: boolean) => void
  isHoveredOnMap?: boolean
  tabs?: TileTab[]
  /** Rendered when there are no tabs */
  children?: React.ReactNode
  className?: string
  /** Override min columns for this tile */
  minCols?: number
}

export function TileWrapper({
  id,
  title,
  sourceLabel,
  colSpan,
  onColSpanChange,
  onRemove,
  onHoverOnMap,
  isHoveredOnMap = false,
  tabs,
  children,
  className,
  minCols = 3,
}: TileWrapperProps) {
  const [activeTab, setActiveTab] = React.useState(tabs?.[0]?.id ?? "")

  const activeContent = tabs
    ? tabs.find((t) => t.id === activeTab)?.content
    : children

  return (
    <article
      aria-label={title}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border border-border",
        "bg-card text-card-foreground",
        isHoveredOnMap && "ring-1 ring-primary/50",
        className
      )}
      style={{ gridColumn: `span ${colSpan}` }}
    >
      {/* Header */}
      <SectionHeader
        title={title}
        sourceLabel={sourceLabel}
        actions={
          <>
            {tabs && tabs.length > 1 && (
              <TileTabBar
                tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            )}
            {onHoverOnMap && (
              <IconBtn
                size="xs"
                aria-label={isHoveredOnMap ? "Remove from map overlay" : "Float this chart on the map"}
                active={isHoveredOnMap}
                onClick={() => onHoverOnMap(id, !isHoveredOnMap)}
                title={isHoveredOnMap ? "Remove from map" : "Hover on map"}
              >
                <MapPin className="size-3" aria-hidden="true" />
              </IconBtn>
            )}
            <IconBtn
              size="xs"
              aria-label={`Remove ${title} tile`}
              onClick={() => onRemove(id)}
              className="hover:text-destructive"
            >
              <X className="size-3" aria-hidden="true" />
            </IconBtn>
          </>
        }
      />

      {/* Drag hint strip */}
      <div
        aria-hidden="true"
        className="flex cursor-grab items-center justify-center py-0.5 opacity-0 hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-100"
      >
        <GripVertical className="size-3 text-muted-foreground/30" />
      </div>

      {/* Content */}
      {tabs && tabs.length > 1 ? (
        tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            {tab.content}
          </div>
        ))
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {activeContent}
        </div>
      )}

      <ResizeHandle
        colSpan={colSpan}
        onColSpanChange={(span) => onColSpanChange(id, span)}
        min={minCols}
        max={12}
      />
    </article>
  )
}
