import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Shared/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectCardPrompt: Story = {
  args: { message: "Select a card to view its transactions." },
};

export const NoTransactionsForCard: Story = {
  args: { message: "No transactions for this card." },
};

export const FilteredEmpty: Story = {
  args: { message: "No transactions match your filter." },
};
