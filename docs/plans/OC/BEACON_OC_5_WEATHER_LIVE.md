# Beacon — opencode Prompt 5 (Optional): Live WeatherLink Integration

This session is optional and replaces the manual hand-wiring
of the Effect/Hono/WeatherLink layer. Run it only if you prefer
opencode to handle the integration rather than doing it by hand.

Prerequisites:
- OC-1 complete: `lib/mock-data/` exports `WEATHER`, `WeatherData`
- OC-2 complete: `lib/weatherlink/transforms.ts` exists with
  `transformMockToCurrentConditions` implemented and
  `lib/hooks/use-weather-live.ts` exists as a stub
- v0 Sessions 1–3 complete: all weather chart components exist
  with `// TODO(live-weather):` stub comments

Read the full codebase before starting. Pay particular attention
to the existing stubs — implement into them, do not create
parallel files.

---

## Stack

```
Effect v4 beta        effect@beta
@effect/platform-node @effect/platform-node@beta
ts-rest               @ts-rest/core
Hono                  hono
hono/vercel adapter   @hono/vercel
@t3-oss/env-core      (already installed from OC-4)
```

Verify all package versions via context7 before writing any code.
Effect v4 is in active beta — APIs may differ from v3 documentation.
Always prefer `effect/unstable/*` import paths for HTTP modules.

---

## Part 1 — Server Env Config

File: `lib/env.server.ts`

Create server-side env validation using `@t3-oss/env-core`.
This file is server-only — never import it from any client component.

```typescript
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    WL_API_KEY:    z.string().min(1),
    WL_API_SECRET: z.string().min(1),
    WL_STATION_ID: z.string().min(1),
    NODE_ENV:      z.enum(["development", "production", "test"])
                    .default("development"),
  },
  runtimeEnv: process.env,
})
```

Note: Effect `Config` module is NOT used here. The rationale:
`Config` integrates with the Effect Layer system and provides
structured startup failure for Effect programs. t3-env validates
at module load time and works outside Effect programs. Both are
valid — using t3-env here keeps the env validation consistent
with the client-side pattern already established in `lib/env.client.ts`.

If you want to use Effect `Config` instead, the equivalent is:

```typescript
// Alternative: Effect Config approach
// Use this if you prefer a unified Effect model
class WeatherLinkConfig extends Context.Tag("WeatherLinkConfig")<
  WeatherLinkConfig,
  { apiKey: string; apiSecret: string; stationId: string }
>() {}

const WeatherLinkConfigLive = Layer.effect(
  WeatherLinkConfig,
  Effect.gen(function* () {
    const apiKey    = yield* Config.string("WL_API_KEY")
    const apiSecret = yield* Config.string("WL_API_SECRET")
    const stationId = yield* Config.string("WL_STATION_ID")
    return { apiKey, apiSecret, stationId }
  })
)
```

Choose one approach and be consistent. Do not mix both.

---

## Part 2 — WeatherLink Error Union

File: `lib/weatherlink/errors.ts`

```typescript
import { Data } from "effect"

// Tagged error classes — Effect tracks these in the type signature
export class NetworkError extends Data.TaggedError("NetworkError")<{
  cause: unknown
}> {}

export class AuthFailedError extends Data.TaggedError("AuthFailedError")<{
  status: 401 | 403
}> {}

export class RateLimitedError extends Data.TaggedError("RateLimitedError")<{
  retryAfter?: number
}> {}

export class StationNotFoundError extends Data.TaggedError("StationNotFoundError")<{
  stationId: string
}> {}

export class ParseError extends Data.TaggedError("ParseError")<{
  cause: unknown
  raw?: unknown
}> {}

export class UpstreamError extends Data.TaggedError("UpstreamError")<{
  status: number
}> {}

export type WeatherLinkError =
  | NetworkError
  | AuthFailedError
  | RateLimitedError
  | StationNotFoundError
  | ParseError
  | UpstreamError

// Maps WeatherLinkError to HTTP status for Hono responses
export function mapErrorToStatus(e: WeatherLinkError): number {
  switch (e._tag) {
    case "NetworkError":       return 502
    case "AuthFailedError":    return 502  // not 401 — this is our config problem
    case "RateLimitedError":   return 503
    case "StationNotFoundError": return 404
    case "ParseError":         return 502
    case "UpstreamError":      return 502
  }
}

export function mapErrorToResponse(e: WeatherLinkError): object {
  return { error: e._tag, message: e.message ?? String(e) }
}
```

