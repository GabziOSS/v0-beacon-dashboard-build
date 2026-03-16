"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { TileWrapper, type TileWrapperProps, type TileTab } from "./tile-wrapper"

export type TileSize = "xs" | "sm" | "md" | "lg" | "xl"

export const TILE_COL_SPANS: Record<TileSize, number> = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
}

export interface TileConfig {
  id: string
  type: string
  title: string
  sourceLabel?: string
  defaultSize: TileSize
  colSpan?: number
  minCols?: number
  supportsMapHover?: boolean
}

interface TileGridProps {
  tiles: TileConfig[]
  onColSpanChange: (id: string, span: number) => void
  onRemoveTile: (id: string) => void
  onAddTile: () => void
  onHoverOnMap?: (id: string, active: boolean) => void
  hoveredMapTileId?: string | null
  /** Render prop — given a tile config, returns the tile's tab array or children */
  renderTile: (tile: TileConfig) => { tabs?: TileTab[]; children?: React.ReactNode }
  className?: string
}

export function TileGrid({
  tiles,
  onColSpanChange,
  onRemoveTile,
  onAddTile,
  onHoverOnMap,
  hoveredMapTileId,
  renderTile,
  className,
}: TileGridProps) {
  return (
    <section
      aria-label="Dashboard tiles"
      className={cn(
        "grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-3",
        className
      )}
    >
      {tiles.map((tile) => {
        const colSpan = tile.colSpan ?? TILE_COL_SPANS[tile.defaultSize]
        const { tabs, children } = renderTile(tile)
        return (
          <TileWrapper
            key={tile.id}
            id={tile.id}
            title={tile.title}
            sourceLabel={tile.sourceLabel}
            colSpan={colSpan}
            onColSpanChange={onColSpanChange}
            onRemove={onRemoveTile}
            onHoverOnMap={tile.supportsMapHover ? onHoverOnMap : undefined}
            isHoveredOnMap={hoveredMapTileId === tile.id}
            tabs={tabs}
            minCols={tile.minCols ?? 3}
          >
            {children}
          </TileWrapper>
        )
      })}

      {/* Add tile button */}
      <button
        onClick={onAddTile}
        aria-label="Add a new tile"
        style={{ gridColumn: "span 3" }}
        className={cn(
          "flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg",
          "border border-dashed border-border/60 text-muted-foreground/60",
          "hover:border-border hover:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "motion-safe:transition-colors motion-safe:duration-150"
        )}
      >
        <div className="flex size-8 items-center justify-center rounded-full border border-dashed border-current">
          <Plus className="size-4" aria-hidden="true" />
        </div>
        <span className="text-xs">Add tile</span>
      </button>
    </section>
  )
}
