---
name: railway-programming
description: Railway-Oriented Programming with neverthrow Result types and remeda functional utilities
tags: [typescript, functional, error-handling, neverthrow, remeda]
---

# Railway-Oriented Programming

## Philosophy

Railway-Oriented Programming (ROP) treats errors as values, not exceptions. Think of a railway track with two paths:
- **Success track** (the happy path)
- **Failure track** (error path)

Instead of throwing exceptions that must be caught at every level, functions return `Result<T, E>` that represents either success or failure.

---

## neverthrow — Result Types

### Core Concepts

```typescript
import { ok, err, Result } from 'neverthrow'

// Success — wrapped in ok()
const success: Result<string, Error> = ok('hello')

// Failure — wrapped in err()
const failure: Result<string, Error> = err(new Error('something went wrong'))
```

### Basic Patterns

#### Creating Results

```typescript
// From try/catch
async function fetchUser(id: string): Promise<Result<User, Error>> {
  try {
    const user = await db.users.find(id)
    return ok(user)
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)))
  }
}

// From validation
function parseAge(input: unknown): Result<number, Error> {
  if (typeof input !== 'number') {
    return err(new Error('Invalid age'))
  }
  if (input < 0 || input > 150) {
    return err(new Error('Age out of range'))
  }
  return ok(input)
}
```

#### Transforming with map/mapErr

```typescript
// map — transform the success value
const result: Result<User, Error> = ok({ id: 1, name: 'Alice' })
const name: Result<string, Error> = result.map(user => user.name)

// mapErr — transform the error
const errorResult: Result<User, Error> = err(new Error('DB error'))
const wrappedError: Result<User, Error> = errorResult.mapErr(e => 
  new Error(`Failed to fetch user: ${e.message}`)
)
```

#### Chaining with andThen

```typescript
// andThen — chain operations that can fail
function getUser(id: string): Result<User, Error> { ... }
function getPosts(userId: string): Result<Post[], Error> { ... }

const userResult = getUser('123')
const postsResult = userResult.andThen(user => getPosts(user.id))

// Pipeline style (more readable)
const result = getUser('123')
  .andThen(user => getPosts(user.id))
  .andThen(posts => ok(posts.length))
```

#### Matching on Result

```typescript
const result = fetchUser('123')

// match — handle both cases
result.match(
  (user) => console.log(`Found: ${user.name}`),
  (error) => console.error(`Error: ${error.message}`)
)

// orElse — recover from error
const recovered = result.orElse(error => {
  console.error(error)
  return ok(defaultUser)
})
```

### Async Operations with ResultAsync

```typescript
import { ResultAsync, ok, err } from 'neverthrow'

// ResultAsync — for async operations
async function fetchUser(id: string): Promise<Result<User, Error>> {
  // ... same as before
}

// Convert Promise<Result> to ResultAsync
const resultAsync = ResultAsync.fromPromise(
  fetch('https://api.example.com/user')
    .then(r => r.json()),
  () => new Error('Network error')
)

// Chain async operations
const finalResult = await resultAsync
  .andThen(user => ResultAsync.fromPromise(saveUser(user), e => e))
```

### Advanced Patterns

#### Combining Multiple Results

```typescript
import { combine, combineWithAllErrors } from 'neverthrow'

// all — fail fast (stop on first error)
const results = [ok(1), ok(2), ok(3)]
const all = Result.all(results)  // ok([1, 2, 3])

// combineWithAllErrors — collect all errors
const withErrors = [ok(1), err(Error1), ok(2), err(Error2)]
const combined = combineWithAllErrors(withErrors)
// err([Error2, Error1]) — all errors collected
```

#### Railway Pattern: Validation → Transformation → Persistence

```typescript
type ValidationError = { field: string; message: string }

function validateInput(input: unknown): Result<UserInput, ValidationError[]> {
  const errors: ValidationError[] = []
  
  if (!input.name) errors.push({ field: 'name', message: 'Required' })
  if (!input.email) errors.push({ field: 'email', message: 'Required' })
  if (!input.email.includes('@')) errors.push({ field: 'email', message: 'Invalid' })
  
  return errors.length > 0 ? err(errors) : ok(input as UserInput)
}

function transformToUser(input: UserInput): Result<User, Error> {
  return ok({
    id: uuid(),
    name: input.name,
    email: input.email.toLowerCase(),
    createdAt: new Date()
  })
}

async function saveUser(user: User): Promise<Result<User, Error>> {
  try {
    await db.users.insert(user)
    return ok(user)
  } catch (e) {
    return err(e instanceof Error ? e : new Error('Save failed'))
  }
}

// Pipeline
const result = await validateInput(rawInput)
  .map(transformToUser)
  .andThen(user => ResultAsync.fromPromise(saveUser(user), e => e))
```

---

## remeda — Functional Utilities

### Core Concepts

```typescript
import { pipe, pipeAsync } from 'remeda'

// Pipe-first — data flows left to right
const result = pipe(
  users,
  filter(u => u.active),
  map(u => u.name),
  sortBy(['name'])
)

// vs lodash: _.sortBy(_.map(_.filter(users, 'active')), 'name')
```