---

## Part 3 — HMAC Auth

File: `lib/weatherlink/auth.ts`

WeatherLink v2 requires HMAC-SHA256 signature over all query params
plus `api-key` and `t` (Unix timestamp). The secret goes in an
`X-Api-Secret` header. This is why direct browser calls trigger
CORS preflight — the non-safelisted header requires server-side calls.

```typescript
import { createHmac } from "node:crypto"

export interface SignedRequest {
  url: string
  headers: Record<string, string>
}

export function buildSignedUrl(
  basePath: string,
  params: Record<string, string | number>,
  apiKey: string,
  apiSecret: string
): SignedRequest {
  const t = Math.floor(Date.now() / 1000)
  const allParams = { ...params, "api-key": apiKey, t }

  // Sort params alphabetically — WeatherLink requires this for HMAC
  const sortedKeys = Object.keys(allParams).sort()
  const dataToSign = sortedKeys
    .map(k => `${k}${allParams[k as keyof typeof allParams]}`)
    .join("")

  const signature = createHmac("sha256", apiSecret)
    .update(dataToSign)
    .digest("hex")

  const query = new URLSearchParams(
    sortedKeys.reduce((acc, k) => {
      acc[k] = String(allParams[k as keyof typeof allParams])
      return acc
    }, {} as Record<string, string>)
  )
  query.set("api-signature", signature)

  return {
    url: `https://api.weatherlink.com/v2${basePath}?${query}`,
    headers: { "X-Api-Secret": apiSecret },
  }
}
```

---

## Part 4 — ts-rest Contract

File: `lib/weatherlink/contract.ts`

```typescript
import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

// Loose schemas — WeatherLink responses are complex discriminated
// unions keyed by sensor_type integers. We accept loosely here
// and parse strictly in service.ts.
const SensorDataRecord = z.object({
  lsid:               z.number(),
  data_structure_type: z.number(),
  txid:               z.number().optional(),
  data:               z.array(z.record(z.unknown())),
})

const StationCurrentResponse = z.object({
  station_id: z.number(),
  generated_at: z.number(),
  sensors: z.array(SensorDataRecord),
})

const StationHistoricResponse = z.object({
  station_id: z.number(),
  sensors: z.array(SensorDataRecord),
})

const StationListResponse = z.object({
  stations: z.array(z.object({
    station_id: z.number(),
    station_name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    elevation: z.number().optional(),
    time_zone: z.string(),
  })),
})

export const wlContract = c.router({
  getCurrentConditions: {
    method: "GET",
    path: "/current/:stationId",
    pathParams: z.object({ stationId: z.string() }),
    responses: { 200: StationCurrentResponse },
    summary: "Get current conditions for a station",
  },
  getHistoric: {
    method: "GET",
    path: "/historic/:stationId",
    pathParams: z.object({ stationId: z.string() }),
    query: z.object({
      "start-timestamp": z.coerce.number(),
      "end-timestamp":   z.coerce.number(),
    }),
    responses: { 200: StationHistoricResponse },
    summary: "Get historic data for a station",
  },
  getStations: {
    method: "GET",
    path: "/stations",
    responses: { 200: StationListResponse },
    summary: "List accessible stations",
  },
})
```

---

## Part 5 — ts-rest Client with HMAC Signing

File: `lib/weatherlink/client.ts`

```typescript
import { initClient } from "@ts-rest/core"
import { wlContract } from "./contract"
import { buildSignedUrl } from "./auth"
import { serverEnv } from "@/lib/env.server"

