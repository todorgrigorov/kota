# Frontend Plan

## Stack

React 19 + TypeScript + Vite · TanStack Query · TanStack Router · Mantine (UI components)

## Routing

- `/` → `WizardPage` — redirects to `/status` if estimate is not `draft`
- `/status` → `StatusPage` — redirects to `/` if estimate is `draft`

## API Layer

Raw BE types (`Raw*`) → `transforms.ts` → FE view models. `Api` interface returns FE types; transforms applied in `client.ts`. `EstimateStatus` is a full object `{ id, label, color, title?, body? }` derived via `RAW_STATUS_TO_STATUS` in `constants.ts`.

## Mutation Design

`UpdateEstimateParams` takes `plan: Plan` (not `plan_id`) so the mutation auto-merges readonly option values and awaits `refetchQueries` before resolving — prevents stale state on step advance.

## Registry Fallback

Unknown option codes → humanized label + derived control: 1 value → `readonly`, >4 → `select`, else → `radio`.

## Key Decisions

| Scenario                    | Decision                                                       |
| --------------------------- | -------------------------------------------------------------- |
| Stale pricing               | `refetchOnWindowFocus: true`                                   |
| Plan switching              | All selections reset; readonly options auto-seeded in mutation |
| PUT response missing `plan` | `refetchQueries` instead of `setQueryData`                     |
| Single-value options        | Readonly badge + disclaimer; value auto-included in every PUT  |
| PUT failure                 | Toast; local state preserved for retry                         |
| Direct `/status` with draft | Redirect to `/`                                                |

## Testing

Vitest unit tests in `src/api/transforms.test.ts` covering all API edge cases from the brief.
