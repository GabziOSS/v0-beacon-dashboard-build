export function ChartSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 p-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-sm"
          style={{ height: `${14 + Math.random() * 20}px`, opacity: 0.8 - i * 0.1 }}
        />
      ))}
    </div>
  )
}

export function ChartEmpty({ label = "No data" }: { label?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-xs text-muted-foreground font-mono">{label}</span>
    </div>
  )
}