export const wlClient = initClient(wlContract, {
  baseUrl: "https://api.weatherlink.com/v2",
  baseHeaders: {},
  api: async ({ path, method, headers, query }) => {
    const { url, headers: authHeaders } = buildSignedUrl(
      path,
      (query as Record<string, string | number>) ?? {},
      serverEnv.WL_API_KEY,
      serverEnv.WL_API_SECRET
    )
    return fetch(url, {
      method,
      headers: { ...headers, ...authHeaders },
    })
  },
})
```

---

## Part 6 — Zod Schemas for Sensor Types

File: `lib/weatherlink/schemas.ts`

WeatherLink uses `data_structure_type` integers to identify sensor
record shapes. Your station most likely has type 10 (ISS — wind,
temp, humidity, rain) and type 2 (current conditions summary).

Strict schemas for known types:

```typescript
import { z } from "zod"

// data_structure_type 10 — ISS / leaf & soil station
export const IssDataSchema = z.object({
  ts:                z.number(),
  wind_speed_last:   z.number().nullable(),
  wind_dir_last:     z.number().nullable(),
  temp_out:          z.number().nullable(),
  hum_out:           z.number().nullable(),
  rainfall_daily_mm: z.number().nullable(),
  rainfall_rate_hi_mm_per_hr: z.number().nullable(),
  thw_index:         z.number().nullable(),
  wet_bulb:          z.number().nullable(),
  heat_index:        z.number().nullable(),
  bar_sea_level:     z.number().nullable(),
  bar_trend:         z.number().nullable(),
  sunrise:           z.number().nullable(),   // Unix timestamp
  sunset:            z.number().nullable(),   // Unix timestamp
  moon_phase_icon:   z.string().nullable(),
})

// data_structure_type 2 — current conditions (Davis Vantage Pro)
export const VantageCurrentSchema = z.object({
  ts:            z.number(),
  wind_speed:    z.number().nullable(),
  wind_dir:      z.number().nullable(),
  temp_out:      z.number().nullable(),
  hum_out:       z.number().nullable(),
  rain_day_in:   z.number().nullable(),
  bar:           z.number().nullable(),
})

// Loose fallback — accepts anything, loses type guarantees
export const LooseSensorDataSchema = z.record(z.unknown())

export type IssData = z.infer<typeof IssDataSchema>
export type VantageCurrentData = z.infer<typeof VantageCurrentSchema>
```

These are best-guess schemas based on WeatherLink v2 documentation.
After running the integration against a real device, update these
schemas to match the actual response shape your station returns.
The `data` array in each sensor record may use different field names
depending on firmware version and sensor type configuration.

---

## Part 7 — Parse Pipeline

File: `lib/weatherlink/parse.ts`

```typescript
import { Effect, Option } from "effect"
import { IssDataSchema, LooseSensorDataSchema, type IssData } from "./schemas"
import { ParseError } from "./errors"
import { emitParseWarning } from "@/lib/server/notifications"
import type { CurrentConditions } from "./transforms"
import { transformIssToCurrentConditions, manualTransform } from "./transforms"

// data_structure_type for ISS sensor
const ISS_TYPE = 10

function parseSingleRecord(
  raw: unknown
): Effect.Effect<CurrentConditions, ParseError> {
  // Fast path — strict schema
  const strict = IssDataSchema.safeParse(raw)
  if (strict.success) {
    return Effect.succeed(transformIssToCurrentConditions(strict.data))
  }

  // Fallback — loose schema + manual transform + admin warning
  const loose = LooseSensorDataSchema.safeParse(raw)
  if (!loose.success) {
    return Effect.fail(
      new ParseError({ cause: loose.error, raw })
    )
  }

  return Effect.succeed(manualTransform(loose.data)).pipe(
    Effect.tap(result =>
      // andTee equivalent in Effect: tap swallows errors from the side effect
      Effect.sync(() =>
        emitParseWarning({
          raw,
          parsed: result,
          strictErrors: strict.error.issues,
          message: "Sensor response fell back to loose schema — review strict types",
        })
      )
    )
  )
}