### Type Inference

```typescript
// remeda preserves types through pipelines
const users = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]

// TypeScript knows exact types at each step
pipe(
  users,
  filter(u => u.age > 20),     // (u: { name: string; age: number }) => boolean
  map(u => u.name)              // (u: { name: string; age: number }) => string
)
// Returns: string[]
```

### Common Array Operations

```typescript
import { 
  filter, map, flatMap, reduce, find, findIndex,
  sortBy, orderBy, groupBy, uniq, uniqBy,
  take, drop, chunk, shuffle
} from 'remeda'

// filter, map, reduce — with full type inference
pipe(
  users,
  filter(u => u.active),
  map(u => u.name),
  map(name => name.toUpperCase())
)

// groupBy — creates dictionary
pipe(
  users,
  groupBy(u => u.department)
)
// { engineering: [...], sales: [...] }

// uniqBy — deduplicate by property
pipe(
  items,
  uniqBy(i => i.id)
)
```

### Object Operations

```typescript
import { 
  pick, omit, merge, keys, values, entries,
  mapValues, mapKeys
} from 'remeda'

// pick/omit — TypeScript aware
const user = { id: 1, name: 'Alice', password: 'secret' }
pick(user, ['id', 'name'])  // { id: number; name: string }
omit(user, ['password'])     // { id: number; name: string }

// mapValues — transform values, preserve keys
pipe(
  { a: 1, b: 2 },
  mapValues(n => n * 10)  // { a: 10, b: 20 }
)
```

### Async Pipelines

```typescript
import { pipeAsync, mapAsync, filterAsync, flatMapAsync } from 'remeda'

// Async pipeline
const results = await pipeAsync(
  [1, 2, 3],
  mapAsync(async n => fetchUser(n)),  // parallel by default
  filterAsync(async r => r.ok),         // filter failed
  mapAsync(r => r.value)
)
```

---

## Patterns: Combining neverthrow + remeda

### Validation Pipeline

```typescript
import { pipe } from 'remeda'
import { ok, err, Result } from 'neverthrow'

type FormErrors = Record<string, string>

function validateForm(data: RawForm): Result<ValidForm, FormErrors> {
  const errors: FormErrors = {}
  
  if (!data.email.includes('@')) errors.email = 'Invalid email'
  if (data.password.length < 8) errors.password = 'Too short'
  
  return Object.keys(errors).length > 0 
    ? err(errors) 
    : ok({ email: data.email, password: data.password })
}

function hashPassword(form: ValidForm): ValidForm & { passwordHash: string } {
  return { ...form, passwordHash: hash(form.password) }
}

// Pipeline
pipe(
  rawForm,
  validateForm,
  map(hashPassword),
  map(saveUser)
)
```

### Error Aggregation

```typescript
import { combineWithAllErrors } from 'neverthrow'
import { pipe } from 'remeda'

function validateField(field: string, value: unknown): Result<unknown, string> {
  switch (field) {
    case 'email': return /.+@.+/.test(value) ? ok(value) : err('Invalid email')
    case 'age': return typeof value === 'number' && value > 0 ? ok(value) : err('Invalid age')
    default: return ok(value)
  }
}

// Validate all fields, collect errors
function validateAll(data: Record<string, unknown>): Result<Record<string, unknown>, string[]> {
  const results = pipe(
    Object.entries(data),
    map(([field, value]) => validateField(field, value).mapErr(e => `${field}: ${e}`))
  )
  
  return combineWithAllErrors(results).map(values => 
    Object.fromEntries(pipe(
      values,
      map(([k, v]) => [k, v])
    ))
  )
}
```

---

## Gotchas

### neverthrow

- **Don't mix Result with throw** — pick one error strategy per codebase section
- **ResultAsync.map is eager** — it runs immediately, not lazily
- **Async pipelines require ResultAsync** — can't chain regular Result in async flows
- **Error types should be specific** — `Error` is too generic for actionable handling
- **mapErr doesn't short-circuit** — it transforms errors, but doesn't stop the chain

### remeda

- **pipe order matters** — remeda is pipe-first, not last (unlike lodash)
- **mapAsync runs in parallel by default** — use `forEach` for sequential
- **groupBy returns plain object** — not a Map, keys are strings
- **inplace functions are rare** — most return new arrays/objects
- **Type inference works best with type annotations** — for complex pipelines, add types

### Combined

- **Performance** — Result wrapping adds overhead in hot paths (use sparingly in tight loops)
- **Serialization** — Result types aren't automatically JSON-serializable
- **Stack traces** — Errors in Result may lose stack trace info

---

## Adherence Checklist

Before completing your task, verify:

- [ ] All expected failures return Result, not throw
- [ ] Error types are specific and actionable
- [ ] Async operations use ResultAsync consistently
- [ ] Pipeline composition is readable (not deeply nested)
- [ ] Error messages are helpful for debugging
- [ ] remeda pipe used instead of nested function calls
- [ ] Type inference is preserved through pipelines
- [ ] No mixing of throw/Result in same function chain
