import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@dkb-cofa/test/renderWithProviders";
import { TransactionListSection } from "@dkb-cofa/features/cards/components/TransactionListSection";

/**
 * Isolation tests for TransactionListSection.
 *
 * TransactionListSection is a pure presentational–data component: it receives
 * cardId, cardType, and minAmount as props, fetches transactions via RTK Query,
 * filters them, and renders one of four states:
 *   loading → error → empty (no match) → list
 *
 * These tests verify each state in isolation. The full integration path
 * (card selection triggering a fetch and filter) is covered in CardsPage.test.tsx.
 * Here we own the props directly so tests are fast, deterministic, and focused.
 */

vi.mock("@dkb-cofa/ApiClient", () => ({
  getCards: vi.fn(),
  getTransactions: vi.fn(),
  CardNotFoundError: class CardNotFoundError extends Error {},
}));

import { getTransactions } from "@dkb-cofa/ApiClient";

const MOCK_TRANSACTIONS = [
  { id: "tx-1", description: "Coffee", amount: 4.5 },
  { id: "tx-2", description: "Smart Phone", amount: 533.48 },
  { id: "tx-3", description: "Groceries", amount: 75.0 },
];

const defaultProps = {
  cardId: "card-1",
  cardType: "private" as const,
  minAmount: "",
};

describe("TransactionListSection", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows a loading spinner while transactions are being fetched", () => {
    // Never resolve — keeps the component in the loading state
    vi.mocked(getTransactions).mockReturnValue(new Promise(() => undefined));

    renderWithProviders(<TransactionListSection {...defaultProps} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", async () => {
    vi.mocked(getTransactions).mockRejectedValue(new Error("Network error"));

    renderWithProviders(<TransactionListSection {...defaultProps} />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load transactions. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("renders a retry button in the error state", async () => {
    vi.mocked(getTransactions).mockRejectedValue(new Error("Network error"));

    renderWithProviders(<TransactionListSection {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });
  });

  it("re-fetches when the retry button is clicked after an error", async () => {
    const user = userEvent.setup();
    vi.mocked(getTransactions).mockRejectedValue(new Error("Network error"));

    renderWithProviders(<TransactionListSection {...defaultProps} />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Retry" })
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));

    // After retry the query is re-initiated — getTransactions called again
    expect(vi.mocked(getTransactions)).toHaveBeenCalledTimes(2);
  });

  it("renders all transactions when minAmount is empty", async () => {
    vi.mocked(getTransactions).mockResolvedValue(MOCK_TRANSACTIONS);

    renderWithProviders(<TransactionListSection {...defaultProps} minAmount="" />);

    await waitFor(() => {
      expect(screen.getByText("Coffee")).toBeInTheDocument();
      expect(screen.getByText("Smart Phone")).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });
  });

  it("filters out transactions below the minAmount threshold", async () => {
    vi.mocked(getTransactions).mockResolvedValue(MOCK_TRANSACTIONS);

    renderWithProviders(
      <TransactionListSection {...defaultProps} minAmount="100" />
    );

    await waitFor(() => {
      // Smart Phone (533.48) and Groceries (75.00 < 100 → filtered out),
      // Coffee (4.50 < 100 → filtered out)
      expect(screen.getByText("Smart Phone")).toBeInTheDocument();
      expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });

  it("shows the 'no match' empty state when no transactions meet the filter", async () => {
    vi.mocked(getTransactions).mockResolvedValue(MOCK_TRANSACTIONS);

    renderWithProviders(
      <TransactionListSection {...defaultProps} minAmount="9999" />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No transactions match your filter.")
      ).toBeInTheDocument();
    });
  });

  it("shows the 'no transactions for card' empty state when the list is empty and no filter is set", async () => {
    vi.mocked(getTransactions).mockResolvedValue([]);

    renderWithProviders(<TransactionListSection {...defaultProps} minAmount="" />);

    await waitFor(() => {
      expect(
        screen.getByText("No transactions for this card.")
      ).toBeInTheDocument();
    });
  });

  it("renders the section with the correct accessible label", async () => {
    vi.mocked(getTransactions).mockResolvedValue(MOCK_TRANSACTIONS);

    renderWithProviders(<TransactionListSection {...defaultProps} />);

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: "Transactions" })
      ).toBeInTheDocument();
    });
  });
});
