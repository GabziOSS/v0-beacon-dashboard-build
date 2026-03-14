---
name: base-ui
description: Base UI from MUI - Unstyled, accessible UI components for building design systems
tags: [react, components, accessibility, headless, mui, base-ui]
---

# Base UI

## Overview

Base UI is an unstyled, accessible component library from the creators of Radix UI and Material UI. It provides headless components with full ARIA compliance and keyboard navigation - you bring your own styling.

**Key characteristics:**

- Unstyled (no CSS included)
- Fully accessible (WCAG compliant)
- Hooks-based API
- TypeScript first
- Stable - production ready
- From MUI team (creators of Radix, Material UI)

---

## Installation

```bash
npm install @base_ui/react @base_ui/react-native
```

---

## Core Concepts

### Component Structure

Each Base UI component follows a consistent pattern:

```typescript
import { Popup } from '@base_ui/react/Popup'

// Render prop pattern - full control
<Popup>
  <Popup.Trigger>Open</Popup.Trigger>
  <Popup.Positioner>
    <Popup.Popup>
      <Popup.Title>Title</Popup.Title>
      <Popup.Description>Description</Popup.Description>
      <Popup.Close>Close</Popup.Close>
    </Popup.Popup>
  </Popup.Positioner>
</Popup>
```

### Props Pattern

```typescript
interface PopupProps {
  // Controlled
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // Positioning
  anchorEl?: HTMLElement | null
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | ...

  // Behavior
  modal?: boolean
  trapFocus?: boolean
  closeOnEscape?: boolean
  closeOnInteractOutside?: boolean
}
```

---

## Available Components

### Popup System

#### Popup

Floating content anchored to an element.

```typescript
import { Popup } from '@base_ui/react/Popup'

<Popup open={open} onOpenChange={setOpen}>
  <Popup.Trigger>
    <button>Open popup</button>
  </Popup.Trigger>
  <Popup.Positioner>
    <Popup.Popup>
      Content here
    </Popup.Popup>
  </Popup.Positioner>
</Popup>
```

**Features:**

- Intelligent positioning (flip, shift)
- Arrow/filename rendering
- Portal support
- Modal mode
- Focus trap

#### Menu

Dropdown menu with nested items.

```typescript
import { Menu } from '@base_ui/react/Menu'

<Menu>
  <Menu.Trigger>
    <button>Open menu</button>
  </Menu.Trigger>
  <Menu.Positioner>
    <Menu.Popup>
      <Menu.Item onClick={() => console.log('Save')}>
        Save
      </Menu.Item>
      <Menu.Item onClick={() => console.log('Delete')}>
        Delete
      </Menu.Item>
      <Menu.Separator />
      <Menu.Submenu>
        <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.Item>Sub item 1</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Submenu>
    </Menu.Popup>
  </Menu.Positioner>
</Menu>
```

#### HoverCard

Card that appears on hover.

```typescript
import { HoverCard } from '@base_ui/react/HoverCard'

<HoverCard>
  <HoverCard.Trigger asChild>
    <a href="/profile">@username</a>
  </HoverCard.Trigger>
  <HoverCard.Portal>
    <HoverCard.Positioner>
      <HoverCard.Popup>
        User info here
      </HoverCard.Popup>
    </HoverCard.Positioner>
  </HoverCard.Portal>
</HoverCard>
```

---

### Form Components

#### Number Input

Numeric input with increment/decrement buttons.

```typescript
import { NumberInput } from '@base_ui/react/NumberInput'

<NumberInput.Root defaultValue="0">
  <NumberInput.Decrement />
  <NumberInput.Input />
  <NumberInput.Increment />
</NumberInput.Root>
```

**Features:**

- Min/max bounds
- Step handling
- Clamp on blur
- Scroll to change value

#### Select

Single or multiple selection.

```typescript
import { Select } from '@base_ui/react/Select'

<Select.Root defaultValue="option-1">
  <Select.Trigger>
    <Select.Value<string>>{({ value }) => value}</Select.Value>
  </Select.Trigger>
  <Select.Positioner>
    <Select.Popup>
      <Select.Option value="option-1">Option 1</Select.Option>
      <Select.Option value="option-2">Option 2</Select.Option>
    </Select.Popup>
  </Select.Positioner>
</Select.Root>
```

---

### Navigation

#### Tabs

Tabbed navigation.

```typescript
import { Tabs } from '@base_ui/react/Tabs'

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab-1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab-2">Content 2</Tabs.Panel>
</Tabs.Root>
```

---

### Disclosure

#### Accordion

Collapsible sections.

```typescript
import { Accordion } from '@base_ui/react/Accordion'

<Accordion.Root defaultValue={['item-1']}>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>What is this?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Answer content here
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

---

### Overlay

#### Dialog

Modal dialog.

```typescript
import { Dialog } from '@base_ui/react/Dialog'

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Backdrop />
  <Dialog.Portal>
    <Dialog.Positioner>
      <Dialog.Popup>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>
```

---

## Hooks API

Base UI exposes low-level hooks for custom components.

### usePopup

```typescript
import { usePopup } from '@base_ui/react/Popup'

const { getButtonProps, getPopupProps, open, setOpen, ...other } = usePopup({
  anchorEl,
  open,
  onOpenChange,
  placement,
})
```

### useMenu

```typescript
import { useMenu } from '@base_ui/react/Menu'

