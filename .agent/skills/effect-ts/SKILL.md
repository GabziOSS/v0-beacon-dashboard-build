---
name: effect-ts
description: Effect-TS - Functional effect system for TypeScript. Build robust applications with effects, fibers, services, and schema validation.
tags: [typescript, functional-programming, effect-system, concurrency]
---

# Effect-TS

## Philosophy

Effect-TS is a functional programming library that treats side effects as values. Instead of throwing exceptions or using try/catch, you describe effects as data that can be composed, transformed, and executed safely.

**Core benefits:**

- Type-safe error handling without exceptions
- Composable effects through a powerful monad
- Built-in concurrency and resource management
- Dependency injection through Context/Layers
- Schema validation built-in

```typescript
import { Effect, Context, Layer, Schema } from 'effect'

// Effects describe WHAT to do, not HOW to do it
const program = Effect.gen(function* () {
  const user = yield* fetchUser('123')
  return user.name
})
```

---

## Core Types

### Effect\<A, E, R\>

The core type: `Effect<Success, Error, Requirements>`

```typescript
import { Effect } from 'effect'

// Success type only (pure)
const pure: Effect<string> = Effect.succeed('hello')

// Success + Error
const withError: Effect<string, Error> = Effect.fail(new Error('oops'))

// Success + Error + Requirements (dependencies)
const withDeps: Effect<string, Error, Database> = Effect.gen(function* () {
  const db = yield* Database
  return db.query('SELECT * FROM users')
})
```

### Context\<T\>

Dependency container - holds services that effects can require.

```typescript
import { Context } from 'effect'

interface Logger {
  readonly log: (message: string) => void
}

const Logger = Context.GenericTag<Logger>('Logger')
```

### Layer\<Out, E, In\>

Provides dependencies: `Layer<Produces, Error, Requires>`

```typescript
import { Layer } from 'effect'

const LiveLogger = Layer.effect(
  Logger,
  Effect.gen(function* () => ({
    log: (msg: string) => console.log(msg)
  }))
)
```

### Fiber\<A, E\>

Represents a running effect - enables concurrency, interruption, and racing.

---

## Basic Operations

### Effect.gen (async generators)

The main way to write effects - looks like sync code.

```typescript
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const a = yield* Effect.succeed(1)
  const b = yield* Effect.succeed(2)
  return a + b
})
```

### map / flatMap

Transform success values or chain effects.

```typescript
// map - transform the success value
const doubled = Effect.succeed(5).pipe(Effect.map(n => n * 2)) // Effect<number>

// flatMap - chain effects (like Promise.then)
const chained = Effect.succeed(5).pipe(Effect.flatMap(n => Effect.succeed(n * 2)))
```

### tap

Run side effects without changing the value.

```typescript
const withLogging = Effect.succeed(42).pipe(Effect.tap(n => Effect.log(`Got value: ${n}`)))
```

### all / forEach

Run multiple effects.

```typescript
import { Effect } from 'effect'

// Sequential
const sequential = Effect.gen(function* () {
  const a = yield* Effect.succeed(1)
  const b = yield* Effect.succeed(2)
  return [a, b]
})

// Parallel (all)
const parallel = Effect.all([Effect.succeed(1), Effect.succeed(2)]) // Effect<[1, 2]>

// Parallel with forEach
const results =
  yield * Effect.forEach([1, 2, 3], n => Effect.succeed(n * 2), { concurrency: 'unbounded' })
```

---

## Error Handling

### catchAll / catch

Catch and handle errors.

```typescript
import { Effect } from 'effect'

const withCatch = Effect.succeed('hello').pipe(
  Effect.map(s => s.toUpperCase()),
  Effect.map(s => {
    if (s === 'HELLO') throw new Error('no hello allowed')
    return s
  }),
  Effect.catchAll(error => Effect.succeed('fallback'))
)
```

### catchTag

Catch specific error types.

```typescript
class DatabaseError extends Error {
  readonly _tag = 'DatabaseError'
}

class NetworkError extends Error {
  readonly _tag = 'NetworkError'
}

const handled = Effect.fail(new DatabaseError('connection failed')).pipe(
  Effect.catchTag('DatabaseError', () => Effect.succeed('using cache')),
  Effect.catchTag('NetworkError', () => Effect.succeed('offline mode'))
)
```

### orElse / orElseFail

Provide fallback on failure.

```typescript
const fallback = Effect.fail(new Error('oops')).pipe(
  Effect.orElse(() => Effect.succeed('default value'))
)

const orElseFail = Effect.fail(new Error('oops')).pipe(
  Effect.orElseFail(() => new Error('transformed'))
)
```

### retry

Retry failed effects.

```typescript
const retried = Effect.fail(new Error(' transient')).pipe(
  Effect.retry({
    times: 3,
    delay: { type: 'fixed', delay: 1000 },
    while: error => error.message.includes('transient'),
  })
)
```

---

## Concurrency

### parallel vs sequential

```typescript
import { Effect } from 'effect'

// Sequential (default)
const seq = Effect.forEach([1, 2, 3], n => Effect.succeed(n * 2))

// Parallel
const par = Effect.forEach([1, 2, 3], n => Effect.succeed(n * 2), { concurrency: 'unbounded' })

// With max concurrency
const limited = Effect.forEach([1, 2, 3, 4, 5], n => Effect.succeed(n * 2), { concurrency: 2 })
```

### race / fork

Race effects or run in background.

