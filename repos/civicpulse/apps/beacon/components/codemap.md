# Codemap: components (Next.js UI library & feature components)

This codemap documents the high-level structure, responsibilities, and integration points of the components directory in this Next.js project.

Overview

- Purpose: Centralized collection of reusable UI primitives (UI library) and higher-level feature components used across the app (maps, dashboards, charts, etc.). Enables consistent styling, accessibility, and interaction patterns.
- Organization: split into a UI library folder (ui) that houses reusable building blocks, and feature folders (shell, map, dashboard, charts) that compose those blocks into domain-specific widgets.
- How components are organized: (1) UI library components for common UI primitives (buttons, inputs, dialogs, etc.), (2) Feature components that implement domain-specific UX using the UI primitives.

Main Subdirectories

- ui: Reusable UI primitives and widgets (buttons, forms, modals, layout, icons, etc.).
- shell: App shell components like topbar, sidebar, and navigation that define the global chrome.
- map: Map-related components and UI for map views and sheets.
- dashboard: Dashboard widgets and layout constructs (tables, grids, charts integration).
- charts: Chart components and helpers used to render various visualizations.

Component Organization Principles

- UI library vs feature components: UI library houses generic, reusable components with stable APIs; feature components compose those primitives to realize domain-specific UIs (e.g., map toolbar, dashboard widgets).
- Exports: Each folder exports a cohesive set of components; some files expose default components, while others export named components to enable flexible usage.
- Styling: Likely uses a shared design system with consistent props, sizing, and theming; check theme-provider usage for global styling.

Key Exports and Patterns (high-level)

- UI library (ui/\*): Common primitives (Button, Card, Dialog, Input, Tooltip, etc.). Exports are typically named and/or default components used across pages.
- Shell (shell/\*): App chrome pieces like Topbar and Sidebar which wrap pages with consistent chrome and navigation.
- Map (map/\*): Reusable map-friendly UI (legend, zone sheets, city map, etc.) used by map pages.
- Dashboard (dashboard/\*): Dashboard grid, charts integration, and data tables for admin/overview views.
- Charts (charts/\*): Encapsulated chart components (line, bar, radar, etc.) built atop a charting library, plus shared chart utilities.

Design Considerations

- Accessibility: Landmarks, keyboard navigation, aria labels where applicable, consistent focus styles.
- Responsiveness: Layout and components adapt to viewport sizes, with potential mobile-first approaches.
- Reusability: Avoid tight coupling to pages; prefer props-driven configuration and slots where relevant.
- Tests: Likely baselined with visual tests or unit tests around common UI primitives.

Integration Points

- Theme provider and global styles: components rely on a theming system.
- Data hooks & utilities: components consume shared utilities for formatting, date/time, and API data adapters.
- Routing: Next.js pages import and compose these components; consider dynamic imports for performance where used.

Notes

- This codemap should be updated as the component surface evolves; it reflects the current structure and intended usage patterns for maintainability.
