# Repository Atlas: rie-nexus-kickstarter

## Project Responsibility

A unified monorepo orchestrated by Nx and Turbo, where all functional code resides within a hierarchical `repos/` structure. This ensures a clean root directory and logical isolation of domains like `scaffolds`.

## System Entry Points

| File                  | Responsibility                                                      |
| --------------------- | ------------------------------------------------------------------- |
| `package.json`        | Root manifest, dependencies, and `turbo` script orchestration.      |
| `nx.json`             | Nx workspace configuration, plugin registration, and task defaults. |
| `pnpm-workspace.yaml` | Defines the hierarchical workspace structure for `pnpm`.            |
| `tsconfig.base.json`  | Shared TypeScript foundation with strict compiler options.          |
| `turbo.json`          | Turborepo configuration for task pipelines and caching.             |

## Directory Map (Aggregated)

| Directory                              | Responsibility Summary                                 | Detailed Map                                               |
| -------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `repos/scaffolds/apps/web/`            | Nuxt/Nitro web scaffold.                               | [View Map](repos/scaffolds/apps/web/codemap.md)            |
| `repos/scaffolds/packages/ui/`         | Shared React UI scaffold library.                      | [View Map](repos/scaffolds/packages/ui/codemap.md)         |
| `repos/scaffolds/apps/nextjs-web/`     | Scaffolded Next.js App Router application.             | [View Map](repos/scaffolds/apps/nextjs-web/codemap.md)     |
| `repos/scaffolds/apps/nextjs-web-e2e/` | Playwright E2E testing suite for the Next.js scaffold. | [View Map](repos/scaffolds/apps/nextjs-web-e2e/codemap.md) |
| `repos/civicpulse/apps/beacon/`        | Beacon environmental monitoring dashboard              | [View Map](repos/civicpulse/apps/beacon/codemap.md)        |
| `repos/civicpulse/packages/beacon-ui/` | Specific UI primitives (@beacon/ui)                    |                                                            |
| `repos/civicpulse/packages/chart-kit/` | Generic graphing library (@beacon/chart-kit)           |                                                            |
| `repos/civicpulse/packages/weather-charts/` | Weather visualizations (@beacon/weather-charts)   |                                                            |
| `repos/civicpulse/packages/dashboard/` | Core layout shells (@beacon/dashboard)                 |                                                            |
| `repos/civicpulse/packages/data/`      | Data layer (@civicpulse/data)                          |                                                            |
| `repos/civicpulse/packages/hooks/`     | Shared hooks (@civicpulse/hooks)                       |                                                            |
| `repos/civicpulse/packages/types/`     | TypeScript types (@civicpulse/types)                   |                                                            |

## Final Hierarchy: Hierarchical Workspaces

The repository has been restructured to remove all root-level project folders. Everything now follows the domain-based nesting pattern:

1. **Tier 1 (Root)**: Configuration and orchestration only.
2. **Tier 2 (Repos)**: Logical domains (`civicpulse`, `scaffolds`).
3. **Tier 3 (Type)**: Project categories (`apps`, `packages`).
4. **Tier 4 (Project)**: Individual applications and libraries.

This structure allows for extreme scalability while maintaining a consistent and clean developer experience.
