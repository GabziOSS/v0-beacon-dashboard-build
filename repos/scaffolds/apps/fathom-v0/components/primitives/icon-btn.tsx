"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required for accessibility — describes the button action */
  "aria-label": string
  size?: "xs" | "sm" | "md"
  variant?: "ghost" | "outline" | "filled"
  active?: boolean
}

const sizeClasses = {
  xs: "size-6",
  sm: "size-7",
  md: "size-8",
}

const variantClasses = {
  ghost:
    "bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground",
  outline:
    "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground",
  filled:
    "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground",
}

export const IconBtn = React.forwardRef<HTMLButtonElement, IconBtnProps>(
  (
    {
      className,
      size = "sm",
      variant = "ghost",
      active,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        data-active={active}
        aria-pressed={active}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-md",
          "motion-safe:transition-colors motion-safe:duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-40",
          "data-[active=true]:bg-primary/15 data-[active=true]:text-primary",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconBtn.displayName = "IconBtn"