export function parseCurrentConditions(
  sensors: Array<{ data_structure_type: number; data: unknown[] }>
): Effect.Effect<CurrentConditions, ParseError> {
  // Find the ISS sensor record
  const issRecord = sensors.find(s => s.data_structure_type === ISS_TYPE)

  if (!issRecord || issRecord.data.length === 0) {
    return Effect.fail(
      new ParseError({
        cause: new Error("No ISS sensor data found"),
        raw: sensors,
      })
    )
  }

  // Current conditions are the most recent data point
  const latest = issRecord.data[issRecord.data.length - 1]
  return parseSingleRecord(latest)
}
```

---

## Part 8 — WeatherLink Service

File: `lib/weatherlink/service.ts`

```typescript
import { Effect, Schedule, Duration } from "effect"
import { wlClient } from "./client"
import { parseCurrentConditions } from "./parse"
import {
  NetworkError, AuthFailedError, RateLimitedError,
  StationNotFoundError, UpstreamError,
  type WeatherLinkError,
} from "./errors"
import type { CurrentConditions } from "./transforms"
import { serverEnv } from "@/lib/env.server"

function handleFetchError(cause: unknown): WeatherLinkError {
  if (cause instanceof TypeError) return new NetworkError({ cause })
  return new NetworkError({ cause })
}

export function getCurrentConditions(
  stationId: string
): Effect.Effect<CurrentConditions, WeatherLinkError> {
  return Effect.tryPromise({
    try:   () => wlClient.getCurrentConditions({ params: { stationId } }),
    catch: handleFetchError,
  }).pipe(
    Effect.flatMap(res => {
      if (res.status === 200) {
        return parseCurrentConditions(res.body.sensors)
      }
      if (res.status === 401 || res.status === 403) {
        return Effect.fail(new AuthFailedError({ status: res.status }))
      }
      if (res.status === 404) {
        return Effect.fail(new StationNotFoundError({ stationId }))
      }
      if (res.status === 429) {
        const retryAfter = Number(
          (res as unknown as Response).headers?.get("Retry-After")
        ) || undefined
        return Effect.fail(new RateLimitedError({ retryAfter }))
      }
      return Effect.fail(new UpstreamError({ status: res.status }))
    }),
    // Retry transient errors with exponential backoff — not auth failures
    Effect.retry(
      Schedule.exponential(Duration.seconds(1)).pipe(
        Schedule.intersect(Schedule.recurs(2)),
        Schedule.whileInput((e: WeatherLinkError) =>
          e._tag === "NetworkError" || e._tag === "UpstreamError"
        )
      )
    )
  )
}
```

---

## Part 9 — Admin Notifications

File: `lib/server/notifications.ts`

```typescript
import { randomUUID } from "node:crypto"

export type NotificationLevel = "warn" | "error"
export type NotificationTag =
  | "parse_fallback"
  | "auth_failed"
  | "rate_limited"
  | "stale_data"
  | "network_error"

export interface SystemNotification {
  id: string
  level: NotificationLevel
  tag: NotificationTag
  message: string
  context: Record<string, unknown>
  timestamp: string
  acknowledged: boolean
}

// Ring buffer — keeps last 100, drops oldest
const MAX_NOTIFICATIONS = 100
const store: SystemNotification[] = []

export function emitNotification(
  n: Omit<SystemNotification, "id" | "timestamp" | "acknowledged">
): void {
  const notification: SystemNotification = {
    ...n,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    acknowledged: false,
  }
  store.push(notification)
  if (store.length > MAX_NOTIFICATIONS) store.shift()
}

export function emitParseWarning(context: {
  raw: unknown
  parsed: unknown
  strictErrors: unknown[]
  message: string
}): void {
  emitNotification({
    level: "warn",
    tag: "parse_fallback",
    message: context.message,
    context: {
      strictErrorCount: context.strictErrors.length,
      strictErrors: context.strictErrors.slice(0, 3), // first 3 only
      parsedKeys: Object.keys(context.parsed as object ?? {}),
    },
  })
}

export function getNotifications(): SystemNotification[] {
  return [...store].reverse()  // most recent first
}

export function getUnacknowledgedCount(): number {
  return store.filter(n => !n.acknowledged).length
}

