---
name: advanced-typescript
description: Advanced TypeScript patterns for complex React/Next.js applications. Covers complex types, generics, inference, and architectural patterns.
tags: [typescript, types, generics, react, nextjs]
---

# Advanced TypeScript

## Type Inference

### Return Type Inference

```typescript
// Return type inferred from implementation
function getUser(id: string) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`)
}
// Return type: Promise<{ id: string; name: string } | undefined>
```

### Const Assertions

```typescript
// Freeze object shape
const config = {
  theme: 'dark',
  debug: true,
} as const

// Type becomes: { readonly theme: 'dark'; readonly debug: true }

// With array
const routes = ['/dashboard', '/settings', '/profile'] as const
// Type: readonly ['/dashboard', '/settings', '/profile']
```

### Satisfies

```typescript
// Validates against type while preserving inference
const theme = {
  primary: '#0070f3',
  secondary: '#7928ca',
} satisfies Record<string, string>
// theme.primary is typed as string, not string literal

// vs as const:
const theme1 = {
  primary: '#0070f3',
} as const
// theme1.primary is type '#0070f3' (literal)
```

---

## Generics

### Generic Constraints

```typescript
// Basic constraint
function get<T extends { id: string }>(item: T): T['id'] {
  return item.id
}

// Multiple constraints
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}

// Constraint with default
function createStore<T extends { id: string } = { id: string }>(initial?: T): Store<T> {
  return new Store(initial)
}
```

### Conditional Types

```typescript
// Extract return type from function
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never

// Get return type of async function
type AsyncReturn<T> = T extends Promise<infer R> ? R : T

// Practical example - extract array element or undefined
type ArrayElement<T> = T extends (infer U)[] ? U : never

type UserArray = User[]
type Element = ArrayElement<UserArray> // User
```

### Mapped Types

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// Add prefix to keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${K & string}`]: T[K]
}

// Transform keys
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<K & string>]: T[K]
}
```

---

## Template Literal Types

### String Manipulation

```typescript
// Extract path parameters
type Route = '/users/:id' | '/posts/:slug' | '/dashboard'

type ExtractParams<T> = T extends `${string}:${infer P}/${infer R}`
  ? P | ExtractParams<`/${R}`>
  : T extends `${string}:${infer P}`
    ? P
    : never

type Params = ExtractParams<Route>
// 'id' | 'slug'

// Create event handlers
type EventHandler<T extends string> = `on${Capitalize<T>}`

type Handlers = {
  [K in 'click' | 'focus' | 'blur' as EventHandler<K>]: () => void
}
// { onClick: () => void; onFocus: () => void; onBlur: () => void }
```

---

## Utility Types

### Custom Utilities

```typescript
// Deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// Remove null/undefined
type NonNullable<T> = T extends null | undefined ? never : T

// Extract function parameters
type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never

// Get value of union member
type ValueOf<T> = T[keyof T]
```

---

## React/Next.js Patterns

### Component Props

```typescript
// Variants with discriminated union
type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  variant: ButtonVariant
  children: React.ReactNode
} & ({ as?: 'button'; onClick?: () => void } | { as: 'a'; href: string })

// Generic component
function List<T, K extends keyof T>(
  items: T[],
  renderKey: K,
  renderItem: (item: T[K], item: T) => React.ReactNode
) {
  return items.map(item => renderItem(item[renderKey], item))
}
```

### Hook Types

```typescript
// Generic hook
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })

  return [value, setValue] as const
}

// Complex generic hook - fetch with typing
function useFetch<T>(url: string): {
  data: T | null
  loading: boolean
  error: Error | null
} {
  // ...
}
```

### Context with Generics

```typescript
// Typed context
type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// Usage with strict typing
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

---

## Error Handling Types

### Result Pattern

```typescript
// Neverthrow-style Result
type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E }

// Helper functions
const ok = <T>(value: T): Result<T, never> => ({
  success: true,
  value,
})

const err = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
})

// Usage
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Cannot divide by zero')
  return ok(a / b)
}
```

---

## Type Guards

### Custom Guards

```typescript
// Basic type guard
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// Narrowing union types
type User = { type: 'user'; name: string }
type Admin = { type: 'admin'; permissions: string[] }

function isAdmin(person: User | Admin): person is Admin {
  return person.type === 'admin'
}

// Guard for array
function isArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}
```

---

## Module Augmentation

### Global Types

```typescript
// Extend window
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void
    __NEXT_DATA__?: Record<string, any>
  }
}

// Extend import
declare module '*.svg' {
  const content: string
  export default content
}

// Extend Next.js
declare module 'next' {
  interface NextConfig {
    experimental?: {
      optimizePackageImports?: string[]
    }
  }
}
```

---

## Advanced Patterns

### Builder Pattern

```typescript
class QueryBuilder<T extends object = {}> {
  private query: Partial<T> = {}

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.query[key] = value
    return this
  }

  build(): Partial<T> {
    return { ...this.query }
  }
}

// Usage with type inference
const query = new QueryBuilder<User>().where('id', '123').where('active', true).build()
```

### Proxy for React

```typescript
function createProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop]
      if (typeof value === 'function') {
        return value.bind(obj)
      }
      return value
    },
  })
}
```

---

## Common Gotchas

1. **any vs unknown** - Always prefer `unknown` over `any`
2. **never type** - Use for exhaustive conditionals
3. **Inference fails** - Add explicit type annotations when inference doesn't work
4. **Circular types** - Use interface extensions, not circular type aliases
5. **as vs satisfies** - Use `satisfies` when you want both inference + validation
6. **keyof** - Returns `string | number | symbol`, not just strings
7. **Return type inference** - May need explicit return types for complex functions

---

## Adherence Checklist

- [ ] Use `satisfies` over `as` when appropriate
- [ ] Leverage type inference before adding explicit types
- [ ] Use `const` assertions for literal types
- [ ] Prefer conditional types over union hunting
- [ ] Keep error types specific, not generic `Error`
- [ ] Use template literal types for string patterns
- [ ] Augment global types properly with `declare global`
