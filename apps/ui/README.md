# Event Package Builder — UI

Frontend for the Event Ticketing take-home. Built against the API at `apps/api`.

## Stack

React 19 · TypeScript · Vite · TanStack Query · TanStack Router · Mantine · CSS Modules

## Running

```bash
# From repo root — starts both API (port 3002) and UI (port 5173)
npm run dev

# UI only
npm run dev --filter=ui
```

## Architecture Decisions

### API Layer (`src/api/`)
The FE never touches raw BE shapes. Every response goes through:
- `transforms.ts` — BE DTOs → FE view models (normalises nulls, formats prices, splits selections)
- `registry.ts` — maps option codes to render strategies (`radio` / `select` / `readonly`). Unknown codes get a humanised fallback label and a derived control type — the UI never crashes on unknown options.

### Flow
Single-page Mantine `<Stepper>` wizard (no URL per step). Only `/status` has its own route, since it's a terminal state a user might return to. On load, if the estimate status is not `draft`, the app redirects to `/status` immediately.

### Pricing
All pricing is server-computed. `PUT /estimate` fires on every selection commit (radio change, checkbox toggle). Pricing shows a dimmed state during the in-flight request. `refetchOnWindowFocus` handles stale prices on tab return.

### Single-value options
Auto-selected silently, rendered as a read-only `Badge`. Not a real choice — no point asking the user to interact with it.

### Plan switching
Non-issue in the wizard model. Selecting a new plan calls `PUT /estimate` with empty selections, naturally resetting the configure step.

---

## Product Reasoning

**Information hierarchy** — Plan constraints (`min_participants`, `lead_time_days`, `approval_type`) are surfaced inline on the plan cards, not hidden behind a detail view. The approval badge is visually distinct (amber) because it changes the finalise outcome from instant to pending — users need to know before selecting.

**Constraint communication** — Required options are marked with a red `*`. The submit button is disabled while blockers exist; blocking reasons are listed inline above it so the user knows exactly what to fix.

**Error recovery** — On `PUT /estimate` failure: toast notification so the user knows the change didn't save. On `POST /estimate/finalise` failure: blockers shown inline above the submit button. Estimate data is always persisted server-side, so a page refresh never loses progress.

**One decision I'd revisit** — The `selectedPlan` state in `WizardPage` is in-memory only. On page reload mid-configure, the user lands back on step 1 because we can't reconstruct the full plan object from the estimate response (which only returns `plan: { id, name }`). A `/plans/:id` endpoint or including the full plan in the estimate response would fix this cleanly.

---

## Accessibility

- Step headings use `tabIndex={-1}` + `ref.focus()` on step advance for screen reader context
- First interactive element per step uses `autoFocus`
- Pricing total uses `aria-live="polite" aria-atomic="true"` — announced after each selection commit
- All interactive controls use Mantine primitives which ship with correct ARIA roles

**Testing:** keyboard navigation (Tab, Enter, Space, Arrow keys), VoiceOver spot-checks on step transitions and pricing updates.

**Known gaps:** No automated axe/Lighthouse run completed within the timebox.

---

## Known Limitations

- One active estimate per employer at all times (API constraint — no multi-quote support)
- No "start over" after finalise — the API has no reset endpoint
- Status transitions are forward-only
