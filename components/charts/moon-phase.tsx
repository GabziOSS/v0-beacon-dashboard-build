'use client'

type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent'

export interface MoonPhaseData {
  phase: MoonPhaseName
  illumination?: number // 0-100
}

// SVG moon phase visualization
function MoonIcon({ phase }: { phase: MoonPhaseName }) {
  const CX = 40
  const CY = 40
  const R = 32

  // Calculate shadow based on phase
  const getPhaseOffset = () => {
    switch (phase) {
      case 'New Moon':
        return 0
      case 'Waxing Crescent':
        return 0.25
      case 'First Quarter':
        return 0.5
      case 'Waxing Gibbous':
        return 0.75
      case 'Full Moon':
        return 1
      case 'Waning Gibbous':
        return 0.75
      case 'Last Quarter':
        return 0.5
      case 'Waning Crescent':
        return 0.25
      default:
        return 0.5
    }
  }

  const isWaning = phase.startsWith('Waning') || phase === 'Last Quarter'
  const illuminationFactor = getPhaseOffset()

  // For crescent/gibbous, we use an ellipse to create the terminator
  const terminatorX = R * (1 - illuminationFactor * 2) // -R to R

  return (
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md aspect-square max-w-[200px]" aria-hidden>
      <defs>
        <clipPath id="moonClip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Moon base (dark side) */}
      <circle cx={CX} cy={CY} r={R} fill="var(--muted)" stroke="var(--border)" strokeWidth={1} />

      {/* Illuminated portion */}
      {phase === 'Full Moon' ? (
        <circle cx={CX} cy={CY} r={R - 1} fill="var(--foreground)" opacity={0.9} />
      ) : phase === 'New Moon' ? null : (
        <g clipPath="url(#moonClip)">
          {/* For waxing phases, light is on right; for waning, on left */}
          {isWaning ? (
            <ellipse
              cx={CX - R + R * illuminationFactor}
              cy={CY}
              rx={R * illuminationFactor}
              ry={R}
              fill="var(--foreground)"
              opacity={0.85}
            />
          ) : (
            <ellipse
              cx={CX + R - R * illuminationFactor}
              cy={CY}
              rx={R * illuminationFactor}
              ry={R}
              fill="var(--foreground)"
              opacity={0.85}
            />
          )}
        </g>
      )}

      {/* Subtle crater texture */}
      <circle cx={CX - 8} cy={CY - 10} r={4} fill="url(#moonGradient)" />
      <circle cx={CX + 10} cy={CY + 5} r={6} fill="url(#moonGradient)" />
      <circle cx={CX - 5} cy={CY + 12} r={3} fill="url(#moonGradient)" />
    </svg>
  )
}

export function MoonPhase({ data }: { data: MoonPhaseData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-2 w-full">
      <div className="flex-1 w-full min-h-[120px] flex items-center justify-center aspect-square">
        <MoonIcon phase={data.phase} />
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-base font-semibold text-foreground tracking-tight">{data.phase}</span>
      {data.illumination !== undefined && (
        <span className="text-xs text-muted-foreground">{data.illumination}% illuminated</span>
      )}
      </div>
    </div>
  )
}
