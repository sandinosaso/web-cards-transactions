import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { cardsApi } from "@dkb-cofa/shared/api/cardsApi";

/**
 * API layer tests for cardsApi RTK Query endpoints.
 *
 * These tests verify the contract of the API module itself — specifically
 * that errors thrown by the ApiClient are normalised into RTK Query's
 * CUSTOM_ERROR shape before reaching any component.
 *
 * We do NOT test loading/success/error UI states here — that is covered
 * by the CardsPage integration tests. This layer tests the data contract.
 */

vi.mock("@dkb-cofa/ApiClient", () => ({
  getCards: vi.fn(),
  getTransactions: vi.fn(),
  CardNotFoundError: class CardNotFoundError extends Error {},
}));

// Import after mock so vi.fn() instances are in place
import { getCards, getTransactions } from "@dkb-cofa/ApiClient";

const makeStore = () =>
  configureStore({
    reducer: { [cardsApi.reducerPath]: cardsApi.reducer },
    middleware: (gDM) => gDM().concat(cardsApi.middleware),
  });

describe("cardsApi", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ─── getCards ──────────────────────────────────────────────────────────────

  describe("getCards", () => {
    it("returns card data when the ApiClient resolves", async () => {
      const mockCards = [
        {
          id: "card-1",
          description: "Private Card",
          type: "private" as const,
          cardHolder: "Max Mustermann",
          maskedCardNumber: "4242",
          expiryDate: "12/28",
          network: "Visa",
        },
      ];
      vi.mocked(getCards).mockResolvedValue(mockCards);

      const store = makeStore();
      const result = await store.dispatch(
        cardsApi.endpoints.getCards.initiate()
      );

      expect(result.data).toEqual(mockCards);
    });

    it("wraps ApiClient errors in a CUSTOM_ERROR", async () => {
      vi.mocked(getCards).mockRejectedValue(new Error("Network failure"));

      const store = makeStore();
      const result = await store.dispatch(
        cardsApi.endpoints.getCards.initiate()
      );

      expect(result.error).toMatchObject({
        status: "CUSTOM_ERROR",
        error: "Network failure",
      });
    });

    it("wraps non-Error throws in a CUSTOM_ERROR with 'Unknown error'", async () => {
      // Defensive: ApiClient could theoretically throw a non-Error value
      vi.mocked(getCards).mockRejectedValue("something strange");

      const store = makeStore();
      const result = await store.dispatch(
        cardsApi.endpoints.getCards.initiate()
      );

      expect(result.error).toMatchObject({
        status: "CUSTOM_ERROR",
        error: "Unknown error",
      });
    });
  });

  // ─── getTransactions ───────────────────────────────────────────────────────

  describe("getTransactions", () => {
    it("returns transaction data when the ApiClient resolves", async () => {
      const mockTransactions = [
        { id: "tx-1", description: "Coffee", amount: 4.5 },
      ];
      vi.mocked(getTransactions).mockResolvedValue(mockTransactions);

      const store = makeStore();
      const result = await store.dispatch(
        cardsApi.endpoints.getTransactions.initiate("card-1")
      );

      expect(result.data).toEqual(mockTransactions);
    });

    it("wraps ApiClient errors in a CUSTOM_ERROR", async () => {
      vi.mocked(getTransactions).mockRejectedValue(
        new Error("Card not found: card-99")
      );

      const store = makeStore();
      const result = await store.dispatch(
        cardsApi.endpoints.getTransactions.initiate("card-99")
      );

      expect(result.error).toMatchObject({
        status: "CUSTOM_ERROR",
        error: "Card not found: card-99",
      });
    });

    it("wraps non-Error throws in a CUSTOM_ERROR with 'Unknown error'", async () => {
      vi.mocked(getTransactions).mockRejectedValue(null);

      const store = makeStore();
      const result = await store.dispatch(
        cardsApi.endpoints.getTransactions.initiate("card-1")
      );

      expect(result.error).toMatchObject({
        status: "CUSTOM_ERROR",
        error: "Unknown error",
      });
    });
  });
});