export function acknowledgeNotification(id: string): void {
  const n = store.find(n => n.id === id)
  if (n) n.acknowledged = true
}

export function clearAllNotifications(): void {
  store.length = 0
}
```

---

## Part 10 — Hono App and Routes

File: `lib/server/routes/weather.ts`

```typescript
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { Effect } from "effect"
import { getCurrentConditions } from "@/lib/weatherlink/service"
import { emitNotification } from "@/lib/server/notifications"
import { mapErrorToStatus, mapErrorToResponse } from "@/lib/weatherlink/errors"

const weather = new Hono()
  .get(
    "/current",
    zValidator("query", z.object({ stationId: z.string() })),
    async c => {
      const { stationId } = c.req.valid("query")

      const exit = await Effect.runPromiseExit(
        getCurrentConditions(stationId)
      )

      if (exit._tag === "Success") {
        return c.json(exit.value, 200)
      }

      const error = exit.cause._tag === "Fail"
        ? exit.cause.error
        : null

      if (error) {
        // Emit admin notification for non-transient errors
        if (
          error._tag === "AuthFailedError" ||
          error._tag === "RateLimitedError"
        ) {
          emitNotification({
            level: "error",
            tag: error._tag === "AuthFailedError"
              ? "auth_failed"
              : "rate_limited",
            message: `WeatherLink ${error._tag} for station ${stationId}`,
            context: { stationId, error: error._tag },
          })
        }
        return c.json(mapErrorToResponse(error), mapErrorToStatus(error))
      }

      return c.json({ error: "UnknownError" }, 500)
    }
  )

export type WeatherRouteType = typeof weather
export default weather
```

File: `lib/server/routes/notifications.ts`

```typescript
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import {
  getNotifications,
  getUnacknowledgedCount,
  acknowledgeNotification,
  clearAllNotifications,
} from "@/lib/server/notifications"

const notifications = new Hono()
  .get("/",           c => c.json(getNotifications()))
  .get("/count",      c => c.json({ count: getUnacknowledgedCount() }))
  .post("/:id/acknowledge",
    zValidator("param", z.object({ id: z.string() })),
    c => {
      acknowledgeNotification(c.req.valid("param").id)
      return c.json({ ok: true })
    }
  )
  .delete("/",        c => { clearAllNotifications(); return c.json({ ok: true }) })

export type NotificationsRouteType = typeof notifications
export default notifications
```

File: `lib/server/app.ts`

```typescript
import { Hono } from "hono"
import { cors } from "hono/cors"
import { clientEnv } from "@/lib/env.client"
import weather from "./routes/weather"
import notifications from "./routes/notifications"

// Zero Next.js imports — fully portable
// Swap the adapter in app/api/[[...route]]/route.ts to migrate runtimes
const app = new Hono()
  .basePath("/api")
  .use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      // TODO: add production domain when deploying
    ],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  }))
  .route("/weather",              weather)
  .route("/admin/notifications",  notifications)

export type AppType = typeof app
export default app
```

File: `app/api/[[...route]]/route.ts`

```typescript
// This is the ONLY Next.js-specific file in the server layer.
// To migrate to TanStack Start: replace with app/api/weather.ts
//   using createAPIFileRoute and app.fetch(request)
// To migrate to React Router v7: replace with app/routes/api.$.ts
//   using loader/action and app.fetch(request)
import { handle } from "@hono/vercel"
import app from "@/lib/server/app"

export const { GET, POST } = handle(app)
```

---

## Part 11 — Hono RPC Client

File: `lib/rpc/client.ts`

```typescript
import { hc } from "hono/client"
import type { AppType } from "@/lib/server/app"
import { clientEnv } from "@/lib/env.client"

// Singleton — one instance for the whole browser session
export const rpc = hc<AppType>(
  clientEnv.VITE_APP_URL ?? "",
  { headers: { "Content-Type": "application/json" } }
)
```

---

## Part 12 — Live Weather Hook

File: `lib/hooks/use-weather-live.ts`

Replace the existing stub with the full implementation:

```typescript
import { useQuery } from "@tanstack/react-query"
import { hc, type InferResponseType } from "hono/client"
import type { AppType } from "@/lib/server/app"
import { WEATHER } from "@/lib/mock-data"
import { transformMockToCurrentConditions } from "@/lib/weatherlink/transforms"
import { clientEnv } from "@/lib/env.client"

