# Codemap: lib/ directory

1. Responsibility

- Utility library: lib/utils.ts provides a small helper for Tailwind class names
- Theme and UI configuration: lib/theme.ts defines themes, modes, persistence, and initialization logic
- Data and UI presets: lib/presets.ts contains predefined dashboard presets and a helper API
- Domain types: lib/types.ts exports TypeScript interfaces and types used across the data models
- Hooks (UI data shims): lib/hooks.ts provides mock/reactive data hooks used by dashboards and charts
- Auth (client auth state): lib/auth.tsx implements a minimal client-side AuthContext and login/logout
- (Cross-file) shared types and models used by the hooks/presets/presence in the UI

2. Design Patterns

- Hook-based data provisioning: lib/hooks.ts exposes small React hooks that wrap a simple in-memory data factory (useQuery wrapper)
- Singleton-like theme data: lib/theme.ts exposes THEME definitions and a few helpers that emulate a singleton style through module scope constants
- Factory/lookup utilities: lib/presets.ts exposes getPreset/getStoredPreset/savePreset as lightweight factory/lookup helpers
- Simple Context API: lib/auth.tsx uses React Context to provide user/session state and actions
- Lightweight type utilities: lib/types.ts defines strict domain types used across modules

3. Data & Control Flow

- Type definitions (types.ts): defines Incident, Statistics, and various data shape interfaces used by charts and dashboards
- Theme (theme.ts):
  - THEME definitions: static color/font mappings per theme and per mode
  - getEffectiveMode/getStoredTheme/getStoredMode: read from system/user/localStorage and determine active theme/mode
  - applyTheme/initTheme/initThemeListener: set data-theme attribute and persist preferences
- Presets (presets.ts):
  - PRESETS: map of PresetId to Preset (blocks layout and metadata)
  - getPreset: returns a Preset by id
  - getStoredPreset/savePreset: helper to persist last used preset
- Hooks (hooks.ts):
  - useStatCards, useIncidentTrend, useCategoryBar, etc.: return mock data via a tiny useQuery wrapper
  - useCalendarHeatmap and related: provide precomputed calendar data and deterministic data for SSR
- Auth (auth.tsx):
  - AuthProvider: stores user in localStorage, provides signIn/signOut, and persists theme per-user
  - useAuth: access to user/isLoading/signIn/signOut
- Utils (utils.ts):
  - cn: tailwind class name helper using clsx + tailwind-merge
    Data flow exemplar:
  - UI components import hooks (from hooks.ts) for data, or presets for initial dashboards.
  - Theme is initialized on app startup (initTheme) and then read by components to apply colors.
  - Auth flows trigger persistence in localStorage and influence theming (e.g., beacon_theme_usr_000).

4. Integration Points

- Imports and consumptions:
  - lib/types.ts is consumed by lib/hooks.ts to type mock data shapes used in charts.
  - lib/theme.ts is used by UI initialization paths (initTheme) and consumers calling getStoredTheme/getStoredMode/applyTheme.
  - lib/presets.ts is used by dashboard builders or pages to configure the grid of charts.
  - lib/hooks.ts exports React hooks that are likely used by various dashboard components to fetch chart data.
  - lib/auth.tsx provides a global AuthProvider and useAuth hook, used to gate parts of the app and to persist per-user settings.
  - lib/utils.ts exposes cn() for class name composition used in many components.

## File-by-file breakdown

- lib/types.ts
  - Exports: Incident, IncidentType, Severity, IncidentStatus, StatCardData, TrendPoint, CategoryBar, DistrictRadar, ResponseTimePoint, ComposedPoint, ScatterZone, HeatmapCell, CalendarCell, WindRoseData, BulletData, WeatherCondition, ForecastData, SunriseSunsetData, MoonPhaseData, TempHumidityData, MultiTempData, RainBarData, BarometerPoint, and related types used across charts.
  - Purpose: establish strict data contracts for dashboards and charts.

- lib/theme.ts
  - Exports: ThemeMode, EffectiveMode, THEME definitions, ENABLED_THEMES, ThemeId, getSystemPreference (internal), getEffectiveMode, applyTheme, getStoredTheme, getStoredMode, initTheme, initThemeListener.
  - Purpose: central theme management including dark/soft/light modes, persistence, and system preference detection. Applies themes by setting data-theme on documentElement and persists in localStorage.

- lib/presets.ts
  - Exports: PresetId, Preset, PRESETS map, getPreset, getStoredPreset, savePreset.
  - Purpose: prebuilt dashboard layouts and widgets for quick setup; supports persistence of last-used preset.

- lib/hooks.ts
  - Exports: a suite of hooks (useStatCards, useIncidentTrend, useCategoryBar, useDistrictRadar, useCityRiskScore, useReadinessScore, useResponseTime, useResolutionRate, useComposedData, useScatterData, useTimelineHeatmap, useCalendarHeatmap, useWindRose, useRiskVector, useBulletData, useSparkBar, useIncidents, and more).
  - Purpose: provide mock data and SSR-friendly data factories to dashboard components for development/testing without a live API.

- lib/auth.tsx
  - Exports: AuthProvider, useAuth, getLastLogin.
  - Purpose: lightweight client-side authentication state with a mock login flow, user persistence, and per-user theme preference persistence.

- lib/utils.ts
  - Exports: cn function.
  - Purpose: utility for producing merged class names in a tailwind-based UI.

Notes

- This codemap reflects the present codebase state. If you update any of these modules, consider regenerating the codemap to keep it accurate.
