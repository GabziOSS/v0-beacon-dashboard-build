"use client"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface ToggleRowProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  /** Colour dot to indicate zone type */
  color?: string
  className?: string
}

export function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  color,
  className,
}: ToggleRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-1", className)}>
      <div className="flex min-w-0 items-center gap-2">
        {color && (
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        )}
        <label
          htmlFor={id}
          className="min-w-0 cursor-pointer select-none"
        >
          <span className="block truncate text-xs font-medium text-foreground">{label}</span>
          {description && (
            <span className="block truncate text-[10px] text-muted-foreground">{description}</span>
          )}
        </label>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={`Toggle ${label}`}
        className="shrink-0"
      />
    </div>
  )
}
