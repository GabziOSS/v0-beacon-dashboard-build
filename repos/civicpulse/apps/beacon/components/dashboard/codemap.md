# Codemap: components/dashboard

Purpose

- Dashboard widgets and layout for admin/overview screens; composes charts, tables, and panels.

Key Exports (typical)

- DashboardGrid, IncidentTable, DashboardTabs, ChartBlock, etc.

Design Patterns

- Grid-based layouts; composition of data visualization blocks; data-driven rendering.

Dependencies

- ui primitives, charts, tables, and data utilities.

Integration Points

- Used by pages exposing admin dashboards or overview portals; pulls in charts and tables via shared components.

Notes

- Follow consistent sizing, spacing, and theming with the UI library.