const {
  getRootProps,
  getTriggerProps,
  getPopupProps,
  getItemProps,
  open,
  highlightedIndex,
  ...
} = useMenu({ ... })
```

### useSelect

```typescript
import { useSelect } from '@base_ui/react/Select'

const {
  getRootProps,
  getTriggerProps,
  getListboxProps,
  getOptionProps,
  value,
  open,
  ...
} = useSelect({
  defaultValue,
  onChange,
  options: [...]
})
```

---

## Styling Patterns

Base UI is unstyled - you apply your own styles.

### Tailwind CSS Example

```typescript
<Popup.Popup className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
  <Popup.Title className="font-semibold text-gray-900">
    Title
  </Popup.Title>
  <Popup.Description className="text-gray-600 mt-1">
    Description text
  </Popup.Description>
</Popup.Popup>
```

### CSS Modules Example

```typescript
import styles from './Popup.module.css'

<Popup.Popup className={styles.popup}>
  <Popup.Title className={styles.title}>
    Title
  </Popup.Title>
</Popup.Popup>
```

---

## State Management

### Controlled Usage

```typescript
const [open, setOpen] = useState(false)

<Popup open={open} onOpenChange={setOpen}>
  ...
</Popup>
```

### Uncontrolled Usage

```typescript
<Popup defaultOpen={true}>
  ...
</Popup>
```

---

## Accessibility

### ARIA Attributes

Base UI automatically handles:

- `aria-expanded`
- `aria-haspopup`
- `aria-controls`
- `aria-selected`
- `aria-checked`
- `aria-disabled`
- `role` attributes

### Keyboard Navigation

All components support:

- **Tab** - Move between focusable elements
- **Enter/Space** - Activate buttons, select options
- **Escape** - Close popups, menus
- **Arrow keys** - Navigate menus, tabs, combobox
- **Home/End** - Navigate to first/last

---

## Comparison with Radix UI

| Feature            | Base UI     | Radix UI    |
| ------------------ | ----------- | ----------- |
| Styling            | Unstyled    | Unstyled    |
| Styling approach   | No styles   | No styles   |
| Hooks API          | ✓ (primary) | Limited     |
| Render props       | ✓           | ✓           |
| From               | MUI team    | Modulz      |
| Active development | ✓           | ✓           |
| Components         | Focused set | Broader set |

**Base UI advantages:**

- More comprehensive hooks API
- Better TypeScript support out of the box
- Active development by MUI team
- Consistent component patterns

---

## Comparison with Headless UI

| Feature   | Base UI    | Headless UI   |
| --------- | ---------- | ------------- |
| Styling   | Unstyled   | Unstyled      |
| Framework | React only | React + Vue   |
| Hooks API | ✓          | ✓             |
| From      | MUI        | Tailwind Labs |

---

## Best Practices

### 1. Use Portal When Needed

```typescript
<Popup.Portal>
  <Popup.Positioner>
    <Popup.Popup>Content</Popup.Popup>
  </Popup.Positioner>
</Popup.Portal>
```

### 2. Set Proper Anchor

```typescript
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

<button ref={setAnchorEl}>Open</button>

<Popup anchorEl={anchorEl}>
  ...
</Popup>
```

### 3. Handle Focus Properly

```typescript
// Auto-focus on open
<Popup.Popup autoFocus />

// Or disable focus
<Popup.Popup tabIndex={-1}>
```

### 4. Use closeOnInteractOutside Wisely

```typescript
// Default - close when clicking outside
<Popup closeOnInteractOutside>

// Don't close on certain interactions
<Popup closeOnInteractOutside={false}>
```

---

## Common Patterns

### Custom Menu with Icons

```typescript
<Menu.Item
  {...getItemProps({ index: 0 })}
  className="flex items-center gap-2"
>
  <SaveIcon className="w-4 h-4" />
  Save
</Menu.Item>
```

### Select with Groups

```typescript
<Select.Popup>
  <Select.Group>
    <Select.GroupLabel>Animals</Select.GroupLabel>
    <Select.Option value="cat">Cat</Select.Option>
    <Select.Option value="dog">Dog</Select.Option>
  </Select.Group>
</Select.Popup>
```

### Responsive Popup Position

```typescript
<Popup.Positioner
  side="bottom"
  align="center"
  collisionBoundary={document.body}
  arrowPadding={12}
>
```

---

## Gotchas

1. **Render props pattern** - Components use render props, not slot pattern
2. **Positioner is required** - Don't skip `<Popup.Positioner>`
3. **Portal by default** - Some components portal to body by default
4. **Refs** - Use `asChild` to forward refs to child elements
5. **Types** - TypeScript types are comprehensive but can be verbose
6. **CSS not included** - Must style all components yourself
7. **Event handlers** - Pass handlers via props, not on DOM elements directly

---

## Adherence Checklist

Before completing your task, verify:

- [ ] Positioner component used correctly
- [ ] Proper keyboard navigation works
- [ ] Focus managed appropriately
- [ ] ARIA attributes applied correctly
- [ ] Portal used when needed
- [ ] Controlled/uncontrolled pattern followed
- [ ] Proper styling applied (it's unstyled!)
- [ ] Event handlers work correctly
