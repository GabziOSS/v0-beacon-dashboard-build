'use client'

import { useState } from 'react'
import type { CalendarCell } from '@/lib/types'
import { cn } from '@/lib/utils'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function CalendarHeatmap({ data }: { data: CalendarCell[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  const maxCount = Math.max(...data.map(c => c.count), 1)

  // Group into weeks of 7
  const weeks: CalendarCell[][] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  // Month labels: find first week of each month
  const monthLabels: Record<number, string> = {}
  weeks.forEach((week, wi) => {
    const d = week.find(c => new Date(c.date).getDate() <= 7)
    if (d) {
      const month = new Date(d.date).getMonth()
      if (!Object.values(monthLabels).includes(MONTHS[month])) {
        monthLabels[wi] = MONTHS[month]
      }
    }
  })

  function cellColor(count: number) {
    if (count === 0) return 'var(--muted)'
    const pct = count / maxCount
    if (pct < 0.25) return 'oklch(0.72 0.155 210 / 0.3)'
    if (pct < 0.5) return 'oklch(0.72 0.155 210 / 0.55)'
    if (pct < 0.75) return 'oklch(0.72 0.155 210 / 0.75)'
    return 'var(--chart-1)'
  }

  return (
    <div className="h-full flex flex-col gap-2 overflow-x-auto">
      <div className="flex gap-px min-w-max">
        {/* Day labels */}
        <div className="flex flex-col gap-px mr-1">
          <div className="h-3" /> {/* month label spacer */}
          {DAYS_SHORT.map((d, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 flex items-center justify-center text-[7px] text-muted-foreground font-mono"
            >
              {i % 2 === 0 ? d : ''}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-px">
            {/* Month label above */}
            <div className="h-3 flex items-center">
              {monthLabels[wi] ? (
                <span className="text-[8px] text-muted-foreground font-mono whitespace-nowrap">
                  {monthLabels[wi]}
                </span>
              ) : null}
            </div>
            {week.map(cell => (
              <button
                key={cell.date}
                className={cn(
                  'w-2.5 h-2.5 rounded-[1px] transition-transform hover:scale-125 focus:outline-none',
                  selected === cell.date &&
                    'ring-1 ring-primary ring-offset-1 ring-offset-background'
                )}
                style={{ background: cellColor(cell.count) }}
                onClick={() => setSelected(prev => (prev === cell.date ? null : cell.date))}
                title={`${cell.date}: ${cell.count} incidents`}
                aria-label={`${cell.date}: ${cell.count} incidents`}
              />
            ))}
          </div>
        ))}
      </div>

      {selected && (
        <p className="text-[10px] text-muted-foreground font-mono">
          <span className="text-foreground font-semibold">{selected}</span>
          {' — '}
          {data.find(c => c.date === selected)?.count ?? 0} incidents
        </p>
      )}
    </div>
  )
}
