import type { Meta, StoryObj } from "@storybook/react";
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
    onSelect: () => undefined,
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
