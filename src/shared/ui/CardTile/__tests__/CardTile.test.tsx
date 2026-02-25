import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@dkb-cofa/test/renderWithProviders";
import { CardTileComponent } from "@dkb-cofa/shared/ui/CardTile/CardTile";

const defaultProps = {
  id: "card-1",
  description: "Private Card",
  type: "private" as const,
  cardHolder: "Max Mustermann",
  maskedCardNumber: "4242",
  expiryDate: "12/28",
  network: "Visa",
  isSelected: false,
  onSelect: vi.fn(),
};

describe("CardTileComponent", () => {
  it("renders the card description", () => {
    renderWithProviders(<CardTileComponent {...defaultProps} />);
    expect(screen.getByText("Private Card")).toBeInTheDocument();
  });

  it("has role=button and is keyboard accessible", () => {
    renderWithProviders(<CardTileComponent {...defaultProps} />);
    const card = screen.getByRole("button", { name: "Private Card" });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("tabindex", "0");
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <CardTileComponent {...defaultProps} onSelect={onSelect} />
    );

    await user.click(screen.getByRole("button", { name: "Private Card" }));
    expect(onSelect).toHaveBeenCalledWith("card-1");
  });

  it("calls onSelect when Enter key is pressed", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <CardTileComponent {...defaultProps} onSelect={onSelect} />
    );

    const card = screen.getByRole("button", { name: "Private Card" });
    card.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("card-1");
  });

  it("calls onSelect when Space key is pressed", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <CardTileComponent {...defaultProps} onSelect={onSelect} />
    );

    const card = screen.getByRole("button", { name: "Private Card" });
    card.focus();
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledWith("card-1");
  });

  it("has aria-pressed=true when selected", () => {
    renderWithProviders(
      <CardTileComponent {...defaultProps} isSelected={true} />
    );
    expect(screen.getByRole("button", { name: "Private Card" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("has aria-pressed=false when not selected", () => {
    renderWithProviders(
      <CardTileComponent {...defaultProps} isSelected={false} />
    );
    expect(screen.getByRole("button", { name: "Private Card" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
