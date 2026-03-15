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

  return (
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md aspect-square max-w-[200px]" aria-hidden>
      <defs>
        <clipPath id="moonClip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
        <filter id="moon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Moon base (dark side) */}
      <circle cx={CX} cy={CY} r={R} fill="var(--muted)" stroke="var(--border)" strokeWidth={1} />

      {/* Illuminated portion */}
      {phase === 'Full Moon' ? (
        <circle cx={CX} cy={CY} r={R - 1} fill="var(--foreground)" opacity={0.9} filter="url(#moon-glow)" />
      ) : phase === 'New Moon' ? null : (
        <g clipPath="url(#moonClip)">
          <ellipse
            cx={isWaning ? CX - R + R * illuminationFactor : CX + R - R * illuminationFactor}
            cy={CY}
            rx={R * illuminationFactor}
            ry={R}
            fill="var(--foreground)"
            opacity={0.85}
            filter="url(#moon-glow)"
          />
        </g>
      )}

      {/* Subtle crater texture */}
      <circle cx={CX - 8} cy={CY - 10} r={4} fill="url(#moonGradient)" />
      <circle cx={CX + 10} cy={CY + 5} r={6} fill="url(#moonGradient)" />
      <circle cx={CX - 5} cy={CY + 12} r={3} fill="url(#moonGradient)" />
    </svg>
  )
}

export function MoonPhase({ 
  data,
  isEclipseMode = false
}: { 
  data: MoonPhaseData
  isEclipseMode?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-2 w-full relative overflow-hidden" id="moon-phase-chart">
      <div className="flex-1 w-full min-h-0 flex items-center justify-center aspect-square relative">
        <MoonIcon phase={data.phase} />
        
        {isEclipseMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Solar Corona Glow */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-yellow-500/20 blur-2xl animate-pulse" />
            <div className="absolute w-[60%] h-[60%] rounded-full border border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-base font-semibold text-foreground tracking-tight">
          {isEclipseMode ? 'Solar Eclipse' : data.phase}
        </span>
      {data.illumination !== undefined && !isEclipseMode && (
        <span className="text-xs text-muted-foreground">{data.illumination}% illuminated</span>
      )}
      {isEclipseMode && (
        <span className="text-xs text-yellow-500 font-medium animate-pulse">Rare Astronomical Event</span>
      )}
      </div>
    </div>
  )
}