const rpc = hc<AppType>(clientEnv.VITE_APP_URL ?? "")

export type CurrentConditions = InferResponseType<
  typeof rpc.api.weather.current.$get, 200
>

export function useCurrentConditions(stationId: string) {
  return useQuery({
    queryKey:        ["weather", "current", stationId],
    queryFn:         async () => {
      const res = await rpc.api.weather.current.$get(
        { query: { stationId } }
      )
      if (!res.ok) throw new Error(`WeatherLink proxy ${res.status}`)
      return res.json()
    },
    placeholderData: transformMockToCurrentConditions(WEATHER),
    refetchInterval: 60_000,
    staleTime:       55_000,
    retry:           2,
  })
}
```

---

## Part 13 — Wire Weather Charts

Find every component with a `// TODO(live-weather):` comment.
Replace `useChartData(block)` with `useCurrentConditions` for
weather-specific dataKeys.

Pattern for each weather chart component:

```typescript
// Before (mock only):
const data = useChartData(block) as WeatherData

// After (live with mock fallback):
const { data, isPlaceholderData } = useCurrentConditions(
  clientEnv.VITE_WL_STATION_ID ?? ""
)

// Add indicator badge to card header:
{isPlaceholderData && (
  <span className="text-xs text-muted-foreground tabular-nums">
    MOCK
  </span>
)}
```

Derive individual chart values from `CurrentConditions`:
- GaugeArc wind speed: `data.windSpeed`
- GaugeArc THW index: `data.twhIndex`
- CompassChart: `data.windBearing`
- WeatherStatCard rain: `data.currentRain`
- WeatherStatCard sunrise: `data.sunrise` + `data.sunset`
- WeatherStatCard moon: `data.moonPhase` + `data.moonIllumination`
- WeatherStatCard forecast: `data.forecast`
- LineChart barometer: `data.barometer`
- AreaChart temp trend: `data.tempTrend`
- BulletChart total rain: `data.totalRain`
- CalendarHeatmap rain: `data.rainCalendar`

Remove the `// TODO(live-weather):` comment from each component
after wiring. When all are removed, no TODO comments referencing
live-weather should remain in the codebase.

---

## Part 14 — transforms.ts Completion

File: `lib/weatherlink/transforms.ts`

The stub already has `transformMockToCurrentConditions` and
the `CurrentConditions` interface. Complete the file:

