# Codemap: components/ui

Purpose

- A library of reusable UI primitives (buttons, inputs, cards, dialogs, etc.) used across all features.

Key Exports (typical)

- Button, Card, Input, Dialog, Tooltip, Select, Dropdown, Tabs, Tooltip, Spinner, Avatar, Checkbox, Radio, Slider, etc.

Design Patterns

- Prop-driven, composable components; focus management in dialogs, accessible ARIA attributes, consistent theming.
- Styling via design system tokens and theme provider.

Dependencies

- React, ReactDOM; charting or utility libs as needed; design system tokens.

Integration Points

- Used by shell, map, dashboard, charts, and pages for consistent UI primitives.
- The Theme provider wraps app; components consume theme tokens.

Notes

- Maintain stable API for downstream features; avoid breaking changes.
