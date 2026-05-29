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

## Product Reasoning

1. All CTAs are primary, remaining actions are secondary. Individual plans are hidden until you select the actual provider. Plans that require approval are emphasized with a colored badge before you even select them.

2. I'm using distinct cards for showing details about each plan so they fit nicely on the bottom. This can become a problem if we start supporting >10 constraints as the user might get confused from all the text. In that case, some visual iconography/glyphs can help with the first impression. All required options are put on top and have \* in labels.

3. We always emit PUT /estimate on any plan change so intermediary state should be preserved in DB. On errors, we show toast notification to user for visibility. Currently, there is no retry UI but this can be added fairly easily via TanStack Query's `refetch`.

4. Currently, we allow user to proceed to final step even if he has not filled in all required fields. We surface the `block_reasons` response but this means he has to go back to previous step and redo. I think this whole validation might need to happen on 2nd step instead.

## Accessibility

- Overall, tested manually via keyboard navigation - we're building on top of popular component library so things look good
- Weirdly, I had to manually override cursor style to pointer in `Mantine` - for `Checkbox` and `Radio`
- If I had more time - `@axe-core/react` for automated testing and/or `eslint-plugin-jsx-a11y` for more strict role checking
- Currently, there's an issue when switching between tabs - the focus gets "stolen" by the active plan's CTA

---

## Known Limitations & Future Work

- The `ProviderPlanStep` component is currently configured to fetch data on its own which might be a concern later on (maintainability)
- Wizard progress is not being persisted so user always begins from start on page refresh
- One active estimate per employer (API constraint)
- No start-over without `db:reset` (API constraint)
- The active provider is not being-preselected on the first step
- No component/integration tests as they are costly (if more time - RTL + MSW + Playwright)
- No approval process - ie estimate remains "stuck"
