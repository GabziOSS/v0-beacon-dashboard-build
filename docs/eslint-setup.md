# ESLint Setup for Civic Pulse Alpha

## Configuration Files Created

1. **`eslint.config.mjs`** - Modern ESLint flat config with:
   - TypeScript support via `@typescript-eslint`
   - React support via `eslint-plugin-react`
   - React Hooks rules via `eslint-plugin-react-hooks`
   - Next.js integration via `eslint-config-next`

2. **`.eslintrc.json`** - Legacy config for compatibility

3. **`.prettierrc`** - Prettier configuration for consistent formatting

## Scripts Added to package.json

```json
{
  "lint": "eslint . --fix", // Auto-fix issues
  "lint:check": "eslint .", // Check without fixing
  "format": "prettier --write .", // Format all files
  "format:check": "prettier --check .", // Check formatting
  "typecheck": "tsc --noEmit" // TypeScript type checking
}
```

## Running ESLint

### With pnpm (recommended):

```bash
pnpm lint          # Auto-fix issues
pnpm lint:check    # Check only
pnpm format        # Format code
pnpm typecheck     # Type check
```

### With npx:

```bash
npx eslint . --fix
```

## Key Rules Configured

- **TypeScript**: Warn on unused vars, any usage
- **React**: No prop-types needed (TS), no unescaped entities
- **React Hooks**: Enforce rules-of-hooks, warn on exhaustive deps
- **General**: Warn on console.log and debugger statements

## Notes

- The config uses the `@` path alias from your `tsconfig.json`
- Auto-fix is enabled for most issues
- Prettier handles formatting, ESLint handles code quality
- Run `pnpm lint` before committing to catch issues early
