# TASK-101 Cards and Transactions Overview

A production-grade card and transaction overview built with React, TypeScript, RTK Query, styled-components, i18next, Vitest, and Playwright.

---

## Prerequisites

- Node.js **20** (use `nvm use 20`)
- Yarn 4 (via Corepack — run `corepack enable` once)

---

## Getting started

```bash
nvm use 20
yarn install
yarn dev          # Start dev server at http://localhost:3000
```

---

## Available scripts

| Command | Description |
|---|---|
| `yarn dev` | Start Vite dev server |
| `yarn build` | Type-check + production build |
| `yarn preview` | Preview production build |
| `yarn test` | Run Vitest unit/component tests |
| `yarn test:watch` | Run Vitest in watch mode |
| `yarn test:coverage` | Run tests with coverage report |
| `yarn test:e2e` | Run Playwright E2E tests (starts dev server automatically) |
| `yarn test:e2e:ui` | Open Playwright UI mode |
| `yarn storybook` | Start Storybook on port 6006 |
| `yarn typecheck` | TypeScript type check without building |
| `yarn lint` | Lint all source files |
| `yarn lint:fix` | Lint + auto-fix all source files |

---

## Project structure

```
src/
├── app/              # App entry, Redux store, ThemeProvider, GlobalStyles, ErrorBoundary
├── features/
│   └── cards/        # Feature-scoped components, context, utils
│       ├── components/   # CardsPage, CardListSection, FilterSection, TransactionSection, TransactionListSection
│       ├── context/      # CardsStateContext — split context for URL-driven state (see Architecture)
│       └── utils/        # filterTransactions — pure filtering logic
├── shared/
│   ├── api/          # RTK Query cardsApi (createApi + endpoints)
│   └── ui/           # Reusable presentational components (CardTile, AmountFilter, etc.)
├── i18n/             # i18next setup + translation files (en.json)
├── test/             # Vitest setup + shared renderWithProviders helper
└── ApiClient/        # Fake data layer (JSON + typed async functions)

e2e/                  # Playwright tests
.storybook/           # Storybook config
```

---

## CI Pipeline (GitHub Actions)

The workflow at `.github/workflows/ci.yml` runs on:
- Every **pull request** targeting `main`
- **Manual dispatch** (`workflow_dispatch`) from any branch

| Job | What it does | Depends on |
|---|---|---|
| 🔍 **quality** | `yarn lint` + `yarn typecheck` | — |
| 🧪 **unit** | `yarn test:coverage` (80 % thresholds) | — |
| 🎭 **e2e** | Playwright headless Chromium | — |
| 📦 **build** | `yarn build` → upload `dist/` artifact | quality, unit, e2e |

`quality`, `unit`, and `e2e` run **in parallel** — the `build` job only starts when all three pass. The `dist/` folder is uploaded as a GitHub Actions artifact, ready to be deployed to S3, Cloudfront, Vercel, or any static hosting.

Playwright browsers are cached across runs to keep E2E setup fast.

---

## Git Hooks (Husky + lint-staged)

Pre-commit hooks run automatically on every `git commit`:

1. **lint-staged** — runs `eslint --fix` only on staged `*.ts` / `*.tsx` files (fast, scoped)
2. **vitest --changed** — runs only the tests affected by uncommitted changes (not the full suite)

This ensures broken code never enters the commit history. Hooks are installed automatically via the `prepare` script when running `yarn install`.

To skip in emergencies: `git commit --no-verify`

---

## Architecture decisions

### URL-driven state + split context
Card selection (`cardId`) and the amount filter (`minAmount`) are stored in URL search params. This means filters survive page refresh, can be shared via link, and browser back/forward works naturally.

`useSearchParams()` from React Router is coarse-grained — every caller re-renders whenever *any* param changes. A naive setup caused the entire card list to re-render on every filter keystroke. The fix is a split context pattern in `CardsStateContext`:

- `CardsStateProvider` is the **only** component that calls `useSearchParams()`. It distributes state through two independently memoized contexts: `CardSelectionContext` and `CardFilterContext`.
- `selectCard` and `setMinAmount` are zero-dependency `useCallback`s. Because React Router does not guarantee `setSearchParams` is referentially stable, it is captured in a `useRef` (updated synchronously each render) — so the callbacks never change reference even when the URL changes.
- `CardListSection` wraps with `React.memo` and subscribes only to `CardSelectionContext`, so typing in the filter never triggers a re-render of the card list.

Diagnosed with a dev-only `useWhyDidYouRender` utility at `src/shared/utils/useWhyDidYouRender.ts`.

### RTK Query with `queryFn`
Since the ApiClient uses dynamic JSON imports instead of HTTP, the RTK Query endpoints use `queryFn`. This keeps the caching, loading/error lifecycle, and refetch semantics of RTK Query without needing a real API.

### Filtering as derived state
Transaction filtering is **not stored in Redux**. It is computed on every render from the URL param and the cached transactions. This avoids synchronisation bugs between server state and UI state.

### Styled-components with a theme
All spacing, colours, and typography are driven by a typed `DefaultTheme`. No raw values appear in component styles.

### i18n from day one
All user-visible strings are in `src/i18n/locales/en.json`. Currency formatting uses `Intl.NumberFormat` (locale-aware, not hard-coded).

### Testing strategy
- **Unit**: `filterTransactionsByMinAmount` — pure function with edge cases (empty, NaN, negative, zero, boundary)
- **Component**: `CardTile` (keyboard, aria-pressed), `AmountFilter` (validation, accessibility), `CardsPage` (full integration: loading → data → filter → card switch)
- **E2E**: `cards.spec.ts` — user journeys including URL persistence, filter reset on card switch, keyboard navigation

---

## Design notes

The card colours (`#3b5bdb` for Private, `#2f9e44` for Business) were inferred from the design PNG since it is a binary file. If these differ from the Figma source of truth, the fix is a one-line change in `src/ApiClient/data/cards.json`.

If I were working alongside a designer I would:
1. Ask for Figma token exports or a design token file rather than picking colours from a static image
2. Confirm the empty state and loading state designs (not always in the happy-path screens)
3. Confirm responsive breakpoints — the current layout wraps cards with `flex-wrap`

---

## Original task

# TASK-101 Cards and Transactions Overview

Hellow there!😁 first of all, thanks for taking the time and your interest in joining Code Factory! 
As part of joining our engineering, we share this simple challenge with you.

Happy coding!

## Task

The purpose of this task is to build a card and transactions overview page. The user should be able to select one of the cards, see it's transactions and be able to filter the transactions based on the amount.

You will find an image in the folder /docs, it gives a visual overview of how the page is intended to look like.

![Card and transactions overview](docs/cardTransactionDesigns.png)

## Notes

Please install dependencies using `yarn`.

Typescript is a must.

We provided a fake ApiClient for you that fetches the data. If you want to improve this client and adjust it to your needs feel free to do so.

You can always extend with more data if you feel like it.

If you feel like the design does not make sense, adjust it and note how you would communicate your suggestions with a designer.

## AC

- User can select one of the cards
- The transactions of the selected card will be displayed.
- The transactions have a same background color than the card.
- There should be a filter field between the cards and the transactions.
- The user can filter transactions by inputting amount to the filter fields. Transactions with the amount in the fields or greater should be left visible.
- If the user changes a selected card and there is content in the filter fields, the content should be resetted.

## Deliverables

- Share with us a zip file wtih your source code excluding the node_modules folder
