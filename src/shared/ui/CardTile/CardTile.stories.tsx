import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { CardTileComponent } from "./CardTile";

const meta = {
  title: "Shared/CardTile",
  component: CardTileComponent,
  tags: ["autodocs"],
  args: {
    id: "card-1",
    description: "Private Card",
    type: "private" as const,
    cardHolder: "Max Mustermann",
    maskedCardNumber: "4242",
    expiryDate: "12/28",
    network: "Visa",
    isSelected: false,
    onSelect: fn(),
  },
} satisfies Meta<typeof CardTileComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const BusinessCard: Story = {
  args: {
    id: "card-2",
    description: "Business Card",
    type: "business" as const,
    maskedCardNumber: "8765",
    expiryDate: "09/27",
    isSelected: false,
  },
};

export const BusinessCardSelected: Story = {
  args: {
    id: "card-2",
    description: "Business Card",
    type: "business" as const,
    maskedCardNumber: "8765",
    expiryDate: "09/27",
    isSelected: true,
  },
};

export const SharedExpenseCard: Story = {
  args: {
    id: "card-3",
    description: "Shared Expense Card",
    type: "shared" as const,
    cardHolder: "DKB Code Factory GmbH",
    maskedCardNumber: "1357",
    expiryDate: "03/29",
    isSelected: false,
  },
};

export const SharedExpenseCardSelected: Story = {
  args: {
    id: "card-3",
    description: "Shared Expense Card",
    type: "shared" as const,
    cardHolder: "DKB Code Factory GmbH",
    maskedCardNumber: "1357",
    expiryDate: "03/29",
    isSelected: true,
  },
};

// ── Edge cases ───────────────────────────────────────────────────────────────

/** Verifies long cardholder names don't overflow the card layout. */
export const LongCardholderName: Story = {
  args: {
    cardHolder: "Dr. Hans-Joachim Müller-Weißenberger",
    description: "Private Card",
  },
};

/**
 * Verifies keyboard accessibility: Tab to focus, Enter to select.
 * Uses Storybook's interaction testing to simulate the full flow.
 */
export const KeyboardSelect: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button", { name: args.description });
    card.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenCalledWith(args.id);
  },
};
