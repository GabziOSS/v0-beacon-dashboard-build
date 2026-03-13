# OpenNext Build Fix

## Problem

Error: "Could not load OpenNext output file at '.open-next/open-next.output.json'"

## Root Cause

The `buildCommand` in `sst.config.ts` was running `pnpm run build` (Next.js build) instead of using OpenNext for SST deployment.

## Solution Applied

### 1. Created `open-next.config.ts`

```typescript
import type { OpenNextConfig } from '@opennextjs/aws/types/open-next'

const config: OpenNextConfig = {
  default: {},
}

export default config
```

### 2. Updated `sst.config.ts`

Changed:

```typescript
buildCommand: 'mise exec -- pnpm run build',
```

To:

```typescript
buildCommand: 'pnpm run build:opennext',
```

### 3. Added `build:opennext` script to `package.json`

```json
"build:opennext": "npx @opennextjs/aws build"
```

## How to Fix

### Option 1: Manual Build (Recommended for debugging)

```bash
# Run OpenNext build manually
npx @opennextjs/aws build

# Verify output exists
ls .open-next/open-next.output.json

# Then deploy
pnpx sst deploy
```

### Option 2: Use SST (Automatic)

```bash
# This will now use OpenNext automatically
pnpx sst deploy
```

## Verification Steps

1. **Check OpenNext version compatibility:**
   - Next.js 16 requires `@opennextjs/aws >= 3.9.0`
   - SST v4 should handle this automatically

2. **Verify build output:**

   ```bash
   npx @opennextjs/aws build
   cat .open-next/open-next.output.json
   ```

3. **Debug mode (if needed):**
   ```bash
   OPEN_NEXT_DEBUG=true npx @opennextjs/aws build
   ```

## Notes

- The LSP errors about module resolution are expected until dependencies are installed
- OpenNext will automatically run `next build` internally
- The `.open-next/` directory should be in `.gitignore` (already added)