```typescript
import type { IssData } from "./schemas"

// Replaces the placeholder CurrentConditions interface in the stub.
// This derives the real type from Hono's InferResponseType —
// but since transforms.ts is imported by the hook which imports AppType,
// there's a circular dependency risk. Keep CurrentConditions as a
// manually maintained interface here, and verify it matches
// InferResponseType<typeof rpc.api.weather.current.$get, 200>
// in use-weather-live.ts. They must be structurally identical.

export function transformIssToCurrentConditions(
  data: IssData
): CurrentConditions {
  return {
    windSpeed:        data.wind_speed_last ?? 0,
    windBearing:      data.wind_dir_last ?? 0,
    twhIndex:         data.thw_index ?? 0,
    humidity:         data.hum_out ?? 0,
    barometer:        [],   // populated from historic data, not current
    tempTrend:        [],   // populated from historic data, not current
    tempGrouped: {
      outside:   data.temp_out ?? 0,
      heatIndex: data.heat_index ?? 0,
      wetBulb:   data.wet_bulb ?? 0,
    },
    currentRain: {
      day:   data.rainfall_daily_mm ?? 0,
      storm: 0,   // not in ISS type 10 current record
      rate:  data.rainfall_rate_hi_mm_per_hr ?? 0,
    },
    totalRain: {
      actual:  data.rainfall_daily_mm ?? 0,
      target:  10,
      ranges:  [20, 10, 6],
      unit:    "mm",
    },
    rainCalendar:     [],   // populated from historic data
    sunrise:          data.sunrise
                        ? formatUnixTime(data.sunrise)
                        : "06:00",
    sunset:           data.sunset
                        ? formatUnixTime(data.sunset)
                        : "18:00",
    moonPhase:        data.moon_phase_icon ?? "Unknown",
    moonIllumination: 0,   // not in WeatherLink v2 standard response
    forecast: {
      condition: "N/A",
      temp:      data.temp_out ?? 0,
      humidity:  data.hum_out ?? 0,
    },
  }
}

export function manualTransform(
  raw: Record<string, unknown>
): CurrentConditions {
  // Best-effort transform for unknown sensor record shapes.
  // Field name guesses based on WeatherLink v2 documentation.
  // Update these mappings after inspecting real device responses.
  return {
    windSpeed:        Number(raw["wind_speed_last"] ?? raw["wind_speed"] ?? 0),
    windBearing:      Number(raw["wind_dir_last"] ?? raw["wind_dir"] ?? 0),
    twhIndex:         Number(raw["thw_index"] ?? raw["temp_out"] ?? 0),
    humidity:         Number(raw["hum_out"] ?? raw["humidity"] ?? 0),
    barometer:        [],
    tempTrend:        [],
    tempGrouped: {
      outside:   Number(raw["temp_out"] ?? 0),
      heatIndex: Number(raw["heat_index"] ?? 0),
      wetBulb:   Number(raw["wet_bulb"] ?? 0),
    },
    currentRain: {
      day:   Number(raw["rainfall_daily_mm"] ?? raw["rain_day_in"] ?? 0),
      storm: 0,
      rate:  Number(raw["rainfall_rate_hi_mm_per_hr"] ?? 0),
    },
    totalRain: {
      actual: Number(raw["rainfall_daily_mm"] ?? 0),
      target: 10,
      ranges: [20, 10, 6],
      unit:   "mm",
    },
    rainCalendar:     [],
    sunrise:          "06:00",
    sunset:           "18:00",
    moonPhase:        String(raw["moon_phase_icon"] ?? "Unknown"),
    moonIllumination: 0,
    forecast: {
      condition: "N/A",
      temp:      Number(raw["temp_out"] ?? 0),
      humidity:  Number(raw["hum_out"] ?? 0),
    },
  }
}

function formatUnixTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Manila",
  })
}
```

---

## Acceptance Criteria

- `lib/env.server.ts` exports `serverEnv` with all three WL vars
- `lib/weatherlink/auth.ts` builds correct HMAC-signed URLs
- `lib/weatherlink/contract.ts` defines all three WL endpoints
- `lib/weatherlink/client.ts` injects HMAC auth via `api` option
- `lib/weatherlink/schemas.ts` has strict + loose schemas
- `lib/weatherlink/parse.ts` tries strict first, falls back to loose,
  emits parse warning via `Effect.tap` on fallback path
- `lib/weatherlink/service.ts` retries on NetworkError/UpstreamError
  only — not on AuthFailedError or RateLimitedError
- `lib/server/notifications.ts` ring buffer capped at 100 entries
- Hono app has no Next.js imports — fully portable
- `app/api/[[...route]]/route.ts` is the only Next.js-specific file
- `lib/rpc/client.ts` singleton uses `hc<AppType>`
- `lib/hooks/use-weather-live.ts` stub is replaced with full implementation
- `placeholderData` renders mock data synchronously on first mount
- `isPlaceholderData` shows MOCK indicator until live data arrives
- MOCK indicator disappears when live data resolves
- All `// TODO(live-weather):` comments removed from chart components
- `/api/weather/current?stationId=X` returns 200 with live data
- `/api/weather/current?stationId=X` returns 502 with structured error
  when WL credentials are wrong (not 401)
- `/api/admin/notifications` returns parse warnings after fallback fires
- TypeScript strict mode passes with no errors
- No `@radix-ui/*` imports introduced
- No direct `next/navigation` imports — all routing via `@/lib/routing`
- No direct `import.meta.env` or `process.env` in components —
  always via `clientEnv` or `serverEnv`