```typescript
// Race - first to succeed wins
const winner = Effect.race(
  Effect.sleep(1000).pipe(Effect.as('slow')),
  Effect.sleep(100).pipe(Effect.as('fast'))
)

// Fork - run in background, get Fiber
const fiber = Effect.succeed('background task').pipe(Effect.fork())

// Join fiber later
const result = Effect.gen(function* () {
  const fiber = yield* Effect.fork(Effect.log('running...'))
  // ... do other things
  return yield* Effect.join(fiber)
})
```

### interrupt

Cancel running effects.

```typescript
const cancellable = Effect.gen(function* () {
  const fiber = yield* Effect.fork(Effect.loop(0, { while: () => true, body: n => Effect.log(n) }))

  yield* Effect.sleep(100)
  yield* Effect.interrupt(fiber)
})
```

---

## Services & Dependency Injection

### Defining Services

```typescript
import { Context, Effect, Layer } from 'effect'

// Service interface
interface Database {
  readonly query: <T>(sql: string) => Effect.Effect<T, Error>
  readonly close: () => Effect.Effect<void>
}

// Create a tag for the service
const Database = Context.GenericTag<Database>('Database')
```

### Implementing Layers

```typescript
// Live implementation
const LiveDatabase = Layer.effect(
  Database,
  Effect.gen(function* () {
    const pool = yield* Effect.acquireRelease(Effect.succeed(createPool()), pool =>
      Effect.succeed(pool.close())
    )

    return {
      query: <T>(sql: string) => Effect.succeed(pool.query<T>(sql)),
      close: () => Effect.succeed(pool.close()),
    }
  })
)

// Test/mock implementation
const MockDatabase = Layer.succeed(Database, {
  query: <T>(_sql: string) => Effect.succeed([] as T),
  close: () => Effect.succeed(undefined),
})
```

### Using Services in Effects

```typescript
const getUsers = Effect.gen(function* () {
  const db = yield* Database
  return db.query<User[]>('SELECT * FROM users')
})
```

### Composing Layers

```typescript
// Full application layer
const AppLayer = Layer.provide(HttpServerLive, Layer.merge(DatabaseLive, LoggerLive))

// Run with all dependencies
Effect.runPromise(Effect.provideProgramEffect(program, AppLayer))
```

---

## Schema Validation

### Basic Usage

```typescript
import { Schema } from 'effect'

const UserSchema = Schema.Struct({
  id: Schema.String,
  email: Schema.String.pipe(Schema.brand('email')),
  age: Schema.Number.pipe(Schema.optional),
})

// Parse returns Effect
const parsed = Schema.parse(UserSchema)({
  id: '123',
  email: 'user@example.com',
})
```

### Transformations

```typescript
const UserOutput = Schema.Struct({
  id: Schema.String,
  email: Schema.String,
  createdAt: Schema.Date,
}).pipe(
  Schema.transform(
    Schema.String,
    user => JSON.stringify(user),
    json => JSON.parse(json)
  )
)
```

### Validated Transformations

```typescript
const EmailSchema = Schema.String.pipe(
  Schema.filter(email => email.includes('@'), {
    message: () => 'Invalid email',
  })
)
```

---

## Running Effects

### runPromise

```typescript
import { Effect } from 'effect'

const program = Effect.log('Hello').pipe(Effect.as('world'))

Effect.runPromise(program).then(console.log) // "world"
```

### runPromiseExit

```typescript
// Get detailed exit result
Effect.runPromiseExit(program).then(result => {
  if (result._tag === 'Success') {
    console.log(result.value)
  } else {
    console.error(result.error)
  }
})
```

### runSync

For pure effects.

```typescript
const pure = Effect.succeed(42)
Effect.runSync(pure) // 42
```

---

## Common Patterns

### HTTP Server (http.Server)

```typescript
import { Effect, Layer } from 'effect'
import { HttpServer } from "@effect/platform"

const HttpServerLive = HttpServer.serve(
  Effect.gen(function* (_req) {
    return HttpServer.response JSON({ hello: "world" })
  })
).pipe(
  Layer.effect(
    HttpServer.Server,
    Effect.map(server => ({ ...server, port: 3000 }))
  ),
  Layer.unwrapEffect,
  Layer.provide(HttpServer.layer)
)
```

### Configuration

```typescript
import { Config, Effect } from 'effect'

const ConfigSchema = Schema.Struct({
  port: Schema.Number,
  databaseUrl: Schema.String,
  apiKey: Schema.String.pipe(Schema.secret),
})

const config = Config.all({
  port: Config.number('PORT').pipe(Config.withDefault(3000)),
  databaseUrl: Config.string('DATABASE_URL'),
  apiKey: Config.string('API_KEY').pipe(Config.secret),
})

const program = Effect.gen(function* () {
  const { port, databaseUrl } = yield* Config
  // use config
})
```

---

## Gotchas

1. **Effects are lazy** - Nothing runs until you call `runPromise`
2. **Dependencies must be provided** - Effects requiring services won't run without Layers
3. **FiberScope matters** - Use `Effect.scoped` for resources that need cleanup
4. **Error types should be specific** - Catch specific errors, not generic `Error`
5. **Context is immutable** - Can't modify context, must provide new layers
6. **Schema.parse returns Effect** - Not synchronous, even for sync validation
7. **Don't mix with throw** - Pick one error strategy (Effect) per code path
8. **Looping** - Use `Effect.loop` not `while` for effects

---

## Adherence Checklist

Before completing your task, verify:

- [ ] All effects use Effect type, not throw
- [ ] Dependencies defined via Context tags
- [ ] Layers provide all required dependencies
- [ ] Error handling uses catchTag for specific errors
- [ ] Resources wrapped in acquireRelease
- [ ] Concurrency appropriate (parallel when safe)
- [ ] Schema used for input validation
- [ ] No mixing throw/Effect in same code path
- [ ] Effects run with correct Layer
