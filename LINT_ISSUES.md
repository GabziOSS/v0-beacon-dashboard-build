# Linting Issues Found

## Potential Issues Detected

### 1. useEffect Dependency Issues

- **File**: `components/dashboard/chart-block.tsx:68`
  - `useEffect(() => { setMounted(true) }, [])` - Empty dependency array is fine here

- **File**: `components/dashboard/dashboard-grid.tsx:119`
  - `useEffect` with `initialPreset` dependency - check if this is correct

### 2. Missing Dependencies in useEffect

- **File**: `components/dashboard/dashboard-grid.tsx:125`
  - `useEffect` uses `blocks` but dependency array is missing

### 3. TypeScript Issues

- **File**: `lib/types.ts:7`
  - Missing semicolon after `Typhoon` (line 7)

### 4. Code Quality

- **File**: `lib/auth.tsx`
  - Hardcoded credentials (security concern)
  - Uses `localStorage` directly (consider abstraction)

## Commands to Run

Once Node.js and pnpm are available:

```bash
# Install dependencies
pnpm install

# Run linting with auto-fix
pnpm lint

# Run type checking
pnpm typecheck

# Format code
pnpm format
```

## Expected Fixes

1. **ESLint will auto-fix**:
   - Unused variables
   - Import ordering
   - Code formatting issues

2. **Manual fixes needed**:
   - Add missing dependencies to useEffect hooks
   - Fix TypeScript type issues
   - Address security concerns in auth.tsx

## Next Steps

1. Install Node.js and pnpm
2. Run `pnpm install`
3. Run `pnpm lint` to see all issues
4. Run `pnpm typecheck` to verify TypeScript
5. Fix any remaining issues manually
