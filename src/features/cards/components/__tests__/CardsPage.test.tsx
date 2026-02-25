import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@dkb-cofa/test/renderWithProviders";
import { CardsPage } from "@dkb-cofa/features/cards/components/CardsPage";

// Mock the ApiClient so tests are deterministic
vi.mock("@dkb-cofa/ApiClient", () => ({
  getCards: vi.fn().mockResolvedValue([
    {
      id: "card-1",
      description: "Private Card",
      type: "private",
      cardHolder: "Max Mustermann",
      maskedCardNumber: "4242",
      expiryDate: "12/28",
      network: "Visa",
    },
    {
      id: "card-2",
      description: "Business Card",
      type: "business",
      cardHolder: "Max Mustermann",
      maskedCardNumber: "8765",
      expiryDate: "09/27",
      network: "Visa",
    },
  ]),
  getTransactions: vi.fn().mockImplementation((cardId: string) => {
    if (cardId === "card-1") {
      return [
        { id: "tx-1", description: "Food", amount: 123.88 },
        { id: "tx-2", description: "Snack", amount: 33.48 },
      ];
    }
    if (cardId === "card-2") {
      return [
        { id: "tx-3", description: "Smart Phone", amount: 533.48 },
        { id: "tx-4", description: "Coffee", amount: 2.5 },
      ];
    }
    throw new Error("Not found");
  }),
  CardNotFoundError: class CardNotFoundError extends Error {},
}));

describe("CardsPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state initially", () => {
    renderWithProviders(<CardsPage />);
    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner
  });

  it("renders both cards after loading", async () => {
    renderWithProviders(<CardsPage />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Private Card" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Business Card" })
      ).toBeInTheDocument();
    });
  });

  it("shows transactions when a card is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CardsPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Private Card" })
    );

    await user.click(screen.getByRole("button", { name: "Private Card" }));

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Snack")).toBeInTheDocument();
    });
  });

  it("marks the selected card as pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CardsPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Private Card" })
    );

    await user.click(screen.getByRole("button", { name: "Private Card" }));

    expect(
      screen.getByRole("button", { name: "Private Card" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Business Card" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("filters transactions by minimum amount", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CardsPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Private Card" })
    );

    await user.click(screen.getByRole("button", { name: "Private Card" }));

    await waitFor(() => screen.getByText("Food"));

    const filterInput = screen.getByLabelText("Filter by minimum amount");
    await user.type(filterInput, "100");

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.queryByText("Snack")).not.toBeInTheDocument();
    });
  });

  it("resets filter when a different card is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CardsPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Private Card" })
    );

    // Select first card and set filter
    await user.click(screen.getByRole("button", { name: "Private Card" }));
    await waitFor(() => screen.getByText("Food"));

    const filterInput = screen.getByLabelText("Filter by minimum amount");
    await user.type(filterInput, "100");

    // Wait for the 400 ms debounce to flush so minAmount is written to the URL.
    // Once the filter is active, Snack (€33.48) is below the threshold and
    // disappears — that's our signal that the URL param is in place.
    // This is necessary because selectCard() uses a functional URLSearchParams
    // update: it can only delete minAmount if the param is already present.
    await waitFor(() => {
      expect(screen.queryByText("Snack")).not.toBeInTheDocument();
    });

    // Switch to second card — selectCard deletes minAmount from the URL,
    // which propagates back to AmountFilter as value="" and resets the input.
    await user.click(screen.getByRole("button", { name: "Business Card" }));

    await waitFor(() => {
      expect(filterInput).toHaveValue(null);
    });
  });

  it("shows empty state when no transactions match the filter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CardsPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Private Card" })
    );

    await user.click(screen.getByRole("button", { name: "Private Card" }));
    await waitFor(() => screen.getByText("Food"));

    const filterInput = screen.getByLabelText("Filter by minimum amount");
    await user.type(filterInput, "9999");

    await waitFor(() => {
      expect(
        screen.getByText("No transactions match your filter.")
      ).toBeInTheDocument();
    });
  });

  it("shows transactions of the new card when switching cards", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CardsPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: "Private Card" })
    );

    await user.click(screen.getByRole("button", { name: "Private Card" }));
    await waitFor(() => screen.getByText("Food"));

    await user.click(screen.getByRole("button", { name: "Business Card" }));

    await waitFor(() => {
      expect(screen.getByText("Smart Phone")).toBeInTheDocument();
      expect(screen.queryByText("Food")).not.toBeInTheDocument();
    });
  });
});
