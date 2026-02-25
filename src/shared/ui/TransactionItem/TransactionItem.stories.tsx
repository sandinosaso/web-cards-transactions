import type { Meta, StoryObj } from "@storybook/react";
import { TransactionItem } from "./TransactionItem";

const meta = {
  title: "Shared/TransactionItem",
  component: TransactionItem,
  tags: ["autodocs"],
  args: {
    description: "Coffee",
    amount: 4.99,
    backgroundColor: "#3b5bdb",
  },
} satisfies Meta<typeof TransactionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeAmount: Story = {
  args: { description: "Software License", amount: 1200.0 },
};

export const SmallAmount: Story = {
  args: { description: "Chocolate Bar", amount: 2.58 },
};

export const BusinessCardColor: Story = {
  args: {
    description: "Smart Phone",
    amount: 533.48,
    backgroundColor: "#2f9e44",
  },
};
