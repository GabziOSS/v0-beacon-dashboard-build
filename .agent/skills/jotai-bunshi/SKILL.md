---
name: jotai-bunshi
description: Jotai atoms and Bunshi molecules — atomic state management with dependency injection
tags: [react, jotai, bunshi, state-management, atoms]
---

# Jotai + Bunshi

## Jotai — Atomic State

### Core Philosophy

Jotai is atomic state management. Think of atoms as individual pieces of state that can be composed together. Each atom is independent — updates to one don't cause re-renders in others unless they depend on it.

```
atom(value)           → primitive state
atom(get => derived)  → computed state
atom(get, set)        → writable derived state
```

### Primitive Atoms

```typescript
import { atom } from 'jotai'

// Simple atom
const countAtom = atom(0)

// Atom with initial function (lazy init)
const userAtom = atom(async () => {
  const user = await fetchUser()
  return user
})
```

### Derived Atoms (Read-only)

```typescript
const countAtom = atom(0)

// Derived — reads other atoms
const doubleCountAtom = atom((get) => {
  const count = get(countAtom)
  return count * 2
})

// Derived — reads multiple atoms
const sumAtom = atom((get) => {
  return get(countAtom) + get(nameAtom)
})
```

### Writable Atoms

```typescript
const countAtom = atom(0)

// With read + write
const incrementAtom = atom(
  (get) => get(countAtom),  // read
  (get, set, n: number) => { // write
    set(countAtom, get(countAtom) + n)
  }
)

// With async write
const asyncIncrementAtom = atom(
  (get) => get(countAtom),
  async (get, set, n: number) => {
    await api.increment(n)
    set(countAtom, get(countAtom) + n)
  }
)
```

### Async Atoms

```typescript
// Async atom — suspends until resolved
const userAtom = atom(async () => {
  const response = await fetch('/api/user')
  return response.json()
})

// Component using async atom
function UserProfile() {
  const user = useAtom(userAtom)  // suspends!
  return <div>{user.name}</div>
}

// Wrap in Suspense
<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>
```

---

## Hooks

### useAtom

```typescript
import { useAtom } from 'jotai'

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

### useAtomValue (read-only)

```typescript
// Read-only, won't cause re-render on writes
const count = useAtomValue(countAtom)
```

### useSetAtom (write-only)

```typescript
// Write-only, stable reference
const setCount = useSetAtom(countAtom)

// Useful for callbacks
<button onClick={() => setCount(c => c + 1)}>Increment</button>
```

---

## Advanced Patterns

### atomWithStorage

```typescript
import { atomWithStorage } from 'jotai/utils'

// Persisted to localStorage
const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark')

// Persisted to sessionStorage
import { atomWithStorage } from 'jotai/utils'
const sessionAtom = atomWithStorage('session', null) // null is initial

// With async storage (e.g., MMKV)
import { atomWithStorage } from 'jotai/middleware'
import { createMMKV } from 'mmkv'

const mmkv = createMMKV()
const storage = {
  getItem: (key: string) => mmkv.getString(key),
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
}

const settingsAtom = atomWithStorage('settings', defaultSettings, storage)
```

### atomFamily

```typescript
import { atomFamily } from 'jotai/utils'

// Atom factory with parameter
const userAtomFamily = atomFamily((userId: string) => 
  atom(async () => fetchUser(userId))
)

// Usage — creates atom per unique parameter
const user1 = useAtom(userAtomFamily('123'))  // atom for '123'
const user2 = useAtom(userAtomFamily('123'))  // same atom, cached
const user3 = useAtom(userAtomFamily('456'))  // different atom
```

---

## Bunshi — Molecules and DI

### Core Concept

Bunshi adds dependency injection to Jotai. A molecule wraps atoms and makes them available to components that need them — without prop drilling.

```
atom    → single piece of state
molecule → recipe for creating scoped state
scope   → where the molecule "lives"
```

### Creating Molecules

```typescript
import { atom } from 'jotai'
import { molecule, useMolecule } from 'bunshi/react'

