import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useCardSelection,
  useCardFilter,
} from "@dkb-cofa/features/cards/context/CardsStateContext";

/**
 * Contract tests for the public hook APIs of CardsStateContext.
 *
 * Both hooks guard against being consumed outside their provider by throwing
 * an explicit error. This ensures consumers get a clear, actionable message
 * at development time rather than a cryptic "cannot read property of null"
 * at runtime.
 *
 * We are not testing React context internals — we are testing the public
 * boundary that every consumer of this module depends on.
 */
describe("CardsStateContext — guard clauses", () => {
  it("useCardSelection throws when rendered outside CardsStateProvider", () => {
    // renderHook without a wrapper means no Router and no provider —
    // this is exactly the mis-use we want to guard against.
    expect(() => renderHook(() => useCardSelection())).toThrow(
      "useCardSelection must be used within <CardsStateProvider>"
    );
  });

  it("useCardFilter throws when rendered outside CardsStateProvider", () => {
    expect(() => renderHook(() => useCardFilter())).toThrow(
      "useCardFilter must be used within <CardsStateProvider>"
    );
  });
});
