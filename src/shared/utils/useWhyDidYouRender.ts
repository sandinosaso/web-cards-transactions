/**
 * @file useWhyDidYouRender.ts
 *
 * DEV-ONLY debug hook — tracks which values changed between renders and logs
 * them to the browser console.  Do not call this in production code.
 *
 * ─── How to use ──────────────────────────────────────────────────────────────
 *
 *   import { useWhyDidYouRender } from "@dkb-cofa/shared/utils/useWhyDidYouRender";
 *
 *   export const MyComponent = React.memo(function MyComponent() {
 *     const foo = useSomething();
 *     const bar = useOtherThing();
 *
 *     useWhyDidYouRender("MyComponent", { foo, bar });
 *     // → open the browser console and interact with the app.
 *     // → every re-render prints which values changed and their before/after.
 *   });
 *
 * ─── Case study: CardListSection & React Router ───────────────────────────────
 *
 * This hook was used to diagnose why CardListSection kept re-rendering on
 * every filter keystroke even though:
 *   ✅  It subscribes only to CardSelectionContext (not CardFilterContext).
 *   ✅  It is wrapped in React.memo (no props → trivially bails out).
 *
 * The console output was:
 *
 *   [why-render] CardListSection
 *     selectCard: { from: ƒ, to: ƒ }   ← new function reference every time
 *
 * Root cause — React Router does not guarantee setSearchParams is stable:
 *
 *   URL changes (user types in filter)
 *     → CardsStateProvider re-renders (it calls useSearchParams())
 *     → setSearchParams is a NEW function reference on every render
 *     → useCallback([setSearchParams]) → selectCard is a NEW reference
 *     → selectionValue useMemo deps changed → produces a NEW object
 *     → CardSelectionContext.Provider receives a new value
 *     → React notifies ALL CardSelectionContext consumers
 *     → CardListSection re-renders                    ← React.memo cannot help
 *                                                        here; memo only stops
 *                                                        prop-driven re-renders,
 *                                                        not context-driven ones
 *
 * Fix — ref-stabilisation pattern in CardsStateContext.tsx:
 *
 *   const setSearchParamsRef = useRef(setSearchParams);
 *   setSearchParamsRef.current = setSearchParams;  // updated each render, synchronously
 *
 *   const selectCard = useCallback(() => {
 *     setSearchParamsRef.current(...);  // always reads the latest setter
 *   }, []);  // ← zero deps → same function reference forever
 *
 * With zero deps, selectCard never changes → selectionValue useMemo returns
 * the SAME object → CardSelectionContext value is stable → CardListSection
 * receives NO context notification on filter changes → no re-render. ✅
 *
 * Key insight: the ref is assigned synchronously during render (not inside
 * useEffect), so it is always up-to-date before any user event can fire.
 */

import { useEffect, useRef } from "react";

/**
 * Logs which values in `tracked` changed since the previous render.
 *
 * Uses Object.is() for comparison — same semantics as React's own bailout
 * check — so the output directly explains what React sees.
 *
 * @param label   - Display name shown in the console group header.
 * @param tracked - Plain object mapping names to the values you want to watch.
 *
 * @example
 * useWhyDidYouRender("MyComponent", { foo, bar, baz });
 */
export function useWhyDidYouRender(
  label: string,
  tracked: Record<string, unknown>
): void {
  const prev = useRef<Record<string, unknown>>({});

  // Runs after every render — no deps array on purpose, so it always fires.
  useEffect(() => {
    const changed: Record<string, { from: unknown; to: unknown }> = {};

    for (const key of Object.keys(tracked)) {
      if (!Object.is(prev.current[key], tracked[key])) {
        changed[key] = { from: prev.current[key], to: tracked[key] };
      }
    }

    if (Object.keys(changed).length > 0) {
      console.group(
        `%c[why-render] ${label}`,
        "color: #f59e0b; font-weight: bold"
      );
      for (const [key, { from, to }] of Object.entries(changed)) {
        console.log(`  ${key}:`, { from, to });
      }
      console.groupEnd();
    }

    prev.current = { ...tracked };
  });
}
