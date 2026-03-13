# Codemap: hooks directory

This document maps the purpose, design, data flow, and integration points for the hooks located in hooks/, specifically:

- hooks/use-toast.ts
- hooks/use-mobile.ts

1. Responsibility

- The hooks directory hosts custom React hooks that encapsulate reusable UI and platform-specific logic for the application.
- use-toast.ts provides a simple in-app toast system (a lightweight toasting manager).
- use-mobile.ts exposes a responsive utility hook that detects mobile viewport status.

2. Design Patterns

- use-toast.ts
  - Custom hook with a lightweight in-memory store (memoryState) and a publish/subscribe pattern via listeners to trigger re-renders in consuming components.
  - Reducer pattern for managing toast lifecycle: ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST, REMOVE_TOAST.
  - Encapsulation of side effects within reducer actions (e.g., scheduling removal via timeouts).
  - Imperative API surface exposed via useToast() and a separate toast() helper to create and manage individual toasts.
  - Small ID generation via a module-scoped counter to keep toasts deterministic without external state.
- use-mobile.ts
  - useEffect-based event subscription to window.matchMedia, with a cleanup function to detach listeners.
  - Simple boolean state derived from media query, exposed as a direct value to consumers.
  - Stateless selector-like hook that returns a primitive (boolean) for easy conditional rendering.

3. Data & Control Flow

- use-toast.ts
  - Local in-memory state: memoryState = { toasts: [] }
  - Actions dispatched to a central reducer to transform state:
    - ADD_TOAST: prepend new toast (keeps only latest due to TOAST_LIMIT)
    - UPDATE_TOAST: merge provided toast props into existing toast by id
    - DISMISS_TOAST: trigger removal timeout for one or all toasts; marks toasts as open: false
    - REMOVE_TOAST: remove toast(s) by id or clear all if no id
  - toast() creates a new toast object with id, open: true, and onOpenChange handler that auto-dismisses when closed. Returns id, dismiss(), update().
  - useToast() subscribes to memoryState via a React state hook; on mount, it registers a listener to update its local state when memoryState changes. It returns the current toast state plus helpers:
    • toast: the toast() factory for creating new toasts
    • dismiss(toastId?): dispatches DISMISS_TOAST for a specific toast or all toasts when no id is provided
    • the spread of state (toasts) so components can render accordingly
- use-mobile.ts
  - useIsMobile() maintains a single boolean (or undefined initial) representing whether viewport is mobile.
  - It computes initial value from window.innerWidth and updates on breakpoint changes via matchMedia listener.
  - Returns a boolean by coercion (!!isMobile) for straightforward conditional checks.

4. Integration Points

- Components importing these hooks:
  - use-toast.ts: components that render toasts or trigger toasts, or programs that need to dismiss or update toasts. The module exports:
    • useToast: the main hook to access toast state and control APIs
    • toast: factory to create and manage a single toast instance (returns { id, dismiss, update })
    Typical usage pattern:
    const { toasts, toast, dismiss } = useToast();
    const t = toast({ title: 'Hello', description: 'This is a toast' });
    // t.dismiss(), t.update({ description: 'Updated' })
    // Render based on toasts array in state

  - use-mobile.ts: components can conditionally render mobile-specific UI or alter layout based on isMobile state. Typical usage:
    const isMobile = useIsMobile();
    if (isMobile) { /_ render mobile layout _/ } else { /_ desktop layout _/ }

API surface details (per-file summary)

- hooks/use-toast.ts
  - API:
    • useToast(): { toasts: ToasterToast[], toast: (props: Toast) => { id, dismiss, update }, dismiss?: (toastId?: string) => void, [additional toast state props] }
    • toast(props: Omit<ToasterToast, 'id'>): { id: string, dismiss: () => void, update: (props: Partial<ToasterToast>) => void }
  - Types (simplified):
    • ToasterToast extends ToastProps with id, title?, description?, action?
    • Action types: ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST, REMOVE_TOAST
  - Behavior notes:
    • Toasts are kept to a maximum of TOAST_LIMIT (1 in this codebase)
    • When dismissed, toasts are closed and then removed after a long delay controlled by TOAST_REMOVE_DELAY

- hooks/use-mobile.ts
  - API:
    • useIsMobile(): boolean
  - Behavior notes:
    • Uses window.matchMedia to listen for breakpoint changes and updates internal state
    • Returns true when window width is below MOBILE_BREAKPOINT

Notes

- This codemap is based solely on the provided source files and their public APIs as of the current code state. If hooks are extended or replaced, update this document accordingly.