// Create atoms
const countAtom = atom(0)
const doubleCountAtom = atom((get) => get(countAtom) * 2)

// Create molecule — the recipe
const CounterMolecule = molecule(() => ({
  count: countAtom,
  double: doubleCountAtom,
}))

// Use in component
function Counter() {
  const { count, double } = useMolecule(CounterMolecule)
  const [value, setValue] = useAtom(count)
  
  return <div>{value} x 2 = {double}</div>
}
```

### Scopes

```typescript
import { createScope, ScopeProvider } from 'bunshi/react'

// Create scope
const AppScope = createScope<string>('app')

// Use with scope
function App() {
  return (
    <ScopeProvider scope={AppScope} value="my-app">
      <Child />
    </ScopeProvider>
  )
}

// Molecule with scope
const ScopedCounterMolecule = molecule((scope) => {
  const appId = scope(AppScope)
  return atom(appId + '-count')
})
```

---

## Patterns: Jotai + Bunshi

### Component-Scoped State

```typescript
// Each component instance gets its own state
const ModalMolecule = molecule(() => {
  const isOpenAtom = atom(false)
  const contentAtom = atom<string | null>(null)
  
  return {
    isOpen: isOpenAtom,
    content: contentAtom,
    open: (content: string) => {
      isOpenAtom.set(true)
      contentAtom.set(content)
    },
    close: () => {
      isOpenAtom.set(false)
      contentAtom.set(null)
    }
  }
})

function Modal() {
  const { isOpen, content } = useMolecule(ModalMolecule)
  const [open, setOpen] = useAtom(isOpen)
  
  if (!open) return null
  return <div>{content}</div>
}
```

### Shared Molecule

```typescript
// Global by default (no scope)
const GlobalCounterMolecule = molecule(() => atom(0))

// Use anywhere — same atom
function Counter1() { useMolecule(GlobalCounterMolecule) }
function Counter2() { useMolecule(GlobalCounterMolecule) } // same state!
```

### Jotai + TanStack Query Integration

```typescript
import { atom } from 'jotai'
import { useQuery } from '@tanstack/react-query'

const queryClientAtom = atom(undefined as QueryClient | undefined)

const QueryClientMolecule = molecule(() => {
  return queryClientAtom
})

function useQueryClient() {
  const { scope } = useMolecule(QueryClientMolecule)
  return useQueryClient() // from TanStack Query
}
```

---

## When to Use What

| Pattern | Use Case |
|---------|----------|
| Plain Jotai | Global client state, simple sharing |
| atomWithStorage | Persisted user preferences |
| atomFamily | Dynamic atoms keyed by ID |
| Bunshi molecules | Component-scoped state, DI patterns |
| Jotai + TanStack Query | Server state + derived client state |
| Zustand | Complex state machines |

---

## Gotchas

### Jotai

- **Atoms are singletons by default** — same reference = same state everywhere
- **Async atoms suspend** — wrap in Suspense or use `loadable`
- **atomFamily atoms are never GC'd** — creates memory leak if unbounded
- **Provider is optional** — default store exists, but custom stores need Provider
- **Updating atom in render causes infinite loop** — use `useEffect` or handlers
- **Derived atoms recompute on every dependent atom change** — use `splitAtom` for lists

### Bunshi

- **Molecules require ScopeProvider** — at root or relevant subtree
- **Scope values must be serializable** — or use custom scope
- **No auto-cleanup** — molecules persist until scope unmounts

---

## Adherence Checklist

Before completing your task, verify:

- [ ] Async atoms wrapped in Suspense
- [ ] Atom dependencies are explicit in get() calls
- [ ] Molecules scoped appropriately
- [ ] No atom updates during render
- [ ] DevTools enabled for debugging
- [ ] atomFamily cleanup for dynamic IDs
