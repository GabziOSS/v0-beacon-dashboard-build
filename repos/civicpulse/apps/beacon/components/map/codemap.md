# Codemap: components/map

Purpose

- Map-related UI and view components (city-map, zone sheets, legends) used in map pages and dashboards.

Key Exports (typical)

- CityMap, ZoneSheet, MapLegend, etc.

Design Patterns

- Composition of map controls with data-driven props; separation of map visualization from controls.

Dependencies

- ui primitives, map rendering library, data adapters, and JSON/Geo data helpers.

Integration Points

- Used by pages that render map views and dashboards; interacts with map data sources and legend components.

Notes

- Ensure props align with data model and map interactions (pan/zoom, layer toggling).
