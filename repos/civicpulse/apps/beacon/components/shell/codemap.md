# Codemap: components/shell

Purpose

- App chrome: Topbar and Sidebar wiring, navigation, and global controls; provides consistent frame for pages.

Key Exports (typical)

- Topbar component, Sidebar component, and any layout wrappers used by pages.

Design Patterns

- Layout wrappers with responsive behavior; composition of UI primitives from ui/ for chrome elements.

Dependencies

- ui components, Next.js Link, routing helpers, icons.

Integration Points

- Used by pages/\_app or pages that render the main layout; provides navigation actions, user menu, and branding.

Notes

- Central place to modify chrome behavior across the app.
