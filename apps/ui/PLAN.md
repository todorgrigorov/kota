# Frontend Plan

## Stack
React + TypeScript + Vite (`apps/ui`) · TanStack Query · Mantine · CSS Modules

## Structure
```
src/
├── api/
│   ├── client.ts       # Typed fetch wrappers
│   ├── transforms.ts   # BE DTO → FE view model
│   └── registry.ts     # Option render strategy (control type + labels) with fallback
├── components/
│   ├── steps/          # StepProviderPlan, StepConfigure, StepReview
│   ├── StatusScreen.tsx
│   └── OptionField.tsx # Renders radio / select / readonly-badge per registry
└── App.tsx
```

## Flow
Mantine `<Stepper>` wizard (no URL routing per step). On load, derive starting step from `GET /estimate` status + blocking_reasons. Provider selection → `localStorage`.

## Steps
1. **Provider + Plan** — Mantine Tabs (providers) + Cards (plans with constraints inline, approval badge)
2. **Configure** — options via `OptionField`, add-ons section below, `PUT /estimate` on each commit
3. **Review** — summary + blocking_reasons inline + Submit → `POST /estimate/finalise`
4. **Status** — `pending_approval` (amber) or `finalised` (green), no start-over

## Registry fallback
Unknown codes → humanize + derive control: 1 value → `readonly` badge, >4 → `select`, else → `radio`

## Key Decisions
| Scenario | Decision |
|---|---|
| Stale pricing on tab return | `refetchOnWindowFocus` + toast if total changed |
| Plan switching | Non-issue — wizard resets selections on plan change |
| Single-value options | Auto-selected, read-only Badge |
| PUT failure | Toast + confirmation modal if user navigates back |
| Finalise blockers | Inline above Submit button |
| Free add-ons | Green "Free" badge |
| Empty provider/plans | Inline empty state messages |

## Accessibility
- Step heading: `tabIndex={-1}` + ref `.focus()` on advance
- First input per step: `autoFocus`
- Pricing total: `aria-live="polite" aria-atomic="true"`

## Known Limitations
- One active estimate per employer (API constraint)
- No start-over after finalise (no API support)
