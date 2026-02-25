import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const CARD_ID_PARAM = "cardId";
const MIN_AMOUNT_PARAM = "minAmount";

// ─── Card selection context ───────────────────────────────────────────────────

interface CardSelectionValue {
  readonly selectedCardId: string | null;
  readonly selectCard: (cardId: string) => void;
}

const CardSelectionContext = createContext<CardSelectionValue | null>(null);

export function useCardSelection(): CardSelectionValue {
  const ctx = useContext(CardSelectionContext);
  if (ctx === null) {
    throw new Error("useCardSelection must be used within <CardsStateProvider>");
  }
  return ctx;
}

// ─── Filter context ───────────────────────────────────────────────────────────

interface CardFilterValue {
  readonly minAmount: string;
  readonly setMinAmount: (amount: string) => void;
}

const CardFilterContext = createContext<CardFilterValue | null>(null);

export function useCardFilter(): CardFilterValue {
  const ctx = useContext(CardFilterContext);
  if (ctx === null) {
    throw new Error("useCardFilter must be used within <CardsStateProvider>");
  }
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface CardsStateProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Single subscriber to useSearchParams().
 *
 * React Router's useSearchParams() is coarse-grained: every caller re-renders
 * whenever *any* param changes. This provider is the ONLY component that calls
 * it. It distributes URL state through two independently-memoized contexts:
 *
 *   CardSelectionContext  →  { selectedCardId, selectCard }
 *   CardFilterContext     →  { minAmount, setMinAmount }
 *
 * When the user types in the filter:
 *   minAmount changes → filterValue is a new reference → CardFilterContext
 *   notifies FilterSection and TransactionSection (correct).
 *
 *   selectedCardId is the same string, selectCard is the same useCallback
 *   reference → selectionValue useMemo returns the SAME object → CardSelectionContext
 *   does NOT notify → CardListSection does NOT re-render.
 *
 * The key insight: CardsPage itself never calls useSearchParams(), so it never
 * re-renders on URL changes. The JSX children it passes here are stable object
 * references, so React bails out on reconciling them when this provider
 * re-renders internally. Context notification is the only trigger left, and
 * it is gated per-context by the memoized values below.
 */
export function CardsStateProvider({
  children,
}: CardsStateProviderProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCardId = searchParams.get(CARD_ID_PARAM);
  const minAmount = searchParams.get(MIN_AMOUNT_PARAM) ?? "";

  // React Router does not guarantee setSearchParams is referentially stable
  // across renders. Storing it in a ref (updated synchronously each render)
  // lets selectCard and setMinAmount close over the ref instead — their
  // references never change, so selectionValue and filterValue useMemos
  // produce the same object on every render where the *data* is unchanged.
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  const selectCard = useCallback((cardId: string) => {
    setSearchParamsRef.current(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(CARD_ID_PARAM, cardId);
        next.delete(MIN_AMOUNT_PARAM); // reset filter on card change
        return next;
      },
      { replace: false }
    );
  }, []); // ← zero deps: always the same function reference

  const setMinAmount = useCallback((amount: string) => {
    setSearchParamsRef.current(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (amount === "") {
          next.delete(MIN_AMOUNT_PARAM);
        } else {
          next.set(MIN_AMOUNT_PARAM, amount);
        }
        return next;
      },
      { replace: true }
    );
  }, []); // ← zero deps: always the same function reference

  // Memoized separately so a minAmount change never changes selectionValue's
  // reference — CardSelectionContext consumers are skipped entirely.
  const selectionValue = useMemo<CardSelectionValue>(
    () => ({ selectedCardId, selectCard }),
    [selectedCardId, selectCard]
  );

  const filterValue = useMemo<CardFilterValue>(
    () => ({ minAmount, setMinAmount }),
    [minAmount, setMinAmount]
  );

  return (
    <CardSelectionContext.Provider value={selectionValue}>
      <CardFilterContext.Provider value={filterValue}>
        {children}
      </CardFilterContext.Provider>
    </CardSelectionContext.Provider>
  );
}
